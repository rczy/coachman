import { db, version } from "./db"
import type { Workout } from "./types"

const compression: CompressionFormat = 'gzip'

const dataImport = async (file: File, overwriteExisting: boolean): Promise<string> => {
    const ds = new DecompressionStream(compression)
    const decompressedStream = file.stream().pipeThrough(ds)
    const blob = await new Response(decompressedStream).blob()
    const text = await blob.text()
    const data = JSON.parse(text)

    return new Promise(async (resolve, reject) => {
        if (data?.version !== version) return reject('Version mismatch.')
        if (!Array.isArray(data?.workouts)) return reject('Malformed archive file.')

        let count = 0
        for (const workout of data?.workouts as Workout[]) {
            const stored = await db.workouts.get(workout._id)
            if (stored) {
                if (overwriteExisting) {
                    await db.workouts.update(workout._id, {...workout})
                    count++
                }
            } else {
                await db.workouts.add(workout)
                count++
            }
        }
        resolve(`${count} workouts imported.`)
    })
}

const dataExport = async (workouts: Workout[]): Promise<Blob> => {
    const json = {
        version, workouts
    }
    const stream = new Blob([JSON.stringify(json)], {type: 'application/json'}).stream()
    const compressionStream = stream.pipeThrough(
        new CompressionStream(compression)
    )
    const compressedResponse = new Response(compressionStream)
    const blob = await compressedResponse.blob()
    return new Promise(resolve => resolve(blob))
}

export const dataTransfer = {
    import: dataImport,
    export: dataExport,
}