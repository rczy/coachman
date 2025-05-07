<script lang="ts">
    import { getDataURLs } from "$lib/confetti-emojis";
    import Confetti from "svelte-confetti";

    const duration = 5000
    let confetti: number[] = $state([])
    let timeout: number

    const onclick = () => {
        confetti.push(1)
        clearTimeout(timeout)
        timeout = setTimeout(() => confetti = [], duration)
    }
</script>

<nav class="navbar bg-base-100 shadow-sm">
    <div class="navbar-start"></div>
        <div class="navbar-center flex flex-col items-center z-10">
            <button class="btn btn-ghost text-xl" {onclick}>Coachman</button>
            {#each confetti as _}
                <Confetti x={[-1, 1]} y={[0, -1]} delay={[0, 250]} colorArray={getDataURLs()} size={60} amount={1} {duration} />
            {/each}
        </div>
    <div class="navbar-end"></div>
</nav>