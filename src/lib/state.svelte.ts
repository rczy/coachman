import { getMockWorkouts } from "./mock-data"
import type { Workout } from "./types"

class WorkoutStore {
    list: Workout[] = $state(getMockWorkouts(3))
}
export const workoutStore = new WorkoutStore()
