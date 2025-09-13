/* =====================================================
   COMPANY+ PREMIUM SPA - APLICACIÓN PRINCIPAL
   Versión 2.0 Premium con todas las mejoras
   ===================================================== */

class CompanyPlusSPA {
    constructor() {
        this.currentView = 'home';
        this.previousView = null;
        this.isLoggedIn = false;
        this.selectedProfile = null;
        this.isTransitioning = false;
        this.particleSystem = null;
        this.loadingProgress = 0;
        this.mobileMenuOpen = false;

        // Estado de la aplicación
        this.state = {
            theme: 'light',
            language: 'es',
            user: null,
            profiles: [],
            currentProfile: null,
            searchQuery: '',
            isOffline: false
        };

        // Inicializar después de que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    // ==============================================
    // INICIALIZACIÓN
    // ==============================================

    async init() {
        console.log('🚀 Iniciando COMPANY+ Premium SPA v2.0');

        try {
            // Mostrar progreso de carga
            this.updateLoadingProgress(10);

            // Inicializar servicios base
            await this.initializeServices();
            this.updateLoadingProgress(30);

            // Configurar router y navegación
            this.setupRouter();
            this.updateLoadingProgress(50);

            // Configurar eventos y listeners
            this.bindEvents();
            this.updateLoadingProgress(70);

            // Cargar vista inicial
            await this.loadInitialView();
            this.updateLoadingProgress(90);

            // Finalizar inicialización
            this.finalizeLaunching();
            this.updateLoadingProgress(100);

            console.log('✅ COMPANY+ Premium SPA inicializada correctamente');

        } catch (error) {
            console.error('❌ Error inicializando la aplicación:', error);
            this.handleInitializationError(error);
        }
    }

    async initializeServices() {
        // Los servicios ya están inicializados por los archivos previos
        // Solo necesitamos configurar las referencias
        this.i18n = window.i18n;
        this.themeManager = window.themeManager;
        this.notifications = window.notifications;
        this.userProfiles = window.userProfiles;

        // Suscribirse a cambios de tema e idioma
        this.themeManager.subscribe((theme) => {
            this.state.theme = theme;
            this.onThemeChange(theme);
        });

        this.i18n.subscribe((language) => {
            this.state.language = language;
            this.onLanguageChange(language);
        });

        // Detectar si estamos offline
        this.setupOfflineDetection();
    }

    setupRouter() {
        // Rutas disponibles
        this.routes = {
            '': 'home',
            'home': 'home',
            'login': 'login',
            'register': 'register', 
            'forgot-password': 'forgot-password',
            'profiles': 'profiles',
            'dashboard': 'dashboard',
            'soporte': 'soporte',
            'soporte-tecnico': 'soporte-tecnico',
            'faq': 'faq',
            'seguridad': 'seguridad',
            'terminos': 'terminos',
            'settings': 'settings'
        };

        // Configurar listeners del router
        window.addEventListener('popstate', () => this.handlePopState());
        window.addEventListener('hashchange', () => this.handleHashChange());
    }

    bindEvents() {
        // Eventos de navegación
        document.addEventListener('click', (e) => this.handleNavigation(e));

        // Eventos del header
        this.setupHeaderEvents();

        // Eventos de formularios
        this.setupFormEvents();

        // Eventos de teclado
        this.setupKeyboardNavigation();

        // Eventos de dispositivo
        this.setupDeviceEvents();

        // Eventos de performance
        this.setupPerformanceOptimizations();
    }

    async loadInitialView() {
        // Determinar vista inicial
        const hash = window.location.hash.substring(1);
        const initialRoute = hash || 'home';
        const viewName = this.routes[initialRoute] || 'home';

        // Cargar vistas desde el archivo original (usando el sistema anterior)
        await this.loadViewTemplates();

        // Navegar a la vista inicial
        await this.navigateTo(initialRoute, false);
    }

    finalizeLaunching() {
        // Ocultar loader después de un delay mínimo
        setTimeout(() => {
            this.hidePageLoader();
        }, CONFIG.ui.loader.minimumDisplayTime || 1000);

        // Configurar PWA si está habilitado
        if (CONFIG.pwa.enabled) {
            this.setupPWA();
        }

        // Inicializar analytics si está habilitado
        if (CONFIG.analytics.enabled) {
            this.initializeAnalytics();
        }
    }

    // ==============================================
    // SISTEMA DE NAVEGACIÓN MEJORADO
    // ==============================================

    async navigateTo(route, addToHistory = true) {
        // Prevenir navegación durante transición
        if (this.isTransitioning) return;

        const viewName = this.routes[route] || 'home';

        // No hacer nada si ya estamos en esa vista
        if (this.currentView === viewName) return;

        console.log(`🧭 Navegando de ${this.currentView} a ${viewName}`);

        // Actualizar estado
        this.previousView = this.currentView;
        this.isTransitioning = true;

        // Mostrar loader si está configurado
        if (CONFIG.ui.loader.showOnNavigation) {
            this.showPageLoader();
        }

        try {
            // Ejecutar hooks pre-navegación
            await this.beforeViewChange(this.currentView, viewName);

            // Realizar transición
            await this.performViewTransition(viewName);

            // Actualizar URL
            if (addToHistory) {
                this.updateURL(route);
            }

            // Actualizar estado
            this.currentView = viewName;

            // Ejecutar hooks post-navegación
            await this.afterViewChange(this.previousView, viewName);

            // Actualizar navegación activa
            this.updateActiveNavigation(route);

            // Ocultar loader
            if (CONFIG.ui.loader.showOnNavigation) {
                this.hidePageLoader();
            }

        } catch (error) {
            console.error('Error durante navegación:', error);
            this.notifications.show(
                this.i18n.t('msg_navigation_error', 'Error al cargar la página'),
                'error'
            );
        } finally {
            this.isTransitioning = false;
        }
    }

    async performViewTransition(viewName) {
        const container = document.getElementById('app-container');
        const transitionType = CONFIG.ui.pageTransitions.type || 'fade';
        const duration = CONFIG.ui.pageTransitions.duration || 300;

        // Animación de salida
        await this.animateOut(container, transitionType, duration / 2);

        // Cambiar contenido
        await this.loadViewContent(viewName);

        // Animación de entrada
        await this.animateIn(container, transitionType, duration / 2);
    }

    async animateOut(element, type, duration) {
        return new Promise(resolve => {
            element.style.transition = `all ${duration}ms ease-out`;

            switch (type) {
                case 'fade':
                    element.style.opacity = '0';
                    break;
                case 'slide':
                    element.style.transform = 'translateX(-20px)';
                    element.style.opacity = '0';
                    break;
                case 'scale':
                    element.style.transform = 'scale(0.95)';
                    element.style.opacity = '0';
                    break;
            }

            setTimeout(resolve, duration);
        });
    }

    async animateIn(element, type, duration) {
        return new Promise(resolve => {
            // Reset transforms
            element.style.transform = '';
            element.style.opacity = '1';

            setTimeout(resolve, duration);
        });
    }

    async loadViewContent(viewName) {
        const container = document.getElementById('app-container');
        const viewContent = this.getViewTemplate(viewName);

        if (viewContent) {
            container.innerHTML = viewContent;

            // Configurar vista específica
            await this.setupViewSpecificFeatures(viewName);

            // Actualizar traducciones
            this.i18n.updateHTML();

            // Configurar validadores de formulario si existen
            this.setupFormValidation();

        } else {
            console.error(`Vista ${viewName} no encontrada`);
            container.innerHTML = `<div class="error-view">
                <h1>${this.i18n.t('error_404', 'Página no encontrada')}</h1>
                <p>${this.i18n.t('error_404_desc', 'La página que buscas no existe.')}</p>
                <button onclick="spa.navigateTo('home')" class="btn btn-primary">
                    ${this.i18n.t('go_home', 'Ir al Inicio')}
                </button>
            </div>`;
        }
    }

    async setupViewSpecificFeatures(viewName) {
        // Cleanup anterior
        this.cleanupViewFeatures();

        switch (viewName) {
            case 'home':
                await this.setupHomeView();
                break;
            case 'login':
            case 'register':
            case 'forgot-password':
                await this.setupAuthView(viewName);
                break;
            case 'profiles':
                await this.setupProfilesView();
                break;
            case 'dashboard':
                await this.setupDashboardView();
                break;
            case 'faq':
                await this.setupFAQView();
                break;
            default:
                await this.setupGenericView(viewName);
        }
    }

    // ==============================================
    // CONFIGURACIÓN DE VISTAS ESPECÍFICAS
    // ==============================================

    async setupHomeView() {
        // Inicializar carrusel de slides si existe
        this.initializeHeroSlides();

        // Configurar efectos de scroll
        this.setupScrollEffects();

        // Configurar CTAs
        this.setupCTAButtons();

        // Ocultar particles
        this.hideParticles();

        // Lazy load de imágenes
        this.setupLazyLoading();
    }

    async setupAuthView(viewName) {
        // Mostrar particles
        this.showParticles();

        // Configurar validación de formularios
        const form = document.querySelector(`#${viewName}-form`);
        if (form) {
            new FormValidator(form, {
                realTime: true,
                showIcons: true,
                highlightErrors: true
            });
        }

        // Focus en primer input
        const firstInput = document.querySelector('input');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }

    async setupProfilesView() {
        // Cargar perfiles existentes
        this.renderUserProfiles();

        // Ocultar particles
        this.hideParticles();
    }

    async setupDashboardView() {
        // Verificar autenticación
        if (!this.isLoggedIn) {
            this.navigateTo('login');
            return;
        }

        // Configurar carruseles de contenido
        this.setupContentCarousels();

        // Configurar búsqueda
        this.setupSearchComponent();

        // Configurar menú de usuario
        this.updateUserMenu();

        // Ocultar particles
        this.hideParticles();
    }

    async setupFAQView() {
        // Configurar acordeones
        this.setupFAQAccordions();

        // Ocultar particles
        this.hideParticles();
    }

    async setupGenericView(viewName) {
        // Configuración básica para vistas genéricas
        this.hideParticles();

        // Configurar scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ==============================================
    // SISTEMA DE PARTÍCULAS MEJORADO
    // ==============================================

    showParticles() {
        const particlesBg = document.getElementById('particlesBg');
        if (!particlesBg || !CONFIG.particles.enabled) return;

        particlesBg.style.display = 'block';

        if (!this.particleSystem) {
            this.particleSystem = new ParticleSystem(CONFIG.particles);
        }

        this.particleSystem.start();
    }

    hideParticles() {
        const particlesBg = document.getElementById('particlesBg');
        if (particlesBg) {
            particlesBg.style.display = 'none';
        }

        if (this.particleSystem) {
            this.particleSystem.stop();
        }
    }

    // ==============================================
    // EVENTOS Y MANEJO DE INTERACCIONES
    // ==============================================

    handleNavigation(e) {
        // Manejar enlaces de navegación
        const link = e.target.closest('a[href^="#"]');
        if (link) {
            e.preventDefault();
            const route = link.getAttribute('href').substring(1);
            this.navigateTo(route);
            return;
        }

        // Manejar botones especiales
        const button = e.target.closest('[data-action]');
        if (button) {
            const action = button.getAttribute('data-action');
            this.handleAction(action, button);
            return;
        }
    }

    handleAction(action, element) {
        switch (action) {
            case 'login':
                this.handleLogin();
                break;
            case 'register':
                this.handleRegister();
                break;
            case 'logout':
                this.handleLogout();
                break;
            case 'forgot-password':
                this.handleForgotPassword();
                break;
            case 'select-profile':
                const profileId = element.getAttribute('data-profile');
                this.selectProfile(profileId);
                break;
            case 'toggle-faq':
                this.toggleFAQItem(element);
                break;
        }
    }

    setupHeaderEvents() {
        // Toggle de menú móvil
        const mobileToggle = document.getElementById('mobileMenuToggle');
        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Selector de idioma
        const langToggle = document.getElementById('langToggle');
        const langDropdown = document.getElementById('langDropdown');

        if (langToggle && langDropdown) {
            langToggle.addEventListener('click', () => {
                langDropdown.classList.toggle('show');
            });

            // Cerrar dropdown al hacer click fuera
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.language-selector')) {
                    langDropdown.classList.remove('show');
                }
            });

            // Manejar selección de idioma
            langDropdown.addEventListener('click', (e) => {
                const langOption = e.target.closest('.lang-option');
                if (langOption) {
                    const newLang = langOption.getAttribute('data-lang');
                    this.changeLanguage(newLang);
                    langDropdown.classList.remove('show');
                }
            });
        }
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // ESC para cerrar modales/dropdowns
            if (e.key === 'Escape') {
                this.closeMobileMenu();
                document.getElementById('langDropdown')?.classList.remove('show');
            }

