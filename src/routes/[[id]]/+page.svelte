<script lang="ts">
    import ExerciseEdit from "$lib/components/modals/ExerciseEdit.svelte";
    import { workoutStore } from "$lib/state.svelte";
    import WorkoutEdit from "$lib/components/modals/WorkoutEdit.svelte";
    import ChartEdit from "$lib/components/modals/ChartEdit.svelte";
    import WorkoutCarousel from "$lib/components/workout-carousel/WorkoutCarousel.svelte";
    import WorkoutStats from "$lib/components/workout-stats/WorkoutStats.svelte";
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props()

    let currentIdx = $state(data.index)
    let currentWorkout = $derived(workoutStore.list[currentIdx])
</script>

<div class="md:mt-12 xl:grid grid-cols-2 gap-5">
    <WorkoutCarousel bind:currentIdx />
    <WorkoutStats workout={currentWorkout} />
</div>

<WorkoutEdit />
<ExerciseEdit />
<ChartEdit />