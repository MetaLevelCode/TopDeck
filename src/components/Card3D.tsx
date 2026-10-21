import { useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import { RotateCw } from 'lucide-react';

/** Every Magic card shares this back; double-faced cards pass their second face instead. */
const CARD_BACK = '/img/card-back.webp';
const DEG_PER_PX = 0.6;
/** Less travel than this is a tap, and a tap flips the card. */
const TAP_PX = 6;
/** Tilt on the vertical axis stays small so the card never shows its edge that way. */
const MAX_TILT = 20;

const nearestFace = (deg: number) => Math.round(deg / 180) * 180;

interface Card3DProps {
  front?: string;
  back?: string;
  alt: string;
  /** Classes for the card itself (e.g. the foil glow), so they turn with it. */
  className?: string;
}

/** The card as an object in the hand: drag to turn it, flick or tap to flip it, and it settles on the nearer face. */
export function Card3D({ front, back = CARD_BACK, alt, className = '' }: Card3DProps) {
  const [rot, setRot] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const drag = useRef({ active: false, x: 0, y: 0, from: rot, lastX: 0, lastT: 0, v: 0, moved: 0 });
  const showingBack = Math.abs(nearestFace(rot.y) / 180) % 2 === 1;
  const flip = () => setRot((r) => ({ x: 0, y: nearestFace(r.y) + 180 }));

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { active: true, x: e.clientX, y: e.clientY, from: rot, lastX: e.clientX, lastT: e.timeStamp, v: 0, moved: 0 };
    setDragging(true);
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.active) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    d.moved = Math.max(d.moved, Math.hypot(dx, dy));
    if (e.timeStamp > d.lastT) d.v = (e.clientX - d.lastX) / (e.timeStamp - d.lastT);
    d.lastX = e.clientX;
    d.lastT = e.timeStamp;
    setRot({ y: d.from.y + dx * DEG_PER_PX, x: Math.max(-MAX_TILT, Math.min(MAX_TILT, d.from.x - dy * DEG_PER_PX)) });
  };

  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.active) return;
    d.active = false;
    setDragging(false);
    if (d.moved < TAP_PX) return flip();
    // A finger that stopped before lifting carries no momentum.
    const v = e.timeStamp - d.lastT > 100 ? 0 : d.v;
    // Apple's momentum projection (deceleration 0.99, v in px/ms) picks the face the flick was thrown towards…
    const target = nearestFace(rot.y + v * 99 * DEG_PER_PX);
    // …but one gesture flips the card at most once, however hard the flick.
    const start = nearestFace(d.from.y);
    setRot({ x: 0, y: Math.max(start - 180, Math.min(start + 180, target)) });
  };

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <div className="w-full [perspective:1200px]">
        <div
          className={`card-3d relative aspect-[488/680] w-full cursor-grab touch-pan-y select-none rounded-[4.5%] shadow-lift active:cursor-grabbing ${className}`}
          data-dragging={dragging || undefined}
          style={{ transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg)` }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div className="absolute inset-0 overflow-hidden rounded-[4.5%] bg-parchment-well">
            {front ? (
              <img src={front} alt={alt} width={488} height={680} draggable={false} className="size-full object-cover" />
            ) : (
              <div className="grid size-full place-items-center text-xs text-espresso-soft">Sin ilustración</div>
            )}
          </div>
          <div className="absolute inset-0 overflow-hidden rounded-[4.5%] [transform:rotateY(180deg)]">
            <img src={back} alt="" width={488} height={680} draggable={false} loading="lazy" className="size-full object-cover" />
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={flip}
        className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-bold text-espresso-soft transition-colors hover:text-honey-ink"
      >
        <RotateCw className="size-3.5" aria-hidden="true" />
        {showingBack ? 'Ver el frente' : 'Voltear la carta'}
      </button>
    </div>
  );
}
