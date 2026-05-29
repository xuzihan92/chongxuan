/**
 * 重玄雷击木站点主脚本
 * 功能：图片懒加载、移动端导航、平滑滚动增强
 */

(function () {
  "use strict";

  /* ========== 主题切换 ========== */
  const STORAGE_KEY = "theme-preference";
  const html = document.documentElement;

  function getTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }

  function applyTheme(theme) {
    if (theme === "light") {
      html.setAttribute("data-theme", "light");
    } else {
      html.removeAttribute("data-theme");
    }
    updateToggleIcon(theme);
  }

  function updateToggleIcon(theme) {
    const toggles = document.querySelectorAll(".theme-toggle");
    toggles.forEach(function (btn) {
      btn.innerHTML = theme === "light" ? "☾" : "☀";
      btn.setAttribute("title", theme === "light" ? "切换为暗色" : "切换为浅色");
      btn.setAttribute("aria-label", theme === "light" ? "切换为暗色主题" : "切换为浅色主题");
    });
  }

  function toggleTheme() {
    const current = getTheme();
    const next = current === "light" ? "dark" : "light";
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  }

  // 初始化
  applyTheme(getTheme());

  // 监听系统主题变化（仅在用户未手动设置时）
  window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", function (e) {
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(e.matches ? "light" : "dark");
    }
  });

  document.addEventListener("click", function (e) {
    const btn = e.target.closest(".theme-toggle");
    if (btn) {
      e.preventDefault();
      toggleTheme();
    }
  });

  /* ========== 移动端导航切换 ========== */
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", function () {
      const isOpen = mobileMenu.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // 点击菜单链接后自动关闭
    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileMenu.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ========== 图片懒加载 ========== */
  const lazyImages = document.querySelectorAll("img[data-src]");

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add("loaded");
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: "50px 0px",
      threshold: 0.01
    });

    lazyImages.forEach(function (img) {
      imageObserver.observe(img);
    });
  } else {
    // 降级：直接加载全部
    lazyImages.forEach(function (img) {
      img.src = img.dataset.src;
      img.classList.add("loaded");
    });
  }

  /* ========== 导航栏滚动效果 ========== */
  const header = document.querySelector(".site-header");
  let lastScrollY = 0;

  if (header) {
    window.addEventListener("scroll", function () {
      const currentScrollY = window.scrollY;

      // 滚动超过 10px 时增加阴影
      if (currentScrollY > 10) {
        header.style.boxShadow = "0 4px 20px rgba(0,0,0,0.3)";
      } else {
        header.style.boxShadow = "none";
      }

      lastScrollY = currentScrollY;
    });
  }
})();
