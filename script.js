// ===== KONFIGURASI (ubah di sini) =====
// Isi nomor WhatsApp kamu: kode negara + angka saja, tanpa +, spasi, atau strip.
// Contoh Indonesia: "6281234567890"
const WA_NUMBER = "6289654524123";
const WA_MESSAGE = "Iyaa bang, aku maafin ❤️🥺";
// =======================================

const TOTAL = 8;
const slides = document.querySelectorAll('.slide');
const progress = document.getElementById('progress');
const backBtn = document.getElementById('backBtn');
const card = document.getElementById('card');
let current = 1;
let busy = false;

// Pindah slide (dengan pencegahan klik ganda)
function goToSlide(n, direction) {
  if (busy || n < 1 || n > TOTAL || n === current) return;
  busy = true;
  const from = slides[current - 1];
  const to = slides[n - 1];
  const goingBack = direction === 'back';
  if (goingBack) to.classList.add('back-in');
  from.classList.remove('active');
  if (!goingBack) from.classList.add('leaving');
  void to.offsetWidth; // paksa reflow agar animasi jalan
  to.classList.remove('back-in');
  to.classList.add('active');
  current = n;
  progress.textContent = n + '/' + TOTAL;
  backBtn.hidden = n === 1;
  card.scrollTop = 0;
  if (n === 8) playVideo(); else pauseVideo();
  setTimeout(() => { from.classList.remove('leaving'); busy = false; }, 450);
}
const nextSlide = () => { if (current < TOTAL) goToSlide(current + 1, 'next'); };
const prevSlide = () => { if (current > 1) goToSlide(current - 1, 'back'); };

document.querySelectorAll('.btn.next').forEach(b => b.addEventListener('click', nextSlide));
backBtn.addEventListener('click', () => {
  // kalau sedang di panel slide 8, kembali ke pesan dulu
  if (current === 8 && finalMain.hidden) showFinalMain(); else prevSlide();
});
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') nextSlide();
  if (e.key === 'ArrowLeft') backBtn.click();
});

// Slide 8: tampilan akhir
const finalMain = document.getElementById('finalMain');
const thanksPanel = document.getElementById('thanksPanel');
const waitPanel = document.getElementById('waitPanel');
const waNote = document.getElementById('waNote');
const waAgainBtn = document.getElementById('waAgainBtn');

function showOnly(panel) {
  [finalMain, thanksPanel, waitPanel].forEach(el => el.hidden = el !== panel);
  card.scrollTop = 0;
}
function showFinalMain() { showOnly(finalMain); }

// Nomor valid = hanya angka, 8-15 digit
function isValidNumber(num) { return /^[0-9]{8,15}$/.test(num); }

function openWhatsApp() {
  if (!isValidNumber(WA_NUMBER)) {
    waNote.textContent = "Nomor WhatsApp belum diisi di script.js, jadi WhatsApp belum dibuka.";
    return false;
  }
  const url = "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(WA_MESSAGE);
  window.open(url, '_blank', 'noopener');
  waNote.textContent = "Kalau WhatsApp belum terbuka, tekan tombol di bawah ya 💬";
  return true;
}

function showThanks() {
  showOnly(thanksPanel);
  launchConfetti();
  const opened = openWhatsApp();
  waAgainBtn.hidden = !opened;
}

document.getElementById('forgiveBtn').addEventListener('click', showThanks);
waAgainBtn.addEventListener('click', openWhatsApp);
document.getElementById('needTimeBtn').addEventListener('click', () => showOnly(waitPanel));
document.getElementById('backToMsgBtn').addEventListener('click', showFinalMain);

// Video: kalau file tidak ada, pakai placeholder
const video = document.getElementById('coupleVideo');
const videoSource = document.getElementById('coupleSource');
videoSource.addEventListener('error', () => video.parentElement.classList.add('no-img'));
function playVideo() { const p = video.play(); if (p && p.catch) p.catch(() => {}); } // autoplay bisu; kalau ditolak, ada tombol play
function pauseVideo() { video.pause(); }

// Hati melayang di latar (jumlah terbatas)
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduce) {
  const box = document.getElementById('hearts');
  const icons = ['💗', '💕', '🌸', '✨', '🤍'];
  for (let i = 0; i < 12; i++) {
    const s = document.createElement('span');
    s.textContent = icons[i % icons.length];
    s.style.left = Math.random() * 100 + '%';
    s.style.fontSize = (12 + Math.random() * 16) + 'px';
    s.style.animationDuration = (11 + Math.random() * 10) + 's';
    s.style.animationDelay = (-Math.random() * 15) + 's';
    box.appendChild(s);
  }
}

// Hati + confetti ringan
function launchConfetti() {
  if (reduce) return;
  const box = document.getElementById('confetti');
  const items = ['💗', '❤️', '🌸', '✨', '🎀'];
  const colors = ['#ff8fb1', '#e8557f', '#ffd6e3', '#ffc9a8'];
  for (let i = 0; i < 40; i++) {
    const p = document.createElement('span');
    const isEmoji = i % 3 === 0;
    p.style.cssText = 'position:absolute;top:-20px;left:' + Math.random() * 100 + '%;';
    if (isEmoji) { p.textContent = items[i % items.length]; p.style.fontSize = '20px'; }
    else { p.style.width = '8px'; p.style.height = '12px'; p.style.background = colors[i % colors.length]; p.style.borderRadius = '2px'; }
    const dur = 2200 + Math.random() * 1800;
    p.animate([
      { transform: 'translate(0,0) rotate(0)', opacity: 1 },
      { transform: 'translate(' + (Math.random() * 120 - 60) + 'px,' + window.innerHeight + 'px) rotate(' + (Math.random() * 720) + 'deg)', opacity: 0.8 }
    ], { duration: dur, easing: 'ease-in', delay: Math.random() * 400, fill: 'forwards' });
    box.appendChild(p);
    setTimeout(() => p.remove(), dur + 800);
  }
}