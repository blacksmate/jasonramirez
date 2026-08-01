// ============================================================
// CYBER BLUE & SLATE — JavaScript
// ============================================================

// ----- Hamburger toggle -----
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const icon = hamburger.querySelector('i');
  icon.className = navLinks.classList.contains('open') ? 'fas fa-times' : 'fas fa-bars';
});

// Close menu on link click (mobile)
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelector('i').className = 'fas fa-bars';
  });
});

// ============================================================
// CONTACT FORM (Formspree with custom notification)
// ============================================================

const form = document.getElementById('contactForm');

// --- Custom Notification System ---
function showNotification(type, title, message) {
  // Remove any existing notification
  const existing = document.querySelector('.notification-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.className = 'notification-overlay active';

  const iconClass = type === 'success' ? 'success' : 'error';
  const iconHtml = type === 'success'
    ? '<i class="fas fa-check-circle"></i>'
    : '<i class="fas fa-exclamation-circle"></i>';

  const buttonHtml = type === 'success'
    ? `<button class="btn-primary" onclick="this.closest('.notification-overlay').remove()">Got it</button>`
    : `
        <button class="btn-primary" onclick="this.closest('.notification-overlay').remove()">Got it</button>
        <button class="btn-secondary" onclick="this.closest('.notification-overlay').remove()">Close</button>
      `;

  overlay.innerHTML = `
    <div class="notification-modal">
      <div class="notification-icon ${iconClass}">
        ${iconHtml}
      </div>
      <h3>${title}</h3>
      <p>${message}</p>
      <div class="notification-actions">
        ${buttonHtml}
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Auto-close success after 4 seconds
  if (type === 'success') {
    setTimeout(() => {
      if (overlay && overlay.parentNode) {
        overlay.remove();
      }
    }, 4000);
  }

  // Click outside to close
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });

  // ESC key to close
  const escHandler = (e) => {
    if (e.key === 'Escape' && overlay.parentNode) {
      overlay.remove();
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);
}

// --- Form submit handler ---
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !message) {
    showNotification('error', 'Missing Fields', 'Please fill in all fields before submitting.');
    return;
  }

  if (!email.includes('@') || !email.includes('.')) {
    showNotification('error', 'Invalid Email', 'Please enter a valid email address.');
    return;
  }

  const submitBtn = form.querySelector('.btn-primary');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  submitBtn.disabled = true;

  try {
    const response = await fetch('https://formspree.io/f/xwvgwvjw', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ name, email, message })
    });

    if (response.ok) {
      showNotification(
        'success',
        `✅ Thanks, ${name}!`,
        'Your message has been sent successfully. I\'ll get back to you soon.'
      );
      form.reset();
    } else {
      const result = await response.json();
      showNotification('error', 'Submission Failed', result.error || 'Something went wrong. Please try again.');
    }
  } catch (error) {
    showNotification('error', 'Network Error', 'Please check your internet connection and try again.');
  } finally {
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }
});

// ============================================================
// CASE STUDY MODAL SYSTEM
// ============================================================

// --- Placeholder SVG ---
const PLACEHOLDER_SVG =
  "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='450' viewBox='0 0 800 450'%3E%3Crect width='100%25' height='100%25' fill='%230F172A'/%3E%3Ccircle cx='400' cy='180' r='50' fill='%232563EB' opacity='0.12'/%3E%3Ctext x='400' y='190' font-family='Arial' font-size='48' fill='%232563EB' text-anchor='middle' dy='.3em'%3E%3C/text%3E%3Ctext x='400' y='240' font-family='Arial' font-size='18' fill='%2394A3B8' text-anchor='middle'%3ENo screenshots available%3C/text%3E%3Ctext x='400' y='268' font-family='Arial' font-size='13' fill='%2364748B' text-anchor='middle'%3EScreenshots coming soon%3C/text%3E%3C/svg%3E";

// --- Project Data with Full Case Study Content (No githubLink/demoLink) ---
const projectData = {
  'bani-speed': {
    title: 'Bani SPEED — Municipal Document Workflow System',
    tag: 'Bani LGU 01',
    tech: 'PHP 8.0 · MySQL · AdminLTE3 · QR Code · RBAC',
    images: [
      'dashboard.png',
      'create-docs.png',
      'department-docs.png',
      'pending-docs.png',
      'qr.png',
      'send-docs.png'
    ],
    caseStudy: `
      <h3><i class="fas fa-bullseye"></i> The Problem</h3>
      <p>The Municipality of Bani struggled with manual paper-based document processing:</p>
      <ul>
        <li>Documents traveled through 5+ offices physically</li>
        <li>No real-time tracking or status visibility</li>
        <li>Retrieving archived documents required hours of manual searching</li>
        <li>No audit trail for accountability or compliance</li>
      </ul>
      <p><strong>Who needed this?</strong> 5+ municipal departments, 30+ government employees, Mayor's Office for document signing, 100+ documents processed weekly.</p>

      <h3><i class="fas fa-brain"></i> My Approach</h3>
      <p>Built a complete document workflow management system that digitizes the entire lifecycle from creation to archiving.</p>
      <p><strong>Key decisions:</strong> PHP 8.0 + MySQL for production stability, AdminLTE3 for government-grade interface, QR codes to bridge physical-to-digital documents, role-based access control (Super Admin, Admin, User), comprehensive audit logging with IP tracking, and bulk operations for efficiency.</p>

      <h3><i class="fas fa-cogs"></i> Technology Stack</h3>
      <table class="tech-table">
        <tr><th>Category</th><th>Technologies</th></tr>
        <tr><td>Backend</td><td>PHP 8.0, MySQL 5.7+</td></tr>
        <tr><td>Frontend</td><td>AdminLTE3, Bootstrap 4, JavaScript, CSS3</td></tr>
        <tr><td>Security</td><td>bcrypt hashing, CSRF tokens, PDO prepared statements, Login throttling</td></tr>
        <tr><td>Features</td><td>QR Code generation, Email automation, Bulk operations, Audit trails</td></tr>
        <tr><td>Server</td><td>Apache, Laragon (dev)</td></tr>
      </table>

      <h3><i class="fas fa-bolt"></i> Key Challenges & Solutions</h3>
      <table class="challenges-table">
        <tr><td><strong>Bulk Operations</strong></td><td>Built batch processing allowing users to forward, receive, or archive multiple documents simultaneously — saving hours of manual work</td></tr>
        <tr><td><strong>Security</strong></td><td>Multi-layer security: bcrypt password hashing, CSRF protection, PDO prepared statements (SQL injection prevention), login throttling (5 attempts)</td></tr>
        <tr><td><strong>Audit Trail</strong></td><td>Every user action logged with user identification, IP tracking, and timestamps</td></tr>
        <tr><td><strong>Physical-to-Digital Bridge</strong></td><td>Integrated QR code generation — physical documents scanned with any smartphone instantly retrieve digital record</td></tr>
        <tr><td><strong>Role Management</strong></td><td>Three-tier RBAC: Super Admin (full control), Admin (department management), User (basic document processing)</td></tr>
      </table>

      <h3><i class="fas fa-trophy"></i> The Outcome</h3>
      <ul>
        <li>📊 <strong>100+ documents</strong> processed monthly through the system</li>
        <li>⏱️ <strong>70% faster</strong> document routing across departments</li>
        <li>🏢 <strong>5 departments</strong> fully onboarded and trained</li>
        <li>📋 <strong>Complete audit trail</strong> providing full accountability</li>
        <li>✅ <strong>Zero security incidents</strong> in production</li>
        <li>📱 <strong>QR code integration</strong> enabling instant document lookup</li>
      </ul>
    `
  },

  'savorra-pos': {
    title: 'SavorraPOS — Coffee Shop Point of Sale System',
    tag: 'Savorra 05',
    tech: 'PHP · LAN · POS · Inventory · Reports',
    images: [
      'pos-terminal.png',
      'admin-dashboard-01.png',
      'admin-dashboard-02.png',
      'daily-report.png',
      'inventory.png',
      'sales-history.png',
      'login.png'
    ],
    caseStudy: `
      <h3><i class="fas fa-bullseye"></i> The Problem</h3>
      <p>A local coffee shop needed a comprehensive Point of Sale system but faced challenges:</p>
      <ul>
        <li>Unreliable internet made cloud-based POS solutions impractical</li>
        <li>Existing SaaS POS systems had recurring monthly fees</li>
        <li>No inventory tracking or sales analytics</li>
        <li>Manual receipt generation and reporting</li>
      </ul>
      <p><strong>Who needed this?</strong> Baristas & Cashiers (fast order taking), Shop Managers (inventory control, sales monitoring), Business Owners (complete operational visibility).</p>

      <h3><i class="fas fa-brain"></i> My Approach</h3>
      <p>Built a complete LAN-based POS system from scratch that runs entirely offline — no internet required, no monthly subscriptions.</p>
      <p><strong>Key decisions:</strong> PHP + MySQL on local server (XAMPP/Laragon/WAMP), AdminLTE3 + Bootstrap for professional interface, Multi-terminal support via LAN, Thermal and A4 receipt printing with image export, Comprehensive audit logging with IP tracking.</p>

      <h3><i class="fas fa-cogs"></i> Technology Stack</h3>
      <table class="tech-table">
        <tr><th>Category</th><th>Technologies</th></tr>
        <tr><td>Backend</td><td>PHP (Procedural) with prepared statements</td></tr>
        <tr><td>Database</td><td>MySQL with foreign keys & indexes</td></tr>
        <tr><td>Frontend</td><td>AdminLTE 3, Bootstrap 4, responsive CSS</td></tr>
        <tr><td>JavaScript</td><td>Vanilla JS, jQuery, AJAX</td></tr>
        <tr><td>Printing</td><td>Thermal (80mm) & A4 with html2canvas for image export</td></tr>
        <tr><td>Security</td><td>Password hashing, session management, role-based access</td></tr>
      </table>

      <h3><i class="fas fa-bolt"></i> Key Challenges & Solutions</h3>
      <table class="challenges-table">
        <tr><td><strong>Offline Operation</strong></td><td>Deployed MySQL locally with LAN-based multi-terminal support — no internet dependency</td></tr>
        <tr><td><strong>Real-time Inventory</strong></td><td>Built automatic stock tracking with low-stock alerts — inventory updates instantly when orders are placed</td></tr>
        <tr><td><strong>Multiple Payment Methods</strong></td><td>Implemented Cash, GCash, and Card payments with automatic change calculation</td></tr>
        <tr><td><strong>Receipt Flexibility</strong></td><td>Support for thermal (80mm) and A4 paper sizes — plus PNG image export for digital records</td></tr>
        <tr><td><strong>Staff Management</strong></td><td>Role-based access: Admins (full control) and Cashiers (order processing only) with audit logging</td></tr>
      </table>

      <h3><i class="fas fa-trophy"></i> The Outcome</h3>
      <ul>
        <li>📊 <strong>300+ orders</strong> processed monthly</li>
        <li>💰 <strong>Zero monthly fees</strong> — one-time setup, no subscriptions</li>
        <li>📈 <strong>Inventory accuracy</strong> improved by 95%</li>
        <li>⏱️ <strong>Orders processed in seconds</strong> with fast terminal</li>
        <li>📋 <strong>Complete audit trail</strong> — every action logged</li>
        <li>🖨️ <strong>Professional receipts</strong> with branded colors and custom footer</li>
      </ul>
    `
  },

  'sileg': {
    title: 'SILEG — Law Enforcement Fraternity Portal',
    tag: 'SILEG 04',
    tech: 'PHP · MySQL · Auth · RBAC · AJAX',
    images: [
      'registration.png',
      'user-dashboard.png',
      'admin-dashboard.png'
    ],
    caseStudy: `
      <h3><i class="fas fa-bullseye"></i> The Problem</h3>
      <p>The Samahang Ilokano Law Enforces Group (SILEG), a Filipino law enforcement fraternity, managed their member operations manually:</p>
      <ul>
        <li>Paper-based registration with physical document submission</li>
        <li>No centralized member database or verification system</li>
        <li>Announcements and events shared via social media (no official channel)</li>
        <li>No formal process for officer management or content approval</li>
      </ul>
      <p><strong>Who needed this?</strong> 100+ active members across multiple regions, Fraternity leadership (Officers & Administrators), New applicants going through verification, Organization secretary for record-keeping.</p>

      <h3><i class="fas fa-brain"></i> My Approach</h3>
      <p>Built a secure, role-based web portal that serves as a central hub for all fraternity operations — bridging the gap between leadership and members.</p>
      <p><strong>Key decisions:</strong> Built with PHP (procedural) + MySQL for simplicity and shared hosting compatibility, No Composer required — all dependencies served via CDN, Three-tier RBAC: Members, Admins, Superadmins, AJAX-powered features for real-time feedback, Dynamic certificate generation using PHP GD Library, Security-first design: CSRF tokens, XSS protection, PDO prepared statements.</p>

      <h3><i class="fas fa-cogs"></i> Technology Stack</h3>
      <table class="tech-table">
        <tr><th>Category</th><th>Technologies</th></tr>
        <tr><td>Backend</td><td>PHP (procedural) with PDO</td></tr>
        <tr><td>Database</td><td>MySQL</td></tr>
        <tr><td>Frontend</td><td>Bootstrap 4, AdminLTE 3, Font Awesome</td></tr>
        <tr><td>JavaScript</td><td>jQuery, AJAX</td></tr>
        <tr><td>Image Processing</td><td>GD Library (certificate generation)</td></tr>
        <tr><td>Deployment</td><td>Shared hosting ready (e.g., InfinityFree)</td></tr>
      </table>

      <h3><i class="fas fa-bolt"></i> Key Challenges & Solutions</h3>
      <table class="challenges-table">
        <tr><td><strong>Secure Registration</strong></td><td>Multi-step approval: Members upload Service ID, Uniform ID, and Official Receipt — Admins review and approve/deny applications</td></tr>
        <tr><td><strong>Certificate Generation</strong></td><td>Dynamic HTML-to-JPEG certificate generator using PHP GD Library — creates professional certificates for approved members</td></tr>
        <tr><td><strong>Role Management</strong></td><td>Three-tier RBAC with tailored dashboards: Members (access announcements/events), Admins (approve registrations, manage content), Superadmins (oversee all users)</td></tr>
        <tr><td><strong>Contact System</strong></td><td>AJAX-powered contact form that stores messages in the database with admin review panel — no email setup required</td></tr>
        <tr><td><strong>Content Management</strong></td><td>Admins can add, edit, and delete Officers, Events, and Announcements with image uploads</td></tr>
      </table>

      <h3><i class="fas fa-trophy"></i> The Outcome</h3>
      <ul>
        <li>📊 <strong>100+ members</strong> registered and verified through the portal</li>
        <li>⏱️ <strong>80% faster</strong> member registration and verification process</li>
        <li>🏛️ <strong>Centralized platform</strong> for all fraternity communications</li>
        <li>📋 <strong>Automated certificate generation</strong> — no manual processing</li>
        <li>✅ <strong>Zero security incidents</strong> — CSRF, XSS, and SQL injection protection</li>
        <li>📱 <strong>Fully responsive</strong> — works on desktop, tablet, and mobile</li>
      </ul>
    `
  },

  'bolinao-lms': {
    title: 'Bolinao Learning Management System',
    tag: 'Bolinao 02',
    tech: 'PHP · MySQL · LMS · Education',
    images: [],
    caseStudy: `
      <h3><i class="fas fa-bullseye"></i> The Problem</h3>
      <p>An educational institution needed a digital platform to manage learning for Grades 1-3 students.</p>
      <ul>
        <li>Manual enrollment and record keeping</li>
        <li>No centralized platform for assignments and quizzes</li>
        <li>Language barrier for Ilocano-speaking students</li>
      </ul>

      <h3><i class="fas fa-brain"></i> My Approach</h3>
      <p>Built an interactive educational platform with enrollment management, subject assignments, automated grading, and a Tagalog-to-Ilocano translator to support multilingual learning.</p>

      <h3><i class="fas fa-cogs"></i> Technology Stack</h3>
      <table class="tech-table">
        <tr><th>Category</th><th>Technologies</th></tr>
        <tr><td>Backend</td><td>PHP, MySQL</td></tr>
        <tr><td>Frontend</td><td>Bootstrap, CSS3</td></tr>
        <tr><td>Features</td><td>LMS, Translation system, Automated grading</td></tr>
      </table>

      <h3><i class="fas fa-trophy"></i> The Outcome</h3>
      <ul>
        <li>🎓 <strong>100+ students</strong> enrolled and active</li>
        <li>📝 <strong>Automated grading</strong> — teachers save 5+ hours weekly</li>
        <li>🌐 <strong>Tagalog-to-Ilocano translator</strong> bridging language gaps</li>
      </ul>
    `
  },

  'spes': {
    title: 'SPES Alaminos Web Management',
    tag: 'SPES 01',
    tech: 'PHP · MySQL · Email Automation',
    images: [],
    caseStudy: `
      <h3><i class="fas fa-bullseye"></i> The Problem</h3>
      <p>The Special Program for the Employment of Students (SPES) needed a digital tracking system for student applicants.</p>
      <ul>
        <li>Manual tracking of hundreds of applicants</li>
        <li>No automated notification system</li>
        <li>Difficult to manage hiring status updates</li>
      </ul>

      <h3><i class="fas fa-brain"></i> My Approach</h3>
      <p>Built a tracking system for SPES applicants with automated email notifications when applicants are hired.</p>

      <h3><i class="fas fa-cogs"></i> Technology Stack</h3>
      <table class="tech-table">
        <tr><th>Category</th><th>Technologies</th></tr>
        <tr><td>Backend</td><td>PHP, MySQL</td></tr>
        <tr><td>Features</td><td>Email Automation, Applicant Tracking</td></tr>
      </table>

      <h3><i class="fas fa-trophy"></i> The Outcome</h3>
      <ul>
        <li>📊 <strong>500+ applicants</strong> tracked per cycle</li>
        <li>✉️ <strong>Automated email notifications</strong> — no manual follow-ups</li>
        <li>⏱️ <strong>90% faster</strong> application processing</li>
      </ul>
    `
  },

  'sti-time': {
    title: 'STI Time-in / Time-out System',
    tag: 'STI 03',
    tech: 'PHP · MySQL · Attendance',
    images: [],
    caseStudy: `
      <h3><i class="fas fa-bullseye"></i> The Problem</h3>
      <p>STI Alaminos needed a digital attendance monitoring system for students and employees.</p>
      <ul>
        <li>Manual attendance logs were error-prone</li>
        <li>No real-time tracking of attendance</li>
        <li>Difficult to generate attendance reports</li>
      </ul>

      <h3><i class="fas fa-brain"></i> My Approach</h3>
      <p>Built a digital attendance monitoring system that records and manages student and employee attendance logs in real-time.</p>

      <h3><i class="fas fa-cogs"></i> Technology Stack</h3>
      <table class="tech-table">
        <tr><th>Category</th><th>Technologies</th></tr>
        <tr><td>Backend</td><td>PHP, MySQL</td></tr>
        <tr><td>Features</td><td>Real-time tracking, Attendance logs</td></tr>
      </table>

      <h3><i class="fas fa-trophy"></i> The Outcome</h3>
      <ul>
        <li>📊 <strong>500+ users</strong> tracked daily</li>
        <li>⏱️ <strong>Real-time attendance</strong> monitoring</li>
        <li>📋 <strong>Automated reports</strong> for administration</li>
      </ul>
    `
  }
};

// --- DOM Elements ---
const modal = document.getElementById('caseModal');
const modalClose = document.getElementById('modalClose');
const modalProjectTag = document.getElementById('modalProjectTag');
const modalProjectTitle = document.getElementById('modalProjectTitle');
const modalProjectTech = document.getElementById('modalProjectTech');
const modalContent = document.getElementById('modalContent');
const galleryMainImg = document.getElementById('galleryMainImg');
const galleryThumbs = document.getElementById('galleryThumbs');
const galleryPrev = document.getElementById('galleryPrev');
const galleryNext = document.getElementById('galleryNext');

let currentProject = null;
let currentImageIndex = 0;
let projectImages = [];

// --- LIGHTBOX (Full-screen image viewer) ---
let lightbox = null;
let lightboxImg = null;
let lightboxClose = null;
let lightboxPrev = null;
let lightboxNext = null;

function createLightbox() {
  if (document.getElementById('lightbox')) return;

  lightbox = document.createElement('div');
  lightbox.id = 'lightbox';
  lightbox.className = 'lightbox-overlay';
  lightbox.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.92);
    backdrop-filter: blur(20px);
    z-index: 9999;
    display: none;
    align-items: center;
    justify-content: center;
    padding: 20px;
    opacity: 0;
    transition: opacity 0.3s ease;
  `;

  lightboxClose = document.createElement('button');
  lightboxClose.className = 'lightbox-close';
  lightboxClose.innerHTML = '<i class="fas fa-times"></i>';
  lightboxClose.style.cssText = `
    position: absolute;
    top: 20px;
    right: 30px;
    background: none;
    border: none;
    color: #fff;
    font-size: 2.2rem;
    cursor: pointer;
    z-index: 10;
    transition: transform 0.2s, opacity 0.2s;
    opacity: 0.7;
    padding: 10px;
  `;
  lightboxClose.onmouseenter = () => { lightboxClose.style.opacity = '1'; lightboxClose.style.transform = 'scale(1.1)'; };
  lightboxClose.onmouseleave = () => { lightboxClose.style.opacity = '0.7'; lightboxClose.style.transform = 'scale(1)'; };
  lightboxClose.onclick = closeLightbox;

  lightboxImg = document.createElement('img');
  lightboxImg.className = 'lightbox-image';
  lightboxImg.style.cssText = `
    max-width: 95vw;
    max-height: 85vh;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    transition: transform 0.3s ease;
    cursor: default;
  `;

  lightboxPrev = document.createElement('button');
  lightboxPrev.className = 'lightbox-nav lightbox-prev';
  lightboxPrev.innerHTML = '<i class="fas fa-chevron-left"></i>';
  lightboxPrev.style.cssText = `
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #fff;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.4rem;
    transition: background 0.2s, transform 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(8px);
  `;
  lightboxPrev.onmouseenter = () => { lightboxPrev.style.background = 'rgba(56, 189, 248, 0.2)'; };
  lightboxPrev.onmouseleave = () => { lightboxPrev.style.background = 'rgba(255, 255, 255, 0.08)'; };
  lightboxPrev.onclick = (e) => { e.stopPropagation(); lightboxPrevImage(); };

  lightboxNext = document.createElement('button');
  lightboxNext.className = 'lightbox-nav lightbox-next';
  lightboxNext.innerHTML = '<i class="fas fa-chevron-right"></i>';
  lightboxNext.style.cssText = `
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #fff;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.4rem;
    transition: background 0.2s, transform 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(8px);
  `;
  lightboxNext.onmouseenter = () => { lightboxNext.style.background = 'rgba(56, 189, 248, 0.2)'; };
  lightboxNext.onmouseleave = () => { lightboxNext.style.background = 'rgba(255, 255, 255, 0.08)'; };
  lightboxNext.onclick = (e) => { e.stopPropagation(); lightboxNextImage(); };

  const counter = document.createElement('div');
  counter.className = 'lightbox-counter';
  counter.id = 'lightboxCounter';
  counter.style.cssText = `
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.9rem;
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 0.04em;
  `;

  lightbox.onclick = (e) => {
    if (e.target === lightbox) closeLightbox();
  };

  document.addEventListener('keydown', (e) => {
    if (lightbox && lightbox.style.display === 'flex') {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') lightboxNextImage();
      if (e.key === 'ArrowLeft') lightboxPrevImage();
    }
  });

  let touchStartX = 0;
  let touchEndX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) lightboxNextImage();
      else lightboxPrevImage();
    }
  }, { passive: true });

  lightbox.appendChild(lightboxClose);
  lightbox.appendChild(lightboxImg);
  lightbox.appendChild(lightboxPrev);
  lightbox.appendChild(lightboxNext);
  lightbox.appendChild(counter);
  document.body.appendChild(lightbox);
}

