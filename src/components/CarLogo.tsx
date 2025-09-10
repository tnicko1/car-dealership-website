'use client';

import { Car } from 'lucide-react';
import dynamic from 'next/dynamic';
import { FC, SVGProps, ComponentType, memo } from 'react';

// Define the props for the CarLogo component
interface CarLogoProps extends SVGProps<SVGSVGElement> {
    make: string;
}

// A mapping from car make (lowercase) to the corresponding logo component name
const makeToLogoName: { [key: string]: string } = {
    'acura': 'Acura',
    'aixam': 'Aixam',
    'alpina': 'Alpina',
    'ariel': 'Ariel',
    'ascari': 'Ascari',
    'aston martin': 'AstonMartin',
    'atalanta motors': 'AtalantaMotors',
    'audi': 'Audi',
    'alfa romeo': 'AlfaRomeo',
    'bentley': 'Bentley',
    'bmw': 'Bmw',
    'brabus': 'Brabus',
    'bugatti': 'Bugatti',
    'buick': 'Buick',
    'cadillac': 'Cadillac',
    'chevrolet': 'Chevrolet',
    'chrysler': 'Chrysler',
    'citroen': 'Citroen',
    'dacia': 'Dacia',
    'daihatsu': 'Daihatsu',
    'delorean': 'DeLorean',
    'dodge': 'Dodge',
    'eagle': 'Eagle',
    'ferrari': 'Ferrari',
    'fiat': 'Fiat',
    'fisker': 'Fisker',
    'force motors': 'ForceMotors',
    'ford': 'Ford',
    'gmc': 'Gmc',
    'honda': 'Honda',
    'hummer': 'Hummer',
    'hyundai': 'Hyundai',
    'infiniti': 'Infiniti',
    'isuzu': 'Isuzu',
    'jaguar': 'Jaguar',
    'jeep': 'Jeep',
    'kia': 'Kia',
    'koenigsegg': 'Koenigsegg',
    'lamborghini': 'Lamborghini',
    'lancia': 'Lancia',
    'land rover': 'LandRover',
    'lexus': 'Lexus',
    'lincoln': 'Lincoln',
    'lotus': 'Lotus',
    'lucid': 'Lucid',
    'maserati': 'Maserati',
    'mazda': 'Mazda',
    'mclaren': 'McLaren',
    'mercedes-amg': 'MercedesAmg',
    'mercedes-benz': 'MercedesBenz',
    'mercury': 'Mercury',
    'mini': 'Mini',
    'mitsubishi': 'Mitsubishi',
    'nissan': 'Nissan',
    'oldsmobile': 'Oldsmobile',
    'opel': 'Opel',
    'pagani': 'Pagani',
    'pars khodro': 'ParsKhodro',
    'peugeot': 'Peugeot',
    'plymouth': 'Plymouth',
    'polaris': 'Polaris',
    'pontiac': 'Pontiac',
    'porsche': 'Porsche',
    'ram': 'Ram',
    'renault': 'Renault',
    'rimac': 'Rimac',
    'rivian': 'Rivian',
    'rolls-royce': 'RollsRoyce',
    'saab': 'Saab',
    'saleen': 'Saleen',
    'saturn': 'Saturn',
    'scion': 'Scion',
    'seat': 'Seat',
    'skoda': 'Skoda',
    'spyker': 'Spyker',
    'ssangyong': 'Ssangyong',
    'subaru': 'Subaru',
    'suzuki': 'Suzuki',
    'tesla': 'Tesla',
    'toyota': 'Toyota',
    'volkswagen': 'Volkswagen',
    'volvo': 'Volvo',
    'zagato': 'Zagato',
};

// Create a cache for the logo components
const logoCache = new Map<string, ComponentType<SVGProps<SVGSVGElement>>>();

const CarLogo: FC<CarLogoProps> = ({ make, ...props }) => {
    const logoName = makeToLogoName[make.toLowerCase()];

    if (!logoName) {
        // Return a default icon if no logo is found
        return <Car {...props} />;
    }

    let LogoComponent = logoCache.get(logoName);

    if (!LogoComponent) {
        LogoComponent = dynamic(() =>
            import(`@/components/icons/logos/${logoName}`),
            {
                loading: () => <Car {...props} />, // Fallback while loading
                ssr: true, // Render on server
            }
        );
        logoCache.set(logoName, LogoComponent);
    }

    return <LogoComponent {...props} />;
};

export default memo(CarLogo);
