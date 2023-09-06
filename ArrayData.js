import LocalStorage from './LocalStorage.js';

export default class ArrayData {
    #data;
    #localStorageKey;
    #initialData;

    constructor(params) {
        this.#localStorageKey = params.localStorageKey;
        this.#initialData = params.initialData || [];
    }

    get data() {
        if (this.#data) {
            return this.#data;
        }

        const localData = LocalStorage.load(this.#localStorageKey);
        this.#data = localData || this.#initialData;
        LocalStorage.save(this.#localStorageKey, this.#data);
        return this.#data;
    }

    set data(value) {
        this.#data = value;
        LocalStorage.save(this.#localStorageKey, this.data);
    }

    add(value) {
        this.data = this.data.concat(value);
    }

    remove(value) {
        this.data = this.data.filter(other => other.id !== value.id);
    }

    update(value) {
        const index = this.data.findIndex(other => other.id === value.id);
        this.data = this.data.with(index, value);
    }
}
