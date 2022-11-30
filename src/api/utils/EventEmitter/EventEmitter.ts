import IEvent from "./types/IEvent";
import Events from "./types/Events";

class EventEmitter {
  static Events = new Array<IEvent>();

  static On<TReturn>(type: Events, callback: (...args: any[]) => TReturn) {
    if (!this.Exists(type)) {
      this.Events.push({
        type,
        callback: [],
      });
    }

    const event = this.Get(type);
    event?.callback.push(callback);
  }

  static Off(...types: Events[]) {
    types.forEach((type) => {
      if (this.Exists(type)) {
        this.Events = this.Events.filter((e) => e.type !== type);
      }
    });
  }

  static Emit(type: Events, ...args: any[]) {
    const event = this.Get(type);

    if (event) {
      for (let i = 0, len = event.callback.length; i < len; i++) {
        const callback = event.callback[i];
        callback.call(this, ...args);
      }
    }
  }

  static Exists(type: Events): boolean {
    return this.Events.some((e) => e.type === type);
  }

  private static Get(type: Events): IEvent | undefined {
    return this.Events.find((e) => e.type === type);
  }
}

export default EventEmitter;
