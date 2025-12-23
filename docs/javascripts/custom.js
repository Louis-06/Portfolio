// ========================================
// Fonction pour agrandir/réduire le tableau en plein écran
// ========================================
function toggleTableSize() {
  const tableWrapper = document.getElementById('tableWrapper');
  const btn = document.getElementById('expandBtn');
  const body = document.body;
  
  if (tableWrapper && btn) {
    tableWrapper.classList.toggle('fullscreen');
    body.classList.toggle('fullscreen-active');
    
    // Créer ou supprimer l'overlay
    let overlay = document.querySelector('.fullscreen-overlay');
    
    if (tableWrapper.classList.contains('fullscreen')) {
      // Mode plein écran activé
      btn.innerHTML = '✕ Fermer';
      btn.classList.add('fullscreen-close', 'visible');
      
      // Créer l'overlay si n'existe pas
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'fullscreen-overlay';
        document.body.appendChild(overlay);
      }
      overlay.classList.add('active');
      
      // Fermer avec Echap
      document.addEventListener('keydown', closeOnEscape);
      
      // Fermer en cliquant sur l'overlay
      overlay.addEventListener('click', toggleTableSize);
    } else {
      // Mode normal
      btn.innerHTML = '⛶ Agrandir';
      btn.classList.remove('fullscreen-close', 'visible');
      
      if (overlay) {
        overlay.classList.remove('active');
      }
      
      document.removeEventListener('keydown', closeOnEscape);
    }
  }
}

// Fonction pour fermer avec la touche Echap
function closeOnEscape(e) {
  if (e.key === 'Escape') {
    const tableWrapper = document.getElementById('tableWrapper');
    if (tableWrapper && tableWrapper.classList.contains('fullscreen')) {
      toggleTableSize();
    }
  }
}

// ========================================
// Fonction pour filtrer les certifications
// ========================================
function filterCerts(category) {
  const cards = document.querySelectorAll('.cert-card');
  const buttons = document.querySelectorAll('.filter-btn');
  
  // Mettre à jour les boutons actifs
  buttons.forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  
  // Filtrer les cartes
  cards.forEach(card => {
    if (category === 'all') {
      card.classList.remove('hidden');
    } else {
      if (card.dataset.category === category) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    }
  });
}

// ========================================
// Animation au scroll (optionnel)
// ========================================
document.addEventListener('DOMContentLoaded', function() {
  // Observer pour les animations au scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Observer les cartes de compétences et certifications
  document.querySelectorAll('.skill-card, .cert-card, .stat-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
  });
});

