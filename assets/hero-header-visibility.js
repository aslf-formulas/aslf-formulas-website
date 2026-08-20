/**
 * Hero-aware header visibility.
 *
 * Horizon natively supports a transparent header (`enable_transparent_header_home`) and a
 * sticky header (`enable_sticky_header`), but deliberately makes the two mutually degrading:
 * `sections/header.liquid` assigns `transparent="not-sticky"` when both are enabled, and its
 * CSS snaps the header back to a solid background the moment `data-sticky-state` becomes
 * `active` -- i.e. within the first pixel of scroll.
 *
 * We want the opposite: the header stays transparent (black text) while pinned over the hero
 * video, then disappears entirely once the hero has scrolled past -- which, with the hero at
 * full-screen height, is the moment the product grid reaches the top of the viewport.
 *
 * This module does as little as possible -- it sets a single attribute, `data-past-hero`, on
 * `#header-component`. All visual work lives in `assets/hero-header-visibility.css`. If this
 * script fails to load, the header simply falls back to stock Horizon behaviour.
 */

import { getScrollEventTarget, scrollContainerMediaQuery } from '@theme/scroll-container';

const PAST_HERO_ATTRIBUTE = 'data-past-hero';

function init() {
  const header = document.querySelector('#header-component');
  const heroMedia = document.querySelector('.hero__media');

  // No header, or not a page with a hero (most templates) -- nothing to do.
  if (!header || !heroMedia) return;

  const hero = heroMedia.closest('.shopify-section') ?? heroMedia;

  /** @type {number | null} */
  let rafId = null;
  /** @type {EventTarget | null} */
  let scrollTarget = null;

  const update = () => {
    rafId = null;

    // getBoundingClientRect() is viewport-relative and stays correct no matter which
    // element is actually scrolling. That matters here: above 990px Horizon scrolls
    // .page-wrapper rather than the document, so anything derived from document scroll
    // offsets -- or from an IntersectionObserver whose root resolved to the wrong
    // element -- would silently never fire on desktop.
    const isPastHero = hero.getBoundingClientRect().bottom <= 0;
    header.toggleAttribute(PAST_HERO_ATTRIBUTE, isPastHero);
  };

  const requestUpdate = () => {
    if (rafId !== null) return;
    rafId = requestAnimationFrame(update);
  };

  // The scroll target swaps between .page-wrapper and the document at 990px, so the
  // listener has to be rebound when the breakpoint changes. Same pattern as
  // assets/header.js (#handleBreakpointChange).
  const bindScrollTarget = () => {
    scrollTarget?.removeEventListener('scroll', requestUpdate);
    scrollTarget = getScrollEventTarget();
    scrollTarget.addEventListener('scroll', requestUpdate, { passive: true });
    requestUpdate();
  };

  bindScrollTarget();
  scrollContainerMediaQuery.addEventListener('change', bindScrollTarget);

  // Hero height is viewport-relative (full-screen), so a resize moves the trigger point.
  window.addEventListener('resize', requestUpdate, { passive: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
