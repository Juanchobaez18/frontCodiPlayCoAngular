document.addEventListener('DOMContentLoaded', () => {
    console.log("Dashboard CodiPlay + Modo Oscuro Cargado");

    // --- LÓGICA DEL MODO OSCURO ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;
    const body = document.body;

    // 1. Verificar si hay una preferencia guardada
    const savedTheme = localStorage.getItem('codiplay-theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    }

    if (themeToggleBtn && themeIcon) {
        // 2. Evento Click del Botón
        themeToggleBtn.addEventListener('click', () => {
            body.classList.toggle('dark-mode');

            // Cambiar Icono y Guardar preferencia
            if (body.classList.contains('dark-mode')) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
                localStorage.setItem('codiplay-theme', 'dark');
            } else {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
                localStorage.setItem('codiplay-theme', 'light');
            }
        });
    }

    // --- SIDEBAR COLAPSABLE EN MÓVIL ---
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggles = document.querySelectorAll('.mobile-nav-toggle');

    if (sidebar && sidebarToggles.length > 0) {
        sidebarToggles.forEach(btn => {
            btn.addEventListener('click', () => {
                sidebar.classList.toggle('sidebar--open');
            });
        });

        // Cerrar el sidebar al hacer clic fuera en móvil
        document.addEventListener('click', (e) => {
            if (!sidebar.classList.contains('sidebar--open')) return;
            const target = e.target;
            if (sidebar.contains(target) || (target.closest && target.closest('.mobile-nav-toggle'))) {
                return;
            }
            sidebar.classList.remove('sidebar--open');
        });
    }


    // --- LÓGICA ORIGINAL ---

    // Menú Lateral
    const menuItems = document.querySelectorAll('.sidebar-menu li');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // Botón Continuar
    const continueBtn = document.querySelector('.btn-continue');
    if(continueBtn) {
        continueBtn.addEventListener('click', () => {
            // Animación simple de click
            continueBtn.style.transform = "scale(0.95)";
            setTimeout(() => continueBtn.style.transform = "scale(1)", 100);
            console.log("Continuando curso...");
        });
    }

    // Botones Bloqueados
    const lockedBtns = document.querySelectorAll('.btn-locked');
    lockedBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            // Animación de sacudida (shake) usando CSS inline temporal
            btn.style.transition = "transform 0.1s";
            btn.style.transform = "translateX(5px)";
            setTimeout(() => btn.style.transform = "translateX(-5px)", 100);
            setTimeout(() => btn.style.transform = "translateX(0)", 200);
        });
    });
});
