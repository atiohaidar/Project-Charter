import { Storage } from './storage.js';
import { UI } from './ui.js';

export const Budget = {
    init: () => {
        const simpleRadio = document.querySelector('input[name="budgetMode"][value="simple"]');
        const detailedRadio = document.querySelector('input[name="budgetMode"][value="detailed"]');

        if (simpleRadio && detailedRadio) {
            simpleRadio.addEventListener('change', () => Budget.toggleMode('simple'));
            detailedRadio.addEventListener('change', () => Budget.toggleMode('detailed'));
        }

        const budgetInput = document.getElementById('budget');
        if (budgetInput) {
            budgetInput.addEventListener('input', (e) => {
                Budget.formatCurrency(e.target);
                Storage.save('budget', e.target.value);
            });
        }

        // Load existing mode
        const savedMode = Storage.get('budgetMode') || 'simple';
        Budget.toggleMode(savedMode);

        // Load detailed items
        Budget.loadItems();
    },

    toggleMode: (mode) => {
        const simpleDiv = document.getElementById('budget-simple');
        const detailedDiv = document.getElementById('budget-detailed');
        if (!simpleDiv || !detailedDiv) return;

        if (mode === 'simple') {
            simpleDiv.style.display = 'block';
            detailedDiv.style.display = 'none';
        } else {
            simpleDiv.style.display = 'none';
            detailedDiv.style.display = 'block';

            // Add default item if empty
            const container = document.getElementById('cost-items-container');
            if (container && container.children.length === 0) {
                Budget.addItem();
            }
            Budget.updateTotal();
        }

        Storage.save('budgetMode', mode);

        // Update radios to match visually
        const radio = document.querySelector(`input[name="budgetMode"][value="${mode}"]`);
        if (radio) radio.checked = true;
    },

    formatCurrency: (input) => {
        let value = input.value.replace(/\D/g, '');
        if (value === '') {
            input.value = '';
            return;
        }
        input.value = Budget.formatNumber(value);
    },

    formatNumber: (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },

    addItem: (desc = '', amount = '') => {
        const container = document.getElementById('cost-items-container');
        if (!container) return;

        const div = document.createElement('div');
        div.className = 'cost-item';

        div.innerHTML = `
            <div class="cost-desc-wrapper">
                <input type="text" class="cost-desc" placeholder="Deskripsi (misal: Desain)" value="${desc}">
            </div>
            <div class="cost-amount-wrapper">
                <input type="text" class="cost-amount" placeholder="0" value="${amount}">
            </div>
            <button type="button" class="btn-remove-cost">×</button>
        `;

        const descInp = div.querySelector('.cost-desc');
        const amountInp = div.querySelector('.cost-amount');
        const removeBtn = div.querySelector('.btn-remove-cost');

        const handleEnter = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                Budget.addItem();
                const allItems = document.querySelectorAll('.cost-desc');
                if (allItems.length > 0) {
                    allItems[allItems.length - 1].focus();
                }
            }
        };

        amountInp.addEventListener('input', (e) => {
            Budget.formatCurrency(e.target);
            Budget.updateTotal();
            Budget.saveItems();
        });

        amountInp.addEventListener('keydown', handleEnter);
        descInp.addEventListener('keydown', handleEnter);
        descInp.addEventListener('input', () => Budget.saveItems());

        removeBtn.addEventListener('click', () => {
            div.remove();
            Budget.updateTotal();
            Budget.saveItems();
        });

        container.appendChild(div);
        if (amount) Budget.formatCurrency(amountInp);
    },

    updateTotal: () => {
        let total = 0;
        document.querySelectorAll('.cost-amount').forEach(inp => {
            const val = inp.value.replace(/\./g, '');
            if (val) total += parseInt(val, 10);
        });

        const totalSpan = document.getElementById('calculated-total');
        if (totalSpan) {
            totalSpan.innerText = Budget.formatNumber(total);
        }

        // Sync to the main 'budget' key only if in detailed mode
        const mode = Storage.get('budgetMode');
        if (mode === 'detailed') {
            Storage.save('budget', Budget.formatNumber(total));
        }
    },

    saveItems: () => {
        const items = [];
        document.querySelectorAll('.cost-item').forEach(div => {
            const desc = div.querySelector('.cost-desc').value;
            const amount = div.querySelector('.cost-amount').value;
            if (desc || amount) {
                items.push({ desc, amount });
            }
        });
        Storage.save('budgetDetails', JSON.stringify(items));
    },

    loadItems: () => {
        const saved = Storage.get('budgetDetails');
        if (saved) {
            try {
                const items = JSON.parse(saved);
                const container = document.getElementById('cost-items-container');
                if (container && items.length > 0) {
                    container.innerHTML = '';
                    items.forEach(item => Budget.addItem(item.desc, item.amount));
                    Budget.updateTotal();
                }
            } catch (e) {
                console.error("Error loading budget items", e);
            }
        }
    },

    resetBudget: () => {
        if (!confirm('Hapus semua isian anggaran dan rinciannya?')) return;

        // 1. Clear Storage
        Storage.save('budget', '');
        Storage.save('budgetDetails', '[]');

        // 2. Clear UI Simple
        const budgetInput = document.getElementById('budget');
        if (budgetInput) budgetInput.value = '';

        // 3. Clear UI Detailed
        const container = document.getElementById('cost-items-container');
        if (container) {
            container.innerHTML = '';
            Budget.addItem(); // add one empty row back
        }

        // 4. Update Summary
        Budget.updateTotal();
    }
};
