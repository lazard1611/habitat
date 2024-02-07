const contact = () => {
    const SELECTORS = {
        form: '.js-form',
        element: '.js-form-element',
        inputFile: '.js-form-file',
        infoFile: '.js-form-file-info',
    }

    const CLASSES = {
        activeState: 'form_input--focus_state',
        errorState: 'form_input--error_state',
        inputFileName: 'form__file_name',
        inputFileReset: 'form__file_reset',
    }

    const $form = document.querySelector(SELECTORS.form);
    if (!$form) return;
    const $formElements = $form.querySelectorAll(SELECTORS.element);
    if (!$formElements.length) return;
    const $inputFile = $form.querySelector(SELECTORS.inputFile);
    if (!$inputFile) return;
    const $infoFile = $form.querySelector(SELECTORS.infoFile);
    if (!$infoFile) return;
    let isFormValid = true;
    let isAddFile = false;
    const $textarea = $form.querySelector('textarea');
    if (!$textarea) return;

    $formElements.forEach(($formEl) => {
        $formEl.addEventListener('change', () => {
            if ($formEl.value !== '') {
                $formEl.classList.add(CLASSES.activeState);
            } else {
                $formEl.classList.remove(CLASSES.activeState);
            }
        });
    })

    $textarea.addEventListener('focus', () => {
        setTimeout(() => {
            // console.log($textarea.value === '');
            $textarea.selectionStart = 0;
            $textarea.selectionEnd = 0;
        }, 0);
    });

    const toggleValidClass = (val, el) => {
        if (val) {
            el.classList.add(CLASSES.errorState);
            isFormValid = false;
        } else {
            el.classList.remove(CLASSES.errorState);
            isFormValid = true;
        }
    }

    const validateEmail = (email) => {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    const addFile = () => {
        if (isAddFile) return;
        const fileResetBtn = document.createElement('div');
        const fileInfoName = document.createElement('div');

        fileResetBtn.classList.add(CLASSES.inputFileReset);
        fileInfoName.classList.add(CLASSES.inputFileName);
        fileInfoName.textContent = $inputFile.files[0].name;
        $infoFile.appendChild(fileInfoName);
        $infoFile.appendChild(fileResetBtn);
        isAddFile = true;
    }


    $inputFile.addEventListener('change', addFile);

    $infoFile.addEventListener('click', (e) => {
        if(e.target.closest(`.${CLASSES.inputFileReset}`)) {
            $infoFile.innerHTML = '';
            $inputFile.value = '';
            isAddFile = false;
        }
    })

    $form.addEventListener('submit', (event) => {
        event.preventDefault();

        $formElements.forEach(($formEl) => {
            const $parentElement = $formEl.parentElement;
            if (!$parentElement) return;
            const $emailElement = $formEl.type === 'email';
            const $emailVal = $formEl.value;
            const $textElement = $formEl.type === 'text';
            const $textVal = $formEl.value;

            if ($textElement) {
                toggleValidClass($textVal === '', $parentElement);
            }

            if ($emailElement) {
                toggleValidClass($emailVal === '' || !validateEmail($emailVal), $parentElement);
            }
        });

        if (!isFormValid) return;
        console.log('submit');
    });
};

export default contact;
