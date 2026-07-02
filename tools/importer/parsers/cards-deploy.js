/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-deploy. Base: cards.
 * Source: https://mongodb.com/ (.bnr .bnr__inner)
 * Generated: 2026-07-01
 *
 * Block library: container, 2 columns.
 *   Row 1: block name (createBlock adds this)
 *   Each subsequent row = one card:
 *     cell 1: Image/Icon  -> field:image (empty cell if absent, no hint)
 *     cell 2: Text content -> field:text (richtext: title heading, description, CTA)
 *
 * The 4 deployment cards have no image (title + description + "Learn More" CTA
 * only), so cell 1 is left empty. The .bnr__left intro (Deploy Your Way) is
 * section-level default content, not a card, so it is excluded here.
 */
export default function parse(element, { document }) {
  const cardEls = Array.from(element.querySelectorAll('.bnr__card, [class*="card"][class*="slide"], .keen-slider__slide'));

  // Empty-block guard
  if (!cardEls.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  cardEls.forEach((card) => {
    // Cell 1: optional image/icon
    const image = card.querySelector('img[src]:not([src=""]), picture');
    let imageCell = '';
    if (image) {
      const imgFrag = document.createDocumentFragment();
      imgFrag.appendChild(document.createComment(' field:image '));
      imgFrag.appendChild(image);
      imageCell = imgFrag;
    }

    // Cell 2: text content -> field:text
    const title = card.querySelector('.bnr__card-title, [class*="card-title"], h1, h2, h3, h4, h5, h6');
    const description = card.querySelector('.bnr__card-description, [class*="card-description"], p');
    const ctaLinks = Array.from(card.querySelectorAll('a'));

    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));
    if (title) textFrag.appendChild(title);
    if (description) textFrag.appendChild(description);
    ctaLinks.forEach((a) => {
      const p = document.createElement('p');
      p.appendChild(a);
      textFrag.appendChild(p);
    });

    cells.push([imageCell, textFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-deploy', cells });
  element.replaceWith(block);
}
