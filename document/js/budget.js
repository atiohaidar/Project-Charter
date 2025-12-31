export const BudgetDisplay = {
    init() {
        const budgetMode = localStorage.getItem('budgetMode') || 'simple';
        const budgetDetailsStr = localStorage.getItem('budgetDetails');
        const budgetDetailedSection = document.getElementById('sec-budget-detailed');
        const budgetSimpleLine = document.getElementById('view-budget');

        if (budgetMode === 'detailed' && budgetDetailsStr) {
            try {
                const items = JSON.parse(budgetDetailsStr);
                const tableBody = document.getElementById('view-budget-details');
                const totalDisplay = document.getElementById('view-budget-total');

                if (items && items.length > 0 && tableBody) {
                    budgetDetailedSection.style.display = 'block';
                    tableBody.innerHTML = '';

                    items.forEach(item => {
                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                            <td style="border: 1px solid #000; padding: 10px;">${item.desc || '-'}</td>
                            <td style="border: 1px solid #000; padding: 10px; text-align: right;">Rp ${item.amount || '0'}</td>
                        `;
                        tableBody.appendChild(tr);
                    });

                    const total = localStorage.getItem('budget') || '0';
                    if (totalDisplay) totalDisplay.innerText = `Rp ${total}`;
                    if (budgetSimpleLine) budgetSimpleLine.innerText = `Rp ${total} (Rincian Terlampir)`;
                }
            } catch (e) {
                console.error("Error parsing budget details", e);
            }
        } else if (budgetSimpleLine) {
            const val = localStorage.getItem('budget') || '0';
            budgetSimpleLine.innerText = `Rp ${val}`;
        }
    }
};
