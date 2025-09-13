# Crear el sistema de temas
themes_js = '''/* =====================================================
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
            .join('\\n');
            
        return `:root {\\n${cssVars}\\n}`;
    }
    
    // Importar tema desde CSS
    importTheme(cssString) {
        try {
            const matches = cssString.match(/--([\\w-]+):\\s*([^;]+);/g);
            if (!matches) return false;
            
            const customColors = {};
            matches.forEach(match => {
                const [, property, value] = match.match(/--([\\w-]+):\\s*([^;]+);/);
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
}'''

# Crear la configuración premium
config_premium_js = '''/* =====================================================
   COMPANY+ PREMIUM - CONFIGURACIÓN AVANZADA
   Configuraciones centralizadas y personalizables
   ===================================================== */

const CONFIG = {
    // Información de la aplicación
    app: {
        name: 'COMPANY+',
        version: '2.0.0-premium',
        environment: 'production', // development, staging, production
        debug: false,
        analytics: true
    },
    
    // Configuración de performance
    performance: {
        // Lazy loading
        lazyLoadImages: true,
        lazyLoadOffset: '100px',
        
        // Preloading
        preloadCriticalResources: true,
        preloadNextPages: false,
        
        // Caching
        enableServiceWorker: true,
        cacheVersion: 'v2.0.0',
        cacheTimeout: 24 * 60 * 60 * 1000, // 24 horas
        
        // Bundle optimization
        loadScriptsAsync: true,
        deferNonCriticalCSS: true
    },
    
    // Configuración de interfaz
    ui: {
        // Animaciones
        animations: {
            enabled: true,
            duration: 250, // ms
            easing: 'ease-out',
            reducedMotion: false // se detecta automáticamente
        },
        
        // Loader
        loader: {
            showOnNavigation: true,
            minimumDisplayTime: 500, // ms
            progressBarAnimation: true,
            customMessages: true
        },
        
        // Transiciones entre páginas
        pageTransitions: {
            enabled: true,
            type: 'fade', // fade, slide, scale
            duration: 300,
            overlap: 100 // ms de overlap
        },
        
        // Notificaciones
        notifications: {
            position: 'top-right', // top-left, top-right, bottom-left, bottom-right
            timeout: 5000, // ms
            maxVisible: 3,
            soundEnabled: false
        },
        
        // Tema
        theme: {
            autoDetect: true,
            respectSystemPreference: true,
            enableCustomThemes: false,
            savePreference: true
        }
    },
    
    // Configuración de partículas
    particles: {
        enabled: true,
        count: 50,
        size: {
            min: 1,
            max: 4
        },
        speed: {
            min: 0.5,
            max: 2
        },
        opacity: {
            min: 0.3,
            max: 0.7
        },
        colors: ['#0a97f7', '#10b981', '#f59e0b'],
        enableOnMobile: false, // para mejor performance
        canvas: {
            backgroundColor: 'transparent',
            responsive: true
        }
    },
    
    // Configuración de slides/carrusel
    slides: {
        autoPlay: true,
        interval: 4000, // ms
        pauseOnHover: true,
        showIndicators: true,
        showControls: true,
        loop: true,
        transition: 'fade', // fade, slide
        swipeEnabled: true
    },
    
    // Configuración de internacionalización
    i18n: {
        defaultLanguage: 'es',
        fallbackLanguage: 'es',
        autoDetect: true,
        supportedLanguages: ['es', 'en', 'pt', 'fr'],
        dateFormat: 'locale', // locale, iso, custom
        numberFormat: 'locale',
        currencyFormat: 'locale'
    },
    
    // Configuración de accesibilidad
    accessibility: {
        // Navegación por teclado
        keyboardNavigation: true,
        skipLinks: true,
        focusVisible: true,
        
        // Screen readers
        ariaLabels: true,
        liveRegions: true,
        
        // Reducir movimiento
        respectReducedMotion: true,
        
        // Contraste
        highContrastMode: false,
        
        // Tamaños de fuente
        allowFontScaling: true,
        minFontSize: 14, // px
        maxFontSize: 24  // px
    },
    
    // Configuración de formularios
    forms: {
        // Validación
        realTimeValidation: true,
        showValidationIcons: true,
        highlightErrors: true,
        
        // Auto-guardado
        autoSave: false,
        autoSaveInterval: 30000, // ms
        
        // Autocompletado
        enableAutocomplete: true,
        
        // Seguridad
        passwordStrengthMeter: true,
        preventPastePassword: false
    },
    
    // Configuración de búsqueda
    search: {
        enableInstantSearch: true,
        debounceDelay: 300, // ms
        minQueryLength: 2,
        maxResults: 10,
        highlightMatches: true,
        enableVoiceSearch: false, // requiere API de voz
        searchHistory: true,
        maxHistoryItems: 10
    },
    
    // URLs y endpoints (para futuro backend)
    api: {
        baseURL: 'https://api.companyplus.com',
        version: 'v1',
        timeout: 10000, // ms
        retries: 3,
        endpoints: {
            auth: {
                login: '/auth/login',
                register: '/auth/register',
                logout: '/auth/logout',
                refresh: '/auth/refresh',
                forgotPassword: '/auth/forgot-password',
                resetPassword: '/auth/reset-password'
            },
            user: {
                profile: '/user/profile',
                profiles: '/user/profiles',
                preferences: '/user/preferences',
                watchlist: '/user/watchlist'
            },
            content: {
                featured: '/content/featured',
                trending: '/content/trending',
                search: '/content/search',
                categories: '/content/categories',
                recommendations: '/content/recommendations'
            }
        }
    },
    
    // Configuración de almacenamiento local
    storage: {
        // Prefijos para evitar colisiones
        prefix: 'company_',
        
        // Límites
        maxStorageSize: 5 * 1024 * 1024, // 5MB
        
        // Encriptación (para datos sensibles)
        encryptSensitiveData: false,
        
        // Limpieza automática
        autoCleanup: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días
        
        // Sincronización entre pestañas
        syncBetweenTabs: true
    },
    
    // Configuración de PWA
    pwa: {
        enabled: true,
        installPrompt: true,
        updateNotification: true,
        offlineSupport: false, // requiere más implementación
        backgroundSync: false   // requiere service worker avanzado
    },
    
    // Configuración de desarrollo/debug
    development: {
        showPerformanceMetrics: false,
        logLevel: 'error', // none, error, warn, info, debug
        enableHotReload: false,
        showGridOverlay: false,
        enableAccessibilityChecker: false
    },
    
    // Configuración de analytics (preparado para futuro)
    analytics: {
        enabled: false, // cambiar a true cuando se integre
        provider: 'google', // google, custom
        trackingId: '',
        events: {
            pageViews: true,
            userInteractions: true,
            formSubmissions: true,
            errorTracking: true,
            performanceTracking: false
        },
        respectDoNotTrack: true
    },
    
    // Configuración de seguridad
    security: {
        // CSP
        contentSecurityPolicy: true,
        
        // Input sanitization
        sanitizeInputs: true,
        
        // Rate limiting (frontend)
        rateLimiting: {
            enabled: false, // mejor implementar en backend
            maxRequests: 100,
            timeWindow: 60000 // ms
        },
        
        // Session
        sessionTimeout: 30 * 60 * 1000, // 30 minutos
        rememberMeDuration: 30 * 24 * 60 * 60 * 1000 // 30 días
    }
};

// Funciones de utilidad para configuración
const ConfigUtils = {
    // Obtener configuración anidada
    get(path, defaultValue = null) {
        return path.split('.').reduce((obj, key) => obj?.[key], CONFIG) ?? defaultValue;
    },
    
    // Establecer configuración anidada
    set(path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const target = keys.reduce((obj, key) => {
            if (!obj[key]) obj[key] = {};
            return obj[key];
        }, CONFIG);
        target[lastKey] = value;
    },
    
    // Verificar si una función está habilitada
    isEnabled(feature) {
        return this.get(feature, false) === true;
    },
    
    // Obtener configuración de entorno
    getEnvironmentConfig() {
        return {
            isDevelopment: CONFIG.app.environment === 'development',
            isStaging: CONFIG.app.environment === 'staging',
            isProduction: CONFIG.app.environment === 'production',
            debug: CONFIG.app.debug || CONFIG.app.environment === 'development'
        };
    },
    
    // Validar configuración
    validate() {
        const errors = [];
        
        // Validaciones básicas
        if (!CONFIG.app.name) errors.push('app.name is required');
        if (!CONFIG.app.version) errors.push('app.version is required');
        if (!CONFIG.i18n.supportedLanguages.length) errors.push('i18n.supportedLanguages cannot be empty');
        
        return {
            isValid: errors.length === 0,
            errors
        };
    },
    
    // Exportar configuración
    export() {
        return JSON.stringify(CONFIG, null, 2);
    },
    
    // Importar configuración
    import(configString) {
        try {
            const newConfig = JSON.parse(configString);
            Object.assign(CONFIG, newConfig);
            return true;
        } catch (error) {
            console.error('Error importing configuration:', error);
            return false;
        }
    }
};

// Hacer disponible globalmente
window.CONFIG = CONFIG;
window.ConfigUtils = ConfigUtils;

// Exportar para módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, ConfigUtils };
}

// Inicialización automática de configuraciones
document.addEventListener('DOMContentLoaded', () => {
    // Aplicar configuraciones de accesibilidad
    if (CONFIG.accessibility.respectReducedMotion && 
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        CONFIG.ui.animations.enabled = false;
    }
    
    // Detectar capacidades del dispositivo
    if (CONFIG.particles.enableOnMobile === false && /Mobi|Android/i.test(navigator.userAgent)) {
        CONFIG.particles.enabled = false;
    }
    
    // Log de configuración en desarrollo
    if (CONFIG.app.debug) {
        console.log('COMPANY+ Configuration loaded:', CONFIG);
    }
});'''

