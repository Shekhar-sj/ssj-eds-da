import { decorateIcons } from '../../scripts/aem.js';

const VARIANTS = ['warning', 'error', 'success'];

export default function decorate(block) {
  block.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((heading) => {
    const p = document.createElement('p');
    p.className = 'note-heading';
    p.textContent = heading.textContent;
    heading.replaceWith(p);
  });

  if (!block.classList.contains('no-icon')) {
    const variant = VARIANTS.find((v) => block.classList.contains(v)) || 'info';
    const icon = document.createElement('span');
    icon.className = `icon icon-${variant}`;
    block.prepend(icon);
    decorateIcons(block);
  }
}
