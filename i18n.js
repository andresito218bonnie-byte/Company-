/* =====================================================
   COMPANY+ PREMIUM - SISTEMA DE INTERNACIONALIZACIÓN
   Soporte multiidioma completo
   ===================================================== */

class I18n {
    constructor() {
        this.currentLang = 'es';
        this.fallbackLang = 'es';
        this.translations = {};
        this.observers = [];

        this.loadTranslations();
        this.detectLanguage();
        this.init();
    }

    // Cargar todas las traducciones
    loadTranslations() {
        this.translations = {
            es: {
                // Header y Navegación
                skip_to_content: 'Saltar al contenido principal',
                nav_home: 'Inicio',
                nav_explore: 'Explorar',
                nav_help: 'Ayuda',
                header_login: 'Iniciar Sesión',
                header_register: 'Registrarse',

                // Landing Page
                loading_experience: 'Cargando experiencia premium...',
                hero_title: 'Descubre el entretenimiento',
                hero_highlight: 'definitivo',
                hero_subtitle: 'Miles de películas, series exclusivas y contenido original en calidad 4K. Todo en una sola plataforma premium.',
                hero_cta_register: 'Comenzar Prueba Gratuita',
                hero_cta_login: 'Ya tengo cuenta',

                // Características
                features_title: 'La plataforma más avanzada',
                feature_quality_title: 'Calidad 4K Ultra HD',
                feature_quality_desc: 'Disfruta de cada detalle con calidad 4K Ultra HD y sonido envolvente.',
                feature_offline_title: 'Descarga y Ve Sin Conexión',
                feature_offline_desc: 'Descarga tu contenido favorito y disfrútalo sin conexión a internet.',
                feature_profiles_title: 'Hasta 5 Perfiles',
                feature_profiles_desc: 'Hasta 5 perfiles diferentes con recomendaciones personalizadas.',
                feature_devices_title: 'Multiplataforma',
                feature_devices_desc: 'Ve en tu TV, computadora, tablet o móvil. Sincronización total.',
                feature_family_title: 'Control Parental',
                feature_family_desc: 'Control parental avanzado con perfiles seguros para niños.',
                feature_cancel_title: 'Cancela Cuando Quieras',
                feature_cancel_desc: 'Cancela cuando quieras, sin penalizaciones ni letra pequeña.',

                // Login
                login_title: '¡Bienvenido de vuelta!',
                login_subtitle: 'Inicia sesión y continúa disfrutando de todo el contenido premium',
                login_email: 'Correo Electrónico',
                login_password: 'Contraseña',
                login_remember: 'Recordarme',
                login_button: 'Iniciar Sesión',
                login_forgot: '¿Olvidaste tu contraseña?',
                login_no_account: '¿No tienes cuenta?',
                login_register_link: 'Regístrate aquí',

                // Register
                register_title: '¡Únete a COMPANY+!',
                register_subtitle: 'Crea tu cuenta y accede a miles de horas de entretenimiento premium',
                register_name: 'Nombre Completo',
                register_email: 'Correo Electrónico',
                register_password: 'Contraseña',
                register_confirm_password: 'Confirmar Contraseña',
                register_terms: 'Acepto los términos y condiciones',
                register_button: 'Crear Cuenta',
                register_have_account: '¿Ya tienes cuenta?',
                register_login_link: 'Inicia sesión',

                // Profiles
                profiles_title: '¿Quién está viendo?',
                profiles_subtitle: 'Selecciona tu perfil para continuar',
                profiles_add: 'Agregar Perfil',
                profiles_manage: 'Administrar Perfiles',

                // Dashboard
                dashboard_welcome: 'Bienvenido de vuelta',
                dashboard_continue_watching: 'Continuar Viendo',
                dashboard_trending: 'Tendencias',
                dashboard_new_releases: 'Nuevos Lanzamientos',
                dashboard_my_list: 'Mi Lista',
                dashboard_genres: 'Explorar por Género',
                dashboard_search_placeholder: 'Buscar películas, series, documentales...',

                // User Menu
                user_profiles: 'Cambiar Perfil',
                user_settings: 'Configuración',
                user_logout: 'Cerrar Sesión',

                // Support Pages
                support_title: 'Centro de Soporte',
                support_subtitle: 'Estamos aquí para ayudarte',
                faq_title: 'Preguntas Frecuentes',
                contact_title: 'Contactar Soporte',
                security_title: 'Consejos de Seguridad',
                terms_title: 'Términos y Condiciones',

                // FAQ
                faq_account_title: '¿Cómo creo una cuenta?',
                faq_account_answer: 'Hacer clic en "Registrarse", completar el formulario con tus datos y verificar tu correo electrónico.',
                faq_devices_title: '¿En cuántos dispositivos puedo ver contenido?',
                faq_devices_answer: 'Puedes ver contenido en todos tus dispositivos, pero solo en 4 pantallas simultáneamente.',
                faq_quality_title: '¿Qué calidades de video están disponibles?',
                faq_quality_answer: 'Ofrecemos contenido en HD (720p), Full HD (1080p) y 4K Ultra HD según tu plan.',

                // Footer
                footer_company: 'Empresa',
                footer_terms: 'Términos y Condiciones',
                footer_privacy: 'Privacidad y Seguridad',
                footer_support: 'Soporte',
                footer_help: 'Ayuda',
                footer_faq: 'Preguntas Frecuentes',
                footer_tech_support: 'Soporte Técnico',
                footer_rights: 'Todos los derechos reservados.',

                // Messages
                msg_login_success: 'Sesión iniciada correctamente',
                msg_register_success: 'Cuenta creada exitosamente',
                msg_error_generic: 'Ha ocurrido un error. Inténtalo de nuevo.',
                msg_invalid_credentials: 'Credenciales inválidas',
                msg_network_error: 'Error de conexión. Verifica tu internet.',

                // Accessibility
                close: 'Cerrar',
                loading: 'Cargando',
                menu: 'Menú',
                search: 'Buscar',
                play: 'Reproducir',
                pause: 'Pausar'
            },

            en: {
                // Header and Navigation
                skip_to_content: 'Skip to main content',
                nav_home: 'Home',
                nav_explore: 'Explore',
                nav_help: 'Help',
                header_login: 'Sign In',
                header_register: 'Sign Up',

                // Landing Page
                loading_experience: 'Loading premium experience...',
                hero_title: 'Discover the ultimate',
                hero_highlight: 'entertainment',
                hero_subtitle: 'Thousands of movies, exclusive series and original content in 4K quality. All in one premium platform.',
                hero_cta_register: 'Start Free Trial',
                hero_cta_login: 'I have an account',

                // Features
                features_title: 'The most advanced platform',
                feature_quality_title: '4K Ultra HD Quality',
                feature_quality_desc: 'Enjoy every detail with 4K Ultra HD quality and surround sound.',
                feature_offline_title: 'Download & Watch Offline',
                feature_offline_desc: 'Download your favorite content and enjoy it without internet connection.',
                feature_profiles_title: 'Up to 5 Profiles',
                feature_profiles_desc: 'Up to 5 different profiles with personalized recommendations.',
                feature_devices_title: 'Cross-Platform',
                feature_devices_desc: 'Watch on your TV, computer, tablet or mobile. Total synchronization.',
                feature_family_title: 'Parental Control',
                feature_family_desc: 'Advanced parental control with safe profiles for children.',
                feature_cancel_title: 'Cancel Anytime',
                feature_cancel_desc: 'Cancel anytime, no penalties or fine print.',

                // Login
                login_title: 'Welcome back!',
                login_subtitle: 'Sign in and continue enjoying all premium content',
                login_email: 'Email Address',
                login_password: 'Password',
                login_remember: 'Remember me',
                login_button: 'Sign In',
                login_forgot: 'Forgot your password?',
                login_no_account: "Don't have an account?",
                login_register_link: 'Sign up here',

                // Register
                register_title: 'Join COMPANY+!',
                register_subtitle: 'Create your account and access thousands of hours of premium entertainment',
                register_name: 'Full Name',
                register_email: 'Email Address',
                register_password: 'Password',
                register_confirm_password: 'Confirm Password',
                register_terms: 'I accept the terms and conditions',
                register_button: 'Create Account',
                register_have_account: 'Already have an account?',
                register_login_link: 'Sign in',

                // Profiles
                profiles_title: "Who's watching?",
                profiles_subtitle: 'Select your profile to continue',
                profiles_add: 'Add Profile',
                profiles_manage: 'Manage Profiles',

                // Dashboard
                dashboard_welcome: 'Welcome back',
                dashboard_continue_watching: 'Continue Watching',
                dashboard_trending: 'Trending',
                dashboard_new_releases: 'New Releases',
                dashboard_my_list: 'My List',
                dashboard_genres: 'Browse by Genre',
                dashboard_search_placeholder: 'Search movies, series, documentaries...',

                // User Menu
                user_profiles: 'Switch Profile',
                user_settings: 'Settings',
                user_logout: 'Sign Out',

                // Support Pages
                support_title: 'Help Center',
                support_subtitle: "We're here to help",
                faq_title: 'Frequently Asked Questions',
                contact_title: 'Contact Support',
                security_title: 'Security Tips',
                terms_title: 'Terms and Conditions',

                // FAQ
                faq_account_title: 'How do I create an account?',
                faq_account_answer: 'Click "Sign Up", fill out the form with your information and verify your email address.',
                faq_devices_title: 'On how many devices can I watch content?',
                faq_devices_answer: 'You can watch content on all your devices, but only on 4 screens simultaneously.',
                faq_quality_title: 'What video qualities are available?',
                faq_quality_answer: 'We offer content in HD (720p), Full HD (1080p) and 4K Ultra HD depending on your plan.',

                // Footer
                footer_company: 'Company',
                footer_terms: 'Terms and Conditions',
                footer_privacy: 'Privacy and Security',
                footer_support: 'Support',
                footer_help: 'Help',
                footer_faq: 'FAQ',
                footer_tech_support: 'Technical Support',
                footer_rights: 'All rights reserved.',

                // Messages
                msg_login_success: 'Successfully signed in',
                msg_register_success: 'Account created successfully',
                msg_error_generic: 'An error occurred. Please try again.',
                msg_invalid_credentials: 'Invalid credentials',
                msg_network_error: 'Connection error. Check your internet.',

                // Accessibility
                close: 'Close',
                loading: 'Loading',
                menu: 'Menu',
                search: 'Search',
                play: 'Play',
                pause: 'Pause'
            },

            pt: {
                // Header e Navegação
                skip_to_content: 'Pular para o conteúdo principal',
                nav_home: 'Início',
                nav_explore: 'Explorar',
                nav_help: 'Ajuda',
                header_login: 'Entrar',
                header_register: 'Cadastrar',

                // Landing Page
                loading_experience: 'Carregando experiência premium...',
                hero_title: 'Descubra o entretenimento',
                hero_highlight: 'definitivo',
                hero_subtitle: 'Milhares de filmes, séries exclusivas e conteúdo original em qualidade 4K. Tudo em uma única plataforma premium.',
                hero_cta_register: 'Iniciar Teste Grátis',
                hero_cta_login: 'Já tenho conta',

                // Recursos
                features_title: 'A plataforma mais avançada',
                feature_quality_title: 'Qualidade 4K Ultra HD',
                feature_quality_desc: 'Desfrute de cada detalhe com qualidade 4K Ultra HD e som surround.',
                feature_offline_title: 'Baixe e Assista Offline',
                feature_offline_desc: 'Baixe seu conteúdo favorito e desfrute sem conexão com internet.',
                feature_profiles_title: 'Até 5 Perfis',
                feature_profiles_desc: 'Até 5 perfis diferentes com recomendações personalizadas.',
                feature_devices_title: 'Multiplataforma',
                feature_devices_desc: 'Assista na sua TV, computador, tablet ou celular. Sincronização total.',
                feature_family_title: 'Controle Parental',
                feature_family_desc: 'Controle parental avançado com perfis seguros para crianças.',
                feature_cancel_title: 'Cancele Quando Quiser',
                feature_cancel_desc: 'Cancele quando quiser, sem penalizações ou letras miúdas.',

                // Login
                login_title: 'Bem-vindo de volta!',
                login_subtitle: 'Entre e continue aproveitando todo o conteúdo premium',
                login_email: 'Endereço de Email',
                login_password: 'Senha',
                login_remember: 'Lembrar-me',
                login_button: 'Entrar',
                login_forgot: 'Esqueceu sua senha?',
                login_no_account: 'Não tem uma conta?',
                login_register_link: 'Cadastre-se aqui',

                // Outros idiomas seguirão el mismo patrón...
            },

            fr: {
                // Header et Navigation
                skip_to_content: 'Aller au contenu principal',
                nav_home: 'Accueil',
                nav_explore: 'Explorer',
                nav_help: 'Aide',
                header_login: 'Se connecter',
                header_register: "S'inscrire",

                // Landing Page
                loading_experience: 'Chargement de l\'expérience premium...',
                hero_title: 'Découvrez le divertissement',
                hero_highlight: 'ultime',
                hero_subtitle: 'Des milliers de films, séries exclusives et contenu original en qualité 4K. Tout sur une seule plateforme premium.',
                hero_cta_register: 'Commencer l\'essai gratuit',
                hero_cta_login: 'J\'ai déjà un compte',

                // Continúa con más traducciones...
            }
        };
    }

