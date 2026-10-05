// 特效：一块全屏粒子画布（Canvas2D）+ 桌宠小屋的流光（手写 WebGL）。
// 只在有粒子或小屋打开时才跑动画；系统要求减少动态效果时一律关闭。
const TAU = Math.PI * 2;
const LIMIT = { simple: 14, fancy: 46 };

export function resolveTier(setting, host) {
  if (host.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) return 'off';
  if (['off', 'simple', 'fancy'].includes(setting)) return setting;
  const coarse = host.matchMedia?.('(pointer: coarse)')?.matches;
  return coarse || (host.innerWidth || 1024) < 640 ? 'simple' : 'fancy';
}

function shape(ctx, p) {
  const { size: s } = p;
  ctx.beginPath();
  if (p.kind === 'hearts') {
    ctx.moveTo(0, s * .35);
    ctx.bezierCurveTo(-s * 1.1, -s * .35, -s * .45, -s * 1.05, 0, -s * .42);
    ctx.bezierCurveTo(s * .45, -s * 1.05, s * 1.1, -s * .35, 0, s * .35);
    ctx.fill();
  } else if (p.kind === 'petals') {
    ctx.moveTo(0, -s);
    ctx.bezierCurveTo(s * .9, -s * .6, s * .7, s * .7, 0, s);
    ctx.bezierCurveTo(-s * .55, s * .5, -s * .9, -s * .5, 0, -s);
    ctx.fill();
    ctx.globalAlpha *= .35; ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.ellipse(-s * .15, -s * .2, s * .18, s * .5, -.4, 0, TAU); ctx.fill();
  } else if (p.kind === 'snow') {
    ctx.lineWidth = Math.max(1, s * .16); ctx.strokeStyle = p.color; ctx.lineCap = 'round';
    for (let i = 0; i < 6; i++) {
      const a = i * TAU / 6;
      ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * s, Math.sin(a) * s);
      ctx.moveTo(Math.cos(a) * s * .55, Math.sin(a) * s * .55);
      ctx.lineTo(Math.cos(a + .5) * s * .78, Math.sin(a + .5) * s * .78);
    }
    ctx.stroke();
  } else if (p.kind === 'stars' || p.kind === 'sparkle') {
    for (let i = 0; i < 8; i++) {
      const r = i % 2 ? s * .32 : s, a = i * TAU / 8 - Math.PI / 2;
      ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath(); ctx.fill();
  } else if (p.kind === 'bubbles') {
    ctx.lineWidth = Math.max(1, s * .12); ctx.strokeStyle = p.color;
    ctx.arc(0, 0, s, 0, TAU); ctx.globalAlpha *= .8; ctx.stroke();
    ctx.beginPath(); ctx.arc(-s * .35, -s * .35, s * .25, 0, TAU); ctx.fillStyle = '#fff'; ctx.fill();
  } else if (p.kind === 'coins') {
    ctx.scale(Math.max(.15, Math.abs(Math.cos(p.flip))), 1);
    ctx.arc(0, 0, s, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(0, 0, s * .62, 0, TAU); ctx.strokeStyle = 'rgba(140,90,10,.55)'; ctx.lineWidth = Math.max(1, s * .14); ctx.stroke();
  } else {
    ctx.rect(-s * .45, -s, s * .9, s * 2); ctx.fill();
  }
}

const MOTION = {
  hearts: { gravity: -.018, drag: .985, life: [1300, 2000], speed: [1.2, 3], size: [6, 11], spin: .02 },
  petals: { gravity: .012, drag: .988, life: [2200, 3400], speed: [1.5, 4], size: [5, 9], spin: .06, sway: 1.1 },
  snow: { gravity: .01, drag: .99, life: [2400, 3600], speed: [1, 3], size: [4, 8], spin: .03, sway: .7 },
  stars: { gravity: -.004, drag: .975, life: [1100, 1900], speed: [2, 5], size: [4, 9], spin: .05 },
  sparkle: { gravity: 0, drag: .94, life: [600, 1000], speed: [1, 3.5], size: [3, 6], spin: .08 },
  bubbles: { gravity: -.02, drag: .985, life: [1600, 2600], speed: [.8, 2.4], size: [4, 10], spin: 0, sway: .5 },
  coins: { gravity: .16, drag: .992, life: [1100, 1600], speed: [3.5, 7], size: [5, 8], spin: 0 },
  confetti: { gravity: .07, drag: .985, life: [2000, 3000], speed: [4, 9], size: [3.5, 6], spin: .14, sway: .4 },
};
const between = ([low, high], random) => low + (high - low) * random();

export function createEffects(host, { tier = () => 'off', random = Math.random } = {}) {
  const doc = host.document;
  let canvas = null, ctx = null, frame = null, last = 0, particles = [], ratio = 1, destroyed = false;
  function ensureCanvas() {
    if (canvas) return true;
    canvas = doc.createElement('canvas');
    canvas.className = 'erii-fx';
    canvas.setAttribute('aria-hidden', 'true');
    ctx = canvas.getContext('2d');
    if (!ctx) { canvas = null; return false; }
    doc.body.append(canvas);
    resize();
    return true;
  }
  function resize() {
    if (!canvas) return;
    ratio = Math.min(2, host.devicePixelRatio || 1);
    canvas.width = Math.round(host.innerWidth * ratio); canvas.height = Math.round(host.innerHeight * ratio);
  }
  function spawn(kind, x, y, colors, count, spread = 1, upward = true) {
    const level = tier();
    if (level === 'off' || destroyed || !ensureCanvas()) return;
    const motion = MOTION[kind] || MOTION.sparkle;
    const room = LIMIT[level] - particles.length;
    const total = Math.min(room, Math.round(count * (level === 'fancy' ? 1 : .45)));
    for (let i = 0; i < total; i++) {
      const angle = upward ? -Math.PI / 2 + (random() - .5) * Math.PI * spread : random() * TAU;
      const speed = between(motion.speed, random);
      const life = between(motion.life, random);
      particles.push({ kind, x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, age: 0, life,
        size: between(motion.size, random), rot: random() * TAU, vr: (random() - .5) * motion.spin * 2,
        color: colors[Math.floor(random() * colors.length)] || '#fff', flip: random() * TAU, phase: random() * TAU, motion });
    }
    if (frame === null) { last = 0; frame = host.requestAnimationFrame(step); }
  }
  function step(time) {
    frame = null;
    if (destroyed || !ctx) return;
    const dt = last ? Math.min(48, time - last) : 16; last = time;
    if (canvas.width !== Math.round(host.innerWidth * ratio)) resize();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const k = dt / 16;
    particles = particles.filter(p => (p.age += dt) < p.life);
    for (const p of particles) {
      const m = p.motion;
      p.vx *= m.drag ** k; p.vy = p.vy * m.drag ** k + m.gravity * k;
      p.x += (p.vx + (m.sway ? Math.sin(p.phase + p.age / 380) * m.sway * .5 : 0)) * k; p.y += p.vy * k;
      p.rot += p.vr * k; p.flip += .18 * k;
      const fade = Math.min(1, p.age / 120) * Math.min(1, (p.life - p.age) / 420);
      ctx.setTransform(ratio, 0, 0, ratio, p.x * ratio, p.y * ratio);
      ctx.rotate(p.rot);
      ctx.globalAlpha = fade * (p.kind === 'sparkle' || p.kind === 'stars' ? .75 + .25 * Math.sin(p.age / 70) : 1);
      ctx.fillStyle = p.color;
      shape(ctx, p);
    }
    ctx.globalAlpha = 1;
    if (particles.length) frame = host.requestAnimationFrame(step);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  const onResize = () => resize();
  host.addEventListener('resize', onResize);
  return {
    burst(kind, x, y, colors, count = 14) { spawn(kind, x, y, colors, count, kind === 'confetti' ? .9 : .75); },
    ring(kind, x, y, colors, count = 12) { spawn(kind, x, y, colors, count, 1, false); },
    // 升级庆祝：从屏幕上缘撒下一阵。
    shower(kind, colors, count = 40) {
      const width = host.innerWidth;
      for (let i = 0; i < 4; i++) host.setTimeout(() => spawn(kind, width * (.15 + .7 * random()), -10, colors, count / 4, .35, false), i * 160);
    },
    clear() { particles = []; },
    destroy() {
      destroyed = true; particles = [];
      if (frame !== null) host.cancelAnimationFrame(frame);
      host.removeEventListener('resize', onResize);
      canvas?.remove(); canvas = null; ctx = null;
    },
  };
}

// 桌宠小屋图鉴页的流光。只在“华丽”档、小屋打开且页面可见时渲染，约 30 帧。
const VERTEX = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
const FRAGMENT = `precision mediump float;
uniform vec2 r;uniform float t;uniform vec3 a;uniform vec3 b;uniform vec3 c;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);
return mix(mix(h(i),h(i+vec2(1.,0.)),u.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),u.x),u.y);}
float fbm(vec2 p){float v=0.,w=.5;for(int i=0;i<5;i++){v+=w*n(p);p=p*2.03+vec2(1.7,9.2);w*=.5;}return v;}
void main(){vec2 uv=gl_FragCoord.xy/r;vec2 p=uv*vec2(r.x/r.y,1.)*1.5;float s=t*.035;
float q=fbm(p+vec2(s,-s*.7));float w=fbm(p*1.35+vec2(-s*.9,s)+q*1.6);
vec3 col=mix(c,a,smoothstep(.28,.86,q));col=mix(col,b,smoothstep(.36,.94,w)*.8);
float glow=smoothstep(.95,.05,length(uv-vec2(.5,.66)));col=mix(col,c,.18+.3*(1.-glow));
float ray=pow(max(0.,sin((uv.x*1.3-uv.y*.55+s*.6)*7.)),18.)*.12;
gl_FragColor=vec4(col+ray,1.);}`;

const hex = value => [1, 3, 5].map(i => parseInt(value.slice(i, i + 2), 16) / 255);

export function createAurora(canvas, host) {
  let gl;
  try { gl = canvas.getContext('webgl', { antialias: false, alpha: false, preserveDrawingBuffer: false, powerPreference: 'low-power' }); } catch { gl = null; }
  if (!gl) return null;
  const compile = (type, source) => { const s = gl.createShader(type); gl.shaderSource(s, source); gl.compileShader(s); return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null; };
  const vs = compile(gl.VERTEX_SHADER, VERTEX), fs = compile(gl.FRAGMENT_SHADER, FRAGMENT);
  if (!vs || !fs) return null;
  const program = gl.createProgram(); gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);
  const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, 'p'); gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const uniform = name => gl.getUniformLocation(program, name);
  const [ur, ut, ua, ub, uc] = ['r', 't', 'a', 'b', 'c'].map(uniform);
  let frame = null, start = 0, lastDraw = 0, colors = ['#f1a9b6', '#f8d8c4', '#fff6ee'];
  function draw(time) {
    frame = host.requestAnimationFrame(draw);
    if (time - lastDraw < 32) return;
    lastDraw = time;
    const width = Math.max(1, Math.round(canvas.clientWidth * .5)), height = Math.max(1, Math.round(canvas.clientHeight * .5));
    if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
    gl.viewport(0, 0, width, height);
    gl.uniform2f(ur, width, height); gl.uniform1f(ut, (time - start) / 1000);
    gl.uniform3fv(ua, hex(colors[0])); gl.uniform3fv(ub, hex(colors[1])); gl.uniform3fv(uc, hex(colors[2]));
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
  return {
    setColors(next) { if (Array.isArray(next) && next.length === 3) colors = next; },
    start() { if (frame === null) { start ||= host.performance?.now?.() || 0; frame = host.requestAnimationFrame(draw); } },
    stop() { if (frame !== null) host.cancelAnimationFrame(frame); frame = null; },
    destroy() { this.stop(); gl.getExtension('WEBGL_lose_context')?.loseContext(); },
  };
}
