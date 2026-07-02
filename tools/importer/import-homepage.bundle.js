/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-platform.js
  function parse(element, { document }) {
    const bgImage = element.querySelector('img[class*="background"], img[class*="hero-bg"], picture img');
    const promoBanner = element.querySelector('.p13n-promo-banner, [class*="promo-banner"]');
    const heading = element.querySelector('h1, .hero-title, [class*="hero-title"]');
    const description = element.querySelector('.hero-description, [class*="hero-description"]');
    if (!heading && !description && !promoBanner) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (bgImage) {
      const imageFrag = document.createDocumentFragment();
      imageFrag.appendChild(document.createComment(" field:image "));
      imageFrag.appendChild(bgImage);
      cells.push([imageFrag]);
    }
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(" field:text "));
    if (promoBanner) textFrag.appendChild(promoBanner);
    if (heading) textFrag.appendChild(heading);
    if (description) textFrag.appendChild(description);
    cells.push([textFrag]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-platform", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-usecase.js
  function parse2(element, { document }) {
    const tabButtons = Array.from(
      element.querySelectorAll('[role="tab"], .vddp__tab, [class*="tab"]:not([class*="tabs"]):not([class*="tabpanel"])')
    ).filter((b) => b.tagName === "BUTTON" || b.getAttribute("role") === "tab");
    const panel = element.querySelector('[role="tabpanel"], .vddp__experiment, [class*="tabpanel"]');
    if (!tabButtons.length && !panel) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    tabButtons.forEach((btn, index) => {
      const label = (btn.textContent || "").trim();
      const labelFrag = document.createDocumentFragment();
      labelFrag.appendChild(document.createComment(" field:title "));
      const labelP = document.createElement("p");
      labelP.textContent = label;
      labelFrag.appendChild(labelP);
      let contentCell = "";
      if (index === 0 && panel) {
        const heading = panel.querySelector('.vddp__left-title, [class*="left-title"], h1, h2, h3, h4, h5, h6');
        const description = panel.querySelector('.vddp__left-description, [class*="left-description"], p:not([class*="title"])');
        const image = panel.querySelector('img[src]:not([src=""])');
        const ctaLinks = Array.from(panel.querySelectorAll('.vddp__btns-container a, [class*="btns-container"] a, a.vddp__cta-primary, a[class*="cta"], a[class*="button"]'));
        const contentFrag = document.createDocumentFragment();
        if (heading) {
          contentFrag.appendChild(document.createComment(" field:content_heading "));
          const h = document.createElement("h3");
          h.textContent = (heading.textContent || "").trim();
          contentFrag.appendChild(h);
        }
        if (image && image.getAttribute("src")) {
          contentFrag.appendChild(document.createComment(" field:content_image "));
          contentFrag.appendChild(image);
        }
        contentFrag.appendChild(document.createComment(" field:content_richtext "));
        if (description) contentFrag.appendChild(description);
        ctaLinks.forEach((a) => {
          const p = document.createElement("p");
          p.appendChild(a);
          contentFrag.appendChild(p);
        });
        contentCell = contentFrag;
      }
      cells.push([labelFrag, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-usecase", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-deploy.js
  function parse3(element, { document }) {
    const cardEls = Array.from(element.querySelectorAll('.bnr__card, [class*="card"][class*="slide"], .keen-slider__slide'));
    if (!cardEls.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cardEls.forEach((card) => {
      const image = card.querySelector('img[src]:not([src=""]), picture');
      let imageCell = "";
      if (image) {
        const imgFrag = document.createDocumentFragment();
        imgFrag.appendChild(document.createComment(" field:image "));
        imgFrag.appendChild(image);
        imageCell = imgFrag;
      }
      const title = card.querySelector('.bnr__card-title, [class*="card-title"], h1, h2, h3, h4, h5, h6');
      const description = card.querySelector('.bnr__card-description, [class*="card-description"], p');
      const ctaLinks = Array.from(card.querySelectorAll("a"));
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(" field:text "));
      if (title) textFrag.appendChild(title);
      if (description) textFrag.appendChild(description);
      ctaLinks.forEach((a) => {
        const p = document.createElement("p");
        p.appendChild(a);
        textFrag.appendChild(p);
      });
      cells.push([imageCell, textFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-deploy", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-logos.js
  function parse4(element, { document }) {
    const itemEls = Array.from(element.querySelectorAll('.trust-logo-item, [class*="logo-item"]'));
    if (!itemEls.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    itemEls.forEach((item) => {
      const image = item.querySelector('img[src]:not([src=""]), picture');
      let imageCell = "";
      if (image) {
        const imgFrag = document.createDocumentFragment();
        imgFrag.appendChild(document.createComment(" field:image "));
        imgFrag.appendChild(image);
        imageCell = imgFrag;
      }
      const anchor = item.tagName === "A" ? item : item.querySelector("a[href]");
      let textCell = "";
      if (anchor && anchor.getAttribute("href")) {
        const linkLabelEl = item.querySelector('.trust-logo-link, [class*="logo-link"]');
        const linkText = linkLabelEl && linkLabelEl.textContent.trim() || (anchor.textContent || "").trim() || "Case Study";
        const link = document.createElement("a");
        link.setAttribute("href", anchor.getAttribute("href"));
        link.textContent = linkText;
        const textFrag = document.createDocumentFragment();
        textFrag.appendChild(document.createComment(" field:text "));
        const p = document.createElement("p");
        p.appendChild(link);
        textFrag.appendChild(p);
        textCell = textFrag;
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-logos", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-cta.js
  function parse5(element, { document }) {
    let leftCol = element.querySelector('.pf__card-left, [class*="card-left"]');
    let rightCol = element.querySelector('.pf__card-right, [class*="card-right"]');
    if (!leftCol && !rightCol) {
      const kids = Array.from(element.children).filter((c) => {
        const t = (c.textContent || "").trim();
        return t && !/^your ai data platform is ready$/i.test(t);
      });
      const wrapper = kids.find((c) => c.querySelector("a")) || element;
      const cols = Array.from(wrapper.children).filter((c) => (c.textContent || "").trim());
      if (cols.length >= 2) {
        [leftCol, rightCol] = cols;
      } else if (cols.length === 1) {
        leftCol = cols[0];
      }
    }
    if (!leftCol && !rightCol) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const leftCell = [];
    if (leftCol) {
      const subtitle = leftCol.querySelector('.pf__subtitle, [class*="subtitle"]');
      const title = leftCol.querySelector('.pf__card-title, [class*="card-title"]');
      const description = leftCol.querySelector('.pf__description, [class*="description"]');
      const button = leftCol.querySelector('.pf__button, a[class*="button"], a[href]');
      const image = leftCol.querySelector('img[src]:not([src=""]), picture');
      if (subtitle) leftCell.push(subtitle);
      if (title) leftCell.push(title);
      if (description) leftCell.push(description);
      if (button) {
        const p = document.createElement("p");
        p.appendChild(button);
        leftCell.push(p);
      }
      if (image) leftCell.push(image);
      if (leftCell.length === 0) {
        leftCol.querySelectorAll("svg, button[aria-label]").forEach((n) => n.remove());
        Array.from(leftCol.querySelectorAll("h1,h2,h3,h4,h5,h6,p,a[href],picture,img[src]")).forEach((n) => {
          if (n.closest("a[href]") && n.tagName !== "A") return;
          leftCell.push(n);
        });
      }
    }
    const rightCell = [];
    if (rightCol) {
      const subtitle = rightCol.querySelector('.pf__subtitle, [class*="subtitle"]');
      if (subtitle) rightCell.push(subtitle);
      const links = Array.from(rightCol.querySelectorAll('.pf__link a, [class*="link"] a, a[href]'));
      if (links.length) {
        const list = document.createElement("ul");
        links.forEach((a) => {
          a.querySelectorAll("img, svg").forEach((icon) => icon.remove());
          const li = document.createElement("li");
          const link = document.createElement("a");
          link.setAttribute("href", a.getAttribute("href"));
          link.textContent = (a.textContent || "").trim();
          li.appendChild(link);
          list.appendChild(li);
        });
        rightCell.push(list);
      }
    }
    if (leftCell.length === 0 && rightCell.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cells.push([leftCell, rightCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-cta", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/mongodb-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "div.relative.z-\\[9999\\].w-full",
        // promo announcement banner (line 4)
        "#universal-nav",
        // global site header + navigation (line 38)
        "#onetrust-consent-sdk",
        // OneTrust cookie consent dialog
        ".ot-sdk-container",
        // OneTrust container fallback
        "#intercom-container",
        // Intercom messenger widget
        "script",
        // inline/third-party scripts (not authorable)
        "style"
        // inline styles
      ]);
      const trackingHosts = ["usbrowserspeed.com", "dpmsrv.com", "evs.blue.mongodb.com", "doubleclick", "facebook.com/tr", "google-analytics", "googletagmanager"];
      element.querySelectorAll("img[src], img[data-src]").forEach((img) => {
        const src = img.getAttribute("src") || img.getAttribute("data-src") || "";
        if (trackingHosts.some((h) => src.includes(h))) img.remove();
      });
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "footer",
        // global site footer
        ".manage-cookies",
        // cookie management link
        ".privacy-choices",
        "iframe",
        // tracking/experimentation frames incl. Optimizely
        "noscript",
        "link",
        "style",
        "script"
      ]);
      const trackingHosts = [
        "usbrowserspeed.com",
        "dpmsrv.com",
        "evs.blue.mongodb.com",
        "doubleclick",
        "facebook.com/tr",
        "google-analytics",
        "googletagmanager",
        "googleadservices.com",
        "bat.bing.com",
        "adnxs.com",
        "mathtag.com",
        "adsrvr.org",
        "trkn.us",
        "cookielaw.org",
        "intercomcdn.com",
        "mktoresp.com",
        "demdex.net",
        "everesttech.net",
        "pixel."
      ];
      element.querySelectorAll("img[src], img[data-src]").forEach((img) => {
        const src = img.getAttribute("src") || img.getAttribute("data-src") || "";
        if (trackingHosts.some((h) => src.includes(h))) {
          const pic = img.closest("picture");
          (pic || img).remove();
        }
      });
      [...element.querySelectorAll("p")].forEach((p) => {
        const t = (p.textContent || "").trim();
        if (t.startsWith("This website uses cookies") || t === "Manage Cookies Accept Cookies") {
          p.remove();
        }
      });
    }
  }

  // tools/importer/transformers/mongodb-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function findSectionElement(root, selector) {
    const selectors = Array.isArray(selector) ? selector : [selector];
    for (const sel of selectors) {
      if (!sel) continue;
      const el = root.querySelector(sel);
      if (el) return el;
    }
    return null;
  }
  function transform2(hookName, element, payload) {
    if (hookName !== TransformHook2.afterTransform) return;
    const template = payload && payload.template;
    const sections = template && template.sections;
    if (!Array.isArray(sections) || sections.length < 2) return;
    const document = element.ownerDocument;
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      const sectionEl = findSectionElement(element, section.selector);
      if (!sectionEl) continue;
      if (section.style) {
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        sectionEl.append(metadataBlock);
      }
      if (i > 0) {
        sectionEl.before(document.createElement("hr"));
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-platform": parse,
    "tabs-usecase": parse2,
    "cards-deploy": parse3,
    "cards-logos": parse4,
    "columns-cta": parse5
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "MongoDB homepage - hero, tabbed use cases, deployment cards, customer logos, tech stack logos, and final CTA",
    urls: ["https://mongodb.com/"],
    blocks: [
      { name: "hero-platform", instances: [".p13n-hp-hero .hero-top-wrapper", ".p13n-hp-hero"] },
      { name: "tabs-usecase", instances: [".vddp__experiment-wrapper", ".vddp__experiment"] },
      { name: "cards-deploy", instances: [".bnr .bnr__inner", ".exp-carousel .bnr"] },
      { name: "cards-logos", instances: [".p13n-trust-logos"] },
      { name: "columns-cta", instances: [".exp-pathfinder .pf__section", ".exp-pathfinder"] }
    ],
    sections: [
      { id: "section-1-hero", name: "Hero", selector: [".p13n-hp-hero", ".relative.overflow-hidden"], style: null, blocks: ["hero-platform"], defaultContent: [] },
      { id: "section-2-atlas-usecases", name: "MongoDB Atlas use cases", selector: [".vddp__top", ".vddp__experiment-wrapper"], style: "dark", blocks: ["tabs-usecase"], defaultContent: [".vddp__left-title"] },
      { id: "section-3-deploy", name: "Deploy Your Way", selector: [".exp-carousel", ".bnr"], style: "dark", blocks: ["cards-deploy"], defaultContent: [".bnr__title-gradient"] },
      { id: "section-4-loved", name: "Loved by builders, trusted by enterprises", selector: [".p13n-trust-logos"], style: "light", blocks: ["cards-logos"], defaultContent: [] },
      { id: "section-5-techstack", name: "Works seamlessly with your tech stack", selector: [".animate-partner-carousel"], style: "light", blocks: ["cards-logos"], defaultContent: [] },
      { id: "section-6-final-cta", name: "Your AI Data Platform is Ready", selector: [".exp-pathfinder", ".pf__section"], style: "light", blocks: ["columns-cta"], defaultContent: [".pf__title"] }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    const seen = /* @__PURE__ */ new Set();
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
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
