export interface Metric {
    _id: string;
    name: string;
    value?: number;
    unit?: string;
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

/*export const workouts: Workout[] = [
    {
        _id: 'a',
        name: 'Awesome workout #1',
        exercises: [
            {
                _id: 'felules',
                name: 'Felülés',
                description: "The push-up is a classic bodyweight exercise that primarily targets the chest, shoulders, and triceps. Starting in a plank position, lower your chest towards the ground by bending your elbows, then push back up to the starting position, engaging your core throughout the movement.",
                metrics: [
                    {name: "Reps", value: 20 }
                ],
            },
            {
                _id: 'tarogatas',
                name: 'Tárogatás',
                metrics: [
                    {name: "Weight", value: 20, unit: 'kg' },
                    {name: "Sets", value: 3 },
                    {name: "Reps", value: 12 },
                    {name: "Sets", value: 3 },
                    {name: "Sets", value: 3 },
                    {name: "Sets", value: 3 },
                    {name: "Sets", value: 3 },
                    {name: "Sets", value: 3 },
                ],
            },
            {
                _id: 'kh',
                name: 'Fekvőtámasz',
                description: "The push-up is a classic bodyweight exercise that primarily targets the chest, shoulders, and triceps. Starting in a plank position, lower your chest towards the ground by bending your elbows, then push back up to the starting position, engaging your core throughout the movement.",
                metrics: [
                    {name: "Reps", value: 50 }
                ],
            },
        ],
        sessions: [
            {
                date: new Date('2025-04-09'),
                performedExercises: [
                    {
                        exerciseId: 'felules',
                        results: [
                            {name: "Reps", value: 15}
                        ]
                    }
                ]
            }
        ],
    },
    {
        _id: 'b',
        name: 'Let\'s do it!',
        exercises: [],
        sessions: [],
    },
    {
        _id: 'c',
        name: 'Let\'s do it!',
        exercises: [
            {
                _id: '1felules',
                name: '1Felülés',
                metrics: [
                    {name: "Reps", value: 20 }
                ],
            },
            {
                _id: '2tarogatas',
                name: '2Tárogatás',
                metrics: [
                    {name: "Weight", value: 20, unit: 'kg' },
                    {name: "Sets", value: 3 },
                    {name: "Reps", value: 12 },
                    {name: "Sets", value: 3 },
                    {name: "Sets", value: 3 },
                    {name: "Sets", value: 3 },
                    {name: "Sets", value: 3 },
                    {name: "Sets", value: 3 },
                ],
            },
            {
                _id: '3kh',
                name: '3Fekvőtámasz',
                metrics: [
                    {name: "Reps", value: 50 }
                ],
            },
        ],
        sessions: [],
    }
];*/