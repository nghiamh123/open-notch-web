(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Cuộn hiện dần ---------- */
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach((el, i) => {
      el.style.transitionDelay = (i % 4) * 70 + 'ms';
      io.observe(el);
    });
  } else {
    items.forEach((el) => el.classList.add('in'));
  }

  /* ---------- Video tự chạy khi cuộn tới, dừng khi cuộn đi ---------- */
  // Trình duyệt chỉ cho tự phát khi video tắt tiếng; người xem bật tiếng bằng nút loa trên thanh điều khiển.
  const promo = document.getElementById('promo');
  if (promo && 'IntersectionObserver' in window && !reduceMotion) {
    let userPaused = false;   // người xem tự bấm dừng → không tự chạy lại
    let autoPausing = false;  // lần dừng do cuộn đi, không tính là người xem dừng
    promo.addEventListener('play', () => { userPaused = false; });
    promo.addEventListener('pause', () => {
      if (autoPausing) { autoPausing = false; return; }
      userPaused = true;
    });
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (!userPaused && promo.paused) promo.play().catch(() => {});
      } else if (!promo.paused) {
        autoPausing = true;
        promo.pause();
      }
    }, { threshold: 0.1 }).observe(promo);
  }

  /* ---------- Sao chép số tài khoản ---------- */
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const label = btn.dataset.label;
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        btn.textContent = 'Đã chép ✓';
      } catch {
        btn.textContent = btn.dataset.copy;
      }
      setTimeout(() => { btn.textContent = label; }, 2200);
    });
  });

  /* ---------- Sao chép lệnh ---------- */
  const copyBtn = document.getElementById('copy');
  const cmd = document.getElementById('cmd');
  if (copyBtn && cmd) {
    copyBtn.addEventListener('click', async () => {
      const label = copyBtn.dataset.label;
      try {
        await navigator.clipboard.writeText(cmd.textContent.trim());
        copyBtn.textContent = 'Đã chép ✓';
      } catch {
        const r = document.createRange();
        r.selectNodeContents(cmd);
        const sel = getSelection();
        sel.removeAllRanges();
        sel.addRange(r);
        copyBtn.textContent = 'Nhấn ⌘C';
      }
      setTimeout(() => { copyBtn.textContent = label; }, 2000);
    });
  }
})();
