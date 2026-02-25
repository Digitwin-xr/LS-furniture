'use client';

import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { ClientConfig, getClientConfig } from '@/engine/config/client-config';

interface ClientContextType {
    config: ClientConfig;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export function useClient() {
    const context = useContext(ClientContext);
    if (!context) {
        throw new Error('useClient must be used within a ClientProvider');
    }
    return context.config;
}

interface ClientProviderProps {
    children: ReactNode;
    initialConfig?: ClientConfig;
}

export function ClientProvider({ children, initialConfig }: ClientProviderProps) {
    const config = initialConfig || getClientConfig();

    return (
        <ClientContext.Provider value={{ config }}>
            <ThemeInjector config={config} />
            {children}
        </ClientContext.Provider>
    );
}

function ThemeInjector({ config }: { config: ClientConfig }) {
    useEffect(() => {
        const root = document.documentElement;

        // Inject brand colors as CSS variables
        root.style.setProperty('--brand-primary', config.colors.primary);
        root.style.setProperty('--brand-secondary', config.colors.secondary);
        root.style.setProperty('--brand-accent', config.colors.accent);
        root.style.setProperty('--brand-background', config.colors.background);
        root.style.setProperty('--brand-text', config.colors.text);
        root.style.setProperty('--brand-charcoal', config.colors.charcoal);
        root.style.setProperty('--brand-sand', config.colors.sand);
        root.style.setProperty('--brand-yellow', config.colors.yellow);

    }, [config]);

    return null;
}
