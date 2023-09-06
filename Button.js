export default class Button extends HTMLElement {
    #text;
    #click;

    constructor(params) {
        super();

        this.#text = params.text;
        this.#click = params.click;

        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        this.#render();
    }

    #render() {
        const $style = document.createElement('style');

        $style.textContent = `.button {
            background-color: cyan;
            border: 1px solid black;
            cursor: pointer;
            display: inline-block;
            padding: 1em;
        }

        .button:hover {
            background-color: darkcyan;
        }`;

        this.shadowRoot.appendChild($style);

        const $text = document.createElement('div');
        $text.className = 'button';
        $text.textContent = this.#text;
        $text.addEventListener('click', this.#click);
        this.shadowRoot.appendChild($text);
    }
}

customElements.define('button-component', Button);
