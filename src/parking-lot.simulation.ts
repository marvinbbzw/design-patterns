import { ParkingLot } from "./parking-lot.js";
import { Display } from "./display.js";

const maxFillIntervalMillis = 1000;
const maxEmptyIntervalMillis = 2000;
const initialFillPhaseMillis = 5000;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1));

const fill = async (lot: ParkingLot) => {
  while (!lot.isFull()) {
    await sleep(rand(0, maxFillIntervalMillis));
    lot.enter();
  }
};

const empty = async (lot: ParkingLot) => {
  while (!lot.isEmpty()) {
    await sleep(rand(0, maxEmptyIntervalMillis));
    lot.exit();
  }
};

const bahnhofParking = new ParkingLot("Bahnhof Parking", 100);
const display = new Display();
bahnhofParking.subscribe(display);

await fill(bahnhofParking);
await sleep(initialFillPhaseMillis);
await empty(bahnhofParking);