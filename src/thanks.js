import './style.css';

let n = 8;
const el = document.getElementById('count');
const t = setInterval(() => {
  n -= 1;
  el.textContent = n;
  if (n <= 0) {
    clearInterval(t);
    window.location.href = '/';
  }
}, 1000);
