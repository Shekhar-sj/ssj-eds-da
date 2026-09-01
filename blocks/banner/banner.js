import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const [imageRow, titleRow, colorRow] = [...block.children];

  const picture = imageRow.querySelector('picture');
  const img = picture?.querySelector('img');
  if (img) {
    picture.replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  }
  const imageWrapper = document.createElement('div');
  imageWrapper.className = 'banner-image';
  const optimizedPicture = imageRow.querySelector('picture');
  if (optimizedPicture) imageWrapper.append(optimizedPicture);

  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'banner-content';
  const title = document.createElement('p');
  title.className = 'banner-title';
  title.append(...titleRow.firstElementChild.childNodes);
  contentWrapper.append(title);

  const color = colorRow?.textContent.trim();
  if (color) block.style.setProperty('--banner-background-color', color);

  block.replaceChildren(imageWrapper, contentWrapper);
}
