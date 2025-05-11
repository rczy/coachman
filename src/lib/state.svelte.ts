import { db } from "./db"
import type { Workout } from "./types"

class WorkoutStore {
    list: Workout[] = $state([])
    loaded: boolean = $state(false)

    async load() {
        this.loaded = false
        this.list = (await db.workouts.toArray()).sort((a, b) => a.order - b.order)
        this.loaded = true
    }
}
export const workoutStore = new WorkoutStore()