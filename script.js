document.addEventListener ('DOMContentLoaded', () => {
    initParticles()
    initCursorGlow()
    initNavigation()
    initTypingEffect()
    initCounterAnimation()
    initProjectsRender()
    initScrollReveal()
    initProjectFilter()
    initContactForm()
})
function initParticles() {
    const canvas = document.getElementById ('particleCanvas')
    if (!canvas) return
    const ctx = canvas.getContext ('2d')
    let particles = []
    let animationId

    function resize() {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
    }

    class Particle {
        constructor() {
            this.reset()
        }

        reset() {
            this.x = Math.random() * canvas.width
            this.y = Math.random() * canvas.height
            this.size = Math.random() * 1.5 + 0.5
            this.speedX = (Math.random() - 0.5) * 0.3
            this.speedY = (Math.random() - 0.5) * 0.3
            this.opacity = Math.random() * 0.4 + 0.1
            this.color = Math.random() > 0.5 
                ? `rgba(108, 99, 255, ${this.opacity})` 
                : `rgba(0, 212, 170, ${this.opacity})`
        }

        update() {
            this.x += this.speedX
            this.y += this.speedY

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1
        }

        draw() {
            ctx.beginPath()
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
            ctx.fillStyle = this.color
            ctx.fill()
        }
    }

    function createParticles() {
        const count = Math.min (Math.floor (canvas.width * canvas.height / 15000), 80)
        particles = []
        for (let index = 0; index < count; index++) {
            particles.push (new Particle())
        }
    }

    function connectParticles() {
        for (let index = 0; index < particles.length; index++) {
            for (let j = index + 1; j < particles.length; j++) {
                const dx = particles[index].x - particles[j].x
                const dy = particles[index].y - particles[j].y
                const distance = Math.sqrt (dx * dx + dy * dy)

                if (distance < 150) {
                    const opacity = (1 - distance / 150) * 0.1
                    ctx.beginPath()
                    ctx.strokeStyle = `rgba(108, 99, 255, ${opacity})`
                    ctx.lineWidth = 0.5
                    ctx.moveTo (particles[index].x, particles[index].y)
                    ctx.lineTo (particles[j].x, particles[j].y)
                    ctx.stroke()
                }
            }
        }
    }

    function animate() {
        ctx.clearRect (0, 0, canvas.width, canvas.height)
        particles.forEach (p => {
            p.update()
            p.draw()
        })
        connectParticles()
        animationId = requestAnimationFrame (animate)
    }

    resize()
    createParticles()
    animate()

    window.addEventListener ('resize', () => {
        resize()
        createParticles()
    })
}

function initCursorGlow() {
    const glow = document.getElementById ('cursorGlow')
    if (!glow || window.innerWidth < 768) return

    let mouseX = 0, mouseY = 0
    let glowX = 0, glowY = 0

    document.addEventListener ('mousemove', (event) => {
        mouseX = event.clientX
        mouseY = event.clientY
        glow.classList.add ('active')
    })

    document.addEventListener ('mouseleave', () => {
        glow.classList.remove ('active')
    })

    function updateGlow() {
        glowX += (mouseX - glowX) * 0.08
        glowY += (mouseY - glowY) * 0.08
        glow.style.left = glowX + 'px'
        glow.style.top = glowY + 'px'
        requestAnimationFrame (updateGlow)
    }
    updateGlow()
}

function initNavigation() {
    const navbar = document.getElementById ('navbar')
    const navToggle = document.getElementById ('navToggle')
    const navLinks = document.getElementById ('navLinks')
    const links = document.querySelectorAll ('.nav-link')

    // efeito do scroll
    window.addEventListener ('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add ('scrolled')
        } else {
            navbar.classList.remove ('scrolled')
        }

        // ativar o link baseado no scroll
        const sections = document.querySelectorAll ('section[id]')
        let current = ''

        sections.forEach (section => {
            const rect = section.getBoundingClientRect()
            if (rect.top <= 200) {
                current = section.getAttribute('id')
            }
        })

        links.forEach (link => {
            link.classList.remove ('active')
            if (link.dataset.section === current) {
                link.classList.add ('active')
            }
        })
    })

    // Mobile toggle
    navToggle.addEventListener ('click', () => {
        navToggle.classList.toggle ('active')
        navLinks.classList.toggle ('active')
    })

    links.forEach (link => {
        link.addEventListener ('click', () => {
            navToggle.classList.remove ('active')
            navLinks.classList.remove ('active')
        })
    })

    document.addEventListener ('click', (event) => {
        if (!navToggle.contains (event.target) && !navLinks.contains (event.target)) {
            navToggle.classList.remove('active')
            navLinks.classList.remove('active')
        }
    })
}

