// ══════════════════════════════════════════════
// 1. HOVER REVEAL — 200px radius + stays 2s
// ══════════════════════════════════════════════
const spans = document.querySelectorAll('.bg-text span');
const fadeTimers = new Map();

spans.forEach(span => {
  span.addEventListener('mousemove', (e) => {
    const rect = span.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width * 100);
    const y = ((e.clientY - rect.top) / rect.height * 100);
    span.style.setProperty('--mx', x + '%');
    span.style.setProperty('--my', y + '%');
    if (fadeTimers.has(span)) clearTimeout(fadeTimers.get(span));
  });

  span.addEventListener('mouseleave', () => {
    const timer = setTimeout(() => {
      span.style.setProperty('--mx', '-200%');
      span.style.setProperty('--my', '-200%');
    }, 2000);
    fadeTimers.set(span, timer);
  });
});

// ══════════════════════════════════════════════
// 2. DOG IMAGES (replace URLs with your own)
// ══════════════════════════════════════════════
const dogImages = [
  'fotos/foto1.jpeg',
  'fotos/foto2.jpeg',
  'fotos/foto3.jpeg',
  'fotos/foto4.jpeg',
  'fotos/foto5.jpeg',
  'fotos/foto6.jpeg',
  'fotos/foto7.jpeg',
  'fotos/foto8.jpeg',
  'fotos/foto9.jpeg',
  'fotos/foto10.jpeg',
  'fotos/foto11.jpeg',
  'fotos/foto12.jpeg',
  'fotos/foto13.jpeg',
];
let imgIndex = 0;

// Photo sizes pool (px)
const photoSizes = [120, 150, 180, 220, 260, 300];

// ══════════════════════════════════════════════
// 3. REALISTIC BARK — multi-layer Web Audio API
// ══════════════════════════════════════════════
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

const barkSounds = [
  new Audio('../audios/ladrido1.wav'),
  new Audio('../audios/ladrido3.wav'),
  new Audio('../audios/ladrido4.ogg'),
  new Audio('../audios/ladrido5.mp3'),
];

function bark() {
  const sound = barkSounds[Math.floor(Math.random() * barkSounds.length)];
  sound.currentTime = 0;
  sound.play();
}


/*function bark() {
  if (!audioCtx) audioCtx = new AudioCtx();
  const t = audioCtx.currentTime;
  const pitch = 0.85 + Math.random() * 0.3;

  // Attack
  const osc1 = audioCtx.createOscillator();
  const g1 = audioCtx.createGain();
  const f1 = audioCtx.createBiquadFilter();
  osc1.type = 'sawtooth';
  osc1.frequency.setValueAtTime(600 * pitch, t);
  osc1.frequency.exponentialRampToValueAtTime(150 * pitch, t + 0.08);
  f1.type = 'lowpass';
  f1.frequency.setValueAtTime(1200, t);
  f1.frequency.exponentialRampToValueAtTime(400, t + 0.12);
  f1.Q.value = 2;
  g1.gain.setValueAtTime(0.4, t);
  g1.gain.linearRampToValueAtTime(0.3, t + 0.03);
  g1.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
  osc1.connect(f1).connect(g1).connect(audioCtx.destination);
  osc1.start(t);
  osc1.stop(t + 0.15);

  // Body
  const osc2 = audioCtx.createOscillator();
  const g2 = audioCtx.createGain();
  const f2 = audioCtx.createBiquadFilter();
  osc2.type = 'sawtooth';
  osc2.frequency.setValueAtTime(350 * pitch, t + 0.02);
  osc2.frequency.exponentialRampToValueAtTime(120 * pitch, t + 0.18);
  f2.type = 'bandpass';
  f2.frequency.value = 800;
  f2.Q.value = 1.5;
  g2.gain.setValueAtTime(0, t);
  g2.gain.linearRampToValueAtTime(0.25, t + 0.03);
  g2.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
  osc2.connect(f2).connect(g2).connect(audioCtx.destination);
  osc2.start(t + 0.01);
  osc2.stop(t + 0.2);

  // Sub woof
  const osc3 = audioCtx.createOscillator();
  const g3 = audioCtx.createGain();
  osc3.type = 'sine';
  osc3.frequency.setValueAtTime(120 * pitch, t);
  osc3.frequency.exponentialRampToValueAtTime(60 * pitch, t + 0.2);
  g3.gain.setValueAtTime(0.3, t);
  g3.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
  osc3.connect(g3).connect(audioCtx.destination);
  osc3.start(t);
  osc3.stop(t + 0.22);

  // Breath noise
  const bufLen = audioCtx.sampleRate * 0.1;
  const noiseBuf = audioCtx.createBuffer(1, bufLen, audioCtx.sampleRate);
  const nd = noiseBuf.getChannelData(0);
  for (let i = 0; i < bufLen; i++) nd[i] = Math.random() * 2 - 1;
  const noise = audioCtx.createBufferSource();
  const ng = audioCtx.createGain();
  const nf = audioCtx.createBiquadFilter();
  noise.buffer = noiseBuf;
  nf.type = 'bandpass';
  nf.frequency.value = 2500;
  nf.Q.value = 0.8;
  ng.gain.setValueAtTime(0.12, t);
  ng.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
  noise.connect(nf).connect(ng).connect(audioCtx.destination);
  noise.start(t);

  // 50% chance double bark
  if (Math.random() > 0.5) {
    const d = 0.18 + Math.random() * 0.06;
    const osc4 = audioCtx.createOscillator();
    const g4 = audioCtx.createGain();
    const f4 = audioCtx.createBiquadFilter();
    osc4.type = 'sawtooth';
    osc4.frequency.setValueAtTime(500 * pitch, t + d);
    osc4.frequency.exponentialRampToValueAtTime(130 * pitch, t + d + 0.1);
    f4.type = 'lowpass';
    f4.frequency.setValueAtTime(1000, t + d);
    f4.frequency.exponentialRampToValueAtTime(350, t + d + 0.12);
    f4.Q.value = 1.5;
    g4.gain.setValueAtTime(0.3, t + d);
    g4.gain.exponentialRampToValueAtTime(0.001, t + d + 0.13);
    osc4.connect(f4).connect(g4).connect(audioCtx.destination);
    osc4.start(t + d);
    osc4.stop(t + d + 0.13);
  }
}
*/

// ══════════════════════════════════════════════
// 4. CLICK → photo (random size) + bark
// ══════════════════════════════════════════════
document.addEventListener('click', (e) => {
  bark();

  const size = photoSizes[Math.floor(Math.random() * photoSizes.length)];
  const half = size / 2;

  const img = document.createElement('img');
  img.className = 'dog-photo';
  img.src = dogImages[imgIndex % dogImages.length];
  img.style.width = size + 'px';
  img.style.height = size + 'px';
  imgIndex++;

  const rot = (Math.random() * 20 - 10);
  img.style.setProperty('--rot', rot + 'deg');
  img.style.left = (e.clientX - half) + 'px';
  img.style.top = (e.clientY - half) + 'px';

  document.body.appendChild(img);

  setTimeout(() => {
    img.classList.add('fade-out');
    img.addEventListener('animationend', () => img.remove());
  }, 3000);
});
