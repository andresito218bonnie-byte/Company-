/* =====================================================
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
});