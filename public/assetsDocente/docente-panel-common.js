/**
 * UI compartida del panel docente (HTML estático en public/InterfazDocente y vistas Angular).
 * Tema: clase `dark-mode` en body (alineado con assetsDocente/*.css).
 */
(function () {
  'use strict';

  var THEME_KEY = 'theme';

  function setDarkMode(enabled) {
    if (enabled) {
      document.body.classList.add('dark-mode');
      localStorage.setItem(THEME_KEY, 'dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem(THEME_KEY, 'light-mode');
    }
  }

  function applySavedTheme() {
    var theme = localStorage.getItem(THEME_KEY);
    var themeSwitch = document.getElementById('themeSwitch');
    var switchLabel = document.querySelector('.switch');
    var isDark = theme === 'dark-mode';

    if (isDark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }

    if (themeSwitch) {
      themeSwitch.checked = isDark;
    }
    if (switchLabel) {
      switchLabel.setAttribute('aria-checked', isDark ? 'true' : 'false');
    }
  }

  function bindThemeSwitch() {
    var themeSwitch = document.getElementById('themeSwitch');
    var switchLabel = document.querySelector('.switch');
    if (!themeSwitch) return;

    themeSwitch.addEventListener('change', function () {
      var isDark = this.checked;
      setDarkMode(isDark);
      if (switchLabel) {
        switchLabel.setAttribute('aria-checked', isDark ? 'true' : 'false');
      }
    });
  }

  function markActiveNavLink() {
    var currentPath = window.location.pathname;
    document.querySelectorAll('.top-nav-link').forEach(function (link) {
      link.classList.remove('active');
      var href = link.getAttribute('href');
      if (href && currentPath.indexOf(href) !== -1) {
        link.classList.add('active');
      }
    });
  }

  function bindProfileMenu() {
    var userProfileBtn = document.getElementById('userProfileBtn');
    var userProfileMenu = document.getElementById('userProfileMenu');
    if (!userProfileBtn || !userProfileMenu) return;

    userProfileBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      userProfileMenu.classList.toggle('show');
    });

    document.addEventListener('click', function (e) {
      if (!userProfileBtn.contains(e.target) && !userProfileMenu.contains(e.target)) {
        userProfileMenu.classList.remove('show');
      }
    });

    var logoutBtn = userProfileMenu.querySelector('.submenu-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function () {
        userProfileMenu.classList.remove('show');
        try {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        } catch (err) { /* ignore */ }
      });
    }
  }

  function bindAngularForms() {
    document.querySelectorAll('form[method="post"]').forEach(function (form) {
      if (form.getAttribute('action') && form.getAttribute('action') !== '#') {
        form.setAttribute('action', '#');
      }
      form.addEventListener('submit', function (e) {
        e.preventDefault();
      });
    });
  }

  /** Redirige .html legacy a rutas de la SPA Angular. */
  function redirectLegacyHtmlToAngular() {
    var file = window.location.pathname.split('/').pop() || '';
    var map = {
      'paneldocente.html': '/docente/dashboard',
      'MisCursos.html': '/docente/mis-cursos',
      'Tareas.html': '/docente/tareas',
      'Mensajes.html': '/docente/mensajes',
      'Foros.html': '/docente/foros',
      'ForoDetalle.html': '/docente/foros',
    };
    var target = map[file];
    if (target && window.location.pathname.indexOf('/InterfazDocente/') !== -1) {
      window.location.replace(target);
    }
  }

  redirectLegacyHtmlToAngular();

  document.addEventListener('DOMContentLoaded', function () {
    applySavedTheme();
    bindThemeSwitch();
    markActiveNavLink();
    bindProfileMenu();
    bindAngularForms();
  });
})();
