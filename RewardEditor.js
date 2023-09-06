import Button from './Button.js';
import HistoryData from './HistoryData.js';
import InputField from './InputField.js';
import RewardsData from './RewardsData.js';

export default class RewardEditor extends HTMLElement {
    #data;
    #$nameField;
    #$descriptionField;
    #$pointsField;
    #$repeatField;
    #$redeemedField;

    constructor(data) {
        super();

        this.#data = {...data};

        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        this.#render();
        this.#listen();
    }

    #render() {
        const $style = document.createElement('style');

        $style.textContent = `:host {
            display: flex;
            align-items: center;
            justify-content: center;

            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;

            background-color: rgba(0, 0, 0, 0.3);
        }

        .modal {
            display: flex;
            flex-direction: column;
            gap: 1em;

            background-color: tan;
            border: 1px solid black;
            box-shadow: 3px 3px 3px gray;
            padding: 1em;
        }`;

        this.shadowRoot.appendChild($style);

        const $modal = document.createElement('div');
        $modal.className = 'modal';
        this.shadowRoot.appendChild($modal);

        const $title = document.createElement('h2');
        $title.textContent = this.#data.id ? 'Edit Reward' : 'New Reward';
        $modal.appendChild($title);

        this.#$nameField = new InputField({label: 'Name', required: true});
        $modal.appendChild(this.#$nameField);

        if (this.#data.name) {
            this.#$nameField.value = this.#data.name;
        }

        this.#$descriptionField = new InputField({label: 'Description'});
        $modal.appendChild(this.#$descriptionField);

        if (this.#data.description) {
            this.#$descriptionField.value = this.#data.description;
        }

        this.#$pointsField = new InputField({
            label: 'Points',
            required: true,
            type: 'number',
            min: 0,
        });

        $modal.appendChild(this.#$pointsField);
        this.#$pointsField.value = this.#data.points;

        this.#$repeatField = new InputField({label: 'Repeat', type: 'checkbox'});
        $modal.appendChild(this.#$repeatField);
        this.#$repeatField.value = this.#data.repeat;

        if (this.#data.redeemed) {
            this.#$redeemedField = new InputField({
                label: 'Redeemed',
                type: 'datetime-local',
            });

            $modal.appendChild(this.#$redeemedField);
            this.#$redeemedField.value = this.#data.redeemed;
        }

        const $cancelButton = new Button({text: 'Cancel', click: _ => this.remove()});
        $modal.appendChild($cancelButton);

        const $saveButton = new Button({text: 'Save', click: _ => this.#save()});
        $modal.appendChild($saveButton);
    }

    #listen() {
        this.addEventListener('keyup', event => {
            if (event.key == 'Enter') {
                this.#save();
            } else if (event.key == 'Escape') {
                this.remove();
            }
        });
    }

    #save() {
        if (!this.#validate()) {
            return;
        }

        if (!this.#data.id) {
            RewardsData.add({
                id: crypto.randomUUID(),
                name: this.#$nameField.value,
                description: this.#$descriptionField.value,
                points: this.#$pointsField.value,
                repeat: this.#$repeatField.value,
                created: new Date().toISOString(),
            });
        } else if (!this.#data.redeemed) {
            RewardsData.update({
                id: this.#data.id,
                name: this.#$nameField.value,
                description: this.#$descriptionField.value,
                points: this.#$pointsField.value,
                repeat: this.#$repeatField.value,
                created: this.#data.created,
            });
        } else {
            // e.g. 2023-08-27T00:03:00Z -> 2023-08-27
            const oldKey = this.#data.redeemed.slice(0, 10);
            const newKey = this.#$redeemedField.value.slice(0, 10);

            HistoryData.update(oldKey, newKey, {
                id: this.#data.id,
                name: this.#$nameField.value,
                description: this.#$descriptionField.value,
                points: this.#$pointsField.value,
                repeat: this.#$repeatField.value,
                created: this.#data.created,
                redeemed: this.#$redeemedField.value,
            });
        }

        const event = new Event('REWARD_SAVED', {composed: true});
        this.shadowRoot.dispatchEvent(event);
    }

    #validate() {
        let valid = true;

        if (!this.#$nameField.validate()) {
            valid = false;
        }

        if (!this.#$pointsField.validate()) {
            valid = false;
        }

        return valid;
    }
}

customElements.define('reward-editor-component', RewardEditor);
