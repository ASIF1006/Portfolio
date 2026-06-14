// ── NAVBAR ──
(function() {
    var nav = document.getElementById('navbar');
    var progress = document.getElementById('scrollProgress');
    var rainCanvas = document.getElementById('rainCanvas');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) { nav.classList.add('scrolled'); } else { nav.classList.remove('scrolled'); }
        var sh = document.documentElement.scrollHeight - window.innerHeight;
        var s = sh > 0 ? window.scrollY / sh : 0;
        progress.style.width = (s * 100) + '%';
        if (rainCanvas) rainCanvas.style.opacity = Math.max(0, 0.4 - s * 0.8);
    });
})();

// ── HAMBURGER ──
(function() {
    var h = document.getElementById('hamburger');
    var n = document.getElementById('navLinks');
    if (!h || !n) return;
    function toggleMenu() { h.classList.toggle('active'); n.classList.toggle('open'); }
    h.addEventListener('click', toggleMenu);
    n.querySelectorAll('a').forEach(function(l) { l.addEventListener('click', function() { h.classList.remove('active'); n.classList.remove('open'); }); });
})();

// ── ABOUT VIDEO ──
(function() {
    var v = document.getElementById('aboutVideo');
    if (!v) return;
    var played = false;
    var obs = new IntersectionObserver(function(e) {
        e.forEach(function(en) {
            if (en.isIntersecting && !played) {
                played = true;
                v.play().catch(function(){});
                obs.unobserve(v);
            }
        });
    }, { threshold: 0.3 });
    obs.observe(v);
})();

