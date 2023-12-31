'use client';

import React from 'react';

import { SessionProvider } from 'next-auth/react';

import { LayoutProvider } from '../layout/context/layoutcontext';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';

interface RootLayoutProps {
    children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang='en'>
            <head>
                <link
                    id='theme-css'
                    href={`/themes/lara-light-indigo/theme.css`}
                    rel='stylesheet'
                ></link>
            </head>
            <body suppressHydrationWarning={true}>
                <SessionProvider refetchOnWindowFocus={false}>
                    <PrimeReactProvider>
                        <LayoutProvider>{children}</LayoutProvider>
                    </PrimeReactProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