            // Alt + L para cambiar tema
            if (e.altKey && e.key === 'l') {
                e.preventDefault();
                this.themeManager.toggleTheme();
            }

            // Alt + S para ir a búsqueda
            if (e.altKey && e.key === 's') {
                e.preventDefault();
                const searchInput = document.querySelector('.search-input');
                if (searchInput) searchInput.focus();
            }
        });
    }

    setupDeviceEvents() {
        // Detectar cambios de orientación
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                if (this.particleSystem) {
                    this.particleSystem.resize();
                }
            }, 100);
        });

        // Detectar cambios de conexión
        window.addEventListener('online', () => {
            this.state.isOffline = false;
            this.notifications.show(
                this.i18n.t('msg_back_online', 'Conexión restablecida'),
                'success'
            );
        });

        window.addEventListener('offline', () => {
            this.state.isOffline = true;
            this.notifications.show(
                this.i18n.t('msg_offline', 'Sin conexión a internet'),
                'warning'
            );
        });
    }

    // ==============================================
    // MANEJO DE FORMULARIOS Y AUTENTICACIÓN
    // ==============================================

    setupFormEvents() {
        document.addEventListener('submit', (e) => {
            const form = e.target;
            const formType = form.id;

            switch (formType) {
                case 'login-form':
                    e.preventDefault();
                    this.handleLoginSubmit(form);
                    break;
                case 'register-form':
                    e.preventDefault();
                    this.handleRegisterSubmit(form);
                    break;
                case 'forgot-password-form':
                    e.preventDefault();
                    this.handleForgotPasswordSubmit(form);
                    break;
            }
        });
    }

    setupFormValidation() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            if (form.id && form.id.includes('-form')) {
                new FormValidator(form);
            }
        });
    }

    async handleLoginSubmit(form) {
        const formData = new FormData(form);
        const email = formData.get('email');
        const password = formData.get('password');
        const remember = formData.get('remember');

        this.showPageLoader();

        try {
            // Simular llamada a API
            await this.simulateApiCall(1500);

            // Login exitoso (simulado)
            this.isLoggedIn = true;
            this.state.user = {
                email: email,
                name: email.split('@')[0]
            };

            this.notifications.show(
                this.i18n.t('msg_login_success', 'Sesión iniciada correctamente'),
                'success'
            );

            // Navegar a profiles o dashboard
            const targetView = this.userProfiles.getProfiles().length > 1 ? 'profiles' : 'dashboard';
            this.navigateTo(targetView);

        } catch (error) {
            this.notifications.show(
                this.i18n.t('msg_login_error', 'Error al iniciar sesión'),
                'error'
            );
        } finally {
            this.hidePageLoader();
        }
    }

    async handleRegisterSubmit(form) {
        const formData = new FormData(form);

        this.showPageLoader();

        try {
            // Simular registro
            await this.simulateApiCall(2000);

            this.notifications.show(
                this.i18n.t('msg_register_success', 'Cuenta creada exitosamente'),
                'success'
            );

            this.navigateTo('profiles');

        } catch (error) {
            this.notifications.show(
                this.i18n.t('msg_register_error', 'Error al crear la cuenta'),
                'error'
            );
        } finally {
            this.hidePageLoader();
        }
    }

    async handleLogout() {
        this.isLoggedIn = false;
        this.state.user = null;
        this.selectedProfile = null;

        this.notifications.show(
            this.i18n.t('msg_logout_success', 'Sesión cerrada'),
            'info'
        );

        this.navigateTo('home');
    }

    // ==============================================
    // UTILIDADES Y FUNCIONES AUXILIARES  
    // ==============================================

    updateLoadingProgress(progress) {
        this.loadingProgress = progress;
        const progressBar = document.getElementById('loadingProgress');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
    }

    showPageLoader() {
        const loader = document.getElementById('pageLoader');
        if (loader) {
            loader.style.display = 'flex';
            loader.style.opacity = '1';
            loader.classList.remove('hidden');
        }
    }

    hidePageLoader() {
        const loader = document.getElementById('pageLoader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                loader.classList.add('hidden');
            }, 300);
        }
    }

    updateURL(route) {
        const newURL = route ? `#${route}` : '';
        if (window.location.hash !== newURL) {
            history.pushState({ view: route }, '', newURL);
        }
    }

    handlePopState() {
        const hash = window.location.hash.substring(1);
        const route = hash || 'home';
        this.navigateTo(route, false);
    }

    handleHashChange() {
        this.handlePopState();
    }

    updateActiveNavigation(route) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${route}`) {
                link.classList.add('active');
            }
        });
    }

    toggleMobileMenu() {
        this.mobileMenuOpen = !this.mobileMenuOpen;
        const mobileMenu = document.getElementById('mobileMenu');
        const toggle = document.getElementById('mobileMenuToggle');

        if (mobileMenu && toggle) {
            mobileMenu.classList.toggle('show', this.mobileMenuOpen);
            toggle.setAttribute('aria-expanded', this.mobileMenuOpen);
        }
    }

    closeMobileMenu() {
        this.mobileMenuOpen = false;
        const mobileMenu = document.getElementById('mobileMenu');
        const toggle = document.getElementById('mobileMenuToggle');

        if (mobileMenu && toggle) {
            mobileMenu.classList.remove('show');
            toggle.setAttribute('aria-expanded', 'false');
        }
    }

    changeLanguage(newLang) {
        this.i18n.setLanguage(newLang);
        const langCurrent = document.getElementById('langCurrent');
        if (langCurrent) {
            langCurrent.textContent = newLang.toUpperCase();
        }
    }

    async simulateApiCall(delay = 1000) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simular éxito en 90% de los casos
                if (Math.random() > 0.1) {
                    resolve();
                } else {
                    reject(new Error('Simulated API error'));
                }
            }, delay);
        });
    }

    // Hooks para extensibilidad
    async beforeViewChange(fromView, toView) {
        console.log(`🔄 Preparando cambio de ${fromView} a ${toView}`);
    }

    async afterViewChange(fromView, toView) {
        console.log(`✅ Cambio completado de ${fromView} a ${toView}`);

        // Analytics
        if (CONFIG.analytics.enabled) {
            this.trackPageView(toView);
        }
    }

    onThemeChange(newTheme) {
        console.log(`🎨 Tema cambiado a: ${newTheme}`);
    }

    onLanguageChange(newLanguage) {
        console.log(`🌍 Idioma cambiado a: ${newLanguage}`);
    }

    cleanupViewFeatures() {
        // Limpiar timers, listeners específicos de vista, etc.
        if (this.slideTimer) {
            clearInterval(this.slideTimer);
            this.slideTimer = null;
        }
    }

    // ==============================================
    // CARGA DE TEMPLATES (del sistema original)
    // ==============================================

    async loadViewTemplates() {
        // Aquí cargaríamos las vistas desde el archivo original
        // Por ahora usamos templates inline simples
        this.viewTemplates = {
            home: this.getHomeTemplate(),
            login: this.getLoginTemplate(),
            register: this.getRegisterTemplate(),
            'forgot-password': this.getForgotPasswordTemplate(),
            profiles: this.getProfilesTemplate(),
            dashboard: this.getDashboardTemplate(),
            faq: this.getFAQTemplate(),
            // ... más templates
        };
    }

    getViewTemplate(viewName) {
        return this.viewTemplates[viewName] || null;
    }

    // Templates básicos (se pueden expandir)
    getHomeTemplate() {
        return `
            <section class="hero">
                <div class="hero-content">
                    <h1 class="hero-title fade-in-up" data-i18n="hero_title">Descubre el entretenimiento</h1>
                    <h2 class="hero-highlight fade-in-up" data-i18n="hero_highlight">definitivo</h2>
                    <p class="hero-subtitle fade-in-up" data-i18n="hero_subtitle">Miles de películas, series exclusivas y contenido original en calidad 4K.</p>
                    <div class="hero-actions fade-in-up">
                        <a href="#register" class="btn btn-primary" data-i18n="hero_cta_register">Comenzar Prueba Gratuita</a>
                        <a href="#login" class="btn btn-secondary" data-i18n="hero_cta_login">Ya tengo cuenta</a>
                    </div>
                </div>
            </section>
        `;
    }

    getLoginTemplate() {
        return `
            <div class="login-container fade-in-scale">
                <div class="login-header">
                    <h1 class="login-title" data-i18n="login_title">¡Bienvenido de vuelta!</h1>
                    <p class="login-subtitle" data-i18n="login_subtitle">Inicia sesión y continúa disfrutando</p>
                </div>
                <form id="login-form" class="login-form">
                    <div class="form-group">
                        <label class="form-label" data-i18n="login_email">Correo Electrónico</label>
                        <input type="email" name="email" required class="form-input" data-i18n="login_email" placeholder="Correo Electrónico">
                    </div>
                    <div class="form-group">
                        <label class="form-label" data-i18n="login_password">Contraseña</label>
                        <input type="password" name="password" required class="form-input" data-i18n="login_password" placeholder="Contraseña">
                    </div>
                    <div class="form-group form-checkbox">
                        <input type="checkbox" name="remember" id="remember">
                        <label for="remember" data-i18n="login_remember">Recordarme</label>
                    </div>
                    <button type="submit" class="btn btn-primary btn-full" data-i18n="login_button">Iniciar Sesión</button>
                </form>
                <div class="login-footer">
                    <a href="#forgot-password" data-i18n="login_forgot">¿Olvidaste tu contraseña?</a>
                    <p><span data-i18n="login_no_account">¿No tienes cuenta?</span> <a href="#register" data-i18n="login_register_link">Regístrate aquí</a></p>
                </div>
            </div>
        `;
    }

    getRegisterTemplate() {
        return `
            <div class="register-container fade-in-scale">
                <div class="register-header">
                    <h1 class="register-title" data-i18n="register_title">¡Únete a COMPANY+!</h1>
                    <p class="register-subtitle" data-i18n="register_subtitle">Crea tu cuenta y accede a miles de horas</p>
                </div>
                <form id="register-form" class="register-form">
                    <div class="form-group">
                        <label class="form-label" data-i18n="register_name">Nombre Completo</label>
                        <input type="text" name="name" required class="form-input" data-i18n="register_name" placeholder="Nombre Completo">
                    </div>
                    <div class="form-group">
                        <label class="form-label" data-i18n="register_email">Correo Electrónico</label>
                        <input type="email" name="email" required class="form-input" data-i18n="register_email" placeholder="Correo Electrónico">
                    </div>
                    <div class="form-group">
                        <label class="form-label" data-i18n="register_password">Contraseña</label>
                        <input type="password" name="password" required minlength="8" class="form-input" data-i18n="register_password" placeholder="Contraseña">
                    </div>
                    <div class="form-group">
                        <label class="form-label" data-i18n="register_confirm_password">Confirmar Contraseña</label>
                        <input type="password" name="confirm_password" required data-confirm="password" class="form-input" data-i18n="register_confirm_password" placeholder="Confirmar Contraseña">
                    </div>
                    <div class="form-group form-checkbox">
                        <input type="checkbox" name="terms" id="terms" required>
                        <label for="terms" data-i18n="register_terms">Acepto los términos y condiciones</label>
                    </div>
                    <button type="submit" class="btn btn-primary btn-full" data-i18n="register_button">Crear Cuenta</button>
                </form>
                <div class="register-footer">
                    <p><span data-i18n="register_have_account">¿Ya tienes cuenta?</span> <a href="#login" data-i18n="register_login_link">Inicia sesión</a></p>
                </div>
            </div>
        `;
    }

    getForgotPasswordTemplate() {
        return `
            <div class="forgot-password-container fade-in-scale">
                <div class="forgot-password-header">
                    <h1 class="forgot-password-title">Recuperar Contraseña</h1>
                    <p class="forgot-password-subtitle">Te enviaremos un enlace para restablecer tu contraseña</p>
                </div>
                <form id="forgot-password-form" class="forgot-password-form">
                    <div class="form-group">
                        <label class="form-label">Correo Electrónico</label>
                        <input type="email" name="email" required class="form-input" placeholder="tu@email.com">
                    </div>
                    <button type="submit" class="btn btn-primary btn-full">Enviar Enlace</button>
                </form>
                <div class="forgot-password-footer">
                    <a href="#login">← Volver al inicio de sesión</a>
                </div>
            </div>
        `;
    }

    getProfilesTemplate() {
        return `
            <div class="profiles-container fade-in-up">
                <div class="profiles-header">
                    <h1 class="profiles-title" data-i18n="profiles_title">¿Quién está viendo?</h1>
                    <p class="profiles-subtitle" data-i18n="profiles_subtitle">Selecciona tu perfil para continuar</p>
                </div>
                <div class="profiles-grid" id="profilesGrid">
                    <!-- Los perfiles se cargan dinámicamente -->
                </div>
                <div class="profiles-footer">
                    <button class="profiles-manage" data-i18n="profiles_manage">Administrar Perfiles</button>
                </div>
            </div>
        `;
    }

    getDashboardTemplate() {
        return `
            <div class="dashboard fade-in-up">
                <div class="dashboard-header">
                    <h1 class="dashboard-welcome" data-i18n="dashboard_welcome">Bienvenido de vuelta</h1>
                    <div class="search-container">
                        <input type="text" class="search-input" data-i18n="dashboard_search_placeholder" placeholder="Buscar contenido...">
                        <i class="fas fa-search search-icon"></i>
                    </div>
                </div>

                <section class="content-section">
                    <h2 data-i18n="dashboard_continue_watching">Continuar Viendo</h2>
                    <div class="content-carousel">
                        <!-- Contenido dinámico -->
                    </div>
                </section>

                <section class="content-section">
                    <h2 data-i18n="dashboard_trending">Tendencias</h2>
                    <div class="content-carousel">
                        <!-- Contenido dinámico -->
                    </div>
                </section>
            </div>
        `;
    }

    getFAQTemplate() {
        return `
            <div class="faq-container fade-in-up">
                <div class="faq-header">
                    <h1 class="faq-title" data-i18n="faq_title">Preguntas Frecuentes</h1>
                </div>
                <div class="faq-list">
                    <div class="faq-item">
                        <button class="faq-question" data-action="toggle-faq">
                            <span data-i18n="faq_account_title">¿Cómo creo una cuenta?</span>
                            <i class="fas fa-chevron-down"></i>
                        </button>
                        <div class="faq-answer">
                            <p data-i18n="faq_account_answer">Hacer clic en "Registrarse", completar el formulario y verificar tu email.</p>
                        </div>
                    </div>
                    <!-- Más elementos FAQ -->
                </div>
            </div>
        `;
    }
}

// Inicializar la aplicación
window.spa = new CompanyPlusSPA();

// Funciones globales para compatibilidad
window.navigateTo = (route) => window.spa.navigateTo(route);
window.handleLogin = () => window.spa.handleLogin();
window.handleRegister = () => window.spa.handleRegister();
window.handleLogout = () => window.spa.handleLogout();

// Exportar para módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CompanyPlusSPA;
}