import type { App } from "vue";
import type { BaseEvent } from "@/plugins/events/baseEvent";

type CallbackHandler = (payload: any) => void;
type CallbackInfo = { fn: CallbackHandler; ctx?: any; selfDestruct?: boolean };

interface Class {
  name: string;
}

class EventBus {
  private static instance: EventBus;

  private readonly listeners: Record<string, Record<number | string, CallbackInfo>>;

  private listenerCounter: number;

  // Maps an event class to a unique registry key. Keying by constructor.name alone would let two
  // different event classes with the same class name fire each other's handlers.
  private readonly eventKeys: WeakMap<Class, string>;

  private eventKeyCounter: number;

  private constructor() {
    this.listeners = {};
    this.listenerCounter = 0;
    this.eventKeys = new WeakMap();
    this.eventKeyCounter = 0;
  }

  private keyFor(eventType: Class): string {
    let key = this.eventKeys.get(eventType);
    if (!key) {
      key = `${eventType.name}#${(this.eventKeyCounter += 1)}`;
      this.eventKeys.set(eventType, key);
    }
    return key;
  }

  static getInstance() {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  /**
   * Use this function to hook an event listener.
   *
   * @param eventType Class of the event to listen for.
   * @param callback The function to be called when this event is emitted somewhere.
   * @param ctx The context will be bound to the event callback (e.g. for providing this)
   * @param selfDestruct Set to true, so the event listener will be deleted after first occurrence.
   */
  on(eventType: Class, callback: CallbackHandler, ctx?: any, selfDestruct?: boolean): [string, number] {
    const name = this.keyFor(eventType);
    if (!(name in this.listeners)) {
      this.listeners[name] = {};
    }
    this.listeners[name][this.listenerCounter] = {
      fn: callback,
      ctx,
      selfDestruct: !!selfDestruct,
    };
    const ret: [string, number] = [name, this.listenerCounter];
    this.listenerCounter += 1;
    return ret;
  }

  /**
   * Use this function to hook an event listener.
   * This version of the function provides a static interface to the EventBus singleton.
   */
  static on(eventType: Class, callback: CallbackHandler, ctx?: any, selfDestruct?: boolean): [string, number] {
    const self = EventBus.getInstance();
    return self.on(eventType, callback, ctx, selfDestruct);
  }

  /**
   * Use this function to hook an event listener.
   * Once the event was emitted somewhere, the listener is removed again.
   *
   * @param eventType Class of the event to listen for.
   * @param callback The function to be called when this event is emitted somewhere.
   * @param ctx The context will be bound to the event callback (e.g. for providing this)
   */
  once(eventType: Class, callback: CallbackHandler, ctx?: any): [string, number] {
    return this.on(eventType, callback, ctx, true);
  }

  /**
   * Use this function to hook an event listener.
   * Once the event was emitted somewhere, the listener is removed again.
   * This version of the function provides a static interface to the EventBus singleton.
   */
  static once(eventType: Class, callback: CallbackHandler, ctx?: any): [string, number] {
    const self = EventBus.getInstance();
    return self.once(eventType, callback, ctx);
  }

  /**
   * Emit an event.
   * @param payload
   */
  emit(payload: BaseEvent) {
    const name = this.keyFor(payload.constructor as Class);
    if (name in this.listeners) {
      Object.entries(this.listeners[name]).forEach(([key, listener]) => {
        listener.fn.apply(listener.ctx, [payload]);
        if (listener.selfDestruct) this.off([name, key]);
      });
    }
  }

  /**
   * Emit an event.
   * This version of the function provides a static interface to the EventBus singleton.
   */
  static emit(payload: BaseEvent) {
    const self = EventBus.getInstance();
    return self.emit(payload);
  }

  /**
   * Manually remove an event listener.
   * You can either remove a specific listener by passing in the handler,
   * or turn off all eventy by only passing the eventClass.
   *
   * @param listener Class of the event to remove or the identifier returned by on or once.
   */
  off(listener: [string, number | string] | Class) {
    const [name, counter] =
      listener instanceof Array ? listener : ([this.keyFor(listener), undefined] as [string, undefined]);
    // counter === 0 is a valid listener id (the first registered listener), so check for undefined
    if (counter !== undefined) delete this.listeners[name][counter];
    else delete this.listeners[name];
  }

  /**
   * Manually remove an event listener.
   * You can either remove a specific listener by passing in the handler,
   * or turn off all eventy by only passing the eventClass.
   * This version of the function provides a static interface to the EventBus singleton.
   */
  static off(listener: [string, number] | typeof BaseEvent) {
    const self = EventBus.getInstance();
    return self.off(listener);
  }
}

export default {
  install(app: App) {
    app.config.globalProperties.$eventBus = EventBus.getInstance();
  },
};

export { EventBus };
