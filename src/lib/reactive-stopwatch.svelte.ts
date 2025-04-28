export class ReactiveStopwatch {
    private elapsed = $state(0)
    private interval: number | undefined

    constructor(countFrom?: number) {
        if (countFrom) this.elapsed = countFrom
    }

    start() {
        if (this.interval) return
        this.interval = setInterval(() => this.elapsed++, 1000)
    }

    stop() {
        clearInterval(this.interval)
        this.interval = undefined
    }

    reset() {
        this.stop()
        this.elapsed = 0
        this.start()
    }

    getElapsed(): number {
        return this.elapsed
    }

    getHours(): number {
        return this.elapsed / 60 / 60 | 0
    }

    getMinutes(): number {
        return this.elapsed / 60 - (this.getHours() * 60) | 0
    }

    getSeconds(): number {
        return this.elapsed % 60
    }
}