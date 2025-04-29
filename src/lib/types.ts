export type Trend = 1 | -1

export interface Metric {
    _id: string;
    name: string;
    value?: number;
    unit?: string;
    trend: Trend
}

export interface Exercise {
    _id: string;
    name: string;
    image?: string;
    description?: string;
    metrics: Metric[];
}

interface PerformedExercise {
    exerciseId: string;
    perceivedDifficulty?: number;
    results: Metric[];
}

interface WorkoutSession {
    date: Date;
    performedExercises: PerformedExercise[];
}

export interface Workout {
    _id: string;
    name: string;
    exercises: Exercise[];
    sessions: WorkoutSession[];
}