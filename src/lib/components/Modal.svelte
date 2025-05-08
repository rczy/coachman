<script lang="ts">
    import type { Snippet } from "svelte";

    interface Props {
        show: boolean
        closable?: boolean
        title?: string
        action?: Snippet
        onclose?: () => void
        children?: Snippet
    }
    let { show = $bindable(), closable = false, title, action, onclose, children }: Props = $props()

    let modal: HTMLDialogElement;

    $effect(() => {
        if (show) modal.showModal()
        else modal.close()
    })
</script>

<dialog
    bind:this={modal}
    onclose={() => onclose?.()}
    oncancel={() => onclose?.()}
    class="modal"
>
    <div class="modal-box">
        {#if closable}
            <form method="dialog">
                <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
        {/if}
        {#if title}
            <h3 class="text-lg font-bold mb-6">{title}</h3>
        {/if}
        
        {@render children?.()}

        <div class="modal-action">
            {@render action?.()}
        </div>
    </div>
</dialog>