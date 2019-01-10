import EventDispatcher from "./eventDispatcher";
export default class EventManager {
    static s_dispatchers: Map<String, EventDispatcher>;
    static addListener(id: string, event: Function): void;
    static removeListener(id: string, event: Function): void;
    static dispatch(id: string, ...args: any[]): void;
}
