import Button from './Button.js';

export default class Navigation extends HTMLElement {
    #params;

    constructor(params) {
        super();

        this.#params = params;

        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        this.#render();
    }

    #render() {
        const $style = document.createElement('style');

        $style.textContent = `:host {
            display: flex;
            gap: 1em;
        }`;

        this.shadowRoot.appendChild($style);

        for (const [text, click] of Object.entries(this.#params)) {
            const $button = new Button({text, click});
            this.shadowRoot.appendChild($button);
        }
    }
}

customElements.define('navigation-component', Navigation);
