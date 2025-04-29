<script lang="ts">
    import type { Exercise, Metric, Trend } from '$lib/types';
    import { fly } from 'svelte/transition';

    interface Props {
        exercise: Exercise
        onSkip: Function
        onNext: Function
    }
    let { exercise, onSkip, onNext }: Props = $props()

    let metricsToSave: (number | undefined)[] = $state([])
    let canStepForward = $derived.by(() => {
        for (let metric of metricsToSave) {
            if (metric == undefined) return false
        }
        return true
    })

    const getMetricColor = (currentValue: (number | undefined), goal: Metric): string => {
        if (currentValue == null || goal.value == null) return '' // intentional loose check
        const goalReached = (goal.trend === 1) ? (currentValue >= goal.value) : (currentValue < goal.value)
        return goalReached ? 'input-success' : 'input-warning'
    }

    $effect(() => {
        metricsToSave = exercise.metrics.map(() => undefined)
    })
</script>


{#key exercise._id}
    <div class="grow" in:fly={{x: 50}}>
        <h2 class="text-lg font-bold mb-5">{exercise.name}</h2>
        {#if exercise.image}
            <img class="rounded-box max-h-60 mb-5 mx-auto" src={exercise.image} alt={exercise.name}/>
        {/if}
        {#if exercise.description}
            <p class="mb-5">
                {exercise.description}
            </p>
        {/if}
        <div class="flex flex-col items-center">
            {#each exercise.metrics as metric, idx}
                {@render metricInput(metric, idx)}
            {/each}
        </div>
        <div class="flex justify-between mt-5">
            <button class="btn btn-ghost basis-1/3" onclick={() => onSkip()}>Skip</button>
            <button class="btn btn-success basis-1/3" onclick={() => onNext()} disabled={!canStepForward}>Next</button>
        </div>
    </div>
{/key}

{#snippet metricInput(metric: Metric, idx: number)}
    <div class="my-2">
        <label class={["input w:80 sm:w-100", getMetricColor(metricsToSave[idx], metric)]}>
            <span class="basis-1/2">{metric.name}</span>
            <input type="number" class="grow" placeholder={metric.value?.toString()} bind:value={metricsToSave[idx]}/>
            <span>{metric.unit}</span>
          </label>
    </div>
{/snippet}