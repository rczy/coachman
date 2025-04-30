<script lang="ts">
    import type { Metric, MetricValue } from "$lib/types";

    interface Props {
        goal: Metric
        result: MetricValue
    }
    let { goal, result = $bindable() }: Props = $props()

    const getMetricColor = (goal: Metric, result: MetricValue): string => {
        if (result == null || goal.value == null) return '' // intentional loose check
        return (goal.trend * Math.sign(result - goal.value)) >= 0 ? 'input-success' : 'input-warning'
    }
</script>

<div class="my-2">
    <label class={["input w:80 sm:w-100", getMetricColor(goal, result)]}>
        <span class="basis-1/2">{goal.name}</span>
        <input type="number" class="grow" placeholder={goal.value?.toString()} bind:value={result}/>
        <span>{goal.unit}</span>
    </label>
</div>