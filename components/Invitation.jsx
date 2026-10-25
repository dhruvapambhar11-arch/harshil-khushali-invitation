"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";

/**
 * The monogram is one painted plate now - the ह-K mark, the couple and the
 * lotuses were drawn together, so the layers this file used to stack (bloom,
 * glyphs, set names, cut lotuses and a peacock) are all retired.
 *
 * What is drawn is the plate trimmed to the mark and the couple, with its
 * paper lifted off: the verse lines and the corner florals that framed it on
 * the sheet are cropped away, and the cream it was painted on is keyed out so
 * the mark stands on the archway rather than on a card laid over it. The
 * groom's sherwani is painted in that same cream, so by colour it is paper -
 * what keeps him is that his outline enclosed it.
 */
const MONOGRAM_PLATE = "/templates/custom/template2/monogram-plate-cut.webp";

/**
 * The two lotus clusters, each as a soft-edged oval patch of the plate rather
 * than a cut-out of the flower, with the centre it sits on as a fraction of
 * the plate. Scaled up a hair and turned a hair, a patch still covers the
 * flower beneath it exactly, and its feathered rim lands on flat wash where a
 * pixel or two of travel cannot be seen. Keying the petals out instead kept
 * taking the groom with them: he is painted in the same creams and his
 * shoulder touches the leaves.
 *
 * The scale never drops to 1 for that reason - at 1 the patch would no longer
 * cover what it is standing on, and the still flower would show under the
 * moving one.
 */
const PLATE_LOTUS = [
  { src: "plate-lotus-right.webp", cx: 74.9, cy: 31.7, w: 36.8, secs: 11, tilt: 0.45 },
  { src: "plate-lotus-left.webp", cx: 14.5, cy: 59.6, w: 31.7, secs: 14, tilt: -0.5 },
];

/** Full run of the reveal in seconds; GATE_MS is measured off it. */
const REVEAL = 3.6;

/**
 * The plate, with its lotuses breathing. `animate` off draws it still.
 */
