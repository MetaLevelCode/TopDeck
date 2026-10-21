/** Opacity of the dark layer over the tavern photo. The entrance veil fades to this same value for a seamless hand-off. */
export const BACKDROP_OVERLAY = 0.82;

/** Interior of the tavern: the last frame of the entrance video, dimmed so panels stay readable. */
export function TavernBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 bg-base-dark">
      <img src="/img/tavern.webp" alt="" className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-base-dark" style={{ opacity: BACKDROP_OVERLAY }} />
    </div>
  );
}
