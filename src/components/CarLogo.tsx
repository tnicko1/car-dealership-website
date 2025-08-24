'use client';

import * as Logos from '@cardog-icons/react';
import { Car } from 'lucide-react';

// A mapping from car make (lowercase) to the corresponding logo component name in @cardog-icons/react
const makeToLogoName: { [key: string]: keyof typeof Logos } = {
    'acura': 'AcuraIcon',
    'alfa romeo': 'AlfaRomeoIcon',
    'aston martin': 'AstonMartinLogo',
    'audi': 'AudiIcon',
    'bentley': 'BentleyIcon',
    'bmw': 'BMWLogoHorizontal',
    'cadillac': 'CadillacIcon',
    'chevrolet': 'ChevroletIcon',
    'chrysler': 'ChryslerIcon',
    'dodge': 'DodgeLogo',
    'ferrari': 'FerrariLogo',
    'fiat': 'FiatLogo',
    'ford': 'FordLogo',
    'genesis': 'GenesisIcon',
    'gmc': 'GMCLogo',
    'honda': 'HondaIcon',
    'hyundai': 'HyundaiIcon',
    'infiniti': 'InfinitiIcon',
    'jaguar': 'JaguarIcon',
    'jeep': 'JeepLogo',
    'kia': 'KiaLogo',
    'lamborghini': 'LamborghiniLogo',
    'land rover': 'LandroverIcon',
    'lexus': 'LexusIcon',
    'lincoln': 'LincolnIcon',
    'lotus': 'LotusLogo',
    'maserati': 'MaseratiIcon',
    'mazda': 'MazdaIcon',
    'mclaren': 'MclarenLogoHorizontal',
    'mini': 'MiniLogo',
    'mitsubishi': 'MitsubishiIcon',
    'nissan': 'NissanLogo',
    'polestar': 'PolestarIcon',
    'porsche': 'PorscheIcon',
    'ram': 'RAMIcon',
    'rolls-royce': 'RollsRoyceLogo',
    'subaru': 'SubaruIcon',
    'tesla': 'TeslaIcon',
    'toyota': 'ToyotaIcon',
    'volkswagen': 'VolkswagenIcon',
    'volvo': 'VolvoLogo',
};

const CarLogo = ({ make, ...props }: { make: string } & React.SVGProps<SVGSVGElement>) => {
    const logoName = makeToLogoName[make.toLowerCase()];
    const LogoComponent = logoName ? Logos[logoName] as React.ElementType : null;

    if (LogoComponent) {
        // @ts-ignore
        return <LogoComponent {...props} />;
    }

    // Return a default icon if no logo is found
    return <Car {...props} />;
};

export default CarLogo;
