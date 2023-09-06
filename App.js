import GoalsPage from './GoalsPage.js';
import HistoryData from './HistoryData.js';
import HistoryPage from './HistoryPage.js';
import Navigation from './Navigation.js';
import RewardsPage from './RewardsPage.js';

export default class App extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        this.#render();
        this.#listen();
    }

    #render() {
        const $style = document.createElement('style');

        $style.textContent = `:host {
            font-family: sans-serif;
        }

        @media screen and (min-width: 800px) {
            :host {
                display: flex;
                flex-direction: column;
                gap: 1em;
                margin: auto;
                width: 800px;
            }
        }`;

        this.shadowRoot.appendChild($style);

        const $title = document.createElement('h1');
        $title.textContent = 'Motivationator';
        this.shadowRoot.appendChild($title);

        const $points = document.createElement('div');
        $points.textContent = `Points: ${HistoryData.points}`;
        this.shadowRoot.appendChild($points);

        const $navigation = new Navigation({
            'Goals': _ => this.#navigate('#goals'),
            'Rewards': _ => this.#navigate('#rewards'),
            'History': _ => this.#navigate('#history'),
        });

        this.shadowRoot.appendChild($navigation);

        if (!location.hash || location.hash == '#goals') {
            this.#renderGoals();
        } else if (location.hash == '#rewards') {
            this.#renderRewards();
        } else if (location.hash == '#history') {
            this.#renderHistory();
        }
    }

    #listen() {
        this.addEventListener('GOAL_SAVED', _ => this.#refresh());
        this.addEventListener('GOAL_COMPLETED', _ => this.#refresh());
        this.addEventListener('GOAL_UNCOMPLETED', _ => this.#refresh());

        this.addEventListener('REWARD_SAVED', _ => this.#refresh());
        this.addEventListener('REWARD_REDEEMED', _ => this.#refresh());
        this.addEventListener('REWARD_UNREDEEMED', _ => this.#refresh());

        window.addEventListener('hashchange', _ => this.#refresh());
    }

    #navigate(page) {
        location.hash = page;
    }

    #refresh() {
        this.shadowRoot.innerHTML = '';
        this.#render();
    }

    #renderGoals() {
        const $page = new GoalsPage();
        this.shadowRoot.appendChild($page);
    }

    #renderRewards() {
        const $page = new RewardsPage();
        this.shadowRoot.appendChild($page);
    }

    #renderHistory() {
        const $page = new HistoryPage();
        this.shadowRoot.appendChild($page);
    }
}

customElements.define('app-component', App);
