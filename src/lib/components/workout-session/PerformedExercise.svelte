<script lang="ts">
    import type { Exercise, Metric, PerformedExercise } from "$lib/types";

    interface Props {
        exerciseData: Exercise
        performedExercise: PerformedExercise | undefined
        onAdjust: (goal: Metric, result: Metric, saveTo: Metric[]) => void
    }
    let { exerciseData, performedExercise, onAdjust }: Props = $props()

    const getMetricResult = (metricId: string): Metric => {
        return performedExercise?.results.find(res => res._id === metricId) ?? {} as Metric
    }
</script>

<li class={["list-row", {"opacity-40": !performedExercise}]}>
    <div>
        {#if exerciseData.image}
            <!-- svelte-ignore a11y_missing_attribute -->
            <img class={["w-20 rounded-box hidden sm:block", {grayscale: !performedExercise}]} src={exerciseData.image}/>
        {/if}
    </div>
    <div>
        <div>{exerciseData.name}</div>
        <div class="text-xs font-semibold opacity-60 flex flex-wrap gap-2 mt-3">
            {#if performedExercise}
                {#each exerciseData.metrics as goal}
                    {@render metricBadge(goal, getMetricResult(goal._id))}
                {/each}
            {/if}
        </div>
    </div>
</li>

{#snippet metricBadge(goal: Metric, result: Metric)}
    <button class={[
            'btn badge badge-outline',
            goal.trend * result.trend >= 0 ? 'badge-success' : 'badge-warning'
        ]}
        onclick={() => onAdjust(goal, result, performedExercise?.results ?? [])}
    >
        {goal.trend * result.trend > 0 ? '🔥' : ''} {goal.name}: {result.value} / {goal.value} {goal.unit}
    </button>
{/snippet}