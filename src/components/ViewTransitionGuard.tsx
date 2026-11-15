"use client";

import { useEffect } from "react";

/**
 * When the page updates while its tab is hidden (a navigation, or Fast Refresh in
 * a background tab), the browser skips the view transition and rejects its
 * `ready` promise with an InvalidStateError. The DOM update still applies, so it's
 * harmless, and React deliberately ignores it, but only for exact message strings.
 * Newer Chrome says "Transition was aborted because of invalid state. Document
 * hidden", which React doesn't recognise, so it surfaces as a console error.
 *
 * Fix: wrap `document.startViewTransition` and, for that one skip case, re-reject
 * `ready` with the message React ignores. Every other error passes through as is.
 */
const REACT_IGNORED_MESSAGE = "Transition was aborted because of invalid state";

function isSkippedTransition(err: unknown) {
  return (
    err instanceof DOMException &&
    err.name === "InvalidStateError" &&
    /transition was aborted|skipping view transition|view transition was skipped/i.test(err.message)
  );
}

export function ViewTransitionGuard() {
  useEffect(() => {
    const doc = document as Document & {
      startViewTransition?: (arg?: unknown) => ViewTransition;
    };
    const original = doc.startViewTransition;
    if (typeof original !== "function") return;

    doc.startViewTransition = function (this: Document, arg?: unknown) {
      const transition = original.call(this, arg);
      const ready = transition.ready.catch((err: unknown) => {
        throw isSkippedTransition(err)
          ? new DOMException(REACT_IGNORED_MESSAGE, "InvalidStateError")
          : err;
      });
      try {
        Object.defineProperty(transition, "ready", { value: ready, configurable: true });
      } catch {
        // non-extensible in some engine: leave the original behaviour
      }
      return transition;
    };

    // a skipped transition's other promises may also reject; keep those quiet too
    const onRejection = (e: PromiseRejectionEvent) => {
      if (isSkippedTransition(e.reason)) e.preventDefault();
    };
    window.addEventListener("unhandledrejection", onRejection);

    return () => {
      doc.startViewTransition = original;
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);
  return null;
}