function openLightbox(index) {
  if (!lightbox) createLightbox();
  if (!projectImages || projectImages.length === 0) return;

  const imgPath = `assets/projects/${currentProject}/${projectImages[index]}`;
  lightboxImg.src = imgPath;
  lightboxImg.alt = `${currentProject} screenshot ${index + 1}`;
  lightboxImg.onerror = function() {
    this.src = PLACEHOLDER_SVG;
    this.style.objectFit = 'contain';
  };

  const counter = document.getElementById('lightboxCounter');
  if (counter) {
    counter.textContent = `${index + 1} / ${projectImages.length}`;
  }

  if (projectImages.length <= 1) {
    lightboxPrev.style.display = 'none';
    lightboxNext.style.display = 'none';
  } else {
    lightboxPrev.style.display = 'flex';
    lightboxNext.style.display = 'flex';
  }

  lightbox._currentIndex = index;
  lightbox.style.display = 'flex';
  void lightbox.offsetWidth;
  lightbox.style.opacity = '1';
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.style.opacity = '0';
  setTimeout(() => {
    lightbox.style.display = 'none';
    document.body.style.overflow = '';
  }, 300);
}

function lightboxNextImage() {
  if (!projectImages || projectImages.length === 0) return;
  const current = lightbox._currentIndex || 0;
  const next = (current + 1) % projectImages.length;
  openLightbox(next);
}

