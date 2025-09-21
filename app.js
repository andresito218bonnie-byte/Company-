// Estado global de la aplicación
const AppState = {
    currentView: 'home',
    user: null,
    isAuthenticated: false,
    selectedProfile: null
};

// Sistema de enrutamiento SPA
class Router {
    constructor() {
        this.routes = {
            '': () => this.showView('home-view'),
            'home': () => this.showView('home-view'),
            'explorar': () => this.showView('explorar-view'),
            'ayuda': () => this.showView('ayuda-view'),
            'login': () => this.showView('login-view'),
            'register': () => this.showView('register-view'),
            'forgot-password': () => this.showView('forgot-password-view'),
            'profiles': () => this.showView('profiles-view'),
            'dashboard': () => this.showView('dashboard-view')
        };
        
        this.init();
    }
    
    init() {
        // Escuchar cambios en el hash
        window.addEventListener('hashchange', () => this.handleRoute());
        
        // Manejar la ruta inicial
        this.handleRoute();
        
        // Setup navigation after DOM is loaded
        this.setupNavigation();
    }
    
    setupNavigation() {
        // Remove any existing listeners and add fresh ones
        document.removeEventListener('click', this.handleClick);
        document.addEventListener('click', this.handleClick.bind(this));
    }
    
    handleClick(e) {
        // Find the closest element with data-route
        const routeElement = e.target.closest('[data-route]');
        
        if (routeElement) {
            e.preventDefault();
            e.stopPropagation();
            
            const route = routeElement.dataset.route;
            console.log('Router: Navigating to route:', route);
            
            // Navigate to the route
            this.navigate(route);
            return false;
        }
    }
    
    navigate(route) {
        console.log('Router: Setting hash to:', route);
        window.location.hash = `#${route}`;
    }
    
    handleRoute() {
        const hash = window.location.hash.slice(1) || 'home';
        
        console.log('Router: Handling route:', hash);
        
        // Verificar autenticación para rutas protegidas
        if (['profiles', 'dashboard'].includes(hash) && !AppState.isAuthenticated) {
            this.navigate('login');
            showToast('Debes iniciar sesión para acceder', 'error');
            return;
        }
        
        // Redirigir a profiles si está autenticado y trata de ir a login/register
        if (['login', 'register', 'forgot-password'].includes(hash) && AppState.isAuthenticated) {
            this.navigate('profiles');
            return;
        }
        
        // Redirigir a dashboard si ya seleccionó perfil y va a profiles
        if (hash === 'profiles' && AppState.selectedProfile) {
            this.navigate('dashboard');
            return;
        }
        
        if (this.routes[hash]) {
            AppState.currentView = hash;
            this.routes[hash]();
            this.updateNavigation();
        } else {
            this.navigate('home');
        }
    }
    
    showView(viewId) {
        console.log('Router: Showing view:', viewId);
        
        // Ocultar todas las vistas
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });
        
        // Mostrar vista actual
        const currentView = document.getElementById(viewId);
        if (currentView) {
            currentView.classList.add('active');
            
            // Scroll to top when changing views
            window.scrollTo(0, 0);
        } else {
            console.error('Router: View not found:', viewId);
        }
    }
    
    updateNavigation() {
        // Actualizar estados activos en navegación
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            const route = link.dataset.route;
            if (route && route === AppState.currentView) {
                link.classList.add('active');
            }
        });
    }
}

// Sistema de autenticación
class AuthSystem {
    constructor() {
        this.init();
    }
    
    init() {
        // Verificar sesión existente
        this.checkExistingSession();
        
        // Setup form listeners with delay to ensure DOM is ready
        setTimeout(() => {
            this.setupFormListeners();
            this.setupPasswordToggles();
            this.setupLogout();
            this.setupProfileSelection();
        }, 100);
    }
    
