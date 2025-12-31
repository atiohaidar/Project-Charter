export const SignaturePad = {
    setup(canvasId, storageKey) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;

        let isDrawing = false;
        ctx.strokeStyle = '#1a237e';
        ctx.lineWidth = 2.5;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        const getPos = (e) => {
            const rect = canvas.getBoundingClientRect();
            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            const clientY = e.clientY || (e.touches && e.touches[0].clientY);
            return { x: clientX - rect.left, y: clientY - rect.top };
        };

        const start = (e) => {
            isDrawing = true;
            const pos = getPos(e);
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
        };

        const draw = (e) => {
            if (!isDrawing) return;
            const pos = getPos(e);
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
        };

        const stop = () => {
            if (isDrawing) {
                isDrawing = false;
                localStorage.setItem(storageKey, canvas.toDataURL());
            }
        };

        canvas.addEventListener('mousedown', start);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stop);

        canvas.addEventListener('touchstart', (e) => {
            if (e.target === canvas) e.preventDefault();
            start(e);
        }, { passive: false });
        canvas.addEventListener('touchmove', (e) => {
            if (e.target === canvas) e.preventDefault();
            draw(e);
        }, { passive: false });
        canvas.addEventListener('touchend', stop);

        const saved = localStorage.getItem(storageKey);
        if (saved) {
            const img = new Image();
            img.onload = () => ctx.drawImage(img, 0, 0, rect.width, rect.height);
            img.src = saved;
        }

        const clearBtnId = canvasId === 'sig-client' ? 'clear-sig-client' : 'clear-sig-developer';
        const clearBtn = document.getElementById(clearBtnId);
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                localStorage.removeItem(storageKey);
            });
        }
    }
};
