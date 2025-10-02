// ===== MỞ / ĐÓNG MODAL =====
document.querySelectorAll(".btn-book, #bookingBtn").forEach(btn=>{
  btn.addEventListener("click", e=>{
    e.preventDefault();
    document.getElementById("bookingModal").style.display="flex";
  });
});

document.querySelector(".modal .close").addEventListener("click", ()=>{
  document.getElementById("bookingModal").style.display="none";
});

window.addEventListener("click", e=>{
  if(e.target.id==="bookingModal"){
    document.getElementById("bookingModal").style.display="none";
  }
});

// ===== GỬI FORM SANG ZALO =====
document.getElementById("bookingForm").addEventListener("submit", function(e){
  e.preventDefault();

  let fullname=this.fullname.value;
  let phone=this.phone.value;
  let guests=this.guests.value;
  let checkin=this.checkin.value;
  let checkout=this.checkout.value;

  // Tin nhắn gửi qua Zalo
  let message=`ĐẶT PHÒNG\nHọ tên: ${fullname}\nSĐT: ${phone}\nSố người: ${guests}\nNhận phòng: ${checkin}\nTrả phòng: ${checkout}`;

  // link Zalo (thay số điện thoại bằng số Zalo bạn)
  let zaloLink=`https://zalo.me/0888808818?text=${encodeURIComponent(message)}`;

  window.open(zaloLink,"_blank");

  document.getElementById("bookingModal").style.display="none";
  this.reset();
});
document.getElementById("bookingBtn").addEventListener("click", function(e) {
  e.preventDefault(); // Ngăn cuộn về đầu trang
  document.getElementById("bookingModal").style.display = "flex";
});
document.getElementById("bookingForm").addEventListener("submit", function(e) {
  e.preventDefault(); // Ngăn reload trang

  // Lấy dữ liệu từ form
  const name = this.fullname.value;
  const phone = this.phone.value;
  const guests = this.guests.value;
  const checkin = this.checkin.value;
  const checkout = this.checkout.value;

  // Tạo nội dung tin nhắn
  const message = `Xin chào, tôi muốn đặt phòng:
- Họ tên: ${name}
- SĐT: ${phone}
- Số người: ${guests}
- Ngày nhận: ${checkin}
- Ngày trả: ${checkout}`;

  // Encode để đưa vào link Zalo
  const encodedMessage = encodeURIComponent(message);

  // Link Zalo (thay số của bạn vào)
  const zaloLink = `https://zalo.me/0888808818?text=${encodedMessage}`;

  // Mở Zalo trong tab mới
  window.open(zaloLink, "_blank");
});
// ====== SLIDER TỰ ĐỘNG ======
let slideIndex = 0;
const slides = document.querySelectorAll('.slides .slide');

function showSlide(n) {
  slides.forEach((slide, i) => {
    slide.classList.remove('active');
    if (i === n) slide.classList.add('active');
  });
}

function nextSlide() {
  slideIndex++;
  if (slideIndex >= slides.length) slideIndex = 0;
  showSlide(slideIndex);
}

// chạy slide đầu tiên
showSlide(slideIndex);

// tự động đổi slide mỗi 4 giây
setInterval(nextSlide, 4000);
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');

