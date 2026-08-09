const clickLabel = e => {
  const label = e.target.closest('label[for]');
  if (!label) return;

  const input = document.getElementById(label.htmlFor);
  if (!input || input.type !== 'radio') return;

  e.preventDefault();
  input.checked = !input.checked || input.required;
  input.dispatchEvent(new Event('change', {bubbles: true}));
};

const keydownRadio = e => {
  const target = e.target;
  const uncheckedRadio = e.key === ' ' && target?.type === 'radio' && target.checked && !target.required;

  if (uncheckedRadio) {
    e.preventDefault();
    target.checked = false;
    target.dispatchEvent(new Event('change', {bubbles: true}));
  }
};

document.addEventListener('click', clickLabel);
document.addEventListener('keydown', keydownRadio);