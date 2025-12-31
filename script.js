import { Storage } from './js/storage.js';
import { UI } from './js/ui.js';
import { Dates } from './js/dates.js';
import { DynamicList } from './js/dynamicList.js';
import { Navigation } from './js/navigation.js';
import { Signature } from './js/signature.js';
import { Budget } from './js/budget.js';

// Main App Logic
document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('wizardForm')) return;

    // Load Data
    Storage.loadAll(Signature);

    // Initialize Modules
    UI.init();
    Dates.init();
    Budget.init();
    DynamicList.init(['inScope', 'outOfScope', 'deliverables', 'assumptions', 'risks', 'successCriteria']);
    Navigation.init();
    Signature.init();

    // Global Action for Generate Button (still needs to be on window for onclick attr or changed to listener)
    // Ideally, we move this to a proper listener in the future, but for compatibility with existing HTML:
    window.generateDocument = () => {
        // Ensure signature is saved before navigation
        if (Signature.canvas) {
            Storage.save('signatureData', Signature.canvas.toDataURL());
        }
        window.location.href = 'document/index.html';
    };
});
