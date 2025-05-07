<script lang="ts">
    import type { EmblaCarouselType, EmblaOptionsType, EmblaPluginType } from 'embla-carousel'
    import emblaCarouselSvelte from "embla-carousel-svelte";
    import { workoutEditor } from "$lib/editor.svelte"
    import { workoutStore } from '$lib/state.svelte';
    import type { Workout } from "$lib/types"
    import DotsMenu from '../DotsMenu.svelte';
    import ExerciseList from './ExerciseList.svelte';
    import { appEvents } from '$lib/app-events';
    import Confirmation from '../modals/Confirmation.svelte';

    interface Props {
        currentIdx: number
    }
    let { currentIdx = $bindable() }: Props = $props()

    let disablePrev = $state(true);
    let disableNext = $state(true);
    let listLength = $derived(workoutStore.list.length)

    // svelte-ignore non_reactive_update
    let deleteConfirmation: Confirmation

    let emblaApi: EmblaCarouselType;
    let options: EmblaOptionsType = { loop: false };
    let plugins: EmblaPluginType[] = [];
    let scrollToEnd = false

    function onemblaInit(event: CustomEvent<EmblaCarouselType>) {
        emblaApi = event.detail;
        emblaApi
            .on('init', applyProgress)
            .on('reInit', applyProgress)
            .on('slideFocus', applyProgress)
            .on('scroll', () => {
                applyProgress()
                currentIdx = emblaApi?.selectedScrollSnap()
            })
            .on('slidesChanged', () => {
                if (scrollToEnd) {
                    emblaApi?.scrollTo(listLength - 1);
                    scrollToEnd = false;
                }
            });
        emblaApi.scrollTo(currentIdx)
        applyProgress();
    }

    const applyProgress = () => {
        disablePrev = !emblaApi.canScrollPrev();
        disableNext = !emblaApi.canScrollNext();
    }

    $effect(() => {
        const unsubscribe = appEvents.listen('WorkoutAdded', () => {
            scrollToEnd = true
        })
        return () => {
            unsubscribe()
        }
    })
</script>

<div>
    <div class="embla overflow-hidden pb-3 px-3" use:emblaCarouselSvelte="{{ options, plugins }}" {onemblaInit}>
        <div class="embla__container flex gap-5">
            {#if listLength}
                {#each workoutStore.list as workout}
                    <div class="embla__slide flex-[0_0_100%] min-w-0">
                        {@render workoutCard(workout)}
                    </div>
                {/each}
            {:else}
                {@render noWorkout()}
            {/if}
        </div>
    </div>

    {@render controls()}

    <Confirmation bind:this={deleteConfirmation} />
</div>

{#snippet controls()}
    <div class="flex justify-between px-3">
        {#if listLength > 1}
            <div class="flex gap-2">
                <button class="btn" onclick="{() => emblaApi?.scrollPrev()}" disabled="{disablePrev}">❮</button>
                <button class="btn" onclick="{() => emblaApi?.scrollNext()}" disabled="{disableNext}">❯</button>
            </div>
            <div class="flex items-center gap-1">
                {#each workoutStore.list as _, idx}
                    <!-- svelte-ignore a11y_consider_explicit_label -->
                    <button class={["btn size-4 btn-circle shadow-sm", {'btn-soft': idx === currentIdx}]} onclick={() => emblaApi?.scrollTo(idx)}>&nbsp;</button>
                {/each}
            </div>
        {/if}
    </div>
{/snippet}

{#snippet workoutCard(workout: Workout)}
    <div class="card bg-base-200 shadow-md">
        <div class="card-body">
            <h2 class="card-title mb-2">
                {workout.name}

                <DotsMenu options={[
                    {title: "Edit", icon: "Edit", item: workout, action: (item: any) => workoutEditor.edit($state.snapshot(item), workoutStore.list)},
                    {title: "Chart", icon: "Chart", item: workout, action: (item: any) => appEvents.emit('DatasetEdit', {workout: item})},
                    {title: "Remove", icon: "Remove", item: workout, action: (item: any) => {
                        deleteConfirmation.show(`Remove "${item.name}"?`, () => workoutEditor.remove(item, workoutStore.list))
                    }},
                    {title: "Add new", icon: "Add", item: workout, action: (item: any) => workoutEditor.editNew(workoutStore.list)},
                ]}/>
            </h2>

            <ExerciseList bind:exercises={workout.exercises}/>

            <div class="card-actions justify-center mt-4">
                {@render doIt(workout)}
            </div>
        </div>
    </div>
{/snippet}

{#snippet doIt(workout: Workout)}
    {#if workout.exercises.length}
        <a class="btn btn-accent btn-block sm:basis-1/2" href={`/do-it/${workout._id}`}>Let's do it!</a>
    {:else}
        <button class="btn btn-accent btn-block sm:basis-1/2" disabled>Let's do it!</button>
    {/if}
{/snippet}

{#snippet noWorkout()}
    <div class="card bg-base-200 shadow-md flex-[0_0_100%] min-w-0">
        <div class="card-body">
            <div class="card-title mb-2 size-10"></div>
            <div class="min-h-100 max-h-100 flex flex-col items-center justify-center">
                <span class="my-6">No workouts yet.</span>
                <button class="btn btn-accent" onclick={() => workoutEditor.editNew(workoutStore.list)}>
                    Add a workout
                </button>
            </div>
            <div class="card-actions justify-center mt-4 size-10"></div>
        </div>
    </div>
{/snippet}