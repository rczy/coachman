<script lang="ts">
    import { metricEditor } from "$lib/editor.svelte";
    import type { Metric, Trend } from "$lib/types";
    import Modal from "../Modal.svelte";
    import MetricInput from "../workout-session/MetricInput.svelte";

    interface Props {
        goal: Metric
    }
    let { goal }: Props = $props()

    let show = $derived.by(() => metricEditor.isActive())

    $effect(() => {
        if (goal.value == undefined || metricEditor.subject.value == undefined) return
        metricEditor.subject.trend = Math.sign(metricEditor.subject.value - goal.value) as Trend
    })
</script>

<Modal {show} title="Adjusting metric">
    <div class="flex justify-center">
        <MetricInput {goal} bind:result={metricEditor.subject.value}/>
    </div>

    {#snippet action()}
        <button class="btn btn-ghost" onclick={() => metricEditor.cancel()}>Cancel</button>
        <button class="btn btn-success" onclick={() => metricEditor.submit()} disabled={!metricEditor.subject.value}>Done</button>
    {/snippet}
</Modal>