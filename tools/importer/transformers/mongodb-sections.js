/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: MongoDB section breaks + Section Metadata.
 * Runs in afterTransform only. Reads sections from payload.template.sections
 * and, for each section, inserts an <hr> before it (except the first) and a
 * Section Metadata block (when the section has a `style`).
 *
 * Section anchor selectors come from tools/importer/page-templates.json and are
 * all verified present in migration-work/cleaned.html:
 *   .p13n-hp-hero (line 789), .vddp__top (line 2000),
 *   .exp-carousel (line 2068), .p13n-trust-logos (line 868),
 *   .animate-partner-carousel (line 1763), .exp-pathfinder (line 2209).
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

/**
 * Resolve the first element in the DOM matching any selector for a section.
 * @param {Element} root scope to search within
 * @param {string|string[]} selector one or more candidate selectors
 * @returns {Element|null}
 */
function findSectionElement(root, selector) {
  const selectors = Array.isArray(selector) ? selector : [selector];
  for (const sel of selectors) {
    if (!sel) continue;
    const el = root.querySelector(sel);
    if (el) return el;
  }
  return null;
}

export default function transform(hookName, element, payload) {
  if (hookName !== TransformHook.afterTransform) return;

  const template = payload && payload.template;
  const sections = template && template.sections;
  if (!Array.isArray(sections) || sections.length < 2) return;

  const document = element.ownerDocument;

  // Process in reverse so earlier insertions don't shift later anchor lookups.
  for (let i = sections.length - 1; i >= 0; i -= 1) {
    const section = sections[i];
    const sectionEl = findSectionElement(element, section.selector);
    if (!sectionEl) continue;

    // Section Metadata block (only when a style is defined for the section).
    if (section.style) {
      const metadataBlock = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      // Place metadata at the end of the section's content.
      sectionEl.append(metadataBlock);
    }

    // Section break before every section except the first.
    if (i > 0) {
      sectionEl.before(document.createElement('hr'));
    }
  }
}
