import type { Exercise, Metric, Workout } from "./types";

abstract class Editor<T extends {_id: string}> {
    subject: T = $state({} as T)
    protected container: T[] = []
    protected active: boolean = $state(false);

    protected abstract getEmptySubject(): T;

    isSubjectNew(): boolean {
        return this.subject?._id === ''
    }

    isActive(): boolean {
        return this.active
    }

    editNew(container: T[] = []) {
        this.edit(this.getEmptySubject(), container)
    }

    edit(subject: T, container: T[] = []) {
        this.active = true
        this.subject = structuredClone(subject)
        this.container = container
    }

    cancel() {
        this.active = false
    }

    submit() {
        if (!this.active) {
            return
        }
        this.save()
        this.cancel()
    }

    clone(item: T, container: T[] = []): void {
        const idx = container.findIndex(el => item._id === el._id)
        const cloned = structuredClone(item)
        cloned._id = crypto.randomUUID()
        container.splice(idx + 1, 0, cloned)
    }

    remove(item: T, container: T[] = []) {
        const idx = container.indexOf(item)
        if (idx > -1) {
            container.splice(idx, 1)
        }
    }

    protected save() {
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
    }
}

class WorkoutEditor extends Editor<Workout> {
    protected getEmptySubject(): Workout {
        return {
            _id: '',
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