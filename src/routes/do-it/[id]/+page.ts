import { error } from "@sveltejs/kit"
import type { PageLoad } from "./$types"
import { workoutStore } from "$lib/state.svelte"

export const load: PageLoad = ({params}) => {
    const workout = workoutStore.list.find(item => item._id === params.id)
    return workout ?? error(404, 'Not found')
}