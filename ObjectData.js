import LocalStorage from './LocalStorage.js';

export default class ObjectData {
    #data;
    #localStorageKey;
    #initialData;

    constructor(params) {
        this.#localStorageKey = params.localStorageKey;
        this.#initialData = params.initialData || {};
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

    add(key, value) {
        const values = (this.data[key] || []).concat(value);
        this.data = {...this.data, [key]: values};
    }

    remove(key, value) {
        const values = this.data[key].filter(other => other.id !== value.id);

        if (values.length) {
            this.data = {...this.data, [key]: values};
            return;
        }

        const {[key]: _, ...others} = this.data;
        this.data = others;
    }

    update(oldKey, newKey, value) {
        if (oldKey !== newKey) {
            this.remove(oldKey, value);
            this.add(newKey, value);
            return;
        }

        const index = this.data[oldKey].findIndex(other => other.id === value.id);
        this.data = {...this.data, [oldKey]: this.data[oldKey].with(index, value)};
    }
}
