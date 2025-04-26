<script lang="ts">
    import type { Exercise, Metric } from "$lib/types";
    import { fade, fly } from "svelte/transition";
    import type { PageProps } from "./$types"
    import { SvelteDate } from "svelte/reactivity";

    let { data }: PageProps = $props()

    let totalTime = $state(new SvelteDate())
    let currentIdx = $state(0)
    let currentExercise = $derived(data.exercises[currentIdx])
</script>

<h1 class="text-2xl font-bold mb-8">Gym</h1>

<div class="grid grid-cols-3">
    {@render aside()}

    {@render exerciseInfo(currentExercise)}

    <div></div>
</div>

{#snippet exerciseInfo(exercise: Exercise)}
    {#key exercise._id}
        <div class="grow" in:fly={{x: -50}}>
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
                {#each exercise.metrics as metric}
                    {@render metricInput(metric)}
                {/each}
            </div>
            <div class="flex justify-between mt-5">
                <button class="btn basis-1/3">Skip</button>
                <button class="btn btn-success basis-1/3" onclick={() => currentIdx++}>Next</button>
            </div>
        </div>
    {/key}
{/snippet}

{#snippet metricInput(metric: Metric)}
    <div class="my-2">
        <label class="input w-100">
            <span class="basis-1/2">{metric.name}</span>
            <input type="number" class="grow" placeholder={metric.value?.toString()} />
            <span>{metric.unit}</span>
          </label>
    </div>
{/snippet}

{#snippet aside()}
    <aside class="flex items-start justify-start">
        <div class="card bg-base-100 shadow-sm w-60">
            <div class="card-body">
            <h2 class="card-title">{data.name}</h2>
            <p>{totalTime.getSeconds()}</p>
            </div>
        </div>
    </aside>
{/snippet}
