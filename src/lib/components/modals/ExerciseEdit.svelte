<script lang="ts">
    import { exerciseEditor, metricEditor } from "$lib/editor.svelte";
    import Icon from "../Icon.svelte";
    import Modal from "../Modal.svelte";

    let show = $derived.by(() => exerciseEditor.isActive())
    let title = $derived.by(() => exerciseEditor.isSubjectNew() ? "Adding new exercise" : "Editing exercise")

    const onImageUpload = (e: Event ) => {
        const files = (e.target as HTMLInputElement).files
        const image = files?.item(0)

        if (!image) return

        const reader = new FileReader()
        reader.onload = e => {
            exerciseEditor.subject.image = reader.result?.toString()
        }
        reader.readAsDataURL(image)
    }

    $effect(() => {
        if (!exerciseEditor.isActive()) return

        metricEditor.editNew(exerciseEditor.subject.metrics)
    })
</script>

<Modal {show} {title}>
    <div class="flex justify-center">
        <!-- svelte-ignore a11y_label_has_associated_control -->
        <fieldset class="fieldset w-80">
            <label class="label">Name</label>
            <input class="input" type="text" placeholder="Wonderful exercise" bind:value={exerciseEditor.subject.name} />

            <label class="label">Image</label>
            {#if exerciseEditor.subject.image}
                 <div class="flex justify-center">
                    <div class="relative">
                        <!-- svelte-ignore a11y_missing_attribute -->
                        <img class="rounded-box max-h-50" src={exerciseEditor.subject.image}/>
                        <button class="btn btn-sm btn-circle absolute right-2 top-2" onclick={() => exerciseEditor.subject.image = undefined}>✕</button>
                    </div>
                </div>
            {:else}
                <input class="file-input" type="file" accept="image/png, image/jpeg, image/svg" onchange={(e) => onImageUpload(e)}/>
            {/if}

            <label class="label">Description</label>
            <textarea class="textarea h-24" placeholder="Optional"  bind:value={exerciseEditor.subject.description}></textarea>

            <label class="label">Metrics</label>
            {@render metrics()}
        </fieldset>
    </div>

    {#snippet action()}
        <button class="btn btn-ghost" onclick={() => exerciseEditor.cancel()}>Cancel</button>
        <button class="btn btn-success" onclick={() => exerciseEditor.submit()} disabled={!exerciseEditor.subject.name}>{exerciseEditor.isSubjectNew() ? "Add" : "Done"}</button>
    {/snippet}
</Modal>

{#snippet metrics()}
    <div class="join">
        <input class="input join-item" placeholder="Name" bind:value={metricEditor.subject.name}/>
        <input class="input join-item" type="number" placeholder="Goal" bind:value={metricEditor.subject.value}/>
        <input class="input join-item" placeholder="Unit" bind:value={metricEditor.subject.unit}/>

        <button class="btn tooltip"
            onclick={() => metricEditor.subject.trend *= -1}
            data-tip={metricEditor.subject.trend == 1 ? 'More is better' : 'Less is better'}
            disabled={!(metricEditor.subject.name && metricEditor.subject.value)}
        >
            <Icon type={metricEditor.subject.trend == 1 ? 'Up' : 'Down'} />
        </button>
        <button class="btn btn-success join-item"
            onclick={() => {metricEditor.submit(); metricEditor.editNew(exerciseEditor.subject.metrics)}}
            disabled={!(metricEditor.subject.name && metricEditor.subject.value)}
        >
            <Icon type="Check"/>
        </button>
    </div>
    <div class="flex flex-wrap gap-2 mt-2">
        {#each exerciseEditor.subject.metrics as metric}
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <button class="btn badge badge-neutral badge-outline"
                onclick={() => metricEditor.edit($state.snapshot(metric), exerciseEditor.subject.metrics)}
            >
                {metric.name}: {metric.value} {metric?.unit} <Icon type={metric.trend == 1 ? 'Up' : 'Down'} />
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <span class="btn btn-xs btn-circle size-[1.5em]"
                    onclick={(e) => {
                        e.stopPropagation()
                        metricEditor.editNew(exerciseEditor.subject.metrics)
                        metricEditor.remove(metric, exerciseEditor.subject.metrics)
                    }}
                >
                    ✕
                </span>
            </button>
        {/each}
    </div>
{/snippet}