/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: MongoDB site-wide cleanup.
 * Removes non-authorable page chrome (promo banner, global header/nav, footer,
 * cookie controls, tracking iframes) from https://mongodb.com/.
 * All selectors verified against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Elements that sit above the authorable content and would confuse block
    // parsing / section boundaries. Verified in cleaned.html:
    //   line 4:  <div class="relative z-[9999] w-full"> promo announcement banner
    //   line 38: <div id="universal-nav" ...> global sticky header + <nav>
    // NOTE: bare `nav` is intentionally NOT used — there is a second in-hero
    // swiper <nav> (cleaned.html line 786) inside .p13n-hp-hero that is authorable.
    WebImporter.DOMUtils.remove(element, [
      'div.relative.z-\\[9999\\].w-full', // promo announcement banner (line 4)
      '#universal-nav', // global site header + navigation (line 38)
      '#onetrust-consent-sdk', // OneTrust cookie consent dialog
      '.ot-sdk-container', // OneTrust container fallback
      '#intercom-container', // Intercom messenger widget
      'script', // inline/third-party scripts (not authorable)
      'style', // inline styles
    ]);
    // Remove analytics/tracking pixel images. Their query-string URLs contain
    // characters (e.g. "[1164]") that break WebImporter.rules.adjustImageUrls
    // when it compiles the src into a RegExp. Match by known tracking hosts.
    const trackingHosts = ['usbrowserspeed.com', 'dpmsrv.com', 'evs.blue.mongodb.com', 'doubleclick', 'facebook.com/tr', 'google-analytics', 'googletagmanager'];
    element.querySelectorAll('img[src], img[data-src]').forEach((img) => {
      const src = img.getAttribute('src') || img.getAttribute('data-src') || '';
      if (trackingHosts.some((h) => src.includes(h))) img.remove();
    });
  }
  if (hookName === TransformHook.afterTransform) {
    // Non-authorable global chrome and leftover technical elements.
    WebImporter.DOMUtils.remove(element, [
      'footer', // global site footer
      '.manage-cookies', // cookie management link
      '.privacy-choices',
      'iframe', // tracking/experimentation frames incl. Optimizely
      'noscript',
      'link',
      'style',
      'script',
    ]);

    // Remove analytics/tracking/ad pixel images that render after parsing.
    // Their query-string URLs also break WebImporter's image-URL RegExp step.
    const trackingHosts = [
      'usbrowserspeed.com', 'dpmsrv.com', 'evs.blue.mongodb.com',
      'doubleclick', 'facebook.com/tr', 'google-analytics', 'googletagmanager',
      'googleadservices.com', 'bat.bing.com', 'adnxs.com', 'mathtag.com',
      'adsrvr.org', 'trkn.us', 'cookielaw.org', 'intercomcdn.com',
      'mktoresp.com', 'demdex.net', 'everesttech.net', 'pixel.',
    ];
    element.querySelectorAll('img[src], img[data-src]').forEach((img) => {
      const src = img.getAttribute('src') || img.getAttribute('data-src') || '';
      if (trackingHosts.some((h) => src.includes(h))) {
        const pic = img.closest('picture');
        (pic || img).remove();
      }
    });

    // Remove the cookie-consent dialog text that leaks into the last section.
    [...element.querySelectorAll('p')].forEach((p) => {
      const t = (p.textContent || '').trim();
      if (t.startsWith('This website uses cookies') || t === 'Manage Cookies Accept Cookies') {
        p.remove();
      }
    });
  }
}
