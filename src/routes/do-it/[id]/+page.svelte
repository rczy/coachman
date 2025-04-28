<script lang="ts">
    import type { PageProps } from "./$types"
    import WorkoutInfo from "$lib/components/workout-session/WorkoutInfo.svelte";
    import ExerciseDetails from "$lib/components/workout-session/ExerciseDetails.svelte";

    let { data }: PageProps = $props()

    let currentIdx = $state(0)
    let currentExercise = $derived(data.exercises[currentIdx])

    const stepForward = () => {
        if (currentIdx == data.exercises.length - 1) return
        currentIdx++
    }
</script>

<h1 class="text-2xl font-bold mb-8">Gym</h1>

<div class="lg:grid grid-cols-3">
    {@render aside()}

    <ExerciseDetails exercise={currentExercise} onSkip={() => stepForward()} onNext={() => stepForward()}/>

    <div></div>
</div>

{#snippet aside()}
    <aside class="lg:flex flex-col gap-5 items-start justify-start mb-8">
        <WorkoutInfo workoutName={data.name} progress={currentIdx + 1} total={data.exercises.length}/>
    </aside>
{/snippet}