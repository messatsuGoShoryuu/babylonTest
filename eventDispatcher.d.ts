export default class EventDispatcher {
    constructor();
    dispatch(...args: any[]): void;
    add(callback: Function): void;
    remove(callback: Function): void;
    private m_listeners;
}
