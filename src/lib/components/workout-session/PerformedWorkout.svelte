<script lang="ts">
    import type { Workout, WorkoutSession } from "$lib/types";
    import { fly } from "svelte/transition";
    import PerformedExercise from "./PerformedExercise.svelte";
    import { goto } from "$app/navigation";

    interface Props {
        workout: Workout
        workoutSession: WorkoutSession
    }
    let { workout, workoutSession }: Props = $props()

    const getPerformedExercise = (exerciseId: string) => {
        return workoutSession.performedExercises.find(el => el.exerciseId === exerciseId)
    }
</script>

<div in:fly={{x: 50}}>
    {#if workoutSession.performedExercises.length}
        <p class="leading-8">
            Great job!<br>You have completed the exercises, get some rest.
        </p>
    {/if}

    <ul class="list mt-10">
        <li class="pb-2 opacity-60 tracking-wide">Performed exercises</li>

        {#each workout.exercises as exercise}
            <PerformedExercise exerciseData={exercise} performedExercise={getPerformedExercise(exercise._id)} />
        {/each}
    </ul>

    <div class="flex justify-center">
        <button class="btn btn-success w-60 mt-10"
            onclick={() => {
                workout.sessions.push(workoutSession)
                goto('/')
            }}
        >
            Finish session
        </button>
    </div>
</div>
