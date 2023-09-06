import ObjectData from './ObjectData.js';

export default class HistoryData {
    static #data = new ObjectData({
        localStorageKey: 'history',
        initialData: {
            '2023-08-29': [{
                id: '7f667874-3a68-47bd-9dde-8ff17782c0ab',
                name: 'Goal 3',
                description: 'This goal has already been completed.',
                points: 1,
                repeat: false,
                created: '2023-08-29T00:01:00Z',
                completed: '2023-08-29T00:03:00Z',
            }, {
                id: '94b4c20d-6e02-4738-8e45-8befabb5aae0',
                name: 'Reward 3',
                description: 'This reward has already been redeemed.',
                points: 1,
                repeat: false,
                created: '2023-08-29T00:02:00Z',
                redeemed: '2023-08-29T00:04:00Z',
            }],
            '2023-08-28': [{
                id: '51a7ba8f-01c9-4dbe-8566-eb6a5795e6c1',
                name: 'Goal 2',
                description: 'This goal has already been completed.',
                points: 1,
                repeat: false,
                created: '2023-08-28T00:01:00Z',
                completed: '2023-08-28T00:03:00Z',
            }, {
                id: '7fcb1835-0ab3-4f97-a3d3-39004ee39876',
                name: 'Reward 2',
                description: 'This reward has already been redeemed.',
                points: 1,
                repeat: false,
                created: '2023-08-28T00:02:00Z',
                redeemed: '2023-08-28T00:04:00Z',
            }],
            '2023-08-27': [{
                id: '154739d0-7059-43e0-a0a9-602c2b0795e3',
                name: 'Goal 1',
                description: 'This goal has already been completed.',
                points: 1,
                repeat: false,
                created: '2023-08-27T00:01:00Z',
                completed: '2023-08-27T00:03:00Z',
            }, {
                id: '96e26e5f-7170-49da-9bec-27de3e5b9084',
                name: 'Reward 1',
                description: 'This reward has already been redeemed.',
                points: 1,
                repeat: false,
                created: '2023-08-27T00:02:00Z',
                redeemed: '2023-08-27T00:04:00Z',
            }],
        },
    });

    static get data() {
        return this.#data.data;
    }

    static add(date, item) {
        this.#data.add(date, item);
    }

    static remove(date, item) {
        this.#data.remove(date, item);
    }

    static update(oldDate, newDate, item) {
        this.#data.update(oldDate, newDate, item);
    }

    static get points() {
        return Object.values(this.#data.data).reduce((total, items) => {
            return total + items.reduce((total, item) => {
                if (item.completed) {
                    return total + item.points;
                }

                return total - item.points;
            }, 0);
        }, 0);
    }
}