function initTypingEffect() {
    const element = document.getElementById ('typingText')
    if (!element) return

    const texts = [
        'Desenvolvedor Fullstack Web',
        'Criador de Interfaces',
        'Apaixonado por Tecnologia'
    ]

    let textIndex = 0
    let charIndex = 0
    let isDeleting = false
    let typingSpeed = 80

    function type() {
        const currentText = texts [textIndex]

        if (isDeleting) {
            element.textContent = currentText.substring (0, charIndex - 1)
            charIndex--
            typingSpeed = 40
        } else {
            element.textContent = currentText.substring (0, charIndex + 1)
            charIndex++
            typingSpeed = 80
        }

        if (!isDeleting && charIndex === currentText.length) {
            typingSpeed = 2000
            isDeleting = true
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false
            textIndex = (textIndex + 1) % texts.length
            typingSpeed = 500
        }

        setTimeout (type, typingSpeed)
    }

    setTimeout (type, 1000)
}

function initCounterAnimation() {
    const counters = document.querySelectorAll ('.stat-number')
    let animated = false

    function animateCounters() {
        counters.forEach (counter => {
            const target = parseInt (counter.dataset.target)
            const duration = 2000
            const start = performance.now()

            function updateCount (currentTime) {
                const elapsed = currentTime - start
                const progress = Math.min (elapsed / duration, 1)
                
                const eased = 1 - Math.pow (1 - progress, 3)
                counter.textContent = Math.floor (eased * target)

                if (progress < 1) {
                    requestAnimationFrame (updateCount)
                } else {
                    counter.textContent = target
                }
            }

            requestAnimationFrame (updateCount)
        })
    }

    const observer = new IntersectionObserver ((entries) => {
        entries.forEach (entry => {
            if (entry.isIntersecting && !animated) {
                animated = true
                animateCounters()
            }
        })
    }, { threshold: 0.5 })

    const statsSection = document.querySelector ('.hero-stats')
    if (statsSection) {
        observer.observe (statsSection)
    }
}

function initScrollReveal() {
    const revealElements = document.querySelectorAll (
        '.section-header, .about-card, .skill-card, .project-card, .contact-card, .contact-form-wrapper'
    )

    revealElements.forEach (el => el.classList.add ('reveal'))

    const observer = new IntersectionObserver ((entries) => {
        entries.forEach ((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout (() => {
                    entry.target.classList.add ('active')
                }, index * 80)
                observer.unobserve (entry.target)
            }
        })
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    })

    revealElements.forEach (el => observer.observe (el))
}

function initProjectsRender() {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid || typeof Projects === 'undefined') return;
    
    projectsGrid.innerHTML = '';
    
    Projects.forEach(project => {
        const isComingSoon = project.isComingSoon;
        
        let tagsHtml = '';
        if (project.tags && project.tags.length > 0) {
            tagsHtml = `<div class="project-tags">
                ${project.tags.map(tag => `<span class="tag tag-soon">${tag}</span>`).join('')}
            </div>`;
        }
        
        let imageHtml = '';
        if (project.image) {
            imageHtml = `<img src="${project.image}" alt="${project.title}">`;
        } else if (isComingSoon) {
            let svgIcon = `
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
                    <polyline points="16 18 22 12 16 6"/>
                    <polyline points="8 6 2 12 8 18"/>
                </svg>
            `;
            if (project.id % 2 !== 0 && project.id > 1) {
                svgIcon = `
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
                    <circle cx="12" cy="12" r="10"/>
                    <polygon points="10 8 16 12 10 16 10 8"/>
                </svg>
                `;
            }
            
            imageHtml = `
                <div class="coming-soon-placeholder">
                    ${svgIcon}
                    <div class="coming-soon-dots">
                        <span></span><span></span><span></span>
                    </div>
                </div>
            `;
        } else {
            imageHtml = `<img src="" alt="">`;
        }
    
        const comingSoonCardClass = isComingSoon ? 'coming-soon-card' : 'coming-soon-card';
        const hasLink = !isComingSoon && project.link && project.link.trim() !== '' && project.link !== '#';
        const WrapperTag = hasLink ? 'a' : 'article';
        const linkAttrs = hasLink ? `href="${project.link}" target="_blank" rel="noopener noreferrer"` : '';
        
        const cardHtml = `
            <${WrapperTag} ${linkAttrs} class="project-card ${comingSoonCardClass}" id="project-${project.id}" data-category="all" style="display: block;">
                ${isComingSoon ? `
                <div class="coming-soon-banner">
                    <span>EM BREVE</span>
                </div>
                ` : ''}
                <div class="project-image">
                    ${imageHtml}
                    ${hasLink ? `
                    <div class="project-overlay">
                        <div class="project-link">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                <polyline points="15 3 21 3 21 9"></polyline>
                                <line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                        </div>
                    </div>
                    ` : ''}
                </div>
                <div class="project-info">
                    ${tagsHtml}
                    <h3 class="project-title ${isComingSoon ? 'coming-soon-title' : 'coming-soon-title'}">${project.title}</h3>
                    <p class="project-description">
                        ${project.description}
                    </p>
                </div>
            </${WrapperTag}>
        `;
        
        projectsGrid.insertAdjacentHTML('beforeend', cardHtml);
    });
}

