// Enhanced Sign & Approve Interaction System
class SignApproveEnhanced {
  constructor() {
    this.signBtn = document.getElementById('signApproveBtn');
    this.isSigned = false;
    this.isSigning = false;
    this.init();
  }

  init() {
    if (this.signBtn) {
      this.signBtn.addEventListener('click', () => this.handleSignApprove());
    }
  }

  handleSignApprove() {
    if (this.isSigned || this.isSigning) return;

    // Start signing process
    this.startSigning();
    
    // Simulate signing process
    setTimeout(() => {
      this.completeSigning();
    }, 1500);
  }

  startSigning() {
    this.isSigning = true;
    
    // Add signing state to button
    this.signBtn.classList.add('signing');
    this.signBtn.innerHTML = `
      <div class="signing-spinner"></div>
      <span class="btn-text">Signing...</span>
      <div class="signing-progress"></div>
    `;
    
    // Disable all editable fields
    this.lockFields();
    
    // Show signing notification
    this.showNotification('Signing document...', 'info');
  }

  completeSigning() {
    this.isSigning = false;
    this.isSigned = true;
    
    // Remove signing state
    this.signBtn.classList.remove('signing');
    this.signBtn.classList.add('success');
    
    // Change button to signed state
    setTimeout(() => {
      this.signBtn.classList.remove('success');
      this.signBtn.classList.add('signed');
      this.signBtn.innerHTML = 'Signed & Secured';
    }, 800);
    
    // Add immutable badge
    this.addImmutableBadge();
    
    // Show success notification
    this.showNotification('Document successfully signed and secured!', 'success');
    
    // Show document seal
    this.showDocumentSeal();
    
    // Update status
    this.updateStatus();
  }

  lockFields() {
    // Add locked state to main content
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.classList.add('locked-state');
    }
    
    // Disable all editable fields
    const editableFields = document.querySelectorAll('.section-content[contenteditable="true"], .transcript-textarea, .form-input, .form-textarea, .form-select');
    editableFields.forEach(field => {
      field.contentEditable = false;
      field.readOnly = true;
      field.disabled = true;
    });
  }

  addImmutableBadge() {
    // Check if badge already exists
    if (document.querySelector('.immutable-badge')) return;
    
    // Create immutable badge
    const badge = document.createElement('div');
    badge.className = 'immutable-badge';
    badge.innerHTML = 'Immutable Record';
    
    // Add to header or appropriate location
    const header = document.querySelector('.card-header') || document.querySelector('.navbar');
    if (header) {
      header.appendChild(badge);
    }
  }

  showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.success-notification');
    if (existing) {
      existing.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
      <span class="success-notification-text">${message}</span>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    
    // Hide notification after delay
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }, 3000);
  }

  showDocumentSeal() {
    // Remove existing seal
    const existing = document.querySelector('.document-seal');
    if (existing) {
      existing.remove();
    }
    
    // Create document seal
    const seal = document.createElement('div');
    seal.className = 'document-seal';
    
    // Add to page
    document.body.appendChild(seal);
    
    // Show seal
    setTimeout(() => {
      seal.classList.add('show');
    }, 100);
    
    // Remove seal after animation
    setTimeout(() => {
      if (seal.parentNode) {
        seal.remove();
      }
    }, 2000);
  }

  updateStatus() {
    // Update status text
    const statusText = document.querySelector('.status-text');
    if (statusText) {
      statusText.textContent = 'Document Signed';
      statusText.classList.add('signed');
    }
    
    // Update status dot
    const statusDot = document.querySelector('.status-dot');
    if (statusDot) {
      statusDot.classList.add('signed');
    }
  }

  // Reset method for testing
  reset() {
    this.isSigned = false;
    this.isSigning = false;
    
    // Reset button
    if (this.signBtn) {
      this.signBtn.classList.remove('signing', 'success', 'signed');
      this.signBtn.innerHTML = 'Sign & Approve';
    }
    
    // Remove locked state
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.classList.remove('locked-state');
    }
    
    // Re-enable fields
    const editableFields = document.querySelectorAll('.section-content, .transcript-textarea, .form-input, .form-textarea, .form-select');
    editableFields.forEach(field => {
      field.contentEditable = true;
      field.readOnly = false;
      field.disabled = false;
    });
    
    // Remove immutable badge
    const badge = document.querySelector('.immutable-badge');
    if (badge) {
      badge.remove();
    }
    
    // Reset status
    const statusText = document.querySelector('.status-text');
    if (statusText) {
      statusText.textContent = 'Ready to Sign';
      statusText.classList.remove('signed');
    }
    
    const statusDot = document.querySelector('.status-dot');
    if (statusDot) {
      statusDot.classList.remove('signed');
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.signApproveEnhanced = new SignApproveEnhanced();
  
  // Add reset method to window for testing
  window.resetSigning = () => {
    if (window.signApproveEnhanced) {
      window.signApproveEnhanced.reset();
    }
  };
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SignApproveEnhanced;
}
