// A map to define how raw database values should be split into user-friendly filter options.
const normalizationMap: { [key: string]: { [value: string]: string[] } } = {
    bodyStyle: {
        'Sedan/Saloon': ['Sedan', 'Saloon'],
    },
    driveWheels: {
        'AWD/All-Wheel Drive': ['AWD'],
        'FWD/Front-Wheel Drive': ['FWD'],
        'RWD/Rear-Wheel Drive': ['RWD'],
    },
};

/**
 * Generates a clean, unique, and sorted list of filter options from raw database values.
 * @param rawValues - An array of strings from the database.
 * @param field - The field to normalize (e.g., 'bodyStyle').
 * @returns A sorted array of unique, user-friendly strings.
 */
export const getDisplayValues = (rawValues: string[], field: keyof typeof normalizationMap): string[] => {
    const displayValues = new Set<string>();
    rawValues.forEach(rawValue => {
        const mapped = normalizationMap[field]?.[rawValue];
        if (mapped) {
            mapped.forEach(value => displayValues.add(value));
        } else {
            displayValues.add(rawValue);
        }
    });
    return Array.from(displayValues).sort();
};

/**
 * Checks if a car's value matches any of the selected filter options, accounting for normalization.
 * @param carValue - The raw value from the car object (e.g., 'Sedan/Saloon').
 * @param selectedValues - The array of user-selected filter options (e.g., ['Sedan']).
 * @param field - The field to check (e.g., 'bodyStyle').
 * @returns True if the car's value matches the filter, false otherwise.
 */
export const matchesFilter = (
    carValue: string | null | undefined,
    selectedValues: string[],
    field: keyof typeof normalizationMap
): boolean => {
    if (selectedValues.length === 0) return true;
    if (!carValue) return false;

    // Get the possible user-facing values for the car's raw value.
    const carDisplayValues = normalizationMap[field]?.[carValue] || [carValue];

    // Check if any of the car's possible values are in the user's selected list.
    return carDisplayValues.some(displayValue => selectedValues.includes(displayValue));
};
