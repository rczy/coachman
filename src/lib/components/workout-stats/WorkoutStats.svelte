<script lang="ts">
    import type { Workout } from "$lib/types";
    import { fade } from "svelte/transition";
    import History from "./History.svelte";

    interface Props {
        workout: Workout
    }
    let { workout }: Props = $props()
</script>

{#if workout?.sessions.length}
    <div class="tabs mt-3 justify-end" in:fade>
        <input type="radio" name="stats_tabs" class="tab h-14" aria-label="Chart" checked />
        {#key workout?._id}
            <div class="tab-content p-6" in:fade>
                {workout?._id}
            </div>
        {/key}

        <input type="radio" name="stats_tabs" class="tab h-14" aria-label="History" />
        {#key workout?._id}
            <div class="tab-content p-6" in:fade>
                <History {workout}/>
            </div>
        {/key}
    </div>
{:else if workout?._id}
    <div class="min-h-100 max-h-100 flex flex-col items-center justify-center self-center" in:fade>
        <span class="my-6">Finish a workout session to see your progress!</span>
    </div>
{/if}
