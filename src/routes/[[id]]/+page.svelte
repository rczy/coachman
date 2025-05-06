<script lang="ts">
    import ExerciseEdit from "$lib/components/modals/ExerciseEdit.svelte";
    import WorkoutBrowser from "$lib/components/fragments/WorkoutBrowser.svelte";
    import WorkoutEdit from "$lib/components/modals/WorkoutEdit.svelte";
    import ChartEdit from "$lib/components/modals/ChartEdit.svelte";
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props()
</script>

<h1 class="text-2xl font-bold mb-8">Briefing</h1>

<WorkoutBrowser index={data.index} />

<WorkoutEdit />
<ExerciseEdit />
<ChartEdit />