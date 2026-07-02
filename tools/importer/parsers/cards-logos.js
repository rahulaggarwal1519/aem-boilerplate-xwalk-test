/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-logos. Base: cards.
 * Source: https://mongodb.com/ (.p13n-trust-logos)
 * Generated: 2026-07-01
 *
 * Block library: container, 2 columns.
 *   Row 1: block name (createBlock adds this)
 *   Each subsequent row = one logo card:
 *     cell 1: Image/Icon  -> field:image (the customer/partner logo)
 *     cell 2: Text content -> field:text (optional "Case Study" link;
 *             empty cell with no hint when the logo is not linked)
 *
 * Each item is a logo image. Some items are wrapped in a case-study <a> link
 * (with a "Case Study" label); those become a CTA link in cell 2.
 */
export default function parse(element, { document }) {
  const itemEls = Array.from(element.querySelectorAll('.trust-logo-item, [class*="logo-item"]'));

  // Empty-block guard
  if (!itemEls.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  itemEls.forEach((item) => {
    // Cell 1: logo image -> field:image
    const image = item.querySelector('img[src]:not([src=""]), picture');
    let imageCell = '';
    if (image) {
      const imgFrag = document.createDocumentFragment();
      imgFrag.appendChild(document.createComment(' field:image '));
      imgFrag.appendChild(image);
      imageCell = imgFrag;
    }

    // Cell 2: optional case-study link -> field:text
    // The item itself may be the anchor, or contain one.
    const anchor = item.tagName === 'A' ? item : item.querySelector('a[href]');
    let textCell = '';
    if (anchor && anchor.getAttribute('href')) {
      const linkLabelEl = item.querySelector('.trust-logo-link, [class*="logo-link"]');
      const linkText = (linkLabelEl && linkLabelEl.textContent.trim()) || (anchor.textContent || '').trim() || 'Case Study';
      const link = document.createElement('a');
      link.setAttribute('href', anchor.getAttribute('href'));
      link.textContent = linkText;

      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(' field:text '));
      const p = document.createElement('p');
      p.appendChild(link);
      textFrag.appendChild(p);
      textCell = textFrag;
    }

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-logos', cells });
  element.replaceWith(block);
}
