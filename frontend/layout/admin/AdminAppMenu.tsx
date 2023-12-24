import React from 'react';
import AppMenuitem from '../AppMenuitem';
import { MenuProvider } from '../context/menucontext';
import { AppMenuItem } from '../../types/types';

const AppMenu = () => {
    const model: AppMenuItem[] = [
        { label: 'Home', items: [{ label: 'Dashboard', to: '/admin', icon: 'pi pi-fw pi-home' }] },
        {
            label: 'တင်သွင်းလွှာ',
            items: [
                { label: 'တင်သွင်းလွှာ', to: '/admin/e-filling', icon: 'pi pi-fw pi-book' },
                { label: 'တင်သွင်းလွှာများ', to: '/admin/e-filling/report', icon: 'pi pi-fw pi-book' }
            ]
        }
    ];

    return (
        <MenuProvider>
            <ul className='layout-menu'>
                {model.map((item, i) => {
                    return !item?.seperator ? (
                        <AppMenuitem
                            item={item}
                            root={true}
                            index={i}
                            key={item.label}
                        />
                    ) : (
                        <li className='menu-separator'></li>
                    );
                })}
            </ul>
        </MenuProvider>
    );
};
export default AppMenu;
