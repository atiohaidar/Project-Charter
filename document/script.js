document.addEventListener('DOMContentLoaded', () => {
    // --- DOCUMENT LOGIC ---
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

        // --- HANDLE BUDGET DISPLAY ---
        const budgetMode = localStorage.getItem('budgetMode') || 'simple';
        const budgetDetailsStr = localStorage.getItem('budgetDetails');
        const budgetDetailedSection = document.getElementById('sec-budget-detailed');
        const budgetSimpleLine = document.getElementById('view-budget'); // The span in metadata

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
                    if (totalDisplay) {
                        totalDisplay.innerText = `Rp ${total}`;
                    }

                    // Update the simple budget line in metadata to include a note
                    if (budgetSimpleLine) {
                        budgetSimpleLine.innerText = `Rp ${total} (Rincian Terlampir)`;
                    }
                }
            } catch (e) {
                console.error("Error parsing budget details", e);
            }
        } else if (budgetSimpleLine) {
            // Simple mode: ensure it has Rp prefix
            const val = localStorage.getItem('budget') || '0';
            budgetSimpleLine.innerText = `Rp ${val}`;
        }

        // Current Date for Signatures
        const dateEls = document.querySelectorAll('.current-date');
        const today = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
        dateEls.forEach(el => el.textContent = today);

        // Current Timestamp for Footer
        const timeEls = document.querySelectorAll('.current-timestamp');
        const d = new Date();
        const day = d.getDate();
        const month = d.toLocaleDateString('id-ID', { month: 'long' });
        const year = d.getFullYear();
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');

        const timestampStr = `${day} ${month} ${year} pukul ${hours}.${minutes}`;
        timeEls.forEach(el => el.textContent = timestampStr);

        // Sync names for signature placeholder
        const clientName = localStorage.getItem('client');
        const freelancerName = localStorage.getItem('freelancer');

        if (clientName) {
            const signEl = document.getElementById('view-client-sign');
            if (signEl) signEl.innerText = clientName;
        }
        if (freelancerName) {
            const signEl = document.getElementById('view-freelancer-sign');
            if (signEl) signEl.innerText = freelancerName;
        }

        // --- SIGNATURE PAD LOGIC ---
        const setupSignature = (canvasId, storageKey) => {
            const canvas = document.getElementById(canvasId);
            if (!canvas) return;

            const ctx = canvas.getContext('2d');

            // Fix Resolution for sharp lines (Retina/High-DPI)
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);
            canvas.style.width = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;

            let isDrawing = false;

            // Context Style - Natural Ink Blue
            ctx.strokeStyle = '#1a237e';
            ctx.lineWidth = 2.5;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';

            const getPos = (e) => {
                const rect = canvas.getBoundingClientRect();
                const clientX = e.clientX || (e.touches && e.touches[0].clientX);
                const clientY = e.clientY || (e.touches && e.touches[0].clientY);
                return {
                    x: clientX - rect.left,
                    y: clientY - rect.top
                };
            };
            // ... (rest of the logic remains same, but using the sharper context)
            const start = (e) => {
                isDrawing = true;
                const pos = getPos(e);
                ctx.beginPath();
                ctx.moveTo(pos.x, pos.y);
            };

            const draw = (e) => {
                if (!isDrawing) return;
                const pos = getPos(e);
                ctx.lineTo(pos.x, pos.y);
                ctx.stroke();
            };

            const stop = () => {
                if (isDrawing) {
                    isDrawing = false;
                    localStorage.setItem(storageKey, canvas.toDataURL());
                }
            };

            canvas.addEventListener('mousedown', start);
            canvas.addEventListener('mousemove', draw);
            canvas.addEventListener('mouseup', stop);
            canvas.addEventListener('mouseout', stop);

            canvas.addEventListener('touchstart', (e) => {
                if (e.target === canvas) e.preventDefault();
                start(e);
            }, { passive: false });
            canvas.addEventListener('touchmove', (e) => {
                if (e.target === canvas) e.preventDefault();
                draw(e);
            }, { passive: false });
            canvas.addEventListener('touchend', stop);
            canvas.addEventListener('touchcancel', stop);

            const saved = localStorage.getItem(storageKey);
            if (saved) {
                const img = new Image();
                img.onload = () => ctx.drawImage(img, 0, 0, rect.width, rect.height);
                img.src = saved;
            }

            // --- Clear Functionality ---
            const clearBtnId = canvasId === 'sig-client' ? 'clear-sig-client' : 'clear-sig-developer';
            const clearBtn = document.getElementById(clearBtnId);
            if (clearBtn) {
                clearBtn.addEventListener('click', () => {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    localStorage.removeItem(storageKey);
                });
            }
        };

        setupSignature('sig-client', 'signatureDataClient');
        setupSignature('sig-developer', 'signatureDataDeveloper');

        // --- VISIBILITY LOGIC ---
        // Hide sections that are not checked/filled in the form
        const sectionsToToggle = [
            'background', 'objective', 'deliverables', 'successCriteria'
        ];

        sectionsToToggle.forEach(section => {
            const isChecked = localStorage.getItem(`chk_${section}`) === 'true';
            const el = document.getElementById(`sec-${section}`);
            if (el && !isChecked) {
                el.style.display = 'none';
            }
        });

        // Scope Logic (Complex karena ada sub-checkbox)
        const chkScope = localStorage.getItem('chk_scope') === 'true';
        const chkInScope = localStorage.getItem('chk_inScope') === 'true';
        const chkOutScope = localStorage.getItem('chk_outOfScope') === 'true';

        const elSecScope = document.getElementById('sec-scope');
        const elViewScope = document.getElementById('view-scope');
        const elBoxInScope = document.getElementById('box-inScope');
        const elBoxOutScope = document.getElementById('box-outOfScope');

        if (elSecScope) {
            if (!chkScope) {
                if (elViewScope) elViewScope.style.display = 'none';
            }
            if (!chkInScope && elBoxInScope) elBoxInScope.style.display = 'none';
            if (!chkOutScope && elBoxOutScope) elBoxOutScope.style.display = 'none';

            // Hide entire scope section if nothing is checked
            if (!chkScope && !chkInScope && !chkOutScope) {
                elSecScope.style.display = 'none';
            }
        }

        // Assumptions & Risks Logic
        const chkAssumptions = localStorage.getItem('chk_assumptions') === 'true';
        const chkRisks = localStorage.getItem('chk_risks') === 'true';
        const secAssumptions = document.getElementById('sec-assumptions');

        if (secAssumptions) {
            if (!chkAssumptions && !chkRisks) {
                secAssumptions.style.display = 'none';
            } else {
                const subAssumptions = document.getElementById('sub-assumptions');
                const subRisks = document.getElementById('sub-risks');
                if (!chkAssumptions && subAssumptions) subAssumptions.style.display = 'none';
                if (!chkRisks && subRisks) subRisks.style.display = 'none';
            }
        }
    }
});
