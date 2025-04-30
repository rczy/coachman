<script lang="ts">
    import type { Exercise, MetricValue } from '$lib/types';
    import { fly } from 'svelte/transition';
    import MetricInput from './MetricInput.svelte';

    interface Props {
        exercise: Exercise
        onSkip: () => void
        onNext: (results: MetricValue[]) => void
    }
    let { exercise, onSkip, onNext }: Props = $props()

    let metricsToSave: MetricValue[] = $state([])
    let canStepForward = $derived.by(() => {
        for (const result of metricsToSave) {
            if (result == null) return false
        }
        return true
    })

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
            {#each exercise.metrics as goal, idx}
                <MetricInput {goal} bind:result={metricsToSave[idx]}/>
            {/each}
        </div>
        <div class="flex justify-between mt-5">
            <button class="btn btn-ghost basis-1/3" onclick={() => onSkip()}>Skip</button>
            <button class="btn btn-success basis-1/3" onclick={() => onNext(metricsToSave)} disabled={!canStepForward}>Next</button>
        </div>
    </div>
{/key}