function lightboxPrevImage() {
  if (!projectImages || projectImages.length === 0) return;
  const current = lightbox._currentIndex || 0;
  const prev = (current - 1 + projectImages.length) % projectImages.length;
  openLightbox(prev);
}

// --- Helper Functions ---
function handleImageError(img) {
  if (!img) return;
  if (!img.src.includes('placeholder') && !img.src.includes('svg')) {
    img.src = PLACEHOLDER_SVG;
    img.alt = 'Image not available';
    img.style.objectFit = 'contain';
    img.style.padding = '20px';
  }
}

function createPlaceholderElement() {
  const placeholder = document.createElement('div');
  placeholder.className = 'gallery-placeholder';
  placeholder.innerHTML = `
    <div class="placeholder-content">
      <i class="fas fa-image"></i>
      <h4>No Screenshots Available</h4>
      <p>Screenshots for this project will be added soon.</p>
    </div>
  `;
  return placeholder;
}

// --- Open Modal ---
document.querySelectorAll('.case-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const projectId = btn.dataset.project;
    openModal(projectId);
  });
});

function openModal(projectId) {
  const data = projectData[projectId];
  if (!data) return;

  currentProject = projectId;
  projectImages = data.images || [];
  currentImageIndex = 0;

  modalProjectTag.textContent = data.tag;
  modalProjectTitle.textContent = data.title;
  modalProjectTech.textContent = data.tech;
  modalContent.innerHTML = data.caseStudy;

  renderGallery();

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// --- Close Modal ---
function closeModal() {
  modal.classList.remove('active');
  document.body.style.overflow = '';
  if (lightbox && lightbox.style.display === 'flex') {
    closeLightbox();
  }
}

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// --- Gallery Functions ---
let mainImageHandler = null;

function handleMainImageClick(e) {
  e.preventDefault();
  e.stopPropagation();
  if (projectImages && projectImages.length > 0) {
    openLightbox(currentImageIndex);
  }
}

function attachMainImageListener() {
  if (mainImageHandler) {
    galleryMainImg.removeEventListener('click', mainImageHandler);
    galleryMainImg.removeEventListener('touchstart', mainImageHandler);
    mainImageHandler = null;
  }
  galleryMainImg.addEventListener('click', handleMainImageClick);
  galleryMainImg.addEventListener('touchstart', handleMainImageClick, { passive: false });
  mainImageHandler = handleMainImageClick;
}

function renderGallery() {
  galleryThumbs.innerHTML = '';

  document.querySelectorAll('.image-tap-indicator, .image-count-badge, .image-tap-center, .gallery-placeholder')
    .forEach(el => el.remove());

  if (!projectImages || projectImages.length === 0) {
    galleryMainImg.style.display = 'none';
    galleryPrev.style.display = 'none';
    galleryNext.style.display = 'none';
    const placeholder = createPlaceholderElement();
    galleryMainImg.parentElement.appendChild(placeholder);
    if (mainImageHandler) {
      galleryMainImg.removeEventListener('click', mainImageHandler);
      galleryMainImg.removeEventListener('touchstart', mainImageHandler);
      mainImageHandler = null;
    }
    return;
  }

  galleryMainImg.style.display = 'block';
  galleryPrev.style.display = 'flex';
  galleryNext.style.display = 'flex';

  const firstImgPath = `assets/projects/${currentProject}/${projectImages[0]}`;
  galleryMainImg.src = firstImgPath;
  galleryMainImg.alt = `${currentProject} screenshot 1`;
  galleryMainImg.style.objectFit = 'cover';
  galleryMainImg.style.padding = '0';
  galleryMainImg.style.cursor = 'pointer';
  galleryMainImg.style.touchAction = 'manipulation';
  galleryMainImg.onerror = function() { handleImageError(this); };
  galleryMainImg.title = 'Click to view full size';

  const indicator = document.createElement('div');
  indicator.className = 'image-tap-indicator';
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const label = isTouch ? 'Tap to expand' : 'Click to expand';
  indicator.innerHTML = `<i class="fas fa-expand"></i> ${label}`;
  galleryMainImg.parentElement.appendChild(indicator);

  const countBadge = document.createElement('div');
  countBadge.className = 'image-count-badge';
  countBadge.textContent = `📷 ${projectImages.length}`;
  galleryMainImg.parentElement.appendChild(countBadge);

  attachMainImageListener();

  projectImages.forEach((img, index) => {
    const thumb = document.createElement('div');
    thumb.className = `thumb-item ${index === 0 ? 'active' : ''}`;
    const imgPath = `assets/projects/${currentProject}/${img}`;
    thumb.innerHTML = `<img src="${imgPath}" alt="Thumbnail ${index + 1}" />`;
    const thumbImg = thumb.querySelector('img');
    thumbImg.onerror = function() {
      this.src = PLACEHOLDER_SVG;
      this.style.objectFit = 'contain';
      this.style.padding = '2px';
    };
    thumb.addEventListener('click', () => setImage(index));
    thumb.addEventListener('touchstart', (e) => {
      e.preventDefault();
      setImage(index);
    }, { passive: false });
    galleryThumbs.appendChild(thumb);
  });
}

function setImage(index) {
  if (!projectImages || projectImages.length === 0) return;
  currentImageIndex = index;
  const imgPath = `assets/projects/${currentProject}/${projectImages[index]}`;
  galleryMainImg.src = imgPath;
  galleryMainImg.alt = `${currentProject} screenshot ${index + 1}`;
  galleryMainImg.style.objectFit = 'cover';
  galleryMainImg.style.padding = '0';
  galleryMainImg.style.cursor = 'pointer';
  galleryMainImg.style.touchAction = 'manipulation';
  galleryMainImg.onerror = function() { handleImageError(this); };

  if (!mainImageHandler) {
    attachMainImageListener();
  }

  const countBadge = document.querySelector('.image-count-badge');
  if (countBadge) countBadge.textContent = `📷 ${projectImages.length}`;

  document.querySelectorAll('.thumb-item').forEach((thumb, i) => {
    thumb.classList.toggle('active', i === index);
  });

  const thumbElements = document.querySelectorAll('.thumb-item');
  if (thumbElements[index]) {
    thumbElements[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }
}

function nextImage() {
  if (!projectImages || projectImages.length === 0) return;
  const next = (currentImageIndex + 1) % projectImages.length;
  setImage(next);
}

function prevImage() {
  if (!projectImages || projectImages.length === 0) return;
  const prev = (currentImageIndex - 1 + projectImages.length) % projectImages.length;
  setImage(prev);
}

galleryNext.addEventListener('click', nextImage);
galleryPrev.addEventListener('click', prevImage);

document.addEventListener('keydown', (e) => {
  if (!modal.classList.contains('active')) return;
  if (e.key === 'ArrowRight') nextImage();
  if (e.key === 'ArrowLeft') prevImage();
});

// --- Initialize ---
createLightbox();
