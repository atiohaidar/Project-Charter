import { DataLoader } from './js/dataLoader.js';
import { BudgetDisplay } from './js/budget.js';
import { SignaturePad } from './js/signature.js';
import { Visibility } from './js/visibility.js';
import { Themes } from './js/themes.js';

document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on the document page
    if (!document.getElementById('doc-content')) return;

    // 1. Load basic text fields
    const fields = [
        'projectName', 'projectId', 'client', 'freelancer',
        'startDate', 'endDate', 'budget',
        'background', 'objective', 'scope', 'inScope', 'outOfScope',
        'deliverables', 'assumptions', 'risks', 'successCriteria'
    ];
    DataLoader.loadFields(fields);
    DataLoader.setDates();
    DataLoader.syncSignatureNames();

    // 2. Handle complex displays
    BudgetDisplay.init();
    Visibility.init();
    Themes.init();

    // 3. Setup signatures
    SignaturePad.setup('sig-client', 'signatureDataClient');
    SignaturePad.setup('sig-developer', 'signatureDataDeveloper');
});
