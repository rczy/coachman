import { error } from "@sveltejs/kit"
import type { PageLoad } from "./$types"
import { workoutStore } from "$lib/state.svelte"

export const load: PageLoad = ({params}) => {
    if (!params.id) {
        return { index: 0 }
    }
    const index = workoutStore.list.findIndex(item => item._id === params.id)
    return index >= 0 ? { index } : error(404, 'Not found')
}