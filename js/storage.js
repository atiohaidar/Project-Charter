export const Storage = {
    save: (key, value) => {
        localStorage.setItem(key, value);
    },
    get: (key) => {
        return localStorage.getItem(key);
    },
    clear: () => {
        localStorage.clear();
    },
    loadAll: (SignatureModule) => {
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            const saved = localStorage.getItem(input.id);
            if (saved !== null) {
                if (input.type === 'checkbox') {
                    input.checked = (saved === 'true');
                } else {
                    input.value = saved;
                }
            } else {
                // If storage is empty but input has default value/content, save it to storage
                if (input.value.trim() !== '') {
                    localStorage.setItem(input.id, input.value);
                }
            }
        });

        // Load Signature using the passed Signature module to avoid circular dependency
        if (SignatureModule && SignatureModule.load) {
            const sigData = localStorage.getItem('signatureData');
            if (sigData) SignatureModule.load(sigData);
        }
    }
};
