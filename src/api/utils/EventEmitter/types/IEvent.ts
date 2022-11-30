import Events from "@/api/utils/EventEmitter/types/Events";

interface IEvent {
  type: Events;
  callback: Array<(...args: any[]) => any | void>;
}

export default IEvent;
