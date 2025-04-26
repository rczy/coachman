<script>
    import '../style.css';
    import { fade } from 'svelte/transition';
    import NavBar from '$lib/components/fragments/NavBar.svelte';
    import Footer from '$lib/components/fragments/Footer.svelte';

    let { data, children } = $props();
</script>

<NavBar />

{#key data.url}
    <main class="grow container mx-auto my-8 px-4 flex flex-col" in:fade>
        {@render children()}
    </main>
{/key}

<Footer />