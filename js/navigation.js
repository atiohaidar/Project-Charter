import { Storage } from './storage.js';

export const Navigation = {
    init: () => {
        const sections = document.querySelectorAll('.form-section');
        const container = document.createElement('div');
        container.id = 'sticky-tabs';
        const colors = ['#ef9a9a', '#ffcc80', '#80deea', '#c5e1a5', '#b39ddb'];

        sections.forEach((sec, index) => {
            if (!sec.id) sec.id = `section-${index + 1}`;

            const link = document.createElement('a');
            link.href = `#${sec.id}`;
            link.id = `tab-${sec.id}`;
            link.className = 'tab-link';
            link.textContent = index + 1;

            const h2 = sec.querySelector('h2');
            link.title = h2 ? h2.innerText.replace(/^\d+\.\s*/, '') : `Bagian ${index + 1}`;
            link.style.setProperty('--tab-color', colors[index % colors.length]);

            link.onclick = (e) => {
                e.preventDefault();
                document.getElementById(sec.id).scrollIntoView({ behavior: 'smooth' });
            };

            container.appendChild(link);
        });

        document.body.appendChild(container);

        // Reset Button
        const btn = document.createElement('button');
        btn.id = 'btn-reset-all';
        btn.innerHTML = '🗑️';
        btn.title = "Hapus semua data via Reset";
        btn.onclick = Navigation.resetAll;
        document.body.appendChild(btn);
    },

    resetAll: () => {
        if (confirm('⚠️ Hapus SEMUA data dan mulai dari awal?')) {
            Storage.clear();
            document.getElementById('wizardForm')?.reset();
            location.reload();
        }
    }
};
