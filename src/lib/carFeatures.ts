// src/lib/carFeatures.ts

// Using an object for easier grouping and potential future extensions
export const featureCategories = {
    Comfort: [
        'Air Conditioning',
        'Power Steering',
        'Power Windows',
        'Heated Seats',
        'Ventilated Seats',
        'Sunroof / Moonroof',
        'Leather Seats',
        'Cruise Control',
        'Keyless Entry',
        'Push-button Start',
        'Ambient Lighting',
        'Heated Steering Wheel',
    ],
    Safety: [
        'ABS (Anti-lock Braking System)',
        'Airbags',
        'Backup Camera',
        'Blind Spot Monitoring',
        'Lane Departure Warning',
        'Traction Control',
        'Parking Sensors',
        '360-degree Camera',
        'Adaptive Cruise Control',
        'Forward Collision Warning',
    ],
    Multimedia: [
        'Bluetooth',
        'GPS / Navigation System',
        'Apple CarPlay',
        'Android Auto',
        'Premium Sound System',
        'USB Port',
        'Touchscreen Display',
        'Wireless Charging',
    ],
    Exterior: [
        'Alloy Wheels',
        'LED Headlights',
        'Fog Lights',
        'Roof Rack',
        'Towing Package',
        'Power Liftgate',
    ],
};

// A flat array of all feature names, derived from the categories
export const allCarFeatures = Object.values(featureCategories).flat();

// TypeScript type for a single feature
export type CarFeature = typeof allCarFeatures[number];
