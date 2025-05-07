import { db } from "./db"
import { getMockWorkouts } from "./mock-data"
import type { Workout } from "./types"

class WorkoutStore {
    list: Workout[] = $state([])

    async load() {
        if (await db.workouts.count() == 0) {
            console.log("load")
            await db.workouts.bulkAdd(getMockWorkouts(3))
        }
        this.list = await db.workouts.toArray()
    }
}
export const workoutStore = new WorkoutStore()