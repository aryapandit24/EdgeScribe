// Medical Web App JavaScript
class MediCareApp {
  constructor() {
    this.init();
    this.setupEventListeners();
    this.setupAnimations();
  }

  init() {
    console.log('MediCare App initialized');
    this.checkPrivacyStatus();
    this.loadUserData();
    this.initializeAnimations();
  }

  setupEventListeners() {
    // Navigation items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => this.handleNavigation(e));
    });

    // Quick action cards
    const actionCards = document.querySelectorAll('.action-card');
    actionCards.forEach(card => {
      card.addEventListener('click', (e) => this.handleQuickAction(e));
    });

    // View all buttons
    const viewAllBtns = document.querySelectorAll('.view-all-btn');
    viewAllBtns.forEach(btn => {
      btn.addEventListener('click', (e) => this.handleViewAll(e));
    });

    // Privacy settings button
    const privacyBtn = document.querySelector('.privacy-settings-btn');
    if (privacyBtn) {
      privacyBtn.addEventListener('click', () => this.showPrivacySettings());
    }

    // Notification button
    const notificationBtn = document.querySelector('.notification-btn');
    if (notificationBtn) {
      notificationBtn.addEventListener('click', () => this.showNotifications());
    }

    // User avatar
    const userAvatar = document.querySelector('.user-avatar img');
    if (userAvatar) {
      userAvatar.addEventListener('click', () => this.showUserProfile());
    }

    // Appointment items
    const appointmentItems = document.querySelectorAll('.appointment-item');
    appointmentItems.forEach(item => {
      item.addEventListener('click', (e) => this.handleAppointmentClick(e));
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => this.handleKeyboardNavigation(e));

    // Window resize for responsive adjustments
    window.addEventListener('resize', () => this.handleResize());
  }

  setupAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observe cards for animation
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => observer.observe(card));

    // Observe action cards
    const actionCards = document.querySelectorAll('.action-card');
    actionCards.forEach(card => observer.observe(card));
  }

  handleNavigation(e) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    e.target.classList.add('active');

    // Simulate navigation
    const section = e.target.textContent.toLowerCase();
    this.showNotification(`Navigating to ${section}`, 'info');
    
    // In a real app, this would load different content
    this.updatePageContent(section);
  }

  handleQuickAction(e) {
    const actionCard = e.currentTarget;
    const actionLabel = actionCard.querySelector('.action-label').textContent;
    
    // Add click animation
    actionCard.style.transform = 'scale(0.95)';
    setTimeout(() => {
      actionCard.style.transform = '';
    }, 100);

    this.showNotification(`${actionLabel} action triggered`, 'success');
    
    // Handle specific actions
    switch(actionLabel) {
      case 'Book Appointment':
        this.openAppointmentBooking();
        break;
      case 'View Schedule':
        this.viewSchedule();
        break;
      case 'Medical Records':
        this.viewMedicalRecords();
        break;
      case 'Upload Document':
        this.uploadDocument();
        break;
    }
  }

  handleViewAll(e) {
    e.stopPropagation();
    const cardHeader = e.target.closest('.card-header');
    const sectionTitle = cardHeader.querySelector('h3').textContent;
    
    this.showNotification(`Viewing all ${sectionTitle.toLowerCase()}`, 'info');
  }

  handleAppointmentClick(e) {
    const appointmentItem = e.currentTarget;
    const doctorName = appointmentItem.querySelector('h4').textContent;
    const appointmentType = appointmentItem.querySelector('.type-badge').textContent;
    
    this.showNotification(`Opening appointment with ${doctorName}`, 'info');
  }

  handleKeyboardNavigation(e) {
    // Alt + N for notifications
    if (e.altKey && e.key === 'n') {
      e.preventDefault();
      this.showNotifications();
    }
    
    // Alt + P for privacy settings
    if (e.altKey && e.key === 'p') {
      e.preventDefault();
      this.showPrivacySettings();
    }
    
    // Alt + U for user profile
    if (e.altKey && e.key === 'u') {
      e.preventDefault();
      this.showUserProfile();
    }
  }

  handleResize() {
    // Handle responsive adjustments
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      this.adjustForMobile();
    } else {
      this.adjustForDesktop();
    }
  }

  // Action Methods
  openAppointmentBooking() {
    console.log('Opening appointment booking modal');
    // In a real app, this would open a modal
    this.showNotification('Appointment booking coming soon!', 'info');
  }

  viewSchedule() {
    console.log('Viewing schedule');
    this.showNotification('Loading your schedule...', 'info');
  }

  viewMedicalRecords() {
    console.log('Viewing medical records');
    this.showNotification('Accessing secure medical records...', 'info');
  }

  uploadDocument() {
    console.log('Opening document upload');
    // Create file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx';
    fileInput.onchange = (e) => this.handleFileUpload(e.target.files[0]);
    fileInput.click();
  }

  handleFileUpload(file) {
    if (file) {
      this.showNotification(`Uploading ${file.name}...`, 'info');
      
      // Simulate upload progress
      setTimeout(() => {
        this.showNotification(`${file.name} uploaded successfully!`, 'success');
        this.updateActivityList('Document uploaded');
      }, 2000);
    }
  }

  showNotifications() {
    const notifications = [
      { title: 'Lab Results Ready', message: 'Your blood test results are available', time: '2 hours ago', type: 'info' },
      { title: 'Appointment Reminder', message: 'Checkup with Dr. Johnson tomorrow at 10 AM', time: '5 hours ago', type: 'reminder' },
      { title: 'Privacy Update', message: 'New privacy features have been added', time: '1 day ago', type: 'update' }
    ];
    
    console.log('Notifications:', notifications);
    this.showNotification('You have 3 new notifications', 'info');
  }

  showPrivacySettings() {
    console.log('Opening privacy settings');
    this.showNotification('Privacy settings panel coming soon!', 'info');
  }

  showUserProfile() {
    console.log('Opening user profile');
    this.showNotification('User profile coming soon!', 'info');
  }

  // Utility Methods
  showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification-toast');
    if (existingNotification) {
      existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification-toast ${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-message">${message}</span>
        <button class="notification-close">&times;</button>
      </div>
    `;

    // Add styles
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? 'var(--color-accent-green)' : type === 'error' ? '#ff4757' : 'var(--color-primary)'};
      color: white;
      padding: 16px 20px;
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-lg);
      z-index: 1000;
      min-width: 300px;
      animation: slideIn 0.3s ease;
      backdrop-filter: blur(10px);
    `;

    // Add to page
    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);

    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
      background: none;
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
      margin-left: auto;
    `;
    closeBtn.addEventListener('click', () => notification.remove());
  }

  updatePageContent(section) {
    // Simulate content loading
    const mainContent = document.querySelector('.main-content');
    mainContent.style.opacity = '0.5';
    
    setTimeout(() => {
      mainContent.style.opacity = '1';
      // In a real app, this would load different content based on section
    }, 300);
  }

  updateActivityList(activity) {
    const activityList = document.querySelector('.activity-list');
    if (activityList) {
      const newActivity = document.createElement('div');
      newActivity.className = 'activity-item';
      newActivity.innerHTML = `
        <div class="activity-icon completed">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M13.5 4.5L6 12L2.5 8.5" stroke="#2ED47A" stroke-width="2"/>
          </svg>
        </div>
        <div class="activity-content">
          <p>${activity}</p>
          <span class="activity-time">Just now</span>
        </div>
      `;
      
      activityList.insertBefore(newActivity, activityList.firstChild);
      
      // Remove last activity if too many
      const activities = activityList.querySelectorAll('.activity-item');
      if (activities.length > 3) {
        activities[activities.length - 1].remove();
      }
    }
  }

  checkPrivacyStatus() {
    // Simulate privacy check
    console.log('Checking privacy status...');
    setTimeout(() => {
      console.log('Privacy status: All secure');
    }, 1000);
  }

  loadUserData() {
    // Simulate loading user data
    console.log('Loading user data...');
    setTimeout(() => {
      console.log('User data loaded successfully');
    }, 800);
  }

  initializeAnimations() {
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
      
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .animate-in {
        animation: fadeInUp 0.6s ease forwards;
      }
    `;
    document.head.appendChild(style);
  }

  adjustForMobile() {
    console.log('Adjusting for mobile view');
    // Add mobile-specific adjustments
  }

  adjustForDesktop() {
    console.log('Adjusting for desktop view');
    // Add desktop-specific adjustments
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new MediCareApp();
});

// Add some utility functions
const Utils = {
  formatDate: (date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  },

  formatTime: (date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  },

  debounce: (func, wait) => {
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
};

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MediCareApp, Utils };
}
