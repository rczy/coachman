type AppEvent = 'WorkoutAdded' | 'DatasetEdit' | 'ShowArchiving'
type Handler = (details?: any) => void
type Handlers = {[K in AppEvent]: Handler[]}

class AppEvents {
    private handlers: Handlers = {
        WorkoutAdded: [],
        DatasetEdit: [],
        ShowArchiving: [],
    }

    listen(event: AppEvent, handler: Handler) {
        this.handlers[event].push(handler)
        return () => {
            this.handlers[event] = this.handlers[event].filter((el) => el != handler)
        }
    }

    emit(event: AppEvent, details?: any) {
        for (const handler of this.handlers[event]) {
            handler(details)
        }
    }
}
export const appEvents = new AppEvents()
