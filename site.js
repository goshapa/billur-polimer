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
