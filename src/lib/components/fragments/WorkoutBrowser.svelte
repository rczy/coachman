<script lang="ts">
    import WorkoutStats from "../workout-stats/WorkoutStats.svelte";
    import WorkoutCarousel from "../workout-carousel/WorkoutCarousel.svelte";
    import { workoutStore } from "$lib/state.svelte";

    let currentIdx = $state(0)
</script>

<div class="xl:grid grid-cols-2 gap-3">
    <WorkoutCarousel bind:currentIdx />
    <WorkoutStats workout={workoutStore.list[currentIdx]} />
</div>