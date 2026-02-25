export interface Showroom {
    name: string;
    address: string;
    phone: string;
    mapUrl: string;
}

export interface ClientConfig {
    id: string;
    name: string;
    shortName: string;
    logo: string;
    tagline: string;
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        text: string;
        charcoal: string;
        sand: string;
        yellow: string;
    };
    marketing: {
        title: string;
        description: string;
        hotSummerSaleLabel: string;
        valueProps: string[];
    };
    social: {
        facebook: string;
        instagram: string;
        tiktok: string;
        whatsapp: string;
    };
    showrooms: Showroom[];
    features: {
        spatialEnabled: boolean;
        viewer3DEnabled: boolean;
        financingEnabled: boolean;
        showroomMode: boolean;
    };
}

// Default LS Lifestyle Configuration fallback
export const lsLifestyleConfig: ClientConfig = {
    id: 'ls-lifestyle',
    name: 'LS Lifestyle Furniture & Appliances',
    shortName: 'LS Lifestyle',
    logo: '/logo.png',
    tagline: 'Lifestyle. Affordability. Innovation.',
    colors: {
        primary: '#1D2A2A', // brand-charcoal
        secondary: '#A6C065', // brand-green
        accent: '#E51E25', // brand-red
        background: '#FAFAFA',
        text: '#343F48',
        charcoal: '#343F48',
        sand: '#EAE2D5',
        yellow: '#FED700',
    },
    marketing: {
        title: "LS Lifestyle | 3D & AR Furniture Catalogue",
        description: "Experience luxury furniture in your space with LS Lifestyle's interactive 3D and AR catalogue. Botswana's premier AR furniture destination.",
        hotSummerSaleLabel: "HOT SUMMER SALE 2026",
        valueProps: [
            "Premium comfort",
            "Contemporary design",
            "Cutting-edge 3D & spatial technology",
            "Affordable pricing you can trust"
        ]
    },
    social: {
        facebook: "https://facebook.com",
        instagram: "https://instagram.com",
        tiktok: "https://tiktok.com",
        whatsapp: "https://wa.me/26776233227",
    },
    showrooms: [
        {
            name: "Lifestyle Mogoditshane",
            address: "Opposite Super Save Mall, Mogoditshane, Gaborone",
            phone: "+267 396 0067",
            mapUrl: "https://www.google.com/maps/search/?api=1&query=Lifestyle+Furniture+Mogoditshane+Gaborone"
        },
        {
            name: "Lifestyle Tlokweng",
            address: "Old Mall, Tlokweng, Gaborone",
            phone: "+267 396 0251",
            mapUrl: "https://www.google.com/maps/search/?api=1&query=Lifestyle+Furniture+Tlokweng+Gaborone"
        },
        {
            name: "Lifestyle Broadhurst",
            address: "Behind FNB, Plot 5682, Legolo Road, Broadhurst, Gaborone",
            phone: "+267 318 2011",
            mapUrl: "https://www.google.com/maps/search/?api=1&query=Lifestyle+Furniture+Broadhurst+Gaborone"
        }
    ],
    features: {
        spatialEnabled: true,
        viewer3DEnabled: true,
        financingEnabled: false,
        showroomMode: false,
    }
};

export function getClientConfig(): ClientConfig {
    const clientId = process.env.NEXT_PUBLIC_CLIENT_ID || 'ls-lifestyle';

    if (clientId === 'ls-lifestyle') {
        return lsLifestyleConfig;
    }

    return lsLifestyleConfig;
}
