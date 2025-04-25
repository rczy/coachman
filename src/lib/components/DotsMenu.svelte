<script lang="ts">
    import Icon from "./Icon.svelte";
    import type { IconType } from "./Icon.svelte"

    interface Option {
        title: string
        icon?: IconType
        action: (item: any) => void
        item: any
    }

    interface Props {
        options: Option[]
        classes?: string | string[]
    }
    let {options, classes = []}: Props = $props()
</script>

<div class={['dropdown', classes]}>
    <div tabindex="0" role="button" class="btn btn-square btn-ghost opacity-20 hover:opacity-100 active:opacity-100 transition">
        <Icon type="More" />
    </div>

    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
        {#each options as option}
            <li>
                <button onclick={(e) => {
                    option.action(option.item)
                    e.currentTarget.blur()
                }}>
                    {#if option.icon}
                        <Icon type={option.icon}/>
                    {/if}
                    {option.title}
                </button>
            </li>
        {/each}
    </ul>
</div>