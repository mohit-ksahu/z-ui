const toastMap = {};

const findContainer = placement => {
  if (!toastMap[placement]) {
    const container = document.createElement('div');
    container.className = 'toast-container';
    container.setAttribute('popover', 'manual');
    container.setAttribute('data-placement', placement);
    container.setAttribute('role', 'log');
    container.setAttribute('aria-live', 'polite');
    document.body.appendChild(container);
    toastMap[placement] = container;
  }
  return toastMap[placement];
};

const removeToast = (element, container) => {
  element.remove();
  if (!container.children.length) container.hidePopover();
};

const showToast = (element, {placement = 'top-right', duration = 4000} = {}) => {
  const container = findContainer(placement);
  let timeout;

  element.classList.add('toast');
  element.onmouseenter = () => clearTimeout(timeout);
  element.onmouseleave = () => {
    if (duration > 0) timeout = setTimeout(() => removeToast(element, container), duration);
  };

  container.appendChild(element);
  if (!container.matches(':popover-open')) container.showPopover();
  if (duration > 0) timeout = setTimeout(() => removeToast(element, container), duration);

  return element;
};

export const toast = (content, options = {}) => {
  const element = document.createElement('output');
  if (typeof content === 'string') {
    element.innerHTML = content;
  } else if (content instanceof Node) {
    element.appendChild(content);
  }
  return showToast(element, options);
};

export const toastEl = (element, options = {}) => {
  const fromTemplate = element instanceof HTMLTemplateElement;
  const clone = fromTemplate ? element.content.firstElementChild?.cloneNode(true) : element?.cloneNode(true);

  if (clone) {
    clone.removeAttribute('id');
    return showToast(clone, options);
  }
};

export const toastClear = placement => {
  if (placement && toastMap[placement]) {
    toastMap[placement].innerHTML = '';
    toastMap[placement].hidePopover();
  } else {
    Object.values(toastMap).forEach(container => {
      container.innerHTML = '';
      container.hidePopover();
    });
  }
};

export const toastDismiss = element => {
  const container = element.closest('.toast-container');
  if (container) removeToast(element, container);
};

document.addEventListener('click', e => {
  const dismissBtn = e.target.closest('[data-dismiss]');
  const targetToast = dismissBtn ? dismissBtn.closest('.toast') : e.target.closest('.toast');

  if (targetToast && (dismissBtn || !e.target.closest('button, a, input, select, textarea'))) {
    toastDismiss(targetToast);
  }
});

window.toast = toast;
window.toastEl = toastEl;
window.toastClear = toastClear;
window.toastDismiss = toastDismiss;