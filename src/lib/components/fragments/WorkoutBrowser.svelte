<script lang="ts">
    import WorkoutStats from "../workout-stats/WorkoutStats.svelte";
    import WorkoutCarousel from "../workout-carousel/WorkoutCarousel.svelte";
</script>

<div class="xl:flex">
    <div class="flex-1">
        <WorkoutCarousel/>
    </div>
    <div class="flex-1">
        <WorkoutStats/>
    </div>
</div>