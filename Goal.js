import Button from './Button.js';
import GoalEditor from './GoalEditor.js';
import GoalsData from './GoalsData.js';
import HistoryData from './HistoryData.js';

export default class Goal extends HTMLElement {
    #data;

    constructor(data) {
        super();

        this.#data = {...data};

        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        this.#render();
    }

    #render() {
        const $style = document.createElement('style');

        $style.textContent = `.name {
            font-weight: bold;
        }`;

        this.shadowRoot.appendChild($style);

        const $row = document.createElement('div');
        this.shadowRoot.appendChild($row);

        const $name = document.createElement('div');
        $name.className = 'name';
        $name.textContent = this.#data.name;
        $row.appendChild($name);

        const $description = document.createElement('div');
        $description.textContent = this.#data.description;
        $row.appendChild($description);

        const $points = document.createElement('div');
        $points.textContent = `Points: ${this.#data.points}`;
        $row.appendChild($points);

        const $repeat = document.createElement('div');
        $repeat.textContent = `Repeat: ${this.#data.repeat}`;
        $row.appendChild($repeat);

        const $completeButton = new Button({
            text: this.#data.completed ? 'Uncomplete' : 'Complete',
            click: _ => this.#data.completed ? this.#uncomplete() : this.#complete(),
        });

        $row.appendChild($completeButton);

        const $editButton = new Button({
            text: 'Edit',
            click: _ => this.#edit(),
        });

        $row.appendChild($editButton);

        const $deleteButton = new Button({
            text: 'Delete',
            click: _ => this.#delete(),
        });

        $row.appendChild($deleteButton);
    }

    #complete() {
        GoalsData.remove(this.#data);

        const now = new Date().toISOString();
        this.#data.completed = now;

        const today = now.slice(0, 10);
        HistoryData.add(today, this.#data);

        if (this.#data.repeat) {
            GoalsData.add({
                id: crypto.randomUUID(),
                name: this.#data.name,
                description: this.#data.description,
                points: this.#data.points,
                repeat: this.#data.repeat,
                created: new Date().toISOString(),
            });
        }

        const event = new Event('GOAL_COMPLETED', {composed: true});
        this.shadowRoot.dispatchEvent(event);
    }

    #uncomplete() {
        const date = this.#data.completed.slice(0, 10);
        HistoryData.remove(date, this.#data);

        this.#data.completed = undefined;
        GoalsData.add(this.#data);

        const event = new Event('GOAL_UNCOMPLETED', {composed: true});
        this.shadowRoot.dispatchEvent(event);
    }

    #edit() {
        const $editor = new GoalEditor(this.#data);
        this.shadowRoot.appendChild($editor);
    }

    #delete() {
        if (this.#data.completed) {
            const date = this.#data.completed.slice(0, 10);
            HistoryData.remove(date, this.#data);
        } else {
            GoalsData.remove(this.#data);
        }

        const event = new Event('GOAL_DELETED', {composed: true});
        this.shadowRoot.dispatchEvent(event);
    }
}

customElements.define('goal-component', Goal);
