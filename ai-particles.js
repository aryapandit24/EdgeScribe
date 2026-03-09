// AI Particles Generator - Dynamic Background Particles
class AIParticles {
  constructor() {
    this.container = null;
    this.particles = [];
    this.particleCount = 50;
    this.init();
  }

  init() {
    this.createContainer();
    this.generateParticles();
    this.startAnimation();
  }

  createContainer() {
    this.container = document.createElement('div');
    this.container.className = 'ai-particles';
    this.container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -1;
      overflow: hidden;
    `;
    document.body.appendChild(this.container);
  }

  generateParticles() {
    for (let i = 0; i < this.particleCount; i++) {
      this.createParticle(i);
    }
  }

  createParticle(index) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random properties
    const size = this.getRandomSize();
    const opacity = this.getRandomOpacity();
    const color = this.getRandomColor();
    const left = Math.random() * 100;
    const delay = Math.random() * 20;
    const duration = 18 + Math.random() * 12;
    const animation = this.getRandomAnimation();
    
    // Apply styles
    particle.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: 50%;
      left: ${left}%;
      opacity: ${opacity};
      animation: ${animation} ${duration}s linear infinite;
      animation-delay: ${delay}s;
      pointer-events: none;
    `;
    
    // Add glow effect to some particles
    if (Math.random() > 0.7) {
      particle.style.boxShadow = `0 0 ${Math.random() * 8 + 2}px rgba(255, 255, 255, ${Math.random() * 0.2})`;
    }
    
    this.container.appendChild(particle);
    this.particles.push(particle);
  }

  getRandomSize() {
    const sizes = [4, 6, 8, 10, 12, 14, 16];
    return sizes[Math.floor(Math.random() * sizes.length)];
  }

  getRandomOpacity() {
    return 0.02 + Math.random() * 0.08; // 0.02 to 0.10
  }

  getRandomColor() {
    const colors = [
      'rgba(255, 255, 255, 0.05)',
      'rgba(30, 94, 255, 0.08)',
      'rgba(46, 212, 122, 0.08)',
      'rgba(147, 51, 234, 0.06)',
      'rgba(6, 182, 212, 0.07)'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  getRandomAnimation() {
    const animations = ['moveUp', 'floatUp', 'driftUp'];
    return animations[Math.floor(Math.random() * animations.length)];
  }

  startAnimation() {
    // Add particle trails occasionally
    setInterval(() => {
      if (Math.random() > 0.8) {
        this.createTrail();
      }
    }, 3000);
    
    // Add particle bursts occasionally
    setInterval(() => {
      if (Math.random() > 0.9) {
        this.createBurst();
      }
    }, 5000);
  }

  createTrail() {
    const trail = document.createElement('div');
    trail.className = 'particle-trail';
    
    const left = Math.random() * 100;
    const duration = 15 + Math.random() * 10;
    
    trail.style.cssText = `
      position: absolute;
      width: 2px;
      height: 20px;
      background: linear-gradient(to top, rgba(255, 255, 255, 0.1), transparent);
      left: ${left}%;
      animation: trailMove ${duration}s linear infinite;
      pointer-events: none;
    `;
    
    this.container.appendChild(trail);
    
    // Remove trail after animation
    setTimeout(() => {
      if (trail.parentNode) {
        trail.remove();
      }
    }, duration * 1000);
  }

  createBurst() {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    
    for (let i = 0; i < 8; i++) {
      const burst = document.createElement('div');
      burst.className = 'particle-burst';
      
      const angle = (Math.PI * 2 * i) / 8;
      const distance = 50 + Math.random() * 50;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      
      burst.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        left: ${x}px;
        top: ${y}px;
        --tx: ${tx}px;
        --ty: ${ty}px;
        animation: burst 2s ease-out forwards;
        pointer-events: none;
      `;
      
      this.container.appendChild(burst);
      
      // Remove burst after animation
      setTimeout(() => {
        if (burst.parentNode) {
          burst.remove();
        }
      }, 2000);
    }
  }

  // Method to adjust particle density
  setDensity(level) {
    const body = document.body;
    body.className = body.className.replace(/particles-\w+/g, '');
    body.classList.add(`particles-${level}`);
  }

  // Method to pause/resume animations
  pause() {
    this.particles.forEach(particle => {
      particle.style.animationPlayState = 'paused';
    });
  }

  resume() {
    this.particles.forEach(particle => {
      particle.style.animationPlayState = 'running';
    });
  }

  // Method to destroy particles
  destroy() {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    this.particles = [];
  }

  // Method to regenerate particles
  regenerate() {
    this.destroy();
    this.init();
  }
}

// Initialize particles when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.aiParticles = new AIParticles();
  
  // Set initial density
  window.aiParticles.setDensity('medium');
  
  // Add keyboard controls for testing
  document.addEventListener('keydown', (e) => {
    if (e.key === 'p' && e.ctrlKey) {
      e.preventDefault();
      window.aiParticles.pause();
    } else if (e.key === 'r' && e.ctrlKey) {
      e.preventDefault();
      window.aiParticles.resume();
    } else if (e.key === 'd' && e.ctrlKey) {
      e.preventDefault();
      window.aiParticles.regenerate();
    }
  });
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AIParticles;
}
