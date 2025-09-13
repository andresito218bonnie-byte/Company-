// COMPANY+ Premium SPA - Complete Application Logic (FINAL FIXED VERSION)
// Comprehensive Premium Features Implementation

class CompanyPlusPremiumSPA {
    constructor() {
        // Application state
        this.currentPage = 'home';
        this.currentTheme = 'auto';
        this.currentLanguage = 'es';
        this.isLoggedIn = false;
        this.selectedProfile = null;
        
        // System managers
        this.themeManager = null;
        this.i18nManager = null;
        this.notificationManager = null;
        this.particleManager = null;
        this.formManager = null;
        this.routerManager = null;
        
        // UI state
        this.isLoading = true;
        this.isMobileMenuOpen = false;
        this.isOffline = false;
        
        // Initialize application
        this.init();
    }

    async init() {
        console.log('🚀 Initializing COMPANY+ Premium SPA...');
        
        // Initialize managers in order
        this.initializeManagers();
        
        // Setup event listeners
        this.bindGlobalEvents();
        
        // Initialize UI components
        this.initializeComponents();
        
        // Show premium loader
        await this.showPremiumLoader();
        
        // Initialize routing
        this.routerManager.init();
        
        console.log('✅ COMPANY+ Premium SPA initialized successfully!');
    }

    initializeManagers() {
        // Theme Manager
        this.themeManager = new ThemeManager();
        
        // Internationalization Manager
        this.i18nManager = new I18nManager();
        
        // Notification Manager
        this.notificationManager = new NotificationManager();
        
        // Particle Manager
        this.particleManager = new ParticleManager();
        
        // Form Manager
        this.formManager = new FormManager(this.notificationManager);
        
        // Router Manager
        this.routerManager = new RouterManager(this);
    }

