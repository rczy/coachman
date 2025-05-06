<script lang="ts">
    import type { Metric, Workout, WorkoutSession } from "$lib/types";
    import { fly } from "svelte/transition";
    import PerformedExercise from "./PerformedExercise.svelte";
    import { goto } from "$app/navigation";
    import { metricEditor } from "$lib/editor.svelte";
    import MetricAdjust from "../modals/MetricAdjust.svelte";

    interface Props {
        workout: Workout
        workoutSession: WorkoutSession
    }
    let { workout, workoutSession }: Props = $props()

    let adjustedMetric = $state({} as Metric)

    const getPerformedExercise = (exerciseId: string) => {
        return workoutSession.performedExercises.find(el => el.exerciseId === exerciseId)
    }

    const adjustMetric = (goal: Metric, result: Metric, saveTo: Metric[]) => {
        adjustedMetric = goal
        metricEditor.edit($state.snapshot(result), saveTo)
    }
</script>

<div in:fly={{x: 50}}>
    {#if workoutSession.performedExercises.length}
        <p class="leading-8">
            <span class="font-semibold">Great job!</span><br>You have completed the exercises, get some rest.
        </p>
    {/if}

    <ul class="list mt-7">
        <li class="pb-2 opacity-60 tracking-wide">Performed exercises</li>

        {#each workout.exercises as exercise}
            <PerformedExercise exerciseData={exercise} performedExercise={getPerformedExercise(exercise._id)} onAdjust={adjustMetric}/>
        {/each}
    </ul>

    <div class="flex justify-center">
        <button class="btn btn-success w-60 mt-7"
            onclick={() => {
                workout.sessions.push(workoutSession)
                goto(`/${workout._id}`)
            }}
        >
            Finish session
        </button>
    </div>
</div>

<MetricAdjust goal={adjustedMetric} />
