const ease = 'cubic-bezier(.37,0,.63,1)';
const rise = 'cubic-bezier(.22,.61,.36,1)';
const fall = 'cubic-bezier(.55,.06,.82,.48)';
const settle = 'cubic-bezier(.2,.8,.2,1)';
const poseFrame = (offset, x = 0, y = 0, angle = 0, sx = 1, sy = 1, easing = ease) => ({
  offset, transform: `translate(${x}px, ${y}px) rotate(${angle}deg) scale(${sx}, ${sy})`, easing,
});
const neutral = offset => poseFrame(offset);

// Each action has its own timing: anticipation, movement, then a softer settle.
// Greeting and landing finish; quiet actions and the suspended body keep moving.
const tracks = {
  idle: { duration: 5200, frames: [neutral(0), poseFrame(.48, 0, -.4, .5), neutral(1)] },
  received: { duration: 1080, iterations: 1, frames: [neutral(0), poseFrame(.18, 0, 1, -1, 1.018, .978, rise),
    poseFrame(.44, 0, -3.5, -2.5, .99, 1.018), poseFrame(.7, 0, -.5, 1), neutral(1)] },
  writing: { duration: 2100, frames: [neutral(0), poseFrame(.2, 0, .8, -1.6),
    poseFrame(.36, 0, .2, -.6), poseFrame(.53, 0, 1, -1.3), poseFrame(.76, 0, -.4, 1), neutral(1)] },
  complete: { duration: 1250, iterations: 2, frames: [neutral(0), poseFrame(.16, 0, 1, -1, 1.02, .975, rise),
    poseFrame(.4, 0, -5, -2.4, .99, 1.02, fall), poseFrame(.64, 0, .8, 1.8, 1.015, .985, settle),
    poseFrame(.82, 0, -.6, -.6), neutral(1)] },
  error: { duration: 1800, iterations: 1, frames: [neutral(0), poseFrame(.25, -.5, .6, -2.5),
    poseFrame(.55, .4, .3, 1.3), poseFrame(.78, 0, .2, -.6), neutral(1)] },
  tea: { duration: 4200, frames: [neutral(0), poseFrame(.3, 0, -1.2, -1.8),
    poseFrame(.55, 0, -1, -1.4), poseFrame(.8, 0, .3, .7), neutral(1)] },
  reading: { duration: 4800, frames: [neutral(0), poseFrame(.35, -.3, -.6, -1.5),
    poseFrame(.7, .3, .2, .8), neutral(1)] },
  origami: { duration: 2800, frames: [neutral(0), poseFrame(.22, 0, .8, -1),
    poseFrame(.4, 0, .1, -.3), poseFrame(.6, 0, 1, .8), poseFrame(.8, 0, -.3, -.5), neutral(1)] },
  duck: { duration: 2700, frames: [neutral(0), poseFrame(.25, -1, -1.2, -3),
    poseFrame(.5, 0, .2), poseFrame(.75, 1, -1.2, 3), neutral(1)] },
  stretch: { duration: 2700, iterations: 1, frames: [neutral(0), poseFrame(.15, 0, 1, 0, 1.015, .985, rise),
    poseFrame(.48, 0, -2.8, -1, .986, 1.035), poseFrame(.65, 0, -2.3, .5, .99, 1.025, settle),
    poseFrame(.86, 0, .4, 0, 1.008, .992), neutral(1)] },
  rest: { duration: 6400, bridge: 340, frames: [neutral(0), poseFrame(.4, 0, -.8, -.65, .998, 1.004),
    poseFrame(.73, 0, .3, .3), neutral(1)] },
  gift: { duration: 1800, iterations: 1, frames: [neutral(0), poseFrame(.18, 0, .6, -1, 1.012, .988, rise),
    poseFrame(.45, 0, -3, -2.5, .995, 1.015), poseFrame(.72, 0, -.4, 1.2), neutral(1)] },
  lifted: { duration: 1020, origin: '50% 24%', frames: [poseFrame(0, 0, -7),
    poseFrame(.24, 0, -6.1, -5.5), poseFrame(.5, 0, -7.2), poseFrame(.76, 0, -6.1, 5.5), poseFrame(1, 0, -7)] },
  land: { duration: 820, bridge: 100, iterations: 1, frames: [poseFrame(0, 0, -6, 0, 1, 1.012, fall),
    poseFrame(.24, 0, 1.5, 0, 1.035, .955, rise), poseFrame(.5, 0, -1.7, -.7, .99, 1.022, fall),
    poseFrame(.73, 0, .5, .3, 1.008, .988, settle), neutral(1)] },
  wave: { duration: 680, bridge: 100, iterations: 2, frames: [neutral(0),
    poseFrame(.23, -.3, -1.8, -3.7), poseFrame(.58, .3, -.6, 2.7), poseFrame(.82, 0, -.3, -1), neutral(1)] },
  peek: { duration: 620, iterations: 1, frames: [neutral(0), poseFrame(.2, .3, .9, 1, 1.018, .98, rise),
    poseFrame(.52, -1, -2, -3, .995, 1.014), poseFrame(.78, .3, -.3, 1), neutral(1)] },
};

// Browser frames are independent of the 250ms database sampling. Only a pose
// change reads the rendered transform; dragging still has no layout reads.
export function createMotion(stage, host) {
  const reduced = host.matchMedia?.('(prefers-reduced-motion: reduce)');
  let animation = null;
  let current = '';
  let stopped = false;
  let revision = 0;
  function play(pose) {
    if (stopped || pose === current) return;
    const rendered = host.getComputedStyle(stage);
    const start = { transform: rendered.transform, transformOrigin: rendered.transformOrigin };
    const ticket = ++revision;
    current = pose;
    animation?.cancel();
    animation = null;
    if (reduced?.matches || typeof stage.animate !== 'function') return;
    const track = tracks[pose] || tracks.idle;
    const origin = track.origin || '50% 88%';
    const frames = track.frames.map(frame => ({ ...frame, transformOrigin: origin }));
    // Move both the pose and its pivot from what is currently on screen.
    // Switching from head suspension to a seated pose must not jump the pivot.
    const bridge = stage.animate([start, { transform: frames[0].transform, transformOrigin: origin }],
      { duration: track.bridge || 140, easing: settle, fill: 'forwards' });
    animation = bridge;
    bridge.onfinish = () => {
      if (stopped || ticket !== revision || reduced?.matches) return;
      bridge.cancel();
      animation = stage.animate(frames, {
        duration: track.duration, iterations: track.iterations || Infinity, fill: 'forwards',
      });
    };
  }
  function preferenceChanged() {
    const pose = current;
    current = '';
    play(pose);
  }
  reduced?.addEventListener?.('change', preferenceChanged);
  return { play, destroy() {
    stopped = true; revision++; animation?.cancel();
    reduced?.removeEventListener?.('change', preferenceChanged);
  } };
}
