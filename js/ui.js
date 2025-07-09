// js/ui.js
document.addEventListener('DOMContentLoaded', () => {
  // プログレスバー制御
  const progressBar = document.getElementById('progress-bar');
  window.addEventListener('scroll', () => {
    const scrollRatio = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    document.documentElement.style.setProperty('--scroll-progress', `${scrollRatio * 100}%`);
  });

  // ダークモード切替ボタン
  const toggle = document.getElementById('darkToggle');
  toggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    // 必要に応じてlocalStorageに状態を保存
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme-dark', isDark);
  });

  // 初期テーマ復元
  if (localStorage.getItem('theme-dark') === 'true') {
    document.documentElement.classList.add('dark');
  }
});
