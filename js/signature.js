import { Storage } from './storage.js';

export const Signature = {
    canvas: null,
    ctx: null,
    isDrawing: false,

    init: () => {
        const canvas = document.getElementById('signature-pad');
        const clearBtn = document.getElementById('clear-signature');
        if (!canvas) return;

        Signature.canvas = canvas;
        Signature.ctx = canvas.getContext('2d');

        // Setup Canvas Context
        Signature.ctx.strokeStyle = '#000080'; // Navy Blue Ink
        Signature.ctx.lineWidth = 2;
        Signature.ctx.lineJoin = 'round';
        Signature.ctx.lineCap = 'round';

        // Events
        canvas.addEventListener('mousedown', Signature.startDrawing);
        canvas.addEventListener('mousemove', Signature.draw);
        canvas.addEventListener('mouseup', Signature.stopDrawing);
        canvas.addEventListener('mouseout', Signature.stopDrawing);

        // Touch Events
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault(); // Prevent scroll
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            canvas.dispatchEvent(mouseEvent);
        }, { passive: false });

        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            canvas.dispatchEvent(mouseEvent);
        }, { passive: false });

        canvas.addEventListener('touchend', () => {
            canvas.dispatchEvent(new MouseEvent('mouseup', {}));
        });

        if (clearBtn) {
            clearBtn.addEventListener('click', Signature.clear);
        }
    },

    startDrawing: (e) => {
        Signature.isDrawing = true;
        Signature.ctx.beginPath();
        const rect = Signature.canvas.getBoundingClientRect();
        Signature.ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    },

    draw: (e) => {
        if (!Signature.isDrawing) return;
        const rect = Signature.canvas.getBoundingClientRect();
        Signature.ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        Signature.ctx.stroke();
    },

    stopDrawing: () => {
        if (Signature.isDrawing) {
            Signature.isDrawing = false;
            Signature.save();
        }
    },

    clear: () => {
        Signature.ctx.clearRect(0, 0, Signature.canvas.width, Signature.canvas.height);
        Signature.save();
    },

    save: () => {
        // Save as Data URL
        const data = Signature.canvas.toDataURL();
        Storage.save('signatureData', data);
    },

    load: (dataUrl) => {
        if (!dataUrl) return;
        const img = new Image();
        img.onload = () => {
            Signature.ctx.drawImage(img, 0, 0);
        };
        img.src = dataUrl;
    }
};
