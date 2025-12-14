// ========================================
// Fonction pour agrandir/réduire le tableau
// ========================================
function toggleTableSize() {
  const tableWrapper = document.getElementById('tableWrapper');
  const btn = document.getElementById('expandBtn');
  
  if (tableWrapper && btn) {
    tableWrapper.classList.toggle('expanded');
    
    if (tableWrapper.classList.contains('expanded')) {
      btn.innerHTML = ':material-arrow-collapse-all: Réduire';
    } else {
      btn.innerHTML = ':material-arrow-expand-all: Agrandir';
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