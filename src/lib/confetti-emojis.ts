const emojis: string[] = [
    '🏅', '🏆', '💪', '🎯', '🔥', '🏋️‍♂️', '🏋️‍♀️', '🏃‍♂️', '🏃‍♀️', '🤸‍♂️', '🤸‍♂️',
]

export const getDataURLs = (): string[] => {
    return emojis.map((emoji) =>
        `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="60">${emoji}</text></svg>')`
    )
}