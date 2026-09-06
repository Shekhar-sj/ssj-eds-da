import { readBlockConfig, createOptimizedPicture } from '../../scripts/aem.js';

const DEFAULT_SOURCE = '/query-index.json';
// Utility/partial paths that are never articles.
const NON_ARTICLE = ['/nav', '/footer'];

/**
 * Normalise a configured value that may be an absolute href (when authored as a
 * link) or plain text into a root-relative path.
 * @param {string} value Configured value
 * @returns {string} Root-relative path (+ search), or '' when empty
 */
function toPath(value) {
  if (!value) return '';
  try {
    const url = new URL(value, window.location.origin);
    return `${url.pathname}${url.search}`;
  } catch (e) {
    return value;
  }
}

/**
 * Fetch the index JSON, tolerating network/parse errors.
 * @param {string} source Index JSON path
 * @returns {Promise<Array<Object>>} Index rows
 */
async function fetchIndex(source) {
  try {
    const resp = await fetch(source);
    if (!resp.ok) return [];
    const json = await resp.json();
    return json.data || [];
  } catch (e) {
    return [];
  }
}

/**
 * Build a single article card as a list item wrapped in a card-wide link.
 * @param {Object} item Index row (path, title, description, image)
 * @returns {HTMLLIElement}
 */
function createCard(item) {
  const li = document.createElement('li');
  li.className = 'article-list-card';

  const link = document.createElement('a');
  link.className = 'article-list-card-link';
  link.href = item.path;

  if (item.image) {
    const imageWrap = document.createElement('div');
    imageWrap.className = 'article-list-card-image';
    // alt is empty: the title text below already names the link.
    imageWrap.append(createOptimizedPicture(item.image, '', false, [{ width: '750' }]));
    link.append(imageWrap);
  }

  const body = document.createElement('div');
  body.className = 'article-list-card-body';

  const title = document.createElement('h3');
  title.textContent = item.title || item.path;
  body.append(title);

  if (item.description) {
    const desc = document.createElement('p');
    desc.textContent = item.description;
    body.append(desc);
  }

  link.append(body);
  li.append(link);
  return li;
}

/**
 * loads and decorates the article list block
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  const config = readBlockConfig(block);
  const source = toPath(config.source) || DEFAULT_SOURCE;
  const filter = config.filter ? toPath(config.filter) : '';
  const limit = config.limit ? parseInt(config.limit, 10) : 0;

  let items = await fetchIndex(source);

  // Drop partials/utility pages by default.
  items = items.filter((it) => it.path
    && !it.path.startsWith('/fragments/')
    && !NON_ARTICLE.includes(it.path));

  if (filter) items = items.filter((it) => it.path.startsWith(filter));
  if (limit > 0) items = items.slice(0, limit);

  block.textContent = '';

  if (!items.length) {
    const empty = document.createElement('p');
    empty.className = 'article-list-empty';
    empty.textContent = 'No articles found.';
    block.append(empty);
    return;
  }

  const list = document.createElement('ul');
  list.className = 'article-list-items';
  items.forEach((item) => list.append(createCard(item)));
  block.append(list);
}
