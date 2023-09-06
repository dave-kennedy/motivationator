import Goal from './Goal.js';
import HistoryData from './HistoryData.js';
import Reward from './Reward.js';

export default class HistoryPage extends HTMLElement {
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
        $title.textContent = 'History';
        this.shadowRoot.appendChild($title);

        for (const entry of this.#data) {
            const [date, items] = entry;

            const $date = document.createElement('h3');
            $date.textContent = new Date(date).toLocaleDateString();
            this.shadowRoot.appendChild($date);

            for (const item of items) {
                if (item.completed) {
                    const $goal = new Goal(item);
                    this.shadowRoot.appendChild($goal);
                } else {
                    const $reward = new Reward(item);
                    this.shadowRoot.appendChild($reward);
                }
            }
        }
    }

    get #data() {
        return Object.entries(HistoryData.data).sort((a, b) => a > b ? -1 : 1);
    }
}

customElements.define('history-page-component', HistoryPage);
