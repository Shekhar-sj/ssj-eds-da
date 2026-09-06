import { toCamelCase } from '../../scripts/aem.js';

const PAGE_SIZE = 10;
const DEFAULT_SOURCE = '/employees.json';
const COLUMNS = [
  { key: 'Name', label: 'Name' },
  { key: 'Department', label: 'Department' },
  { key: 'Experience', label: 'Experience (In years)' },
  { key: 'City', label: 'City' },
];

let placeholdersPromise;

/**
 * Fetch and cache the site placeholders sheet as a camelCase key/value map.
 * Mirrors the standard EDS fetchPlaceholders contract for boilerplates that do
 * not ship the helper in aem.js.
 * @returns {Promise<Object>} map of placeholder key -> value
 */
async function fetchPlaceholders() {
  if (!placeholdersPromise) {
    placeholdersPromise = fetch('/placeholders.json')
      .then((resp) => (resp.ok ? resp.json() : { data: [] }))
      .then((json) => (json.data || []).reduce((acc, row) => {
        if (row.Key) acc[toCamelCase(row.Key)] = row.Value;
        return acc;
      }, {}))
      .catch(() => ({}));
  }
  return placeholdersPromise;
}

/**
 * Resolve the employees JSON source from the block content. Accepts a path or a
 * link in the block; falls back to the default and normalises to a `.json` path.
 * @param {Element} block The employee-list block
 * @returns {string} JSON source path (pathname + search)
 */
function getSource(block) {
  const link = block.querySelector('a');
  const raw = (link ? link.getAttribute('href') : block.textContent).trim();
  const url = new URL(raw || DEFAULT_SOURCE, window.location.origin);
  if (!url.pathname.endsWith('.json')) url.pathname += '.json';
  return `${url.pathname}${url.search}`;
}

/**
 * Fetch the employee dataset, tolerating network/parse errors.
 * @param {string} source JSON source path
 * @returns {Promise<Array<Object>>} employee rows
 */
async function fetchEmployees(source) {
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
 * Build the table header row from the known columns.
 * @returns {HTMLTableSectionElement}
 */
function buildHead() {
  const thead = document.createElement('thead');
  const tr = document.createElement('tr');
  COLUMNS.forEach((col) => {
    const th = document.createElement('th');
    th.scope = 'col';
    th.textContent = col.label;
    tr.append(th);
  });
  thead.append(tr);
  return thead;
}

/**
 * Append up to PAGE_SIZE employee rows to the table body.
 * @param {HTMLTableSectionElement} tbody Target table body
 * @param {Array<Object>} employees Full dataset
 * @param {number} shown Count already rendered
 * @returns {number} New count of rendered rows
 */
function appendRows(tbody, employees, shown) {
  employees.slice(shown, shown + PAGE_SIZE).forEach((emp) => {
    const tr = document.createElement('tr');
    COLUMNS.forEach((col) => {
      const td = document.createElement('td');
      td.dataset.label = col.label;
      td.textContent = emp[col.key] || '';
      tr.append(td);
    });
    tbody.append(tr);
  });
  return Math.min(shown + PAGE_SIZE, employees.length);
}

/**
 * loads and decorates the employee list block
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  const source = getSource(block);
  const [placeholders, employees] = await Promise.all([
    fetchPlaceholders(),
    fetchEmployees(source),
  ]);

  block.textContent = '';

  if (!employees.length) {
    const empty = document.createElement('p');
    empty.className = 'employee-list-empty';
    empty.textContent = 'No employees found.';
    block.append(empty);
    return;
  }

  const table = document.createElement('table');
  table.append(buildHead());
  const tbody = document.createElement('tbody');
  table.append(tbody);
  block.append(table);

  let shown = appendRows(tbody, employees, 0);

  if (shown < employees.length) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'button employee-list-load-more';
    button.textContent = placeholders.loadMore || 'Load more';
    button.addEventListener('click', () => {
      shown = appendRows(tbody, employees, shown);
      if (shown >= employees.length) button.remove();
    });
    block.append(button);
  }
}
