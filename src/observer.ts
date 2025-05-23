export interface Event {
  lotName: string;
  occupied: number;
  capacity: number;
  type: "enter" | "exit";
}

export interface Subscriber {
  update(event: Event): void;
}

export interface Publisher {
  subscribe(sub: Subscriber): void;
  unsubscribe(sub: Subscriber): void;
  notify(event: Event): void;
}