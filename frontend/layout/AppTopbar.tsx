/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import Image from 'next/image';

import { classNames } from 'primereact/utils';
import React, { forwardRef, useContext, useImperativeHandle, useRef } from 'react';
import { AppTopbarRef } from '../types/types';
import { LayoutContext } from './context/layoutcontext';
import { signOut } from 'next-auth/react';

const AppTopbar = forwardRef<AppTopbarRef>((_, ref) => {
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    return (
        <div className='layout-topbar'>
            <Link
                href='/'
                className='layout-topbar-logo'
            >
                <img
                    src={`/assets/images/logo.png`}
                    width={'35px'}
                    height={'35px'}
                    alt='logo'
                />
                <span>E-Court</span>
            </Link>

            <button
                ref={menubuttonRef}
                type='button'
                className='p-link layout-menu-button layout-topbar-button'
                onClick={onMenuToggle}
            >
                <i className='pi pi-bars' />
            </button>

            <button
                ref={topbarmenubuttonRef}
                type='button'
                className='p-link layout-topbar-menu-button layout-topbar-button'
                onClick={showProfileSidebar}
            >
                <i className='pi pi-ellipsis-v' />
            </button>

            <div
                ref={topbarmenuRef}
                className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}
            >
                <Link
                    href='/chat'
                    className='p-link layout-topbar-button'
                >
                    <i className='pi pi-comments'></i>
                    <span>Chat</span>
                </Link>
                <button
                    type='button'
                    className='p-link layout-topbar-button'
                    onClick={() => signOut()}
                >
                    <i className='pi pi-sign-out'></i>
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
