const emojis: string[] = [
    '🏅', '🏆', '💪', '🎯', '🔥', '🏋️‍♂️', '🏋️‍♀️', '🏃‍♂️', '🏃‍♀️', '🤸‍♂️', '🤸‍♂️',
]

export const getDataURLs = (): string[] => {
    return emojis.map((emoji) =>
        `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><text y="50%" font-size="120">${emoji}</text></svg>')`
    )
}