/** Honors the system motion preference for programmatic navigation as well as CSS. */
export function preferredScrollBehavior(): ScrollBehavior {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
}

/** Shared return-to-top behavior for every brand and breadcrumb entry point. */
export function scrollToTop(): void {
  window.scrollTo({ top: 0, behavior: preferredScrollBehavior() })
}
