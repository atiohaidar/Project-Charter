document.addEventListener('DOMContentLoaded', () => {
    // --- DOCUMENT LOGIC ---
    if (document.getElementById('doc-content')) {
        const fields = [
            'projectName', 'projectId', 'client', 'freelancer',
            'startDate', 'endDate', 'budget',
            'background', 'objective', 'scope', 'inScope', 'outOfScope',
            'deliverables', 'assumptions', 'risks', 'successCriteria'
        ];

        fields.forEach(field => {
            let el = document.getElementById(`view-${field}`);
            if (el) {
                let savedVal = localStorage.getItem(field);

                // Format new lines for textareas
                if (savedVal) {
                    savedVal = savedVal.replace(/\n/g, '<br>');
                    el.innerHTML = savedVal;
                } else {
                    el.innerHTML = '-'; // Placeholder
                }
            }
        });

        // Current Date for Signatures
        const dateEls = document.querySelectorAll('.current-date');
        const today = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
        dateEls.forEach(el => el.textContent = today);

        // Sync names for signature placeholder
        const clientName = localStorage.getItem('client');
        const freelancerName = localStorage.getItem('freelancer');

        if (clientName) document.getElementById('view-client-sign').innerText = clientName;
        if (freelancerName) document.getElementById('view-freelancer-sign').innerText = freelancerName;
    }
});
