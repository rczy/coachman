import Dexie, { type EntityTable } from "dexie";
import type { Workout } from "./types";

const db = new Dexie('CoachmanDB') as Dexie & {
    workouts: EntityTable<Workout, '_id'>
}

db.version(1).stores({
    workouts: '++_id, name, exercises, sessions'
})

export { db }