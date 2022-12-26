import {LocaleRecord} from "@/store/modules/locales/types/LocaleRecord";

export const en: LocaleRecord = {
    locale: "en",
    copyright: "&copy; 2022 VC://VPI. All rights reserved.",
    mainMenuItemTitles: {
        newOrder: {
            new: "New Order",
            edit: "Edit New Orders",
        },
        orders: "Orders",
        locales: "Locale",
        account: "Account",
        logOut: "Log Out",
    },
    homePage: {
        priceListTitle: "Current Price List",
        priceListSearchTooltip: "Filter by substring included in service title (case insensitive)",
        servicesTableHeaders: {
            id: "Id",
            title: "Title",
            price: "Price, ₽/unit",
            description: "Description",
        },
    },
    ordersPage: {
        title: "Orders",
        archivedSwitch: {
            checked: "Archive",
            unchecked: "Current",
        },
        allOrdersSwitch: {
            checked: "All",
            unchecked: "Own",
        },
        modals: {
            archive: {
                title: "Archive order confirmation",
                content: "Do you want to archive order",
            },
            restore: {
                title: "Restore order confirmation",
                content: "Do you want to restore order",
            },
            remove: {
                title: "Remove order confirmation",
                content: "Do you want to completely remove order",
            },
        },
        ordersTableHeaders: {
            id: "Id",
            totalPrice: "Total Price, ₽",
            cash: "Cash, ₽",
            change: "Change, ₽",
            createdAt: "Created At",
            user: "User",
            removedIn: "Removed In",
            remainingDays: "Remaining days",
            actions: "Actions",
        },
        ordersTableActions: {
            archiveButtonTitle: "Archive",
            restoreButtonTitle: "Restore",
            removeButtonTitle: "Remove",
        },
        ordersServicesTableHeaders: {
            id: "Service Id",
            title: "Service Title",
            amount: "Total Amount",
            price: "Price, ₽/unit",
            totalPrice: "Total Price, ₽",
        },
        newOrderButtonTitle: "New Order",
    },
    newOrdersPage: {
        title: "Create New Orders",
        refreshServicesButtonTitle: "Refresh Services",
        clearOrderButtonTitle: "Clear Order",
        clearOrderButtonConfirm: "Sure to clear this order?",
        addServiceButtonTitle: "Add Service",
        orderServicesTableHeaders: {
            services: "Service",
            price: "Price, ₽/unit",
            totalPrice: "Total Price, ₽",
            amount: "Amount",
            actions: "Actions",
        },
        orderServicesTableButtonsTitles: {
            remove: "Remove",
            removeConfirm: "Sure to remove?"
        },
        orderSummary: {
            title: "Order Summary",
            servicesTitle: "Order Services",
            cash: "Cash, ₽",
            services: {
                amount: "Total Amount",
                price: "Price",
            },
            createOrderButtonTitle: "Create Order",
            createOrderModal: {
                servicesColumnTitle: "Service",
                priceColumnTitle: "Price",
                totalPrice: "Total Price",
                cash: "Cash",
                change: "Change",
                createOrderButtonTitle: "Create Order",
                cancelButtonTitle: "Cancel",
            },
        },
        newOrderTitle: "New Order",
    },
    userProfilePage: {
        addUserButtonTitle: "Register User",
        addRateButtonTitle: "Create Rate",
        mainMenu: {
            profile: "Profile",
            users: "Users",
            rates: "Rates",
        },
        contentTitles: {
            users: "Users",
            rates: "Employee Rates",
        },
        usersTableHeaders: {
            id: "Id",
            lastName: "Last Name",
            firstName: "First Name",
            patronymic: "Patronymic",
            username: "Username",
            actions: "Actions",
            active: "Active",
        },
        ratesTableHeaders: {
            title: "Title",
            rate: "Shifts Amount",
        },
        usersTableButtonsTitles: {
            confirmLink: "Confirm Link",
            deactivate: "Deactivate",
        },
    },
    localeTitles: {
        ru: "Russian",
        en: "English",
    }
}