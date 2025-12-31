document.addEventListener('DOMContentLoaded', () => {

    // --- FORM LOGIC ---
    if (document.getElementById('wizardForm')) {
        // Load drafted data
        loadFormData();

        // Real-time saving
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', (e) => {
                localStorage.setItem(e.target.id, e.target.value);
            });
        });
    }

});

// Global function to be called by button
window.generateDocument = function () {
    saveFormData(); // Save one last time
    // Navigate to the document folder
    window.location.href = 'document/index.html';
};

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
