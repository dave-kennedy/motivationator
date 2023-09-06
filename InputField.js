export default class InputField extends HTMLElement {
    #label;
    #required;
    #type;
    #change;
    #max;
    #min;
    #$input;
    #$error;

    constructor(params) {
        super();

        this.#label = params.label;
        this.#required = params.required;
        this.#type = params.type || 'text';
        this.#change = params.change;

        if (params.max !== undefined) {
            this.#max = params.max;
        }

        if (params.min !== undefined) {
            this.#min = params.min;
        }

        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        this.#render();
    }

    #render() {
        const $style = document.createElement('style');

        $style.textContent = `:host(.error) {
            color: red;
        }

        :host(.error) input {
            border-color: red;
            color: red;
        }

        input:not([type=checkbox]) {
            display: block;
        }`;

        this.shadowRoot.appendChild($style);

        const $row = document.createElement('div');
        this.shadowRoot.appendChild($row);

        const $label = document.createElement('label');
        $label.textContent = this.#label;
        $row.appendChild($label);

        this.#$input = document.createElement('input');
        this.#$input.required = this.#required;
        this.#$input.type = this.#type;
        this.#$input.addEventListener('change', this.#change);

        if (this.#max != undefined) {
            this.#$input.max = this.#max;
        }

        if (this.#min != undefined) {
            this.#$input.min = this.#min;
        }

        $label.appendChild(this.#$input);
    }

    validate() {
        if (!this.#$input.checkValidity()) {
            this.error = this.#$input.validationMessage;
            return false;
        }

        if (this.#required && !this.#$input.value.trim()) {
            this.error = 'Please fill out this field.';
            return false;
        }

        this.error = undefined;
        return true;
    }

    get error() {
        return this.#$error?.textContent;
    }

    set error(message) {
        if (!message) {
            this.classList.remove('error');
            this.#$error?.remove();
            this.#$error = undefined;
            return;
        }

        this.classList.add('error');
        this.#$error = document.createElement('div');
        this.#$error.textContent = message;
        this.shadowRoot.appendChild(this.#$error);
    }

    get value() {
        if (this.#type == 'checkbox') {
            return this.#$input.checked;
        }

        if (this.#type == 'datetime-local') {
            return this.#getUTCDateTime(this.#$input.value);
        }

        if (this.#type == 'number') {
            return this.#$input.valueAsNumber;
        }

        return this.#$input.value.trim();
    }

    set value(value) {
        if (this.#type == 'checkbox') {
            this.#$input.checked = value;
            return;
        }

        if (this.#type == 'datetime-local') {
            this.#$input.value = this.#getLocalDateTime(value);
            return;
        }

        this.#$input.value = value;
    }

    #getLocalDateTime(datetime) {
        // e.g. '2023-08-27T00:03:00Z' -> '2023-08-26T18:03:00'
        const date = new Date(datetime);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hour = date.getHours().toString().padStart(2, '0');
        const minute = date.getMinutes().toString().padStart(2, '0');
        const second = date.getSeconds().toString().padStart(2, '0');
        return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
    }

    #getUTCDateTime(datetime) {
        // e.g. '2023-08-26T18:03:00' -> '2023-08-27T00:03:00Z'
        return new Date(datetime).toISOString();
    }
}

customElements.define('input-field-component', InputField);
