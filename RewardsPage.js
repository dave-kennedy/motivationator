import Button from './Button.js';
import Reward from './Reward.js';
import RewardsData from './RewardsData.js';
import RewardEditor from './RewardEditor.js';

export default class RewardsPage extends HTMLElement {
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
        $title.textContent = 'Rewards';
        this.shadowRoot.appendChild($title);

        const $newButton = new Button({text: 'New Reward', click: _ => this.#newReward()});
        this.shadowRoot.appendChild($newButton);

        for (const reward of this.#data) {
            const $reward = new Reward(reward);
            this.shadowRoot.appendChild($reward);
        }
    }

    #newReward() {
        const $editor = new RewardEditor();
        this.shadowRoot.appendChild($editor);
    }

    get #data() {
        return [...RewardsData.data].sort((a, b) => a.created < b.created ? -1 : 1);
    }
}

customElements.define('rewards-page-component', RewardsPage);
