import Button from './Button.js';
import Goal from './Goal.js';
import GoalsData from './GoalsData.js';
import GoalEditor from './GoalEditor.js';

export default class GoalsPage extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        this.#render();
    }

    #render() {
        const $style = document.createElement('style');

        $style.textContent = `:host {
            display: flex;
            flex-direction: column;
            gap: 1em;
        }`;

        this.shadowRoot.appendChild($style);

        const $title = document.createElement('h2');
        $title.textContent = 'Goals';
        this.shadowRoot.appendChild($title);

        const $newButton = new Button({text: 'New Goal', click: _ => this.#newGoal()});
        this.shadowRoot.appendChild($newButton);

        for (const goal of this.#data) {
            const $goal = new Goal(goal);
            this.shadowRoot.appendChild($goal);
        }
    }

    #newGoal() {
        const $editor = new GoalEditor();
        this.shadowRoot.appendChild($editor);
    }

    get #data() {
        return [...GoalsData.data].sort((a, b) => a.created < b.created ? -1 : 1);
    }
}

customElements.define('goals-page-component', GoalsPage);
