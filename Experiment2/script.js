document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme) {
        document.body.classList.add(currentTheme);

        if (currentTheme === 'dark-mode') {
            themeToggle.checked = true;
        }
    }

    themeToggle.addEventListener('change', function () {
        document.body.classList.toggle('dark-mode');

        let theme = 'light-mode';
        if (document.body.classList.contains('dark-mode')) {
            theme = 'dark-mode';
        }
        localStorage.setItem('theme', theme);
    });

    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    document.addEventListener('click', (event) => {
        if (sidebar.classList.contains('open') && !sidebar.contains(event.target) && event.target !== menuToggle) {
            sidebar.classList.remove('open');
        }
    });
});