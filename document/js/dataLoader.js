export const DataLoader = {
    loadFields(fields) {
        fields.forEach(field => {
            let el = document.getElementById(`view-${field}`);
            if (el) {
                let savedVal = localStorage.getItem(field);
                if (savedVal) {
                    savedVal = savedVal.replace(/\n/g, '<br>');
                    el.innerHTML = savedVal;
                } else {
                    el.innerHTML = '-';
                }
            }
        });
    },

    setDates() {
        const dateEls = document.querySelectorAll('.current-date');
        const today = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
        dateEls.forEach(el => el.textContent = today);

        const timeEls = document.querySelectorAll('.current-timestamp');
        const d = new Date();
        const day = d.getDate();
        const month = d.toLocaleDateString('id-ID', { month: 'long' });
        const year = d.getFullYear();
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');

        const timestampStr = `${day} ${month} ${year} pukul ${hours}.${minutes}`;
        timeEls.forEach(el => el.textContent = timestampStr);
    },

    syncSignatureNames() {
        const clientName = localStorage.getItem('client');
        const freelancerName = localStorage.getItem('freelancer');

        if (clientName) {
            const signEl = document.getElementById('view-client-sign');
            if (signEl) signEl.innerText = clientName;
        }
        if (freelancerName) {
            const signEl = document.getElementById('view-freelancer-sign');
            if (signEl) signEl.innerText = freelancerName;
        }
    }
};
