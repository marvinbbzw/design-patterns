import { Publisher, Subscriber, Event } from "./observer.js";

export class ParkingLot implements Publisher {
  private occupied = 0;
  private subscribers: Subscriber[] = [];

  constructor(
    public name: string,
    public capacity: number,
  ) {}

  public enter(): void {
    if (this.isFull()) throw new Error("Parking lot full");
    this.occupied++;
    this.notify({
      lotName: this.name,
      occupied: this.occupied,
      capacity: this.capacity,
      type: "enter",
    });
  }

  public exit(): void {
    if (this.isEmpty()) throw new Error("Parking lot empty");
    this.occupied--;
    this.notify({
      lotName: this.name,
      occupied: this.occupied,
      capacity: this.capacity,
      type: "exit",
    });
  }

  public isFull(): boolean {
    return this.occupied === this.capacity;
  }

  public isEmpty(): boolean {
    return this.occupied === 0;
  }

  public subscribe(sub: Subscriber): void {
    this.subscribers.push(sub);
  }

  public unsubscribe(sub: Subscriber): void {
    this.subscribers = this.subscribers.filter((s) => s !== sub);
  }

  public notify(event: Event): void {
    this.subscribers.forEach((sub) => sub.update(event));
  }
}