
function toggleTableSize() {
  const tableWrapper = document.getElementById('tableWrapper');
  const btn = document.getElementById('expandBtn');
  const body = document.body;
  
  if (tableWrapper && btn) {
    tableWrapper.classList.toggle('fullscreen');
    body.classList.toggle('fullscreen-active');
    
    let overlay = document.querySelector('.fullscreen-overlay');
    
    if (tableWrapper.classList.contains('fullscreen')) {
      btn.innerHTML = '✕ Fermer';
      btn.classList.add('fullscreen-close', 'visible');
      
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'fullscreen-overlay';
        document.body.appendChild(overlay);
      }
      overlay.classList.add('active');
      
      document.addEventListener('keydown', closeOnEscape);
      
      overlay.addEventListener('click', toggleTableSize);
    } else {
      btn.innerHTML = '⛶ Agrandir';
      btn.classList.remove('fullscreen-close', 'visible');
      
      if (overlay) {
        overlay.classList.remove('active');
      }
      
      document.removeEventListener('keydown', closeOnEscape);
    }
  }
}

function closeOnEscape(e) {
  if (e.key === 'Escape') {
    const tableWrapper = document.getElementById('tableWrapper');
    if (tableWrapper && tableWrapper.classList.contains('fullscreen')) {
      toggleTableSize();
    }
  }
}

function filterCerts(category) {
  const cards = document.querySelectorAll('.cert-card');
  const buttons = document.querySelectorAll('.filter-btn');
  
  buttons.forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  
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


document.addEventListener('DOMContentLoaded', function() {
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
  
  document.querySelectorAll('.skill-card, .cert-card, .stat-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
  });
});

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
    this.numberOfParticles = 50; 
    
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

document.addEventListener('DOMContentLoaded', () => {
  new ParticleSystem();
});


class ScrollReveal {
  constructor() {
    this.elements = [];
    this.init();
    window.addEventListener('scroll', () => this.checkElements());
    window.addEventListener('resize', () => this.checkElements());
  }

  init() {
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

    this.checkElements();
  }

  checkElements() {
    this.elements.forEach((el, index) => {
      if (this.isInViewport(el)) {
        setTimeout(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          el.classList.add('revealed');
        }, index * 50); 
      }
    });

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

class Parallax {
  constructor() {
    this.elements = [];
    this.init();
    window.addEventListener('scroll', () => this.update());
  }

  init() {
      document.querySelectorAll('.stats-grid').forEach(el => {
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
      
      if (scrollY + windowHeight > elementTop && scrollY < elementTop + elementHeight) {
        const offset = (scrollY - elementTop) * speed;
        element.style.transform = `translateY(${offset}px)`;
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ScrollReveal();
  new Parallax();
});

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

    const title = document.createElement('h2');
    title.textContent = 'SNAKE GAME';
    title.style.cssText = `
      color: #7c3aed;
      font-size: 2.5rem;
      margin-bottom: 1rem;
      text-shadow: 0 0 20px rgba(124, 58, 237, 0.8);
    `;
    overlay.appendChild(title);

    const scoreDisplay = document.createElement('div');
    scoreDisplay.id = 'snake-score';
    scoreDisplay.textContent = 'Score: 0';
    scoreDisplay.style.cssText = `
      color: white;
      font-size: 1.5rem;
      margin-bottom: 1rem;
    `;
    overlay.appendChild(scoreDisplay);

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.gridSize * this.tileCount;
    this.canvas.height = this.gridSize * this.tileCount;
    this.canvas.style.cssText = `
      border: 3px solid #7c3aed;
      border-radius: 8px;
      box-shadow: 0 0 30px rgba(124, 58, 237, 0.6);
    `;
    overlay.appendChild(this.canvas);

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

    document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    document.getElementById('close-snake').addEventListener('click', () => this.close());

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

    const head = { ...this.snake[0] };
    
    switch(this.direction) {
      case 'up': head.y--; break;
      case 'down': head.y++; break;
      case 'left': head.x--; break;
      case 'right': head.x++; break;
    }

    if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount) {
      this.gameOver();
      return;
    }

    for (let segment of this.snake) {
      if (segment.x === head.x && segment.y === head.y) {
        this.gameOver();
        return;
      }
    }

    this.snake.unshift(head);

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
    this.ctx.fillStyle = '#1a1a2e';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

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

document.addEventListener('DOMContentLoaded', () => {
  new KonamiCode(() => {
    document.body.style.animation = 'shake 0.5s';
    setTimeout(() => {
      document.body.style.animation = '';
    }, 500);
    
    new SnakeGame().init();
  });
});

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