    checkExistingSession() {
        const userData = sessionStorage.getItem('company_plus_user');
        const profileData = sessionStorage.getItem('company_plus_profile');
        
        if (userData) {
            try {
                AppState.user = JSON.parse(userData);
                AppState.isAuthenticated = true;
                
                if (profileData) {
                    AppState.selectedProfile = JSON.parse(profileData);
                }
                
                this.updateAuthUI();
            } catch (e) {
                sessionStorage.removeItem('company_plus_user');
                sessionStorage.removeItem('company_plus_profile');
            }
        }
    }
    
    setupFormListeners() {
        // Login Form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
            
            // Real-time validation
            const loginEmail = document.getElementById('login-email');
            const loginPassword = document.getElementById('login-password');
            
            if (loginEmail) {
                loginEmail.addEventListener('input', () => this.validateEmail(loginEmail));
                loginEmail.addEventListener('blur', () => this.validateEmail(loginEmail));
            }
            if (loginPassword) {
                loginPassword.addEventListener('input', () => this.validatePassword(loginPassword, 'login'));
                loginPassword.addEventListener('blur', () => this.validatePassword(loginPassword, 'login'));
            }
        }
        
        // Register Form
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
            
            // Real-time validation
            const regName = document.getElementById('register-fullname');
            const regEmail = document.getElementById('register-email');
            const regPassword = document.getElementById('register-password');
            const regConfirmPassword = document.getElementById('register-confirm-password');
            
