<script lang="ts">
    import type { PageProps } from "./$types"
    import WorkoutInfo from "$lib/components/workout-session/WorkoutInfo.svelte";
    import ExerciseDetails from "$lib/components/workout-session/ExerciseDetails.svelte";
    import PerformedWorkout from "$lib/components/workout-session/PerformedWorkout.svelte";
    import type { Metric, MetricValue, Trend, WorkoutSession } from "$lib/types";

    let { data }: PageProps = $props()

    let workoutSession: WorkoutSession = $state({
        date: new Date(),
        duration: 0,
        performedExercises: []
    })

    let currentIdx = $state(0)
    let currentExercise = $derived(data.exercises[currentIdx])
    let inProgress = $state(true)

    let workoutInfo: WorkoutInfo;

    const addPerformedExercise = (result: MetricValue[]) => {
        const metrics: Metric[] = []
        currentExercise.metrics.map((goal, idx) => {
            if (goal.value == undefined || result[idx] == undefined) return
            metrics.push({
                _id: goal._id,
                name: goal.name,
                trend: Math.sign(result[idx] - goal.value) as Trend,
                value: result[idx],
                unit: goal.unit
            })
        })
        workoutSession.performedExercises.push({
            exerciseId: currentExercise._id,
            results: metrics
        })
    }

    const stepForward = () => {
        if (currentIdx == data.exercises.length - 1) {
            workoutInfo.haltStopWatch()
            inProgress = false
            workoutSession.duration = workoutInfo.getElapsed()
            return
        }
        currentIdx++
    }
</script>

<h1 class="text-2xl font-bold mb-8">Gym</h1>

<div class="lg:grid grid-cols-3">
    {@render aside()}

    {#if inProgress}
        <ExerciseDetails
            exercise={currentExercise}
            onSkip={() => stepForward()}
            onNext={(result: MetricValue[]) => { addPerformedExercise(result); stepForward() }}
        />
    {:else}
        <PerformedWorkout workout={data} {workoutSession} />
    {/if}

    <div></div>
</div>

{#snippet aside()}
    <aside class="lg:flex flex-col gap-5 items-start justify-start mb-8">
        <WorkoutInfo bind:this={workoutInfo} workoutName={data.name} progress={currentIdx + 1} total={data.exercises.length}/>
    </aside>
{/snippet}