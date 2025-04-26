<script lang="ts">
    import type { Exercise, Metric } from "$lib/types";
    import { fly } from "svelte/transition";
    import type { PageProps } from "./$types"
    import StopWatch from "$lib/components/StopWatch.svelte";
    import { SvelteMap } from "svelte/reactivity";

    let { data }: PageProps = $props()

    let currentIdx = $state(0)
    let currentExercise = $derived(data.exercises[currentIdx])
    let metricsToSave: (number | undefined)[] = $state([])
    let canStepForward = $derived.by(() => {
        for (let metric of metricsToSave) {
            if (metric == undefined) return false
        }
        return true
    })
    let totalElapsed: StopWatch

    const stepForward = () => {
        if (currentIdx == data.exercises.length - 1) return
        currentIdx++
    }

    $effect(() => {
        totalElapsed.start()
        return () => {
            totalElapsed.stop()
        }
    })

    $effect(() => {
        metricsToSave = currentExercise.metrics.map(() => undefined)
    })
</script>

<h1 class="text-2xl font-bold mb-8">Gym</h1>

<div class="lg:grid grid-cols-3">
    {@render aside()}

    {@render exerciseInfo(currentExercise)}

    <div></div>
</div>

{#snippet exerciseInfo(exercise: Exercise)}
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
                <button class="btn btn-ghost basis-1/3" onclick={() => stepForward()}>Skip</button>
                <button class="btn btn-success basis-1/3" onclick={() => stepForward()} disabled={!canStepForward}>Next</button>
            </div>
        </div>
    {/key}
{/snippet}

{#snippet metricInput(metric: Metric, idx: number)}
    <div class="my-2">
        <label class="input w:80 sm:w-100">
            <span class="basis-1/2">{metric.name}</span>
            <input type="number" class="grow" placeholder={metric.value?.toString()} bind:value={metricsToSave[idx]}/>
            <span>{metric.unit}</span>
          </label>
    </div>
{/snippet}

{#snippet aside()}
    <aside class="lg:flex flex-col gap-5 items-start justify-start mb-8">
        {@render workoutInfo()}
    </aside>
{/snippet}

{#snippet workoutInfo()}
<div class="card bg-base-100 shadow-sm lg:w-60">
    <div class="card-body">
        <h2 class="card-title">{data.name}</h2>
        <div class="grid grid-cols-2 gap-y-2">
            <span>Exercise:</span>
            <span>{currentIdx + 1} / {data.exercises.length}</span>
            <span>Elapsed:</span>
            <span><StopWatch bind:this={totalElapsed}/></span>
        </div>
    </div>
</div>
{/snippet}