function initProjectFilter() {
    const filterBtns = document.querySelectorAll ('.filter-btn')
    const projectCards = document.querySelectorAll ('.project-card')

    filterBtns.forEach (btn => {
        btn.addEventListener ('click', () => {
            filterBtns.forEach (b => b.classList.remove ('active'))
            btn.classList.add ('active')

            const filter = btn.dataset.filter

            projectCards.forEach (card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.classList.remove ('hidden')
                    card.style.animation = 'fadeInUp 0.5s ease forwards'
                } else {
                    card.classList.add ('hidden')
                }
            });
        });
    });
}


function initContactForm() {
    const form = document.getElementById ('contactForm')
    if (!form) return

    const WEB3FORMS_URL = 'https://api.web3forms.com/submit'

    form.addEventListener ('submit', async (e) => {
        e.preventDefault()
        
        const btn = form.querySelector ('.btn-submit')
        const btnSpan = btn.querySelector ('span')
        const statusEl = document.getElementById ('formStatus')
        const originalText = btnSpan.textContent
        
        // Reset status
        statusEl.className = 'form-status'
        statusEl.textContent = ''
        
        // Loading state
        btnSpan.textContent = 'Enviando...'
        btn.disabled = true
        btn.style.opacity = '0.7'
        btn.classList.add ('loading')

        try {
            const formData = new FormData (form)
            
            const response = await fetch (WEB3FORMS_URL, {
                method: 'POST',
                body: formData
            })

            const result = await response.json()

            if (result.success) {
                // Success
                btnSpan.textContent = 'Mensagem Enviada! ✓'
                btn.style.background = 'linear-gradient(135deg, #00d4aa, #00b894)'
                btn.classList.remove('loading')
                
                statusEl.textContent = '🎉 Mensagem enviada com sucesso! Responderei em breve.'
                statusEl.className = 'form-status success'
                
                form.reset()
                
                setTimeout(() => {
                    btnSpan.textContent = originalText
                    btn.disabled = false
                    btn.style.opacity = '1'
                    btn.style.background = '';
                    
                    setTimeout(() => {
                        statusEl.className = 'form-status';
                        statusEl.textContent = '';
                    }, 2000);
                }, 3000);
            } else {
                throw new Error(result.message || 'Erro ao enviar mensagem');
            }
        } catch (error) {
            // Error
            btnSpan.textContent = 'Erro ao enviar ✕';
            btn.style.background = 'linear-gradient(135deg, #ff6b6b, #ee5a24)';
            btn.classList.remove('loading');
            
            statusEl.textContent = '❌ Erro ao enviar. Verifique a conexão e tente novamente.';
            statusEl.className = 'form-status error';
            
            console.error('Form submission error:', error);
            
            setTimeout(() => {
                btnSpan.textContent = originalText;
                btn.disabled = false;
                btn.style.opacity = '1';
                btn.style.background = '';
            }, 3000);
        }
    });

    // Input focus animations
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
        });
    });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
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
