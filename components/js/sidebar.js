const mobile = window.matchMedia('(max-width: 768px)');
const bound = new WeakSet();

const getProviders = () => [...document.querySelectorAll('.sidebar-provider')];

const syncAria = p => {
  const open = p.dataset.state === 'open';
  p.querySelectorAll('.sidebar-trigger').forEach(t => t.setAttribute('aria-expanded', String(open)));
};

const setState = (p, state, persist = false) => {
  const s = p.querySelector('.sidebar');
  if (s) {
    s.classList.add('animating');
    s.addEventListener('transitionend', () => s.classList.remove('animating'), {once: true});
  }
  requestAnimationFrame(() => {
    p.dataset.state = state;
    if (persist) p.dataset.desktopState = state;
    syncAria(p);
  });
};

const setup = p => {
  if (bound.has(p)) return;
  bound.add(p);
  p.dataset.desktopState ||= mobile.matches ? 'open' : (p.dataset.state || 'open');
  if (mobile.matches) p.dataset.state = 'closed';
  syncAria(p);
};

const run = () => getProviders().forEach(setup);
document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', run) : run();

new MutationObserver(m => {
  m.forEach(r => r.addedNodes.forEach(n => {
    if (n.nodeType === 1) {
      if (n.classList?.contains('sidebar-provider')) setup(n);
      n.querySelectorAll?.('.sidebar-provider')?.forEach(setup);
    }
  }));
}).observe(document.body, {childList: true, subtree: true});

mobile.addEventListener('change', e => {
  requestAnimationFrame(() => {
    getProviders().forEach(p => {
      p.dataset.state = e.matches ? (p.dataset.desktopState = p.dataset.state, 'closed') : (p.dataset.desktopState || 'open');
      syncAria(p);
    });
  });
});

document.addEventListener('keydown', e => {
  if (e.key !== 'Escape' || !mobile.matches) return;
  getProviders().filter(p => p.dataset.state === 'open').forEach(p => {
    setState(p, 'closed');
    p.querySelector('.sidebar-trigger')?.focus();
  });
});

document.addEventListener('click', e => {
  const p = e.target.closest('.sidebar-provider');
  if (!p) return;

  if (e.target.closest('.sidebar-trigger')) {
    const s = p.querySelector('.sidebar');
    if (!s || s.getAttribute('data-collapsible') !== 'none' || mobile.matches) {
      setState(p, (p.dataset.state || 'open') === 'open' ? 'closed' : 'open', !mobile.matches);
    }
  } else if (mobile.matches && p.dataset.state === 'open' && (e.target === p || e.target.closest('a[href], .sidebar-menu-button:not(summary)'))) {
    setState(p, 'closed');
  }
});
