<script lang="ts">
    import { appEvents } from "$lib/app-events";
    import { persistence } from "$lib/peristence";
    import type { Exercise, Metric, Workout } from "$lib/types";
    import Modal from "../Modal.svelte";

    let show = $state(false)
    let workout = $state({} as Workout)
    let exercises = $state([] as Exercise[])

    const cancel = () => {
        show = false
    }

    const save = () => {
        exercises.map((exercise, i) => {
            exercise.metrics.map((metric, j) => {
                workout.exercises[i].metrics[j].marked = metric.marked
            })
        })
        persistence.updateWorkout(workout._id, {exercises: $state.snapshot(workout.exercises)})
        cancel()
    }

    $effect(() => {
        const unsubscribe = appEvents.listen('DatasetEdit', (details) => {
            show = true
            workout = details?.workout as Workout
            exercises = $state.snapshot(workout.exercises)
        })
        return () => {
            unsubscribe()
        }
    })
</script>

<Modal {show} onclose={() => cancel()} title="Configuring dataset">

    {#if exercises?.length}
        <ul class="list">
            {#each exercises as exercise}
                {@render row(exercise)}
            {/each}
        </ul>
    {:else}
        No exercises yet
    {/if}

    {#snippet action()}
        <button class="btn btn-ghost" onclick={() => cancel()}>Cancel</button>
        <button class="btn btn-success" onclick={() => save()}>Done</button>
    {/snippet}
</Modal>

{#snippet row(exercise: Exercise)}
    {#if exercise.metrics.length}
        <li class="list-row">
            <div>
                <div>{exercise.name}</div>
                <div class="flex flex-row gap-4 mt-2 flex-wrap">
                    {@render metrics(exercise.metrics)}
                </div>
            </div>
        </li>
    {/if}
{/snippet}

{#snippet metrics(metrics: Metric[])}
    {#each metrics as metric}
        <label class="label">
            {metric.name}
            <input type="checkbox" bind:checked={metric.marked} class="toggle" />
        </label>
    {/each}
{/snippet}