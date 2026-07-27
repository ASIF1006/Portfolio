// ── TOUCH GLOW FOR BENTO ITEMS ──
(function() {
    document.querySelectorAll('.bento-item').forEach(function(el) {
        el.addEventListener('touchmove', function(e) {
            var rect = el.getBoundingClientRect();
            var touch = e.touches[0];
            var mx = ((touch.clientX - rect.left) / rect.offsetWidth * 100) + '%';
            var my = ((touch.clientY - rect.top) / rect.offsetHeight * 100) + '%';
            el.style.setProperty('--mx', mx);
            el.style.setProperty('--my', my);
        }, { passive: true });
    });
})();
