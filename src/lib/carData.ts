import { unstable_cache } from 'next/cache';
import { knownCarBrands } from './knownCarBrands';

export const getAllMakes = unstable_cache(
    async () => {
        try {
            const response = await fetch('https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json');
            if (response.ok) {
                const data = await response.json();
                if (data.Results) {
                    const makesFromApi = data.Results.map((make: any) => make.Make_Name.trim());
                    const knownBrandsUpper = new Set(Array.from(knownCarBrands).map(b => b.toUpperCase()));

                    const filteredMakes = makesFromApi.filter((make: string) => knownBrandsUpper.has(make.toUpperCase()));

                    // To preserve the original capitalization from our curated list, we'll map back to it.
                    const finalMakes = Array.from(knownCarBrands).filter(brand =>
                        filteredMakes.some((filtered: string) => filtered.toUpperCase() === brand.toUpperCase())
                    );

                    const sortedMakes = [...new Set(finalMakes)].sort();
                    sortedMakes.push('Missing a Brand? Contact us');
                    return sortedMakes;
                }
            } else {
                console.error('Failed to fetch makes from NHTSA API. Status:', response.status);
            }
        } catch (error) {
            console.error(error);
        }

        // Return the hardcoded list as a fallback if the API fails
        const sortedKnownBrands = Array.from(knownCarBrands).sort();
        sortedKnownBrands.push('Missing a Brand? Contact us');
        return sortedKnownBrands;
    },
    ['all_makes'], // Cache key
    { revalidate: 60 * 60 * 24 } // Revalidate once a day
);
