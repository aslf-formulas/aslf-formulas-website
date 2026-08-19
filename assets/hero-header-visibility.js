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
 * video, then disappears entirely once the hero has scrolled out of view, and returns at the top.
 *
 * This module does as little as possible -- it sets a single attribute, `data-past-hero`, on
 * `#header-component`. All visual work lives in `assets/hero-header-visibility.css`. If this
 * script fails to load, the header simply falls back to stock Horizon behaviour.
 *
 * Note: above 990px Horizon scrolls `.page-wrapper`, not the viewport, so the
 * IntersectionObserver root must come from `@theme/scroll-container` and be rebuilt when the
 * breakpoint changes. A window-rooted observer would silently never fire on desktop.
 * See the equivalent pattern in `assets/header.js` (`#handleBreakpointChange`).
 */

import { getIntersectionRoot, scrollContainerMediaQuery } from '@theme/scroll-container';

const PAST_HERO_ATTRIBUTE = 'data-past-hero';

function init() {
  const header = document.querySelector('#header-component');
  const heroMedia = document.querySelector('.hero__media');

  // No header, or not a page with a hero (most templates) -- nothing to do.
  if (!header || !heroMedia) return;

  const hero = heroMedia.closest('.shopify-section') ?? heroMedia;

  /** @type {IntersectionObserver | null} */
  let observer = null;

  /** @param {IntersectionObserverEntry[]} entries */
  const handleIntersection = (entries) => {
    for (const entry of entries) {
      // Only treat "not intersecting" as past-hero when the hero sits above the viewport.
      // Without the bounds check, an observer firing before the hero is reached would
      // hide the header while it is still supposed to be overlaid on the video.
      const isPastHero = !entry.isIntersecting && entry.boundingClientRect.bottom <= 0;
      header.toggleAttribute(PAST_HERO_ATTRIBUTE, isPastHero);
    }
  };

  const observe = () => {
    observer?.disconnect();
    observer = new IntersectionObserver(handleIntersection, {
      root: getIntersectionRoot(),
      threshold: 0,
    });
    observer.observe(hero);
  };

  observe();

  // The scroll container swaps between `.page-wrapper` and the viewport at 990px, which
  // invalidates the observer's root.
  scrollContainerMediaQuery.addEventListener('change', observe);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
