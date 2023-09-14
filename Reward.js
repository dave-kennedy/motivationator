import Button from './Button.js';
import HistoryData from './HistoryData.js';
import RewardEditor from './RewardEditor.js';
import RewardsData from './RewardsData.js';

export default class Reward extends HTMLElement {
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

        const $redeemButton = new Button({
            text: this.#data.redeemed ? 'Unredeem' : 'Redeem',
            click: _ => this.#data.redeemed ? this.#unredeem() : this.#redeem(),
        });

        $row.appendChild($redeemButton);

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

    #redeem() {
        RewardsData.remove(this.#data);

        const now = new Date().toISOString();
        this.#data.redeemed = now;

        const today = now.slice(0, 10);
        HistoryData.add(today, this.#data);

        if (this.#data.repeat) {
            RewardsData.add({
                id: crypto.randomUUID(),
                name: this.#data.name,
                description: this.#data.description,
                points: this.#data.points,
                repeat: this.#data.repeat,
                created: new Date().toISOString(),
            });
        }

        const event = new Event('REWARD_REDEEMED', {composed: true});
        this.shadowRoot.dispatchEvent(event);
    }

    #unredeem() {
        const date = this.#data.redeemed.slice(0, 10);
        HistoryData.remove(date, this.#data);

        this.#data.redeemed = undefined;
        RewardsData.add(this.#data);

        const event = new Event('REWARD_UNREDEEMED', {composed: true});
        this.shadowRoot.dispatchEvent(event);
    }

    #edit() {
        const $editor = new RewardEditor(this.#data);
        this.shadowRoot.appendChild($editor);
    }

    #delete() {
        if (this.#data.redeemed) {
            const date = this.#data.redeemed.slice(0, 10);
            HistoryData.remove(date, this.#data);
        } else {
            RewardsData.remove(this.#data);
        }

        const event = new Event('REWARD_DELETED', {composed: true});
        this.shadowRoot.dispatchEvent(event);
    }
}

customElements.define('reward-component', Reward);
