<script lang="ts">
    import type { Metric, Workout, WorkoutSession } from "$lib/types";
    import { fly } from "svelte/transition";
    import PerformedExercise from "./PerformedExercise.svelte";
    import { goto } from "$app/navigation";
    import { metricEditor } from "$lib/editor.svelte";
    import MetricAdjust from "../modals/MetricAdjust.svelte";
    import Confetti from 'svelte-confetti'
    import { getDataURLs } from "$lib/confetti-emojis";
    import { persistence } from "$lib/peristence";

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
        <div class="flex flex-col">
            <p class="leading-8">
                <span class="font-semibold">Great job!</span><br>You have completed the exercises, get some rest.
            </p>
            <div class="self-center">
                <Confetti x={[-2, 2]} y={[-1, 0.5]} xSpread={0.3} delay={[0, 250]} destroyOnComplete duration={3000} size={50} colorArray={getDataURLs()} />
            </div>
        </div>
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
                persistence.updateWorkout(workout._id, {sessions: $state.snapshot(workout.sessions)})
                goto(`/${workout._id}`)
            }}
        >
            Finish session
        </button>
    </div>
</div>

<MetricAdjust goal={adjustedMetric} />
