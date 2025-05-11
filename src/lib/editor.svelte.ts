import type { Exercise, Metric, Workout } from "./types";

abstract class Editor<T extends {_id: string}> {
    subject: T = $state({} as T)
    protected container: T[] = []
    protected onsubmit: (saved: T) => void = () => {}
    protected active: boolean = $state(false);

    protected abstract getEmptySubject(): T;

    isSubjectNew(): boolean {
        return this.subject?._id === ''
    }

    isActive(): boolean {
        return this.active
    }

    editNew(container: T[] = [], onsubmit?: (saved: T) => void) {
        this.edit(this.getEmptySubject(), container, onsubmit)
    }

    edit(subject: T, container: T[] = [], onsubmit?: (saved: T) => void) {
        this.active = true
        this.subject = structuredClone(subject)
        this.container = container
        if (onsubmit) {
            this.onsubmit = onsubmit
        }
    }

    cancel() {
        this.active = false
    }

    submit() {
        if (!this.active) {
            return
        }
        this.onsubmit(
            this.save()
        )
        this.cancel()
    }

    remove(item: T, container: T[] = []) {
        const idx = container.indexOf(item)
        if (idx > -1) {
            container.splice(idx, 1)
        }
    }

    protected save(): T {
        const snapshot = $state.snapshot(this.subject) as T
        if (this.isSubjectNew()) {
            snapshot._id = crypto.randomUUID()
            this.container.push(snapshot)
        } else {
            const idx = this.container.findIndex(item => item._id === snapshot._id)
            if (idx > -1) {
                this.container[idx] = snapshot
            }
        }
        return snapshot
    }
}

class WorkoutEditor extends Editor<Workout> {
    protected getEmptySubject(): Workout {
        return {
            _id: '',
            order: Infinity,
            name: '',
            exercises: [],
            sessions: [],
        }
    }
}
export const workoutEditor = new WorkoutEditor()

class ExerciseEditor extends Editor<Exercise> {
    protected getEmptySubject(): Exercise {
        return {
            _id: '',
            name: '',
            metrics: []
        }
    }
}
export const exerciseEditor = new ExerciseEditor()

class MetricEditor extends Editor<Metric> {
    protected getEmptySubject(): Metric {
        return {
            _id: '',
            name: '',
            trend: 1
        }
    }
}
export const metricEditor = new MetricEditor()