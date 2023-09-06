import Button from './Button.js';
import GoalsData from './GoalsData.js';
import HistoryData from './HistoryData.js';
import InputField from './InputField.js';

export default class GoalEditor extends HTMLElement {
    #data;
    #$nameField;
    #$descriptionField;
    #$pointsField;
    #$repeatField;
    #$completedField;

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
        $title.textContent = this.#data.id ? 'Edit Goal' : 'New Goal';
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

        if (this.#data.completed) {
            this.#$completedField = new InputField({
                label: 'Completed',
                type: 'datetime-local',
            });

            $modal.appendChild(this.#$completedField);
            this.#$completedField.value = this.#data.completed;
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
            GoalsData.add({
                id: crypto.randomUUID(),
                name: this.#$nameField.value,
                description: this.#$descriptionField.value,
                points: this.#$pointsField.value,
                repeat: this.#$repeatField.value,
                created: new Date().toISOString(),
            });
        } else if (!this.#data.completed) {
            GoalsData.update({
                id: this.#data.id,
                name: this.#$nameField.value,
                description: this.#$descriptionField.value,
                points: this.#$pointsField.value,
                repeat: this.#$repeatField.value,
                created: this.#data.created,
            });
        } else {
            // e.g. 2023-08-27T00:03:00Z -> 2023-08-27
            const oldKey = this.#data.completed.slice(0, 10);
            const newKey = this.#$completedField.value.slice(0, 10);

            HistoryData.update(oldKey, newKey, {
                id: this.#data.id,
                name: this.#$nameField.value,
                description: this.#$descriptionField.value,
                points: this.#$pointsField.value,
                repeat: this.#$repeatField.value,
                created: this.#data.created,
                completed: this.#$completedField.value,
            });
        }

        const event = new Event('GOAL_SAVED', {composed: true});
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

customElements.define('goal-editor-component', GoalEditor);