menuToggle.addEventListener('click', () => {
  nav.classList.toggle('active');
});
// Lightbox mở từ từng .gallery-item với data-images
(function () {
  const lightbox = document.getElementById('lightbox');
  const imgEl = lightbox.querySelector('.lb-img');
  const btnClose = lightbox.querySelector('.lb-close');
  const btnPrev  = lightbox.querySelector('.lb-prev');
  const btnNext  = lightbox.querySelector('.lb-next');
  const countEl  = lightbox.querySelector('.lb-count');

  let images = [];
  let index = 0;

  function show(i) {
    if (!images.length) return;
    index = (i + images.length) % images.length;
    imgEl.src = images[index];
    countEl.textContent = `${index + 1} / ${images.length}`;
  }
  function open(arr, start = 0) {
    images = arr; show(start);
    lightbox.classList.remove('hidden');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    lightbox.classList.add('hidden');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Click ảnh hoặc toàn bộ .gallery-item để mở
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.gallery-item');
    if (!card) return;
    // chỉ mở nếu click vào IMG hoặc P/price (tuỳ bạn). Có thể bỏ điều kiện để click bất kỳ chỗ nào.
    if (!(e.target.tagName === 'IMG')) return;

    try {
      const arr = JSON.parse(card.getAttribute('data-images') || '[]');
      if (arr.length) {
        const thumbSrc = card.querySelector('img').getAttribute('src');
        const startIdx = Math.max(0, arr.indexOf(thumbSrc));
        open(arr, startIdx);
      }
    } catch (err) {
      console.warn('data-images không hợp lệ', err);
    }
  });

  btnClose.addEventListener('click', close);
  btnPrev .addEventListener('click', () => show(index - 1));
  btnNext .addEventListener('click', () => show(index + 1));

  // Đóng khi bấm nền tối
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });

  // Phím tắt + vuốt mobile
  document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('hidden')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft')  show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });
  let x0 = null;
  lightbox.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, {passive:true});
  lightbox.addEventListener('touchend',   e => {
    if (x0 == null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) dx > 0 ? show(index - 1) : show(index + 1);
    x0 = null;
  }, {passive:true});
})();
// ===== LIGHTBOX với dots + autoplay =====
(function () {
  const lb = document.getElementById('lightbox');
  if (!lb) return;

  const imgEl    = lb.querySelector('.lb-img');
  const btnClose = lb.querySelector('.lb-close');
  const btnPrev  = lb.querySelector('.lb-prev');
  const btnNext  = lb.querySelector('.lb-next');
  const countEl  = lb.querySelector('.lb-count');
  const dotsBox  = lb.querySelector('.lb-dots');

  let images = [];
  let index  = 0;

  // --- Autoplay settings ---
  const AUTOPLAY_MS = 4000;
  const RESUME_MS   = 6000;
  let autoplayTimer = null;
  let resumeTimer   = null;

  function updateDots(){
    if (!dotsBox) return;
    [...dotsBox.children].forEach((d,i) => d.classList.toggle('active', i === index));
  }

  function show(i) {
    if (!images.length) return;
    index = (i + images.length) % images.length;
    imgEl.src = images[index];
    countEl.textContent = `${index + 1} / ${images.length}`;
    updateDots();
  }

  function buildDots() {
    if (!dotsBox) return;
    dotsBox.innerHTML = '';
    images.forEach((_, i) => {
      const b = document.createElement('button');
      if (i === 0) b.classList.add('active');
      b.addEventListener('click', () => { pauseAndResume(); show(i); });
      dotsBox.appendChild(b);
    });
  }

  function startAutoplay(){
    stopAutoplay();
    autoplayTimer = setInterval(() => show(index + 1), AUTOPLAY_MS);
  }
  function stopAutoplay(){
    if (autoplayTimer) clearInterval(autoplayTimer);
    autoplayTimer = null;
  }
  function pauseAndResume(){
    stopAutoplay();
    if (resumeTimer) clearTimeout(resumeTimer);
    resumeTimer = setTimeout(startAutoplay, RESUME_MS);
  }

  function open(arr, start = 0) {
    images = Array.isArray(arr) ? arr.slice() : [];
    if (!images.length) return;
    buildDots();
    show(start);
    lb.classList.remove('hidden');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    startAutoplay();
  }

  function close() {
    lb.classList.add('hidden');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    stopAutoplay();
    if (resumeTimer) clearTimeout(resumeTimer);
  }

  // Chỉ mở khi bấm vào IMG trong .gallery-item
  document.addEventListener('click', (e) => {
    if (e.target.tagName !== 'IMG') return;
    const card = e.target.closest('.gallery-item');
    if (!card) return;

    let arr = [];
    try { arr = JSON.parse(card.getAttribute('data-images') || '[]'); }
    catch {}

    if (!arr.length) {
      const thumb = card.querySelector('img');
      if (thumb && thumb.getAttribute('src')) arr = [thumb.getAttribute('src')];
    }

    const thumbSrc = e.target.getAttribute('src');
    const startIdx = Math.max(0, arr.indexOf(thumbSrc));

    open(arr, startIdx);
  });

  // Điều khiển + tạm dừng autoplay khi tương tác
  btnClose.addEventListener('click', close);
  btnPrev .addEventListener('click', () => { pauseAndResume(); show(index - 1); });
  btnNext .addEventListener('click', () => { pauseAndResume(); show(index + 1); });

  // Đóng khi bấm nền
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });

  // Phím tắt
  document.addEventListener('keydown', (e) => {
    if (lb.classList.contains('hidden')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft')  { pauseAndResume(); show(index - 1); }
    if (e.key === 'ArrowRight') { pauseAndResume(); show(index + 1); }
  });

  // Vuốt mobile
  let x0 = null;
  lb.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; pauseAndResume(); }, {passive:true});
  lb.addEventListener('touchend',   e => {
    if (x0 == null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) (dx > 0 ? show(index - 1) : show(index + 1));
    x0 = null;
  }, {passive:true});

  // Dừng khi hover (desktop)
  lb.addEventListener('mouseenter', pauseAndResume);
  lb.addEventListener('mousemove',  pauseAndResume);
})();
