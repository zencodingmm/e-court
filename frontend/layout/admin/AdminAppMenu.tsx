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
                { label: 'တင်သွင်းလွှာ', to: '/admin/e-doc', icon: 'pi pi-fw pi-book' },
                { label: 'တင်သွင်းလွှာများ', to: '/admin/e-doc/report', icon: 'pi pi-fw pi-file' }
            ]
        },
        {
            label: 'အသုံးပြုသူများ',
            items: [
                { label: 'အသုံးပြုသူအမျိုးအစား', to: '/admin/users/user-type', icon: 'pi pi-fw pi-user' },
                { label: 'အသုံးပြုသူများထည့်သွင်းရန်', to: '/admin/users', icon: 'pi pi-fw pi-users' },
                { label: 'အသုံးပြုသူများစာရင်း', to: '/admin/users/report', icon: 'pi pi-fw pi-users' }
            ]
        },
        {
            label: 'E-Vote',
            items: [
                { label: 'မဲခွဲရန်အကြံပြုချက်တောင်းခံခြင်း', to: '/admin/e-vote', icon: 'pi pi-fw pi-envelope' },
                { label: 'အကြောင်းအရာထည့်သွင်းရန်', to: '/admin/e-vote', icon: 'pi pi-fw pi-envelope' },
                { label: 'မဲစာရင်း/အဖြေများ', to: '/admin/e-vote/report', icon: 'pi pi-fw pi-chart-bar' }
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