            if (regName) {
                regName.addEventListener('input', () => this.validateName(regName));
                regName.addEventListener('blur', () => this.validateName(regName));
            }
            if (regEmail) {
                regEmail.addEventListener('input', () => this.validateEmail(regEmail));
                regEmail.addEventListener('blur', () => this.validateEmail(regEmail));
            }
            if (regPassword) {
                regPassword.addEventListener('input', () => this.validatePassword(regPassword, 'register'));
                regPassword.addEventListener('blur', () => this.validatePassword(regPassword, 'register'));
            }
            if (regConfirmPassword) {
                regConfirmPassword.addEventListener('input', () => this.validatePasswordMatch());
                regConfirmPassword.addEventListener('blur', () => this.validatePasswordMatch());
            }
        }
        
        // Forgot Password Form
        const forgotForm = document.getElementById('forgot-password-form');
        if (forgotForm) {
            forgotForm.addEventListener('submit', (e) => this.handleForgotPassword(e));
            
            const forgotEmail = document.getElementById('forgot-email');
            if (forgotEmail) {
                forgotEmail.addEventListener('input', () => this.validateEmail(forgotEmail));
                forgotEmail.addEventListener('blur', () => this.validateEmail(forgotEmail));
            }
        }
    }
    
    setupProfileSelection() {
        document.addEventListener('click', (e) => {
            const profileCard = e.target.closest('.profile-card[data-profile]');
            if (profileCard && !profileCard.classList.contains('add-profile')) {
                const profileId = profileCard.dataset.profile;
                this.selectProfile(profileId);
            }
        });
    }
    
    selectProfile(profileId) {
        const profileData = {
            id: profileId,
            name: 'Usuario Principal',
            avatar: '👤',
            selectedAt: new Date().toISOString()
        };
        
        AppState.selectedProfile = profileData;
        sessionStorage.setItem('company_plus_profile', JSON.stringify(profileData));
        
        showToast('Perfil seleccionado', 'success');
        router.navigate('dashboard');
    }
    
    // Validation functions
    validateEmail(input) {
        const email = input.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const errorElement = document.getElementById(`${input.id}-error`);
        
        if (!email) {
            this.showFieldError(errorElement, 'El correo electrónico es requerido');
            return false;
        }
        
        if (!emailRegex.test(email)) {
            this.showFieldError(errorElement, 'Formato de correo inválido');
            return false;
        }
        
        this.clearFieldError(errorElement);
        this.showFieldSuccess(input);
        return true;
    }
    
    validatePassword(input, context) {
        const password = input.value;
        const errorElement = document.getElementById(`${input.id}-error`);
        
        if (!password) {
            this.showFieldError(errorElement, 'La contraseña es requerida');
            return false;
        }
        
        if (password.length < 8) {
            this.showFieldError(errorElement, 'Mínimo 8 caracteres');
            return false;
        }
        
        this.clearFieldError(errorElement);
        this.showFieldSuccess(input);
        
        // Trigger password match validation if in register
        if (context === 'register') {
            setTimeout(() => this.validatePasswordMatch(), 100);
        }
        
        return true;
    }
    
    validateName(input) {
        const name = input.value.trim();
        const errorElement = document.getElementById(`${input.id}-error`);
        
        if (!name) {
            this.showFieldError(errorElement, 'El nombre es requerido');
            return false;
        }
        
        if (name.length < 2) {
            this.showFieldError(errorElement, 'Mínimo 2 caracteres');
            return false;
        }
        
        this.clearFieldError(errorElement);
        this.showFieldSuccess(input);
        return true;
    }
    
    validatePasswordMatch() {
        const password = document.getElementById('register-password')?.value || '';
        const confirmPassword = document.getElementById('register-confirm-password')?.value || '';
        const errorElement = document.getElementById('register-confirm-password-error');
        
        if (!confirmPassword) {
            this.showFieldError(errorElement, 'Confirma tu contraseña');
            return false;
        }
        
        if (password !== confirmPassword) {
            this.showFieldError(errorElement, 'Las contraseñas no coinciden');
            return false;
        }
        
        this.clearFieldError(errorElement);
        this.showFieldSuccess(document.getElementById('register-confirm-password'));
        return true;
    }
    
    validateTerms() {
        const checkbox = document.getElementById('terms-checkbox');
        const errorElement = document.getElementById('register-terms-error');
        
        if (!checkbox || !checkbox.checked) {
            this.showFieldError(errorElement, 'Debes aceptar los términos y condiciones');
            return false;
        }
        
        this.clearFieldError(errorElement);
        return true;
    }
    
    showFieldError(errorElement, message) {
        if (errorElement) {
            errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
            errorElement.classList.add('show');
        }
    }
    
    clearFieldError(errorElement) {
        if (errorElement) {
            errorElement.innerHTML = '';
            errorElement.classList.remove('show');
        }
    }
    
    showFieldSuccess(input) {
        if (input) {
            input.style.borderColor = 'var(--success-color)';
            setTimeout(() => {
                input.style.borderColor = '';
            }, 2000);
        }
    }
    
    // Form submission handlers
    async handleLogin(e) {
        e.preventDefault();
        
        const emailInput = document.getElementById('login-email');
        const passwordInput = document.getElementById('login-password');
        
        if (!emailInput || !passwordInput) return;
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        
        // Validate
        const emailValid = this.validateEmail(emailInput);
        const passwordValid = this.validatePassword(passwordInput, 'login');
        
        if (!emailValid || !passwordValid) {
            showToast('Por favor corrige los errores del formulario', 'error');
            return;
        }
        
        // Show loading
        this.setButtonLoading('login-form', true);
        
        try {
            // Simulate API call
            await this.simulateApiCall();
            
            // Mock successful login
            const userData = {
                id: Date.now(),
                name: email.split('@')[0],
                email: email,
                loginTime: new Date().toISOString()
            };
            
            AppState.user = userData;
            AppState.isAuthenticated = true;
            AppState.selectedProfile = null; // Reset profile selection
            sessionStorage.setItem('company_plus_user', JSON.stringify(userData));
            sessionStorage.removeItem('company_plus_profile');
            
            this.updateAuthUI();
            showToast(`¡Bienvenido, ${userData.name}!`, 'success');
            router.navigate('profiles');
            
        } catch (error) {
            showToast('Error al iniciar sesión. Intenta nuevamente.', 'error');
        } finally {
            this.setButtonLoading('login-form', false);
        }
    }
    
    async handleRegister(e) {
        e.preventDefault();
        
        const nameInput = document.getElementById('register-fullname');
        const emailInput = document.getElementById('register-email');
        const passwordInput = document.getElementById('register-password');
        
        if (!nameInput || !emailInput || !passwordInput) return;
        
        // Validate all fields
        const nameValid = this.validateName(nameInput);
        const emailValid = this.validateEmail(emailInput);
        const passwordValid = this.validatePassword(passwordInput, 'register');
        const matchValid = this.validatePasswordMatch();
        const termsValid = this.validateTerms();
        
        if (!nameValid || !emailValid || !passwordValid || !matchValid || !termsValid) {
            showToast('Por favor corrige los errores del formulario', 'error');
            return;
        }
        
        this.setButtonLoading('register-form', true);
        
        try {
            await this.simulateApiCall();
            
            const userData = {
                id: Date.now(),
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                registerTime: new Date().toISOString()
            };
            
            AppState.user = userData;
            AppState.isAuthenticated = true;
            AppState.selectedProfile = null; // Reset profile selection
            sessionStorage.setItem('company_plus_user', JSON.stringify(userData));
            sessionStorage.removeItem('company_plus_profile');
            
            this.updateAuthUI();
            showToast('¡Cuenta creada exitosamente!', 'success');
            router.navigate('profiles');
            
        } catch (error) {
            showToast('Error al crear cuenta. Intenta nuevamente.', 'error');
        } finally {
            this.setButtonLoading('register-form', false);
        }
    }
    
    async handleForgotPassword(e) {
        e.preventDefault();
        
        const emailInput = document.getElementById('forgot-email');
        if (!emailInput) return;
        
        const emailValid = this.validateEmail(emailInput);
        
        if (!emailValid) {
            return;
        }
        
        this.setButtonLoading('forgot-password-form', true);
        
        try {
            await this.simulateApiCall();
            
            // Show success message
            const form = document.getElementById('forgot-password-form');
            const success = document.getElementById('forgot-success');
            
            if (form) form.style.display = 'none';
            if (success) success.classList.remove('hidden');
            
            showToast('Enlace de recuperación enviado', 'success');
            
        } catch (error) {
            showToast('Error al enviar enlace. Intenta nuevamente.', 'error');
        } finally {
            this.setButtonLoading('forgot-password-form', false);
        }
    }
    
    setupPasswordToggles() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.password-toggle')) {
                const toggle = e.target.closest('.password-toggle');
                const targetId = toggle.dataset.target;
                const input = document.getElementById(targetId);
                const icon = toggle.querySelector('i');
                
                if (input && icon) {
                    if (input.type === 'password') {
                        input.type = 'text';
                        icon.className = 'fas fa-eye-slash';
                    } else {
                        input.type = 'password';
                        icon.className = 'fas fa-eye';
                    }
                }
            }
        });
    }
    
    setupLogout() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('#logout-btn')) {
                this.logout();
            }
        });
    }
    
    logout() {
        AppState.user = null;
        AppState.isAuthenticated = false;
        AppState.selectedProfile = null;
        sessionStorage.removeItem('company_plus_user');
        sessionStorage.removeItem('company_plus_profile');
        this.updateAuthUI();
        showToast('Sesión cerrada exitosamente', 'success');
        router.navigate('home');
    }
    
    updateAuthUI() {
        const authLink = document.getElementById('auth-link');
        const userMenu = document.getElementById('user-menu');
        const userName = document.getElementById('user-name');
        
        if (AppState.isAuthenticated && AppState.user) {
            if (authLink) authLink.classList.add('hidden');
            if (userMenu) userMenu.classList.remove('hidden');
            if (userName) userName.textContent = AppState.user.name;
        } else {
            if (authLink) authLink.classList.remove('hidden');
            if (userMenu) userMenu.classList.add('hidden');
        }
    }
    
    setButtonLoading(formId, isLoading) {
        const form = document.getElementById(formId);
        if (!form) return;
        
        const btn = form.querySelector('button[type="submit"]');
        if (!btn) return;
        
        const btnText = btn.querySelector('.btn-text');
        const btnLoading = btn.querySelector('.btn-loading');
        
        if (isLoading) {
            btn.disabled = true;
            if (btnText) btnText.classList.add('hidden');
            if (btnLoading) btnLoading.classList.remove('hidden');
        } else {
            btn.disabled = false;
            if (btnText) btnText.classList.remove('hidden');
            if (btnLoading) btnLoading.classList.add('hidden');
        }
    }
    
    simulateApiCall() {
        return new Promise((resolve) => {
            setTimeout(resolve, 1500 + Math.random() * 1000);
        });
    }
}

