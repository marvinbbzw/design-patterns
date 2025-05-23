import { Subscriber, Event } from "./observer.js";

export class Display implements Subscriber {
  update(event: Event): void {
    const { lotName, occupied, capacity, type } = event;
    const action = type === "enter" ? "entered" : "left";
    console.log(`A car ${action} the lot ${lotName}: ${occupied}/${capacity} occupied.`);
  }
}