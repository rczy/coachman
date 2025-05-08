import type { Exercise, Metric, Workout } from "./types";

export const getMockWorkouts = (count: number): Workout[] => {
    const workouts = []
    for (let i = 0; i < count; i++) {
        workouts.push(getMockWorkout(i))
    }
    return workouts
}

const getMockWorkout = (order: number): Workout => {
    const exercises = []
    for (let i = 0; i < getRandomInt(3) + 1; i++) {
        exercises.push(getMockExercise())
    }
    return {
        _id: crypto.randomUUID(),
        order: order,
        name: `Awesome workout #${getRandomInt(100)}`,
        exercises: exercises,
        sessions: [],
    }
}

const getMockExercise = (): Exercise => {
    const metrics = []
    for (let i = 0; i < getRandomInt(5); i++) {
        metrics.push(getMockMetric())
    }
    return {
        _id: crypto.randomUUID(),
        name: `Wonderful exercise #${getRandomInt(100)}`,
        image: `https://picsum.photos/seed/${crypto.randomUUID()}/450/300`,
        description: getRandomInt(2) == 1 ? getRandomText(getRandomInt(20) + 10) : '',
        metrics: metrics
    }
}

const getMockMetric = (): Metric => {
    const names: string[] = ['Reps', 'Sets', 'Total Volume', 'Distance', 'Laps', 'Steps', 'Weight', 'Speed', 'Duration']
    const units: string[] = ['', 'kg', 'km', 'm', 'sec', 'km/h']
    return {
        _id: crypto.randomUUID(),
        name: names[getRandomInt(names.length)],
        value: getRandomInt(20) + 1,
        unit: units[getRandomInt(units.length)],
        trend: getRandomInt(10) < 7 ? 1 : -1
    }
}

const getRandomInt = (max: number): number => {
    return Math.floor(Math.random() * max)
}

const getRandomText = (wordsCount: number): string => {
    const ipsum = "start in a high plank position hands slightly wider than shoulders lower your chest towards the floor by bending elbows keeping your body in a straight line push back up to the starting position"
    const wordArray = ipsum.split(' ')
    const randomWord = () => {
        return wordArray[getRandomInt(wordArray.length)]
    }
    let result = ""
    for (let i = 0; i < wordsCount; i++) {
        result += ` ${randomWord()}`
    }
    return result
}
