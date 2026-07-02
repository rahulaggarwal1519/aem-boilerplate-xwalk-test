/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-platform. Base: hero.
 * Source: https://mongodb.com/ (.p13n-hp-hero .hero-top-wrapper)
 * Generated: 2026-07-01
 *
 * Block library: 1 column, up to 3 rows.
 *   Row 1: block name (createBlock adds this)
 *   Row 2: Background Image (optional) -> UE field:image
 *   Row 3: Text content (Title/Subheading/CTA) -> UE field:text (richtext)
 *
 * Source has NO background image (hero image loads at runtime), so the image
 * row is omitted. The text cell holds: promo banner, H1 headline (with a
 * highlighted second line), and the description paragraph.
 */
export default function parse(element, { document }) {
  // Optional background image (not present in static source, but handle if it appears)
  const bgImage = element.querySelector('img[class*="background"], img[class*="hero-bg"], picture img');

  // Promo banner above the headline
  const promoBanner = element.querySelector('.p13n-promo-banner, [class*="promo-banner"]');

  // Headline (H1) — may include a <br> and highlighted second line span
  const heading = element.querySelector('h1, .hero-title, [class*="hero-title"]');

  // Description paragraph(s)
  const description = element.querySelector('.hero-description, [class*="hero-description"]');

  // Empty-block guard: bail gracefully if there is no meaningful content
  if (!heading && !description && !promoBanner) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2 (optional): background image -> field:image
  if (bgImage) {
    const imageFrag = document.createDocumentFragment();
    imageFrag.appendChild(document.createComment(' field:image '));
    imageFrag.appendChild(bgImage);
    cells.push([imageFrag]);
  }

  // Row 3: text content -> field:text (richtext holds banner + heading + description)
  const textFrag = document.createDocumentFragment();
  textFrag.appendChild(document.createComment(' field:text '));
  if (promoBanner) textFrag.appendChild(promoBanner);
  if (heading) textFrag.appendChild(heading);
  if (description) textFrag.appendChild(description);
  cells.push([textFrag]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-platform', cells });
  element.replaceWith(block);
}
