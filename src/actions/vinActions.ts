'use server';

interface VinDecodeResult {
    success: boolean;
    data?: {
        make: string;
        model: string;
        year: number;
        trim?: string;
        horsepower?: number;
        cylinders?: number;
        driveWheels?: string;
        fuelType?: string;
        transmission?: string;
        bodyStyle?: string;
        doors?: number;
        engineVolume?: number;
        wheel?: 'Left' | 'Right';
        features: string[];
    };
    error?: string;
}

export async function decodeVin(vin: string): Promise<VinDecodeResult> {
    if (!vin || vin.length < 11) {
        return { success: false, error: 'Invalid VIN provided.' };
    }

    try {
        const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${vin}?format=json`);
        if (!response.ok) {
            console.error('VIN decoding error:', 'Failed to fetch data from NHTSA VIN API');
            return { success: false, error: 'An unexpected error occurred while decoding the VIN.' };
        }
        const data = await response.json();
        const results = data.Results[0];

        if (!results || !results.Make || !results.Model || !results.ModelYear) {
            return { success: false, error: 'VIN not found or invalid.' };
        }

        const features: string[] = [];
        if (results.ESC?.toUpperCase() === 'STANDARD') features.push('Electronic Stability Control (ESC)');
        if (results.TractionControl?.toUpperCase() === 'STANDARD') features.push('Traction Control');
        if (results.AirBagLocSide) features.push('Side Airbags');
        if (results.AirBagLocCurtain) features.push('Curtain Airbags');
        if (results.BlindSpotMon?.toUpperCase() === 'YES') features.push('Blind Spot Monitoring');
        if (results.LaneDepartureWarning?.toUpperCase() === 'YES') features.push('Lane Departure Warning');
        if (results.LaneKeepSystem?.toUpperCase() === 'YES') features.push('Lane Keep Assist');
        if (results.ForwardCollisionWarning?.toUpperCase() === 'YES') features.push('Forward Collision Warning');
        if (results.RearCrossTrafficAlert?.toUpperCase() === 'YES') features.push('Rear Cross-Traffic Alert');
        if (results.AdaptiveCruiseControl?.toUpperCase() === 'YES') features.push('Adaptive Cruise Control');
        if (results.Turbo?.toUpperCase() === 'YES') features.push('Turbocharged Engine');

        let wheel: 'Left' | 'Right' | undefined;
        if (results.SteeringLocation) {
            if (results.SteeringLocation.toUpperCase().includes('LEFT')) wheel = 'Left';
            else if (results.SteeringLocation.toUpperCase().includes('RIGHT')) wheel = 'Right';
        }

        return {
            success: true,
            data: {
                make: results.Make,
                model: results.Model,
                year: parseInt(results.ModelYear, 10),
                trim: results.Trim,
                horsepower: results.EngineHP ? parseInt(results.EngineHP, 10) : undefined,
                cylinders: results.EngineCylinders ? parseInt(results.EngineCylinders, 10) : undefined,
                driveWheels: results.DriveType,
                fuelType: results.FuelTypePrimary,
                transmission: results.TransmissionStyle,
                bodyStyle: results.BodyClass,
                doors: results.Doors ? parseInt(results.Doors, 10) : undefined,
                engineVolume: results.DisplacementL ? parseFloat(results.DisplacementL) : undefined,
                wheel: wheel,
                features: features,
            },
        };
    } catch (error) {
        console.error('VIN decoding error:', error);
        return { success: false, error: 'An unexpected error occurred while decoding the VIN.' };
    }
}
