<script lang="ts">
    import Modal from "../Modal.svelte";

    let visible = $state(false)
    let modalText = $state('')
    let callback: () => void

    export const show = (text: string, onConfirm: () => void) => {
        modalText = text
        visible = true
        callback = onConfirm
    }

    const confirm = () => {
        callback?.()
        cancel()
    }

    const cancel = () => {
        visible = false
    }
</script>

<Modal show={visible} onclose={() => cancel()} title="Confirmation">
    
    {modalText}

    {#snippet action()}
        <button class="btn btn-ghost" onclick={cancel}>Cancel</button>
        <button class="btn btn-error" onclick={confirm}>Yes</button>
    {/snippet}
</Modal>