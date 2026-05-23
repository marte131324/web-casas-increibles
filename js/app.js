document.addEventListener('DOMContentLoaded', () => {

    /* ══════════════════════════════════════════════
       CASAS INCREÍBLES — WEB PORTAL ENGINE
       ══════════════════════════════════════════════ */

    const WHATSAPP_PHONE = '522291591749';

    /* ════════════════════════════════════════════
       SPLASH SCREEN
       ════════════════════════════════════════════ */
    const splash = document.getElementById('splash');
    const splashVideo = document.getElementById('splash-video');
    if (splash && splashVideo) {
        splashVideo.setAttribute('src', 'img/videos/4segundos.mp4');
        splashVideo.load();
        
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            splash.classList.add('hide');
            setTimeout(() => {
                splash.remove();
                document.body.style.overflow = 'auto';
            }, 900);
        }, 4000); // Duración exacta de la animación (4segundos.mp4)
    }

    /* ════════════════════════════════════════════
       HEADER SCROLL EFFECT
       ════════════════════════════════════════════ */
    const header = document.querySelector('.header');
    let lastScrollY = 0;

    function updateHeader() {
        const scrollY = window.scrollY;
        if (scrollY > 80) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
        lastScrollY = scrollY;
    }

    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();

    /* ════════════════════════════════════════════
       SCROLL REVEAL (Intersection Observer)
       ════════════════════════════════════════════ */
    const revealElements = document.querySelectorAll('.reveal, .reveal-stagger');
    
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

        revealElements.forEach(el => observer.observe(el));
    }

    /* ════════════════════════════════════════════
       ANIMATED STATS COUNTER
       ════════════════════════════════════════════ */
    const statNumbers = document.querySelectorAll('.stat-item__number[data-count]');
    let statsAnimated = false;

    function animateCounters() {
        if (statsAnimated) return;
        
        const statsStrip = document.querySelector('.stats-strip');
        if (!statsStrip) return;

        const rect = statsStrip.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            statsAnimated = true;
            
            statNumbers.forEach(el => {
                const target = parseInt(el.dataset.count);
                const suffix = el.dataset.suffix || '';
                const duration = 2000;
                const start = performance.now();

                function tick(now) {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const current = Math.round(eased * target);
                    el.textContent = current.toLocaleString('es-MX');
                    if (progress < 1) requestAnimationFrame(tick);
                    else {
                        el.textContent = target.toLocaleString('es-MX') + suffix;
                    }
                }
                requestAnimationFrame(tick);
            });
        }
    }

    window.addEventListener('scroll', animateCounters, { passive: true });
    animateCounters();

    /* ════════════════════════════════════════════
       HERO SCROLL HINT
       ════════════════════════════════════════════ */
    const heroScroll = document.querySelector('.hero__scroll');
    if (heroScroll) {
        heroScroll.addEventListener('click', () => {
            const statsStrip = document.querySelector('.stats-strip');
            if (statsStrip) statsStrip.scrollIntoView({ behavior: 'smooth' });
        });
    }

    /* ════════════════════════════════════════════
       PROPERTY FILTERS
       ════════════════════════════════════════════ */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const propCards = document.querySelectorAll('.prop-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            propCards.forEach((card, index) => {
                if (filter === 'all' || card.dataset.type.includes(filter)) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(10px)';
                    setTimeout(() => card.style.display = 'none', 300);
                }
            });
        });
    });

    /* ════════════════════════════════════════════
       CONCIERGE FORM → WHATSAPP
       ════════════════════════════════════════════ */
    const ctaForm = document.getElementById('cta-form');
    if (ctaForm) {
        ctaForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('cta-name').value.trim();
            const phone = document.getElementById('cta-phone').value.trim();
            const type = document.getElementById('cta-type').value;

            if (!name || !type) {
                showToast('Complete los campos requeridos', true);
                return;
            }

            let msg = `*CASAS INCREÍBLES* 🏛️\n`;
            msg += `Solicitud desde Portal Web\n`;
            msg += `━━━━━━━━━━━━━━━━━━━━\n\n`;
            msg += `👤 *Nombre:* ${name}\n`;
            if (phone) msg += `📱 *Teléfono:* ${phone}\n`;
            msg += `🏠 *Interés:* ${type}\n\n`;
            msg += `━━━━━━━━━━━━━━━━━━━━\n`;
            msg += `_Solicitud generada desde casasincreibles.com.mx_`;

            window.open(`https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(msg)}`, '_blank');
        });
    }

    /* ════════════════════════════════════════════
       PROPERTY CTA → WHATSAPP
       ════════════════════════════════════════════ */
    document.querySelectorAll('.prop-card__cta').forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.dataset.name;
            const price = btn.dataset.price;
            const msg = `Hola, me interesa solicitar información sobre la propiedad: *${name}* (${price}) vista en el portal web.`;
            window.open(`https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(msg)}`, '_blank');
        });
    });

    /* ════════════════════════════════════════════
       SMOOTH SCROLL FOR INTERNAL LINKS
       ════════════════════════════════════════════ */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const id = anchor.getAttribute('href');
            if (id === '#') return;
            const target = document.querySelector(id);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* ════════════════════════════════════════════
       TOAST NOTIFICATIONS
       ════════════════════════════════════════════ */
    let toastTimeout;
    function showToast(msg, isError = false) {
        let toast = document.getElementById('ci-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'ci-toast';
            Object.assign(toast.style, {
                position: 'fixed',
                bottom: '30px',
                left: '50%',
                transform: 'translateX(-50%) translateY(20px)',
                background: isError ? '#ef4444' : '#142a5c',
                color: 'white',
                padding: '0.8rem 1.5rem',
                borderRadius: '30px',
                fontSize: '0.85rem',
                fontWeight: '500',
                zIndex: '9999',
                opacity: '0',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                textAlign: 'center',
                maxWidth: '85vw',
                fontFamily: 'Inter, sans-serif'
            });
            document.body.appendChild(toast);
        }

        toast.style.background = isError ? '#ef4444' : '#142a5c';
        toast.textContent = msg;

        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(0)';
        });

        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(20px)';
        }, 3500);
    }

    /* ════════════════════════════════════════════
       HERO PARALLAX
       ════════════════════════════════════════════ */
    const heroBg = document.querySelector('.hero__bg');
    if (heroBg) {
        window.addEventListener('scroll', () => {
            if (window.innerWidth < 768) return; // Desactivar paralaje en móvil para evitar huecos en blanco
            const scroll = window.scrollY;
            if (scroll < window.innerHeight) {
                heroBg.style.transform = `translateY(${scroll * 0.3}px)`;
            }
        }, { passive: true });
    }

    /* ════════════════════════════════════════════
       SCROLLYTELLING CANVAS SEQUENCE SYSTEM (OPTION A)
       ════════════════════════════════════════════ */
    const scrollySection = document.getElementById('recorrido');
    const scrollyCanvas = document.getElementById('scrolly-canvas');
    const scrollySlides = document.querySelectorAll('.scrollytelling__slide');
    
    if (scrollySection && scrollyCanvas) {
        const ctx = scrollyCanvas.getContext('2d');
        let targetPercent = 0;
        let actualPercent = 0;
        
        let preloadedImages = [];
        let currentImageSet = ''; // 'desktop' or 'mobile'
        let imagesLoadedCount = 0;
        const totalFrames = 120;
        
        // Draw frame with 'cover' scaling and High-DPI support
        function drawFrame(img) {
            if (!img || !scrollyCanvas || !ctx) return;
            
            const width = scrollyCanvas.clientWidth;
            const height = scrollyCanvas.clientHeight;
            
            // Handle High-DPI screens (Retina)
            const dpr = window.devicePixelRatio || 1;
            if (scrollyCanvas.width !== width * dpr || scrollyCanvas.height !== height * dpr) {
                scrollyCanvas.width = width * dpr;
                scrollyCanvas.height = height * dpr;
                ctx.scale(dpr, dpr);
            }
            
            ctx.clearRect(0, 0, width, height);
            
            const imgWidth = img.naturalWidth || img.width;
            const imgHeight = img.naturalHeight || img.height;
            if (!imgWidth || !imgHeight) return;
            
            // Mathematical focused object-fit: cover scaling
            const scale = Math.max(width / imgWidth, height / imgHeight);
            const drawWidth = imgWidth * scale;
            const drawHeight = imgHeight * scale;
            
            // Center horizontally
            const x = (width - drawWidth) / 2;
            
            // Focus on the upper region vertically on mobile to prevent overlapping with text slide
            const isMobile = window.innerWidth < 768;
            const alignY = isMobile ? 0.25 : 0.5;
            const y = (height - drawHeight) * alignY;
            
            ctx.drawImage(img, x, y, drawWidth, drawHeight);
        }
        
        // Preload image sequence dynamically
        function preloadImages(isMobile) {
            const newSet = isMobile ? 'mobile' : 'desktop';
            if (currentImageSet === newSet) return;
            
            currentImageSet = newSet;
            preloadedImages = [];
            imagesLoadedCount = 0;
            
            const folder = isMobile ? 'img/videos/frames-vertical' : 'img/videos/frames';
            
            for (let i = 1; i <= totalFrames; i++) {
                const img = new Image();
                const frameNum = String(i).padStart(3, '0');
                img.src = `${folder}/frame_${frameNum}.jpg?v=5.0`;
                img.onload = () => {
                    imagesLoadedCount++;
                    // If this is frame 1 and actualPercent is at start, draw it immediately
                    if (i === 1 && actualPercent === 0) {
                        requestAnimationFrame(() => drawFrame(img));
                    }
                };
                preloadedImages.push(img);
            }
        }
        
        // Initialize source and load images
        const isMobileInit = window.innerWidth < 768;
        preloadImages(isMobileInit);
        
        // Track scroll progress within the scrolly section using getBoundingClientRect()
        function updateScrollPercent() {
            const rect = scrollySection.getBoundingClientRect();
            const sectionHeight = rect.height;
            const maxScroll = sectionHeight - window.innerHeight;
            const scrollY = -rect.top;
            
            if (maxScroll > 0) {
                targetPercent = Math.max(0, Math.min(1, scrollY / maxScroll));
            }
        }
        window.addEventListener('scroll', updateScrollPercent, { passive: true });
        updateScrollPercent();
        actualPercent = targetPercent; // Initial instant synchronization
        
        // Watch for resize with a small debounce
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const isMobile = window.innerWidth < 768;
                preloadImages(isMobile);
                
                // Redraw current frame post-resize
                const frameIndex = Math.max(1, Math.min(totalFrames, Math.round(actualPercent * (totalFrames - 1)) + 1));
                const activeImg = preloadedImages[frameIndex - 1];
                if (activeImg) {
                    requestAnimationFrame(() => drawFrame(activeImg));
                }
            }, 150);
        });
        
        // Linear Interpolation (LERP) Loop for 60FPS ultra-smooth canvas scrubbing
        function smoothVideoScrub() {
            // Smooth interpolation
            actualPercent += (targetPercent - actualPercent) * 0.08;
            actualPercent = Math.max(0, Math.min(1, actualPercent));
            
            // Draw current frame on canvas
            const frameIndex = Math.max(1, Math.min(totalFrames, Math.round(actualPercent * (totalFrames - 1)) + 1));
            const targetImg = preloadedImages[frameIndex - 1];
            
            if (targetImg) {
                if (targetImg.complete && targetImg.naturalWidth !== 0) {
                    drawFrame(targetImg);
                } else {
                    // Fallback to closest preloaded frame to prevent flickering
                    let found = false;
                    for (let j = frameIndex - 2; j >= 0; j--) {
                        const fallbackImg = preloadedImages[j];
                        if (fallbackImg && fallbackImg.complete && fallbackImg.naturalWidth !== 0) {
                            drawFrame(fallbackImg);
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        for (let j = frameIndex; j < totalFrames; j++) {
                            const fallbackImg = preloadedImages[j];
                            if (fallbackImg && fallbackImg.complete && fallbackImg.naturalWidth !== 0) {
                                drawFrame(fallbackImg);
                                break;
                            }
                        }
                    }
                }
            }
            
            // Update active overlay slides
            const activePercentage = actualPercent * 100;
            scrollySlides.forEach(slide => {
                const start = parseInt(slide.dataset.start);
                const end = parseInt(slide.dataset.end);
                if (activePercentage >= start && activePercentage <= end) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });
            
            requestAnimationFrame(smoothVideoScrub);
        }
        
        // Start loop
        requestAnimationFrame(smoothVideoScrub);
    }

    /* ════════════════════════════════════════════
       DYNAMIC INVESTMENT ROI CALCULATOR
       ════════════════════════════════════════════ */
    const calcVal = document.getElementById('calc-val');
    const calcRent = document.getElementById('calc-rent');
    const calcPlus = document.getElementById('calc-plus');

    function updateCalculator() {
        if (!calcVal || !calcRent || !calcPlus) return;

        const val = parseInt(calcVal.value);
        const rent = parseInt(calcRent.value);
        const plusRate = parseFloat(calcPlus.value) / 100;

        // 1. Update values inside labels
        document.getElementById('calc-val-txt').textContent = `$${val.toLocaleString('es-MX')} MXN`;
        document.getElementById('calc-rent-txt').textContent = `$${rent.toLocaleString('es-MX')} MXN`;
        document.getElementById('calc-plus-txt').textContent = `${(plusRate * 100).toFixed(1)}%`;

        // 2. Cap Rate Calculation (Net Rental Yield)
        const annualRent = rent * 12;
        const capRate = (annualRent / val) * 100;
        document.getElementById('res-cap-rate').textContent = `${capRate.toFixed(2)}%`;

        // 3. 5-Year Return Projection (Compounded plusvalia + 4% rent growth)
        let totalRentEarned = 0;
        let currentRent = rent * 12;
        for (let i = 0; i < 5; i++) {
            totalRentEarned += currentRent;
            currentRent *= 1.04; // 4% average rental growth rate
        }

        const finalVal = val * Math.pow(1 + plusRate, 5);
        const plusvaliaEarned = finalVal - val;
        const totalProfit = totalRentEarned + plusvaliaEarned;
        const roi5Year = (totalProfit / val) * 100;
        
        document.getElementById('res-total-5').textContent = `${roi5Year.toFixed(1)}%`;

        // 4. Update legend stats
        const plusPercentOfOriginal = (plusvaliaEarned / val) * 100;
        const rentPercentOfOriginal = (totalRentEarned / val) * 100;
        document.getElementById('leg-plus').textContent = `+${plusPercentOfOriginal.toFixed(0)}%`;
        document.getElementById('leg-rent').textContent = `+${rentPercentOfOriginal.toFixed(0)}%`;

        // 5. Update SVG Circle segments (Radius 40, Circumference 251.3)
        const r = 40;
        const c = 2 * Math.PI * r;

        // Calculate ratios relative to total value (capital + profit)
        const sum = val + plusvaliaEarned + totalRentEarned;
        const pPlus = plusvaliaEarned / sum;
        const pRent = totalRentEarned / sum;

        const strokePlus = pPlus * c;
        const strokeRent = pRent * c;

        const segPlus = document.querySelector('.segment-plus');
        const segRent = document.querySelector('.segment-rent');

        if (segPlus && segRent) {
            // Plusvalia segment begins at offset 0
            segPlus.setAttribute('stroke-dasharray', `${strokePlus} ${c}`);
            
            // Rent segment begins immediately after plusvalia segment
            segRent.setAttribute('stroke-dasharray', `${strokeRent} ${c}`);
            segRent.setAttribute('stroke-dashoffset', `-${strokePlus}`);
        }
    }

    if (calcVal) {
        [calcVal, calcRent, calcPlus].forEach(slider => {
            slider.addEventListener('input', updateCalculator);
        });
        
        // Initial execution
        updateCalculator();
    }

    /* ════════════════════════════════════════════
       LIFESTYLE MATCHER QUIZ — State Machine
       ════════════════════════════════════════════ */
    const quizContainer = document.querySelector('.lifestyle__quiz-container');
    if (quizContainer) {
        let currentStep = 1;
        const answers = {};

        // Property catalog mapped to quiz dimensions
        const PROPERTIES = [
            {
                id: 'las-olas',
                name: 'Casa Residencial Las Olas',
                desc: 'Espectacular residencia frente al mar con doble altura, terraza panorámica y acabados de primera. Ideal para quienes buscan el máximo lujo junto a la playa.',
                price: '$11,300,000 MXN',
                recs: 4, banos: 4.5, m2: 480,
                img: 'img/propiedades/propiedad_6.jpg',
                tags: { playa: 5, seguridad: 2, espacio: 3, inversion: 4, diseno: 5, listo: 3, pareja: 3, familia: 5, retiro: 2 }
            },
            {
                id: 'rambla',
                name: 'Depto Condominio Rambla',
                desc: 'Departamento de lujo con vista al mar en el corazón de la Riviera Veracruzana. Amenidades de primer nivel, seguridad 24/7 y ubicación privilegiada.',
                price: '$8,500,000 MXN',
                recs: 3, banos: 3, m2: 350,
                img: 'img/propiedades/propiedad_4.jpg',
                tags: { playa: 4, seguridad: 4, espacio: 2, inversion: 5, diseno: 4, listo: 3, pareja: 5, familia: 3, retiro: 3 }
            },
            {
                id: 'las-palmas',
                name: 'Casa Fracc. Las Palmas',
                desc: 'Residencia amplia en fraccionamiento privado de Medellín de Bravo. Jardín generoso, áreas verdes y ambiente familiar en zona de alta plusvalía.',
                price: '$6,010,000 MXN',
                recs: 3, banos: 3.5, m2: 317,
                img: 'img/propiedades/propiedad_2.jpg',
                tags: { playa: 1, seguridad: 5, espacio: 5, inversion: 3, diseno: 3, listo: 4, pareja: 2, familia: 5, retiro: 4 }
            },
            {
                id: 'conchal',
                name: 'Casa Rincón del Conchal',
                desc: 'Residencia de ensueño en el exclusivo Rincón del Conchal. Amplios espacios, arquitectura contemporánea y acceso a campo de golf y club de playa.',
                price: '$6,000,000 MXN',
                recs: 3, banos: 3, m2: 356,
                img: 'img/propiedades/propiedad_3.jpg',
                tags: { playa: 4, seguridad: 4, espacio: 4, inversion: 5, diseno: 4, listo: 2, pareja: 3, familia: 4, retiro: 5 }
            },
            {
                id: 'lomas-sol',
                name: 'Casa Lomas del Sol',
                desc: 'Casa moderna en la codiciada zona de Lomas del Sol. Diseño funcional, excelente distribución y todas las comodidades para una familia en crecimiento.',
                price: '$5,100,000 MXN',
                recs: 3, banos: 2.5, m2: 290,
                img: 'img/propiedades/propiedad_1.jpg',
                tags: { playa: 2, seguridad: 4, espacio: 3, inversion: 3, diseno: 3, listo: 5, pareja: 3, familia: 4, retiro: 3 }
            },
            {
                id: 'rioja',
                name: 'Casa Lomas de La Rioja',
                desc: 'Moderna residencia en fraccionamiento con seguridad 24/7. Acabados de calidad, distribución inteligente y zona de alto crecimiento patrimonial.',
                price: '$4,350,000 MXN',
                recs: 3, banos: 3, m2: 217,
                img: 'img/propiedades/propiedad_7.jpg',
                tags: { playa: 1, seguridad: 5, espacio: 3, inversion: 4, diseno: 3, listo: 4, pareja: 3, familia: 4, retiro: 4 }
            },
            {
                id: 'puerta-mar',
                name: 'Depto Puerta al Mar',
                desc: 'Departamento compacto y elegante frente a la costa. Perfecto para inversión en renta vacacional o un espacio íntimo para pareja con vista al océano.',
                price: '$3,350,000 MXN',
                recs: 2, banos: 2, m2: 87,
                img: 'img/propiedades/propiedad_5.jpg',
                tags: { playa: 5, seguridad: 3, espacio: 1, inversion: 5, diseno: 3, listo: 5, pareja: 5, familia: 1, retiro: 4 }
            },
            {
                id: 'rioja-2',
                name: 'Casa Lomas de La Rioja II',
                desc: 'Opción accesible en zona de alta plusvalía. Casa funcional con excelente distribución, ideal para familias jóvenes que buscan su primer patrimonio premium.',
                price: '$2,790,000 MXN',
                recs: 3, banos: 2.5, m2: 115,
                img: 'img/propiedades/propiedad_8.jpg',
                tags: { playa: 1, seguridad: 5, espacio: 2, inversion: 4, diseno: 2, listo: 5, pareja: 4, familia: 3, retiro: 3 }
            }
        ];

        function goToStep(step) {
            const allSteps = quizContainer.querySelectorAll('.quiz-step');
            allSteps.forEach(s => s.classList.remove('active'));

            const target = quizContainer.querySelector(`.quiz-step[data-step="${step}"]`);
            if (target) {
                // Small delay for transition effect
                setTimeout(() => target.classList.add('active'), 50);
            }

            // Update progress bar
            const progressBar = document.getElementById('quiz-progress');
            if (progressBar) {
                if (step === 'result') {
                    progressBar.style.width = '100%';
                } else {
                    progressBar.style.width = `${(parseInt(step) / 3) * 100}%`;
                }
            }

            currentStep = step;
        }

        function findBestProperty() {
            let scores = PROPERTIES.map(prop => {
                let score = 0;
                // Weight answers by dimension
                if (answers.step1) score += (prop.tags[answers.step1] || 0) * 3; // Entorno — highest weight
                if (answers.step2) score += (prop.tags[answers.step2] || 0) * 2; // Prioridad
                if (answers.step3) score += (prop.tags[answers.step3] || 0) * 1.5; // Acompañamiento
                return { prop, score };
            });

            scores.sort((a, b) => b.score - a.score);
            return scores[0].prop;
        }

        function showResult() {
            const resultStep = quizContainer.querySelector('.quiz-step[data-step="result"]');
            const loadingEl = resultStep.querySelector('.quiz-result-loading');
            const contentEl = resultStep.querySelector('.quiz-result-content');

            // Show loading first
            loadingEl.style.display = 'flex';
            contentEl.style.display = 'none';

            goToStep('result');

            // Simulate AI analysis delay
            setTimeout(() => {
                const best = findBestProperty();

                // Populate result fields
                document.getElementById('result-prop-name').textContent = best.name;
                document.getElementById('result-prop-desc').textContent = best.desc;
                document.getElementById('result-prop-price').textContent = best.price;
                document.getElementById('result-prop-rec').innerHTML = `<i class="fa-solid fa-bed"></i> ${best.recs} Rec`;
                document.getElementById('result-prop-ban').innerHTML = `<i class="fa-solid fa-bath"></i> ${best.banos} Baños`;
                document.getElementById('result-prop-m2').innerHTML = `<i class="fa-solid fa-maximize"></i> ${best.m2} m²`;
                document.getElementById('result-prop-img').src = best.img;

                // WhatsApp CTA
                const waMsg = `Hola, realicé el test de estilo de vida en su portal web y mi resultado fue: *${best.name}* (${best.price}). Me gustaría agendar una visita guiada.`;
                document.getElementById('result-wa-btn').href = `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(waMsg)}`;

                // Reveal content with animation
                loadingEl.style.display = 'none';
                contentEl.style.display = 'grid';
                contentEl.style.opacity = '0';
                contentEl.style.transform = 'translateY(15px)';
                requestAnimationFrame(() => {
                    contentEl.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                    contentEl.style.opacity = '1';
                    contentEl.style.transform = 'translateY(0)';
                });
            }, 1800);
        }

        // Option click handler — advances to next step
        quizContainer.querySelectorAll('.quiz-option').forEach(btn => {
            btn.addEventListener('click', () => {
                const step = btn.closest('.quiz-step');
                const stepNum = step.dataset.step;
                const value = btn.dataset.value;

                // Mark selected
                step.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
                btn.classList.add('selected');

                // Store answer
                answers[`step${stepNum}`] = value;

                // Auto-advance after brief visual feedback
                setTimeout(() => {
                    if (stepNum === '1') goToStep(2);
                    else if (stepNum === '2') goToStep(3);
                    else if (stepNum === '3') showResult();
                }, 350);
            });
        });

        // Back button handlers
        quizContainer.querySelectorAll('.quiz-back-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const step = btn.closest('.quiz-step');
                const stepNum = parseInt(step.dataset.step);
                if (stepNum > 1) goToStep(stepNum - 1);
            });
        });

        // Restart handler
        const restartBtn = quizContainer.querySelector('.quiz-restart-btn');
        if (restartBtn) {
            restartBtn.addEventListener('click', () => {
                // Clear answers and selections
                Object.keys(answers).forEach(k => delete answers[k]);
                quizContainer.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
                goToStep(1);
            });
        }
    }

    /* ════════════════════════════════════════════
       ZONES PREMIUM — Interactive Hover Explorer
       ════════════════════════════════════════════ */
    const zoneCards = document.querySelectorAll('.zones__list .zone-card');
    const mapNodes = document.querySelectorAll('.map-node');
    
    if (zoneCards.length > 0 && mapNodes.length > 0) {
        const ZONE_DATA = {
            riviera: {
                title: 'Riviera Veracruzana',
                desc: 'La zona residencial de mayor crecimiento y plusvalía del estado, ofreciendo desarrollos exclusivos con campos de golf, marinas y seguridad excepcional.',
                plus: '+12% Anual',
                devs: '15+ Condominios',
                lifestyle: 'Frente al Mar / Golf'
            },
            boca: {
                title: 'Boca del Río',
                desc: 'El corredor urbano más dinámico de Veracruz con la mayor concentración de servicios, vida nocturna, centros comerciales y acceso directo a la Costa de Oro.',
                plus: '+9% Anual',
                devs: '25+ Desarrollos',
                lifestyle: 'Urbano / Costa de Oro'
            },
            puerto: {
                title: 'Puerto Veracruz',
                desc: 'El centro histórico con mayor tradición del Golfo de México. Malecón renovado, infraestructura turística y un renacimiento inmobiliario sin precedentes.',
                plus: '+7% Anual',
                devs: '10+ Proyectos',
                lifestyle: 'Histórico / Cultural'
            },
            medellin: {
                title: 'Medellín de Bravo',
                desc: 'Zona residencial en pleno auge con fraccionamientos privados de alta calidad. Ambiente tranquilo, seguridad y excelente conectividad con el puerto y la Riviera.',
                plus: '+11% Anual',
                devs: '12+ Fraccionamientos',
                lifestyle: 'Residencial / Familiar'
            },
            alvarado: {
                title: 'Alvarado',
                desc: 'Destino emergente con terrenos de inversión a precios de oportunidad. Cercanía a la costa, proyectos turísticos en desarrollo y la plusvalía más acelerada del sur del estado.',
                plus: '+14% Anual',
                devs: '5+ Mega Proyectos',
                lifestyle: 'Inversión / Emergente'
            }
        };

        function setActiveZone(zoneId) {
            // Update zone cards
            zoneCards.forEach(card => {
                if (card.dataset.zone === zoneId) {
                    card.classList.add('active');
                } else {
                    card.classList.remove('active');
                }
            });

            // Update SVG map nodes
            mapNodes.forEach(node => {
                const nodeZone = node.id.replace('node-', '');
                if (nodeZone === zoneId) {
                    node.classList.add('active');
                } else {
                    node.classList.remove('active');
                }
            });

            // Update panel details with smooth transition
            const data = ZONE_DATA[zoneId];
            if (data) {
                const panel = document.querySelector('.zones__panel');
                if (panel) {
                    panel.style.opacity = '0';
                    panel.style.transform = 'translateY(8px)';

                    setTimeout(() => {
                        document.getElementById('zone-panel-title').textContent = data.title;
                        document.getElementById('zone-panel-desc').textContent = data.desc;
                        document.getElementById('zone-panel-plus').textContent = data.plus;
                        document.getElementById('zone-panel-devs').textContent = data.devs;
                        document.getElementById('zone-panel-lifestyle').textContent = data.lifestyle;

                        panel.style.opacity = '1';
                        panel.style.transform = 'translateY(0)';
                    }, 200);
                }
            }
        }

        // Zone card hover/click
        zoneCards.forEach(card => {
            card.addEventListener('mouseenter', () => setActiveZone(card.dataset.zone));
            card.addEventListener('click', () => setActiveZone(card.dataset.zone));
        });

        // SVG map node hover/click
        mapNodes.forEach(node => {
            const zoneId = node.id.replace('node-', '');
            node.addEventListener('mouseenter', () => setActiveZone(zoneId));
            node.addEventListener('click', () => setActiveZone(zoneId));
        });

        // Set initial active state
        setActiveZone('riviera');
    }

    /* ════════════════════════════════════════════
       SCROLL-ZOOM PARALLAX on Scrollytelling Canvas
       ════════════════════════════════════════════ */
    if (scrollySection && scrollyCanvas) {
        const canvasContainer = scrollyCanvas;

        function updateScrollZoom() {
            const rect = scrollySection.getBoundingClientRect();
            const sectionHeight = rect.height;
            const scrollProgress = -rect.top;
            const maxScroll = sectionHeight - window.innerHeight;

            if (maxScroll > 0) {
                const percent = Math.max(0, Math.min(1, scrollProgress / maxScroll));
                const isMobile = window.innerWidth < 768;
                // Scale from 1.10 to 1.25 on desktop, and 1.06 to 1.21 on mobile to crop watermarks
                const baseScale = isMobile ? 1.06 : 1.10;
                const scale = baseScale + percent * 0.15;
                canvasContainer.style.transform = `scale(${scale})`;
            }
        }

        window.addEventListener('scroll', updateScrollZoom, { passive: true });
        updateScrollZoom(); // Set initial scale immediately on load
    }

});
