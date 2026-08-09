export const keyNav = (e, index, length, {prevKey, nextKey, homeEnd = false}) => {
  const {key} = e;
  let nextIndex = -1;

  if (key === nextKey) nextIndex = (index + 1) % length;
  else if (key === prevKey) nextIndex = (index - 1 + length) % length;
  else if (homeEnd && key === 'Home') nextIndex = 0;
  else if (homeEnd && key === 'End') nextIndex = length - 1;

  if (nextIndex >= 0) e.preventDefault();
  return nextIndex;
};

document.addEventListener('click', e => {
  const btn = e.target.closest('button[commandfor]');
  if (!btn) return;

  const target = document.getElementById(btn.getAttribute('commandfor'));
  if (!target) return;

  const command = btn.getAttribute('command') || 'toggle';

  if (target instanceof HTMLDialogElement) {
    const action = command === 'show-modal' ? 'showModal' : command === 'close' ? 'close' : target.open ? 'close' : 'showModal';
    if ((action === 'showModal' && !target.open) || (action === 'close' && target.open)) {
      target[action]();
      e.preventDefault();
    }
  } else if (target.hasAttribute('popover')) {
    const visible = target.matches(':popover-open');
    const method = ['hide-popover', 'close'].includes(command) ? 'hidePopover' : command === 'show-popover' ? 'showPopover' : visible ? 'hidePopover' : 'showPopover';

    if ((method === 'showPopover' && !visible) || (method === 'hidePopover' && visible)) {
      target[method]();
      e.preventDefault();
    }
  }
});