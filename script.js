/*
 * Portfolio Website Scripts
 * Copyright (c) 2024 Dhruv Narayan Bajaj
 * Licensed under the MIT License
 * https://github.com/DHuvie
 */

// ===== Theme Toggle =====
const themeToggle = document.querySelector('.theme-toggle');
const html = document.documentElement;

// Check for saved theme preference or default to 'dark'
const currentTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', currentTheme);

// Set initial navbar background based on theme
const nav = document.querySelector('.nav');
if (nav) {
    nav.style.background = currentTheme === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(10, 10, 10, 0.8)';
}

themeToggle.addEventListener('click', () => {
    const theme = html.getAttribute('data-theme');
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update navbar background immediately
    const nav = document.querySelector('.nav');
    const scrolled = window.pageYOffset;
    if (scrolled > 100) {
        nav.style.background = newTheme === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(10, 10, 10, 0.95)';
    } else {
        nav.style.background = newTheme === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(10, 10, 10, 0.8)';
    }
    
    // Animate theme toggle
    anime({
        targets: '.theme-toggle',
        rotate: '+=360',
        duration: 600,
        easing: 'easeOutExpo'
    });
    
    // Animate particles on theme change
    if (particles.length > 0) {
        anime({
            targets: particles,
            opacity: [0.5, 0.2, 0.5],
            duration: 1000,
            easing: 'easeInOutQuad'
        });
    }
});

// ===== Particle System =====
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.2;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }
    
    draw() {
        const theme = html.getAttribute('data-theme');
        const color = theme === 'light' ? '0, 0, 0' : '255, 255, 255';
        ctx.fillStyle = `rgba(${color}, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    // Connect nearby particles
    particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const theme = html.getAttribute('data-theme');
                const color = theme === 'light' ? '0, 0, 0' : '255, 255, 255';
                ctx.strokeStyle = `rgba(${color}, ${0.1 * (1 - distance / 100)})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        });
    });
    
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// ===== Loader Animation =====
anime({
    targets: '.loader-text span',
    translateY: [40, 0],
    opacity: [0, 1],
    delay: anime.stagger(100),
    duration: 800,
    easing: 'easeOutExpo'
});

anime({
    targets: '.loader-text span',
    translateY: [0, -40],
    opacity: [1, 0],
    delay: anime.stagger(100, {start: 1500}),
    duration: 600,
    easing: 'easeInExpo'
});

setTimeout(() => {
    document.querySelector('.loader').classList.add('hidden');
    initAnimations();
}, 2500);

// ===== Custom Cursor =====
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

let isActive = false;

function animateCursor() {
    // Circle follows at 1x speed - instant, using transform for 165Hz smoothness
    followerX = mouseX;
    followerY = mouseY;
    
    // Use transform for GPU acceleration and high refresh rate support
    cursorFollower.style.transform = `translate(${followerX}px, ${followerY}px)`;
    
    requestAnimationFrame(animateCursor);
}

animateCursor();

// Cursor hover effects - shrink circle on links
document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
        isActive = true;
        cursorFollower.classList.add('active');
    });
    
    el.addEventListener('mouseleave', () => {
        isActive = false;
        cursorFollower.classList.remove('active');
    });
});

// ===== Progress Bar =====
window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = window.pageYOffset / windowHeight;
    
    anime({
        targets: '.progress-bar',
        scaleX: scrolled,
        duration: 100,
        easing: 'linear'
    });
});

