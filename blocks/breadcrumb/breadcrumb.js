import { getMetadata } from '../../scripts/aem.js';

function humanize(segment) {
  return segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function decorate(block) {
  const segments = window.location.pathname.split('/').filter(Boolean);
  const trail = [{ text: 'Home', link: segments.length ? '/' : undefined }];

  segments.slice(0, -1).forEach((segment, i) => {
    trail.push({
      text: humanize(segment),
      link: `/${segments.slice(0, i + 1).join('/')}`,
    });
  });

  if (segments.length) {
    trail.push({ text: getMetadata('og:title') || document.title });
  }

  const ul = document.createElement('ul');
  trail.forEach((step) => {
    const li = document.createElement('li');
    let wrap = li;
    if (step.link) {
      wrap = document.createElement('a');
      wrap.href = step.link;
      li.append(wrap);
    }
    const span = document.createElement('span');
    span.textContent = step.text;
    wrap.append(span);
    ul.append(li);
  });
  block.replaceChildren(ul);
}
