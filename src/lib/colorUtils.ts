// src/lib/colorUtils.ts

const colorMap: { [key: string]: string[] } = {
    Black: ['black', 'onyx', 'obsidian', 'nero'],
    White: ['white', 'ivory', 'pearl', 'blanco', 'bianco', 'weiss'],
    Silver: ['silver', 'steel', 'argent'],
    Gray: ['gray', 'grey', 'graphite', 'charcoal', 'anthracite'],
    Red: ['red', 'maroon', 'burgundy', 'crimson', 'rosso', 'rouge'],
    Blue: ['blue', 'navy', 'aqua', 'teal', 'cyan', 'bleu'],
    Green: ['green', 'olive', 'lime', 'vert'],
    Brown: ['brown', 'bronze', 'tan', 'beige', 'mocha'],
    Yellow: ['yellow', 'gold', 'giallo'],
    Orange: ['orange', 'arancio'],
    Purple: ['purple', 'violet', 'mauve'],
    Gold: ['gold'],
    Beige: ['beige', 'tan'],
};

/**
 * Maps a specific color name to a general color group.
 * @param specificColor The detailed color name from the database (e.g., "Mythos Black Metallic").
 * @returns A general color group (e.g., "Black") or "Other" if no match is found.
 */
export const getGeneralColor = (specificColor: string): string => {
    if (!specificColor) {
        return 'Other';
    }
    const lowerColor = specificColor.toLowerCase();
    for (const generalColor in colorMap) {
        if (colorMap[generalColor].some(keyword => lowerColor.includes(keyword))) {
            return generalColor;
        }
    }
    return 'Other';
};