// ===== Initialize Animations =====
function initAnimations() {
    // Nav animation
    anime({
        targets: '.nav',
        opacity: [0, 1],
        translateY: [-20, 0],
        duration: 800,
        delay: 200,
        easing: 'easeOutExpo'
    });
    
    // Nav links stagger
    anime({
        targets: '.nav-link',
        opacity: [0, 1],
        translateY: [-10, 0],
        duration: 600,
        delay: anime.stagger(100, {start: 600}),
        easing: 'easeOutExpo'
    });
    
    // Theme toggle
    anime({
        targets: '.theme-toggle',
        opacity: [0, 1],
        scale: [0.8, 1],
        duration: 600,
        delay: 900,
        easing: 'easeOutExpo'
    });
    
    // Hero label
    anime({
        targets: '.hero-label',
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 1000,
        delay: 400,
        easing: 'easeOutExpo'
    });
    
    // Hero title lines
    anime({
        targets: '.hero-title .line span',
        translateY: ['100%', 0],
        duration: 1200,
        delay: anime.stagger(150, {start: 600}),
        easing: 'easeOutExpo'
    });
    
    // Hero points
    anime({
        targets: '.hero-points',
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 1000,
        delay: 1200,
        easing: 'easeOutExpo'
    });
    
    // Hero points list items stagger
    anime({
        targets: '.hero-points li',
        opacity: [0, 1],
        translateX: [-20, 0],
        duration: 800,
        delay: anime.stagger(100, {start: 1400}),
        easing: 'easeOutExpo'
    });
    
    // Hero scroll text
    anime({
        targets: '.hero-scroll-text',
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 1000,
        delay: 1800,
        easing: 'easeOutExpo'
    });
    
    // Hero background pulse
    anime({
        targets: '.hero-bg',
        scale: [1, 1.2],
        opacity: [0.3, 0.5],
        duration: 4000,
        easing: 'easeInOutSine',
        loop: true,
        direction: 'alternate'
    });
}

// ===== Scroll Animations =====
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = entry.target;
            
            if (target.classList.contains('section-header')) {
                anime({
                    targets: target,
                    opacity: [0, 1],
                    translateY: [50, 0],
                    duration: 1000,
                    easing: 'easeOutExpo'
                });
            }
            
            if (target.classList.contains('project')) {
                const delay = parseInt(target.dataset.index) * 100;
                anime({
                    targets: target,
                    opacity: [0, 1],
                    translateY: [50, 0],
                    duration: 1000,
                    delay: delay,
                    easing: 'easeOutExpo'
                });
            }
            
            if (target.classList.contains('about-content')) {
                // About lead text
                anime({
                    targets: '.about-lead',
                    opacity: [0, 1],
                    translateY: [50, 0],
                    duration: 1000,
                    easing: 'easeOutExpo'
                });
                
                // About cards with scale
                anime({
                    targets: '.about-card',
                    opacity: [0, 1],
                    translateY: [60, 0],
                    scale: [0.95, 1],
                    duration: 1000,
                    delay: anime.stagger(150, {start: 400}),
                    easing: 'easeOutExpo'
                });
            }
            
            if (target.classList.contains('contact-content')) {
                anime({
                    targets: target,
                    opacity: [0, 1],
                    translateY: [50, 0],
                    duration: 1000,
                    easing: 'easeOutExpo'
                });
                
                anime({
                    targets: '.contact-link',
                    opacity: [0, 1],
                    translateX: [-50, 0],
                    duration: 800,
                    delay: anime.stagger(150, {start: 300}),
                    easing: 'easeOutExpo'
                });
            }
            
            observer.unobserve(target);
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.section-header, .project, .about-content, .contact-content').forEach(el => {
    observer.observe(el);
});