    bindGlobalEvents() {
        // Service Worker for offline support
        this.registerServiceWorker();
        
        // Online/Offline detection
        window.addEventListener('online', () => this.handleOnlineStatus(true));
        window.addEventListener('offline', () => this.handleOnlineStatus(false));
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
        
        // Visibility change for performance
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
        
        // Resize handler for responsive adjustments
        window.addEventListener('resize', debounce(() => this.handleResize(), 250));
        
        // Global modal close handler - FIXED
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
        
        // Global click handler for modal overlay - FIXED
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.closeAllModals();
            }
        });
    }

    initializeComponents() {
        // Theme toggle
        this.initThemeToggle();
        
        // Language selector
        this.initLanguageSelector();
        
        // Mobile menu
        this.initMobileMenu();
        
        // Navigation - FIXED
        this.initNavigation();
        
        // Forms
        this.initForms();
        
        // Search functionality
        this.initSearch();
        
        // FAQ accordion - FIXED
        this.initFAQ();
        
        // Settings page
        this.initSettings();
    }

    async showPremiumLoader() {
        const loader = document.getElementById('premium-loader');
        const progressFill = loader?.querySelector('.progress-fill');
        const percentageEl = loader?.querySelector('.loader-percentage');
        
        if (!loader) return;

        // Simulate loading steps
        const steps = [
            { progress: 20, text: 'Inicializando sistema...' },
            { progress: 40, text: 'Cargando contenido...' },
            { progress: 60, text: 'Configurando interfaz...' },
            { progress: 80, text: 'Aplicando tema...' },
            { progress: 100, text: '¡Listo!' }
        ];

        for (const step of steps) {
            await new Promise(resolve => setTimeout(resolve, 400));
            if (progressFill) progressFill.style.width = `${step.progress}%`;
            if (percentageEl) percentageEl.textContent = `${step.progress}%`;
            
            const textEl = loader.querySelector('.loader-text');
            if (textEl) textEl.textContent = step.text;
        }

        // Hide loader with fade out
        await new Promise(resolve => setTimeout(resolve, 500));
        loader.classList.add('hidden');
        
        // Remove from DOM after animation
        setTimeout(() => {
            if (loader.parentNode) {
                loader.parentNode.removeChild(loader);
            }
        }, 600);
    }

    initThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;

        themeToggle.addEventListener('click', (e) => {
            e.preventDefault();
            this.themeManager.toggleTheme();
            
            // Show notification
            const themes = { light: 'Claro', dark: 'Oscuro', auto: 'Automático' };
            const currentTheme = this.themeManager.currentTheme;
            this.notificationManager.show(`Tema cambiado a ${themes[currentTheme]}`, 'success');
        });

        // Update icon based on current theme
        this.themeManager.onThemeChange((theme) => {
            const icon = themeToggle.querySelector('.theme-icon');
            if (icon) {
                icon.className = theme === 'dark' ? 'fas fa-sun theme-icon' : 'fas fa-moon theme-icon';
            }
        });
    }

    initLanguageSelector() {
        const languageToggle = document.getElementById('language-toggle');
        const languageDropdown = document.getElementById('language-dropdown');
        
        if (!languageToggle || !languageDropdown) return;

        // Toggle dropdown - FIXED
        languageToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const selector = languageToggle.closest('.language-selector');
            const isOpen = selector.classList.contains('open');
            
            // Close all dropdowns first
            document.querySelectorAll('.language-selector').forEach(s => s.classList.remove('open'));
            
            // Toggle current dropdown
            if (!isOpen) {
                selector.classList.add('open');
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.language-selector')) {
                document.querySelectorAll('.language-selector').forEach(s => s.classList.remove('open'));
            }
        });

        // Language option selection - FIXED
        languageDropdown.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const option = e.target.closest('.lang-option');
            if (!option) return;

            const lang = option.dataset.lang;
            if (lang) {
                this.i18nManager.setLanguage(lang);
                
                // Update current language display
                const currentLang = languageToggle.querySelector('.current-lang');
                if (currentLang) {
                    const flagEmoji = option.textContent.split(' ')[0];
                    const langCode = lang.toUpperCase();
                    currentLang.textContent = `${flagEmoji} ${langCode}`;
                }

                // Update aria-selected
                languageDropdown.querySelectorAll('.lang-option').forEach(opt => {
                    opt.setAttribute('aria-selected', 'false');
                });
                option.setAttribute('aria-selected', 'true');

                // Close dropdown
                const selector = languageToggle.closest('.language-selector');
                selector.classList.remove('open');
                
                // Show success notification
                this.notificationManager.show(`Idioma cambiado a ${option.textContent}`, 'success');
            }
        });
    }

    initMobileMenu() {
        const mobileToggle = document.getElementById('mobile-menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (!mobileToggle || !mobileMenu) return;

        mobileToggle.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleMobileMenu();
        });

        // Close mobile menu when clicking on links
        mobileMenu.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="#"]')) {
                this.closeMobileMenu();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMobileMenuOpen) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        const mobileToggle = document.getElementById('mobile-menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        
        this.isMobileMenuOpen = !this.isMobileMenuOpen;
        
        if (this.isMobileMenuOpen) {
            mobileToggle.classList.add('active');
            mobileMenu.classList.add('open');
            mobileToggle.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        } else {
            this.closeMobileMenu();
        }
    }

    closeMobileMenu() {
        const mobileToggle = document.getElementById('mobile-menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        
        this.isMobileMenuOpen = false;
        if (mobileToggle) mobileToggle.classList.remove('active');
        if (mobileMenu) mobileMenu.classList.remove('open');
        if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    initNavigation() {
        // Handle all navigation clicks - COMPLETELY REWRITTEN AND FIXED
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (!link) return;

            e.preventDefault();
            e.stopPropagation();
            
            const href = link.getAttribute('href');
            if (!href || href === '#') return;
            
            const route = href.substring(1);
            console.log('Navigation click detected, route:', route);
            
            this.routerManager.navigate(route);
        });

        // Handle profile selection
        document.addEventListener('click', (e) => {
            const profileCard = e.target.closest('.profile-card[data-profile]');
            if (!profileCard) return;

            e.preventDefault();
            const profile = profileCard.dataset.profile;
            this.selectProfile(profile);
        });

        // Handle add profile
        document.addEventListener('click', (e) => {
            if (e.target.closest('.profile-card.add-profile')) {
                e.preventDefault();
                this.showAddProfileModal();
            }
        });
    }

    initForms() {
        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            this.formManager.initForm(loginForm, {
                onSubmit: (data) => this.handleLogin(data),
                validateRealTime: true
            });
        }

        // Register form
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            this.formManager.initForm(registerForm, {
                onSubmit: (data) => this.handleRegister(data),
                validateRealTime: true,
                passwordStrength: true
            });
        }

        // Forgot password form
        const forgotForm = document.getElementById('forgot-form');
        if (forgotForm) {
            this.formManager.initForm(forgotForm, {
                onSubmit: (data) => this.handleForgotPassword(data),
                validateRealTime: true
            });
        }
    }

    initSearch() {
        const searchInput = document.getElementById('dashboard-search');
        if (!searchInput) return;

        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.performSearch(e.target.value);
            }, 300);
        });

        // Clear search
        const clearBtn = searchInput.parentElement.querySelector('.search-clear');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                searchInput.value = '';
                this.performSearch('');
                searchInput.focus();
            });
        }
    }

    initFAQ() {
        // FAQ Accordion - COMPLETELY REWRITTEN AND FIXED
        document.addEventListener('click', (e) => {
            const faqQuestion = e.target.closest('.faq-question');
            if (!faqQuestion) return;

            e.preventDefault();
            e.stopPropagation();
            
            const faqItem = faqQuestion.closest('.faq-item');
            if (!faqItem) return;
            
            const isActive = faqItem.classList.contains('active');
            
            console.log('FAQ question clicked, currently active:', isActive);

            // Close all FAQ items first
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                const answer = item.querySelector('.faq-answer');
                if (answer) {
                    answer.style.maxHeight = '0';
                    answer.style.padding = '0 1.5rem';
                }
            });

            // Open current item if it wasn't active
            if (!isActive) {
                faqItem.classList.add('active');
                const answer = faqItem.querySelector('.faq-answer');
                if (answer) {
                    // Force reflow
                    answer.style.display = 'block';
                    const scrollHeight = answer.scrollHeight;
                    answer.style.maxHeight = scrollHeight + 'px';
                    answer.style.padding = '1.5rem';
                }
                console.log('FAQ item opened');
            } else {
                console.log('FAQ item closed');
            }
        });
    }

    initSettings() {
        // Theme select
        const themeSelect = document.getElementById('theme-select');
        if (themeSelect) {
            themeSelect.value = this.themeManager.currentTheme;
            themeSelect.addEventListener('change', (e) => {
                this.themeManager.setTheme(e.target.value);
            });
        }

        // Language select
        const languageSelect = document.getElementById('language-select');
        if (languageSelect) {
            languageSelect.value = this.i18nManager.currentLanguage;
            languageSelect.addEventListener('change', (e) => {
                this.i18nManager.setLanguage(e.target.value);
            });
        }
    }

    async handleLogin(data) {
        try {
            // Show loading state
            this.notificationManager.show('Iniciando sesión...', 'info');
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Success
            this.isLoggedIn = true;
            localStorage.setItem('company_plus_logged_in', 'true');
            
            this.notificationManager.show('¡Inicio de sesión exitoso!', 'success');
            
            // Navigate to profiles
            setTimeout(() => {
                this.routerManager.navigate('profiles');
            }, 1000);
            
        } catch (error) {
            this.notificationManager.show('Error al iniciar sesión', 'error');
        }
    }

    async handleRegister(data) {
        try {
            this.notificationManager.show('Creando cuenta...', 'info');
            
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            this.notificationManager.show('¡Cuenta creada exitosamente!', 'success');
            
            // Close any open modals first
            this.closeAllModals();
            
            setTimeout(() => {
                this.routerManager.navigate('login');
            }, 1000);
            
        } catch (error) {
            this.notificationManager.show('Error al crear la cuenta', 'error');
        }
    }

    async handleForgotPassword(data) {
        try {
            this.notificationManager.show('Enviando enlace...', 'info');
            
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            this.notificationManager.show('Enlace de recuperación enviado', 'success');
            
        } catch (error) {
            this.notificationManager.show('Error al enviar el enlace', 'error');
        }
    }

    selectProfile(profile) {
        this.selectedProfile = profile;
        
        // Animation for selection
        const profileCard = document.querySelector(`[data-profile="${profile}"]`);
        if (profileCard) {
            profileCard.style.transform = 'scale(1.2)';
            
            setTimeout(() => {
                profileCard.style.transform = 'scale(1.1)';
                this.notificationManager.show(`Perfil "${profile}" seleccionado`, 'success');
                
                setTimeout(() => {
                    this.routerManager.navigate('dashboard');
                }, 1000);
            }, 300);
        }
    }

    showAddProfileModal() {
        // Create modal HTML
        const modalHTML = `
            <div class="modal-overlay" role="dialog" aria-labelledby="modal-title" aria-modal="true">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 id="modal-title" data-i18n="modal_add_profile_title">Agregar Nuevo Perfil</h3>
                        <button class="modal-close-btn" aria-label="Cerrar modal">&times;</button>
                    </div>
                    <form class="add-profile-form">
                        <div class="form-group">
                            <label class="form-label" data-i18n="form_profile_name">Nombre del Perfil</label>
                            <input type="text" class="form-control" data-i18n-placeholder="form_profile_name_placeholder" placeholder="Nombre" required>
                        </div>
                        <div class="form-group">
                            <label class="checkbox-label">
                                <input type="checkbox">
                                <span class="checkmark"></span>
                                <span data-i18n="form_kids_profile">Perfil para niños</span>
                            </label>
                        </div>
                        <div class="modal-actions">
                            <button type="button" class="btn btn--secondary modal-cancel" data-i18n="button_cancel">Cancelar</button>
                            <button type="submit" class="btn btn--primary" data-i18n="button_create">Crear Perfil</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        // Add modal to DOM
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHTML;
        const modal = modalContainer.firstElementChild;
        document.body.appendChild(modal);

        // Apply translations
        this.i18nManager.translateElement(modal);

        // Bind events - COMPLETELY FIXED
        const closeBtn = modal.querySelector('.modal-close-btn');
        const cancelBtn = modal.querySelector('.modal-cancel');
        const form = modal.querySelector('.add-profile-form');

        // Close handlers - FIXED
        const closeModal = () => {
            console.log('Closing modal...');
            modal.classList.add('hiding');
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                    console.log('Modal removed from DOM');
                }
            }, 300);
        };

        // Multiple close methods - FIXED
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeModal();
        });

        cancelBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeModal();
        });

        // Click outside to close - FIXED
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                e.preventDefault();
                e.stopPropagation();
                closeModal();
            }
        });

        // Escape key to close - FIXED
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                closeModal();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);

        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = form.querySelector('input[type="text"]');
            const name = nameInput ? nameInput.value.trim() : '';
            
            if (name) {
                this.notificationManager.show(`Perfil "${name}" creado exitosamente`, 'success');
                closeModal();
            } else {
                this.notificationManager.show('Por favor ingresa un nombre válido', 'error');
            }
        });

        // Focus management
        setTimeout(() => {
            const firstInput = modal.querySelector('input[type="text"]');
            if (firstInput) firstInput.focus();
        }, 100);
    }

    // FIXED: Global method to close all modals
    closeAllModals() {
        const modals = document.querySelectorAll('.modal-overlay');
        modals.forEach(modal => {
            if (modal.parentNode) {
                modal.classList.add('hiding');
                setTimeout(() => {
                    if (modal.parentNode) {
                        modal.parentNode.removeChild(modal);
                    }
                }, 300);
            }
        });
    }

    performSearch(query) {
        const contentItems = document.querySelectorAll('.content-item');
        
        if (!query.trim()) {
            // Show all items
            contentItems.forEach(item => {
                item.style.display = 'block';
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
            });
            return;
        }

        // Filter items
        contentItems.forEach(item => {
            const title = item.querySelector('h4')?.textContent?.toLowerCase() || '';
            const matches = title.includes(query.toLowerCase());
            
            if (matches) {
                item.style.display = 'block';
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
            } else {
                item.style.opacity = '0.3';
                item.style.transform = 'scale(0.95)';
            }
        });
    }

    handleKeyboardShortcuts(e) {
        // Cmd/Ctrl + K for search
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.getElementById('dashboard-search');
            if (searchInput) searchInput.focus();
        }

        // Escape to close modals - FIXED
        if (e.key === 'Escape') {
            this.closeAllModals();
        }
    }

    handleOnlineStatus(isOnline) {
        this.isOffline = !isOnline;
        const indicator = document.getElementById('offline-indicator');
        
        if (indicator) {
            if (isOnline) {
                indicator.classList.add('hidden');
                this.notificationManager.show('Conexión restaurada', 'success');
            } else {
                indicator.classList.remove('hidden');
                this.notificationManager.show('Sin conexión a internet', 'warning');
            }
        }
    }

    handleVisibilityChange() {
        if (document.hidden) {
            // Page is hidden, pause animations
            this.particleManager.pause();
        } else {
            // Page is visible, resume animations
            this.particleManager.resume();
        }
    }

    handleResize() {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768 && this.isMobileMenuOpen) {
            this.closeMobileMenu();
        }

        // Resize particle canvas
        this.particleManager.resize();
    }

    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(() => {
                // Service worker registration failed, but app should still work
            });
        }
    }
}

// THEME MANAGER CLASS
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('company_plus_theme') || 'auto';
        this.callbacks = [];
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        
        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', () => {
            if (this.currentTheme === 'auto') {
                this.applyTheme('auto');
            }
        });
    }

    setTheme(theme) {
        this.currentTheme = theme;
        localStorage.setItem('company_plus_theme', theme);
        this.applyTheme(theme);
        this.notifyCallbacks(theme);
    }

    toggleTheme() {
        const themes = ['light', 'dark', 'auto'];
        const currentIndex = themes.indexOf(this.currentTheme);
        const nextTheme = themes[(currentIndex + 1) % themes.length];
        this.setTheme(nextTheme);
    }

    applyTheme(theme) {
        const html = document.documentElement;
        
        if (theme === 'auto') {
            html.removeAttribute('data-color-scheme');
        } else {
            html.setAttribute('data-color-scheme', theme);
        }

        // Smooth transition
        html.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            html.style.transition = '';
        }, 300);
    }

    onThemeChange(callback) {
        this.callbacks.push(callback);
    }

    notifyCallbacks(theme) {
        this.callbacks.forEach(callback => callback(theme));
    }
}

// INTERNATIONALIZATION MANAGER CLASS
class I18nManager {
    constructor() {
        this.currentLanguage = localStorage.getItem('company_plus_language') || 'es';
        this.translations = {};
        this.loadTranslations();
    }

    loadTranslations() {
        this.translations = {
            es: {
                // Navigation
                nav_home: 'Inicio',
                nav_support: 'Soporte',
                nav_faq: 'FAQ',
                nav_movies: 'Películas',
                nav_series: 'Series',
                nav_kids: 'Niños',
                
                // Buttons
                login_button: 'Iniciar Sesión',
                register_button: 'Registrarse',
                button_play: 'Reproducir',
                button_add_list: 'Mi Lista',
                button_more_info: 'Más Info',
                button_learn_more: 'Saber Más',
                button_view_faq: 'Ver FAQ',
                button_security_tips: 'Consejos de Seguridad',
                button_manage_billing: 'Gestionar Facturación',
                button_change: 'Cambiar',
                button_cancel: 'Cancelar',
                button_create: 'Crear Perfil',
                
                // Hero Section
                hero_title_1: 'Descubre el entretenimiento',
                hero_title_2: 'definitivo',
                hero_description: 'Miles de películas, series y documentales. Todo el contenido premium que amas en una sola plataforma de streaming de última generación.',
                hero_cta_primary: 'Comenzar Ahora',
                hero_cta_secondary: 'Ver Demo',
                
                // Features
                features_title: '¿Por qué elegir COMPANY+?',
                feature_1_title: 'Contenido Ilimitado',
                feature_1_desc: 'Accede a miles de películas y series de los mejores estudios del mundo en calidad 4K.',
                feature_2_title: 'Perfiles Familiares',
                feature_2_desc: 'Crea hasta 6 perfiles diferentes con control parental y recomendaciones personalizadas.',
                feature_3_title: 'Multiplataforma',
                feature_3_desc: 'Disfruta en cualquier dispositivo con sincronización perfecta y descarga offline.',
                feature_4_title: 'Ultra Seguro',
                feature_4_desc: 'Protección avanzada de datos y control parental con tecnología de última generación.',
                
                // Auth
                login_title: '¡Bienvenido de vuelta!',
                login_subtitle: 'Accede a tu cuenta COMPANY+ Premium',
                register_title: '¡Únete a COMPANY+!',
                register_subtitle: 'Crea tu cuenta premium y comienza a disfrutar',
                forgot_title: 'Recuperar Contraseña',
                forgot_subtitle: 'Te enviaremos un enlace seguro para restablecer tu contraseña',
                
                // Forms
                form_email: 'Email',
                form_password: 'Contraseña',
                form_name: 'Nombre Completo',
                form_confirm_password: 'Confirmar Contraseña',
                form_email_placeholder: 'tu@email.com',
                form_password_placeholder: '••••••••',
                form_name_placeholder: 'Tu nombre completo',
                form_confirm_password_placeholder: '••••••••',
                form_profile_name: 'Nombre del Perfil',
                form_profile_name_placeholder: 'Nombre',
                form_kids_profile: 'Perfil para niños',
                form_remember: 'Recordarme',
                form_forgot: '¿Olvidaste tu contraseña?',
                form_accept_terms_1: 'Acepto los',
                form_accept_terms_2: 'Términos y Condiciones',
                form_accept_terms_3: 'y la',
                form_accept_terms_4: 'Política de Privacidad',
                
                // Profiles
                profiles_title: '¿Quién está viendo?',
                profiles_subtitle: 'Selecciona tu perfil para continuar',
                profile_adult: 'Adulto',
                profile_adult_desc: 'Todo el contenido disponible',
                profile_kids: 'Niños',
                profile_kids_desc: 'Contenido familiar seguro',
                profile_teen: 'Adolescente',
                profile_teen_desc: 'Para usuarios de 13-17 años',
                profile_add: 'Agregar Perfil',
                profile_add_desc: 'Hasta 6 perfiles',
                
                // Dashboard
                search_placeholder: 'Buscar contenido...',
                badge_featured: 'Destacado',
                hero_banner_title: 'La Serie del Momento',
                hero_banner_desc: 'Una historia épica que cautivará tus sentidos con efectos visuales revolucionarios y una narrativa sin precedentes.',
                genre_drama: 'Drama',
                section_trending: 'En Tendencia',
                section_recommended: 'Recomendado para Ti',
                section_new_releases: 'Nuevos Lanzamientos',
                
                // Menu
                menu_change_profile: 'Cambiar Perfil',
                menu_settings: 'Configuración',
                menu_help: 'Ayuda',
                menu_logout: 'Cerrar Sesión',
                
                // Support
                support_title: 'Centro de Soporte',
                support_subtitle: 'Estamos aquí para ayudarte. Encuentra la asistencia que necesitas.',
                support_tech_title: 'Soporte Técnico',
                support_tech_desc: 'Obtén ayuda con problemas técnicos y de conectividad',
                support_faq_title: 'Preguntas Frecuentes',
                support_faq_desc: 'Encuentra respuestas rápidas a las dudas más comunes',
                support_security_title: 'Seguridad',
                support_security_desc: 'Consejos para mantener tu cuenta segura',
                support_billing_title: 'Facturación',
                support_billing_desc: 'Gestiona tu suscripción y métodos de pago',
                
                // Settings
                settings_title: 'Configuración',
                settings_account: 'Cuenta',
                settings_preferences: 'Preferencias',
                settings_email: 'Email',
                settings_password: 'Contraseña',
                settings_password_desc: 'Última actualización: hace 3 meses',
                settings_theme: 'Tema',
                settings_theme_desc: 'Apariencia de la aplicación',
                settings_language: 'Idioma',
                settings_language_desc: 'Idioma de la interfaz',
                theme_auto: 'Automático',
                theme_light: 'Claro',
                theme_dark: 'Oscuro',
                
                // FAQ
                faq_title: 'Preguntas Frecuentes',
                faq_subtitle: 'Encuentra respuestas a las preguntas más comunes sobre COMPANY+',
                
                // Password Strength
                password_weak: 'Débil',
                password_medium: 'Medio',
                password_strong: 'Fuerte',
                password_very_strong: 'Muy Fuerte',
                
                // Offline
                offline_message: 'Sin conexión a internet',
                
                // CTA
                cta_title: '¿Listo para comenzar?',
                cta_description: 'Únete a millones de usuarios que ya disfrutan de COMPANY+ Premium',
                cta_button: 'Prueba Gratuita de 30 Días',
                
                // Terms
                terms_title: 'Términos y Condiciones',
                terms_acceptance: '1. Aceptación de Términos',
                terms_acceptance_text: 'Al usar COMPANY+, aceptas estos términos y condiciones en su totalidad.',
                terms_service: '2. Uso del Servicio',
                terms_service_text: 'El servicio está destinado para uso personal y no comercial.',
                terms_subscription: '3. Suscripción y Pagos',
                terms_subscription_text: 'Las suscripciones se renuevan automáticamente hasta que sean canceladas.',
                
                // Modal
                modal_add_profile_title: 'Agregar Nuevo Perfil',
                
                // Auth Links
                login_no_account: '¿No tienes cuenta?',
                login_register_link: 'Regístrate gratis',
                register_have_account: '¿Ya tienes cuenta?',
                register_login_link: 'Inicia sesión',
                forgot_back_login: '← Volver al inicio de sesión',
                forgot_button: 'Enviar Enlace'
            },
            en: {
                // Navigation
                nav_home: 'Home',
                nav_support: 'Support',
                nav_faq: 'FAQ',
                nav_movies: 'Movies',
                nav_series: 'Series',
                nav_kids: 'Kids',
                
                // Buttons
                login_button: 'Sign In',
                register_button: 'Sign Up',
                button_play: 'Play',
                button_add_list: 'My List',
                button_more_info: 'More Info',
                button_learn_more: 'Learn More',
                button_view_faq: 'View FAQ',
                button_security_tips: 'Security Tips',
                button_manage_billing: 'Manage Billing',
                button_change: 'Change',
                button_cancel: 'Cancel',
                button_create: 'Create Profile',
                
                // Hero Section
                hero_title_1: 'Discover the ultimate',
                hero_title_2: 'entertainment',
                hero_description: 'Thousands of movies, series and documentaries. All the premium content you love on a single next-generation streaming platform.',
                hero_cta_primary: 'Get Started',
                hero_cta_secondary: 'Watch Demo',
                
                // Features
                features_title: 'Why choose COMPANY+?',
                feature_1_title: 'Unlimited Content',
                feature_1_desc: 'Access thousands of movies and series from the world\'s best studios in 4K quality.',
                feature_2_title: 'Family Profiles',
                feature_2_desc: 'Create up to 6 different profiles with parental controls and personalized recommendations.',
                feature_3_title: 'Multi-platform',
                feature_3_desc: 'Enjoy on any device with perfect sync and offline download.',
                feature_4_title: 'Ultra Secure',
                feature_4_desc: 'Advanced data protection and parental control with cutting-edge technology.',
                
                // Auth
                login_title: 'Welcome back!',
                login_subtitle: 'Access your COMPANY+ Premium account',
                register_title: 'Join COMPANY+!',
                register_subtitle: 'Create your premium account and start enjoying',
                forgot_title: 'Reset Password',
                forgot_subtitle: 'We\'ll send you a secure link to reset your password',
                
                // Forms
                form_email: 'Email',
                form_password: 'Password',
                form_name: 'Full Name',
                form_confirm_password: 'Confirm Password',
                form_email_placeholder: 'your@email.com',
                form_password_placeholder: '••••••••',
                form_name_placeholder: 'Your full name',
                form_confirm_password_placeholder: '••••••••',
                form_profile_name: 'Profile Name',
                form_profile_name_placeholder: 'Name',
                form_kids_profile: 'Kids profile',
                form_remember: 'Remember me',
                form_forgot: 'Forgot your password?',
                form_accept_terms_1: 'I accept the',
                form_accept_terms_2: 'Terms and Conditions',
                form_accept_terms_3: 'and the',
                form_accept_terms_4: 'Privacy Policy',
                
                // Profiles
                profiles_title: 'Who\'s watching?',
                profiles_subtitle: 'Select your profile to continue',
                profile_adult: 'Adult',
                profile_adult_desc: 'All content available',
                profile_kids: 'Kids',
                profile_kids_desc: 'Safe family content',
                profile_teen: 'Teen',
                profile_teen_desc: 'For users 13-17 years old',
                profile_add: 'Add Profile',
                profile_add_desc: 'Up to 6 profiles',
                
                // Dashboard
                search_placeholder: 'Search content...',
                badge_featured: 'Featured',
                hero_banner_title: 'The Series of the Moment',
                hero_banner_desc: 'An epic story that will captivate your senses with revolutionary visual effects and unprecedented narrative.',
                genre_drama: 'Drama',
                section_trending: 'Trending',
                section_recommended: 'Recommended for You',
                section_new_releases: 'New Releases',
                
                // Menu
                menu_change_profile: 'Change Profile',
                menu_settings: 'Settings',
                menu_help: 'Help',
                menu_logout: 'Sign Out',
                
                // Support
                support_title: 'Support Center',
                support_subtitle: 'We\'re here to help you. Find the assistance you need.',
                support_tech_title: 'Technical Support',
                support_tech_desc: 'Get help with technical and connectivity issues',
                support_faq_title: 'Frequently Asked Questions',
                support_faq_desc: 'Find quick answers to common questions',
                support_security_title: 'Security',
                support_security_desc: 'Tips to keep your account secure',
                support_billing_title: 'Billing',
                support_billing_desc: 'Manage your subscription and payment methods',
                
                // Settings
                settings_title: 'Settings',
                settings_account: 'Account',
                settings_preferences: 'Preferences',
                settings_email: 'Email',
                settings_password: 'Password',
                settings_password_desc: 'Last updated: 3 months ago',
                settings_theme: 'Theme',
                settings_theme_desc: 'Application appearance',
                settings_language: 'Language',
                settings_language_desc: 'Interface language',
                theme_auto: 'Auto',
                theme_light: 'Light',
                theme_dark: 'Dark',
                
                // FAQ
                faq_title: 'Frequently Asked Questions',
                faq_subtitle: 'Find answers to the most common questions about COMPANY+',
                
                // Password Strength
                password_weak: 'Weak',
                password_medium: 'Medium',
                password_strong: 'Strong',
                password_very_strong: 'Very Strong',
                
                // Offline
                offline_message: 'No internet connection',
                
                // CTA
                cta_title: 'Ready to get started?',
                cta_description: 'Join millions of users already enjoying COMPANY+ Premium',
                cta_button: '30-Day Free Trial',
                
                // Terms
                terms_title: 'Terms and Conditions',
                terms_acceptance: '1. Acceptance of Terms',
                terms_acceptance_text: 'By using COMPANY+, you accept these terms and conditions in their entirety.',
                terms_service: '2. Use of Service',
                terms_service_text: 'The service is intended for personal and non-commercial use.',
                terms_subscription: '3. Subscription and Payments',
                terms_subscription_text: 'Subscriptions renew automatically until cancelled.',
                
                // Modal
                modal_add_profile_title: 'Add New Profile',
                
                // Auth Links
                login_no_account: 'Don\'t have an account?',
                login_register_link: 'Sign up for free',
                register_have_account: 'Already have an account?',
                register_login_link: 'Sign in',
                forgot_back_login: '← Back to sign in',
                forgot_button: 'Send Link'
            },
            pt: {
                // Navigation
                nav_home: 'Início',
                nav_support: 'Suporte',
                nav_faq: 'FAQ',
                nav_movies: 'Filmes',
                nav_series: 'Séries',
                nav_kids: 'Crianças',
                
                // Buttons
                login_button: 'Entrar',
                register_button: 'Cadastrar',
                button_play: 'Reproduzir',
                button_add_list: 'Minha Lista',
                button_more_info: 'Mais Info',
                button_learn_more: 'Saiba Mais',
                button_view_faq: 'Ver FAQ',
                button_security_tips: 'Dicas de Segurança',
                button_manage_billing: 'Gerenciar Cobrança',
                button_change: 'Alterar',
                button_cancel: 'Cancelar',
                button_create: 'Criar Perfil',
                
                // Hero Section
                hero_title_1: 'Descubra o entretenimento',
                hero_title_2: 'definitivo',
                hero_description: 'Milhares de filmes, séries e documentários. Todo o conteúdo premium que você ama em uma única plataforma de streaming de última geração.',
                hero_cta_primary: 'Começar Agora',
                hero_cta_secondary: 'Ver Demo',
                
                // Features
                features_title: 'Por que escolher COMPANY+?',
                feature_1_title: 'Conteúdo Ilimitado',
                feature_1_desc: 'Acesse milhares de filmes e séries dos melhores estúdios do mundo em qualidade 4K.',
                feature_2_title: 'Perfis Familiares',
                feature_2_desc: 'Crie até 6 perfis diferentes com controle parental e recomendações personalizadas.',
                feature_3_title: 'Multiplataforma',
                feature_3_desc: 'Aproveite em qualquer dispositivo com sincronização perfeita e download offline.',
                feature_4_title: 'Ultra Seguro',
                feature_4_desc: 'Proteção avançada de dados e controle parental com tecnologia de ponta.',
                
                // Auth
                login_title: 'Bem-vindo de volta!',
                login_subtitle: 'Acesse sua conta COMPANY+ Premium',
                register_title: 'Junte-se ao COMPANY+!',
                register_subtitle: 'Crie sua conta premium e comece a aproveitar',
                forgot_title: 'Recuperar Senha',
                forgot_subtitle: 'Enviaremos um link seguro para redefinir sua senha',
                
                // Forms
                form_email: 'Email',
                form_password: 'Senha',
                form_name: 'Nome Completo',
                form_confirm_password: 'Confirmar Senha',
                form_email_placeholder: 'seu@email.com',
                form_password_placeholder: '••••••••',
                form_name_placeholder: 'Seu nome completo',
                form_confirm_password_placeholder: '••••••••',
                form_profile_name: 'Nome do Perfil',
                form_profile_name_placeholder: 'Nome',
                form_kids_profile: 'Perfil infantil',
                form_remember: 'Lembrar de mim',
                form_forgot: 'Esqueceu sua senha?',
                form_accept_terms_1: 'Aceito os',
                form_accept_terms_2: 'Termos e Condições',
                form_accept_terms_3: 'e a',
                form_accept_terms_4: 'Política de Privacidade',
                
                // Profiles
                profiles_title: 'Quem está assistindo?',
                profiles_subtitle: 'Selecione seu perfil para continuar',
                profile_adult: 'Adulto',
                profile_adult_desc: 'Todo conteúdo disponível',
                profile_kids: 'Crianças',
                profile_kids_desc: 'Conteúdo familiar seguro',
                profile_teen: 'Adolescente',
                profile_teen_desc: 'Para usuários de 13-17 anos',
                profile_add: 'Adicionar Perfil',
                profile_add_desc: 'Até 6 perfis',
                
                // Settings
                settings_title: 'Configurações',
                theme_auto: 'Automático',
                theme_light: 'Claro',
                theme_dark: 'Escuro',
                
                // Password Strength
                password_weak: 'Fraca',
                password_medium: 'Média',
                password_strong: 'Forte',
                password_very_strong: 'Muito Forte',
                
                // Offline
                offline_message: 'Sem conexão com a internet'
            },
            fr: {
                // Navigation
                nav_home: 'Accueil',
                nav_support: 'Support',
                nav_faq: 'FAQ',
                nav_movies: 'Films',
                nav_series: 'Séries',
                nav_kids: 'Enfants',
                
                // Buttons
                login_button: 'Se connecter',
                register_button: 'S\'inscrire',
                button_play: 'Lire',
                button_add_list: 'Ma Liste',
                button_more_info: 'Plus d\'Info',
                button_learn_more: 'En savoir plus',
                button_view_faq: 'Voir FAQ',
                button_security_tips: 'Conseils de Sécurité',
                button_manage_billing: 'Gérer la Facturation',
                button_change: 'Changer',
                button_cancel: 'Annuler',
                button_create: 'Créer un Profil',
                
                // Hero Section
                hero_title_1: 'Découvrez le divertissement',
                hero_title_2: 'ultime',
                hero_description: 'Des milliers de films, séries et documentaires. Tout le contenu premium que vous aimez sur une seule plateforme de streaming de nouvelle génération.',
                hero_cta_primary: 'Commencer',
                hero_cta_secondary: 'Voir la Démo',
                
                // Features
                features_title: 'Pourquoi choisir COMPANY+ ?',
                feature_1_title: 'Contenu Illimité',
                feature_1_desc: 'Accédez à des milliers de films et séries des meilleurs studios du monde en qualité 4K.',
                feature_2_title: 'Profils Familiaux',
                feature_2_desc: 'Créez jusqu\'à 6 profils différents avec contrôle parental et recommandations personnalisées.',
                feature_3_title: 'Multi-plateforme',
                feature_3_desc: 'Profitez sur n\'importe quel appareil avec une synchronisation parfaite et un téléchargement hors ligne.',
                feature_4_title: 'Ultra Sécurisé',
                feature_4_desc: 'Protection avancée des données et contrôle parental avec une technologie de pointe.',
                
                // Auth
                login_title: 'Content de vous revoir !',
                login_subtitle: 'Accédez à votre compte COMPANY+ Premium',
                register_title: 'Rejoignez COMPANY+ !',
                register_subtitle: 'Créez votre compte premium et commencez à profiter',
                forgot_title: 'Réinitialiser le Mot de Passe',
                forgot_subtitle: 'Nous vous enverrons un lien sécurisé pour réinitialiser votre mot de passe',
                
                // Forms
                form_email: 'Email',
                form_password: 'Mot de passe',
                form_name: 'Nom Complet',
                form_confirm_password: 'Confirmer le Mot de Passe',
                form_email_placeholder: 'votre@email.com',
                form_password_placeholder: '••••••••',
                form_name_placeholder: 'Votre nom complet',
                form_confirm_password_placeholder: '••••••••',
                form_profile_name: 'Nom du Profil',
                form_profile_name_placeholder: 'Nom',
                form_kids_profile: 'Profil enfant',
                form_remember: 'Se souvenir de moi',
                form_forgot: 'Mot de passe oublié ?',
                form_accept_terms_1: 'J\'accepte les',
                form_accept_terms_2: 'Conditions d\'Utilisation',
                form_accept_terms_3: 'et la',
                form_accept_terms_4: 'Politique de Confidentialité',
                
                // Profiles
                profiles_title: 'Qui regarde ?',
                profiles_subtitle: 'Sélectionnez votre profil pour continuer',
                profile_adult: 'Adulte',
                profile_adult_desc: 'Tout le contenu disponible',
                profile_kids: 'Enfants',
                profile_kids_desc: 'Contenu familial sécurisé',
                profile_teen: 'Adolescent',
                profile_teen_desc: 'Pour les utilisateurs de 13-17 ans',
                profile_add: 'Ajouter un Profil',
                profile_add_desc: 'Jusqu\'à 6 profils',
                
                // Settings
                settings_title: 'Paramètres',
                theme_auto: 'Automatique',
                theme_light: 'Clair',
                theme_dark: 'Sombre',
                
                // Password Strength
                password_weak: 'Faible',
                password_medium: 'Moyen',
                password_strong: 'Fort',
                password_very_strong: 'Très Fort',
                
                // Offline
                offline_message: 'Pas de connexion internet'
            }
        };
    }

    setLanguage(lang) {
        if (!this.translations[lang]) return;
        
        this.currentLanguage = lang;
        localStorage.setItem('company_plus_language', lang);
        
        // Update HTML lang attribute
        document.documentElement.lang = lang;
        
        // Translate all elements
        this.translatePage();
        
        // Update FAQ content
        this.updateFAQContent();
        
        // Generate dashboard content
        this.generateDashboardContent();
    }

    translatePage() {
        this.translateElement(document.body);
    }

    translateElement(element) {
        const elementsToTranslate = element.querySelectorAll('[data-i18n]');
        
        elementsToTranslate.forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = this.translations[this.currentLanguage][key];
            
            if (translation) {
                el.textContent = translation;
            }
        });

        // Handle placeholders
        const placeholderElements = element.querySelectorAll('[data-i18n-placeholder]');
        placeholderElements.forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const translation = this.translations[this.currentLanguage][key];
            
            if (translation) {
                el.placeholder = translation;
            }
        });
    }

    updateFAQContent() {
        const faqList = document.getElementById('faq-list');
        if (!faqList) return;

        const faqData = {
            es: [
                {
                    question: '¿Cómo puedo cancelar mi suscripción?',
                    answer: 'Puedes cancelar tu suscripción en cualquier momento desde la configuración de tu cuenta. No se aplicarán cargos adicionales.'
                },
                {
                    question: '¿En cuántos dispositivos puedo ver contenido?',
                    answer: 'Puedes ver contenido en hasta 4 dispositivos simultáneamente con tu suscripción premium.'
                },
                {
                    question: '¿Hay contenido offline disponible?',
                    answer: 'Sí, puedes descargar contenido seleccionado para verlo sin conexión a internet en dispositivos móviles.'
                },
                {
                    question: '¿Qué calidad de video está disponible?',
                    answer: 'Ofrecemos contenido en HD, Full HD y 4K Ultra HD dependiendo de tu plan y dispositivo.'
                },
                {
                    question: '¿Cómo funciona el control parental?',
                    answer: 'Puedes crear perfiles específicos para niños con contenido filtrado automáticamente por edad.'
                }
            ],
            en: [
                {
                    question: 'How can I cancel my subscription?',
                    answer: 'You can cancel your subscription at any time from your account settings. No additional charges will apply.'
                },
                {
                    question: 'On how many devices can I watch content?',
                    answer: 'You can watch content on up to 4 devices simultaneously with your premium subscription.'
                },
                {
                    question: 'Is offline content available?',
                    answer: 'Yes, you can download selected content to watch without an internet connection on mobile devices.'
                },
                {
                    question: 'What video quality is available?',
                    answer: 'We offer content in HD, Full HD, and 4K Ultra HD depending on your plan and device.'
                },
                {
                    question: 'How does parental control work?',
                    answer: 'You can create specific profiles for children with content automatically filtered by age.'
                }
            ],
            pt: [
                {
                    question: 'Como posso cancelar minha assinatura?',
                    answer: 'Você pode cancelar sua assinatura a qualquer momento nas configurações da sua conta. Não serão aplicadas taxas adicionais.'
                },
                {
                    question: 'Em quantos dispositivos posso assistir conteúdo?',
                    answer: 'Você pode assistir conteúdo em até 4 dispositivos simultaneamente com sua assinatura premium.'
                },
                {
                    question: 'Há conteúdo offline disponível?',
                    answer: 'Sim, você pode baixar conteúdo selecionado para assistir sem conexão com a internet em dispositivos móveis.'
                },
                {
                    question: 'Qual qualidade de vídeo está disponível?',
                    answer: 'Oferecemos conteúdo em HD, Full HD e 4K Ultra HD dependendo do seu plano e dispositivo.'
                },
                {
                    question: 'Como funciona o controle parental?',
                    answer: 'Você pode criar perfis específicos para crianças com conteúdo filtrado automaticamente por idade.'
                }
            ],
            fr: [
                {
                    question: 'Comment puis-je annuler mon abonnement ?',
                    answer: 'Vous pouvez annuler votre abonnement à tout moment depuis les paramètres de votre compte. Aucun frais supplémentaire ne sera appliqué.'
                },
                {
                    question: 'Sur combien d\'appareils puis-je regarder du contenu ?',
                    answer: 'Vous pouvez regarder du contenu sur jusqu\'à 4 appareils simultanément avec votre abonnement premium.'
                },
                {
                    question: 'Du contenu hors ligne est-il disponible ?',
                    answer: 'Oui, vous pouvez télécharger du contenu sélectionné pour le regarder sans connexion internet sur les appareils mobiles.'
                },
                {
                    question: 'Quelle qualité vidéo est disponible ?',
                    answer: 'Nous proposons du contenu en HD, Full HD et 4K Ultra HD selon votre plan et votre appareil.'
                },
                {
                    question: 'Comment fonctionne le contrôle parental ?',
                    answer: 'Vous pouvez créer des profils spécifiques pour les enfants avec du contenu filtré automatiquement par âge.'
                }
            ]
        };

        const currentFAQ = faqData[this.currentLanguage] || faqData.es;
        
        faqList.innerHTML = currentFAQ.map(item => `
            <div class="faq-item">
                <div class="faq-question">
                    <h3>${item.question}</h3>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div class="faq-answer">
                    <p>${item.answer}</p>
                </div>
            </div>
        `).join('');
    }

    generateDashboardContent() {
        // Generate trending content
        this.generateContentCarousel('trending-carousel');
        this.generateContentCarousel('recommended-carousel');
        this.generateContentCarousel('new-carousel');
    }

    generateContentCarousel(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const contentTitles = {
            es: [
                'Serie Épica', 'Drama Moderno', 'Comedia Familiar', 'Thriller Psicológico',
                'Documental Naturaleza', 'Sci-Fi Futurista', 'Romance Clásico', 'Acción Explosiva'
            ],
            en: [
                'Epic Series', 'Modern Drama', 'Family Comedy', 'Psychological Thriller',
                'Nature Documentary', 'Futuristic Sci-Fi', 'Classic Romance', 'Explosive Action'
            ],
            pt: [
                'Série Épica', 'Drama Moderno', 'Comédia Familiar', 'Thriller Psicológico',
                'Documentário Natureza', 'Ficção Futurista', 'Romance Clássico', 'Ação Explosiva'
            ],
            fr: [
                'Série Épique', 'Drame Moderne', 'Comédie Familiale', 'Thriller Psychologique',
                'Documentaire Nature', 'Science-Fiction', 'Romance Classique', 'Action Explosive'
            ]
        };

        const titles = contentTitles[this.currentLanguage] || contentTitles.es;
        
        container.innerHTML = titles.map(title => `
            <div class="content-item">
                <div class="content-item__image">
                    <i class="fas fa-play"></i>
                </div>
                <h4>${title}</h4>
            </div>
        `).join('');
    }

    t(key) {
        return this.translations[this.currentLanguage][key] || key;
    }
}

// Continue with the same NotificationManager, ParticleManager, FormManager, and RouterManager classes as before...
// (The rest of the classes remain unchanged from the previous version)

// NOTIFICATION MANAGER CLASS
class NotificationManager {
    constructor() {
        this.container = document.getElementById('notification-container');
        this.notifications = [];
    }

    show(message, type = 'info', duration = 4000) {
        if (!this.container) return;

        const notification = this.createNotification(message, type);
        this.container.appendChild(notification);
        this.notifications.push(notification);

        // Auto-hide
        setTimeout(() => {
            this.hide(notification);
        }, duration);

        return notification;
    }

    createNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        notification.innerHTML = `
            <div class="notification__content">
                <div class="notification__icon">
                    <i class="${icons[type] || icons.info}"></i>
                </div>
                <div class="notification__body">
                    <div class="notification__message">${message}</div>
                </div>
                <button class="notification__close" aria-label="Close notification">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="notification__progress"></div>
        `;

        // Close button functionality
        const closeBtn = notification.querySelector('.notification__close');
        closeBtn.addEventListener('click', () => {
            this.hide(notification);
        });

        return notification;
    }

    hide(notification) {
        if (!notification.parentNode) return;

        notification.classList.add('hiding');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            this.notifications = this.notifications.filter(n => n !== notification);
        }, 300);
    }

    clear() {
        this.notifications.forEach(notification => {
            this.hide(notification);
        });
    }
}

// PARTICLE MANAGER CLASS
class ParticleManager {
    constructor() {
        this.canvas = document.getElementById('particles-canvas');
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.particles = [];
        this.isActive = false;
        this.isPaused = false;
        this.animationId = null;
        
        if (this.canvas && this.ctx) {
            this.setupCanvas();
        }
    }

    setupCanvas() {
        this.resize();
        this.initParticles();
    }

    resize() {
        if (!this.canvas) return;
        
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    initParticles() {
        this.particles = [];
        const particleCount = Math.min(50, Math.floor(window.innerWidth / 20));
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 3 + 1,
                opacity: Math.random() * 0.5 + 0.2,
                color: `hsl(${Math.random() * 60 + 200}, 70%, 60%)`
            });
        }
    }

    start() {
        if (!this.canvas || this.isActive) return;
        
        this.isActive = true;
        this.canvas.classList.remove('hidden');
        this.animate();
    }

    stop() {
        this.isActive = false;
        this.canvas?.classList.add('hidden');
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    pause() {
        this.isPaused = true;
    }

    resume() {
        this.isPaused = false;
    }

    animate() {
        if (!this.isActive || !this.ctx) return;

        if (!this.isPaused) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.particles.forEach(particle => {
                // Update position
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // Wrap around edges
                if (particle.x < 0) particle.x = this.canvas.width;
                if (particle.x > this.canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = this.canvas.height;
                if (particle.y > this.canvas.height) particle.y = 0;
                
                // Draw particle
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                this.ctx.fillStyle = particle.color.replace('60%)', `${particle.opacity})`);
                this.ctx.fill();
            });
        }

        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

// FORM MANAGER CLASS
class FormManager {
    constructor(notificationManager) {
        this.notificationManager = notificationManager;
        this.forms = new Map();
    }

    initForm(form, options = {}) {
        const formId = form.id || `form_${Date.now()}`;
        
        this.forms.set(formId, {
            element: form,
            options,
            validators: this.createValidators(form)
        });

        this.bindFormEvents(form, options);
    }

    createValidators(form) {
        const validators = {};
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            validators[input.name || input.id] = this.getValidatorForInput(input);
        });

        return validators;
    }

    getValidatorForInput(input) {
        const validators = [];
        
        if (input.hasAttribute('required')) {
            validators.push((value) => {
                if (!value.trim()) {
                    return 'Este campo es requerido';
                }
                return null;
            });
        }

        if (input.type === 'email') {
            validators.push((value) => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (value && !emailRegex.test(value)) {
                    return 'Email inválido';
                }
                return null;
            });
        }

        if (input.type === 'password') {
            validators.push((value) => {
                if (value && value.length < 6) {
                    return 'La contraseña debe tener al menos 6 caracteres';
                }
                return null;
            });
        }

        return validators;
    }

    bindFormEvents(form, options) {
        // Real-time validation
        if (options.validateRealTime) {
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', debounce(() => this.validateField(input), 300));
                
                // Password strength for password fields
                if (input.type === 'password' && options.passwordStrength) {
                    input.addEventListener('input', () => this.updatePasswordStrength(input));
                }
            });
        }

        // Password toggle functionality
        const passwordToggles = form.querySelectorAll('.password-toggle');
        passwordToggles.forEach(toggle => {
            toggle.addEventListener('click', () => this.togglePasswordVisibility(toggle));
        });

        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit(form, options);
        });
    }

    validateField(input) {
        const formData = this.forms.get(input.closest('form').id);
        if (!formData) return;

        const validators = formData.validators[input.name || input.id] || [];
        const value = input.value;
        
        let isValid = true;
        let errorMessage = '';

        for (const validator of validators) {
            const result = validator(value);
            if (result) {
                isValid = false;
                errorMessage = result;
                break;
            }
        }

        this.updateFieldValidation(input, isValid, errorMessage);
        return isValid;
    }

    updateFieldValidation(input, isValid, errorMessage = '') {
        const inputGroup = input.closest('.input-group') || input.parentElement;
        const errorElement = inputGroup.parentElement.querySelector('.form-error');
        
        // Update input classes
        input.classList.toggle('valid', isValid && input.value.trim() !== '');
        input.classList.toggle('invalid', !isValid);
        
        // Update error message
        if (errorElement) {
            errorElement.textContent = errorMessage;
            errorElement.classList.toggle('visible', !isValid);
        }
    }

    updatePasswordStrength(input) {
        const strengthContainer = input.parentElement.parentElement.querySelector('.password-strength');
        if (!strengthContainer) return;

        const password = input.value;
        const strength = this.calculatePasswordStrength(password);
        
        const strengthFill = strengthContainer.querySelector('.strength-fill');
        const strengthText = strengthContainer.querySelector('.strength-text');
        
        if (password.length > 0) {
            strengthContainer.classList.add('visible');
            
            // Update strength bar
            strengthFill.className = `strength-fill ${strength.level}`;
            strengthText.textContent = strength.text;
        } else {
            strengthContainer.classList.remove('visible');
        }
    }

    calculatePasswordStrength(password) {
        let score = 0;
        
        if (password.length >= 8) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        
        const levels = {
            0: { level: 'weak', text: 'Muy débil' },
            1: { level: 'weak', text: 'Débil' },
            2: { level: 'medium', text: 'Regular' },
            3: { level: 'strong', text: 'Fuerte' },
            4: { level: 'very-strong', text: 'Muy fuerte' },
            5: { level: 'very-strong', text: 'Excelente' }
        };
        
        return levels[Math.min(score, 5)];
    }

    togglePasswordVisibility(toggle) {
        const input = toggle.parentElement.querySelector('input[type="password"], input[type="text"]');
        if (!input) return;

        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        
        const icon = toggle.querySelector('i');
        icon.className = isPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
    }

    async handleFormSubmit(form, options) {
        // Validate all fields
        const inputs = form.querySelectorAll('input, textarea, select');
        let isFormValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            this.notificationManager.show('Por favor corrige los errores del formulario', 'error');
            return;
        }

        // Collect form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        const loadingText = submitBtn.getAttribute('data-loading') || 'Procesando...';
        
        submitBtn.textContent = loadingText;
        submitBtn.disabled = true;

        try {
            // Call submit handler
            if (options.onSubmit) {
                await options.onSubmit(data);
            }
        } catch (error) {
            this.notificationManager.show('Error al procesar el formulario', 'error');
        } finally {
            // Restore button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }
}

// ROUTER MANAGER CLASS - COMPLETELY REWRITTEN AND FIXED
class RouterManager {
    constructor(app) {
        this.app = app;
        this.routes = new Map();
        this.currentRoute = '';
        this.setupRoutes();
    }

    setupRoutes() {
        // Define all routes - FIXED
        const routes = {
            'home': { 
                element: 'home-page',
                title: 'COMPANY+ Premium - Streaming Platform',
                showHeader: true,
                showParticles: false,
                init: () => this.initHomePage()
            },
            'login': { 
                element: 'login-page',
                title: 'Iniciar Sesión - COMPANY+',
                showHeader: false,
                showParticles: true,
                init: () => this.initAuthPage()
            },
            'register': { 
                element: 'register-page',
                title: 'Registrarse - COMPANY+',
                showHeader: false,
                showParticles: true,
                init: () => this.initAuthPage()
            },
            'forgot-password': { 
                element: 'forgot-password-page',
                title: 'Recuperar Contraseña - COMPANY+',
                showHeader: false,
                showParticles: true,
                init: () => this.initAuthPage()
            },
            'profiles': { 
                element: 'profiles-page',
                title: 'Perfiles - COMPANY+',
                showHeader: false,
                showParticles: false,
                init: () => this.initProfilesPage()
            },
            'dashboard': { 
                element: 'dashboard-page',
                title: 'Dashboard - COMPANY+',
                showHeader: false,
                showParticles: false,
                init: () => this.initDashboardPage()
            },
            'faq': { 
                element: 'faq-page',
                title: 'FAQ - COMPANY+',
                showHeader: true,
                showParticles: false,
                init: () => this.initFAQPage()
            },
            'settings': { 
                element: 'settings-page',
                title: 'Configuración - COMPANY+',
                showHeader: true,
                showParticles: false,
                init: () => this.initSettingsPage()
            },
            'soporte': { 
                element: 'soporte-page',
                title: 'Soporte - COMPANY+',
                showHeader: true,
                showParticles: false,
                init: () => this.initSupportPage()
            },
            'terms': { 
                element: 'terms-page',
                title: 'Términos y Condiciones - COMPANY+',
                showHeader: true,
                showParticles: false,
                init: () => this.initLegalPage()
            }
        };

        this.routes = new Map(Object.entries(routes));
    }

    init() {
        // Handle initial route
        const initialRoute = window.location.hash.substring(1) || 'home';
        this.navigate(initialRoute, false);

        // Handle browser navigation
        window.addEventListener('popstate', () => {
            const route = window.location.hash.substring(1) || 'home';
            this.navigate(route, false);
        });
    }

    navigate(route, updateHistory = true) {
        console.log('RouterManager.navigate called with route:', route);
        
        const routeConfig = this.routes.get(route);
        
        if (!routeConfig) {
            console.log('Route not found:', route, 'Redirecting to home');
            // Route not found, redirect to home
            this.navigate('home');
            return;
        }

        // Update browser history
        if (updateHistory) {
            window.history.pushState(null, null, `#${route}`);
        }

        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // Show target page
        const targetPage = document.getElementById(routeConfig.element);
        if (targetPage) {
            targetPage.classList.add('active');
            console.log('Page shown successfully:', route);
        } else {
            console.error('Target page element not found:', routeConfig.element);
        }

        // Update document title
        document.title = routeConfig.title;

        // Handle header visibility
        this.updateHeaderVisibility(routeConfig.showHeader);

        // Handle particles
        if (routeConfig.showParticles) {
            this.app.particleManager.start();
        } else {
            this.app.particleManager.stop();
        }

        // Update navigation active states
        this.updateActiveNavigation(route);

        // Initialize page-specific functionality
        if (routeConfig.init) {
            setTimeout(() => routeConfig.init(), 100);
        }

        // Close mobile menu
        this.app.closeMobileMenu();

        this.currentRoute = route;
    }

    updateHeaderVisibility(showHeader) {
        const header = document.getElementById('header');
        const mainContent = document.getElementById('main-content');
        
        if (showHeader) {
            if (header) header.style.display = 'block';
            if (mainContent) mainContent.style.marginTop = '70px';
        } else {
            if (header) header.style.display = 'none';
            if (mainContent) mainContent.style.marginTop = '0';
        }
    }

    updateActiveNavigation(route) {
        // Update header navigation
        document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${route}`) {
                link.classList.add('active');
            }
        });

        // Update dashboard navigation
        document.querySelectorAll('.dashboard-menu a').forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${route}`) {
                link.classList.add('active');
            }
        });
    }

    initHomePage() {
        // Animate hero section
        const heroContent = document.querySelector('.hero__content');
        if (heroContent) {
            heroContent.style.opacity = '0';
            heroContent.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                heroContent.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                heroContent.style.opacity = '1';
                heroContent.style.transform = 'translateY(0)';
            }, 200);
        }

        // Animate feature cards
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 300 + (index * 100));
        });
    }

    initAuthPage() {
        // Auth pages already have particles and animations in CSS
        // Focus first input
        setTimeout(() => {
            const firstInput = document.querySelector('.page.active input');
            if (firstInput) firstInput.focus();
        }, 500);
    }

    initProfilesPage() {
        // Animate profile cards
        const profileCards = document.querySelectorAll('.profile-card');
        profileCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px) scale(0.9)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
            }, index * 150);
        });
    }

    initDashboardPage() {
        // Generate content if not already generated
        this.app.i18nManager.generateDashboardContent();
        
        // Animate dashboard content
        const contentRows = document.querySelectorAll('.content-row');
        contentRows.forEach((row, index) => {
            row.style.opacity = '0';
            row.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                row.style.transition = 'all 0.5s ease';
                row.style.opacity = '1';
                row.style.transform = 'translateX(0)';
            }, index * 200);
        });
    }

    initFAQPage() {
        this.app.i18nManager.updateFAQContent();
    }

    initSettingsPage() {
        // Initialize settings controls if not already done
        this.app.initSettings();
    }

    initSupportPage() {
        // Animate support cards
        const supportCards = document.querySelectorAll('.support-card');
        supportCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    initLegalPage() {
        // Animate legal sections
        const legalSections = document.querySelectorAll('.legal-section');
        legalSections.forEach((section, index) => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                section.style.transition = 'all 0.5s ease';
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
}

// UTILITY FUNCTIONS
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function isReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// INITIALIZE APPLICATION
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎬 Starting COMPANY+ Premium SPA...');
    window.companyPlusApp = new CompanyPlusPremiumSPA();
});

// EXPORT FOR POTENTIAL EXTERNAL USE
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CompanyPlusPremiumSPA };
}