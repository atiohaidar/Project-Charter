export const Visibility = {
    init() {
        const sectionsToToggle = ['background', 'objective', 'deliverables', 'successCriteria', 'customSection'];
        sectionsToToggle.forEach(section => {
            const isChecked = localStorage.getItem(`chk_${section}`) === 'true';
            const el = document.getElementById(`sec-${section}`);
            if (el && !isChecked) el.style.display = 'none';
        });

        // Scope Logic
        const chkScope = localStorage.getItem('chk_scope') === 'true';
        const chkInScope = localStorage.getItem('chk_inScope') === 'true';
        const chkOutScope = localStorage.getItem('chk_outOfScope') === 'true';

        const elSecScope = document.getElementById('sec-scope');
        const elViewScope = document.getElementById('view-scope');
        const elBoxInScope = document.getElementById('box-inScope');
        const elBoxOutScope = document.getElementById('box-outOfScope');

        if (elSecScope) {
            if (!chkScope && elViewScope) elViewScope.style.display = 'none';
            if (!chkInScope && elBoxInScope) elBoxInScope.style.display = 'none';
            if (!chkOutScope && elBoxOutScope) elBoxOutScope.style.display = 'none';
            if (!chkScope && !chkInScope && !chkOutScope) elSecScope.style.display = 'none';
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
};
