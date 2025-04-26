<script>
    import ExerciseEdit from "$lib/components/modals/ExerciseEdit.svelte";
    import WorkoutBrowser from "$lib/components/fragments/WorkoutBrowser.svelte";
    import WorkoutEdit from "$lib/components/modals/WorkoutEdit.svelte";
</script>

<h1 class="text-2xl font-bold mb-8">Briefing</h1>

<WorkoutBrowser />

<WorkoutEdit />
<ExerciseEdit />