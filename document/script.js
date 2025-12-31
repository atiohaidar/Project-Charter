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
                    el.innerHTML = '-'; // Placeholder
                }
            }
        });

        // Current Date for Signatures
        const dateEls = document.querySelectorAll('.current-date');
        const today = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
        dateEls.forEach(el => el.textContent = today);

        // Current Timestamp for Footer
        const timeEls = document.querySelectorAll('.current-timestamp');
        const now = new Date().toLocaleString('id-ID', {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
        timeEls.forEach(el => el.textContent = now);

        // Sync names for signature placeholder
        const clientName = localStorage.getItem('client');
        const freelancerName = localStorage.getItem('freelancer');

        if (clientName) document.getElementById('view-client-sign').innerText = clientName;
        if (freelancerName) document.getElementById('view-freelancer-sign').innerText = freelancerName;
        // Checkbox Visibility Logic
        const sections = [
            'background', 'objective', 'deliverables', 'successCriteria'
        ];

        sections.forEach(section => {
            const isChecked = localStorage.getItem(`chk_${section}`) !== 'false'; // Default to true
            const el = document.getElementById(`sec-${section}`);
            if (el && !isChecked) {
                el.style.display = 'none';
            }
        });

        // --- SCOPE SECTION LOGIC ---
        const chkScope = localStorage.getItem('chk_scope') !== 'false';
        const chkInScope = localStorage.getItem('chk_inScope') !== 'false';
        const chkOutScope = localStorage.getItem('chk_outOfScope') !== 'false';

        const elSecScope = document.getElementById('sec-scope');
        const elViewScope = document.getElementById('view-scope');
        const elBoxInScope = document.getElementById('box-inScope');
        const elBoxOutScope = document.getElementById('box-outOfScope');

        if (elSecScope) {
            // 1. Control High Level Scope Text
            if (!chkScope) {
                if (elViewScope) elViewScope.style.display = 'none';
            }

            // 2. Control In/Out Scope Boxes
            if (!chkInScope && elBoxInScope) elBoxInScope.style.display = 'none';
            if (!chkOutScope && elBoxOutScope) elBoxOutScope.style.display = 'none';

            // 3. Hide entire section if NOTHING is checked
            if (!chkScope && !chkInScope && !chkOutScope) {
                elSecScope.style.display = 'none';
            }
        }

        // Combined Assumptions & Risks Section
        const chkAssumptions = localStorage.getItem('chk_assumptions') !== 'false';
        const chkRisks = localStorage.getItem('chk_risks') !== 'false';
        const secAssumptions = document.getElementById('sec-assumptions');

        if (secAssumptions) {
            if (!chkAssumptions && !chkRisks) {
                secAssumptions.style.display = 'none';
            } else {
                if (!chkAssumptions) document.getElementById('sub-assumptions').style.display = 'none';
                if (!chkRisks) document.getElementById('sub-risks').style.display = 'none';
            }
        }
    }
});
