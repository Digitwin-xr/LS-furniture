'use server';

import fs from 'fs';
import path from 'path';
import { Product } from '@/types';

export async function getProducts(): Promise<Product[]> {
    const jsonPath = path.join(process.cwd(), 'public', 'products.json');

    try {
        if (!fs.existsSync(jsonPath)) {
            console.error('products.json not found.');
            return [];
        }

        const fileContent = fs.readFileSync(jsonPath, 'utf8');
        const rawProducts = JSON.parse(fileContent);

        // SAFE Normalization: Preserve ALL original fields (like Category)
        return rawProducts.map((p: any) => {
            const name = (p["Product Name"] || "").toLowerCase();
            const desc = (p.Description || "").toLowerCase();
            const rawCat = (p.Category || "").toLowerCase();

            // ═══ SPECIFIC PRODUCT OVERRIDES (highest priority) ═══
            let assignedCat = "SOFAS";
            const upperName = (p["Product Name"] || "").toUpperCase().trim();

            // Named overrides
            const kitchenOverrides = ["BARCELONA MICROWAVE STAND BAT", "MICROWAVE STAND"];
            const wardrobeOverrides = [
                "TEXAS ROBE 2 DOOR",
                "MW3MK 2 DOOR ROBE ZEBRA TIGER SPOT",
                "ROBE NEW (PEAR) OLD GRE",
                "3 DOOR METAL WHITE FE",
                "ROBE 3DOOR METAL + MIRROR WHIT"
            ];
            const diningOverrides = [
                "DINNING ROOM SUIT CREED 6 CHAI",
                "DINNING SET GLASS BLACK 1+6",
                "DINNING SET 1+4 BLACK METAL + L",
                "DINNING TABLE SLEEK MARBLE SET"
            ];
            const bedOverrides = [
                "GOOD SLEEP DOUBLE (2 STAR) 137",
                "BETTER LUX SINGLE (10 STAR) BE",
                "BETTER LUX QUEEN (10 STAR) 152",
                "SPINE O PEDIC QUEEN (15 STAR)",
                "SPINE O PEDIC DOUBLE (15 STAR)",
                "SEVILE BEDROOM SUET 2PC",
                "HAZEL BEDROOM SUITE 2PC OAK BA",
                "BUDGET DOUBLE (1 STAR) 1370 MY",
                "BAMBOO DOUBLE (3 STAR) 1370 RE",
                "BAMBOO SINGLE (3 STAR) 910 RES",
                "BETTER LUX DOUBLE (10 STAR) 13",
                "VENICE BEDROOM SUITE SONOMA OA",
                "AF PINEY DOUBLE BUNK",
                "WOODEN STEEL DOUBLE BUNK",
                "NIGHT STAND GREY ASH + COOL GR",
                "TEXAS CHEST OF DRAWER + MIRROR"
            ];
            const sofaOverrides = [
                "3 SEATER SOFA BED BLUE V+ BURGY",
                "SOFABED 3 SEATER WITH SPLIT",
                "SOFA BED",
            ];
            const storageOverrides = [
                "BLANKET BOX", "BLANKET CHEST",
                "CHEST OF DRAWERS", "CHEST OF DRAWER",
                "TALLBOY", "BEDSIDE CHEST",
                "3 DOOR BASE WHITE + DARK OAK",
                "5 DRAWER CHEST COFFEE/CAPPUCIN",
                "4 DRAWER CHEST WHITE",
                "CHEST OF 5 DRAWERS + 1 DOOR",
                "2 DOOR BASE BISCUIT MPORT",
                "3DOOR BASE BISCUIT (PEAR)",
                "CHEST OF DRAWS SONAMA OAK MPOR",
                "LINDA BASE 2DOOR BAF"
            ];
            const tvUnitOverrides = [
                "TV CABINET UK OAK + BLACK",
                "PLASMA RACK 3 LAYERS",
                "SIDE STAND WALNUT"
            ];
            const electronicsOverrides = [
                "TAURUS AIR FRYER DIGITAL 3.6L"
            ];

            const isKitchenOverride = kitchenOverrides.some(o => upperName.includes(o));
            const isWardrobeOverride = wardrobeOverrides.some(o => upperName.includes(o));
            const isDiningOverride = diningOverrides.some(o => upperName.includes(o));
            const isBedOverride = bedOverrides.some(o => upperName.includes(o));
            const isSofaOverride = sofaOverrides.some(o => upperName.includes(o));
            const isStorageOverride = storageOverrides.some(o => upperName.includes(o));
            const isTVOverride = tvUnitOverrides.some(o => upperName.includes(o));
            const isElectronicsOverride = electronicsOverrides.some(o => upperName.includes(o));

            if (isKitchenOverride) {
                assignedCat = "KITCHEN";
            } else if (isWardrobeOverride) {
                assignedCat = "WARDROBES";
            } else if (isDiningOverride) {
                assignedCat = "DINING";
            } else if (isBedOverride) {
                assignedCat = "BEDS";
            } else if (isTVOverride) {
                assignedCat = "TV UNITS";
            } else if (isElectronicsOverride) {
                assignedCat = "ELECTRONICS";
            } else if (isSofaOverride) {
                assignedCat = "SOFAS";
            } else if (isStorageOverride) {
                assignedCat = "STORAGE";

                // ── Electronics FIRST — catches freezers/appliances before wardrobe/storage
            } else if (
                name.includes("fridge") || name.includes("freezer") ||
                // only actual microwave appliance, not microwave stand
                (name.includes("microwave") && !name.includes("stand")) ||
                name.includes("oven") || name.includes("stove") || name.includes("cooker") ||
                name.includes("washing machine") || name.includes("washer") ||
                name.includes("dryer") || name.includes("dishwasher") ||
                name.includes("air con") || name.includes("aircon") ||
                name.includes("speaker") || name.includes("sound bar") ||
                name.includes("television") || name.includes("tv set") ||
                name.includes("hisense") || name.includes("samsung") ||
                name.includes("defy") || name.includes("russell hobbs") ||
                name.includes("sinotech") ||
                rawCat.includes("appliance") || rawCat.includes("electronic") ||
                rawCat.includes("fridge") || rawCat.includes("freezer")
            ) {
                assignedCat = "ELECTRONICS";

                // ── Beds (before wardrobes) — explicit bed terms only; NOT sofabeds (those are sofas)
            } else if (
                name.includes("bed frame") || name.includes("headboard") ||
                name.includes("mattress") || name.includes("nightstand") ||
                name.includes("pedestal") || name.includes("sleeper bed") ||
                rawCat.includes("bed") ||
                // standalone "bed" but NOT sofa bed / day bed
                (/\bbed\b/.test(name) && !name.includes("sofa bed") && !name.includes("sofabed") && !name.includes("day bed") && !name.includes("daybed"))
            ) {
                assignedCat = "BEDS";

                // ── Sofas — includes sofa beds, day beds, couches, lounges
            } else if (
                name.includes("sofa") || name.includes("couch") ||
                name.includes("day bed") || name.includes("daybed") ||
                name.includes("sofa bed") || name.includes("sofabed") ||
                name.includes("lounge suite") || name.includes("sectional") ||
                rawCat.includes("sofa") || rawCat.includes("lounge")
            ) {
                assignedCat = "SOFAS";

                // ── Chairs
            } else if (
                name.includes("chair") || name.includes("stool") ||
                name.includes("armchair") || name.includes("recliner") ||
                name.includes("ottoman") ||
                rawCat.includes("chair")
            ) {
                assignedCat = "CHAIRS";

                // ── TV Units
            } else if (
                name.includes("tv unit") || name.includes("tv stand") ||
                name.includes("entertainment unit") || name.includes("plasma stand") ||
                name.includes("media unit") ||
                rawCat.includes("tv unit") || rawCat.includes("entertainment")
            ) {
                assignedCat = "TV UNITS";

                // ── Wardrobes (explicit wardrobe terms only — no 'chest')
            } else if (
                name.includes("wardrobe") || name.includes("closet") ||
                name.includes("compactum") || name.includes("linen tower") ||
                name.includes("dressing table") ||
                rawCat.includes("wardrobe") || rawCat.includes("bedroom storage")
            ) {
                assignedCat = "WARDROBES";

                // ── Storage (shelves, drawers, boxes — NOT wardrobes or kitchen)
            } else if (
                name.includes("shelf") || name.includes("shelving") ||
                name.includes("shelves") || name.includes("bookcase") ||
                name.includes("bookshelf") || name.includes("display cabinet") ||
                name.includes("display unit") || name.includes("buffet") ||
                name.includes("sideboard") || name.includes("chest of drawer") ||
                name.includes("blanket box") || name.includes("blanket chest") ||
                name.includes("storage unit") || name.includes("storage box") ||
                name.includes("storage cabinet") || name.includes("tallboy") ||
                name.includes("rack") || name.includes("hall unit") ||
                rawCat.includes("storage") || rawCat.includes("shelf")
            ) {
                assignedCat = "STORAGE";

                // ── Kitchen storage/units (not appliances)
            } else if (
                name.includes("kitchen") || name.includes("pantry") ||
                name.includes("cupboard") || name.includes("kitchen unit") ||
                name.includes("microwave stand") ||
                rawCat.includes("kitchen")
            ) {
                assignedCat = "KITCHEN";

                // ── Dining — ONLY complete dining sets / dining tables
            } else if (
                name.includes("dining set") || name.includes("dining suite") ||
                name.includes("dining table") || name.includes("dinette") ||
                name.includes("dining room") ||
                rawCat.includes("dining set") || rawCat.includes("dining suite")
            ) {
                assignedCat = "DINING";

                // ── Tables & Desks (non-dining tables, desks, office furniture)
            } else if (
                name.includes("desk") || name.includes("office table") ||
                name.includes("computer table") || name.includes("study table") ||
                name.includes("workstation") ||
                name.includes("coffee table") || name.includes("side table") ||
                name.includes("end table") || name.includes("hall table") ||
                name.includes("lamp table") || name.includes("nest of table") ||
                name.includes("console") ||
                rawCat.includes("desk") || rawCat.includes("table")
            ) {
                assignedCat = "TABLES & DESKS";

                // ── Fallback via description
            } else {
                if (desc.includes("fridge") || desc.includes("freezer") || desc.includes("appliance")) assignedCat = "ELECTRONICS";
                else if (desc.includes("sofa") || desc.includes("couch") || desc.includes("sofa bed")) assignedCat = "SOFAS";
                else if (desc.includes("chair") || desc.includes("seating")) assignedCat = "CHAIRS";
                else if (desc.includes("dining set") || desc.includes("dining suite")) assignedCat = "DINING";
                else if (desc.includes("bed") && !desc.includes("sofa bed") && !desc.includes("day bed")) assignedCat = "BEDS";
                else if (desc.includes("wardrobe") || desc.includes("closet")) assignedCat = "WARDROBES";
                else if (desc.includes("shelf") || desc.includes("storage") || desc.includes("chest of drawer")) assignedCat = "STORAGE";
                else if (desc.includes("kitchen")) assignedCat = "KITCHEN";
                else if (desc.includes("tv") || desc.includes("media unit")) assignedCat = "TV UNITS";
                else if (desc.includes("table") || desc.includes("desk")) assignedCat = "TABLES & DESKS";
                else assignedCat = "SOFAS"; // Last resort
            }

            let nowPriceStr = p.NOW || p["NOW ONLY Price"] || "";
            if (!nowPriceStr || nowPriceStr === "Ask for Price" || nowPriceStr.trim() === "" || nowPriceStr === "0") {
                nowPriceStr = "4,999";
            }
            let wasPriceStr = p.WAS || p["WAS Price"] || "";
            if (!wasPriceStr || wasPriceStr === "Ask for Price" || wasPriceStr.trim() === "" || wasPriceStr === "0") {
                const nowVal = parseInt(nowPriceStr.replace(/[^0-9]/g, '')) || 4999;
                wasPriceStr = (nowVal + 1000).toLocaleString();
            }

            const normalized = {
                ...p, // PRESERVE ALL ORIGINAL DATA
                Category: assignedCat,
                WAS: wasPriceStr,
                NOW: nowPriceStr,
                SAVE: p.SAVE || p["SAVE Price"] || null,
                SKU: p.SKU?.toString() || "Unknown",
                // Ensure modelPath and imagePath are clean
                modelPath: p.modelPath || null,
                imagePath: p.imagePath || null,
                hasModel: !!p.modelPath,
                hasImage: !!p.imagePath
            };
            return normalized;
        });
    } catch (error) {
        console.error('Error reading products.json:', error);
        return [];
    }
}
