/* =====================================================
   COMPANY+ PREMIUM - COMPONENTES MODULARES
   Sistema de componentes reutilizables
   ===================================================== */

class ComponentManager {
    constructor() {
        this.components = new Map();
        this.instances = new Map();
        this.init();
    }

    init() {
        this.registerComponents();
    }

    // Registrar todos los componentes
    registerComponents() {
        this.register('NotificationSystem', NotificationSystem);
        this.register('ParticleSystem', ParticleSystem);
        this.register('FormValidator', FormValidator);
        this.register('Modal', Modal);
        this.register('Carousel', Carousel);
        this.register('SearchComponent', SearchComponent);
        this.register('UserProfileManager', UserProfileManager);
    }

    // Registrar componente
    register(name, componentClass) {
        this.components.set(name, componentClass);
    }

    // Crear instancia de componente
    create(name, options = {}) {
        const ComponentClass = this.components.get(name);
        if (!ComponentClass) {
            console.error(`Component ${name} not found`);
            return null;
        }

        const instance = new ComponentClass(options);
        const instanceId = `${name}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        this.instances.set(instanceId, instance);

        return { instance, id: instanceId };
    }

    // Destruir instancia
    destroy(instanceId) {
        const instance = this.instances.get(instanceId);
        if (instance && typeof instance.destroy === 'function') {
            instance.destroy();
        }
        this.instances.delete(instanceId);
    }
}

// =====================================================
// SISTEMA DE NOTIFICACIONES
// =====================================================
class NotificationSystem {
    constructor(options = {}) {
        this.container = null;
        this.notifications = [];
        this.maxVisible = options.maxVisible || 3;
        this.defaultTimeout = options.timeout || 5000;
        this.position = options.position || 'top-right';

        this.init();
    }

    init() {
        this.createContainer();
        this.bindEvents();
    }

    createContainer() {
        this.container = document.getElementById('notificationContainer');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'notificationContainer';
            this.container.className = `notification-container position-${this.position}`;
            this.container.setAttribute('aria-live', 'polite');
            document.body.appendChild(this.container);
        }
    }

    show(message, type = 'info', timeout = this.defaultTimeout) {
        const notification = this.createNotification(message, type, timeout);
        this.addToContainer(notification);
        this.manageVisible();

        // Auto remove
        if (timeout > 0) {
            setTimeout(() => this.remove(notification.id), timeout);
        }

        return notification.id;
    }

    createNotification(message, type, timeout) {
        const id = `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const notification = document.createElement('div');
        notification.id = id;
        notification.className = `notification ${type}`;
        notification.setAttribute('role', 'alert');

        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">
                    <i class="fas ${this.getIcon(type)}" aria-hidden="true"></i>
                </div>
                <div class="notification-message">${message}</div>
                <button class="notification-close" aria-label="${i18n.t('close', 'Cerrar')}" title="${i18n.t('close', 'Cerrar')}">
                    <i class="fas fa-times" aria-hidden="true"></i>
                </button>
            </div>
            ${timeout > 0 ? `<div class="notification-progress"><div class="progress-bar" style="animation-duration: ${timeout}ms;"></div></div>` : ''}
        `;

        // Bind close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.remove(id);
        });

        return { element: notification, id, type, timeout };
    }

    getIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    addToContainer(notification) {
        this.notifications.push(notification);
        this.container.appendChild(notification.element);

        // Trigger animation
        requestAnimationFrame(() => {
            notification.element.classList.add('show');
        });
    }

    remove(id) {
        const index = this.notifications.findIndex(n => n.id === id);
        if (index === -1) return;

        const notification = this.notifications[index];
        notification.element.classList.add('removing');

        setTimeout(() => {
            if (notification.element.parentNode) {
                notification.element.parentNode.removeChild(notification.element);
            }
            this.notifications.splice(index, 1);
        }, 300);
    }

    manageVisible() {
        if (this.notifications.length > this.maxVisible) {
            const toRemove = this.notifications.slice(0, this.notifications.length - this.maxVisible);
            toRemove.forEach(notification => this.remove(notification.id));
        }
    }

    clear() {
        this.notifications.forEach(notification => this.remove(notification.id));
    }

    bindEvents() {
        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.clear();
            }
        });
    }

    destroy() {
        this.clear();
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}

// =====================================================
// SISTEMA DE PARTÍCULAS
// =====================================================
class ParticleSystem {
    constructor(options = {}) {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.animationId = null;
        this.isActive = false;

        this.config = {
            count: options.count || CONFIG.particles.count || 50,
            minSize: options.minSize || CONFIG.particles.size.min || 1,
            maxSize: options.maxSize || CONFIG.particles.size.max || 4,
            minSpeed: options.minSpeed || CONFIG.particles.speed.min || 0.5,
            maxSpeed: options.maxSpeed || CONFIG.particles.speed.max || 2,
            colors: options.colors || CONFIG.particles.colors || ['#0a97f7'],
            opacity: options.opacity || CONFIG.particles.opacity || { min: 0.3, max: 0.7 }
        };

        this.init();
    }

    init() {
        this.createCanvas();
        this.createParticles();
        this.bindEvents();
    }

    createCanvas() {
        this.canvas = document.getElementById('particlesCanvas');
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'particlesCanvas';
            this.canvas.setAttribute('aria-hidden', 'true');

            const container = document.getElementById('particlesBg');
            if (container) {
                container.appendChild(this.canvas);
            }
        }

        this.ctx = this.canvas.getContext('2d');
        this.resize();
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.config.count; i++) {
            this.particles.push(this.createParticle());
        }
    }

    createParticle() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            size: Math.random() * (this.config.maxSize - this.config.minSize) + this.config.minSize,
            speedX: (Math.random() - 0.5) * (this.config.maxSpeed - this.config.minSpeed) + this.config.minSpeed,
            speedY: (Math.random() - 0.5) * (this.config.maxSpeed - this.config.minSpeed) + this.config.minSpeed,
            color: this.config.colors[Math.floor(Math.random() * this.config.colors.length)],
            opacity: Math.random() * (this.config.opacity.max - this.config.opacity.min) + this.config.opacity.min,
            life: Math.random() * 100
        };
    }

    update() {
        this.particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            particle.life += 1;

            // Wrap around edges
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;

            // Pulse effect
            particle.opacity = (this.config.opacity.min + this.config.opacity.max) / 2 + 
                             Math.sin(particle.life * 0.02) * (this.config.opacity.max - this.config.opacity.min) / 2;
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
    }

    animate() {
        if (!this.isActive) return;

        this.update();
        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    start() {
        if (this.isActive) return;
        this.isActive = true;
        this.animate();
    }

    stop() {
        this.isActive = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;

        // Recreate particles with new dimensions
        if (this.particles.length > 0) {
            this.createParticles();
        }
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resize());

        // Pause on tab change for performance
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stop();
            } else {
                this.start();
            }
        });
    }

    destroy() {
        this.stop();
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// =====================================================
// VALIDADOR DE FORMULARIOS
// =====================================================
class FormValidator {
    constructor(formElement, options = {}) {
        this.form = formElement;
        this.fields = new Map();
        this.errors = new Map();
        this.config = {
            realTime: options.realTime !== false,
            showIcons: options.showIcons !== false,
            highlightErrors: options.highlightErrors !== false,
            ...options
        };

        this.init();
    }

    init() {
        this.bindEvents();
        this.setupFields();
    }

    setupFields() {
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            this.registerField(input);
        });
    }

    registerField(field) {
        const rules = this.getValidationRules(field);
        this.fields.set(field, rules);

        if (this.config.realTime) {
            this.bindFieldEvents(field);
        }
    }

    getValidationRules(field) {
        const rules = [];

        // Required
        if (field.required || field.hasAttribute('data-required')) {
            rules.push({ type: 'required', message: i18n.t('validation_required', 'Este campo es obligatorio') });
        }

        // Email
        if (field.type === 'email') {
            rules.push({ 
                type: 'email', 
                message: i18n.t('validation_email', 'Ingresa un email válido'),
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            });
        }

        // Min/Max length
        if (field.minLength) {
            rules.push({ 
                type: 'minLength', 
                value: field.minLength, 
                message: i18n.t('validation_min_length', `Mínimo ${field.minLength} caracteres`)
            });
        }

        if (field.maxLength) {
            rules.push({ 
                type: 'maxLength', 
                value: field.maxLength, 
                message: i18n.t('validation_max_length', `Máximo ${field.maxLength} caracteres`)
            });
        }

        // Password confirmation
        const confirmTarget = field.getAttribute('data-confirm');
        if (confirmTarget) {
            rules.push({ 
                type: 'confirm', 
                target: confirmTarget, 
                message: i18n.t('validation_password_match', 'Las contraseñas no coinciden')
            });
        }

        return rules;
    }

    bindFieldEvents(field) {
        const events = ['blur', 'input'];
        events.forEach(event => {
            field.addEventListener(event, () => {
                this.validateField(field);
            });
        });
    }

    validateField(field) {
        const rules = this.fields.get(field);
        const errors = [];

        rules.forEach(rule => {
            const error = this.applyRule(field, rule);
            if (error) errors.push(error);
        });

        this.updateFieldUI(field, errors);

        if (errors.length > 0) {
            this.errors.set(field, errors);
        } else {
            this.errors.delete(field);
        }

        return errors.length === 0;
    }

    applyRule(field, rule) {
        const value = field.value.trim();

        switch (rule.type) {
            case 'required':
                return !value ? rule.message : null;

            case 'email':
                return value && !rule.pattern.test(value) ? rule.message : null;

            case 'minLength':
                return value && value.length < rule.value ? rule.message : null;

            case 'maxLength':
                return value && value.length > rule.value ? rule.message : null;

            case 'confirm':
                const targetField = this.form.querySelector(`[name="${rule.target}"]`);
                return targetField && value !== targetField.value ? rule.message : null;

            default:
                return null;
        }
    }

    updateFieldUI(field, errors) {
        const container = field.closest('.form-group') || field.parentElement;

        // Remove previous states
        container.classList.remove('has-error', 'has-success');

        // Remove previous error messages
        const existingError = container.querySelector('.field-error');
        if (existingError) existingError.remove();

        if (errors.length > 0) {
            container.classList.add('has-error');

            if (this.config.highlightErrors) {
                const errorEl = document.createElement('div');
                errorEl.className = 'field-error';
                errorEl.textContent = errors[0];
                errorEl.setAttribute('role', 'alert');
                container.appendChild(errorEl);
            }
        } else if (field.value.trim()) {
            container.classList.add('has-success');
        }
    }

    validate() {
        let isValid = true;

        this.fields.forEach((rules, field) => {
            const fieldValid = this.validateField(field);
            if (!fieldValid) isValid = false;
        });

        return {
            isValid,
            errors: Object.fromEntries(this.errors)
        };
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => {
            const validation = this.validate();
            if (!validation.isValid) {
                e.preventDefault();

                // Focus first error field
                const firstErrorField = this.errors.keys().next().value;
                if (firstErrorField) {
                    firstErrorField.focus();
                }
            }
        });
    }
}

// =====================================================
// MANAGER DE PERFILES DE USUARIO
// =====================================================
class UserProfileManager {
    constructor() {
        this.profiles = this.loadProfiles();
        this.currentProfile = null;
        this.init();
    }

    init() {
        this.bindEvents();
    }

    loadProfiles() {
        const stored = localStorage.getItem('company_profiles');
        return stored ? JSON.parse(stored) : this.getDefaultProfiles();
    }

    getDefaultProfiles() {
        return [
            {
                id: 'profile_1',
                name: 'Usuario Principal',
                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
                isKid: false,
                preferences: {
                    language: 'es',
                    maturityLevel: 'adult',
                    autoPlay: true
                },
                watchHistory: [],
                favorites: []
            },
            {
                id: 'profile_2', 
                name: 'Niños',
                avatar: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=150&h=150&fit=crop&crop=face',
                isKid: true,
                preferences: {
                    language: 'es',
                    maturityLevel: 'kids',
                    autoPlay: false
                },
                watchHistory: [],
                favorites: []
            }
        ];
    }

    saveProfiles() {
        localStorage.setItem('company_profiles', JSON.stringify(this.profiles));
    }

    selectProfile(profileId) {
        const profile = this.profiles.find(p => p.id === profileId);
        if (profile) {
            this.currentProfile = profile;
            localStorage.setItem('company_current_profile', profileId);

            // Apply profile preferences
            this.applyProfilePreferences(profile);

            return profile;
        }
        return null;
    }

    applyProfilePreferences(profile) {
        // Apply language preference
        if (profile.preferences.language && window.i18n) {
            window.i18n.setLanguage(profile.preferences.language);
        }

        // Apply other preferences...
    }

    createProfile(profileData) {
        const newProfile = {
            id: `profile_${Date.now()}`,
            name: profileData.name,
            avatar: profileData.avatar || this.getRandomAvatar(),
            isKid: profileData.isKid || false,
            preferences: {
                language: 'es',
                maturityLevel: profileData.isKid ? 'kids' : 'adult',
                autoPlay: true,
                ...profileData.preferences
            },
            watchHistory: [],
            favorites: []
        };

        this.profiles.push(newProfile);
        this.saveProfiles();

        return newProfile;
    }

    updateProfile(profileId, updates) {
        const profile = this.profiles.find(p => p.id === profileId);
        if (profile) {
            Object.assign(profile, updates);
            this.saveProfiles();
            return profile;
        }
        return null;
    }

    deleteProfile(profileId) {
        const index = this.profiles.findIndex(p => p.id === profileId);
        if (index > -1 && this.profiles.length > 1) { // Keep at least one profile
            this.profiles.splice(index, 1);
            this.saveProfiles();
            return true;
        }
        return false;
    }

    getRandomAvatar() {
        const avatars = [
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1494790108755-2616b612b76c?w=150&h=150&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
        ];
        return avatars[Math.floor(Math.random() * avatars.length)];
    }

    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.profile-card[data-profile]')) {
                const profileId = e.target.closest('.profile-card').getAttribute('data-profile');
                this.selectProfile(profileId);
            }
        });
    }

    getCurrentProfile() {
        return this.currentProfile;
    }

    getProfiles() {
        return this.profiles;
    }
}

// Instanciar manager global de componentes
window.componentManager = new ComponentManager();

// Instanciar componentes globales
window.notifications = componentManager.create('NotificationSystem').instance;
window.userProfiles = componentManager.create('UserProfileManager').instance;

// Exportar para módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        ComponentManager, 
        NotificationSystem, 
        ParticleSystem, 
        FormValidator,
        UserProfileManager
    };
}