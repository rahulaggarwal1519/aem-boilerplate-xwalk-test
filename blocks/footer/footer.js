import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  // Default footer path: sibling of the current page (e.g. /content/footer),
  // falling back to /footer at the site root.
  const { pathname } = window.location;
  const dir = pathname.slice(0, pathname.lastIndexOf('/'));
  const defaultFooterPath = dir ? `${dir}/footer` : '/footer';
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : defaultFooterPath;
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  block.append(footer);
}
