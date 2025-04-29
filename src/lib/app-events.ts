type AppEvent = 'WorkoutAdded'
type Handler = () => void
type Handlers = {[K in AppEvent]: Handler[]}

class AppEvents {
    private handlers: Handlers = {
        WorkoutAdded: []
    }

    listen(event: AppEvent, handler: Handler) {
        this.handlers[event].push(handler)
        return () => {
            this.handlers[event] = this.handlers[event].filter((el) => el != handler)
        }
    }

    emit(event: AppEvent) {
        for (const handler of this.handlers[event]) {
            handler()
        }
    }
}
export const appEvents = new AppEvents()
