<script lang="ts">
    import { appEvents } from "$lib/app-events";
    import type { PerformedExercise, Workout, WorkoutSession } from "$lib/types";
    import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Legend, Tooltip, Colors } from "chart.js";

    interface Props {
        workout: Workout
    }
    let { workout }: Props = $props()

    let emptyDataset = $state(false)

    const getDatasets = (workout: Workout) => {
        const labels = []
        for (const exercise of workout.exercises) {
            for (const metric of exercise.metrics) {
                if (!!metric.marked) {
                    labels.push({
                        _id: metric._id,
                        text: `${metric.name} (${exercise.name})`,
                    })
                }
            }
        }
        const datasets = []
        for (const label of labels) {
            datasets.push({
                label: label.text,
                data: getData(workout.sessions, label._id),
            })
        }
        return datasets
    }

    const getData = (sessions: WorkoutSession[], metricId: string) => {
        const data = []
        const getValue = (exercises: PerformedExercise[], metricId: string) => {
            for (const exercise of exercises) {
                const metric = exercise.results.find(metric => metric._id === metricId)
                if (metric?._id) {
                    return metric.value
                }
            }
            return null
        }
        for (const session of sessions) {
            data.push({
                x: session.date.toLocaleString(),
                y: getValue(session.performedExercises, metricId),
            })
        }
        return data
    }

    Chart.register(
        LineController,
        LineElement,
        PointElement,
        LinearScale,
        CategoryScale,
        Legend,
        Tooltip,
        Colors
    )
    let ctx: HTMLCanvasElement

    $effect(() => {
        const datasets = getDatasets(workout)
        emptyDataset = !datasets.length
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: datasets
            },
            options: {
                maintainAspectRatio: false,
            },
        })
        return () => {
            chart.destroy()
        }
    })
</script>

<div class={['min-h-80', {hidden: emptyDataset}]}>
    <canvas bind:this={ctx}></canvas>
</div>

{#if emptyDataset}
    <div class="flex justify-center items-center min-h-120">
        <button class="btn btn ghost" onclick={() => appEvents.emit('DatasetEdit', {workout})}>
            Select metrics to view on chart
        </button>
    </div>
{/if}