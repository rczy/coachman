<script lang="ts">
    import { StopWatch } from "$lib/stopwatch.svelte";

    interface Props {
        countFrom: number
        classes: string | string[]
    }
    let { countFrom = 0, classes = '' } = $props()

    let stopwatch = new StopWatch(countFrom)
    
    $effect(() => {
        return () => {
            stopwatch.stop()
        }
    })

    export function start() {
        stopwatch.start()
    }

    export function stop() {
        stopwatch.stop()
    }

    export function reset() {
        stopwatch.reset()
    }
</script>

<span class={["countdown font-mono", classes]}>
    <span style="--value:{stopwatch.getHours()};" aria-live="polite" aria-label="{stopwatch.getHours().toString()}">{stopwatch.getHours()}</span>
    :
    <span style="--value:{stopwatch.getMinutes()};" aria-live="polite" aria-label="{stopwatch.getMinutes().toString()}">{stopwatch.getMinutes()}</span>
    :
    <span style="--value:{stopwatch.getSeconds()};" aria-live="polite" aria-label="{stopwatch.getSeconds().toString()}">{stopwatch.getSeconds()}</span>
  </span>