// Sistema de notificaciones Toast
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        toast.style.animation = 'toastSlideIn 0.3s ease-out reverse';
        setTimeout(() => {
            if (container.contains(toast)) {
                container.removeChild(toast);
            }
        }, 300);
    }, 4000);
}

// Sistema de partículas de fondo
function initParticles() {
    if (window.particlesJS) {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: '#0a97f7'
                },
                shape: {
                    type: 'circle',
                    stroke: {
                        width: 0,
                        color: '#000000'
                    }
                },
                opacity: {
                    value: 0.1,
                    random: false,
                    anim: {
                        enable: false,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: false,
                        speed: 40,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#0a97f7',
                    opacity: 0.1,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false,
                    attract: {
                        enable: false,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'grab'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 140,
                        line_linked: {
                            opacity: 0.3
                        }
                    },
                    push: {
                        particles_nb: 4
                    }
                }
            },
            retina_detect: true
        });
    }
}

// Micro-interacciones y efectos
function setupMicroInteractions() {
    // Floating label effects
    document.addEventListener('input', (e) => {
        if (e.target.classList.contains('form-input')) {
            const label = e.target.nextElementSibling;
            if (label && label.classList.contains('form-label')) {
                if (e.target.value) {
                    label.style.transform = 'translateY(-1.5rem) scale(0.85)';
                    label.style.color = 'var(--primary-color)';
                } else {
                    label.style.transform = 'translateY(-50%) scale(1)';
                    label.style.color = 'var(--text-secondary)';
                }
            }
        }
    });
    
    // Input focus effects
    document.addEventListener('focus', (e) => {
        if (e.target.classList.contains('form-input')) {
            e.target.style.background = 'var(--glass-secondary)';
            e.target.style.borderColor = 'var(--primary-color)';
        }
    }, true);
    
    document.addEventListener('blur', (e) => {
        if (e.target.classList.contains('form-input')) {
            e.target.style.background = '';
            e.target.style.borderColor = '';
        }
    }, true);
}

