import {ApiDay} from "@/api/services/enums/ApiDay";
import {Locale} from "@/store/modules/locales/types/Locale";

export interface LocaleRecord {
    locale: Locale;
    copyright: string;
    editText: string;
    saveText: string;
    closeText: string;
    cancelText: string;
    removeText: string;
    restoreText: string;
    orderText: string;
    fromText: string;
    clearText: string;
    markAllAsReadText: string;
    removeAllNotificationsText: string;
    noNotificationsText: string;
    notificationsTitleText: string;
    executorText: string;
    telegramText: string;
    telegramLinkText: string;
    linkText: string;
    followLinkText: string;
    accountText: string;
    linkTelegramText: string;
    unlinkTelegramText: string;
    acceptText: string;
    rejectText: string;
    showText: string;
    hideText: string;
    allUsersText: string;
    rolesText: string;
    roles: {
      ROOT: string;
      MODERATOR: string;
      OPERATOR: string;
      ADMIN: string;
      GUEST: string;
    };
    daysOfWeek: {
      [ApiDay.Monday]: string;
      [ApiDay.Tuesday]: string;
      [ApiDay.Wednesday]: string;
      [ApiDay.Thursday]: string;
      [ApiDay.Friday]: string;
      [ApiDay.Saturday]: string;
      [ApiDay.Sunday]: string;
    };
    mainMenuItemTitles: {
        newOrder: {
            new: string;
            edit: string;
        };
        schedule: string;
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
            customerDescription: string;
            actions: string;
        };
        servicesTableRemoveButtonTitle: string;
        servicesTableEditButtonTitle: string;
        servicesTableRestoreButtonTitle: string;
    };
    schedulePage: {
        nextMonth: string;
        prevMonth: string;
        shiftsExchangeTitle: string;
        scheduleTableHeaders: {
            date: string;
            day: string;
            firstShift: string;
            secondShift: string;
        };
        exchangeRequestsTableHeaders: {
            suggestedShift: string;
            desiredShift: string;
            sender: string;
            actions: string;
        };
    },
    ordersPage: {
        title: string;
        filter: {
            dates: {
                from: string;
                to: string;
            };
            userSelect: string;
        };
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
            receiptButtonTitle: string;
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
        selectServicePlaceholder: string;
        selectServiceNotSelected: string;
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
        addServiceButtonTitle: string;
        addPreferenceButtonTitle: string;
        createServiceModal: {
            exceptions: {
                emptyTitle: string;
                zeroOrNegativePrice: string;
            };
        };
        createRateModal: {
            exceptions: {
                emptyTitle: string;
            };
        };
        mainMenu: {
            profile: string;
            preferences: string;
            users: string;
            rates: string;
            services: string;
        };
        contentTitles: {
            users: string;
            rates: string;
            services: string;
            preferences: string;
        };
        usersTableHeaders: {
            id: string;
            avatar: string;
            fio: string;
            lastName: string;
            firstName: string;
            patronymic: string;
            username: string;
            roles: string;
            actions: string;
            active: string;
            rate: string;
            shifts: string;
        };
        ratesTableHeaders: {
            id: string;
            title: string;
            rate: string;
            actions: string;
        };
        preferencesTableHeaders: {
            day: string;
            shift: string;
            preference: string;
            actions: string;
        },
        usersDeactivateOwnAccountTitle: string;
        createUserModal: {
            selectRolesPlaceholder: string;
            selectRatePlaceholder: string;
            exceptions: {
                emptyNameFields: string;
                emptyUsername: string;
                usernameWrongLength: string;
            };
        };
        usersTableButtonsTitles: {
            confirmLink: string;
            deactivate: string;
        };
        removedServicesSwitch: {
            checked: string;
            unchecked: string;
        };
        removedRatesSwitch: {
            checked: string;
            unchecked: string;
        };
        preferenceSwitch: {
            checked: string;
            unchecked: string;
        },
    };
    localeTitles: {
        ru: string;
        en: string;
    };
    exceptions: {
        preferences: {
            409: string;
        };
    };
}