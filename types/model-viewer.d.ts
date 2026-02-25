export { };

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                src?: string;
                poster?: string;
                alt?: string;
                ar?: boolean;
                'ar-modes'?: string;
                'ar-placement'?: string;
                'ar-scale'?: string;
                'camera-controls'?: boolean;
                'shadow-intensity'?: string;
                exposure?: string;
                'auto-rotate'?: boolean;
                loading?: string;
                'draco-decoder-path'?: string;
                reveal?: string;
                class?: string;
            };
        }
    }
}