// Form reset functionality
function resetForms() {
    // Reset forms when switching views
    window.addEventListener('hashchange', () => {
        const forms = document.querySelectorAll('.auth-form');
        forms.forEach(form => {
            form.reset();
            
            // Clear all errors
            const errors = form.querySelectorAll('.field-error');
            errors.forEach(error => {
                error.innerHTML = '';
                error.classList.remove('show');
            });
            
            // Reset forgot password success message
            const forgotSuccess = document.getElementById('forgot-success');
            const forgotForm = document.getElementById('forgot-password-form');
            if (forgotSuccess && !forgotSuccess.classList.contains('hidden')) {
                forgotSuccess.classList.add('hidden');
            }
            if (forgotForm && forgotForm.style.display === 'none') {
                forgotForm.style.display = '';
            }
        });
    });
}

// Landing page animations - CONSERVAR EXACTAMENTE COMO ESTÁ
function setupLandingAnimations() {
    // Intersection Observer for scroll animations
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Observe feature cards and other elements
        setTimeout(() => {
            document.querySelectorAll('.feature-card, .stat-card').forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'all 0.6s ease-out';
                observer.observe(el);
            });
        }, 1000);
    }
}

// Nuevas funcionalidades para las vistas adicionales
function setupNewViews() {
    // Content interactions for Explorar view
    document.addEventListener('click', (e) => {
        if (e.target.closest('.content-card')) {
            const card = e.target.closest('.content-card');
            if (!AppState.isAuthenticated) {
                showToast('Regístrate para acceder al contenido completo', 'error');
                setTimeout(() => {
                    router.navigate('register');
                }, 1500);
            }
        }
    });
    
    // Help section interactions
    document.addEventListener('click', (e) => {
        if (e.target.closest('.contact-options .btn')) {
            const btn = e.target.closest('.btn');
            const isEmail = btn.querySelector('.fa-envelope');
            const isChat = btn.querySelector('.fa-comments');
            
            if (isEmail) {
                showToast('Redirigiendo al correo de soporte...', 'success');
            } else if (isChat) {
                showToast('Iniciando chat de soporte...', 'success');
            }
        }
    });
    
    // Profile add functionality
    document.addEventListener('click', (e) => {
        if (e.target.closest('.profile-card.add-profile')) {
            showToast('Funcionalidad de agregar perfil próximamente', 'info');
        }
    });
}

