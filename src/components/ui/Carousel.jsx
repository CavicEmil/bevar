import { Children, useId, useRef } from "react";

/* Layout only: pass cards, badges or other components as children. */
export default function Carousel({
  children,
  ariaLabel = "Carousel",
  itemsPerSlide = 1,
  className = "",
}) {
  const items = Children.toArray(children);
  const viewportRef = useRef(null);
  const viewportId = useId();
  const dragRef = useRef(null);
  const suppressClickRef = useRef(false);

  const visibleItems = Number.isInteger(itemsPerSlide) && itemsPerSlide > 0
    ? Math.min(itemsPerSlide, Math.max(items.length, 1))
    : 1;

  const peekPadding = visibleItems === 1
    ? "calc(var(--spacing-related) + var(--carousel-single-peek, 2.5rem))"
    : "var(--spacing-page)";

  function scrollTo(left) {
    const viewport = viewportRef.current;
    if (!viewport) return;

    viewport.scrollTo({
      left,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }

  function move(direction) {
    const viewport = viewportRef.current;
    if (!viewport || viewport.children.length < 2) return;

    const first = viewport.children[0].getBoundingClientRect();
    const second = viewport.children[1].getBoundingClientRect();
    scrollTo(viewport.scrollLeft + direction * (second.left - first.left));
  }

  function handleKeyDown(event) {
    // Leave keyboard events inside buttons, inputs and links to those controls.
    if (event.target !== event.currentTarget) return;

    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      move(event.key === "ArrowLeft" ? -1 : 1);
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      scrollTo(event.key === "Home" ? 0 : viewportRef.current.scrollWidth);
    }
  }

  function handlePointerDown(event) {
    // Touchscreens keep native scrolling and momentum, including vertical scroll.
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    suppressClickRef.current = false;
    const viewport = event.currentTarget;
    if (viewport.scrollWidth <= viewport.clientWidth) return;
    if (event.target.closest("input, textarea, select, [contenteditable]")) return;

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      scrollLeft: viewport.scrollLeft,
      moved: false,
    };
  }

  function handlePointerMove(event) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const distance = event.clientX - drag.startX;
    if (!drag.moved && Math.abs(distance) < 6) return;

    const viewport = event.currentTarget;
    if (!drag.moved) {
      drag.moved = true;
      viewport.setPointerCapture(event.pointerId);
      viewport.style.scrollSnapType = "none";
      viewport.style.cursor = "grabbing";
    }
    event.preventDefault();
    viewport.scrollLeft = drag.scrollLeft - distance;
  }

  function finishDrag(event) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    if (!drag.moved) return;

    const viewport = event.currentTarget;
    const left = viewport.scrollLeft;
    const first = viewport.children[0]?.getBoundingClientRect();
    const second = viewport.children[1]?.getBoundingClientRect();
    const step = first && second ? second.left - first.left : 0;
    suppressClickRef.current = true;
    viewport.style.removeProperty("scroll-snap-type");
    viewport.style.removeProperty("cursor");
    if (viewport.hasPointerCapture(event.pointerId)) {
      viewport.releasePointerCapture(event.pointerId);
    }
    if (step > 0) scrollTo(Math.round(left / step) * step);
  }

  function handleClickCapture(event) {
    // A drag must not also activate a heart, button or recipe link.
    if (suppressClickRef.current && event.detail !== 0) {
      event.preventDefault();
      event.stopPropagation();
      suppressClickRef.current = false;
    }
  }

  if (items.length === 0) return null;

  return (
    <section
      aria-label={ariaLabel}
      aria-roledescription="carousel"
      className={`min-w-0 w-full text-dark-humor ${className}`}
    >
      <p id={`${viewportId}-instructions`} className="sr-only">
        Swipe, drag with a mouse, or scroll horizontally. Use the left and right arrow keys when
        this list is focused. Home goes to the start; End goes to the end.
      </p>

      <div
        ref={viewportRef}
        id={viewportId}
        role="group"
        aria-label={`${ariaLabel} items`}
        aria-describedby={`${viewportId}-instructions`}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onLostPointerCapture={finishDrag}
        onClickCapture={handleClickCapture}
        onDragStart={event => event.preventDefault()}
        style={{ "--carousel-items": visibleItems,  "--carousel-peek-default": peekPadding, }}
        className="flex cursor-grab select-none gap-related overflow-x-auto overscroll-x-contain snap-x snap-mandatory py-related -my-related 
        pr-[var(--carousel-peek,var(--carousel-peek-default))] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-spicy-berry"
      >
        {items.map((item, index) => (
          <div
            key={item.key ?? index}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${items.length}`}
            className="min-w-0 shrink-0 snap-start [flex-basis:calc((100%-(var(--carousel-items)-1)*var(--spacing-related))/var(--carousel-items))]"
          >
            {item}
          </div>
        ))}
      </div>

    </section>
  );
}
