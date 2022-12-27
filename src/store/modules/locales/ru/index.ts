import {LocaleRecord} from "@/store/modules/locales/types/LocaleRecord";

export const ru: LocaleRecord = {
    locale: "ru",
    copyright: "&copy; 2022 VC://VPI. Все права защищены.",
    saveText: "Сохранить",
    roles: {
        ROOT: "Администратор",
        MODERATOR: "Модератор",
        ADMIN: "Админ",
        OPERATOR: "Дежурный",
        GUEST: "Гость",
    },
    mainMenuItemTitles: {
        newOrder: {
            new: "Создать заказ",
            edit: "Новые заказы",
        },
        orders: "Заказы",
        locales: 'Язык интерфейса',
        account: "Аккаунт",
        logOut: "Выйти",
    },
    homePage: {
        priceListTitle: "Прайс-лист",
        priceListSearchTooltip: "Поиск по заголовку услуги, по вхождению строки (не чувствителен к регистру)",
        servicesTableHeaders: {
            id: "Id",
            title: "Название услуги",
            price: "Цена, ₽/штука",
            description: "Описание",
            actions: "Действия",
        },
        servicesTableRemoveButtonTitle: "Удалить",
        servicesTableEditButtonTitle: "Изменить",
    },
    ordersPage: {
        title: "Заказы",
        archivedSwitch: {
            checked: "Архивные",
            unchecked: "Текущие",
        },
        allOrdersSwitch: {
            checked: "Все",
            unchecked: "Мои",
        },
        modals: {
            archive: {
                title: "Подтверждение архивации заказа",
                content: "Вы действительно хотите поместить в архив заказ",
            },
            restore: {
                title: "Подтверждение восстановления заказа",
                content: "Вы действительно хотите восстановить заказ",
            },
            remove: {
                title: "Подтверждение удаления заказа",
                content: "Вы действительно хотите полностью удалить заказ",
            },
        },
        ordersTableHeaders: {
            id: "Id",
            totalPrice: "Стоимость, ₽",
            cash: "Получено, ₽",
            change: "Сдача, ₽",
            createdAt: "Создан",
            user: "Пользователь",
            removedIn: "Будет удалён",
            remainingDays: "Дней до удаления",
            actions: "Действия",
        },
        ordersTableActions: {
            archiveButtonTitle: "В архив",
            restoreButtonTitle: "Восстановить",
            removeButtonTitle: "Удалить",
        },
        ordersServicesTableHeaders: {
            id: "Id услуги",
            title: "Название услуги",
            amount: "Общее количество",
            price: "Цена, ₽/штука",
            totalPrice: "Итоговая стоимость, ₽",
        },
        newOrderButtonTitle: "Новый заказ",
    },
    newOrdersPage: {
        title: "Создать новый заказ",
        refreshServicesButtonTitle: "Обновить услуги",
        clearOrderButtonTitle: "Очистить заказ",
        clearOrderButtonConfirm: "Вы действительно хотите очистить этот заказ?",
        addServiceButtonTitle: "Добавить услугу",
        orderServicesTableHeaders: {
            services: "Услуга",
            price: "Цена, ₽/штука",
            totalPrice: "Стоимость, ₽",
            amount: "Количество",
            actions: "Действия",
        },
        orderServicesTableButtonsTitles: {
            remove: "Удалить",
            removeConfirm: "Удалить услугу?"
        },
        orderSummary: {
            title: "Итог заказа",
            servicesTitle: "Перечень услуг",
            cash: "Получено, ₽",
            services: {
                amount: "Количество",
                price: "Цена",
            },
            createOrderButtonTitle: "Создать заказ",
            createOrderModal: {
                servicesColumnTitle: "Услуга",
                priceColumnTitle: "Цена",
                totalPrice: "Итог",
                cash: "Получено",
                change: "Сдача",
                createOrderButtonTitle: "Создать заказ",
                cancelButtonTitle: "Отмена",
            },
        },
        newOrderTitle: "Новый заказ",
    },
    userProfilePage: {
        addUserButtonTitle: "Добавить пользователя",
        addRateButtonTitle: "Создать ставку",
        addServiceButtonTitle: "Создать услугу",
        mainMenu: {
            profile: "Профиль",
            users: "Пользователи",
            rates: "Ставки",
            services: "Услуги",
        },
        contentTitles: {
            users: "Список пользователей",
            rates: "Ставки сотрудников",
            services: "Услуги",
        },
        usersTableHeaders: {
            id: "Id",
            lastName: "Фамилия",
            firstName: "Имя",
            patronymic: "Отчество",
            username: "Логин",
            roles: "Роли",
            actions: "Действия",
            active: "Активен",
        },
        ratesTableHeaders: {
            title: "Название",
            rate: "Количество смен",
        },
        usersTableButtonsTitles: {
            confirmLink: "Ссылка активации",
            deactivate: "Деактивировать",
        },
    },
    localeTitles: {
        ru: "Русский",
        en: "Английский",
    }
}