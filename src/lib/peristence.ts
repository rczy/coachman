import { db } from "./db";
import type { Workout } from "./types";

export const persistence = {
    addWorkout: async (workout: Workout) => {
        await db.workouts.add(workout)
    },
    updateWorkout: async (id: string, workout: Partial<Workout>) => {
        await db.workouts.update(id, {...workout})
    },
    deleteWorkout: async (id: string) => {
        await db.workouts.delete(id)
    }
}