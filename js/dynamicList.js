export const DynamicList = {
    init: (fieldList) => {
        fieldList.forEach(id => {
            // Delay slightly to ensure data is loaded
            setTimeout(() => DynamicList.create(id), 100);
        });
    },

    create: (targetId) => {
        const targetTextarea = document.getElementById(targetId);
        if (!targetTextarea) return;

        targetTextarea.style.display = 'none';

        let container = document.getElementById(`list-container-${targetId}`);
        if (!container) {
            container = document.createElement('div');
            container.id = `list-container-${targetId}`;
            container.className = 'dynamic-list-container';
            targetTextarea.parentNode.insertBefore(container, targetTextarea.nextSibling);

            // Add Button
            const addBtn = document.createElement('button');
            addBtn.type = 'button';
            addBtn.className = 'btn-add-list';
            addBtn.innerText = '+ Tambah Item Baru';
            addBtn.onclick = () => DynamicList.addItem(container, targetTextarea, '');
            container.parentNode.insertBefore(addBtn, container.nextSibling);
        }

        // Populate
        const existingValues = targetTextarea.value.split('\n').filter(line => line.trim() !== '');
        container.innerHTML = '';
        existingValues.forEach(val => DynamicList.addItem(container, targetTextarea, val));
    },

    addItem: (container, targetTextarea, value, refItem = null) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'dynamic-item';

        const input = document.createElement('textarea');
        input.rows = 1;
        input.value = value.replace(/^- /, '');
        input.placeholder = 'Ketik poin disini...';

        // Events
        const resize = () => {
            input.style.height = 'auto';
            input.style.height = input.scrollHeight + 'px';
        };

        input.addEventListener('input', () => {
            resize();
            DynamicList.sync(container, targetTextarea);
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                DynamicList.addItem(container, targetTextarea, '', itemDiv);
            }
            if (e.key === 'Backspace' && input.value === '' && container.children.length > 1) {
                if (!e.repeat) {
                    e.preventDefault();
                    const prev = itemDiv.previousElementSibling;
                    itemDiv.remove();
                    DynamicList.sync(container, targetTextarea);
                    if (prev) {
                        const prevInput = prev.querySelector('textarea');
                        if (prevInput) {
                            prevInput.focus();
                            prevInput.setSelectionRange(prevInput.value.length, prevInput.value.length);
                        }
                    }
                }
            }
        });

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'btn-remove';
        removeBtn.innerHTML = '×';
        removeBtn.onclick = () => {
            itemDiv.remove();
            DynamicList.sync(container, targetTextarea);
        };

        itemDiv.appendChild(input);
        itemDiv.appendChild(removeBtn);

        if (refItem && refItem.nextSibling) {
            container.insertBefore(itemDiv, refItem.nextSibling);
        } else {
            container.appendChild(itemDiv);
        }

        if (value === '') input.focus();

        // Initial resize
        setTimeout(resize, 0);

        DynamicList.sync(container, targetTextarea);
    },

    sync: (container, targetTextarea) => {
        const inputs = container.querySelectorAll('textarea');
        const values = Array.from(inputs).map(inp => inp.value.trim()).filter(val => val !== '');
        const formattedValues = values.map(val => val.startsWith('-') ? val : `- ${val}`);

        targetTextarea.value = formattedValues.join('\n');
        targetTextarea.dispatchEvent(new Event('input')); // Trigger global save & auto-check logic
    }
};
