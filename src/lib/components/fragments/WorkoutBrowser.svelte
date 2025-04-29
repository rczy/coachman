<script lang="ts">
    import WorkoutStats from "../workout-stats/WorkoutStats.svelte";
    import WorkoutCarousel from "../workout-carousel/WorkoutCarousel.svelte";
</script>

<div class="xl:grid grid-cols-2">
    <WorkoutCarousel/>
    <WorkoutStats/>
</div>