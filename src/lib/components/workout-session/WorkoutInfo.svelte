<script lang="ts">
    import StopWatch from "../Stopwatch.svelte";

    interface Props {
        workoutName: string
        progress: number
        total: number
    }
    let { workoutName, progress, total }: Props = $props()

    let elapsed: StopWatch

    $effect(() => {
        elapsed.getWatch().start()
        return () => {
            elapsed.getWatch().stop()
        }
    })

    export const haltStopWatch = () => {
        elapsed.getWatch().stop()
    }

    export const getElapsed = (): number => {
        return elapsed.getWatch().getElapsed()
    }
</script>


<div class="card bg-base-100 shadow-sm lg:w-60">
    <div class="card-body">
        <h2 class="card-title">{workoutName}</h2>
        <div class="grid grid-cols-2 gap-y-2">
            <span>Exercise:</span>
            <span>{progress} / {total}</span>
            <span>Elapsed:</span>
            <span><StopWatch bind:this={elapsed}/></span>
        </div>
    </div>
</div>