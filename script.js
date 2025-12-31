document.addEventListener('DOMContentLoaded', () => {

    // --- FORM LOGIC ---
    if (document.getElementById('wizardForm')) {
        // 1. Load Drafted Data
        loadFormData();

        const inputs = document.querySelectorAll('input, textarea');

        // Initial setup for UX (Resize & Check status)
        setTimeout(() => {
            document.querySelectorAll('textarea').forEach(tx => autoResize(tx));
            checkAllSections();
        }, 100);

        // 2. Real-time Listeners
        inputs.forEach(input => {
            const eventType = input.type === 'checkbox' ? 'change' : 'input';

            input.addEventListener(eventType, (e) => {
                const el = e.target;

                // Save to Storage
                if (el.type === 'checkbox') {
                    localStorage.setItem(el.id, el.checked);
                } else {
                    localStorage.setItem(el.id, el.value);
                }

                // UX: Auto Resize Textarea
                if (el.tagName === 'TEXTAREA') {
                    autoResize(el);
                }

                // UX: Check Section Completion
                updateSectionProgress(el);
            });
        });
    }

});

// --- UX FUNCTIONS ---

function autoResize(textarea) {
    textarea.style.height = 'auto'; // Reset height
    textarea.style.height = textarea.scrollHeight + 'px'; // Set to content height
}

function updateSectionProgress(inputElement) {
    // Find parent section
    const section = inputElement.closest('.form-section');
    if (!section) return;

    const title = section.querySelector('h2');
    if (!title) return;

    // Check all inputs in this section
    const inputs = section.querySelectorAll('input, textarea');
    let allFilled = true;

    inputs.forEach(inp => {
        if (!inp.value.trim()) {
            allFilled = false;
        }
    });

    if (allFilled) {
        title.classList.add('section-complete');
    } else {
        title.classList.remove('section-complete');
    }
}

function checkAllSections() {
    const sections = document.querySelectorAll('.form-section');
    sections.forEach(sec => {
        // Pick one input from section to trigger the check logic
        const input = sec.querySelector('input, textarea');
        if (input) updateSectionProgress(input);
    });
}

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
        if (saved !== null) {
            if (input.type === 'checkbox') {
                input.checked = (saved === 'true');
            } else {
                input.value = saved;
            }
        }
    });
}

function saveFormData() {
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        if (input.type === 'checkbox') {
            localStorage.setItem(input.id, input.checked);
        } else {
            localStorage.setItem(input.id, input.value);
        }
    });
}
