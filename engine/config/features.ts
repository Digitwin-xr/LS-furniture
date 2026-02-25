import { getClientConfig } from './client-config';

export interface SpatialFeatures {
    enableSpatialPlacement: boolean;
    enable3DViewer: boolean;
    enableComparisonMode: boolean;
    enableFinancingOptions: boolean;
    enableShowroomMode: boolean;
}

export function getFeatureFlags(): SpatialFeatures {
    const config = getClientConfig();

    return {
        enableSpatialPlacement: config.features.spatialEnabled,
        enable3DViewer: config.features.viewer3DEnabled,
        enableComparisonMode: false, // Defaulting to false for v1
        enableFinancingOptions: config.features.financingEnabled,
        enableShowroomMode: config.features.showroomMode,
    };
}
