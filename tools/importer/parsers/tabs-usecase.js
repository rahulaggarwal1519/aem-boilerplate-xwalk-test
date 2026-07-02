/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-usecase. Base: tabs.
 * Source: https://mongodb.com/ (.vddp__experiment-wrapper)
 * Generated: 2026-07-01
 *
 * Block library: 2 columns, multiple rows.
 *   Row 1: block name (createBlock adds this)
 *   Each subsequent row = one tab: cell1 = Tab Label, cell2 = Tab Content.
 *
 * UE item model (tabs-usecase-item):
 *   title            -> tab label   (cell 1)
 *   content_heading  -> heading     (cell 2, grouped)
 *   content_image    -> image       (cell 2, grouped)
 *   content_richtext -> richtext    (cell 2, grouped)
 *   content_headingType -> collapsed (H3..H6), no hint
 *
 * MongoDB lazy-mounts only the active tab panel, so only the "Vector Search"
 * panel content is in static HTML. The other 7 tabs get their label with an
 * empty content cell (authors fill content later in UE).
 */
export default function parse(element, { document }) {
  // All tab labels (buttons in the tablist)
  const tabButtons = Array.from(
    element.querySelectorAll('[role="tab"], .vddp__tab, [class*="tab"]:not([class*="tabs"]):not([class*="tabpanel"])'),
  ).filter((b) => b.tagName === 'BUTTON' || b.getAttribute('role') === 'tab');

  // The single rendered (active) tab panel content
  const panel = element.querySelector('[role="tabpanel"], .vddp__experiment, [class*="tabpanel"]');

  // Empty-block guard
  if (!tabButtons.length && !panel) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  tabButtons.forEach((btn, index) => {
    const label = (btn.textContent || '').trim();

    // Cell 1: tab label -> field:title
    const labelFrag = document.createDocumentFragment();
    labelFrag.appendChild(document.createComment(' field:title '));
    const labelP = document.createElement('p');
    labelP.textContent = label;
    labelFrag.appendChild(labelP);

    // Cell 2: tab content. Only the first (active) tab has rendered content.
    let contentCell = '';
    if (index === 0 && panel) {
      const heading = panel.querySelector('.vddp__left-title, [class*="left-title"], h1, h2, h3, h4, h5, h6');
      const description = panel.querySelector('.vddp__left-description, [class*="left-description"], p:not([class*="title"])');
      const image = panel.querySelector('img[src]:not([src=""])');
      const ctaLinks = Array.from(panel.querySelectorAll('.vddp__btns-container a, [class*="btns-container"] a, a.vddp__cta-primary, a[class*="cta"], a[class*="button"]'));

      const contentFrag = document.createDocumentFragment();

      // content_heading -> promote left-title to a heading element
      if (heading) {
        contentFrag.appendChild(document.createComment(' field:content_heading '));
        const h = document.createElement('h3');
        h.textContent = (heading.textContent || '').trim();
        contentFrag.appendChild(h);
      }

      // content_image -> only if a real image src is present (illustration loads at runtime)
      if (image && image.getAttribute('src')) {
        contentFrag.appendChild(document.createComment(' field:content_image '));
        contentFrag.appendChild(image);
      }

      // content_richtext -> description + CTA links
      contentFrag.appendChild(document.createComment(' field:content_richtext '));
      if (description) contentFrag.appendChild(description);
      ctaLinks.forEach((a) => {
        const p = document.createElement('p');
        p.appendChild(a);
        contentFrag.appendChild(p);
      });

      contentCell = contentFrag;
    }

    cells.push([labelFrag, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-usecase', cells });
  element.replaceWith(block);
}
