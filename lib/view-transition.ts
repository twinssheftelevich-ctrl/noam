export function withViewTransition(direction: "forward" | "back", action: () => void) {
  const supportsViewTransition =
    typeof document !== "undefined" && typeof document.startViewTransition === "function";

  // A hidden document (e.g. the tab was just backgrounded) makes
  // startViewTransition throw synchronously in some browsers, which would skip
  // `action()` entirely — bail out to a plain navigation in that case.
  if (!supportsViewTransition || document.visibilityState === "hidden") {
    action();
    return;
  }

  document.documentElement.dataset.navDir = direction;
  try {
    const transition = document.startViewTransition(action);
    transition.ready.catch(() => {});
    transition.finished.catch(() => {});
  } catch {
    action();
  }
}
