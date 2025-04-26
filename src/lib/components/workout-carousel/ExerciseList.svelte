<script lang="ts">
    import { exerciseEditor } from "$lib/editor.svelte";
    import type { Exercise } from "$lib/types";
    import DotsMenu from "../DotsMenu.svelte";
    import Icon from "../Icon.svelte";
    import { flip } from "svelte/animate";

    interface Props {
        exercises: Exercise[]
    }
    let {exercises = $bindable()}: Props = $props();

    let listLength = $derived(exercises.length)

    function swap(idx: number, offset: number) {
        [exercises[idx], exercises[idx + offset]] = [exercises[idx + offset], exercises[idx]];
    }
</script>

{#if listLength}
    <ul class="list bg-base-100 rounded-box shadow-sm min-h-100 max-h-100 overflow-y-auto">
        <li class="p-4 tracking-wide flex items-center">
            <span class="text-sm opacity-60">Exercises</span>
            <div class="tooltip tooltip-left ml-auto" data-tip="Add new exercise">
                <button class="btn btn-square btn-xs" onclick={() => exerciseEditor.editNew(exercises)}>
                    <Icon type="Add" classes="size-4" />
                </button>
            </div>
        </li>

        {#each exercises as exercise, idx (exercise._id)}
            <div class="bg-base-100" animate:flip={{duration: 500}}>
                {@render exerciseCard(exercise, idx, idx == 0, idx + 1 == exercises.length)}
            </div>
        {/each}
    </ul>
{:else}
    <div class="bg-base-100 rounded-box shadow-sm min-h-100 max-h-100 flex flex-col items-center justify-center">
        <span class="my-6">No exercises yet.</span>
        <button class="btn btn-accent" onclick={() => exerciseEditor.editNew(exercises)}>
            Add an exercise
        </button>
    </div>
{/if}

{#snippet exerciseCard(exercise: Exercise, idx: number, isFirst: boolean, isLast: boolean)}
<li class="list-row">
    <div>
        {#if exercise.image}
            <!-- svelte-ignore a11y_missing_attribute -->
            <img class="w-20 rounded-box hidden sm:block" src={exercise.image}/>
        {/if}
    </div>
    <div>
      <div>{exercise.name}</div>
      <div class="text-xs font-semibold opacity-60 hidden sm:flex flex-wrap gap-2 mt-3">
        {#each exercise.metrics as metric}
            <div class="badge badge-ghost">{metric.name}: {metric.value} {metric.unit}</div>
        {/each}
      </div>
    </div>

    {#if exercise.description}
        <p class="list-col-wrap text-xs hidden sm:block">
            {exercise.description}
        </p>    
    {/if}

    <div class="flex items-center">
        <DotsMenu classes={"dropdown-end"} options={[
            {title: "Edit", icon: "Edit", item: exercise, action: (item: any) => exerciseEditor.edit($state.snapshot(item), exercises)},
            {title: "Clone", icon: "Clone", item: exercise, action: (item: any) => exerciseEditor.clone($state.snapshot(item), exercises)},
            {title: "Remove", icon: "Remove", item: exercise, action: (item: any) => exerciseEditor.remove(item, exercises)},
        ]}/>

        <div class="flex flex-col ml-2">
            <button class="btn btn-xs btn-square btn-ghost opacity-20 hover:opacity-100 active:opacity-100 transition" disabled={isFirst} onclick="{() => swap(idx, -1)}">
                <Icon type="Up" />
            </button>
            <button class="btn btn-xs btn-square btn-ghost opacity-20 hover:opacity-100 active:opacity-100 transition" disabled={isLast} onclick="{() => swap(idx, 1)}">
                <Icon type="Down" />
            </button>
        </div>
    </div>
  </li>
{/snippet}