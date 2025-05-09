import Dexie, { type EntityTable } from "dexie";
import type { Workout } from "./types";

export const version = 1

const db = new Dexie('CoachmanDB') as Dexie & {
    workouts: EntityTable<Workout, '_id'>
}

db.version(version).stores({
    workouts: '++_id, name, exercises, sessions'
})

export { db }