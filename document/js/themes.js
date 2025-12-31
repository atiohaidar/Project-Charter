export const Themes = {
    init() {
        const themeSelect = document.getElementById('theme-select');
        const applyTheme = (theme) => {
            document.body.setAttribute('data-theme', theme);
            localStorage.setItem('docTheme', theme);
            if (themeSelect) themeSelect.value = theme;
        };

        const savedTheme = localStorage.getItem('docTheme') || 'typewriter';
        applyTheme(savedTheme);

        if (themeSelect) {
            themeSelect.addEventListener('change', (e) => {
                applyTheme(e.target.value);
            });
        }
    }
};
