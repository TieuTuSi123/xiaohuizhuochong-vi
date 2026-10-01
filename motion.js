const tracks = {
  idle: [4200, ['translateY(0)', 'translateY(-1px)', 'translateY(0)']],
  received: [1400, ['translateY(0)', 'translateY(-3px) rotate(-2deg)', 'translateY(0)']],
  writing: [1800, ['rotate(-1deg)', 'rotate(1deg) translateY(1px)', 'rotate(-1deg)']],
  complete: [1700, ['translateY(0)', 'translateY(-4px) rotate(-2deg)', 'translateY(-2px) rotate(2deg)', 'translateY(0)']],
  error: [2600, ['rotate(0)', 'rotate(-3deg)', 'rotate(0)']],
  tea: [3400, ['translateY(0) rotate(0)', 'translateY(-1px) rotate(-2deg)', 'translateY(0) rotate(0)']],
  reading: [4000, ['rotate(-1deg)', 'rotate(1deg)', 'rotate(-1deg)']],
  origami: [2600, ['translateY(0)', 'translateY(1px) rotate(-1deg)', 'translateY(0)']],
  duck: [2400, ['rotate(-2deg)', 'rotate(2deg)', 'rotate(-2deg)']],
  stretch: [3200, ['translateY(0) scaleY(1)', 'translateY(-2px) scaleY(1.015)', 'translateY(0) scaleY(1)']],
  rest: [4800, ['translateY(0)', 'translateY(-1px)', 'translateY(0)']],
  gift: [2200, ['translateY(0)', 'translateY(-3px) rotate(-2deg)', 'translateY(0)']],
  lifted: [2000, ['translateY(-2px) rotate(-2deg)', 'translateY(-1px) rotate(2deg)', 'translateY(-2px) rotate(-2deg)']],
  land: [1000, ['translateY(-3px)', 'translateY(1px) scaleY(.97)', 'translateY(0)']],
  wave: [1900, ['rotate(0)', 'rotate(-3deg) translateY(-2px)', 'rotate(2deg)', 'rotate(0)']],
  peek: [3000, ['rotate(0)', 'rotate(-3deg)', 'rotate(0)']],
};

// Browser animation frames run independently of database sampling (250ms).
export function createMotion(stage, host) {
  const reduced = host.matchMedia?.('(prefers-reduced-motion: reduce)');
  let animation = null;
  let current = '';
  let stopped = false;
  function play(pose) {
    if (stopped || pose === current) return;
    const start = host.getComputedStyle(stage).transform;
    current = pose;
    animation?.cancel();
    if (reduced?.matches || typeof stage.animate !== 'function') return;
    const [duration, transforms] = tracks[pose] || tracks.idle;
    // Bridge from the current rendered transform to the next cycle before looping.
    animation = stage.animate([{ transform: start === 'none' ? 'none' : start }, { transform: transforms[0] }],
      { duration: 160, easing: 'ease-out', fill: 'forwards' });
    animation.onfinish = () => {
      if (stopped || current !== pose || reduced?.matches) return;
      animation.cancel();
      animation = stage.animate(transforms.map(transform => ({ transform })),
        { duration, easing: 'ease-in-out', iterations: pose === 'land' ? 1 : Infinity, fill: 'forwards' });
    };
  }
  function preferenceChanged() { animation?.cancel(); const pose = current; current = ''; play(pose); }
  reduced?.addEventListener?.('change', preferenceChanged);
  return { play, destroy() { stopped = true; animation?.cancel(); reduced?.removeEventListener?.('change', preferenceChanged); } };
}
