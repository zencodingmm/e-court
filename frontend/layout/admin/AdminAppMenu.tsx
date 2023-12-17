import React from 'react';
import AppMenuitem from '../AppMenuitem';
import { MenuProvider } from '../context/menucontext';
import { AppMenuItem } from '../../types/types';

const AppMenu = () => {
    const model: AppMenuItem[] = [{ label: 'Home', items: [{ label: 'e-filling', to: '/admin/e-filling', icon: 'pi pi-fw pi-home' }] }];

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
