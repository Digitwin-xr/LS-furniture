export interface ProductVariant {
    name: string;
    color: string; // Hex code
    image?: string; // Optional variant-specific image path
    modelPath?: string; // Optional variant-specific 3D model path
}

export const VARIANT_MAPPING: Record<string, ProductVariant[]> = {
    // Chair Category
    "Shell Chair Beach Legs": [
        { name: "White", color: "#FFFFFF" },
        { name: "Red", color: "#C41E29" },
    ],
    "Bar Chair Minimalist": [
        { name: "Red", color: "#C41E29" },
        { name: "Black", color: "#1D1D1D" },
    ],
    "MWOC16A Accent Chair": [
        { name: "Black+Grey", color: "#4A4A4A" }, // Approximate mixture
        { name: "Orange", color: "#FF8C00" },
    ],
    "MWOC18A Multipurpose Velvet Chair": [
        { name: "Dark Green", color: "#006400" },
        { name: "Blue", color: "#0000FF" },
        { name: "Grey Velvet", color: "#808080" },
    ],
    "MWOC14A Occasional Chair": [
        { name: "Orange", color: "#FF8C00" },
        { name: "Teal", color: "#008080" },
        { name: "Grey", color: "#808080" },
    ],
    "MWBCG03B Bar Chair Velvet": [
        { name: "Black", color: "#1D1D1D" },
        { name: "Green", color: "#228B22" },
        { name: "Grey", color: "#808080" },
    ],
    "MWBCG02A Mustard Bar Chair": [
        { name: "Mustard", color: "#E1AD01" },
        { name: "Black", color: "#1D1D1D" },
    ],
    "MWOC10C Occasional Chair": [
        { name: "Dark Turquoise", color: "#00CED1" },
        { name: "Grey Velvet", color: "#808080" },
    ],
    // General Furniture Category
    "MW814A/B Tabi Coffee Table": [
        { name: "Brown", color: "#8B4513" },
        { name: "Black", color: "#1D1D1D" },
    ],
    "17030 Blanket Box May Small": [
        { name: "Color 1", color: "#EAE2D5" },
        { name: "Color 2", color: "#343F48" },
    ],
    "18682 Pedestal Classic B Grey": [
        { name: "Grey", color: "#808080" },
        { name: "Charcoal", color: "#343F48" },
    ],
    "MW766MC 3-Door Wardrobe with Mirror": [
        { name: "Standard 1", color: "#D2B48C" },
        { name: "Standard 2", color: "#8B4513" },
        { name: "Standard 3", color: "#1D1D1D" },
    ],
};

export function getProductVariants(productName: string, sku: string): ProductVariant[] {
    // Match by name first, then potentially by SKU prefix
    let variants: ProductVariant[] = [];
    if (VARIANT_MAPPING[productName]) {
        variants = VARIANT_MAPPING[productName];
    } else {
        // Fallback search by SKU
        const match = Object.keys(VARIANT_MAPPING).find(key =>
            productName.includes(key) || sku.startsWith(key.split(' ')[0])
        );
        variants = match ? VARIANT_MAPPING[match] : [];
    }

    if (variants.length > 0) {
        // Prepend "Original" as the default option
        return [
            { name: "Original", color: "#FFFFFF" }, // Standard white/neutral for "Original"
            ...variants
        ];
    }

    return [];
}