# Guardar ambos archivos
with open('themes.js', 'w', encoding='utf-8') as f:
    f.write(themes_js)

with open('config-premium.js', 'w', encoding='utf-8') as f:
    f.write(config_premium_js)

print("✅ Sistema de temas creado: themes.js")
print(f"Tamaño: {len(themes_js)} caracteres")
print("\n✅ Configuración premium creada: config-premium.js")
print(f"Tamaño: {len(config_premium_js)} caracteres")

print("\nCaracterísticas del sistema de temas:")
print("- 🌓 Alternancia suave entre claro/oscuro")
print("- 🔄 Detección automática del tema del sistema")
print("- 💾 Persistencia de preferencias")
print("- ⚡ Cambios sin flash/parpadeo")
print("- 📱 Soporte para theme-color móvil")
print("- 🎨 Temas personalizados (exportar/importar)")
print("- 🔔 Sistema de observadores")
print("- ♿ Soporte completo de accesibilidad")

print("\nCaracterísticas de la configuración:")
print("- 🎛️ Configuración centralizada y modular")
print("- 🚀 Optimizaciones de performance")
print("- ♿ Configuraciones de accesibilidad")
print("- 🎨 Personalización de UI/UX")
print("- 🔐 Configuraciones de seguridad")
print("- 📊 Preparado para analytics")
print("- 📱 Configuraciones de PWA")
print("- 🛠️ Utilidades de configuración")