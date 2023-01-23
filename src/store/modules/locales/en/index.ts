import {ApiDay} from "@/api/services/enums/ApiDay";
import {LocaleRecord} from "@/store/modules/locales/types/LocaleRecord";
import {Locale} from "@/store/modules/locales/types/Locale";

export const en: LocaleRecord = {
    locale: Locale.En,
    copyright: "&copy; 2022 VC://VPI. All rights reserved.",
    editText: "Edit",
    saveText: "Save",
    cancelText: "Cancel",
    closeText: "Close",
    removeText: "Remove",
    restoreText: "Restore",
    orderText: "Order",
    fromText: "From",
    executorText: "Executor",
    roles: {
        ROOT: "Root",
        MODERATOR: "Moderator",
        ADMIN: "Admin",
        OPERATOR: "Operator",
        GUEST: "Guest",
    },
    daysOfWeek: {
        [ApiDay.Monday]: "Monday",
        [ApiDay.Tuesday]: "Tuesday",
        [ApiDay.Wednesday]: "Wednesday",
        [ApiDay.Thursday]: "Thursday",
        [ApiDay.Friday]: "Friday",
        [ApiDay.Saturday]: "Saturday",
        [ApiDay.Sunday]: "Sunday",
    },
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
            customerDescription: "Customers Description",
            actions: "Actions",
        },
        servicesTableRemoveButtonTitle: "Remove",
        servicesTableEditButtonTitle: "Edit",
        servicesTableRestoreButtonTitle: "Restore",
    },
    ordersPage: {
        title: "Orders",
        filter: {
            dates: {
                from: "From",
                to: "To",
            },
            userSelect: "Select User",
        },
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
            receiptButtonTitle: "Receipt",
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
        selectServicePlaceholder: "Select Service",
        selectServiceNotSelected: "You have to select service first",
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
        addServiceButtonTitle: "Create Service",
        addPreferenceButtonTitle: "Add Preference",
        createServiceModal: {
            exceptions: {
                emptyTitle: "Title should not be empty",
                zeroOrNegativePrice: "Price has to be at least 1₽",
            },
        },
        createRateModal: {
            exceptions: {
                emptyTitle: "Title should not be empty",
            },
        },
        mainMenu: {
            profile: "Profile",
            preferences: "Preferences",
            users: "Users",
            rates: "Rates",
            services: "Services",
        },
        contentTitles: {
            users: "Users",
            rates: "Employee Rates",
            services: "Services",
            preferences: "Preferences",
        },
        usersDeactivateOwnAccountTitle: "Trying to deactivate your own account. Copy activation link before.",
        createUserModal: {
            selectRolesPlaceholder: "Select Roles",
            selectRatePlaceholder: "Select Rate",
            exceptions: {
                emptyNameFields: "Name fields can't be empty",
                emptyUsername: "Username can't be empty",
                usernameWrongLength: "Username must be at least 8 characters length",
            },
        },
        usersTableHeaders: {
            id: "Id",
            lastName: "Last Name",
            firstName: "First Name",
            patronymic: "Patronymic",
            username: "Username",
            roles: "Roles",
            actions: "Actions",
            active: "Active",
            rate: "Rate",
            shifts: "Shifts Amount",
        },
        ratesTableHeaders: {
            id: "Id",
            title: "Title",
            rate: "Shifts Amount",
            actions: "Actions",
        },
        preferencesTableHeaders: {
            day: "Day",
            shift: "Shift Index",
            preference: "Preference",
            actions: "Actions",
        },
        usersTableButtonsTitles: {
            confirmLink: "Confirm Link",
            deactivate: "Deactivate",
        },
        removedServicesSwitch: {
            checked: "Removed",
            unchecked: "Current",
        },
        removedRatesSwitch: {
            checked: "Removed",
            unchecked: "Current",
        },
        preferenceSwitch: {
            checked: "Comfortable",
            unchecked: "Uncomfortable",
        },
    },
    localeTitles: {
        ru: "Russian",
        en: "English",
    },
}