/* ═══════════════════════════════════════════════════════════
   script.js — Nossa História ❤️
═══════════════════════════════════════════════════════════ */

'use strict';

const CONFIG = {
  password:     '280426',     // DDMMAA
  passwordFull: '28042026',   // DDMMAAAA
  startDate: new Date('2026-04-28T20:13:00'),
  typeText:  'Eu te amo ❤️',
  typeSpeed: 90,
  typeDelay: 1200,

  // ── TRECHO DA MÚSICA A TOCAR (em segundos) ──
  // Exemplo: refrão entre 1:05 e 1:35 → audioStart: 65, audioEnd: 95
  // Se audioEnd for null, toca até o fim do arquivo.
  audioStart: 0,
  audioEnd:   null,
};

/* ── CANVAS bokeh ─────────────────────────────────────── */
(function initBackground() {
  const canvas = document.getElementById('bgCanvas');
  const ctx = canvas.getContext('2d');
  const particles = [];
  const COUNT = 45;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(randomY = false) {
      this.x = Math.random() * canvas.width;
      this.y = randomY ? Math.random() * canvas.height : canvas.height + 20;
      this.r = 1.5 + Math.random() * 3;
      this.spd = 0.15 + Math.random() * 0.4;
      this.op = 0.05 + Math.random() * 0.12;
      this.dx = (Math.random() - 0.5) * 0.25;
      this.hue = 335 + Math.random() * 25;
    }
    update() {
      this.y -= this.spd;
      this.x += this.dx;
      if (this.y < -10) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 100%, 80%, ${this.op})`;
      ctx.shadowBlur = this.r * 4;
      ctx.shadowColor = `hsla(${this.hue}, 100%, 80%, 0.6)`;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }

  resize();
  window.addEventListener('resize', resize);
  loop();
})();

/* ── CORAÇÕES DA TELA DE BLOQUEIO — efeito cascata em colunas ── */
(function initLockHearts() {
  const container = document.getElementById('lockHearts');
  const emojis = ['💗', '💕', '❤️', '🩷', '💖'];

  // Colunas fixas (em %) — cria efeito de "escada rolante"
  const columns = [4, 14, 24, 34, 46, 58, 70, 80, 90, 96, 10, 64, 38, 86];

  columns.forEach((leftPct, i) => {
    const el = document.createElement('div');
    el.className = 'bg-heart';
    el.textContent = emojis[i % emojis.length];

    const size = 0.9 + (i % 5) * 0.25;
    const dur  = 6 + (i % 6) * 1.6;
    const del  = (i * 0.9) % dur;
    const op   = 0.22 + (i % 4) * 0.08;

    el.style.cssText = `
      left: ${leftPct}%;
      bottom: 0;
      font-size: ${size}rem;
      animation-duration: ${dur}s;
      animation-delay: -${del}s;
      --op: ${op};
    `;
    container.appendChild(el);
  });
})();

/* ── CORAÇÕES FLUTUANTES GLOBAIS (tela principal) — cascata em colunas ── */
(function initFloatingHearts() {
  const hearts = ['❤️', '💕', '💗', '💓', '💖', '💝'];

  // Colunas fixas (em %) — efeito de escada rolante contínua
  const columns = [3, 12, 22, 33, 45, 56, 67, 77, 88, 96, 18, 72];

  columns.forEach((leftPct, i) => {
    const el = document.createElement('div');
    el.className = 'bg-heart';
    el.textContent = hearts[i % hearts.length];

    const size = 1.0 + (i % 5) * 0.25;
    const dur  = 10 + (i % 7) * 2.2;
    const del  = (i * 1.3) % dur;
    const op   = 0.10 + (i % 4) * 0.05;

    el.style.cssText = `
      left: ${leftPct}%;
      bottom: 0;
      font-size: ${size}rem;
      animation-duration: ${dur}s;
      animation-delay: -${del}s;
      --op: ${op};
    `;
    document.body.appendChild(el);
  });
})();

/* ── TELA DE BLOQUEIO — passo 1: cadeado | passo 2: teclado ── */
const lockScreen = document.getElementById('lockScreen');
const lockStep1 = document.getElementById('lockStep1');
const lockStep2 = document.getElementById('lockStep2');
const heartLockBtn = document.getElementById('heartLockBtn');
const numpadDisplay = document.getElementById('numpadDisplay');
const lockError = document.getElementById('lockError');

let numpadValue = '';

function formatDisplay(val) {
  if (val.length === 0) return 'DD / MM / AAAA';
  const placeholders = ['D', 'D', 'M', 'M', 'A', 'A', 'A', 'A'];
  let chars = [];
  for (let i = 0; i < 8; i++) {
    chars.push(i < val.length ? val[i] : placeholders[i]);
  }
  return `${chars[0]}${chars[1]} / ${chars[2]}${chars[3]} / ${chars[4]}${chars[5]}${chars[6]}${chars[7]}`;
}

heartLockBtn.addEventListener('click', () => {
  // Inicia a música assim que o usuário interage (necessário pra liberar autoplay)
  startAudio();

  gsap.to('.heart-lock-img', {
    scale: 1.15,
    duration: 0.18,
    ease: 'power2.out',
    yoyo: true,
    repeat: 1,
    onComplete: () => {
      gsap.to(lockStep1, {
        opacity: 0, y: -30, duration: 0.4, ease: 'power2.in',
        onComplete: () => {
          lockStep1.classList.add('hidden');
          lockStep2.classList.remove('hidden');
          gsap.fromTo(lockStep2,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.3)' }
          );
        }
      });
    }
  });
});

document.querySelectorAll('.numpad-key[data-val]').forEach(btn => {
  btn.addEventListener('click', () => {
    if (numpadValue.length >= 8) return;
    numpadValue += btn.dataset.val;
    updateDisplay();
    lockError.classList.remove('visible');
    gsap.fromTo(btn, { scale: 0.88 }, { scale: 1, duration: 0.18, ease: 'back.out(2)' });

    // Confirma automaticamente ao completar 6 dígitos (DDMMAA) se corresponder,
    // ou ao completar 8 dígitos (DDMMAAAA)
    if (numpadValue.length === 6 && numpadValue === CONFIG.password) {
      setTimeout(attemptUnlock, 150);
    } else if (numpadValue.length === 8) {
      setTimeout(attemptUnlock, 150);
    }
  });
});

document.getElementById('numpadClear').addEventListener('click', () => {
  numpadValue = numpadValue.slice(0, -1);
  updateDisplay();
  lockError.classList.remove('visible');
});

document.getElementById('numpadConfirm').addEventListener('click', attemptUnlock);

function updateDisplay() {
  numpadDisplay.textContent = formatDisplay(numpadValue);
  numpadDisplay.classList.toggle('has-input', numpadValue.length > 0);
}

function attemptUnlock() {
  const isCorrect =
    numpadValue === CONFIG.password ||
    numpadValue === CONFIG.passwordFull;

  if (isCorrect) {
    gsap.to('.numpad-card', {
      scale: 1.05, duration: 0.15, yoyo: true, repeat: 1, ease: 'power2.out',
      onComplete: () => {
        triggerHeartExplosion();
        setTimeout(() => {
          lockScreen.classList.add('fade-out');
          setTimeout(() => {
            lockScreen.style.display = 'none';
            revealMainScreen();
          }, 800);
        }, 600);
      }
    });
  } else {
    lockError.classList.add('visible');
    gsap.fromTo('.numpad-display',
      { x: 0 },
      {
        x: 10, duration: 0.08, ease: 'power1.inOut', yoyo: true, repeat: 5,
        onComplete: () => gsap.set('.numpad-display', { x: 0 })
      }
    );
    numpadValue = '';
    setTimeout(() => updateDisplay(), 300);
  }
}

/* ── EXPLOSÃO DE CORAÇÕES ─────────────────────────────────── */
function triggerHeartExplosion() {
  const container = document.getElementById('heartExplosion');
  const emojis = ['❤️', '💕', '💗', '💓', '💖', '💝', '✨'];
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;

  for (let i = 0; i < 36; i++) {
    const el = document.createElement('span');
    el.className = 'explosion-heart';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    const angle = (i / 36) * 360;
    const dist = 80 + Math.random() * 220;
    const rad = (angle * Math.PI) / 180;
    const dx = Math.cos(rad) * dist;
    const dy = Math.sin(rad) * dist;
    const rot = (Math.random() - 0.5) * 80 + 'deg';

    el.style.cssText = `
      left: ${cx}px;
      top: ${cy}px;
      font-size: ${0.9 + Math.random() * 1.4}rem;
      --dx: ${dx}px;
      --dy: ${dy}px;
      --rot: ${rot};
      animation-delay: ${Math.random() * 0.3}s;
    `;
    container.appendChild(el);
    setTimeout(() => el.remove(), 2000);
  }
}

/* ── CORAÇÕES DENTRO DO CARD ROMÂNTICO — espalhados e estáticos ─ */
function initCardHearts() {
  const container = document.getElementById('loveCardHearts');
  if (!container) return;

  const emojis = ['💗', '💕', '❤️', '💖', '💓', '🌸'];

  // Posições espalhadas (left%, top%)
  const positions = [
    { left: '6%',  top: '8%'  }, { left: '85%', top: '6%'  },
    { left: '18%', top: '20%' }, { left: '74%', top: '18%' },
    { left: '4%',  top: '46%' }, { left: '90%', top: '42%' },
    { left: '12%', top: '70%' }, { left: '80%', top: '66%' },
    { left: '24%', top: '86%' }, { left: '66%', top: '88%' },
    { left: '45%', top: '4%'  }, { left: '50%', top: '92%' },
    { left: '36%', top: '28%' }, { left: '60%', top: '46%' },
  ];

  positions.forEach((pos, i) => {
    const el = document.createElement('span');
    el.className = 'card-heart';
    el.textContent = emojis[i % emojis.length];

    const sz  = 1.1 + (i % 5) * 0.25;   // corações maiores
    const op  = 0.22 + (i % 4) * 0.08;
    const rot = ((i % 2 === 0) ? 1 : -1) * (8 + (i % 3) * 10) + 'deg';

    el.style.cssText = `
      left: ${pos.left};
      top: ${pos.top};
      --sz: ${sz}rem;
      --op: ${op};
      --rot: ${rot};
      font-size: ${sz}rem;
    `;
    container.appendChild(el);
  });
}

/* ── REVELAR TELA PRINCIPAL ───────────────────────────────── */
function revealMainScreen() {
  const mainScreen = document.getElementById('mainScreen');
  mainScreen.classList.remove('hidden');

  initCardHearts();

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  gsap.set('#sectionPlayer, #sectionBouquet, #sectionCounter, #sectionLetter', {
    opacity: 0, y: 40,
  });
  gsap.set('.te-amo-img, .heart-img', { scale: 0 });
  gsap.set('#bouquetImg', { scale: 0, opacity: 0 });

  tl.to('#sectionPlayer', {
    opacity: 1, y: 0, duration: 0.7, delay: 0.2,
    onComplete: () => {
      // Sincroniza ícone/visualizador com o estado real do áudio
      setPlayState(!audio.paused);
    },
  });

  tl.to('#sectionBouquet', {
    opacity: 1, y: 0, duration: 0.6,
  }, '-=0.1');

  tl.add(() => startTyping(), '-=0.2');

  tl.to('#bouquetImg', {
    scale: 1.2, opacity: 1, duration: 0.6, ease: 'back.out(1.5)',
  }, '-=0.1');

  tl.to('#bouquetImg', {
    scale: 1.0, duration: 0.4, ease: 'power2.out',
    onComplete: startBouquetFloat,
  });

  tl.to('#sectionCounter', {
    opacity: 1, y: 0, duration: 0.6,
    onComplete: startCounter,
  }, '-=0.2');

  tl.to('#sectionLetter', {
    opacity: 1, y: 0, duration: 0.6,
  }, '-=0.2');
}

/* ── BUQUÊ FLUTUANTE ──────────────────────────────────────── */
function startBouquetFloat() {
  gsap.to('#bouquetImg', {
    y: -12, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1,
  });
}

/* ── REVELAR TEXTO/CORAÇÃO (imagens) ─────────────────────── */
function startTyping() {
  gsap.to('.te-amo-img', {
    scale: 1, duration: 0.6, ease: 'back.out(1.6)',
  });
  gsap.to('.heart-img', {
    scale: 1, duration: 0.6, ease: 'back.out(1.6)', delay: 0.15,
  });
}

/* ── CONTADOR DE TEMPO ────────────────────────────────────── */
function startCounter() {
  updateCounter();
  setInterval(updateCounter, 1000);
}

function updateCounter() {
  const now = new Date();
  const start = CONFIG.startDate;
  const diff = now - start;

  if (diff < 0) {
    ['cYears', 'cMonths', 'cDays', 'cHours', 'cMinutes', 'cSeconds'].forEach(id => {
      document.getElementById(id).textContent = '00';
    });
    return;
  }

  let years   = now.getFullYear() - start.getFullYear();
  let months  = now.getMonth() - start.getMonth();
  let days    = now.getDate() - start.getDate();
  let hours   = now.getHours() - start.getHours();
  let minutes = now.getMinutes() - start.getMinutes();
  let seconds = now.getSeconds() - start.getSeconds();

  // Ajusta segundos
  if (seconds < 0) {
    seconds += 60;
    minutes--;
  }
  // Ajusta minutos
  if (minutes < 0) {
    minutes += 60;
    hours--;
  }
  // Ajusta horas
  if (hours < 0) {
    hours += 24;
    days--;
  }
  // Ajusta dias (usa o último dia do mês anterior ao mês atual)
  if (days < 0) {
    months--;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }
  // Ajusta meses
  if (months < 0) {
    years--;
    months += 12;
  }

  document.getElementById('cYears').textContent = years;
  document.getElementById('cMonths').textContent = months;
  document.getElementById('cDays').textContent = days;
  document.getElementById('cHours').textContent = pad(hours);
  document.getElementById('cMinutes').textContent = pad(minutes);
  document.getElementById('cSeconds').textContent = pad(seconds);

  const secEl = document.getElementById('cSeconds');
  secEl.style.transform = 'scale(1.15)';
  setTimeout(() => { secEl.style.transform = 'scale(1)'; }, 200);
}

function pad(n) {
  return String(n).padStart(2, '0');
}

/* ── PLAYER DE MÚSICA ─────────────────────────────────────── */
const audio = document.getElementById('audioPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const iconPlay = document.getElementById('iconPlay');
const iconPause = document.getElementById('iconPause');
const progressFill = document.getElementById('progressFill');
const progressThumb = document.getElementById('progressThumb');
const progressBar = document.getElementById('progressBar');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl = document.getElementById('totalTime');
const volumeBtn = document.getElementById('volumeBtn');
const visualizer = document.getElementById('visualizer');

let isMuted = false;
let audioEndTime = null; // resolvido após loadedmetadata

function getAudioEnd() {
  if (audioEndTime !== null) return audioEndTime;
  return (CONFIG.audioEnd !== null) ? CONFIG.audioEnd : (audio.duration || 0);
}

function startAudio() {
  audio.volume = 0.85;
  audio.currentTime = CONFIG.audioStart || 0;

  const playPromise = audio.play();

  if (playPromise !== undefined) {
    playPromise
      .then(() => setPlayState(true))
      .catch(() => {
        setPlayState(false);
        document.addEventListener('click', () => {
          audio.currentTime = CONFIG.audioStart || 0;
          audio.play().then(() => setPlayState(true));
        }, { once: true });
      });
  }
}

function setPlayState(playing) {
  if (playing) {
    iconPlay.classList.add('hidden');
    iconPause.classList.remove('hidden');
    visualizer.classList.add('playing');
  } else {
    iconPlay.classList.remove('hidden');
    iconPause.classList.add('hidden');
    visualizer.classList.remove('playing');
  }
}

playPauseBtn.addEventListener('click', () => {
  if (audio.paused) {
    if (audio.currentTime >= getAudioEnd()) {
      audio.currentTime = CONFIG.audioStart || 0;
    }
    audio.play();
    setPlayState(true);
  } else {
    audio.pause();
    setPlayState(false);
  }
});

// Atualiza progresso considerando apenas o trecho definido
audio.addEventListener('timeupdate', () => {
  if (!audio.duration) return;

  const start = CONFIG.audioStart || 0;
  const end   = getAudioEnd();
  const segmentDuration = Math.max(end - start, 0.01);
  const elapsed = Math.min(Math.max(audio.currentTime - start, 0), segmentDuration);

  const pct = (elapsed / segmentDuration) * 100;
  progressFill.style.width = pct + '%';
  progressThumb.style.left = pct + '%';
  currentTimeEl.textContent = formatTime(elapsed);

  // Loop dentro do trecho definido
  if (audio.currentTime >= end) {
    audio.currentTime = start;
    if (audio.paused) audio.play();
  }
});

audio.addEventListener('loadedmetadata', () => {
  audioEndTime = (CONFIG.audioEnd !== null) ? CONFIG.audioEnd : audio.duration;
  const segmentDuration = audioEndTime - (CONFIG.audioStart || 0);
  totalTimeEl.textContent = formatTime(segmentDuration);
});

// Clique na barra de progresso → navega dentro do trecho definido
progressBar.addEventListener('click', e => {
  if (!audio.duration) return;
  const start = CONFIG.audioStart || 0;
  const end   = getAudioEnd();
  const segmentDuration = end - start;

  const rect = progressBar.getBoundingClientRect();
  const pct = (e.clientX - rect.left) / rect.width;
  audio.currentTime = start + (pct * segmentDuration);
});

volumeBtn.addEventListener('click', () => {
  isMuted = !isMuted;
  audio.muted = isMuted;
  volumeBtn.textContent = isMuted ? '🔇' : '🔊';
});

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${pad(sec)}`;
}

/* ── CARTA DE AMOR ────────────────────────────────────────── */
const letterBtn = document.getElementById('letterBtn');
const letterCard = document.getElementById('letterCard');
let letterOpen = false;

letterBtn.addEventListener('click', () => {
  letterOpen = !letterOpen;

  if (letterOpen) {
    letterCard.classList.add('open');
    letterBtn.textContent = '💌 Fechar Carta';

    setTimeout(() => {
      letterCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 200);

    gsap.fromTo(letterCard,
      { scale: 0.97 },
      { scale: 1, duration: 0.5, ease: 'back.out(1.4)' }
    );
  } else {
    letterCard.classList.remove('open');
    letterBtn.textContent = '💌 Abrir Carta';
  }
});

/* ── HOVER GSAP — cards interativos ──────────────────────── */
document.querySelectorAll('.glass-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    gsap.to(card, { scale: 1.02, duration: 0.25, ease: 'power1.out' });
  });
  card.addEventListener('mouseleave', () => {
    gsap.to(card, { scale: 1.00, duration: 0.25, ease: 'power1.out' });
  });
});