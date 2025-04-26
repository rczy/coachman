<script lang="ts">
    import { workoutEditor } from "$lib/editor.svelte";
    import Modal from "../Modal.svelte";

    let show = $derived.by(() => workoutEditor.isActive())
    let title = $derived.by(() => workoutEditor.isSubjectNew() ? "Adding new workout" : "Editing workout")
</script>

<Modal {show} {title}>
    <div class="flex justify-center">
        <fieldset class="fieldset w-80">
            <!-- svelte-ignore a11y_label_has_associated_control -->
            <label class="label">Name</label>
            <input class="input" type="text" placeholder="Awesome workout" bind:value={workoutEditor.subject.name} />
        </fieldset>
    </div>

    {#snippet action()}
        <button class="btn btn-ghost" onclick={() => workoutEditor.cancel()}>Cancel</button>
        <button class="btn btn-success" onclick={() => workoutEditor.submit()} disabled={!workoutEditor.subject.name}>{workoutEditor.isSubjectNew() ? "Add" : "Done"}</button>
    {/snippet}
</Modal>