// src/lib/materialUtils.ts

const materialMap: { [key: string]: string[] } = {
    Leather: ['leather', 'nappa', 'dakota', 'merino', 'vernasca'],
    Suede: ['suede', 'alcantara', 'dinamica'],
    Cloth: ['cloth', 'fabric', 'textile'],
    Vinyl: ['vinyl', 'leatherette', 'artico', 'sensatec'],
    Wood: ['wood', 'burl', 'ash', 'oak', 'walnut'],
    'Carbon Fiber': ['carbon'],
    Aluminum: ['aluminum', 'aluminium'],
};

/**
 * Maps a specific interior material name to a general material group.
 * @param specificMaterial The detailed material name from the database (e.g., "Black Nappa Leather").
 * @returns A general material group (e.g., "Leather") or "Other" if no match is found.
 */
export const getGeneralMaterial = (specificMaterial: string): string => {
    if (!specificMaterial) {
        return 'Other';
    }
    const lowerMaterial = specificMaterial.toLowerCase();
    for (const generalMaterial in materialMap) {
        if (materialMap[generalMaterial].some(keyword => lowerMaterial.includes(keyword))) {
            return generalMaterial;
        }
    }
    return 'Other';
};