    // Detectar idioma del usuario
    detectLanguage() {
        // Verificar localStorage primero
        const savedLang = localStorage.getItem('company-language');
        if (savedLang && this.translations[savedLang]) {
            this.currentLang = savedLang;
            return;
        }

        // Detectar del navegador
        const browserLang = navigator.language.substring(0, 2);
        if (this.translations[browserLang]) {
            this.currentLang = browserLang;
        } else {
            this.currentLang = this.fallbackLang;
        }
    }

    // Inicializar i18n
    init() {
        this.updateHTML();
        this.updateDocumentLang();
    }

    // Cambiar idioma
    setLanguage(lang) {
        if (!this.translations[lang]) {
            console.warn(`Language ${lang} not supported, falling back to ${this.fallbackLang}`);
            lang = this.fallbackLang;
        }

        this.currentLang = lang;
        localStorage.setItem('company-language', lang);
        this.updateHTML();
        this.updateDocumentLang();
        this.notifyObservers();
    }

    // Obtener traducción
    t(key, fallback = null) {
        const translation = this.translations[this.currentLang]?.[key] || 
                           this.translations[this.fallbackLang]?.[key] || 
                           fallback || 
                           key;
        return translation;
    }

    // Actualizar HTML
    updateHTML() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);

            // Actualizar texto o placeholder según el elemento
            if (element.tagName === 'INPUT' && element.type !== 'submit') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });

        // Actualizar título de la página
        const titleKey = document.querySelector('meta[name="i18n-title"]')?.content;
        if (titleKey) {
            document.title = this.t(titleKey);
        }
    }

    // Actualizar lang del documento
    updateDocumentLang() {
        document.documentElement.setAttribute('lang', this.currentLang);
        document.documentElement.setAttribute('data-lang', this.currentLang);
    }

    // Sistema de observadores para actualizaciones
    subscribe(callback) {
        this.observers.push(callback);
    }

    unsubscribe(callback) {
        this.observers = this.observers.filter(obs => obs !== callback);
    }

    notifyObservers() {
        this.observers.forEach(callback => callback(this.currentLang));
    }

    // Formatear números según idioma
    formatNumber(number) {
        return new Intl.NumberFormat(this.currentLang).format(number);
    }

    // Formatear fechas según idioma
    formatDate(date, options = {}) {
        return new Intl.DateTimeFormat(this.currentLang, options).format(date);
    }

    // Obtener idiomas disponibles
    getAvailableLanguages() {
        return Object.keys(this.translations).map(lang => ({
            code: lang,
            name: this.getLanguageName(lang),
            flag: this.getLanguageFlag(lang)
        }));
    }

    // Obtener nombre del idioma
    getLanguageName(lang) {
        const names = {
            es: 'Español',
            en: 'English',
            pt: 'Português',
            fr: 'Français'
        };
        return names[lang] || lang;
    }

    // Obtener emoji de bandera
    getLanguageFlag(lang) {
        const flags = {
            es: '🇪🇸',
            en: '🇺🇸',
            pt: '🇧🇷',
            fr: '🇫🇷'
        };
        return flags[lang] || '🌐';
    }

    // Obtener dirección del texto (RTL/LTR)
    getTextDirection(lang = this.currentLang) {
        const rtlLangs = ['ar', 'he', 'fa', 'ur'];
        return rtlLangs.includes(lang) ? 'rtl' : 'ltr';
    }
}

// Instancia global
window.i18n = new I18n();

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = I18n;
}