import { Storage } from './storage.js';

export const Dates = {
    init: () => {
        const startInput = document.getElementById('startDate');
        const endInput = document.getElementById('endDate');

        if (!startInput || !endInput) return;

        // Set Min Date to Today
        const today = new Date().toISOString().split('T')[0];
        startInput.min = today;

        startInput.addEventListener('change', () => {
            endInput.min = startInput.value;
            Dates.calculateDuration();
            Storage.save(startInput.id, startInput.value);
        });

        endInput.addEventListener('change', () => {
            Dates.calculateDuration();
            Storage.save(endInput.id, endInput.value);
        });

        // Expose setDuration globally as it's used in HTML onclick
        window.setDuration = Dates.setDuration;

        // Initial Calc
        Dates.calculateDuration();
    },

    setDuration: (months) => {
        const startInput = document.getElementById('startDate');
        const endInput = document.getElementById('endDate');

        if (!startInput.value) {
            startInput.valueAsDate = new Date();
            startInput.dispatchEvent(new Event('change'));
        }

        const start = new Date(startInput.value);
        const end = new Date(start);
        end.setMonth(start.getMonth() + months);

        endInput.valueAsDate = end;
        endInput.dispatchEvent(new Event('change'));
    },

    calculateDuration: () => {
        const startInput = document.getElementById('startDate');
        const endInput = document.getElementById('endDate');
        const display = document.getElementById('duration-display');

        if (!startInput.value || !endInput.value) {
            if (display) display.textContent = "";
            return;
        }

        const start = new Date(startInput.value);
        const end = new Date(endInput.value);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let text = "";
        if (diffDays < 30) {
            text = `Durasi: ${diffDays} Hari`;
        } else {
            const months = Math.floor(diffDays / 30);
            const days = diffDays % 30;
            text = `Durasi: ± ${months} Bulan ${days > 0 ? days + ' Hari' : ''}`;
        }

        if (display) display.textContent = text;
    }
};
