import { Storage } from './storage.js';

export const Budget = {
    init: () => {
        // Expose functions to window for HTML event handlers
        window.toggleBudgetMode = Budget.toggleMode;
        window.formatCurrencyInput = Budget.formatCurrency;
        window.addCostItem = () => Budget.addListItem();
        window.removeCostItem = (btn) => Budget.removeItem(btn);

        // Initial Load
        const savedMode = Storage.get('budgetMode') || 'simple';
        const radio = document.querySelector(`input[name="budgetMode"][value="${savedMode}"]`);
        if (radio) radio.checked = true;
        Budget.toggleMode();

        // Load detailed items if any
        const savedItems = Storage.get('budgetDetails');
        if (savedItems) {
            const items = JSON.parse(savedItems);
            items.forEach(item => Budget.addListItem(item.desc, item.price));
        }

        Budget.calculateTotal();
    },

    toggleMode: () => {
        const mode = document.querySelector('input[name="budgetMode"]:checked').value;
        const simpleDiv = document.getElementById('budget-simple');
        const detailedDiv = document.getElementById('budget-detailed');

        if (mode === 'simple') {
            simpleDiv.style.display = 'block';
            detailedDiv.style.display = 'none';
        } else {
            simpleDiv.style.display = 'none';
            detailedDiv.style.display = 'block';
        }

        Storage.save('budgetMode', mode);
    },

    formatCurrency: (el) => {
        let val = el.value.replace(/[^0-9]/g, '');
        if (val) {
            el.value = parseInt(val).toLocaleString('id-ID');
        } else {
            el.value = '';
        }
        Budget.calculateTotal();
    },

    addListItem: (desc = '', price = '') => {
        const container = document.getElementById('cost-items-container');
        const div = document.createElement('div');
        div.className = 'cost-item';
        div.style = "display: flex; gap: 10px; margin-bottom: 10px; align-items: center;";

        div.innerHTML = `
            <input type="text" placeholder="Deskripsi Biaya" value="${desc}" oninput="Budget.syncDetails()" style="flex: 2;">
            <input type="text" placeholder="0" value="${price}" oninput="formatCurrencyInput(this); Budget.syncDetails()" style="flex: 1; text-align: right;">
            <button type="button" onclick="removeCostItem(this)" style="background:none; border:none; color:red; cursor:pointer; font-size:1.2em;">×</button>
        `;

        container.appendChild(div);
        Budget.syncDetails();
    },

    removeItem: (btn) => {
        btn.parentElement.remove();
        Budget.syncDetails();
        Budget.calculateTotal();
    },

    syncDetails: () => {
        const container = document.getElementById('cost-items-container');
        const rows = container.querySelectorAll('.cost-item');
        const items = Array.from(rows).map(row => {
            const inputs = row.querySelectorAll('input');
            return {
                desc: inputs[0].value,
                price: inputs[1].value
            };
        });
        Storage.save('budgetDetails', JSON.stringify(items));
    },

    calculateTotal: () => {
        const mode = document.querySelector('input[name="budgetMode"]:checked')?.value;
        let total = 0;

        if (mode === 'simple') {
            const val = document.getElementById('budget').value.replace(/[^0-9]/g, '');
            total = parseInt(val) || 0;
        } else {
            const container = document.getElementById('cost-items-container');
            const prices = container.querySelectorAll('input[placeholder="0"]');
            prices.forEach(inp => {
                const val = inp.value.replace(/[^0-9]/g, '');
                total += (parseInt(val) || 0);
            });

            const display = document.getElementById('calculated-total');
            if (display) display.textContent = total.toLocaleString('id-ID');

            // Sync this total to the main hidden/alternate budget field for the document logic?
            // Usually the document logic expects one 'budget' field.
            // Let's mirror the calculated total to the simple budget input so the document picks it up.
            const simpleInput = document.getElementById('budget');
            if (simpleInput) simpleInput.value = total.toLocaleString('id-ID');
        }
    }
};

// Internal reference for oninput inside HTML string templates
window.Budget = Budget;
