document.addEventListener('DOMContentLoaded', () => {

    // --- FORM LOGIC (index.html) ---
    if (document.getElementById('wizardForm')) {
        // Load drafted data
        loadFormData();

        window.generateDocument = function () {
            saveFormData(); // Save one last time
            window.location.href = 'document.html';
        };

        // Real-time saving
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', (e) => {
                localStorage.setItem(e.target.id, e.target.value);
            });
        });
    }

    // --- DOCUMENT LOGIC (document.html) ---
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
                    el.innerHTML = '-';
                }
            }
        });

        // Current Date for Signatures
        const dateEls = document.querySelectorAll('.current-date');
        const today = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
        dateEls.forEach(el => el.textContent = today);
    }

});

function loadFormData() {
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        const saved = localStorage.getItem(input.id);
        if (saved) input.value = saved;
    });
}

function saveFormData() {
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        localStorage.setItem(input.id, input.value);
    });
}
