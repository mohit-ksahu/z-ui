export const keyNav = (e, index, length, {prevKey, nextKey, homeEnd = false}) => {
  const {key} = e;
  let next = -1;

  if (key === nextKey) next = (index + 1) % length;
  else if (key === prevKey) next = (index - 1 + length) % length;
  else if (homeEnd && key === 'Home') next = 0;
  else if (homeEnd && key === 'End') next = length - 1;

  if (next >= 0) e.preventDefault();
  return next;
};

document.addEventListener('click', e => {
  const btn = e.target.closest('button[commandfor]');
  if (!btn) return;

  const target = document.getElementById(btn.getAttribute('commandfor'));
  if (!target) return;

  const cmd = btn.getAttribute('command') || 'toggle';

  if (target instanceof HTMLDialogElement) {
    const show = cmd === 'show-modal' || (cmd === 'toggle' && !target.open);
    if (show !== target.open) {
      target[show ? 'showModal' : 'close']();
      e.preventDefault();
    }
  } else if (target.hasAttribute('popover')) {
    const open = target.matches(':popover-open');
    const show = cmd === 'show-popover' || (cmd === 'toggle' && !open);
    if (show !== open) {
      target[show ? 'showPopover' : 'hidePopover']();
      e.preventDefault();
    }
  }
});