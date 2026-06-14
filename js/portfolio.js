// ── NAVBAR SOLIDIFY ON SCROLL ──
(function() {
    var nav = document.getElementById('navbar');
    var progress = document.getElementById('scrollProgress');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) { nav.classList.add('scrolled'); } else { nav.classList.remove('scrolled'); }
        var scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        var scrolled = (window.scrollY / scrollHeight) * 100;
        progress.style.width = scrolled + '%';
    });
})();

// ── HAMBURGER ──
(function() {
    var hamburger = document.getElementById('hamburger');
    var navLinks = document.getElementById('navLinks');
    if (!hamburger || !navLinks) return;
    function toggleMenu() { hamburger.classList.toggle('active'); navLinks.classList.toggle('open'); }
    hamburger.addEventListener('click', toggleMenu);
    navLinks.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });
})();

// ── SCROLL REVEAL (IntersectionObserver) ──
(function() {
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(function(el) { observer.observe(el); });
})();

// ── CYBERPUNK RAIN CANVAS ──
(function() {
    var canvas = document.getElementById('rainCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var columns = [];
    var fontSize = 14;
    var animId;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        var colCount = Math.floor(canvas.width / fontSize);
        columns = [];
        for (var i = 0; i < colCount; i++) {
            columns.push(Math.random() * canvas.height / fontSize);
        }
    }
    resize();
    window.addEventListener('resize', resize);

    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?';

    function draw() {
        ctx.fillStyle = 'rgba(5, 5, 15, 0.06)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (var i = 0; i < columns.length; i++) {
            var char = chars[Math.floor(Math.random() * chars.length)];
            var x = i * fontSize;
            var y = columns[i] * fontSize;

            if (Math.random() > 0.5) {
                ctx.fillStyle = 'rgba(0, 255, 245, 0.12)';
            } else {
                ctx.fillStyle = 'rgba(255, 45, 149, 0.08)';
            }
            ctx.font = fontSize + 'px monospace';
            ctx.fillText(char, x, y);

            if (y > canvas.height && Math.random() > 0.975) {
                columns[i] = 0;
            }
            columns[i]++;
        }

        animId = requestAnimationFrame(draw);
    }
    draw();
})();


// ── NEON SVG BORDER TRACE (Marketing Cards only) ──
(function() {
    var NS = 'http://www.w3.org/2000/svg';
    var gradCounter = 0;

    function makeSVG(tag, attrs) {
        var el = document.createElementNS(NS, tag);
        for (var key in attrs) el.setAttribute(key, attrs[key]);
        return el;
    }

    var cards = document.querySelectorAll('.marketing-card');
    if (!cards.length) return;

    var cardObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                animateCardBorder(entry.target);
                cardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    function animateCardBorder(card) {
        var rect = card.getBoundingClientRect();
        var w = Math.round(rect.width);
        var h = Math.round(rect.height);
        if (w < 10 || h < 10) return;
        var strokeW = 1.5;
        var perimeter = 2 * (w + h);
        var gradId = 'mktTrace_' + (++gradCounter);

        var svgWrap = document.createElement('div');
        svgWrap.className = 'marketing-svg-border';

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
            rx: 16, ry: 16,
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
        card.appendChild(svgWrap);

        requestAnimationFrame(function() {
            borderRect.style.transition = 'stroke-dashoffset 0.8s ease';
            borderRect.setAttribute('stroke-dashoffset', '0');
        });

        card.classList.add('traced');

        // Hover retrace at 1.5x speed
        var hoverTimer = null;
        card.addEventListener('mouseenter', function() {
            if (hoverTimer) return;
            var br = svgWrap.querySelector('rect');
            if (!br) return;
            br.style.transition = 'none';
            br.setAttribute('stroke-dashoffset', perimeter);
            void br.offsetHeight;
            br.style.transition = 'stroke-dashoffset 0.533s ease';
            br.setAttribute('stroke-dashoffset', '0');
            card.style.boxShadow = '0 0 16px #FF006E, 0 0 35px rgba(255,0,110,0.5)';
            hoverTimer = setTimeout(function() {
                hoverTimer = null;
            }, 540);
        });
        card.addEventListener('mouseleave', function() {
            card.style.boxShadow = '';
        });
    }

    cards.forEach(function(card) { cardObserver.observe(card); });

    // ResizeObserver for responsive cards
    var resizeObserver = new ResizeObserver(function(entries) {
        entries.forEach(function(entry) {
            var card = entry.target;
            var svgWrap = card.querySelector('.marketing-svg-border');
            if (!svgWrap) return;
            var rect2 = card.getBoundingClientRect();
            var w2 = Math.round(rect2.width);
            var h2 = Math.round(rect2.height);
            if (w2 < 10 || h2 < 10) return;
            var perimeter2 = 2 * (w2 + h2);
            var svg = svgWrap.querySelector('svg');
            if (svg) svg.setAttribute('viewBox', '0 0 ' + w2 + ' ' + h2);
            var br = svgWrap.querySelector('rect');
            if (br) {
                br.setAttribute('width', w2);
                br.setAttribute('height', h2);
                br.setAttribute('stroke-dasharray', perimeter2);
                if (card.classList.contains('traced')) {
                    br.setAttribute('stroke-dashoffset', '0');
                } else {
                    br.setAttribute('stroke-dashoffset', perimeter2);
                }
            }
        });
    });

    cards.forEach(function(card) { resizeObserver.observe(card); });
})();

// ── PAGE LOAD ──
// Content visible immediately — no wait for slow resources (fonts, Three.js, videos)
// Using DOMContentLoaded instead of window.load for much faster perceived load
if (document.readyState === 'loading') {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    document.addEventListener('DOMContentLoaded', function() {
        requestAnimationFrame(function() { document.body.style.opacity = '1'; });
    });
} else {
    document.body.style.opacity = '1';
}