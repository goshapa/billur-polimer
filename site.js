const quote = document.querySelector('#quote');
const dialog = document.querySelector('#request');
const message = document.querySelector('#message');
const status = document.querySelector('#status');

document.querySelectorAll('[data-product]').forEach((link) => {
  link.addEventListener('click', () => {
    quote.elements.product.value = link.dataset.product;
  });
});

quote.addEventListener('submit', (event) => {
  event.preventDefault();
  const { product, size, quantity, details } = quote.elements;
  if (!quantity.value.trim()) {
    quantity.value = '';
    quantity.reportValidity();
    return;
  }
  message.value = [
    'Здравствуйте! Хочу узнать стоимость партии.',
    'Формат: ' + product.selectedOptions[0].textContent,
    size.value.trim() && 'Размер: ' + size.value.trim(),
    'Объём: ' + quantity.value.trim(),
    details.value.trim() && 'Комментарий: ' + details.value.trim(),
  ].filter(Boolean).join('\n');
  status.textContent = '';
  dialog.showModal();
});

document.querySelector('#copy').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(message.value);
    status.textContent = 'Текст скопирован.';
  } catch {
    message.focus();
    message.select();
    status.textContent = 'Текст выделен. Скопируйте его вручную.';
  }
});

const workViewer = document.querySelector('#work-viewer');
const workImage = document.querySelector('#work-image');
const workTitle = document.querySelector('#work-title');
const workCount = document.querySelector('#work-count');
const workCards = Array.from(document.querySelectorAll('.work-card'));
const workFilters = document.querySelectorAll('[data-work-filter]');
let visibleWorks = workCards;
let workIndex = 0;

function showWork(index) {
  workIndex = (index + visibleWorks.length) % visibleWorks.length;
  const card = visibleWorks[workIndex];
  workTitle.textContent = card.querySelector('.work-label span').textContent;
  workImage.src = card.href;
  workImage.alt = card.querySelector('img').alt + ' · ' + workTitle.textContent;
  workCount.textContent = (workIndex + 1) + ' / ' + visibleWorks.length;
}

workFilters.forEach((filter) => {
  filter.addEventListener('click', () => {
    const kind = filter.dataset.workFilter;
    visibleWorks = workCards.filter((card) => kind === 'all' || card.dataset.kind === kind);
    workCards.forEach((card) => { card.hidden = !visibleWorks.includes(card); });
    workFilters.forEach((button) => button.setAttribute('aria-pressed', String(button === filter)));
  });
});

workCards.forEach((card) => {
  card.addEventListener('click', (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    showWork(visibleWorks.indexOf(card));
    workViewer.showModal();
  });
});

document.querySelector('#work-prev').addEventListener('click', () => showWork(workIndex - 1));
document.querySelector('#work-next').addEventListener('click', () => showWork(workIndex + 1));
workViewer.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') showWork(workIndex - 1);
  if (event.key === 'ArrowRight') showWork(workIndex + 1);
});

document.querySelector('#work-order').addEventListener('click', () => {
  const card = visibleWorks[workIndex];
  const { product, details } = quote.elements;
  const reference = 'Пример из портфолио: ' + workTitle.textContent + ' (' + card.href + ')';
  const notes = details.value.split('\n').filter((line) => !line.startsWith('Пример из портфолио: ')).join('\n').trim();
  product.value = card.dataset.kind;
  const availableLength = details.maxLength - reference.length - 1;
  details.value = [reference, notes.slice(0, availableLength)].filter(Boolean).join('\n');
  workViewer.close();
});
