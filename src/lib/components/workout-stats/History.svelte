<script lang="ts">
    import type { Metric, PerformedExercise, Workout } from '$lib/types';

    interface Props {
        workout: Workout
    }
    let { workout }: Props = $props()

    let filteredExercises = $derived(workout.exercises.filter(ex => ex.metrics.length))

    const getExerciseResults = (id: string, list: PerformedExercise[]): Metric[] => {
        return list.find(item => item.exerciseId === id)?.results as Metric[]
    }

    const hms = (seconds: number) => {
        const matches = new Date(seconds * 1000).toISOString().match(/T([0-9:]+)./)?.at(1)
        return matches ?? '-'
    }
</script>

<div class="md:h-130 overflow-auto">
    {@render table()}
</div>

{#snippet table()}
    <table class="table table-pin-rows">
        <thead>
            {@render head()}
        </thead>
        <tbody>
            {@render body()}
        </tbody>
    </table>
{/snippet}

{#snippet head()}
    <tr>
        <th>Date</th>
        <th>Duration</th>
        {#each filteredExercises as exercise}
            <th>{exercise.name}</th>
        {/each}
    </tr>
{/snippet}

{#snippet body()}
    {#each [...workout.sessions].reverse() as session}
        <tr>
            <td>{session.date.toLocaleString()}</td>
            <td>{hms(session.duration)}</td>
            {#each filteredExercises as exercise}
                <td>
                    {@render metrics(getExerciseResults(exercise._id, session.performedExercises))}
                </td>
            {/each}
        </tr>
    {/each}
{/snippet}

{#snippet metrics(metrics: Metric[])}
    <div class="text-xs font-semibold opacity-60 flex flex-wrap gap-2">
        {#each metrics as metric}
            <span class="badge badge-outline">{metric.name}: {metric.value} {metric.unit}</span>
        {/each}
    </div>
{/snippet}