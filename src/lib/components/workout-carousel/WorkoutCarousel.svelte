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
    import { persistence } from '$lib/peristence';

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

    const swap = (workout: Workout, direction: (-1 | 1)) => {
        const arr = workoutStore.list
        const idx = workout.order
        const neighbour = arr[idx + direction];
        [arr[idx], arr[idx + direction]] = [arr[idx + direction], arr[idx]]
        workout.order = idx + direction
        persistence.updateWorkout(workout._id, {order: workout.order})
        neighbour.order = idx
        persistence.updateWorkout(neighbour._id, {order: neighbour.order})
    }

    const addNew = () => {
        workoutEditor.editNew(
            workoutStore.list,
            (saved) => {
                const idx = workoutStore.list.findIndex(el => el._id === saved._id)
                workoutStore.list[idx].order = idx
                persistence.addWorkout($state.snapshot(workoutStore.list[idx]))
            }
        )
    }

    const edit = (workout: Workout) => {
        workoutEditor.edit(
            $state.snapshot(workout),
            workoutStore.list,
            (saved) => persistence.updateWorkout(saved._id, saved)
        )
    }

    const remove = (workout: Workout) => {
        deleteConfirmation.show(`Remove "${workout.name}"?`, () => {
            workoutEditor.remove(workout, workoutStore.list)
            persistence.deleteWorkout(workout._id)
            for (const el of workoutStore.list) {
                if (el.order < workout.order) continue
                el.order -= 1
                persistence.updateWorkout(el._id, {order: el.order})
            }
        })
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
                {#each workoutStore.list as workout, idx}
                    <!-- svelte-ignore a11y_consider_explicit_label -->
                    <button class={["btn size-4 btn-circle shadow-sm xl:tooltip", {'btn-soft': idx === currentIdx}]}
                        onclick={() => emblaApi?.scrollTo(idx)}
                        data-tip="{workout.name}"
                    >
                        &nbsp;
                    </button>
                {/each}
            </div>
        {/if}
    </div>
{/snippet}

{#snippet workoutCard(workout: Workout)}
    <div class="card bg-base-200 shadow-md">
        <div class="card-body">
            <h2 class="card-title mb-2 justify-between">
                {workout.name}
                {@render dotsMenu(workout)}
            </h2>

            <ExerciseList bind:exercises={workout.exercises} {workout} {deleteConfirmation}/>

            <div class="card-actions justify-center mt-4">
                {@render doIt(workout)}
            </div>
        </div>
    </div>
{/snippet}

{#snippet dotsMenu(workout: Workout)}
    <DotsMenu classes={"dropdown-end"} options={[
        {title: "Edit", icon: "Edit", action: () => 
            edit(workout)
        },
        {title: "Chart", icon: "Chart", action: () => 
            appEvents.emit('DatasetEdit', {workout})
        },
        {title: "Remove", icon: "Remove", action: () =>
            remove(workout)
        },
        null,
        {title: "Move left", icon: "Left",
            disabled: workout.order === 0,
            action: () => { swap(workout, -1); emblaApi?.scrollPrev() }
        },
        {title: "Move right", icon: "Right",
            disabled: workout.order === workoutStore.list.length - 1,
            action: () => { swap(workout, 1); emblaApi?.scrollNext() }
        },
        null,
        {title: "Import / export", icon: "Archive", action: () => {
            appEvents.emit('ShowArchiving')
        }},
        {title: "Add new", icon: "Add", action: () => 
            addNew()
        },
    ]}/>
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
            <div class="min-h-100 max-h-100 flex flex-col items-center justify-center gap-5">
                <button class="btn btn-accent" onclick={() => addNew()}>
                    Add a workout
                </button>
                <span>OR</span>
                <button class="btn" onclick={() => appEvents.emit('ShowArchiving')}>Import</button>
            </div>
            <div class="card-actions justify-center mt-4 size-10"></div>
        </div>
    </div>
{/snippet}