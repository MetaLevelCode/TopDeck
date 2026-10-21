/** Opacity of the parchment layer over the tavern photo. The entrance veil fades to this same value for a seamless hand-off. */
export const BACKDROP_OVERLAY = 0.9;

/** Interior of the tavern: the last frame of the entrance video, washed in parchment so panels stay readable. */
export function TavernBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 bg-parchment">
      <img src="/img/tavern.webp" alt="" className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-parchment" style={{ opacity: BACKDROP_OVERLAY }} />
    </div>
  );
}
