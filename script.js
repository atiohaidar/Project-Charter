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
    DynamicList.init(['inScope', 'outOfScope', 'deliverables', 'assumptions', 'risks', 'successCriteria']);
    Navigation.init();
    Signature.init();
    Budget.init();

    // Map Budget functions to window for HTML event handlers
    window.toggleBudgetMode = () => {
        const checked = document.querySelector('input[name="budgetMode"]:checked');
        if (checked) Budget.toggleMode(checked.value);
    };
    window.addCostItem = () => Budget.addItem();
    window.formatCurrencyInput = (el) => Budget.formatCurrency(el);
    window.resetBudget = () => Budget.resetBudget();

    // Global Action for Generate Button
    window.generateDocument = () => {
        if (Signature.canvas) {
            Storage.save('signatureData', Signature.canvas.toDataURL());
        }
        window.location.href = 'document/index.html';
    };
});