// ── SCROLL REVEAL ──
(function() {
    var o = new IntersectionObserver(function(e) { e.forEach(function(en) { if (en.isIntersecting) { en.target.classList.add('visible'); o.unobserve(en.target); } }); }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(function(el) { o.observe(el); });
})();

// ── COUNTERS ──
(function() {
    var cs = document.querySelectorAll('.counter');
    var co = new IntersectionObserver(function(e) { e.forEach(function(en) { if (en.isIntersecting) { var el = en.target; var t = parseInt(el.dataset.target); var start = 0; var duration = 1500; var startTime = null; function step(ts) { if (!startTime) startTime = ts; var progress = Math.min((ts - startTime) / duration, 1); el.textContent = Math.floor(progress * t); if (progress < 1) requestAnimationFrame(step); else el.textContent = t; } requestAnimationFrame(step); co.unobserve(el); } }); }, { threshold: 0.5 });
    cs.forEach(function(c) { co.observe(c); });
})();

// ── TYPING ──
(function() {
    var tt = document.getElementById('typed-text');
    if (!tt) return;
    var phrases = ['Building the Backbone of Modern IT Operations', 'IT Operations Administrator', 'System Administrator', 'IT Service Management Expert'];
    var pi = 0, ci = 0, del = false;
    function type() {
        var cp = phrases[pi];
        tt.textContent = del ? cp.substring(0, ci - 1) : cp.substring(0, ci + 1);
        ci += del ? -1 : 1;
        var d = del ? 40 : 80;
        if (!del && ci === cp.length) { d = 2000; del = true; }
        else if (del && ci === 0) { del = false; pi = (pi + 1) % phrases.length; d = 500; }
        setTimeout(type, d);
    }
    setTimeout(type, 1000);
})();

// ── RGB TEXT GLITCH ──
(function() {
    var rChan = document.querySelector('.glitch-r');
    var gChan = document.querySelector('.glitch-g');
    var bChan = document.querySelector('.glitch-b');
    if (!rChan || !gChan || !bChan) return;

    function triggerTextGlitch() {
        var ox = 3 + Math.random() * 4;   // 3-7px horizontal
        var oy = 2 + Math.random() * 3;   // 2-5px vertical (green up)
        rChan.style.transform = 'translate(-' + ox + 'px, 0)';
        gChan.style.transform = 'translate(0, -' + oy + 'px)';
        bChan.style.transform = 'translate(' + ox + 'px, 0)';
        rChan.classList.add('active');
        gChan.classList.add('active');
        bChan.classList.add('active');
        var duration = 80 + Math.random() * 40; // 80-120ms
        setTimeout(function() {
            rChan.classList.remove('active');
            gChan.classList.remove('active');
            bChan.classList.remove('active');
        }, duration);
    }

    function scheduleTextGlitch() {
        var delay = 4000 + Math.random() * 2000; // 4-6s
        setTimeout(function() {
            triggerTextGlitch();
            scheduleTextGlitch();
        }, delay);
    }
    scheduleTextGlitch();
})();

// ── IMAGE SLICE GLITCH ──
(function() {
    var img = document.querySelector('.hero-image img');
    if (!img) return;
    var variants = ['imgGlitch1', 'imgGlitch2', 'imgGlitch3', 'imgGlitch4', 'imgGlitch5'];

    function triggerImageGlitch() {
        var chosen = variants[Math.floor(Math.random() * variants.length)];
        img.style.animation = 'none';
        // Force reflow
        void img.offsetHeight;
        img.style.animation = chosen + ' 0.06s steps(4) forwards';
        setTimeout(function() {
            img.style.animation = '';
        }, 70);
    }

    function scheduleImageGlitch() {
        var delay = 1500 + Math.random() * 5000; // 1.5-6.5s — async from text
        setTimeout(function() {
            triggerImageGlitch();
            scheduleImageGlitch();
        }, delay);
    }
    scheduleImageGlitch();
})();

// ── NEON SVG BORDER TRACE ──
(function() {
    var NS = 'http://www.w3.org/2000/svg';
    var gradCounter = 0;

    function makeSVG(tag, attrs) {
        var el = document.createElementNS(NS, tag);
        for (var key in attrs) el.setAttribute(key, attrs[key]);
        return el;
    }

    // ── BENTO ITEM BORDER TRACE ──
    var bentoItems = document.querySelectorAll('.bento-item');
    var bentoObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                animateBentoBorder(entry.target);
                bentoObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    function animateBentoBorder(item) {
        var rect = item.getBoundingClientRect();
        var w = Math.round(rect.width);
        var h = Math.round(rect.height);
        if (w < 10 || h < 10) return;
        var strokeW = 1.5;
        var perimeter = 2 * (w + h);
        var gradId = 'neonTrace_' + (++gradCounter);

        var svgWrap = document.createElement('div');
        svgWrap.className = 'bento-svg-border';

        var svg = makeSVG('svg', {
            viewBox: '0 0 ' + w + ' ' + h,
            preserveAspectRatio: 'none'
        });

        var defs = makeSVG('defs', {});
        var grad = makeSVG('linearGradient', {
            id: gradId, x1: '0%', y1: '0%', x2: '100%', y2: '100%'
        });
        grad.appendChild(makeSVG('stop', { offset: '0%', 'stop-color': '#FF006E' }));
        grad.appendChild(makeSVG('stop', { offset: '100%', 'stop-color': '#00F5FF' }));
        defs.appendChild(grad);
        svg.appendChild(defs);

        var borderRect = makeSVG('rect', {
            x: '0', y: '0',
            width: w, height: h,
            rx: 8, ry: 8,
            fill: 'none',
            stroke: 'url(#' + gradId + ')',
            'stroke-width': strokeW,
            'stroke-linecap': 'square',
            'stroke-dasharray': perimeter,
            'stroke-dashoffset': perimeter,
            'vector-effect': 'non-scaling-stroke'
        });
        svg.appendChild(borderRect);
        svgWrap.appendChild(svg);
        item.appendChild(svgWrap);

        // Animate trace
        requestAnimationFrame(function() {
            borderRect.style.transition = 'stroke-dashoffset 0.8s ease';
            borderRect.setAttribute('stroke-dashoffset', '0');
        });

        item.classList.add('traced');

        // ── HOVER RETRACE at 1.5x speed ──
        var hoverTimer = null;
        item.addEventListener('mouseenter', function() {
            if (hoverTimer) return;
            var br = svgWrap.querySelector('rect');
            if (!br) return;
            // Reset to full dashoffset instantly
            br.style.transition = 'none';
            br.setAttribute('stroke-dashoffset', perimeter);
            void br.offsetHeight;
            // Animate back to 0 at 1.5x speed
            br.style.transition = 'stroke-dashoffset 0.533s ease';
            br.setAttribute('stroke-dashoffset', '0');
            // Increase glow
            item.style.boxShadow = '0 0 16px #FF006E, 0 0 35px rgba(255,0,110,0.5)';
            hoverTimer = setTimeout(function() {
                hoverTimer = null;
            }, 540);
        });
        item.addEventListener('mouseleave', function() {
            item.style.boxShadow = '';
        });
    }

    bentoItems.forEach(function(item) { bentoObserver.observe(item); });

    // ── SECTION TITLE UNDERLINES ──
    var titles = document.querySelectorAll('.section-title');
    var titleObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                animateTitleUnderline(entry.target);
                titleObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    function animateTitleUnderline(title) {
        // Skip if already has underline
        var parent = title.parentElement;
        if (parent.querySelector('.title-svg-underline')) return;

        // Wrap title in relative container for positioning
        if (!parent.classList.contains('title-wrapper')) {
            var wrapper = document.createElement('div');
            wrapper.className = 'title-wrapper';
            parent.insertBefore(wrapper, title);
            wrapper.appendChild(title);
            parent = wrapper;
        }

        var gradId = 'titleTrace_' + (++gradCounter);

        var wrap = document.createElement('div');
        wrap.className = 'title-svg-underline';

        var svg = makeSVG('svg', { viewBox: '0 0 200 4' });
        var defs = makeSVG('defs', {});
        var grad = makeSVG('linearGradient', {
            id: gradId, x1: '0%', y1: '0%', x2: '100%', y2: '0%'
        });
        grad.appendChild(makeSVG('stop', { offset: '0%', 'stop-color': '#FF006E' }));
        grad.appendChild(makeSVG('stop', { offset: '100%', 'stop-color': '#00F5FF' }));
        defs.appendChild(grad);
        svg.appendChild(defs);

        var line = makeSVG('line', {
            x1: '0', y1: '2', x2: '200', y2: '2',
            fill: 'none',
            stroke: 'url(#' + gradId + ')',
            'stroke-width': '2',
            'stroke-linecap': 'round',
            'stroke-dasharray': '200',
            'stroke-dashoffset': '200'
        });
        svg.appendChild(line);
        wrap.appendChild(svg);

        parent.appendChild(wrap);

        requestAnimationFrame(function() {
            line.style.transition = 'stroke-dashoffset 0.8s ease';
            line.setAttribute('stroke-dashoffset', '0');
        });
    }

    titles.forEach(function(title) {
        // Don't observe titles that don't have a parent we can work with
        if (title.parentElement) titleObserver.observe(title);
    });

    // ── RESIZE OBSERVER for bento items ──
    var resizeObserver = new ResizeObserver(function(entries) {
        entries.forEach(function(entry) {
            var item = entry.target;
            var svgWrap = item.querySelector('.bento-svg-border');
            if (!svgWrap) return;
            var rect2 = item.getBoundingClientRect();
            var w2 = Math.round(rect2.width);
            var h2 = Math.round(rect2.height);
            if (w2 < 10 || h2 < 10) return;
            var strokeW2 = 1.5;
            var perimeter2 = 2 * (w2 + h2);

            var svg = svgWrap.querySelector('svg');
            if (svg) svg.setAttribute('viewBox', '0 0 ' + w2 + ' ' + h2);
            var br = svgWrap.querySelector('rect');
            if (br) {
                br.setAttribute('width', w2);
                br.setAttribute('height', h2);
                br.setAttribute('stroke-dasharray', perimeter2);
                if (item.classList.contains('traced')) {
                    br.setAttribute('stroke-dashoffset', '0');
                } else {
                    br.setAttribute('stroke-dashoffset', perimeter2);
                }
            }
        });
    });

    bentoItems.forEach(function(item) { resizeObserver.observe(item); });
})();

// ── PARTICLE CANVAS ──
(function() {
    var canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var particles = [], maxP = 60, mouse = { x: -1000, y: -1000 };
    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resize(); window.addEventListener('resize', resize);
    for (var i = 0; i < maxP; i++) particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3, r: Math.random() * 1.2 + 0.4 });
    document.addEventListener('mousemove', function(e) { mouse.x = e.clientX; mouse.y = e.clientY; });
    document.addEventListener('mouseleave', function() { mouse.x = -1000; mouse.y = -1000; });
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < particles.length; i++) {
            var p = particles[i]; p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 45, 149, 0.25)'; ctx.fill();
            var dx = mouse.x - p.x, dy = mouse.y - p.y, dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 180) {
                ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y);
                ctx.strokeStyle = 'rgba(0, 255, 245, ' + (0.06 * (1 - dist / 180)) + ')';
                ctx.lineWidth = 0.5; ctx.stroke();
            }
            for (var j = i + 1; j < particles.length; j++) {
                var q = particles[j], dx2 = p.x - q.x, dy2 = p.y - q.y, dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
                if (dist2 < 120) {
                    ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
                    ctx.strokeStyle = 'rgba(255, 0, 255, ' + (0.04 * (1 - dist2 / 120)) + ')';
                    ctx.lineWidth = 0.3; ctx.stroke();
                }
            }
        }
        requestAnimationFrame(draw);
    }
    draw();
})();

