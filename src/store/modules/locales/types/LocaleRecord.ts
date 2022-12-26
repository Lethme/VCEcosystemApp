export interface LocaleRecord {
    locale: string;
    copyright: string;
    mainMenuItemTitles: {
        newOrder: {
            new: string;
            edit: string;
        };
        orders: string;
        locales: string;
        account: string;
        logOut: string;
    };
    homePage: {
        priceListTitle: string;
        priceListSearchTooltip: string;
        servicesTableHeaders: {
            id: string;
            title: string;
            price: string;
            description: string;
        };
    };
    ordersPage: {
        title: string;
        archivedSwitch: {
            checked: string;
            unchecked: string;
        };
        allOrdersSwitch: {
            checked: string;
            unchecked: string;
        };
        modals: {
            archive: {
                title: string;
                content: string;
            };
            restore: {
                title: string;
                content: string;
            };
            remove: {
                title: string;
                content: string;
            };
        };
        ordersTableHeaders: {
            id: string;
            totalPrice: string;
            cash: string;
            change: string;
            createdAt: string;
            user: string;
            removedIn: string;
            remainingDays: string;
            actions: string;
        };
        ordersTableActions: {
            archiveButtonTitle: string;
            restoreButtonTitle: string;
            removeButtonTitle: string;
        };
        ordersServicesTableHeaders: {
            id: string;
            title: string;
            amount: string;
            price: string;
            totalPrice: string;
        };
        newOrderButtonTitle: string;
    };
    newOrdersPage: {
        title: string;
        refreshServicesButtonTitle: string;
        clearOrderButtonTitle: string;
        clearOrderButtonConfirm: string;
        addServiceButtonTitle: string;
        orderServicesTableHeaders: {
            services: string;
            price: string;
            totalPrice: string;
            amount: string;
            actions: string;
        };
        orderServicesTableButtonsTitles: {
            remove: string;
            removeConfirm: string;
        };
        orderSummary: {
            title: string;
            servicesTitle: string;
            cash: string;
            services: {
                amount: string;
                price: string;
            };
            createOrderButtonTitle: string;
            createOrderModal: {
                servicesColumnTitle: string;
                priceColumnTitle: string;
                totalPrice: string;
                cash: string;
                change: string;
                createOrderButtonTitle: string;
                cancelButtonTitle: string;
            }
        };
        newOrderTitle: string;
    };
    userProfilePage: {
        addUserButtonTitle: string;
        addRateButtonTitle: string;
        mainMenu: {
            profile: string;
            users: string;
            rates: string;
        };
        contentTitles: {
            users: string;
            rates: string;
        };
        usersTableHeaders: {
            id: string;
            lastName: string;
            firstName: string;
            patronymic: string;
            username: string;
            actions: string;
            active: string;
        };
        ratesTableHeaders: {
            title: string;
            rate: string;
        };
        usersTableButtonsTitles: {
            confirmLink: string;
            deactivate: string;
        };
    };
    localeTitles: {
        ru: string;
        en: string;
    };
}