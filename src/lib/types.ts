export type Trend = 1 | 0 | -1

export type MetricValue = number | undefined

export interface Metric {
    _id: string
    name: string
    value?: MetricValue
    unit?: string
    marked?: boolean
    trend: Trend
}

export interface Exercise {
    _id: string
    name: string
    image?: string
    description?: string
    metrics: Metric[]
}

export interface PerformedExercise {
    exerciseId: string
    results: Metric[]
}

export interface WorkoutSession {
    date: Date
    duration: number
    performedExercises: PerformedExercise[]
}

export interface Workout {
    _id: string
    name: string
    exercises: Exercise[]
    sessions: WorkoutSession[]
}