// ── DIGITAL RAIN ──
(function() {
    var canvas = document.getElementById('rainCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    var fontSize = 14;
    var columns, drops;
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        columns = Math.floor(canvas.width / fontSize);
        drops = [];
        for (var i = 0; i < columns; i++) drops[i] = Math.random() * -100;
    }
    resize(); window.addEventListener('resize', resize);
    var scrollFade = 1;
    window.addEventListener('scroll', function() {
        var sh = document.documentElement.scrollHeight - window.innerHeight;
        var s = sh > 0 ? window.scrollY / sh : 0;
        scrollFade = Math.max(0, 1 - s * 1.8);
    });
    function draw() {
        ctx.fillStyle = 'rgba(5, 5, 15, 0.06)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < drops.length; i++) {
            var char = chars[Math.floor(Math.random() * chars.length)];
            var x = i * fontSize;
            var y = drops[i] * fontSize;
            // Color varies: mostly cyan, some pink, rare yellow
            var rand = Math.random();
            if (rand < 0.02) ctx.fillStyle = 'rgba(255, 230, 0, ' + (0.8 * scrollFade) + ')';
            else if (rand < 0.08) ctx.fillStyle = 'rgba(255, 45, 149, ' + (0.6 * scrollFade) + ')';
            else ctx.fillStyle = 'rgba(0, 255, 245, ' + (0.35 * scrollFade) + ')';
            ctx.font = fontSize + 'px JetBrains Mono, monospace';
            ctx.fillText(char, x, y);
            if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i] += 0.5 + Math.random() * 0.5;
        }
        requestAnimationFrame(draw);
    }
    draw();
})();

// ── PAGE LOAD ──
// Content visible immediately — no wait for slow resources (fonts, Three.js, videos)
// Showing content on DOMContentReady instead of window.load for much faster perceived load
if (document.readyState === 'loading') {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    document.addEventListener('DOMContentLoaded', function() {
        requestAnimationFrame(function() { document.body.style.opacity = '1'; });
    });
} else {
    document.body.style.opacity = '1';
}