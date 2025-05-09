<script lang="ts">
    import { appEvents } from "$lib/app-events";
    import { dataTransfer } from "$lib/data-transfer";
    import { fade } from "svelte/transition";
    import Modal from "../Modal.svelte";
    import { workoutStore } from "$lib/state.svelte";

    const transferTypes = ['Import', 'Export'] as const
    type TransferType = typeof transferTypes[number]
    interface Alert {
        type: 'error' | 'success'
        msg: string
    }

    let show = $state(false)
    let operation = $state('Import' as TransferType)
    let loading = $state(false)
    let alert: Alert | null = $state(null)

    let exportFileName = $state('')
    let exportedObjURL = $state('')

    let files: FileList | undefined = $state()
    let overwriteExisting = $state(false)

    const cancel = () => {
        reset()
        show = false
    }

    const reset = () => {
        URL.revokeObjectURL(exportedObjURL)
        exportedObjURL = ''
        alert = null
    }

    const isValid = (): boolean => {
        switch (operation) {
            case 'Export':
                return !!exportFileName
            case 'Import':
                return !!(files as FileList)?.length
            default:
                return false
        }
    }

    const transfer = async () => {
        reset()
        loading = true
        try {
            switch (operation) {
                case 'Export':
                    const blob = await dataTransfer.export(workoutStore.list)
                    exportedObjURL = URL.createObjectURL(blob)
                    break
                case 'Import':
                    const file = files?.item(0)
                    if (file) {
                        const msg = await dataTransfer.import(file, overwriteExisting)
                        alert = {type: 'success', msg}
                        workoutStore.load()
                    }
                    break
            }
        } catch (error) {
            alert = {type: 'error', msg: error as string}
        }
        loading = false
    }

    $effect(() => {
        const unsubscribe = appEvents.listen('ShowArchiving', (details) => show = true)
        return () => unsubscribe()
    })
</script>

<Modal {show} onclose={() => cancel()} title="Import / export workouts">

    <div class="flex justify-center">
        <!-- svelte-ignore a11y_label_has_associated_control -->
        <fieldset class="fieldset w-80">
            <label class="label">Operation</label>
            <select bind:value={operation} class="select">
                {#each transferTypes as t}
                    <option value={t}>{t}</option>
                {/each}
            </select>

            {#if operation === 'Export'}
                <label class="label">Filename</label>
                <input type="text" class="input" placeholder="Filename" bind:value={exportFileName}/>
                {@render downloadButton()}
            {:else}
                <label class="label">File</label>
                <input class="file-input" type="file" accept=".cma" oncancel={(e) => e.stopPropagation()} bind:files />
                <label class="label">Mode</label>
                <select bind:value={overwriteExisting} class="select">
                    <option value={true}>Overwrite</option>
                    <option value={false}>Merge</option>
                </select>
            {/if}

            {@render errorAlert()}
        </fieldset>
    </div>

    {#snippet action()}
        <button class="btn btn-ghost" onclick={() => cancel()} disabled={loading}>Cancel</button>
        <button class="btn btn-success" onclick={() => transfer()} disabled={loading || !isValid()}>
            {operation}
            {#if loading}
                <span class="loading loading-spinner"></span>
            {/if}
        </button>
    {/snippet}
</Modal>

{#snippet downloadButton()}
    {#if exportedObjURL}
        <div transition:fade>
            <div class="divider"></div>
            <a class="btn w-full" href={exportedObjURL} download={`${exportFileName}.cma`}>
                Download archive
            </a>
        </div>
    {/if}
{/snippet}

{#snippet errorAlert()}
    {#if alert}
        <div role="alert" class={[
                "alert alert-soft mt-5",
                alert.type === 'success' ? 'alert-success' : 'alert-error'
            ]}
            transition:fade
        >
            <span>{alert.msg}</span>
        </div>
    {/if}
{/snippet}