/**
 * Simple toast notification utility
 * Can be replaced with a library like react-toastify in the future
 */

class ToastManager {
  constructor() {
    this.toasts = [];
    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify(listener) {
    this.listeners.forEach(l => l(this.toasts));
  }

  show(message, type = 'info', duration = 3000) {
    const id = Date.now();
    const toast = { id, message, type, duration };
    
    this.toasts.push(toast);
    this.notify();
    
    setTimeout(() => {
      this.remove(id);
    }, duration);
    
    return id;
  }

  remove(id) {
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.notify();
  }

  success(message, duration) {
    return this.show(message, 'success', duration);
  }

  error(message, duration) {
    return this.show(message, 'error', duration || 5000);
  }

  warning(message, duration) {
    return this.show(message, 'warning', duration);
  }

  info(message, duration) {
    return this.show(message, 'info', duration);
  }
}

export const toast = new ToastManager();
