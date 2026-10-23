import { EventEmitter } from "node:events";

class TaskEvents extends EventEmitter {}

const taskEvents = new TaskEvents();

export default taskEvents;
export { taskEvents };
