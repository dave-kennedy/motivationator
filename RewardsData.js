import ArrayData from './ArrayData.js';

export default class RewardsData {
    static #data = new ArrayData({
        localStorageKey: 'rewards',
        initialData: [{
            id: '369012e8-f23d-442d-94b9-8d362d4d943f',
            name: 'Reward 4',
            description: 'This reward has not been redeemed.',
            points: 1,
            repeat: false,
            created: '2023-08-30T00:03:00Z',
        }, {
            id: '20605586-56cf-4e37-9f98-64a56c13bad0',
            name: 'Reward 5',
            description: 'This reward has not been redeemed.',
            points: 1,
            repeat: true,
            created: '2023-08-30T00:04:00Z',
        }],
    });

    static get data() {
        return this.#data.data;
    }

    static add(reward) {
        this.#data.add(reward);
    }

    static remove(reward) {
        this.#data.remove(reward);
    }

    static update(reward) {
        this.#data.update(reward);
    }
}