// ===== Project Hover Animations =====
document.querySelectorAll('.project a').forEach(link => {
    link.addEventListener('mouseenter', function() {
        anime({
            targets: this.querySelector('.project-arrow'),
            translateX: [0, 10],
            duration: 400,
            easing: 'easeOutExpo'
        });
        
        anime({
            targets: this.querySelectorAll('.project-tags span'),
            scale: [1, 1.05],
            duration: 300,
            delay: anime.stagger(50),
            easing: 'easeOutExpo'
        });
        
        anime({
            targets: this.querySelector('.project-number'),
            scale: [1, 1.2],
            opacity: [0.5, 1],
            duration: 400,
            easing: 'easeOutExpo'
        });
    });
    
    link.addEventListener('mouseleave', function() {
        anime({
            targets: this.querySelector('.project-arrow'),
            translateX: [10, 0],
            duration: 400,
            easing: 'easeOutExpo'
        });
        
        anime({
            targets: this.querySelectorAll('.project-tags span'),
            scale: [1.05, 1],
            duration: 300,
            easing: 'easeOutExpo'
        });
        
        anime({
            targets: this.querySelector('.project-number'),
            scale: [1.2, 1],
            opacity: [1, 0.5],
            duration: 400,
            easing: 'easeOutExpo'
        });
    });
    
    // Magnetic effect
    link.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        anime({
            targets: this,
            translateX: x * 0.1,
            translateY: y * 0.1,
            duration: 400,
            easing: 'easeOutExpo'
        });
    });
    
    link.addEventListener('mouseleave', function() {
        anime({
            targets: this,
            translateX: 0,
            translateY: 0,
            duration: 600,
            easing: 'easeOutExpo'
        });
    });
});

// ===== Contact Link Animations =====
document.querySelectorAll('.contact-link').forEach(link => {
    link.addEventListener('mouseenter', function() {
        anime({
            targets: this.querySelector('.link-arrow'),
            translateX: [0, 10],
            duration: 400,
            easing: 'easeOutExpo'
        });
        
        anime({
            targets: this.querySelector('.link-text'),
            letterSpacing: ['-0.02em', '0.02em'],
            duration: 400,
            easing: 'easeOutExpo'
        });
    });
    
    link.addEventListener('mouseleave', function() {
        anime({
            targets: this.querySelector('.link-arrow'),
            translateX: [10, 0],
            duration: 400,
            easing: 'easeOutExpo'
        });
        
        anime({
            targets: this.querySelector('.link-text'),
            letterSpacing: ['0.02em', '-0.02em'],
            duration: 400,
            easing: 'easeOutExpo'
        });
    });
});

// ===== About Card Hover =====
document.querySelectorAll('.about-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        anime({
            targets: this,
            translateY: -8,
            duration: 400,
            easing: 'easeOutExpo'
        });
        
        anime({
            targets: this.querySelectorAll('li'),
            translateX: [0, 5],
            duration: 300,
            delay: anime.stagger(50),
            easing: 'easeOutExpo'
        });
    });
    
    card.addEventListener('mouseleave', function() {
        anime({
            targets: this,
            translateY: 0,
            duration: 400,
            easing: 'easeOutExpo'
        });
        
        anime({
            targets: this.querySelectorAll('li'),
            translateX: [5, 0],
            duration: 300,
            easing: 'easeOutExpo'
        });
    });
});

// ===== Instant Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            const targetPosition = target.offsetTop - 100;
            
            // Instant scroll
            window.scrollTo({
                top: targetPosition,
                behavior: 'instant'
            });
        }
    });
});

// ===== Parallax Effect =====
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            
            // Hero parallax
            const heroContent = document.querySelector('.hero-content');
            if (heroContent && scrolled < window.innerHeight) {
                heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
                heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.8;
            }
            
            // Nav background - adapt to theme
            const nav = document.querySelector('.nav');
            const theme = html.getAttribute('data-theme');
            if (scrolled > 100) {
                nav.style.background = theme === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(10, 10, 10, 0.95)';
            } else {
                nav.style.background = theme === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(10, 10, 10, 0.8)';
            }
            
            ticking = false;
        });
        
        ticking = true;
    }
});

// ===== Console Message =====
console.log('%cDhruv Narayan Bajaj', 'font-size: 24px; font-weight: 600; color: #f5f5f5; background: #0a0a0a; padding: 10px 20px;');
console.log('%cDeveloper & CS Student', 'font-size: 14px; color: #888;');
console.log('%cGitHub: https://github.com/DHuvie', 'font-size: 12px; color: #f5f5f5;');
console.log('%cPortfolio built with Anime.js', 'font-size: 11px; color: #666; font-style: italic;');
