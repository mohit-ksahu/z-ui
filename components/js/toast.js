const toastMap = {};

const findContainer = placement => {
  if (!toastMap[placement]) {
    const el = document.createElement('div');
    el.className = 'toast-container';
    el.setAttribute('popover', 'manual');
    el.setAttribute('data-placement', placement);
    el.setAttribute('role', 'log');
    el.setAttribute('aria-live', 'polite');
    document.body.appendChild(el);
    toastMap[placement] = el;
  }
  return toastMap[placement];
};

const removeToast = (el, container) => {
  el.remove();
  if (!container.children.length) container.hidePopover();
};

const showToast = (el, {placement = 'top-right', duration = 4000} = {}) => {
  const container = findContainer(placement);
  let timeout;

  el.classList.add('toast');
  el.onmouseenter = () => clearTimeout(timeout);
  el.onmouseleave = () => {
    if (duration > 0) timeout = setTimeout(() => removeToast(el, container), duration);
  };

  container.appendChild(el);
  if (!container.matches(':popover-open')) container.showPopover();
  if (duration > 0) timeout = setTimeout(() => removeToast(el, container), duration);

  return el;
};

export const toast = (content, options = {}) => {
  const el = document.createElement('output');
  if (typeof content === 'string') el.innerHTML = content;
  else if (content instanceof Node) el.appendChild(content);
  return showToast(el, options);
};

export const toastEl = (el, options = {}) => {
  const node = el instanceof HTMLTemplateElement ? el.content.firstElementChild : el;
  const clone = node?.cloneNode(true);
  if (!clone) return;
  clone.removeAttribute('id');
  return showToast(clone, options);
};

export const toastClear = placement => {
  const list = placement && toastMap[placement] ? [toastMap[placement]] : Object.values(toastMap);
  list.forEach(c => { c.innerHTML = ''; c.hidePopover(); });
};

export const toastDismiss = el => {
  const container = el.closest('.toast-container');
  if (container) removeToast(el, container);
};

document.addEventListener('click', e => {
  const btn = e.target.closest('[data-dismiss]');
  const t = btn ? btn.closest('.toast') : e.target.closest('.toast');
  if (t && (btn || !e.target.closest('button, a, input, select, textarea'))) {
    toastDismiss(t);
  }
});

window.toast = toast;
window.toastEl = toastEl;
window.toastClear = toastClear;
window.toastDismiss = toastDismiss;