// ========================================
// Compte à rebours pour les statistiques
// ========================================
function animateValue(element, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    element.textContent = Math.floor(progress * (end - start) + start);
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

// Animer les chiffres des statistiques quand ils sont visibles
document.addEventListener('DOMContentLoaded', function() {
  const statNumbers = document.querySelectorAll('.stat-number');
  
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const value = parseInt(entry.target.textContent);
        entry.target.textContent = '0';
        animateValue(entry.target, 0, value, 1500);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  statNumbers.forEach(stat => statObserver.observe(stat));
});

// ========================================
// Particules animées violettes en arrière-plan
// ========================================
class Particle {
  constructor(canvas) {
    this.canvas = canvas;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 3 + 1;
    this.speedX = Math.random() * 0.5 - 0.25;
    this.speedY = Math.random() * 0.5 - 0.25;
    this.opacity = Math.random() * 0.5 + 0.2;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    // Rebond sur les bords
    if (this.x > this.canvas.width || this.x < 0) {
      this.speedX *= -1;
    }
    if (this.y > this.canvas.height || this.y < 0) {
      this.speedY *= -1;
    }
  }

  draw(ctx) {
    ctx.fillStyle = `rgba(124, 58, 237, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

class ParticleSystem {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'particles-canvas';
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '1';
    this.canvas.style.opacity = '0.6';
    
    document.body.insertBefore(this.canvas, document.body.firstChild);
    
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.numberOfParticles = 50; // Nombre modéré de particules
    
    this.resize();
    this.init();
    this.animate();
    
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  init() {
    this.particles = [];
    for (let i = 0; i < this.numberOfParticles; i++) {
      this.particles.push(new Particle(this.canvas));
    }
  }

  connectParticles() {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 120) {
          const opacity = (1 - distance / 120) * 0.2;
          this.ctx.strokeStyle = `rgba(124, 58, 237, ${opacity})`;
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach(particle => {
      particle.update();
      particle.draw(this.ctx);
    });
    
    this.connectParticles();
    
    requestAnimationFrame(() => this.animate());
  }
}

// Initialiser les particules au chargement
document.addEventListener('DOMContentLoaded', () => {
  new ParticleSystem();
});

// ========================================
// Scroll Reveal - Animations au défilement
// ========================================
class ScrollReveal {
  constructor() {
    this.elements = [];
    this.init();
    window.addEventListener('scroll', () => this.checkElements());
    window.addEventListener('resize', () => this.checkElements());
  }

  init() {
    // Sélectionner tous les éléments à animer
    const selectors = [
      '.skill-card',
      '.cert-card',
      '.stat-card',
      '.hero-section',
      '.competences-table-wrapper',
      '.md-typeset h2',
      '.md-typeset h3'
    ];

    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        if (!el.classList.contains('revealed')) {
          el.style.opacity = '0';
          el.style.transform = 'translateY(30px)';
          el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
          this.elements.push(el);
        }
      });
    });

    // Vérifier immédiatement les éléments visibles
    this.checkElements();
  }

  checkElements() {
    this.elements.forEach((el, index) => {
      if (this.isInViewport(el)) {
        setTimeout(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          el.classList.add('revealed');
        }, index * 50); // Délai progressif
      }
    });

    // Nettoyer les éléments déjà révélés
    this.elements = this.elements.filter(el => !el.classList.contains('revealed'));
  }

  isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top < (window.innerHeight || document.documentElement.clientHeight) * 0.85 &&
      rect.bottom > 0
    );
  }
}

// ========================================
// Effet Parallax
// ========================================
class Parallax {
  constructor() {
    this.elements = [];
    this.init();
    window.addEventListener('scroll', () => this.update());
  }

  init() {
    // Ajouter des classes parallax à certains éléments
    document.querySelectorAll('.hero-section, .stats-grid').forEach(el => {
      this.elements.push({
        element: el,
        speed: 0.3
      });
    });
  }

  update() {
    const scrollY = window.pageYOffset;
    
    this.elements.forEach(({ element, speed }) => {
      const elementTop = element.offsetTop;
      const elementHeight = element.offsetHeight;
      const windowHeight = window.innerHeight;
      
      // Calculer si l'élément est visible
      if (scrollY + windowHeight > elementTop && scrollY < elementTop + elementHeight) {
        const offset = (scrollY - elementTop) * speed;
        element.style.transform = `translateY(${offset}px)`;
      }
    });
  }
}

// Initialiser au chargement
document.addEventListener('DOMContentLoaded', () => {
  new ScrollReveal();
  new Parallax();
});

// ========================================
// Code Konami + Jeu Snake
// ========================================

class KonamiCode {
  constructor(callback) {
    this.pattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    this.current = 0;
    this.callback = callback;
    
    document.addEventListener('keydown', (e) => this.handleKey(e));
  }

  handleKey(e) {
    const key = e.key.toLowerCase();
    
    if (key === this.pattern[this.current] || e.code === this.pattern[this.current]) {
      this.current++;
      
      if (this.current === this.pattern.length) {
        this.callback();
        this.current = 0;
      }
    } else {
      this.current = 0;
    }
  }
}

class SnakeGame {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.snake = [];
    this.food = {};
    this.direction = 'right';
    this.nextDirection = 'right';
    this.score = 0;
    this.gameLoop = null;
    this.gridSize = 20;
    this.tileCount = 25;
  }

  init() {
    // Créer l'overlay
    const overlay = document.createElement('div');
    overlay.id = 'snake-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.95);
      z-index: 99999;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.3s ease;
    `;

    // Titre
    const title = document.createElement('h2');
    title.textContent = 'SNAKE GAME';
    title.style.cssText = `
      color: #7c3aed;
      font-size: 2.5rem;
      margin-bottom: 1rem;
      text-shadow: 0 0 20px rgba(124, 58, 237, 0.8);
    `;
    overlay.appendChild(title);

    // Score
    const scoreDisplay = document.createElement('div');
    scoreDisplay.id = 'snake-score';
    scoreDisplay.textContent = 'Score: 0';
    scoreDisplay.style.cssText = `
      color: white;
      font-size: 1.5rem;
      margin-bottom: 1rem;
    `;
    overlay.appendChild(scoreDisplay);

    // Canvas
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.gridSize * this.tileCount;
    this.canvas.height = this.gridSize * this.tileCount;
    this.canvas.style.cssText = `
      border: 3px solid #7c3aed;
      border-radius: 8px;
      box-shadow: 0 0 30px rgba(124, 58, 237, 0.6);
    `;
    overlay.appendChild(this.canvas);

    // Instructions
    const instructions = document.createElement('div');
    instructions.innerHTML = `
      <p style="color: white; margin-top: 1rem; text-align: center;">
        Utilisez les flèches ← ↑ → ↓ pour jouer<br>
        <button id="close-snake" style="
          margin-top: 1rem;
          padding: 0.8rem 2rem;
          background: #7c3aed;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        ">Fermer (Echap)</button>
      </p>
    `;
    overlay.appendChild(instructions);

    document.body.appendChild(overlay);

    this.ctx = this.canvas.getContext('2d');

    // Event listeners
    document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    document.getElementById('close-snake').addEventListener('click', () => this.close());

    // Initialiser le jeu
    this.reset();
    this.gameLoop = setInterval(() => this.update(), 100);
  }

  reset() {
    this.snake = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 }
    ];
    this.direction = 'right';
    this.nextDirection = 'right';
    this.score = 0;
    this.spawnFood();
  }

  spawnFood() {
    this.food = {
      x: Math.floor(Math.random() * this.tileCount),
      y: Math.floor(Math.random() * this.tileCount)
    };
    
    // Vérifier que la nourriture n'est pas sur le serpent
    for (let segment of this.snake) {
      if (segment.x === this.food.x && segment.y === this.food.y) {
        this.spawnFood();
        return;
      }
    }
  }

  handleKeyPress(e) {
    if (e.key === 'Escape') {
      this.close();
      return;
    }

    switch(e.key) {
      case 'ArrowUp':
        if (this.direction !== 'down') this.nextDirection = 'up';
        e.preventDefault();
        break;
      case 'ArrowDown':
        if (this.direction !== 'up') this.nextDirection = 'down';
        e.preventDefault();
        break;
      case 'ArrowLeft':
        if (this.direction !== 'right') this.nextDirection = 'left';
        e.preventDefault();
        break;
      case 'ArrowRight':
        if (this.direction !== 'left') this.nextDirection = 'right';
        e.preventDefault();
        break;
    }
  }

  update() {
    this.direction = this.nextDirection;

    // Nouvelle position de la tête
    const head = { ...this.snake[0] };
    
    switch(this.direction) {
      case 'up': head.y--; break;
      case 'down': head.y++; break;
      case 'left': head.x--; break;
      case 'right': head.x++; break;
    }

    // Collision avec les murs
    if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount) {
      this.gameOver();
      return;
    }

    // Collision avec soi-même
    for (let segment of this.snake) {
      if (segment.x === head.x && segment.y === head.y) {
        this.gameOver();
        return;
      }
    }

    this.snake.unshift(head);

    // Manger la nourriture
    if (head.x === this.food.x && head.y === this.food.y) {
      this.score += 10;
      document.getElementById('snake-score').textContent = `Score: ${this.score}`;
      this.spawnFood();
    } else {
      this.snake.pop();
    }

    this.draw();
  }

  draw() {
    // Fond
    this.ctx.fillStyle = '#1a1a2e';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Grille
    this.ctx.strokeStyle = 'rgba(124, 58, 237, 0.1)';
    for (let i = 0; i <= this.tileCount; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(i * this.gridSize, 0);
      this.ctx.lineTo(i * this.gridSize, this.canvas.height);
      this.ctx.stroke();
      
      this.ctx.beginPath();
      this.ctx.moveTo(0, i * this.gridSize);
      this.ctx.lineTo(this.canvas.width, i * this.gridSize);
      this.ctx.stroke();
    }

    // Serpent
    this.snake.forEach((segment, index) => {
      const gradient = this.ctx.createLinearGradient(
        segment.x * this.gridSize,
        segment.y * this.gridSize,
        (segment.x + 1) * this.gridSize,
        (segment.y + 1) * this.gridSize
      );
      
      if (index === 0) {
        gradient.addColorStop(0, '#a78bfa');
        gradient.addColorStop(1, '#7c3aed');
      } else {
        gradient.addColorStop(0, '#7c3aed');
        gradient.addColorStop(1, '#5b21b6');
      }
      
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(
        segment.x * this.gridSize + 1,
        segment.y * this.gridSize + 1,
        this.gridSize - 2,
        this.gridSize - 2
      );
    });

    // Nourriture
    this.ctx.fillStyle = '#10b981';
    this.ctx.beginPath();
    this.ctx.arc(
      this.food.x * this.gridSize + this.gridSize / 2,
      this.food.y * this.gridSize + this.gridSize / 2,
      this.gridSize / 2 - 2,
      0,
      Math.PI * 2
    );
    this.ctx.fill();
  }

  gameOver() {
    clearInterval(this.gameLoop);
    
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.ctx.fillStyle = 'white';
    this.ctx.font = 'bold 30px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 20);
    
    this.ctx.font = '20px Arial';
    this.ctx.fillText(`Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 20);
    
    this.ctx.font = '16px Arial';
    this.ctx.fillText('Appuyez sur Entrée pour rejouer', this.canvas.width / 2, this.canvas.height / 2 + 60);
    
    const restartHandler = (e) => {
      if (e.key === 'Enter') {
        clearInterval(this.gameLoop);
        this.reset();
        this.gameLoop = setInterval(() => this.update(), 100);
        document.removeEventListener('keydown', restartHandler);
      }
    };
    
    document.addEventListener('keydown', restartHandler);
  }

  close() {
    clearInterval(this.gameLoop);
    const overlay = document.getElementById('snake-overlay');
    if (overlay) {
      overlay.remove();
    }
  }
}

// Initialiser le code Konami
document.addEventListener('DOMContentLoaded', () => {
  new KonamiCode(() => {
    // Animation de célébration
    document.body.style.animation = 'shake 0.5s';
    setTimeout(() => {
      document.body.style.animation = '';
    }, 500);
    
    // Lancer le jeu
    new SnakeGame().init();
  });
});

// Animation shake
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;
document.head.appendChild(style);