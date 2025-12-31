import { Storage } from './storage.js';

export const UI = {
    init: () => {
        // Auto-resize all textareas
        document.querySelectorAll('textarea').forEach(tx => UI.autoResize(tx));

        // Check all sections completion status
        UI.checkAllSections();

        // Setup real-time listeners for all inputs
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            const eventType = input.type === 'checkbox' ? 'change' : 'input';
            input.addEventListener(eventType, UI.handleInputEvent);
        });
    },

    handleInputEvent: (e) => {
        const el = e.target;

        // 1. Save Data
        if (el.type === 'checkbox') {
            Storage.save(el.id, el.checked);
        } else {
            Storage.save(el.id, el.value);
            // Trigger Auto-Check Logic for text inputs
            UI.handleAutoCheck(el);
        }

        // 2. Auto Resize
        if (el.tagName === 'TEXTAREA') {
            UI.autoResize(el);
        }

        // 3. Update Progress
        UI.updateSectionProgress(el);
    },

    handleAutoCheck: (el) => {
        const checkId = 'chk_' + el.id;
        const relatedCheckbox = document.getElementById(checkId);

        if (relatedCheckbox) {
            const hasContent = el.value.trim().length > 0;

            if (hasContent && !relatedCheckbox.checked) {
                relatedCheckbox.checked = true;
                Storage.save(relatedCheckbox.id, 'true');
            } else if (!hasContent && relatedCheckbox.checked) {
                relatedCheckbox.checked = false;
                Storage.save(relatedCheckbox.id, 'false');
            }
        }
    },

    autoResize: (textarea) => {
        if (textarea.style.display === 'none') return;
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    },

    updateSectionProgress: (inputElement) => {
        const section = inputElement.closest('.form-section');
        if (!section) return;

        const title = section.querySelector('h2');
        if (!title) return;

        const inputs = section.querySelectorAll('input, textarea');
        let allFilled = true;

        inputs.forEach(inp => {
            if (inp.style.display !== 'none' && !inp.value.trim()) {
                allFilled = false;
            }
        });

        if (allFilled) title.classList.add('section-complete');
        else title.classList.remove('section-complete');

        // Update Tab
        if (section.id) {
            const tab = document.getElementById(`tab-${section.id}`);
            if (tab) {
                allFilled ? tab.classList.add('complete') : tab.classList.remove('complete');
            }
        }
    },

    checkAllSections: () => {
        document.querySelectorAll('.form-section').forEach(sec => {
            const input = sec.querySelector('input, textarea');
            if (input) UI.updateSectionProgress(input);
        });
    }
};
