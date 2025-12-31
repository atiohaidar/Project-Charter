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
                    // If user manually unchecks, we might want to flag it so it doesn't auto-check immediately again? 
                    // For now, simple logic: manual control allows uncheck.
                } else {
                    localStorage.setItem(el.id, el.value);

                    // UX: Auto-Check Logic
                    // Try to find a corresponding checkbox
                    const checkId = 'chk_' + el.id;
                    const relatedCheckbox = document.getElementById(checkId);

                    if (relatedCheckbox) {
                        // If input has content and checkbox is NOT checked, check it.
                        // However, we only do this if it was previously empty, or to ensure "filled = checked" logic?
                        // User said: "default empty, but if filled, then checked. But after filled can be unchecked."
                        // Setting it to true on every input event would prevent unchecking if user is typing.
                        // So, we only auto-check if the user hasn't explicitly unchecked it? 
                        // Or better: Auto-check only if the previous value was empty?
                        // Let's try: if (value.length > 0 && !relatedCheckbox.checked) -> check it.
                        // But we need to avoid fighting the user.
                        // If user unchecked it, relatedCheckbox.checked is false. If they type, it becomes true. 
                        // This implies if they WANT it unchecked, they should uncheck it AFTER typing.
                        if (el.value.trim().length > 0 && !relatedCheckbox.checked) {
                            relatedCheckbox.checked = true;
                            localStorage.setItem(relatedCheckbox.id, 'true');
                        }
                    }
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

// --- DATE LOGIC ---
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');
const durationDisplay = document.getElementById('duration-display');

if (startDateInput && endDateInput) {
    // Set Min Date to Today
    const today = new Date().toISOString().split('T')[0];
    startDateInput.min = today;

    // Update End Date Min when Start Date changes
    startDateInput.addEventListener('change', () => {
        endDateInput.min = startDateInput.value;
        calculateDuration();
    });

    endDateInput.addEventListener('change', calculateDuration);

    // Initial run
    calculateDuration();
}

// Global scope for the buttons
window.setDuration = function (months) {
    if (!startDateInput.value) {
        // If empty, set to today
        startDateInput.valueAsDate = new Date();
        // Trigger change event to save to localStorage
        startDateInput.dispatchEvent(new Event('input'));
    }

    const start = new Date(startDateInput.value);
    const end = new Date(start);
    end.setMonth(start.getMonth() + months);

    endDateInput.valueAsDate = end;
    // Trigger change event to save to localStorage
    endDateInput.dispatchEvent(new Event('input'));

    calculateDuration();
};

function calculateDuration() {
    if (!startDateInput.value || !endDateInput.value) {
        if (durationDisplay) durationDisplay.textContent = "";
        return;
    }

    const start = new Date(startDateInput.value);
    const end = new Date(endDateInput.value);

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

    if (durationDisplay) durationDisplay.textContent = text;
}

// --- UX FUNCTIONS ---

function autoResize(textarea) {
    if (textarea.style.display === 'none') return; // Don't resize hidden textareas
    textarea.style.height = 'auto'; // Reset height
    textarea.style.height = textarea.scrollHeight + 'px'; // Set to content height
}

function updateSectionProgress(inputElement) {
    // Find parent section
    const section = inputElement.closest('.form-section');
    if (!section) return;

    const title = section.querySelector('h2');
    if (!title) return;

    // Check all inputs in this section (exclude hidden textareas that are replaced by dynamic lists)
    const inputs = section.querySelectorAll('input, textarea');
    let allFilled = true;

    // Only check visible inputs or dynamic list inputs
    inputs.forEach(inp => {
        if (inp.style.display !== 'none' && !inp.value.trim()) {
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

// --- DYNAMIC LIST BUILDER ---
function makeDynamicList(targetId) {
    const targetTextarea = document.getElementById(targetId);
    if (!targetTextarea) return;

    // Hide original textarea
    targetTextarea.style.display = 'none';

    // Create container if not exists
    let container = document.getElementById(`list-container-${targetId}`);
    if (!container) {
        container = document.createElement('div');
        container.id = `list-container-${targetId}`;
        container.className = 'dynamic-list-container';
        targetTextarea.parentNode.insertBefore(container, targetTextarea.nextSibling);
    }

    // Add "Add Item" button
    let addBtn = document.getElementById(`btn-add-${targetId}`);
    if (!addBtn) {
        addBtn = document.createElement('button');
        addBtn.id = `btn-add-${targetId}`;
        addBtn.type = 'button';
        addBtn.className = 'btn-add-list';
        addBtn.innerText = '+ Tambah Item Baru';
        addBtn.onclick = () => addListItem(container, targetTextarea, '');
        container.parentNode.insertBefore(addBtn, container.nextSibling);
    }

    // Initialize items from saved value
    const existingValues = targetTextarea.value.split('\n').filter(line => line.trim() !== '');
    container.innerHTML = ''; // Clear current

    // If empty, add at least one empty row
    if (existingValues.length === 0) {
        // Optional: Start empty or start with one row. Let's start with empty to be clean.
    } else {
        existingValues.forEach(val => addListItem(container, targetTextarea, val));
    }
}

function addListItem(container, targetTextarea, value, refItem = null) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'dynamic-item';

    const input = document.createElement('textarea');
    input.rows = 1;
    input.value = value.replace(/^- /, ''); // Remove existing dash if any
    input.placeholder = 'Ketik poin disini...';

    // Auto resize function within context
    const resize = () => {
        input.style.height = 'auto';
        input.style.height = input.scrollHeight + 'px';
    };

    // Update main textarea on change
    input.addEventListener('input', () => {
        resize();
        syncToTextarea(container, targetTextarea);
    });

    // Handle Enter vs Shift+Enter
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Prevent new line in this box
            // Add new item below this one
            addListItem(container, targetTextarea, '', itemDiv);
        }

        // Backspace to delete empty item
        if (e.key === 'Backspace' && input.value === '' && container.children.length > 1) {
            if (!e.repeat) {
                e.preventDefault();
                const prev = itemDiv.previousElementSibling;
                itemDiv.remove();
                syncToTextarea(container, targetTextarea);

                if (prev) {
                    const prevInput = prev.querySelector('textarea');
                    if (prevInput) {
                        prevInput.focus();
                        // Set cursor to end
                        prevInput.setSelectionRange(prevInput.value.length, prevInput.value.length);
                    }
                }
            }
        }
    });

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'btn-remove';
    removeBtn.innerHTML = '×'; // Multiply symbol for X
    removeBtn.onclick = () => {
        itemDiv.remove();
        syncToTextarea(container, targetTextarea);
    };

    itemDiv.appendChild(input);
    itemDiv.appendChild(removeBtn);

    // Insert logic
    if (refItem && refItem.nextSibling) {
        container.insertBefore(itemDiv, refItem.nextSibling);
    } else {
        container.appendChild(itemDiv);
    }

    // Focus new input if added manually (empty value)
    if (value === '') {
        input.focus();
    } else {
        // Initial resize for existing content
        setTimeout(resize, 0);
    }

    syncToTextarea(container, targetTextarea);
}

function syncToTextarea(container, targetTextarea) {
    const inputs = container.querySelectorAll('textarea');
    const values = Array.from(inputs).map(inp => inp.value.trim()).filter(val => val !== '');

    // Add dash prefix automatically for standard bullet format
    const formattedValues = values.map(val => val.startsWith('-') ? val : `- ${val}`);

    targetTextarea.value = formattedValues.join('\n');

    // Trigger input event for localStorage saving
    targetTextarea.dispatchEvent(new Event('input'));
}

// Initialize Dynamic Lists
const listFields = ['inScope', 'outOfScope', 'deliverables', 'assumptions', 'risks', 'successCriteria'];
listFields.forEach(id => {
    // Wait for loadFormData to finish
    setTimeout(() => makeDynamicList(id), 150);
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
