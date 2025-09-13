/* =====================================================
   COMPANY+ PREMIUM - SISTEMA DE TEMAS
   Manejo avanzado de tema claro/oscuro
   ===================================================== */

class ThemeManager {
    constructor() {
        this.currentTheme = 'light';
        this.observers = [];
        this.transitions = true;

        this.init();
    }

    init() {
        this.detectTheme();
        this.applyTheme(this.currentTheme);
        this.setupToggle();
        this.setupSystemThemeListener();
    }

    // Detectar tema preferido
    detectTheme() {
        // Verificar localStorage primero
        const savedTheme = localStorage.getItem('company-theme');
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
            this.currentTheme = savedTheme;
            return;
        }

        // Detectar preferencia del sistema
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.currentTheme = 'dark';
        } else {
            this.currentTheme = 'light';
        }
    }

    // Aplicar tema
    applyTheme(theme) {
        // Deshabilitar transiciones temporalmente para evitar flash
        if (this.transitions) {
            this.disableTransitions();
        }

        // Actualizar atributo del documento
        document.documentElement.setAttribute('data-theme', theme);

        // Actualizar meta theme-color para mobile browsers
        this.updateThemeColor(theme);

        // Guardar preferencia
        localStorage.setItem('company-theme', theme);
        this.currentTheme = theme;

        // Actualizar toggle
        this.updateToggleIcon();

        // Notificar observadores
        this.notifyObservers(theme);

        // Re-habilitar transiciones
        if (this.transitions) {
            setTimeout(() => this.enableTransitions(), 50);
        }
    }

    // Alternar tema
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);

        // Haptic feedback en dispositivos móviles
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }

        // Analytics (si están disponibles)
        this.trackThemeChange(newTheme);
    }

    // Configurar toggle button
    setupToggle() {
        const toggleBtn = document.getElementById('themeToggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggleTheme());

            // Keyboard support
            toggleBtn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleTheme();
                }
            });
        }
    }

    // Actualizar icono del toggle
    updateToggleIcon() {
        const lightIcon = document.querySelector('.theme-icon.light-icon');
        const darkIcon = document.querySelector('.theme-icon.dark-icon');
        const toggle = document.getElementById('themeToggle');

        if (lightIcon && darkIcon && toggle) {
            // Actualizar aria-label para accesibilidad
            const newLabel = this.currentTheme === 'light' ? 
                i18n.t('switch_to_dark', 'Cambiar a tema oscuro') : 
                i18n.t('switch_to_light', 'Cambiar a tema claro');
            toggle.setAttribute('aria-label', newLabel);

            // Actualizar título
            toggle.title = newLabel;
        }
    }

    // Actualizar theme-color meta tag
    updateThemeColor(theme) {
        let themeColorMeta = document.querySelector('meta[name="theme-color"]');
        if (!themeColorMeta) {
            themeColorMeta = document.createElement('meta');
            themeColorMeta.name = 'theme-color';
            document.head.appendChild(themeColorMeta);
        }

        const themeColors = {
            light: '#ffffff',
            dark: '#0f172a'
        };

        themeColorMeta.content = themeColors[theme] || themeColors.light;
    }

    // Escuchar cambios en preferencia del sistema
    setupSystemThemeListener() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

            // Listener para cambios
            mediaQuery.addEventListener('change', (e) => {
                // Solo cambiar si no hay preferencia guardada
                if (!localStorage.getItem('company-theme')) {
                    const systemTheme = e.matches ? 'dark' : 'light';
                    this.applyTheme(systemTheme);
                }
            });
        }
    }

    // Deshabilitar transiciones temporalmente
    disableTransitions() {
        const style = document.createElement('style');
        style.id = 'disable-transitions';
        style.innerHTML = `
            *,
            *::before,
            *::after {
                transition-duration: 0ms !important;
                animation-duration: 0ms !important;
                transition-delay: 0ms !important;
                animation-delay: 0ms !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Re-habilitar transiciones
    enableTransitions() {
        const style = document.getElementById('disable-transitions');
        if (style) {
            style.remove();
        }
    }

    // Obtener tema actual
    getCurrentTheme() {
        return this.currentTheme;
    }

    // Verificar si es tema oscuro
    isDarkMode() {
        return this.currentTheme === 'dark';
    }

    // Sistema de observadores
    subscribe(callback) {
        this.observers.push(callback);
    }

    unsubscribe(callback) {
        this.observers = this.observers.filter(obs => obs !== callback);
    }

    notifyObservers(theme) {
        this.observers.forEach(callback => {
            try {
                callback(theme);
            } catch (error) {
                console.error('Error in theme observer:', error);
            }
        });
    }

    // Analytics tracking
    trackThemeChange(newTheme) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'theme_change', {
                theme: newTheme,
                previous_theme: this.currentTheme === 'light' ? 'dark' : 'light'
            });
        }

        if (typeof analytics !== 'undefined') {
            analytics.track('Theme Changed', {
                theme: newTheme,
                timestamp: new Date().toISOString()
            });
        }
    }

    // Auto-tema basado en hora del día
    enableAutoTheme() {
        const hour = new Date().getHours();
        const isNightTime = hour < 7 || hour > 19; // 7 PM - 7 AM

        const autoTheme = isNightTime ? 'dark' : 'light';
        this.applyTheme(autoTheme);

        // Configurar cambio automático
        this.setupAutoThemeSchedule();
    }

    // Configurar cambio automático por horario
    setupAutoThemeSchedule() {
        const checkTime = () => {
            const hour = new Date().getHours();
            const shouldBeDark = hour < 7 || hour > 19;
            const targetTheme = shouldBeDark ? 'dark' : 'light';

            if (targetTheme !== this.currentTheme) {
                this.applyTheme(targetTheme);
            }
        };

        // Verificar cada hora
        setInterval(checkTime, 60 * 60 * 1000);
    }

    // Obtener colores CSS del tema actual
    getThemeColors() {
        const computedStyle = getComputedStyle(document.documentElement);

        return {
            primary: computedStyle.getPropertyValue('--primary').trim(),
            background: computedStyle.getPropertyValue('--bg-primary').trim(),
            textPrimary: computedStyle.getPropertyValue('--text-primary').trim(),
            textSecondary: computedStyle.getPropertyValue('--text-secondary').trim(),
            border: computedStyle.getPropertyValue('--border-color').trim()
        };
    }

    // Aplicar tema personalizado
    setCustomTheme(customColors) {
        const root = document.documentElement;

        Object.entries(customColors).forEach(([property, value]) => {
            root.style.setProperty(`--${property}`, value);
        });

        // Marcar como tema personalizado
        root.setAttribute('data-theme', 'custom');
        this.currentTheme = 'custom';
    }

    // Resetear tema personalizado
    resetToDefaultTheme() {
        const root = document.documentElement;
        const customProperties = [
            '--primary', '--bg-primary', '--text-primary', 
            '--text-secondary', '--border-color'
        ];

        customProperties.forEach(prop => {
            root.style.removeProperty(prop);
        });

        this.applyTheme('light');
    }

    // Exportar tema actual como CSS
    exportTheme() {
        const colors = this.getThemeColors();
        const cssVars = Object.entries(colors)
            .map(([key, value]) => `  --${key}: ${value};`)
            .join('\n');

        return `:root {\n${cssVars}\n}`;
    }

    // Importar tema desde CSS
    importTheme(cssString) {
        try {
            const matches = cssString.match(/--([\w-]+):\s*([^;]+);/g);
            if (!matches) return false;

            const customColors = {};
            matches.forEach(match => {
                const [, property, value] = match.match(/--([\w-]+):\s*([^;]+);/);
                customColors[property] = value.trim();
            });

            this.setCustomTheme(customColors);
            return true;
        } catch (error) {
            console.error('Error importing theme:', error);
            return false;
        }
    }
}

// Instancia global
window.themeManager = new ThemeManager();

// Exportar para módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
}