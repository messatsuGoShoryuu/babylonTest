import EventDispatcher from "./eventDispatcher"

export default class EventManager {
    static s_dispatchers: Map<String, EventDispatcher>;

    static addListener(id: string, event: Function): void {
        if (!EventManager.s_dispatchers) EventManager.s_dispatchers = new Map<String, EventDispatcher>();

        if (!EventManager.s_dispatchers.has(id))
            EventManager.s_dispatchers.set(id, new EventDispatcher());

        var dispatcher: EventDispatcher | undefined = EventManager.s_dispatchers.get(id);

        if (dispatcher)
            dispatcher.add(event);
    }

    static removeListener(id: string, event: Function): void {
        if (!EventManager.s_dispatchers || !EventManager.s_dispatchers.has(id))
            return;

        var dispatcher: EventDispatcher | undefined = EventManager.s_dispatchers.get(id);

        if (dispatcher)
            dispatcher.remove(event);
    }

    static dispatch(id: string, ...args: any[]) {
        if (!EventManager.s_dispatchers || !EventManager.s_dispatchers.has(id))
            return;

        var dispatcher: EventDispatcher | undefined = EventManager.s_dispatchers.get(id);

        if (dispatcher)
            dispatcher.dispatch(...args);
    }
}