function HarshilKhushaliMonogram({ animate = false, className = "" }) {
  return (
    <motion.div
      className={`relative h-full ${className}`}
      style={{ aspectRatio: "807 / 961" }}
      initial={animate ? { opacity: 0, scale: 1.04 } : false}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: REVEAL * 0.55, ease: [0.22, 0.61, 0.24, 1] }}
    >
      <Image
        src={MONOGRAM_PLATE}
        alt="Harshil ke jeevan ki khili Khushali"
        width={807}
        height={961}
        unoptimized
        priority
        className="w-full h-full object-contain"
      />

      {PLATE_LOTUS.map(({ src, cx, cy, w, secs, tilt }) => (
        <motion.img
          key={src}
          src={`/templates/custom/template2/${src}`}
          alt=""
          aria-hidden
          className="absolute pointer-events-none select-none"
          style={{ left: `${cx}%`, top: `${cy}%`, width: `${w}%`, x: "-50%", y: "-50%" }}
          initial={animate ? { scale: 1.012, rotate: 0 } : false}
          animate={{
            scale: [1.012, 1.03, 1.016, 1.012],
            rotate: [0, tilt, tilt * -0.6, 0],
          }}
          transition={{ duration: secs, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ *
 * LOTUS DOOR GATE
 * Replaces the old Door-opening.mp4: the painted double door in the
 * lotus-garden artwork swings open on its own hinges and the camera walks
 * through it into the bougainvillea archway beyond.
 * ------------------------------------------------------------------ */

/**
 * The gate's two plates at twice their painted size. Both were 736px wide and
 * both are drawn full screen, which on a phone at 3x is about 1170 device
 * pixels - so the browser was stretching them half as far again and the
 * stretch is what read as blur. Lanczos with a light unsharp carries the edge
 * the original had; it cannot add detail that was never painted, so a sharper
 * result than this needs a larger original.
 */
const LOTUS_DOOR = "/templates/custom/template2/lotus-door-2x.webp";
const LOTUS_ARCH = "/templates/custom/template2/lotus-arch-2x.webp";

/** Natural size of the door plate, which sets the stage's aspect ratio. */
const DOOR_ART = { w: 736, h: 1307 };

/**
 * The painted double door, measured on the artwork as fractions of the image.
 * `split` is where the two leaves meet as a fraction of the opening's width -
 * the left leaf is the wider of the pair, so it is not 0.5.
 */
const DOORWAY = { x: 0.587, y: 0.6083, w: 0.231, h: 0.2769, split: 0.588 };

/** Centre of the opening - what the camera pushes towards. */
const DOOR_FOCUS = { x: DOORWAY.x + DOORWAY.w / 2, y: DOORWAY.y + DOORWAY.h / 2 };

/**
 * Opening framing. Plain cover (scale 1, -50%/-50%) leaves the top 40% of the
 * frame on empty paper and the door small, so the shot starts pushed in and
 * panned down onto the garden.
 */
const REST_FRAMING = { x: "-53%", y: "-64%", scale: 1.35 };

const pct = (n) => `${(n * 100).toFixed(3)}%`;

// Beats of the sequence, in seconds.
const LEAVES_SWING = 1.5;
const CAMERA_DELAY = 0.9;
const CAMERA_PUSH = 2.2;
/** The monogram lands as the camera settles on the archway. */
const MONOGRAM_AT = 2.8;
/**
 * Beat to sit on the finished monogram before handing over. The blossom is
 * still settling behind the mark until REVEAL * 0.92 + 1.5s, so this is what
 * is left to look at it whole.
 */
const MONOGRAM_HOLD = 4.2;
/** When the gate hands over to the invitation. */
export const GATE_MS = (MONOGRAM_AT + REVEAL + MONOGRAM_HOLD) * 1000;

/**
 * One leaf of the double door. It carries its own slice of the artwork, sized
 * and offset so the painting stays registered with the scene behind it, then
 * swings back on its hinge.
 */
function DoorLeaf({ side, open }) {
  const isLeft = side === "left";
  const width = isLeft ? DOORWAY.split : 1 - DOORWAY.split; // fraction of the opening
  const boxW = DOORWAY.w * width;                           // fraction of the stage
  // In the painting only the left leaf is shut; the right half of the opening
  // is the lotus pond seen through a door already standing away. So the right
  // leaf is not its own slice of the art - it is the right-hand strip of the
  // *left* leaf, mirrored. Mirroring puts that leaf's meeting stile against
  // the centre of the opening, which is where this one's belongs, and the
  // pair reads as a closed door until it is tapped.
  const artX = isLeft
    ? DOORWAY.x
    : DOORWAY.x + DOORWAY.w * DOORWAY.split - boxW;

  return (
    <motion.div
      className="absolute top-0 bottom-0 overflow-hidden"
      style={{
        [side]: 0,
        width: pct(width),
        transformOrigin: isLeft ? "left center" : "right center",
        backfaceVisibility: "hidden",
      }}
      initial={false}
      animate={{
        // Swinging in, not out: the free edge of each leaf turns away from the
        // reader into the garden, which is also the way the camera is about
        // to travel. Outwards it opened into the reader's face and the two
        // leaves passed over the wall either side of the frame.
        rotateY: open ? (isLeft ? 108 : -108) : 0,
        filter: open ? "brightness(0.78)" : "brightness(1)",
      }}
      transition={{
        duration: LEAVES_SWING,
        delay: isLeft ? 0 : 0.08,
        ease: [0.33, 1, 0.68, 1],
      }}
    >
      {/* Sized to the whole stage, then pulled left/up so only this leaf shows.
          A raw <img> here on purpose: next/image's wrapper would fight the
          percentage offsets that keep the leaf registered with the scene.
          The mirror goes on the box rather than the picture, so the offsets
          above stay in the artwork's own coordinates. */}
      <div
        className="absolute inset-0"
        style={isLeft ? undefined : { transform: "scaleX(-1)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={LOTUS_DOOR}
          alt=""
          style={{
            position: "absolute",
            width: pct(1 / boxW),
            height: pct(1 / DOORWAY.h),
            left: pct(-artX / boxW),
            top: pct(-DOORWAY.y / DOORWAY.h),
            maxWidth: "none",
          }}
        />
      </div>
    </motion.div>
  );
}

/** Petals drifting across the gate. Offsets are derived from the index rather
 *  than Math.random so the server and client render the same thing. */
function PetalDrift({ count = 10 }) {
  return (
    <div className="absolute inset-0 z-20 overflow-hidden pointer-events-none">
      {Array.from({ length: count }, (_, i) => {
        const left = ((i * 37) % 100) + (i % 3) - 1;
        const size = 7 + (i % 4) * 3;
        const duration = 9 + (i % 5) * 1.6;
        const drift = i % 2 ? 26 : -34;
        return (
          <motion.div
            key={i}
            className="absolute rounded-[100%_0_100%_0]"
            style={{
              left: `${left}%`,
              width: size,
              height: size * 0.72,
              background: i % 3 ? "rgba(236,150,178,0.55)" : "rgba(244,190,205,0.5)",
            }}
            initial={{ top: "-8%", opacity: 0 }}
            animate={{
              top: "108%",
              x: [0, drift, 0],
              rotate: [0, 180, 360],
              opacity: [0, 0.9, 0.9, 0],
            }}
            transition={{
              duration,
              delay: (i % 6) * 1.3,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        );
      })}
    </div>
  );
}

/**
 * The gate itself. The stage is sized to cover the frame at the artwork's own
 * aspect ratio, so every layer can be placed with the fractions measured above
 * and stays registered at any screen shape.
 */
function LotusDoorGate({ open, onTap }) {
  const ratio = DOOR_ART.w / DOOR_ART.h;
  const [showMonogram, setShowMonogram] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const t = setTimeout(() => setShowMonogram(true), MONOGRAM_AT * 1000);
    return () => clearTimeout(t);
  }, [open]);

  return (
    <motion.div
      key="lotus_gate"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="absolute inset-0 w-full h-full max-w-[430px] mx-auto cursor-pointer overflow-hidden z-20 bg-[#f7eef0]"
      style={{ containerType: "size" }}
      onClick={onTap}
    >
      <motion.div
        className="absolute left-1/2 top-1/2"
        style={{
          width: `max(100cqw, calc(100cqh * ${ratio}))`,
          height: `max(100cqh, calc(100cqw / ${ratio}))`,
          transformOrigin: `${pct(DOOR_FOCUS.x)} ${pct(DOOR_FOCUS.y)}`,
        }}
        initial={REST_FRAMING}
        animate={
          open
            ? { x: `-${pct(DOOR_FOCUS.x)}`, y: `-${pct(DOOR_FOCUS.y)}`, scale: 4.6 }
            : REST_FRAMING
        }
        transition={{ duration: CAMERA_PUSH, delay: CAMERA_DELAY, ease: [0.4, 0, 0.2, 1] }}
      >
        <Image
          src={LOTUS_DOOR}
          alt=""
          fill
          priority
          unoptimized
          aria-hidden
          className="object-fill"
        />

        <div
          className="absolute"
          style={{
            left: pct(DOORWAY.x),
            top: pct(DOORWAY.y),
            width: pct(DOORWAY.w),
            height: pct(DOORWAY.h),
            perspective: "1100px",
          }}
        >
          {/* What waits beyond the door. */}
          <Image
            src={LOTUS_ARCH}
            alt="Bougainvillea archway"
            fill
            priority
            unoptimized
            className="object-cover"
            style={{ objectPosition: "55% 45%" }}
          />
          <DoorLeaf side="left" open={open} />
          <DoorLeaf side="right" open={open} />
        </div>
      </motion.div>

      <PetalDrift />

      {/* Harshil & Khushali, revealed under the archway once we are through. */}
      <AnimatePresence>
        {showMonogram && (
          <motion.div
            key="gate_monogram"
            className="absolute inset-0 z-40 flex items-center justify-center px-7 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            {/* Sized and placed off the archway it stands in, measured in
                the gate's own framing of it: the scalloped opening runs
                y 0.240-0.739 and x 0.275-0.819, centred at 0.547 rather than
                on the middle of the screen. The plate's foot goes on 0.76,
                just inside the frame's bottom rail - the couple are painted
                at the foot of the plate, so that is what stands them on it.
                At 48% of the frame's height it fills the arch, its lotuses
                carrying over the moulding at the sides - which is why the
                bougainvillea behind was lightened, so the mark still reads
                against it. The offsets are fractions of the plate's own
                size. */}
            <div className="h-[48%] translate-x-[6%] translate-y-[13%]">
              <HarshilKhushaliMonogram animate />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!open && (
          <motion.div
            key="tap"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-x-0 bottom-[11%] z-30 flex flex-col items-center pointer-events-none"
          >
            {/* Soft scrim: the watercolour pond underneath is too busy for
                unbacked text to read against. */}
            <div className="absolute -inset-x-6 -inset-y-5 bg-[radial-gradient(ellipse_at_center,rgba(255,250,251,0.85),rgba(255,250,251,0)_72%)]" />
            <motion.div
              animate={{ scale: [1, 3], opacity: [0, 0.55, 0] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="absolute bottom-full mb-3 w-6 h-6 rounded-full border-[#a9506c] border-[1.5px]"
            />
            <p className="relative text-[#7d2f47] text-[0.65rem] font-medium tracking-[0.4em]">
              TAP TO OPEN
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * AUDIO CONTROLLER HOOK
 * Manages background music for the invitation
 */
function useAudioController() {
  const bgMusicRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  // The listeners below fire outside React's render, so they need the live
  // value rather than the one captured when they were attached.
  const mutedRef = useRef(false);
  const armedRef = useRef(false);

  const ensure = () => {
    if (!bgMusicRef.current) {
      bgMusicRef.current = new Audio("/templates/custom/template2/sounds/aaj-ibaadat.mp3");
      bgMusicRef.current.loop = true;
      bgMusicRef.current.volume = 0;
    }
    return bgMusicRef.current;
  };

  const fadeUp = () => {
    const audio = bgMusicRef.current;
    if (!audio) return;
    const up = setInterval(() => {
      if (!bgMusicRef.current) return clearInterval(up);
      if (bgMusicRef.current.volume < 0.29) {
        bgMusicRef.current.volume = Math.min(0.3, bgMusicRef.current.volume + 0.01);
      } else {
        clearInterval(up);
      }
    }, 100);
  };

  /** Start, or report that the browser would not let us. */
  const playBackgroundMusic = () => {
    const audio = ensure();
    if (mutedRef.current) return Promise.reject(new Error("muted"));
    audio.volume = 0;
    return audio.play().then(fadeUp);
  };

  /**
   * Browsers will not play sound until the page has been interacted with, so
   * the shehnai cannot literally start while the door is still shut on a
   * first visit. This asks anyway - a returning visitor whose browser has
   * granted the site autoplay will hear it on the door screen - and otherwise
   * leaves a one-shot listener so it begins on the very first touch anywhere,
   * rather than waiting for the door to finish opening.
   */
  const armAutoplay = () => {
    if (armedRef.current) return;
    armedRef.current = true;
    playBackgroundMusic().catch(() => {
      const kick = () => {
        playBackgroundMusic().catch(() => {});
        events.forEach((e) => window.removeEventListener(e, kick));
      };
      const events = ["pointerdown", "touchstart", "keydown"];
      events.forEach((e) => window.addEventListener(e, kick, { once: true, passive: true }));
    });
  };

  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      mutedRef.current = next;
      const audio = bgMusicRef.current;
      if (audio) {
        audio.muted = next;
        // unmuting before anything has played is a gesture of its own, so it
        // is a fair moment to start
        if (!next && audio.paused) playBackgroundMusic().catch(() => {});
      }
      return next;
    });
  };

  useEffect(() => {
    return () => {
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
        bgMusicRef.current = null;
      }
    };
  }, []);

  return { isMuted, playBackgroundMusic, armAutoplay, toggleMute };
}

/* ------------------------------------------------------------------ *
 * SECTION 0: THE INVOCATION
 * Opens on Ganesha's page whole, then he rises to the head of the sheet as
 * the arch climbs in beneath him and the Vakratunda Mahakaya shloka is
 * written on, one line after another.
 * ------------------------------------------------------------------ */

const SHLOKA = "/templates/custom/template2/shloka";

/** Natural size of the arch plate, which sets that layer's aspect ratio. */
const SHLOKA_ART = { w: 736, h: 1308 };

/**
 * The page starts full bleed and ends as a window at the head of the sheet,
 * framed on the seated figure and rounded off into a halo, so that what is
 * left standing over the green arch is the figure and a ring of his cream
 * ground rather than a lit rectangle of it.
 *
 * The window has to clear the verse beneath it, and this panel is the upper
 * layer, so anything it covers is simply gone. The plate below stands 88% of
 * the sheet, which opens the verse at 37.2% down it, so the window runs that
 * far and no further.
 *
 * That 37.2% is the whole budget, and it is what sets the width: the seated
 * figure is 0.39 to 0.871 down the page and 0.149 to 0.842 across it, so he
 * stands 0.855 as tall as the page is wide, and the window has to hold him
 * whole with the halo's falloff around him. At 58% of the sheet the window
 * comes out square on a phone showing browser chrome, which is where the halo
 * sits truest; `objectPosition` then centres him in it.
 */
const GANESHA_OPEN = { top: "0%", left: "0%", right: "0%", bottom: "0%" };
const GANESHA_REST = { top: "0%", left: "21%", right: "21%", bottom: "62.7%" };

/**
 * The halo. A circle on the shorter side of the window, soft over its last
 * eighth. Held off the opening shot by pushing the stops out past the corners
 * of the full-bleed page, where they mask nothing.
 */
const HALO =
  "radial-gradient(circle closest-side at 50% 50%, #000 var(--halo-solid), transparent var(--halo-edge))";
const HALO_OFF = { "--halo-solid": "400%", "--halo-edge": "500%" };
const HALO_ON = { "--halo-solid": "75%", "--halo-edge": "100%" };

/**
 * The calligraphy lifted line by line off the green wash, each with the place
 * it occupies on the plate as a fraction of the artwork. Compositing all eight
 * back over the plate reproduces the original painting exactly, so the verse
 * can be written on without redrawing it.
 */
const SHLOKA_LINES = [
  { src: "line-0.webp", alt: "॥ वक्रतुंड", left: 0.3084, top: 0.2867, width: 0.4837, height: 0.078 },
  { src: "line-1.webp", alt: "महाकाय", left: 0.356, top: 0.3647, width: 0.4334, height: 0.0726 },
  { src: "line-2.webp", alt: "सुर्यकोटी", left: 0.2554, top: 0.4373, width: 0.3995, height: 0.0765 },
  { src: "line-3.webp", alt: "समप्रभ", left: 0.3003, top: 0.5138, width: 0.4049, height: 0.0673 },
  { src: "line-4.webp", alt: "निर्विघ्नं", left: 0.3084, top: 0.581, width: 0.2976, height: 0.0765 },
  { src: "line-5.webp", alt: "कुरुमेदेवः", left: 0.2731, top: 0.6575, width: 0.4103, height: 0.0703 },
  { src: "line-6.webp", alt: "सर्वकार्येषु", left: 0.269, top: 0.7278, width: 0.4375, height: 0.0688 },
  { src: "line-7.webp", alt: "सर्वदा ॥", left: 0.3071, top: 0.7966, width: 0.3995, height: 0.0787 },
];

// Beats of the invocation, in seconds.
const HOLD = 1.9;        // the page alone, as painted
const RISE = 1.7;        // he lifts, the arch climbs in
const LINE_LEAD = HOLD + RISE - 0.25;
const LINE_GAP = 0.44;
const VERSE_END = LINE_LEAD + SHLOKA_LINES.length * LINE_GAP;

function ShlokaSection({ curtainPhase }) {
  // Nothing moves until the curtains have finished opening on it.
  const begun = curtainPhase === 2;

  // The page ground is the plate's own margin colour; anything lighter and
  // the top edge of the arch layer shows as a straight line across the sheet.
  return (
    <motion.div
      initial="hidden"
      animate={begun ? "visible" : "hidden"}
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
      className="relative w-full h-dvh shrink-0 overflow-hidden bg-[#d8c6a5]"
    >
      {/* The arch, hung off the bottom so every line fraction below lands where
          it was painted. Its height is taken from the sheet and its width from
          its own proportions - not the other way round - because a phone in a
          browser is shorter than this plate is tall: sized off the width it
          overhangs the top of the screen and carries the opening line of the
          verse off with it. Height-first, the art is never stretched, and the
          12% it gives up walks the arch down the page and shrinks it, which is
          what leaves the seated figure above room to be read. Its margin is
          the ground colour, so where the plate is narrower than the sheet the
          join does not show. */}
      <motion.div
        className="absolute bottom-0 left-1/2 z-10 h-[88%] w-auto"
        style={{ aspectRatio: `${SHLOKA_ART.w} / ${SHLOKA_ART.h}` }}
        initial={{ y: "42%", x: "-50%", opacity: 0 }}
        animate={begun ? { y: "0%", x: "-50%", opacity: 1 } : { x: "-50%" }}
        transition={{ duration: RISE + 0.5, delay: HOLD, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src={`${SHLOKA}/arch-plate.webp`}
          alt=""
          fill
          unoptimized
          aria-hidden
          className="object-fill"
        />

        {SHLOKA_LINES.map((line, i) => (
          <motion.img
            key={line.src}
            src={`${SHLOKA}/${line.src}`}
            alt={line.alt}
            className="absolute select-none"
            style={{
              left: `${line.left * 100}%`,
              top: `${line.top * 100}%`,
              width: `${line.width * 100}%`,
              height: `${line.height * 100}%`,
            }}
            initial={{ opacity: 0, y: "14%", filter: "blur(3px)" }}
            animate={begun ? { opacity: 1, y: "0%", filter: "blur(0px)" } : {}}
            transition={{
              duration: 0.6,
              delay: LINE_LEAD + i * LINE_GAP,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        ))}
      </motion.div>

      {/* Ganesha's page, entire. It fills the screen exactly as painted, then
          the frame closes in on the figure and lifts to the head of the sheet,
          his cream ground burning off into a halo as it goes.
          `closest-side` is what keeps that halo a circle rather than an
          ellipse: the radius is half the shorter side of the window whatever
          the phone. The ring cannot be switched on at the end without a pop,
          and a gradient cannot be tweened, so the stops ride out on custom
          properties instead - far enough out to leave the opening page whole,
          then in onto the figure over the same beat as the move. */}
      <motion.div
        className="absolute z-20 overflow-hidden"
        style={{
          maskImage: HALO,
          WebkitMaskImage: HALO,
        }}
        initial={{ ...GANESHA_OPEN, ...HALO_OFF }}
        animate={begun ? { ...GANESHA_REST, ...HALO_ON } : { ...GANESHA_OPEN, ...HALO_OFF }}
        transition={{ duration: RISE, delay: HOLD, ease: [0.33, 1, 0.68, 1] }}
      >
        <Image
          src={`${SHLOKA}/ganesha-page.webp`}
          alt="Shree Ganesh"
          fill
          priority
          unoptimized
          className="object-cover"
          style={{ objectPosition: "50% 83%" }}
        />
      </motion.div>

      {/* Once the verse is set, invite the reader on. */}
      <motion.div
        className="absolute inset-x-0 bottom-[8%] z-30 flex flex-col items-center gap-1 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={begun ? { opacity: 1 } : {}}
        transition={{ duration: 0.9, delay: VERSE_END + 0.6 }}
      >
        <motion.span
          className="block w-px h-5 bg-[#3c4a44]/60"
          animate={{ scaleY: [0.4, 1, 0.4], opacity: [0.3, 0.9, 0.3] }}
          style={{ transformOrigin: "top" }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </motion.div>
  );
}

/**
 * The balcony plate with the couple brought forward: everything around them is
 * mixed 45% into the page's own ground, so the arch, the wall and the garlands
 * sit back and the two of them read as the subject. The hold is an oval over
 * where they stand, widened to take in any strongly dyed cloth - that is what
 * keeps the bride's lehenga at full strength where it carries on below the
 * rail, outside the oval. Baked in rather than done with opacity at runtime,
 * because fading the layer would take the couple down with it.
 */
const ARCH_ART = "/templates/custom/template2/arch-couple-focus.webp";
/**
 * The hanging jasmine, repainted from the cream original onto a deep-rose ramp
 * (#86184e in shadow to #ce568c lit) so it carries the invitation's pink. Only
 * the petals are touched - the mask leaves anything green alone, so the
 * foliage is still the artwork's own.
 */
const SPRIG_A = "/templates/custom/template2/jasmine-sprig-a-pink.webp";
const SPRIG_B = "/templates/custom/template2/jasmine-sprig-b-pink.webp";

/**
 * A jasmine shoot lifted out of the artwork itself and hung back over its own
 * corner, so it can sway on its stem. Anchored where it meets the bough - a
 * shoot pivots where it is attached, not around its middle.
 */
function JasmineSprig({ src, style, flip = false, tilt = 2.2, duration = 7, delay = 0 }) {
  return (
    // The sway and the mirror need different pivots, so they take an element
    // each. The shoot swings on the corner it hangs from; mirroring about
    // that same corner would throw the whole sprig out past the edge of the
    // frame, which is where the right-hand ones had gone.
    <motion.div
      className="absolute pointer-events-none select-none"
      style={{ ...style, transformOrigin: style.right != null ? "top right" : "top left" }}
      initial={{ rotate: -tilt * 0.4 }}
      animate={{ rotate: [-tilt * 0.4, tilt, -tilt * 0.7, -tilt * 0.4] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.img
        src={src}
        alt=""
        aria-hidden
        className="w-full h-auto block"
        initial={{ scaleX: flip ? -1 : 1 }}
      />
    </motion.div>
  );
}

/** Jasmine petals loosened by the same breeze - now the rose of the sprigs
 *  they fall from, and enough of them to read as a drift. Index-derived
 *  offsets keep the server and client renders identical. */
const PETAL_INK = ["rgba(176,46,104,0.85)", "rgba(206,86,140,0.8)", "rgba(146,30,84,0.8)"];

function PetalFall({ count = 16 }) {
  return (
    <div className="absolute inset-0 z-30 overflow-hidden pointer-events-none">
      {Array.from({ length: count }, (_, i) => {
        const left = 4 + ((i * 29) % 92);
        const size = 7 + (i % 4) * 2.5;
        return (
          <motion.div
            key={i}
            className="absolute rounded-[100%_0_100%_0]"
            style={{
              left: `${left}%`,
              width: size,
              height: size * 0.7,
              background: PETAL_INK[i % 3],
              boxShadow: "0 0 3px rgba(120,24,70,0.3)",
            }}
            initial={{ top: "-6%", opacity: 0 }}
            animate={{
              top: "106%",
              x: [0, i % 2 ? 22 : -26, 0],
              rotate: [0, 200, 380],
              opacity: [0, 0.95, 0.95, 0],
            }}
            transition={{
              duration: 13 + (i % 4) * 2.5,
              delay: (i % 5) * 2.6,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        );
      })}
    </div>
  );
}

/**
 * SECTION 1: ARCH & COUPLE
 * One painted plate - arch, balcony and couple together - with the hanging
 * jasmine lifted back out of it so the corners can move in the breeze.
 */
function ArchSection({ curtainPhase }) {
  return (
    <motion.div
      initial="hidden"
      animate={curtainPhase === 2 ? "visible" : "hidden"}
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
      className="relative w-full h-dvh shrink-0 overflow-hidden bg-[#f6ecd9]"
    >
      {/* The plate drifts a hair over its own run, so the page is never
          perfectly still behind the moving foliage. At full strength now - the
          plate carries its own falloff around the couple, so dimming the layer
          on top of that would only take them down with it. */}
      <motion.div
        className="absolute inset-0 w-full h-full z-0"
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.035, 1] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src={ARCH_ART}
          alt="Harshil and Khushali on the balcony"
          fill
          priority
          unoptimized
          className="object-cover"
        />
      </motion.div>

      {/* Top Ganesha Icon */}

      <div className="absolute inset-0 z-20 pointer-events-none">
        {/* Hung from above the frame so the cut stem never shows - a shoot
            floating in open paper reads as pasted-on clip art. */}
        <JasmineSprig src={SPRIG_A} style={{ top: "-7%", left: "-3%", width: "32%" }} tilt={2.4} duration={7.5} />
        <JasmineSprig src={SPRIG_B} style={{ top: "-8%", left: "24%", width: "15%" }} tilt={3.4} duration={8.4} delay={1.6} />
        {/* The right corner answers the left: the fuller shoot on the corner
            itself, the smaller one inboard of it, mirrored and on their own
            unequal timings so the two sides never swing together. */}
        <JasmineSprig src={SPRIG_A} style={{ top: "-7%", right: "-3%", width: "30%" }} tilt={2.0} duration={9.1} delay={0.8} flip />
        <JasmineSprig src={SPRIG_B} style={{ top: "-9%", right: "20%", width: "16%" }} tilt={2.9} duration={6.2} delay={2.4} flip />
      </div>

      <PetalFall />
    </motion.div>
  );
}

/** 
 * SECTION 2: FAMILY BLESSINGS & NAMES CARD
 */
function BlessingSection() {
  return (
    <div className="relative h-svh shrink-0 z-50">
      <Image
        src="/templates/custom/template2/lotus-paper-bg.webp"
        alt="Texture"
        fill
        unoptimized
        className="object-cover object-top"
        style={{ zIndex: 0 }}
      />

      <div className="absolute top-0 left-0 right-0 h-full">
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100px", background: "linear-gradient(to bottom, rgba(0,0,0,0.1), transparent)", zIndex: 1, pointerEvents: "none" }}></div>


        <div className="absolute top-0 left-0 right-0 flex items-center justify-center h-full pt-4">
          <div className="relative" style={{ width: "88%", maxWidth: "380px" }}>
            <Image
              src="/templates/custom/template1/background-2.webp"
              alt="Card"
              width={800} height={1000}
              unoptimized
              className="w-full h-auto block"
              style={{ boxShadow: "0 8px 25px rgba(0,0,0,0.22), 0 4px 10px rgba(0,0,0,0.12)" }}
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-12">
              <div className="text-center mb-6">
                <p className="font-serif italic text-[#a37e4c]" style={{ fontSize: "clamp(1rem, 1.2rem, 1.4rem)", letterSpacing: "0.02em" }}>
                  “Blessed by the love of two families”
                </p>
                <p className="font-sans text-[#786141] mt-2 opacity-90" style={{ fontSize: "clamp(0.55rem, 0.7rem, 0.8rem)", fontWeight: 300, lineHeight: 1.5 }}>
                  With the grace of God and the blessings of our elders. We joyfully invite you to celebrate the union of
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <span className="font-serif italic text-[#8c7454] mb-2" style={{ fontSize: "clamp(0.65rem, 0.8rem, 0.9rem)" }}>
                  Son of Mr. Ashokbhai Gandubhai Bhalara and Mrs. Bhagwatiben Ashokbhai Bhalara
                </span>
                <h2 className="font-serif text-[#a37e4c] tracking-[0.12em]" style={{ fontSize: "clamp(2rem, 2.8rem, 3.5rem)", fontWeight: 300, lineHeight: 1 }}>
                  HARSHIL
                </h2>
              </div>
              <div className="my-2">
                <p className="font-serif italic text-[#8c7454] tracking-[0.2em]" style={{ fontSize: "clamp(0.8rem, 1rem, 1.2rem)" }}>WEDS</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <h2 className="font-serif text-[#a37e4c] tracking-[0.12em]" style={{ fontSize: "clamp(2rem, 2.8rem, 3.5rem)", fontWeight: 300, lineHeight: 1 }}>
                  KHUSHALI
                </h2>
                <span className="font-serif italic text-[#8c7454] mt-2" style={{ fontSize: "clamp(0.65rem, 0.8rem, 0.9rem)" }}>
                  Daughter of Mr. Jaysukhbhai Damjibhai Kapuriya and Mrs. Ushaben Jaysukhbhai Kapuriya
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

/** 
 * SECTION 3: SAVE THE DATE & COUNTDOWN
 * Animations refined: horizontal meeting only.
 */
/**
 * The hyacinth plate, split so the stems can move without the date moving
 * with them: the panel holds the oval and its gold rule, the twigs hold every
 * bloom and stalk. The cut is by colour - pink petal or olive stalk against
 * the oval's flat cream - with an opening pass afterwards, which is what
 * spares the oval's hairline rule from being taken for a stem. Both have the
 * white paper lifted out so the blooms sit on the section's own sheet.
 */
const SAVE_DATE_PANEL = "/templates/custom/template2/save-date-panel.webp";
const SAVE_DATE_TWIGS = "/templates/custom/template2/save-date-twigs.webp";

function SaveDateSection() {
  const [timeLeft, setTimeLeft] = useState({ days: "00", hours: "00", minutes: "00", seconds: "00" });

  useEffect(() => {
    const targetDate = new Date("2026-11-24T10:00:00").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      const d = Math.floor(distance / (1000 * 60 * 60 * 24));
      const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({
        days: String(d).padStart(2, "0"),
        hours: String(h).padStart(2, "0"),
        minutes: String(m).padStart(2, "0"),
        seconds: String(s).padStart(2, "0")
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative shrink-0 overflow-hidden" style={{ height: "100svh" }}>
      <Image
        src="/templates/custom/template2/lotus-paper-bg.webp"
        alt="Background"
        fill
        unoptimized
        className="object-cover object-top opacity-60"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-20" style={{ zIndex: 2, paddingBottom: "30%" }}>
        <div className="flex flex-col items-center w-full">
          {/* The oval holds still and the stems sway around it, turning on a
              pivot at the foot of the sheet where they enter it - so the
              blooms at the top travel and the roots do not. Slow and shallow
              on purpose: the wider the arc, the more of the repaired artwork
              behind a bloom swings into view. The oval's mark is measured on
              the art: x 0.17-0.65, y 0.295-0.775 of the sheet. */}
          <div className="relative w-[88%] max-w-[370px]">
            {/* The panel is what gives this box its height - the twigs over it
                are absolutely placed, so without it the card collapses and
                nothing in the section draws. */}
            <Image
              src={SAVE_DATE_PANEL}
              alt=""
              width={596}
              height={946}
              unoptimized
              priority
              aria-hidden
              className="w-full h-auto block"
            />

            <motion.div
              className="absolute inset-0 origin-[50%_100%]"
              animate={{ rotate: [-0.9, 0.8, -0.4, -0.9] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image
                src={SAVE_DATE_TWIGS}
                alt="Hyacinth blooms around the date"
                fill
                unoptimized
                priority
                className="object-contain"
              />
            </motion.div>

            <div
              className="absolute flex flex-col items-center justify-center text-center px-[6%]"
              style={{ left: "17%", right: "35%", top: "29.5%", bottom: "22.5%" }}
            >
              <p
                className="font-sans uppercase text-[#7d6a4a]"
                style={{ fontSize: "clamp(0.44rem, 2vw, 0.56rem)", letterSpacing: "0.32em" }}
              >
                Save the date
              </p>
              <span className="my-[6%] w-8 border-t border-[#c2ae82]" />
              <p
                className="font-serif leading-none text-[#4a3721]"
                style={{ fontSize: "clamp(1.9rem, 9vw, 2.6rem)" }}
              >
                24
              </p>
              <p
                className="mt-[5%] font-serif uppercase text-[#4a3721] leading-tight"
                style={{ fontSize: "clamp(0.6rem, 2.9vw, 0.8rem)", letterSpacing: "0.16em" }}
              >
                November
              </p>
              <p
                className="mt-[3%] font-sans text-[#7d6a4a]"
                style={{ fontSize: "clamp(0.52rem, 2.4vw, 0.66rem)", letterSpacing: "0.3em" }}
              >
                2026
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 w-[88%] mt-8">
            {[
              { label: "Days", value: timeLeft.days },
              { label: "Hours", value: timeLeft.hours },
              { label: "Minutes", value: timeLeft.minutes },
              { label: "Seconds", value: timeLeft.seconds }
            ].map((item, i) => (
              <React.Fragment key={item.label}>
                <div className="flex flex-col items-center">
                  <span className="font-serif text-[#4a3721]" style={{ fontSize: "clamp(1.2rem, 1.8rem, 2.5rem)", fontWeight: 400, lineHeight: 1 }}>
                    <b>{item.value}</b>
                  </span>
                  <span className="font-sans italic text-[#4a3721]" style={{ fontSize: "clamp(0.6rem, 0.8rem, 1rem)", letterSpacing: "0.15em", marginTop: "4px" }}>
                    <b>{item.label}</b>
                  </span>
                </div>
                {i < 3 && <div style={{ width: "1px", height: "3rem", background: "#4a3721", opacity: 0.5, flexShrink: 0 }}></div>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** The wedding's functions, in order. The card board below sizes itself to
 *  however many there are. */
/**
 * The three places the wedding runs across. `maps` is the plain q= embed form,
 * which needs no API key; `link` is what a tap opens in the Maps app. The
 * house is deliberately given no map of its own - it is where the family
 * lives, and the jaan leaves from there rather than guests arriving at it.
 */
const VENUES = {
  golden: {
    name: "Golden Villa Party Lawns",
    where: "Pal Road, Nr. Umiyadham, Jashvantpur, Rajkot",
    maps: "https://maps.google.com/maps?q=Golden+Villa+Party+lawns,+pal+road,+near+umiyadham,+Jashvantpur,+Rajkot,+Gujarat+360004&z=15&output=embed",
    link: "https://maps.app.goo.gl/BWhys4YFhCQjqCT66",
  },
  khodal: {
    name: "Raj Khodal Party Lawn",
    where: "Nr. Radhe Radhe Party Plot, Desai Chowk, Pal, Rajkot",
    maps: "https://maps.google.com/maps?q=Raj+Khodal+Party+lawn,+near+Radhe+Radhe+party+plot+Desai+chowk,+Rajkot,+Pal,+Gujarat+360004&z=15&output=embed",
    link: "https://maps.app.goo.gl/FugByTgm8b1dGMMN6",
  },
  home: {
    name: "Residence of the Bhalara family",
    where: "B-202, Haridwar Heaven, opp. Pratilok Party Plot, Nana Mauva Road, Rajkot",
  },
};

const EVENT_DATA = [
  {
    name: "Mandap Mahurat",
    image: "/templates/custom/template2/mandap-ganesh.webp",
    // The plate was painted landscape; its sky has been carried up and its
    // floor down to make it 2:3, which leaves the title clear sky at the head
    // and the verse clear stone at the foot, with the mandap between them.
    hero: { y: "11%" },
    quote: "\u201cAs the Manek Stambh stands tall and bright, it guards our love with sacred light. Join us as we lay the base, for a life filled with joy and grace.\u201d",
    date: "23/11/2026",
    time: "7:00AM",
    venue: VENUES.golden,
  },
  {
    name: "Haldi",
    image: "/templates/custom/template2/haldi-ceremony.webp",
    // This artwork already carries its own HALDI title, so the hero prints
    // only the date and time under it rather than setting the name twice.
    // Measured on the plate: its own lotus and HALDI run y 0.092-0.154 and the
    // groom's hair starts at 0.235, so the details sit centred in the clear
    // cream between the two. No wash at all - that band is already pale, and
    // any wash reaching up from the head of the sheet bleaches the painted
    // title, which is the whole reason this card does not print its own.
    hero: { y: "19.6%", wash: 0, titleInArt: true },
    quote: "\u201cA ritual where golden hues carry not just a glow, but blessing, love, laughter, and new beginnings.\u201d",
    date: "23/11/2026",
    time: "10:00AM",
    venue: VENUES.golden,
  },
  {
    name: "Dandiya Night",
    image: "/templates/custom/template2/dandiya-night.webp",
    // The hanging wisteria fills the head of this one and the couple stand
    // low in frame, so the title holds high with its scrim doing the work.
    hero: { y: "10%" },
    quote: "\u201cSteps in circles, dhol in the air, colour and laughter everywhere. Come dance the night with us.\u201d",
    date: "23/11/2026",
    // TODO: confirm the hour with the family before this goes out.
    time: "8:00PM",
    venue: VENUES.golden,
  },
  {
    name: "Jaan Prasthan",
    image: "/templates/custom/template2/jaan-prasthan.webp",
    // Trees fill the head of this one, so the title sits high with its scrim
    // doing the work; the verse lands on the bare ground at the foot.
    hero: { y: "11%" },
    quote: "\u201cDhol beats, dancing hearts, with music in the air and joy in every step, the groom\u2019s journey towards his forever begins.\u201d",
    date: "24/11/2026",
    time: "2:00PM",
    venue: VENUES.home,
  },
  {
    name: "Hast Melap",
    image: "/templates/custom/template2/hast-melap.webp",
    // The mandala plate it used to open on put the details in a disc halfway
    // down the sheet, where the pattern ran through them; the photograph
    // carries them at its head like every other card.
    hero: { y: "11%" },
    quote: "\u201cHand in hand with a promise to stay, side by side in every way, two separate souls now tied as one, a beautiful journey has just begun.\u201d",
    date: "24/11/2026",
    time: "4:00PM",
    venue: VENUES.khodal,
  },
];

/**
 * How many functions one board may hold. A card has to carry its name, date,
 * time, venue and verse; much under a third of the sheet and the verse starts
 * losing lines to the clip. Five functions therefore run over two boards
 * rather than being squeezed onto one. slotRect sizes cards off this too, so
 * the number governs both the cut and the card height.
 */
const BOARD_SIZE = 3;

const EVENT_BOARDS = EVENT_DATA.reduce((boards, event, i) => {
  if (i % BOARD_SIZE === 0) boards.push([]);
  boards[boards.length - 1].push(event);
  return boards;
}, []);

const EVENTS_BG = "/templates/custom/template2/lotus-events-bg.webp";

/**
 * The artwork's cards are bitten out at each corner by a small circle. Four
 * radial gradients intersected reproduce that scoop; a chamfer would read as
 * a different shape at this size.
 */
function scoopMask(radius) {
  const corners = ["0% 0%", "100% 0%", "100% 100%", "0% 100%"];
  const layers = corners
    .map((at) => `radial-gradient(circle ${radius} at ${at}, transparent 98%, #000 100%)`)
    .join(", ");
  return {
    WebkitMaskImage: layers,
    maskImage: layers,
    WebkitMaskComposite: "source-in",
    maskComposite: "intersect",
  };
}

/** The line-art lotus the artwork uses as a mark and between cards. */
function LotusMark({ className = "", color = "#c98fa2" }) {
  return (
    <svg viewBox="0 0 40 22" className={className} fill="none" aria-hidden>
      <g stroke={color} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 3c-2.4 3.1-3.5 6.4-3.5 9.4 0 3 1.3 5.6 3.5 7.3 2.2-1.7 3.5-4.3 3.5-7.3 0-3-1.1-6.3-3.5-9.4Z" />
        <path d="M16.6 19.7c-2.8-.5-5-1.9-6.4-3.9-1.4-2-1.9-4.5-1.4-7 2.5.6 4.6 1.9 6 3.7" />
        <path d="M23.4 19.7c2.8-.5 5-1.9 6.4-3.9 1.4-2 1.9-4.5 1.4-7-2.5.6-4.6 1.9-6 3.7" />
        <path d="M20 19.7c-3.3 0-6.2-.7-8.6-2.1M20 19.7c3.3 0 6.2-.7 8.6-2.1" />
      </g>
    </svg>
  );
}

/** Dotted rule with a lotus at its centre, as between the artwork's cards. */
function CardDivider() {
  return (
    <div className="flex items-center justify-center gap-2 py-3" aria-hidden>
      <span className="w-1 h-1 rounded-full bg-[#e2a0ae]" />
      <span className="flex-1 max-w-[70px] border-t border-dashed border-[#9aa585]/60" />
      <LotusMark className="w-7 h-4" color="#7f9169" />
      <span className="flex-1 max-w-[70px] border-t border-dashed border-[#9aa585]/60" />
      <span className="w-1 h-1 rounded-full bg-[#e2a0ae]" />
    </div>
  );
}

/**
 * Where a function is held, set under its date. A venue with a map is a link -
 * one tap from the function to the way there, so nobody has to carry a mapping
 * of function to place in their head. The house has no map, so it reads as
 * plain text.
 */
function VenueLine({ venue }) {
  const body = (
    <>
      <span className="font-serif font-bold text-[#7a6234]">{venue.name}</span>
      <span className="block font-sans font-medium text-[#7f6a3f] leading-snug">
        {venue.where}
      </span>
    </>
  );
  const style = { fontSize: "clamp(0.56rem, 2.7vw, 0.7rem)" };
  return venue.link ? (
    <a
      href={venue.link}
      target="_blank"
      rel="noopener noreferrer"
      className="relative mt-1 block text-center underline decoration-[#bfae82] decoration-dotted underline-offset-[3px]"
      style={style}
    >
      {body}
    </a>
  ) : (
    <p className="relative mt-1.5 text-center" style={style}>
      {body}
    </p>
  );
}

/** Where each card comes to rest on the board, as % of the stage. */
function slotRect(index, total) {
  // The deeper bottom margin keeps the last card clear of the floating
  // sound button, which sits in that corner.
  const TOP = 4, BOTTOM = 10, LEFT = 6, WIDTH = 88, GAP = 2;
  // Height comes from a full board, not from this board's count, so a card on
  // the short second board is the same size as one on the first; the pair is
  // then centred in the sheet rather than left hanging from the top.
  const span = 100 - TOP - BOTTOM;
  const height = (span - GAP * (BOARD_SIZE - 1)) / BOARD_SIZE;
  const used = total * height + GAP * (total - 1);
  const top = TOP + (span - used) / 2 + index * (height + GAP);
  return { top, left: LEFT, width: WIDTH, height };
}

/**
 * One function, told twice over: the artwork takes the whole screen with the
 * headline sitting in its calm spot, then folds down into its own slot on the
 * board - and stays there, so the board fills up as you read down and ends
 * showing every function together.
 *
 * Every animated length is expressed in one unit (% or svh) so framer can
 * interpolate it - mixing px and svh would silently freeze the morph.
 */
function EventCard({ event, index, total, progress }) {
  // Each function owns one slice of the section's scroll. The half-slice of
  // slack on the end is the beat that holds on the finished board.
  const span = 1 / (total + 0.5);
  const start = index * span;
  const at = (f) => start + span * f;

  // The first card is already on screen when the section arrives.
  const appear = index === 0 ? [-1, 0] : [at(-0.05), at(0.05)];
  const morph = [at(0.42), at(0.82)];

  const slot = slotRect(index, total);
  const enter = useTransform(progress, appear, [0, 1]);
  const top = useTransform(progress, morph, ["0svh", `${slot.top}svh`]);
  const left = useTransform(progress, morph, ["0%", `${slot.left}%`]);
  const width = useTransform(progress, morph, ["100%", `${slot.width}%`]);
  const height = useTransform(progress, morph, ["100svh", `${slot.height}svh`]);
  const pad = useTransform(progress, morph, ["0%", "3%"]);
  const gap = useTransform(progress, morph, ["0%", "4%"]);
  const frameW = useTransform(progress, morph, ["100%", "34%"]);
  const textW = useTransform(progress, morph, ["0%", "62%"]);

  const heroOpacity = useTransform(progress, [at(0.30), at(0.46)], [1, 0]);
  const chromeOpacity = useTransform(progress, [at(0.55), at(0.80)], [0, 1]);
  const cardOpacity = useTransform(progress, [at(0.64), at(0.86)], [0, 1]);

  return (
    <motion.div
      className="absolute"
      style={{ top, left, width, height, opacity: enter, zIndex: index + 1 }}
    >
      {/* Card chrome, absent while the artwork owns the screen. */}
      <motion.div
        className="absolute inset-0 bg-[#fdf8ef] shadow-[0_6px_20px_-12px_rgba(90,96,70,0.5)]"
        style={{ opacity: chromeOpacity, ...scoopMask("13px") }}
        aria-hidden
      />
      <motion.div
        className="absolute inset-[8px] border border-dashed border-[#c9c0a6]"
        style={{ opacity: chromeOpacity, ...scoopMask("8px") }}
        aria-hidden
      />

      <motion.div
        className="relative flex items-center h-full overflow-hidden"
        style={{ gap, padding: pad }}
      >
        <motion.div
          className="relative shrink-0 overflow-hidden h-full"
          style={{ width: frameW, ...scoopMask("7px") }}
        >
          <Image
            src={event.image}
            alt={event.name}
            fill
            unoptimized
            priority={index === 0}
            className="object-cover"
          />

          {/* Light down the head of the plate, which is what the details are
              read against. A disc of scrim behind the block worked on pale
              artwork and showed as a pasted panel on dark - foliage, a lit
              dance floor - where it also had to be near opaque to carry the
              text at all. A wash from the top edge reads as light instead,
              and covers every line without drawing a shape of its own.
              `wash` turns it down where the artwork carries its own title and
              would be bleached by a full one. */}
          <motion.div
            className="absolute inset-x-0 top-0 h-[46%] pointer-events-none"
            style={{
              opacity: heroOpacity,
              background: `linear-gradient(to bottom, rgba(253,248,239,${
                event.hero.wash ?? 0.95
              }) 0%, rgba(253,248,239,${
                (event.hero.wash ?? 0.95) * 0.95
              }) 20%, rgba(253,248,239,0) 100%)`,
            }}
            aria-hidden
          />

          {/* Headline, while the artwork is full screen. */}
          <motion.div
            className="absolute flex flex-col items-center text-center px-8"
            style={{
              left: event.hero.x || "50%",
              top: event.hero.y,
              width: event.hero.width || "100%",
              opacity: heroOpacity,
              transform: "translate(-50%, -50%)",
            }}
          >
            {!event.hero.titleInArt && (
              <h3
                className="relative font-serif uppercase tracking-[0.22em] text-[#7a6234]"
                style={{ fontSize: "clamp(1.05rem, 5.4vw, 1.6rem)" }}
              >
                {event.name}
              </h3>
            )}
            <div className="relative mt-2 flex items-center gap-2.5">
              <p className="font-serif font-semibold text-[#7a6234]" style={{ fontSize: "clamp(0.68rem, 3.2vw, 0.85rem)" }}>
                {event.date}
              </p>
              <span className="w-px h-4 bg-[#bfae82]" />
              <p className="font-serif font-semibold tracking-wide text-[#7a6234]" style={{ fontSize: "clamp(0.68rem, 3.2vw, 0.85rem)" }}>
                {event.time}
              </p>
            </div>
            <VenueLine venue={event.venue} />
          </motion.div>

          {/* The verse rides the foot of the full-screen artwork. */}
          <motion.div
            className="absolute inset-x-0 bottom-[17%] px-10 text-center"
            style={{ opacity: heroOpacity }}
          >
            {/* The verse lands wherever the artwork happens to be busiest, so
                the scrim has to carry it over a dark saree as well as sky. */}
            {/* Sized wider than the block it backs: a default-radius ellipse
                runs out of opacity before the ends of the lines, which is
                what left the last word of the verse floating. */}
            <div className="absolute -inset-x-4 -inset-y-7 bg-[radial-gradient(ellipse_118%_130%_at_50%_50%,rgba(253,248,239,0.97)_52%,rgba(253,248,239,0)_100%)]" />
            <p
              className="relative font-sans italic text-[#5e5138] leading-relaxed"
              style={{ fontSize: "clamp(0.62rem, 3vw, 0.78rem)" }}
            >
              {event.quote}
            </p>
          </motion.div>
        </motion.div>

        {/* The same details, once the artwork has taken its place in the card. */}
        <motion.div
          className="min-w-0 text-center overflow-hidden"
          style={{ width: textW, opacity: cardOpacity }}
        >
          <h3
            className="font-serif font-bold uppercase tracking-[0.16em] text-[#4d5b37] leading-tight whitespace-nowrap"
            style={{ fontSize: "clamp(0.72rem, 3.4vw, 0.92rem)" }}
          >
            {event.name}
          </h3>
          <LotusMark className="w-7 h-4 mx-auto my-1.5" />
          <div className="flex items-center justify-center gap-2">
            <p className="font-serif font-semibold text-[#7a6234] whitespace-nowrap" style={{ fontSize: "clamp(0.56rem, 2.7vw, 0.7rem)" }}>
              {event.date}
            </p>
            <span className="w-px h-3.5 bg-[#c0b795]" />
            <p className="font-serif font-semibold tracking-wide text-[#7a6234] whitespace-nowrap" style={{ fontSize: "clamp(0.56rem, 2.7vw, 0.7rem)" }}>
              {event.time}
            </p>
          </div>
          <p
            className="mt-0.5 font-serif font-semibold text-[#7a6234] truncate"
            style={{ fontSize: "clamp(0.52rem, 2.5vw, 0.64rem)" }}
          >
            {event.venue.name}
          </p>
          <p
            className="mt-1.5 font-sans text-[#6f7358] leading-snug overflow-hidden"
            style={{
              fontSize: "clamp(0.5rem, 2.4vw, 0.62rem)",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 4,
            }}
          >
            {event.quote}
          </p>
        </motion.div>
      </motion.div>

      {index < total - 1 && (
        <motion.div
          className="absolute inset-x-0 top-full"
          style={{ opacity: chromeOpacity }}
          aria-hidden
        >
          <CardDivider />
        </motion.div>
      )}
    </motion.div>
  );
}

/**
 * SECTION 4: FUNCTIONS
 * One board, held still, that the functions fold down onto one after another.
 * The list drives the layout, so a fifth function needs no new markup - it
 * just makes every slot a little shorter.
 */
function EventDetailsSection({ containerRef, events }) {
  const ref = useRef(null);
  const total = events.length;
  const { scrollYProgress } = useScroll({
    target: ref,
    container: containerRef,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.35,
  });

  return (
    <section
      ref={ref}
      className="relative w-full shrink-0 bg-[#d6d5c0]"
      style={{ height: `${total * 130 + 100}svh`, zIndex: 60 }}
    >
      {/* Held still while the functions fold onto it, so the painting keeps
          its composition instead of being stretched over the whole section. */}
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <Image
          src={EVENTS_BG}
          alt=""
          fill
          unoptimized
          aria-hidden
          className="object-cover object-left-bottom"
        />
        {events.map((event, idx) => (
          <EventCard
            key={event.name}
            event={event}
            index={idx}
            total={total}
            progress={progress}
          />
        ))}
      </div>
    </section>
  );
}


/**
 * SECTION 5: LOCATION
 * Stripped back to the map and the way there, on the lotus paper. The paper's
 * own dragonfly has been lifted off the sheet so it can leave its corner.
 */

/** The sheet with the dragonfly taken out, and the insect on its own. */
/**
 * The two numbers from the card's own line, which is set in Gujarati
 * numerals. TODO: confirm these digit for digit before the invitation goes
 * out - they were read off a decorative face, and a wrong one here is a
 * guest who cannot reach the family.
 */
const INVITEE_PHONES = ["98790 73560", "88555 44945"];

const PAPER_PLATE = "/templates/custom/template2/lotus-paper-plate.webp";
const DRAGONFLY = "/templates/custom/template2/dragonfly.webp";

/**
 * A wandering loop rather than a straight drift: waypoints of unequal spacing
 * and timing, so it never reads as a repeating circuit. It rides below the
 * map card, which lets it pass behind rather than crawl across the map.
 */
function Dragonfly() {
  return (
    <motion.div
      className="absolute w-[23%] max-w-[110px] z-10 pointer-events-none"
      initial={{ left: "4%", top: "9%", rotate: 0 }}
      animate={{
        left: ["4%", "58%", "74%", "36%", "8%", "48%", "4%"],
        top: ["9%", "4%", "38%", "72%", "58%", "84%", "9%"],
        rotate: [0, 22, -8, 26, -14, 10, 0],
      }}
      transition={{
        duration: 38,
        times: [0, 0.17, 0.33, 0.52, 0.68, 0.85, 1],
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {/* Wingbeat, fast and shallow, independent of where it is going. */}
      <motion.img
        src={DRAGONFLY}
        alt=""
        aria-hidden
        className="w-full h-auto select-none drop-shadow-[0_2px_4px_rgba(120,100,90,0.15)]"
        animate={{ scaleY: [1, 0.93, 1, 0.96, 1], scaleX: [1, 1.02, 1, 1.01, 1] }}
        transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}

/**
 * SECTION 6: THE INVITATION ITSELF
 * The last sheet, after the way there: who is doing the inviting, set on the
 * pink panel painted into the plate -
 * measured on it at x 0.070-0.693, y 0.208-0.833, with the text inset from
 * that so no line runs up against a painted edge. The lotus on the right of
 * the plate is the reason the panel is off-centre, and the reason the block
 * is too.
 */
const INVITEES_BG = "/templates/custom/template2/invitees-bg.webp";

function InviteesSection() {
  return (
    <div className="relative h-svh shrink-0 z-50 overflow-hidden bg-[#efece7]">
      <Image
        src={INVITEES_BG}
        alt=""
        fill
        unoptimized
        aria-hidden
        className="object-cover"
      />

      <div
        className="absolute flex flex-col items-center justify-center text-center"
        style={{ left: "10%", right: "33.7%", top: "24%", bottom: "20%" }}
      >
        <Image
          src={MONOGRAM_PLATE}
          alt="Harshil ke jeevan ki khili Khushali"
          width={807}
          height={961}
          unoptimized
          className="w-auto mb-2 select-none"
          // Sized off the screen's height, not its width: the panel is a fixed
          // share of the height, so on a short phone the plate gives way first.
          style={{ height: "clamp(52px, 15svh, 88px)" }}
        />

        <p
          className="font-serif italic text-[#8c5a63] leading-relaxed"
          style={{ fontSize: "clamp(0.66rem, 3.1vw, 0.82rem)" }}
        >
          &ldquo;A wedding is not one day in two lives, but two families
          standing together and saying come, be with us.&rdquo;
        </p>

        <span className="my-3 w-10 border-t border-[#d8a7b2]" />

        <p
          className="font-sans uppercase text-[#a8707e]"
          style={{ fontSize: "clamp(0.46rem, 2.1vw, 0.58rem)", letterSpacing: "0.34em" }}
        >
          With warm regards
        </p>

        <h3
          className="mt-3 font-serif font-semibold text-[#7d3f4d] leading-snug"
          style={{ fontSize: "clamp(0.82rem, 3.9vw, 1rem)" }}
        >
          Mr. Ashokbhai Gandubhai Bhalara
        </h3>
        <p
          className="font-serif italic text-[#a8707e] my-1"
          style={{ fontSize: "clamp(0.6rem, 2.8vw, 0.72rem)" }}
        >
          &amp;
        </p>
        <h3
          className="font-serif font-semibold text-[#7d3f4d] leading-snug"
          style={{ fontSize: "clamp(0.82rem, 3.9vw, 1rem)" }}
        >
          Mrs. Bhagwatiben Ashokbhai Bhalara
        </h3>

        <p
          className="mt-4 font-sans uppercase text-[#a8707e]"
          style={{ fontSize: "clamp(0.5rem, 2.3vw, 0.62rem)", letterSpacing: "0.3em" }}
        >
          Varudi Enterprise
        </p>

        <div className="mt-3 flex flex-col items-center gap-1">
          {INVITEE_PHONES.map((number) => (
            <a
              key={number}
              href={`tel:+91${number.replace(/\s/g, "")}`}
              className="font-serif font-semibold text-[#8c5a63] tracking-wide"
              style={{ fontSize: "clamp(0.68rem, 3.2vw, 0.84rem)" }}
            >
              {number}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * SECTION 5 closes on the two lawns. A single iframe cannot carry two pins
 * without a Maps API key, so the frame holds one at a time and the pair of
 * venues under it both switches the map and offers the way there - one map,
 * either venue, never a guest sent to the wrong lawn. Raj Khodal leads: the
 * hast melap is the wedding itself, so it is the address most guests want.
 */
const MAP_VENUES = [VENUES.khodal, VENUES.golden];
const VENUE_FUNCTIONS = {
  // "Wedding" rather than "Hast Melap": a guest who does not know the ritual
  // name should still be able to tell which lawn the wedding itself is at.
  "Raj Khodal Party Lawn": "Wedding",
  "Golden Villa Party Lawns": "Mandap Mahurat \u00b7 Haldi \u00b7 Dandiya Night",
};

function LocationSection() {
  const [shown, setShown] = useState(0);

  return (
    <div className="relative h-svh shrink-0 z-50 overflow-hidden bg-[#f0e6d8]">
      <Image
        src={PAPER_PLATE}
        alt=""
        fill
        unoptimized
        aria-hidden
        className="object-cover"
      />

      <Dragonfly />

      <div className="relative z-30 h-full flex flex-col items-center justify-center px-[10%]">
        <h2 className="font-serif text-[#8a6f45] text-[0.72rem] tracking-[0.42em] uppercase mb-8">
          <b>Location</b>
        </h2>

        <div
          className="relative w-full aspect-[4/3] max-w-[330px] bg-white rounded-md overflow-hidden"
          style={{ boxShadow: "rgba(90, 70, 50, 0.22) 0px 6px 26px" }}
        >
          <iframe
            key={MAP_VENUES[shown].name}
            src={MAP_VENUES[shown].maps}
            title={MAP_VENUES[shown].name}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        <div className="w-full max-w-[330px] mt-5 flex flex-col gap-2.5">
          {MAP_VENUES.map((venue, i) => (
            <div
              key={venue.name}
              onClick={() => setShown(i)}
              // Both venues read as the same card; which one the map is
              // showing is carried by the border and the lift, not by giving
              // one of them a panel and leaving the other on bare paper.
              className={`rounded-md px-4 py-3 text-center cursor-pointer bg-[#f7efe2] border transition-all ${
                i === shown ? "border-[#c7b48c]" : "border-[#c7b48c]/35"
              }`}
              style={{
                boxShadow:
                  i === shown
                    ? "rgba(90, 70, 50, 0.22) 0px 5px 18px"
                    : "rgba(90, 70, 50, 0.1) 0px 2px 8px",
              }}
            >
              <h3 className="font-serif text-[#8a6f45] text-[0.92rem] leading-tight">
                <b>{venue.name}</b>
              </h3>
              <p className="font-sans text-[#a08a63] text-[0.6rem] leading-snug mt-0.5">
                <b>{venue.where}</b>
              </p>
              <p className="font-sans text-[#9a8560] text-[0.55rem] italic mt-1">
                <b>{VENUE_FUNCTIONS[venue.name]}</b>
              </p>
              <a
                href={venue.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-block mt-2.5 px-4 py-2 bg-[#3d2310] text-white font-sans text-[9px] uppercase tracking-[0.2em] rounded-full"
              >
                Get Directions
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * CONTAINER COMPONENT
 */
/**
 * The five drapes, graded: pastel pink on the curve that falls first, each one
 * behind it a step lighter, the last left as template1's cream so the stack
 * reads as a wash running off to white.
 *
 * One file per step rather than a tint laid over a single asset at runtime,
 * because the tint has to go under the gold scalloped edge, not over it - each
 * is the cream original multiplied by its own pink, which darkens the panel
 * and leaves the gold as gold. template1 still uses the untouched original.
 */
const CURTAINS = [0, 1, 2, 3, 4].map(
  (i) => `/templates/custom/template2/curtain-${i}.webp`
);

function InvitationContent({ curtainPhase }) {
  const scrollContainerRef = useRef(null);

  // The sections that used to hang off a global scroll spring now carry their
  // own motion, so nothing reads the container's progress at this level; the
  // events board still tracks it through the ref it is handed.

  return (
    <motion.div
      ref={scrollContainerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 w-full h-full max-w-[430px] mx-auto bg-[#fdf8f0] shadow-2xl overflow-y-auto overflow-x-hidden z-10 scroll-smooth"
    >
      <ShlokaSection curtainPhase={curtainPhase} />
      <ArchSection curtainPhase={curtainPhase} />
      <AlternativeBlessingSection />
      <SaveDateSection />
      {/* Five functions over two boards - see BOARD_SIZE. */}
      {EVENT_BOARDS.map((events, i) => (
        <EventDetailsSection key={i} containerRef={scrollContainerRef} events={events} />
      ))}
      <LocationSection />
      <InviteesSection />

      {/* CURTAIN ANIMATION */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {[0, 1, 2, 3, 4].map((index) => {
          const targetTop = (index * 22) - 8;
          let topVal = curtainPhase === 1 ? `${targetTop}%` : "-120%";
          let delayTime = curtainPhase === 1 ? index * 0.25 : (4 - index) * 0.25;
          return (
            <motion.div
              key={index}
              className="absolute w-[130%] left-[-15%]"
              style={{ zIndex: 20 - index, filter: "drop-shadow(0px 8px 10px rgba(0,0,0,0.15))" }}
              initial={{ top: "-120%" }}
              animate={{ top: topVal }}
              transition={{ duration: 1.0, ease: [0.4, 0, 0.2, 1], delay: delayTime }}
            >
              <Image src={CURTAINS[index]} alt="Curtain" width={1000} height={1000} unoptimized />
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

// Rename the original blessing section to avoid issues if I accidentally duplicate
const AlternativeBlessingSection = BlessingSection;

/**
 * The opening screen while the plates load: a lotus unfolding a petal at a
 * time over a ripple, with hearts drifting up off it. Petals open from the
 * centre outwards, the outer ring paler so the flower reads as having depth.
 */
const LOADER_PETALS = [
  { angle: -66, fill: "#f6d3dc", delay: 0.75 },
  { angle: 66, fill: "#f6d3dc", delay: 0.75 },
  { angle: -44, fill: "#eeb3c2", delay: 0.5 },
  { angle: 44, fill: "#eeb3c2", delay: 0.5 },
  { angle: -22, fill: "#e095a9", delay: 0.25 },
  { angle: 22, fill: "#e095a9", delay: 0.25 },
  { angle: 0, fill: "#d27a92", delay: 0 },
];
const LOADER_PETAL = "M0 0C-11-12-12-34 0-50C12-34 11-12 0 0Z";

const LOADER_HEARTS = [
  { x: -46, size: 9, delay: 0, secs: 4.2 },
  { x: 38, size: 12, delay: 1.1, secs: 4.8 },
  { x: -18, size: 7, delay: 2.2, secs: 3.9 },
  { x: 54, size: 8, delay: 2.9, secs: 4.4 },
  { x: 12, size: 10, delay: 3.6, secs: 5 },
];
const HEART = "M12 21s-7.5-4.6-9.6-9.2C.8 8.2 3 4.5 6.6 4.5c2.2 0 3.7 1.2 5.4 3.2 1.7-2 3.2-3.2 5.4-3.2 3.6 0 5.8 3.7 4.2 7.3C19.5 16.4 12 21 12 21Z";

function LotusLoader({ progress }) {
  return (
    <div className="relative flex flex-col items-center">
      <div className="relative w-40 h-36">
        {/* Hearts rising off the bloom, each on its own loop. */}
        {LOADER_HEARTS.map(({ x, size, delay, secs }, i) => (
          <motion.svg
            key={i}
            viewBox="0 0 24 24"
            className="absolute left-1/2 bottom-12"
            style={{ width: size, height: size, marginLeft: x - size / 2 }}
            initial={{ y: 0, opacity: 0, scale: 0.6 }}
            animate={{ y: -110, opacity: [0, 0.9, 0.9, 0], scale: [0.6, 1, 1, 0.8], x: [0, 6, -6, 3] }}
            transition={{ duration: secs, delay, repeat: Infinity, ease: "easeOut" }}
            aria-hidden
          >
            <path d={HEART} fill="#e6a2b3" />
          </motion.svg>
        ))}

        <svg viewBox="0 0 160 144" className="absolute inset-0 w-full h-full overflow-visible" aria-hidden>
          {/* Ripples on the water the flower sits on. */}
          {[0, 1, 2].map((i) => (
            <motion.ellipse
              key={i}
              cx="80"
              cy="112"
              rx="34"
              ry="7"
              fill="none"
              stroke="#c9a8ae"
              strokeWidth="0.8"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: [0.5, 1.9], opacity: [0, 0.7, 0] }}
              transition={{ duration: 3.6, delay: i * 1.2, repeat: Infinity, ease: "easeOut" }}
              style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
            />
          ))}

          {/* Leaves either side of the stem. */}
          <path d="M80 110C64 104 46 106 34 114C50 118 68 117 80 110Z" fill="#9aae86" opacity="0.85" />
          <path d="M80 110C96 104 114 106 126 114C110 118 92 117 80 110Z" fill="#8a9f75" opacity="0.85" />

          {/* The bloom: unfolds once, then breathes. */}
          <motion.g
            animate={{ scale: [1, 1.035, 1] }}
            transition={{ duration: 3.2, delay: 1.6, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
          >
            {LOADER_PETALS.map(({ angle, fill, delay }) => (
              <g key={angle} transform={`translate(80 108) rotate(${angle})`}>
                <motion.path
                  d={LOADER_PETAL}
                  fill={fill}
                  stroke="#c46a84"
                  strokeWidth="0.6"
                  strokeOpacity="0.45"
                  initial={{ scaleY: 0, scaleX: 0.4, opacity: 0 }}
                  animate={{ scaleY: 1, scaleX: 1, opacity: 1 }}
                  transition={{ duration: 0.9, delay, ease: [0.22, 0.61, 0.24, 1] }}
                  style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
                />
              </g>
            ))}
            <motion.circle
              cx="80"
              cy="104"
              r="3.2"
              fill="#d8b46a"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.6, 1] }}
              transition={{ duration: 2.4, delay: 1, repeat: Infinity, repeatType: "mirror" }}
            />
          </motion.g>
        </svg>
      </div>

      <p className="mt-3 font-serif italic text-[#7d3f4d] text-xl">Harshil &amp; Khushali</p>
      <p className="mt-2 text-[0.6rem] tracking-[0.4em] uppercase text-[#a8707e]">
        A celebration of love
      </p>

      <div className="mt-6 w-36 h-px bg-[#ead3d8] overflow-hidden rounded-full">
        <motion.div
          className="h-full bg-[#c0738a]"
          animate={{ width: `${progress}%` }}
          transition={{ ease: "easeOut", duration: 0.3 }}
        />
      </div>
    </div>
  );
}

/**
 * The invitation, whole. It still takes a `data` prop and still ignores it:
 * everything is written into this file, and the prop is the hook that was
 * there when the same component served several weddings from one database.
 */
export default function Invitation({ data: _data }) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [doorOpened, setDoorOpened] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [curtainPhase, setCurtainPhase] = useState(0);

  // Audio controller
  const audioController = useAudioController();

  useEffect(() => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      // Paced so the loader's lotus has opened fully before the door replaces it.
      currentProgress += Math.floor(Math.random() * 8) + 4;
      if (currentProgress >= 100) {
        setProgress(100);
        clearInterval(interval);
        setTimeout(() => setIsLoading(false), 600);
      } else { setProgress(currentProgress); }
    }, 200);
    return () => clearInterval(interval);
  }, []);

  // The music is asked for the moment the door is on screen, not once it has
  // been opened; where the browser refuses it until the page is touched, the
  // controller takes the first touch anywhere instead. See armAutoplay.
  const { armAutoplay } = audioController;
  useEffect(() => {
    if (!isLoading) armAutoplay();
  }, [isLoading, armAutoplay]);

  // Handle door tap - swings the doors, then hands the screen over to the
  // invitation once the camera has walked through.
  const handleDoorTap = () => {
    if (doorOpened) return;
    setDoorOpened(true);
    setTimeout(() => {
      setHasEntered(true);
      setCurtainPhase(1);
      setTimeout(() => setCurtainPhase(2), 3800);
    }, GATE_MS);
  };

  return (
    <main className="relative w-full h-dvh bg-[#fdfaf5] flex justify-center items-center overflow-hidden">
      {/* Sound control, up from the moment the door is on screen. Muting
          before the music has started is honoured - playBackgroundMusic
          refuses while muted - so a reader on a quiet phone can come in
          silently by tapping this first. */}
      {!isLoading && (
        <button
          onClick={audioController.toggleMute}
          className="fixed bottom-4 right-4 z-50 w-14 h-14 rounded-full bg-white/40 backdrop-blur-md shadow-lg border border-[#a37e4c]/30 flex items-center justify-center hover:bg-white/50 transition-all"
          aria-label="Toggle Sound"
        >
          {audioController.isMuted ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a37e4c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="1" y1="1" x2="23" y2="23"></line>
              <path d="M9 9v6a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
              <path d="M17 16.95A7 7 0 0 1 5 12v-2m0 0V7a7 7 0 0 1 12-5"></path>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a37e4c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V5l12-2v13"></path>
              <circle cx="6" cy="18" r="3"></circle>
              <circle cx="18" cy="16" r="3"></circle>
            </svg>
          )}
        </button>
      )}
      <AnimatePresence>
        {isLoading && (
          <motion.div key="preloader" exit={{ opacity: 0 }} className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#fdfaf5]">
            <LotusLoader progress={progress} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isLoading && !hasEntered && (
          <LotusDoorGate open={doorOpened} onTap={handleDoorTap} />
        )}
      </AnimatePresence>

      {hasEntered && <InvitationContent curtainPhase={curtainPhase} />}
    </main>
  );
}
