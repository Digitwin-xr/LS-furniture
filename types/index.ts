export interface Product {
    Category: string;
    SKU: string;
    "Product Name": string;
    WAS: string; // CSV numbers are strings
    NOW: string;
    SAVE: string;
    modelPath?: string | null;
    imagePath?: string | null;
    hasModel?: boolean;
    hasImage?: boolean;
    description?: string;
    fileSizeMB?: number | null;
    glbFile?: string | null;
}

export type Category =
    | "All"
    | "Electronics"
    | "Sofas"
    | "Chairs"
    | "Wardrobes"
    | "Beds"
    | "Kitchen"
    | "TV Units"
    | "Dining"
    | "Storage"
    | "Tables"
    | "Miscellaneous"
    | "Featured";