// Global variables
let router;
let authSystem;

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 COMPANY+ SPA Iniciando...');
    
    // Inicializar sistemas
    router = new Router();
    authSystem = new AuthSystem();
    
    // Configurar efectos
    setupMicroInteractions();
    resetForms();
    setupLandingAnimations(); // CONSERVAR las animaciones originales
    setupNewViews(); // Nuevas funcionalidades
    
    // Inicializar partículas con delay para asegurar que la librería esté cargada
    setTimeout(() => {
        initParticles();
    }, 500);
    
    console.log('✅ COMPANY+ SPA Lista');
    
    // Mostrar toast de bienvenida solo si no está autenticado
    setTimeout(() => {
        if (!AppState.isAuthenticated) {
            showToast('¡Bienvenido a COMPANY+ Premium!', 'success');
        }
    }, 1000);
});

// Manejar errores globales
window.addEventListener('error', (e) => {
    console.error('Error en la aplicación:', e.error);
});

// Performance optimization - Lazy loading for non-critical features
function lazyLoadFeatures() {
    // Preload images on hover
    document.addEventListener('mouseenter', (e) => {
        if (e.target.tagName === 'IMG' && e.target.dataset.src) {
            e.target.src = e.target.dataset.src;
        }
    });
    
    // Optimize scroll performance
    let scrollTimer = null;
    window.addEventListener('scroll', () => {
        if (scrollTimer !== null) {
            clearTimeout(scrollTimer);        
        }
        scrollTimer = setTimeout(() => {
            // Scroll ended - optimize any heavy operations here
        }, 150);
    }, false);
}

// Initialize lazy loading after DOM is ready
setTimeout(lazyLoadFeatures, 1000);

// Window resize optimization
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Handle resize optimizations
        if (window.pJSDom && window.pJSDom[0]) {
            window.pJSDom[0].pJS.fn.canvasSize();
        }
    }, 250);
});

// Keyboard accessibility
document.addEventListener('keydown', (e) => {
    // ESC key to close modals or go back
    if (e.key === 'Escape') {
        if (AppState.currentView !== 'home' && !AppState.isAuthenticated) {
            router.navigate('home');
        } else if (AppState.currentView === 'profiles' && AppState.isAuthenticated) {
            // Allow going back to profiles from other authenticated views
            router.navigate('profiles');
        }
    }
    
    // Enter key for CTA buttons when focused
    if (e.key === 'Enter' && e.target.classList.contains('btn') && e.target.dataset.route) {
        e.target.click();
    }
});

// Add focus management for accessibility
document.addEventListener('focusin', (e) => {
    if (e.target.classList.contains('btn') || e.target.classList.contains('form-input')) {
        e.target.style.outline = '2px solid var(--primary-color)';
        e.target.style.outlineOffset = '2px';
    }
});

document.addEventListener('focusout', (e) => {
    if (e.target.classList.contains('btn') || e.target.classList.contains('form-input')) {
        e.target.style.outline = '';
        e.target.style.outlineOffset = '';
    }
});