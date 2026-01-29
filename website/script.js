// ============================================
// Intersection Observer for Scroll Animations
// ============================================
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe session cards
  document.querySelectorAll('.session-card').forEach(card => {
    observer.observe(card);
  });
}

// ============================================
// Add Ripple Effect to Buttons
// ============================================
function addRippleEffect() {
  document.querySelectorAll('.btn-primary').forEach(button => {
    button.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('ripple');

      this.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  });
}

// ============================================
// Smooth Scroll for Anchor Links
// ============================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// ============================================
// Parallax Effect for Background Orbs
// ============================================
function initParallax() {
  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) / 50;
    mouseY = (e.clientY - window.innerHeight / 2) / 50;
  });

  function animate() {
    currentX += (mouseX - currentX) * 0.1;
    currentY += (mouseY - currentY) * 0.1;

    document.querySelectorAll('.orb').forEach((orb, index) => {
      const speed = (index + 1) * 0.5;
      orb.style.transform = `translate(${currentX * speed}px, ${currentY * speed}px)`;
    });

    requestAnimationFrame(animate);
  }

  animate();
}

// ============================================
// Notebook Viewer Modal
// ============================================
function initNotebookViewer() {
  const modal = document.getElementById('notebook-modal');
  const closeBtn = document.getElementById('close-modal');
  const notebookFrame = document.getElementById('notebook-frame');
  const notebookTitle = document.getElementById('notebook-title');

  // Notebook button handlers
  const loadNotebook1Btn = document.getElementById('load-notebook-1');
  const loadNotebook2Btn = document.getElementById('load-notebook-2');
  
  if (loadNotebook1Btn) {
    loadNotebook1Btn.addEventListener('click', (e) => {
      e.preventDefault();
      openNotebook('assets/notebooks/IC2_01.ipynb', 'Session 1: Intelligente Literatursuche');
    });
  }

  if (loadNotebook2Btn) {
    loadNotebook2Btn.addEventListener('click', (e) => {
      e.preventDefault();
      openNotebook('assets/notebooks/IC2_02.ipynb', 'Session 2: KI-gestützte Datenanalyse');
    });
  }

  // Close modal handlers
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // ESC key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      closeModal();
    }
  });

  function openNotebook(notebookPath, title) {
    notebookTitle.textContent = title;
    // Load notebook content and render it
    loadAndRenderNotebook(notebookPath);
    modal.style.display = 'flex';
    // Add fade-in animation
    setTimeout(() => {
      modal.classList.add('modal-visible');
    }, 10);
  }
  
  async function loadAndRenderNotebook(notebookPath) {
    try {
      const response = await fetch(notebookPath);
      const notebook = await response.json();
      
      let html = `
        <div style="padding: 20px; background: white; color: #333; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;">
          <style>
            .notebook-container { max-width: 1000px; margin: 0 auto; }
            .cell { margin-bottom: 20px; }
            .cell-markdown { padding: 10px; }
            .cell-code { background: #f5f5f5; padding: 15px; border-radius: 5px; border-left: 3px solid #667eea; }
            .cell-code pre { margin: 0; overflow-x: auto; }
            .cell-code code { font-family: 'Consolas', 'Monaco', monospace; font-size: 14px; }
            .cell-output { background: #fff; padding: 10px; margin-top: 10px; border-left: 3px solid #10b981; }
            h1, h2, h3 { color: #667eea; margin-top: 20px; }
            code { background: #f0f0f0; padding: 2px 6px; border-radius: 3px; }
          </style>
          <div class="notebook-container">
      `;
      
      notebook.cells.forEach(cell => {
        if (cell.cell_type === 'markdown') {
          const markdown = cell.source.join('');
          html += `<div class="cell cell-markdown">${convertMarkdown(markdown)}</div>`;
        } else if (cell.cell_type === 'code') {
          const code = cell.source.join('');
          html += `<div class="cell cell-code"><pre><code>${escapeHtml(code)}</code></pre>`;
          
          if (cell.outputs && cell.outputs.length > 0) {
            html += '<div class="cell-output">';
            cell.outputs.forEach(output => {
              if (output.text) {
                html += `<pre>${escapeHtml(output.text.join(''))}</pre>`;
              } else if (output.data && output.data['text/plain']) {
                html += `<pre>${escapeHtml(output.data['text/plain'].join(''))}</pre>`;
              }
            });
            html += '</div>';
          }
          html += '</div>';
        }
      });
      
      html += '</div></div>';
      
      const blob = new Blob([html], { type: 'text/html' });
      notebookFrame.src = URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error loading notebook:', error);
      notebookFrame.srcdoc = `<div style="padding: 40px; text-align: center; color: #f5576c;">
        <h2>Fehler beim Laden des Notebooks</h2>
        <p>Das Notebook konnte nicht geladen werden: ${error.message}</p>
      </div>`;
    }
  }
  
  function convertMarkdown(text) {
    // Basic markdown conversion
    text = escapeHtml(text);
    text = text.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    text = text.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    text = text.replace(/^# (.*$)/gm, '<h1>$1</h1>');
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    text = text.replace(/`(.*?)`/g, '<code>$1</code>');
    text = text.replace(/^\* (.*$)/gm, '<li>$1</li>');
    text = text.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    text = text.replace(/\n\n/g, '</p><p>');
    text = text.replace(/^(.+)$/gm, '<p>$1</p>');
    return text;
  }
  
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function closeModal() {
    modal.classList.remove('modal-visible');
    setTimeout(() => {
      modal.style.display = 'none';
      notebookFrame.src = '';
    }, 300);
  }
}

// ============================================
// Initialize Everything on DOM Load
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  addRippleEffect();
  initSmoothScroll();
  initParallax();
  initNotebookViewer();

  // Add entrance animation to page
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  }, 100);
});

// ============================================
// Add CSS for Ripple Effect Dynamically
// ============================================
const style = document.createElement('style');
style.textContent = `
  .btn-primary {
    position: relative;
    overflow: hidden;
  }
  
  .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    transform: scale(0);
    animation: ripple-animation 0.6s ease-out;
    pointer-events: none;
  }
  
  @keyframes ripple-animation {
    to {
      transform: scale(2);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
