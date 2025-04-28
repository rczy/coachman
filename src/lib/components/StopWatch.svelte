<script lang="ts">
    import { ReactiveStopwatch } from "$lib/reactive-stopwatch.svelte";

    interface Props {
        countFrom: number
        classes: string | string[]
    }
    let { countFrom = 0, classes = '' } = $props()

    let stopwatch = new ReactiveStopwatch(countFrom)
    
    $effect(() => {
        return () => {
            stopwatch.stop()
        }
    })

    export const getWatch = (): ReactiveStopwatch => {
        return stopwatch
    }
</script>

<span class={["countdown font-mono", classes]}>
    <span style="--value:{stopwatch.getHours()};" aria-live="polite" aria-label="{stopwatch.getHours().toString()}">{stopwatch.getHours()}</span>
    :
    <span style="--value:{stopwatch.getMinutes()};" aria-live="polite" aria-label="{stopwatch.getMinutes().toString()}">{stopwatch.getMinutes()}</span>
    :
    <span style="--value:{stopwatch.getSeconds()};" aria-live="polite" aria-label="{stopwatch.getSeconds().toString()}">{stopwatch.getSeconds()}</span>
</span>