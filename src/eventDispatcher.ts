export default class EventDispatcher {

    constructor() {
        this.m_listeners = new Array<Function>();
    }

    dispatch(...args: any[]): void {
        this.m_listeners.forEach((callback, i, listeners) => {
            callback(...args);
        });
    }

    add(callback: Function) {
        this.m_listeners.push(callback);
    }

    remove(callback: Function) {
        const index = this.m_listeners.indexOf(callback);
        if (index > -1) {
            this.m_listeners.splice(index, 1);
        }
    }

    private m_listeners: Array<Function>;
}