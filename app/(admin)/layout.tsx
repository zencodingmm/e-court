import React from 'react';
import { Metadata } from 'next';
import AdminLayout from '../../layout/admin/AdminLayout';

interface AppLayoutProps {
    children: React.ReactNode;
}

export const metadata: Metadata = {
    title: 'e-court',
    robots: { index: false, follow: false },
    viewport: { initialScale: 1, width: 'device-width' },
    icons: {
        icon: '/favicon.ico'
    }
};

export default function AppLayout({ children }: AppLayoutProps) {
    return <AdminLayout>{children}</AdminLayout>;
}
