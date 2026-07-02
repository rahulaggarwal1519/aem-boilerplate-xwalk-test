/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroPlatformParser from './parsers/hero-platform.js';
import tabsUsecaseParser from './parsers/tabs-usecase.js';
import cardsDeployParser from './parsers/cards-deploy.js';
import cardsLogosParser from './parsers/cards-logos.js';
import columnsCtaParser from './parsers/columns-cta.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/mongodb-cleanup.js';
import sectionsTransformer from './transformers/mongodb-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-platform': heroPlatformParser,
  'tabs-usecase': tabsUsecaseParser,
  'cards-deploy': cardsDeployParser,
  'cards-logos': cardsLogosParser,
  'columns-cta': columnsCtaParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'MongoDB homepage - hero, tabbed use cases, deployment cards, customer logos, tech stack logos, and final CTA',
  urls: ['https://mongodb.com/'],
  blocks: [
    { name: 'hero-platform', instances: ['.p13n-hp-hero .hero-top-wrapper', '.p13n-hp-hero'] },
    { name: 'tabs-usecase', instances: ['.vddp__experiment-wrapper', '.vddp__experiment'] },
    { name: 'cards-deploy', instances: ['.bnr .bnr__inner', '.exp-carousel .bnr'] },
    { name: 'cards-logos', instances: ['.p13n-trust-logos'] },
    { name: 'columns-cta', instances: ['.exp-pathfinder .pf__section', '.exp-pathfinder'] },
  ],
  sections: [
    { id: 'section-1-hero', name: 'Hero', selector: ['.p13n-hp-hero', '.relative.overflow-hidden'], style: null, blocks: ['hero-platform'], defaultContent: [] },
    { id: 'section-2-atlas-usecases', name: 'MongoDB Atlas use cases', selector: ['.vddp__top', '.vddp__experiment-wrapper'], style: 'dark', blocks: ['tabs-usecase'], defaultContent: ['.vddp__left-title'] },
    { id: 'section-3-deploy', name: 'Deploy Your Way', selector: ['.exp-carousel', '.bnr'], style: 'dark', blocks: ['cards-deploy'], defaultContent: ['.bnr__title-gradient'] },
    { id: 'section-4-loved', name: 'Loved by builders, trusted by enterprises', selector: ['.p13n-trust-logos'], style: 'light', blocks: ['cards-logos'], defaultContent: [] },
    { id: 'section-5-techstack', name: 'Works seamlessly with your tech stack', selector: ['.animate-partner-carousel'], style: 'light', blocks: ['cards-logos'], defaultContent: [] },
    { id: 'section-6-final-cta', name: 'Your AI Data Platform is Ready', selector: ['.exp-pathfinder', '.pf__section'], style: 'light', blocks: ['columns-cta'], defaultContent: ['.pf__title'] },
  ],
};

// TRANSFORMER REGISTRY - cleanup first, then sections (afterTransform)
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration.
 * Uses the first matching selector per block to avoid duplicate parsing of
 * union selectors that resolve to the same DOM region.
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  const seen = new Set();
  template.blocks.forEach((blockDef) => {
    for (const selector of blockDef.instances) {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) continue;
      elements.forEach((element) => {
        if (seen.has(element)) return;
        seen.add(element);
        pageBlocks.push({ name: blockDef.name, selector, element, section: blockDef.section || null });
      });
    }
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    // 1. beforeTransform cleanup
    executeTransformers('beforeTransform', main, payload);

    // 2. Discover blocks
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block (skip elements already replaced)
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform cleanup + section breaks/metadata
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index',
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
