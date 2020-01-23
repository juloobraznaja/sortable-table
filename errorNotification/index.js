export class ErrorNotification {
    constructor(message) {
      this.message = message;
      this.removeExisting();
      this.render();
    }
    
    removeExisting() {
      this.existingNotification = document.querySelector('.notification');
      if (this.existingNotification) this.existingNotification.remove();
      
    }
    
    render() {
      this.notification = document.createElement('div');
      this.notification.classList.add('notification');
      this.notification.classList.add('welcome');
      this.notification.innerHTML = this.message;

      document.body.append(this.notification);
      
      setTimeout(() => this.notification.remove(), 3000);
      
    }
    
  }