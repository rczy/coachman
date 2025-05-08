<script lang="ts">
    import { appEvents } from "$lib/app-events";
    import { workoutEditor } from "$lib/editor.svelte";
    import Modal from "../Modal.svelte";

    let show = $derived.by(() => workoutEditor.isActive())
    let title = $derived.by(() => workoutEditor.isSubjectNew() ? "Adding new workout" : "Editing workout")

    const save = () => {
        workoutEditor.submit()
        appEvents.emit('WorkoutAdded')
    }
    const cancel = () => workoutEditor.cancel()
</script>

<Modal {show} {title} onclose={() => cancel()}>
    <div class="flex justify-center">
        <fieldset class="fieldset w-80">
            <!-- svelte-ignore a11y_label_has_associated_control -->
            <label class="label">Name</label>
            <input class="input" type="text" placeholder="Awesome workout" bind:value={workoutEditor.subject.name} />
        </fieldset>
    </div>

    {#snippet action()}
        <button class="btn btn-ghost" onclick={() => cancel()}>Cancel</button>
        <button class="btn btn-success" onclick={() => save()} disabled={!workoutEditor.subject.name}>{workoutEditor.isSubjectNew() ? "Add" : "Done"}</button>
    {/snippet}
</Modal>