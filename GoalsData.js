import ArrayData from './ArrayData.js';

export default class GoalsData {
    static #data = new ArrayData({
        localStorageKey: 'goals',
        initialData: [{
            id: 'c436b6a7-f613-43f8-bb83-22620381da8e',
            name: 'Goal 4',
            description: 'This goal has not been completed.',
            points: 1,
            repeat: false,
            created: '2023-08-30T00:01:00Z',
        }, {
            id: '6708f24f-4603-41fc-85ec-80ee856cb8da',
            name: 'Goal 5',
            description: 'This goal has not been completed.',
            points: 1,
            repeat: true,
            created: '2023-08-30T00:02:00Z',
        }],
    });

    static get data() {
        return this.#data.data;
    }

    static add(goal) {
        this.#data.add(goal);
    }

    static remove(goal) {
        this.#data.remove(goal);
    }

    static update(goal) {
        this.#data.update(goal);
    }
}
