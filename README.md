# LS Lifestyle Web Catalog

A premium, 3D/AR-enabled furniture catalog built with Next.js and Tailwind CSS.

## Features

- **3D & AR Viewer**: View products in 3D and place them in your room using Augmented Reality.
- **Smart Filtering**: Filter by category and search products instantly.
- **Responsive Design**: "Luxe Summer" theme optimized for mobile and desktop.
- **Performance**: Lazy loading for 3D models and optimized asset delivery.

## Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```

3.  **Build for Production**:
    ```bash
    npm run build
    npm start
    ```

## Adding New Products

1.  **Add 3D Model**:
    Drop the `.glb` file into `public/assets/models/`. The filename must match the SKU (e.g., `SKU123.glb`).

2.  **Update CSV**:
    Open `public/furniture_catalogue.csv` and add a new row with the product details:
    - **Category**: One of the 9 categories (Sofas, Chairs, etc.)
    - **SKU**: Must match the GLB filename.
    - **Product Name**: Display name.
    - **WAS/NOW/SAVE**: Pricing.

3.  **Rebuild**:
    If running in production, rebuild the app to pick up new static assets (though CSV parsing is runtime, static assets might be cached).

## Project Structure

- `app/`: Next.js App Router pages and layouts.
- `components/`: Reusable UI components (`ModelViewer`, `ProductCard`, `SmartGrid`).
- `lib/`: Utility functions and data fetching (`products.ts`).
- `public/assets/models/`: 3D model files.
- `public/draco/`: Draco decoder files for compressed models.
