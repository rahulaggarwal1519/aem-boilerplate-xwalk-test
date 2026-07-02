/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-cta. Base: columns.
 * Source: https://mongodb.com/ (.exp-pathfinder .pf__section)
 * Generated: 2026-07-01
 *
 * Block library: Columns block. Multiple columns / rows.
 *   Row 1: block name (createBlock adds this)
 *   Row 2: one cell per column (2 columns here).
 *
 * NOTE: Columns blocks do NOT use field:* hints (per hinting rules) — cells
 * hold plain default content (text, images, buttons, links).
 *
 * Left column: dark CTA card — subtitle, title, description, "Get Started"
 *   button, and image.
 * Right column: resource link list — subtitle + links (Atlas Learning Hub,
 *   Docs, MongoDB University, Pricing).
 *
 * The .pf__title ("Your AI Data Platform is Ready") is section-level default
 * content, not part of the block, so it is excluded here.
 */
export default function parse(element, { document }) {
  let leftCol = element.querySelector('.pf__card-left, [class*="card-left"]');
  let rightCol = element.querySelector('.pf__card-right, [class*="card-right"]');

  // Fallback: personalization sometimes renders the pathfinder without the
  // pf__card-left/right wrappers. Split direct children into two columns:
  // the left promo panel (contains an image and/or a primary button) and the
  // right resource-link list (a bare list of links).
  if (!leftCol && !rightCol) {
    const kids = Array.from(element.children).filter((c) => {
      const t = (c.textContent || '').trim();
      // skip the section title "Your AI Data Platform is Ready"
      return t && !/^your ai data platform is ready$/i.test(t);
    });
    const wrapper = kids.find((c) => c.querySelector('a')) || element;
    const cols = Array.from(wrapper.children).filter((c) => (c.textContent || '').trim());
    if (cols.length >= 2) {
      [leftCol, rightCol] = cols;
    } else if (cols.length === 1) {
      leftCol = cols[0];
    }
  }

  // Empty-block guard
  if (!leftCol && !rightCol) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Left column cell — subtitle, title, description, CTA button, image
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
      const p = document.createElement('p');
      p.appendChild(button);
      leftCell.push(p);
    }
    if (image) leftCell.push(image);

    // Fallback: personalized renders use different inner classes. If nothing
    // specific matched, capture the column's own text/links/images in order.
    if (leftCell.length === 0) {
      leftCol.querySelectorAll('svg, button[aria-label]').forEach((n) => n.remove());
      Array.from(leftCol.querySelectorAll('h1,h2,h3,h4,h5,h6,p,a[href],picture,img[src]')).forEach((n) => {
        if (n.closest('a[href]') && n.tagName !== 'A') return; // avoid dup of link inner
        leftCell.push(n);
      });
    }
  }

  // Right column cell — subtitle + resource links
  const rightCell = [];
  if (rightCol) {
    const subtitle = rightCol.querySelector('.pf__subtitle, [class*="subtitle"]');
    if (subtitle) rightCell.push(subtitle);

    const links = Array.from(rightCol.querySelectorAll('.pf__link a, [class*="link"] a, a[href]'));
    if (links.length) {
      const list = document.createElement('ul');
      links.forEach((a) => {
        // Strip decorative chevron/arrow icons so only the link text remains
        a.querySelectorAll('img, svg').forEach((icon) => icon.remove());
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.setAttribute('href', a.getAttribute('href'));
        link.textContent = (a.textContent || '').trim();
        li.appendChild(link);
        list.appendChild(li);
      });
      rightCell.push(list);
    }
  }

  // If extraction yielded nothing (personalized render served an empty
  // pathfinder shell at import time, with the real content elsewhere in the
  // DOM), unwrap rather than emit an empty block.
  if (leftCell.length === 0 && rightCell.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  cells.push([leftCell, rightCell]); // Row 2: two columns

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-cta', cells });
  element.replaceWith(block);
}
