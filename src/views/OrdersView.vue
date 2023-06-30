<template>
    <a-layout class="layout flex-grow-1 py-sm-4 orders">
        <div class="container-fluid py-sm-4">
            <a-layout class="flex-grow-1 py-4">
                <a-layout-content>
                    <div
                        class="table-header-wrapper d-flex flex-column flex-xl-row gap-3 gap-xl-2 justify-content-between pb-4 pb-md-2">
                        <h4 class="text-start d-flex align-items-center m-0 gap-3">
                            <span>{{ $locale.ordersPage.title }}</span>
                            <sync-outlined class="refresh-btn" @click="() => { refreshOrders(); updateUsers(); }"/>
                            <a-switch :checked-children="$locale.ordersPage.archivedSwitch.checked"
                                      :un-checked-children="$locale.ordersPage.archivedSwitch.unchecked"
                                      v-model:checked="showArchivedOrders" @change="refreshOrders"/>
                            <a-switch v-if="$rootAccess" :checked-children="$locale.ordersPage.allOrdersSwitch.checked"
                                      :un-checked-children="$locale.ordersPage.allOrdersSwitch.unchecked"
                                      v-model:checked="showAllOrders" @change="refreshOrders"/>
                        </h4>
                        <div class="btn-wrapper d-flex flex-column flex-xl-row gap-2">
                            <a-select
                                style="min-width: 300px;"
                                class="text-start"
                                mode="multiple"
                                v-if="$rootAccess && showAllOrders"
                                size="large"
                                allow-clear
                                show-search
                                :filter-option="filterUsers"
                                v-model:value="selectUsersState"
                                :placeholder="$locale.ordersPage.filter.userSelect"
                                :options="selectUsersOptions"
                            />
                            <a-date-picker
                                v-model:value="filterStateDateFrom"
                                :locale="$locale.locale === Locale.Ru ? datePickerRu : datePickerEn"
                                :format="$locale.locale === Locale.Ru ? 'DD.MM.YYYY, HH:mm:ss' : 'MM.DD.YYYY, hh:mm:ss A'"
                                :placeholder="$locale.ordersPage.filter.dates.from"
                                :disabled-date="disabledDateFrom"
                                size="large"
                                :show-time="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
                            />
                            <a-date-picker
                                v-model:value="filterStateDateTo"
                                :locale="$locale.locale === Locale.Ru ? datePickerRu : datePickerEn"
                                :format="$locale.locale === Locale.Ru ? 'DD.MM.YYYY, HH:mm:ss' : 'MM.DD.YYYY, hh:mm:ss A'"
                                :placeholder="$locale.ordersPage.filter.dates.to"
                                :disabled-date="disabledDateTo"
                                size="large"
                                :show-time="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
                            />
                            <a-button type="primary" :size="$windowWidth >= 576 ? 'large' : 'default'"
                                      class="d-flex align-items-center gap-2">
                                <template #icon>
                                    <plus-outlined/>
                                </template>
                                <router-link to="/orders/create" @click="newOrder" style="color: white">
                                    {{ $locale.ordersPage.newOrderButtonTitle }}
                                </router-link>
                            </a-button>
                        </div>
                    </div>
                    <div class="table-view-wrapper d-flex flex-column flex-xxl-row gap-3">
                        <a-table class="unselectable w-100" v-model:expanded-row-keys="expandedRowKeys" :data-source="orders"
                                 :columns="columns" :expand-row-by-click="true" :custom-row="customOrderRow">
                            <template v-slot:expandedRowRender="record">
                                <a-table class="unselectable" :data-source="ordersInner.at(record.index)" :key="record.id"
                                         :columns="innerColumns" :pagination="false"
                                         :custom-row="(r, i) => customOrderServiceRow(record.record, r, i)"/>
                            </template>
                            <template #recordsActions="{ record }">
                                <div class="btn-wrapper d-flex gap-2 justify-content-end">
                                    <a-button type="primary" @click="(e) => showReceiptModal(e, record)">
                                        {{ $locale.ordersPage.ordersTableActions.receiptButtonTitle }}
                                    </a-button>
                                    <a-button v-if="!showArchivedOrders" type="primary" danger
                                              @click="(e) => archiveOrderClick(e, record)">
                                        {{ $locale.ordersPage.ordersTableActions.archiveButtonTitle }}
                                    </a-button>
                                    <div class="archive-actions d-flex flex-row gap-2" v-else>
                                        <a-button type="primary" @click="(e) => restoreOrderClick(e, record)">
                                            {{ $locale.ordersPage.ordersTableActions.restoreButtonTitle }}
                                        </a-button>
                                        <a-button type="primary" danger @click="(e) => removeOrderClick(e, record)">
                                            {{ $locale.ordersPage.ordersTableActions.removeButtonTitle }}
                                        </a-button>
                                    </div>
                                </div>
                            </template>
                        </a-table>
                        <div v-if="orders.length" class="summary-wrapper d-flex flex-column">
                            <a-card class="text-start" :title="$locale.summaryText">
                                <template #extra>
                                    <h4 class="m-0 text-end">{{ formatPrice(ordersSummary.totalPrice) }}</h4>
                                </template>
                                <h6 class="pb-1">{{ $locale.newOrdersPage.orderSummary.servicesTitle }}</h6>
                                <a-collapse class="order-services-collapse mb-0" :bordered="false" expand-icon-position="left">
                                    <a-collapse-panel
                                        v-for="service in ordersSummary.services"
                                        :key="service.id"
                                        class="text-start service-panel-header"
                                        :header="service.title"
                                    >
                                        <div
                                            class="summary-service-wrapper d-flex flex-row justify-content-between">
                                            <div class="summary-service">
                                                <h6 class="summary-service-amount">
                                                    {{ $locale.newOrdersPage.orderSummary.services.amount }}: <span
                                                    class="value">{{ service.amount }}</span></h6>
                                                <h6 class="summary-service-price m-0">
                                                    {{ $locale.newOrdersPage.orderSummary.services.price }}: <span
                                                    class="value">{{ formatPrice(service.price) }}</span></h6>
                                            </div>
                                            <div
                                                class="summary-service-total-price d-flex flex-column justify-content-center align-items-stretch">
                                                <h5 class="m-0 value">{{ formatPrice(service.amount * service.price) }}</h5>
                                            </div>
                                        </div>
                                    </a-collapse-panel>
                                </a-collapse>
                            </a-card>
                        </div>
                    </div>
                    <a-modal
                        v-if="receiptOrder"
                        v-model:visible="receiptVisible"
                        :title="`${$locale.orderText} #${receiptOrder.id} ${$locale.fromText.toLocaleLowerCase()} ${receiptOrder.createdAt}`"
                        :ok-text="$locale.closeText"
                        :onOk="() => receiptVisible = false"
                        :after-close="() => receiptOrder = undefined"
                        :cancel-button-props="{ style: { display: 'none' }}"
                        centered
                        closable
                    >
                        <div class="create-order-wrapper d-flex flex-column gap-2">
                            <div v-if="showAllOrders"
                                 class="summary-service-total-price col-12 d-flex flex-row justify-content-between align-items-center">
                                <h6 class="m-0 fw-normal">{{ $locale.executorText }}</h6>
                                <h6 class="m-0 value">{{ receiptOrder.username }}</h6>
                            </div>
                            <a-divider v-if="showAllOrders"/>
                            <div
                                class="summary-service-total-price col-12 d-flex flex-row justify-content-between align-items-center">
                                <h5 class="m-0 fw-normal">
                                    {{ $locale.newOrdersPage.orderSummary.createOrderModal.servicesColumnTitle }}</h5>
                                <h5 class="m-0">{{
                                        $locale.newOrdersPage.orderSummary.createOrderModal.priceColumnTitle
                                    }}</h5>
                            </div>
                            <a-divider/>
                            <div :key="service.id" v-for="service in receiptOrder.services"
                                 class="summary-service-total-price col-12 d-flex flex-row justify-content-between align-items-center">
                                <h6 class="m-0 fw-normal">{{ service.title }}</h6>
                                <h5 class="m-0 value d-flex align-items-center"><span
                                    class="fw-normal fs-6">{{ service.amount }} x {{ formatPrice(service.price) }} =&nbsp;</span>{{
                                        formatPrice(service.amount * service.price)
                                    }}</h5>
                            </div>
                            <a-divider/>
                            <div
                                class="summary-service-total-price col-12 d-flex flex-row justify-content-between align-items-center">
                                <h6 class="m-0 fw-normal">
                                    {{ $locale.newOrdersPage.orderSummary.createOrderModal.totalPrice }}</h6>
                                <h5 class="m-0 value">{{ receiptOrder.price }}</h5>
                            </div>
                            <div
                                class="summary-service-total-price col-12 d-flex flex-row justify-content-between align-items-center">
                                <h6 class="m-0 fw-normal">{{
                                        $locale.newOrdersPage.orderSummary.createOrderModal.cash
                                    }}</h6>
                                <h5 class="m-0 value">{{ receiptOrder.cash }}</h5>
                            </div>
                            <div
                                class="summary-service-total-price col-12 d-flex flex-row justify-content-between align-items-center">
                                <h6 class="m-0 fw-normal">{{
                                        $locale.newOrdersPage.orderSummary.createOrderModal.change
                                    }}</h6>
                                <h5 class="m-0 value">{{ receiptOrder.change }}</h5>
                            </div>
                        </div>
                    </a-modal>
                </a-layout-content>
            </a-layout>
        </div>
    </a-layout>
</template>

<script lang="ts">
import {ApiRole} from "@/api/services/enums/ApiRole";
import {Pane} from "@/store/modules/orders/types";
import {computed, createVNode, defineComponent, ref} from "vue";
import {PlusOutlined, QuestionCircleOutlined, SyncOutlined} from '@ant-design/icons-vue';
import {Order, OrderService, User} from "@/api/services/types";
import {OrdersService, UsersService} from "@/api/services";
import {Loader} from "@/utils";
import {formatDate} from "@/api/utils/formatDate";
import {Modal} from "ant-design-vue";
import {increaseDateByDays} from "@/api/utils/increaseDateByDays";
import {getDaysBetweenDates} from "@/api/utils/getDaysBetweenDates";
import {getFullUsername} from "@/api/utils/getFullUsername";
import {formatPrice} from "@/api/utils/formatPrice";
import {Locale} from "@/store/modules/locales/types/Locale";
import moment from "moment";
import datePickerRu from 'ant-design-vue/es/date-picker/locale/ru_RU';
import datePickerEn from 'ant-design-vue/es/date-picker/locale/en_US';
import {useStore} from "vuex";
import dayjs, {Dayjs} from "dayjs";

export interface OrdersSummary {
    totalPrice: number;
    services: Array<OrderService>;
}

export interface OrderData extends Order {
    key: number;
    cash: string;
    price: string;
    change: string;
    priceRaw: number;
    cashRaw: number;
    changeRaw: number;
    removedIn?: string;
    remaining?: number;
    username?: string;
}

export interface OrderInnerData extends OrderService {
    totalPrice: string;
    unitPrice: string;
}

export default defineComponent({
    components: {
        SyncOutlined,
        PlusOutlined,
    },
    data() {
        return {
            expandedRowKeys: [],
            showArchivedOrders: (this.$route.query.archived && this.$route.query.archived == 'true') ? true : false,
            showAllOrders: (this.$route.query.all && this.$route.query.all == 'true') ? true : false,
            ordersRaw: new Array<Order>(),
        };
    },
    created() {
        this.$store.dispatch("updateServices");
    },
    setup() {
        const store = useStore();
        const user = computed(() => store.getters.userInfo as User);
        const rootAccess = computed(() => user.value ? user.value.roles.some(role => role.value === ApiRole.Root) : false);

        const receiptOrder = ref<OrderData>();
        const receiptVisible = ref(false);

        const users = ref<Array<User>>([]);

        const selectUsersState = ref<Array<number>>([]);
        const selectUsersOptions = computed(() => users.value.map(user => {
            return {
                value: user.id,
                label: getFullUsername(user, {short: true}),
                key: user.id,
            }
        }))

        const updateUsers = async () => {
            if (rootAccess.value) {
                await Loader.Use(async () => {
                    const response = await UsersService.GetUsersPrivate();

                    if (response && response.status) {
                        users.value = response.data as Array<User>;
                    }
                });
            }
        };

        const filterUsers = (input: string, item: { key: string, value: string, label: string }) => {
            return (item.label ?? '').toLocaleLowerCase().includes(input.toLocaleLowerCase());
        }

        const filterStateDateFrom = ref<Dayjs>(dayjs().startOf('day'));
        const filterStateDateTo = ref<Dayjs>();

        const disabledDateFrom = (current: Dayjs) => {
            return current >= filterStateDateTo.value!;
        };

        const disabledDateTo = (current: Dayjs) => {
            return current <= filterStateDateFrom.value;
        };

        const showReceiptModal = (e: Event, order: OrderData) => {
            e.stopPropagation();

            receiptOrder.value = order;
            receiptVisible.value = true;
        }

        return {
            Locale,
            selectUsersOptions,
            selectUsersState,
            moment,
            datePickerRu,
            datePickerEn,
            filterStateDateFrom,
            filterStateDateTo,
            disabledDateTo,
            disabledDateFrom,
            receiptOrder,
            receiptVisible,
            showReceiptModal,
            formatPrice,
            updateUsers,
            filterUsers,
            log: console.log,
        }
    },
    computed: {
        columns(): Array<any> {
            return [
                this.$rootAccess
                    ? {
                        title: this.$locale.ordersPage.ordersTableHeaders.id,
                        dataIndex: 'id',
                        key: 'id',
                        fixed: !this.$mobile ? 'left' : false
                    }
                    : null,
                {
                    title: this.$locale.ordersPage.ordersTableHeaders.totalPrice,
                    dataIndex: "price",
                    key: 'price',
                    align: "right",
                    customCell(record: any) {
                        return {
                            style: {
                                fontWeight: 700,
                            },
                        };
                    }
                },
                {
                    title: this.$locale.ordersPage.ordersTableHeaders.cash,
                    dataIndex: 'cash',
                    key: 'cash',
                    align: 'right'
                },
                {
                    title: this.$locale.ordersPage.ordersTableHeaders.change,
                    dataIndex: "change",
                    key: 'change',
                    align: 'right'
                },
                {
                    title: this.$locale.ordersPage.ordersTableHeaders.createdAt,
                    dataIndex: 'createdAt',
                    key: 'createdAt',
                    align: 'right'
                },
                // { title: archived ? 'Deleted At' : 'Updated At', dataIndex: archived ? 'deletedAt' : 'updatedAt', key: archived ? 'deletedAt' : 'updatedAt' },
                this.$rootAccess && this.showAllOrders ? {
                    title: this.$locale.ordersPage.ordersTableHeaders.user,
                    dataIndex: 'username',
                    key: 'username',
                    align: 'right'
                } : null,
                this.showArchivedOrders ? {
                    title: this.$locale.ordersPage.ordersTableHeaders.removedIn,
                    dataIndex: 'removedIn',
                    key: 'removedIn',
                    align: 'right'
                } : null,
                this.showArchivedOrders ? {
                    title: this.$locale.ordersPage.ordersTableHeaders.remainingDays,
                    dataIndex: 'remaining',
                    key: 'remaining',
                    align: 'right'
                } : null,
                {
                    title: this.$locale.ordersPage.ordersTableHeaders.actions,
                    key: 'actions',
                    align: "right",
                    fixed: !this.$mobile ? 'right' : false,
                    slots: {customRender: "recordsActions"}
                },
            ].filter(col => col);
        },
        innerColumns(): Array<any> {
            return [
                this.$rootAccess
                    ? {
                        title: this.$locale.ordersPage.ordersServicesTableHeaders.id,
                        dataIndex: 'id',
                        key: 'id',
                        fixed: !this.$mobile ? 'left' : false
                    }
                    : null,
                {title: this.$locale.ordersPage.ordersServicesTableHeaders.title, dataIndex: 'title', key: 'title'},
                {
                    title: this.$locale.ordersPage.ordersServicesTableHeaders.amount,
                    dataIndex: 'amount',
                    key: 'amount',
                    align: 'right'
                },
                {
                    title: this.$locale.ordersPage.ordersServicesTableHeaders.price,
                    dataIndex: 'unitPrice',
                    key: 'unitPrice',
                    align: 'right'
                },
                {
                    title: this.$locale.ordersPage.ordersServicesTableHeaders.totalPrice,
                    dataIndex: 'totalPrice',
                    key: 'totalPrice',
                    align: 'right',
                    customCell(record: any) {
                        return {
                            style: {
                                fontWeight: 700,
                            },
                        };
                    }
                },
            ].filter(col => col);
        },
        ordersInner(): Array<Array<OrderInnerData>> {
            return this.orders.map((o: OrderData) => o.services.map(service => {
                return {
                    ...service,
                    unitPrice: formatPrice(service.price),
                    totalPrice: formatPrice(service.amount * service.price),
                }
            }).sort((f, s) => f.id - s.id));
        },
        orders(): Array<OrderData> {
            return this.ordersRaw
                .filter((order: Order) => {
                    const createdAt = moment(new Date(order.createdAt as string));
                    const filter = {
                        from: this.filterStateDateFrom,
                        to: this.filterStateDateTo,
                        userIds: this.selectUsersState,
                    }

                    return (!filter.from || createdAt >= filter.from) &&
                        (!filter.to || createdAt <= filter.to) &&
                        (!filter.userIds.length || filter.userIds.indexOf(order.user.id) !== -1);
                })
                .map((order: Order) => {
                    const price = order.services.length ? order.services.map(service => service.amount * service.price).reduce((prev, cur) => prev + cur) : 0;
                    const change = order.moneyReceived - price;
                    const deletedAt = new Date(order.deletedAt as string);
                    const currentDate = new Date();

                    return {
                        ...order,
                        key: order.id,
                        createdAt: formatDate(new Date(order.createdAt as string)),
                        updatedAt: formatDate(new Date(order.updatedAt as string)),
                        deletedAt: formatDate(deletedAt),
                        removedIn: this.showArchivedOrders
                            ? formatDate(
                                increaseDateByDays(
                                    currentDate,
                                    this.$daysToRemoveOrders - getDaysBetweenDates(deletedAt, currentDate)
                                )
                            ) : undefined,
                        remaining: this.showArchivedOrders
                            ? parseFloat((this.$daysToRemoveOrders - getDaysBetweenDates(deletedAt, currentDate)).toFixed(2))
                            : undefined,
                        cash: formatPrice(order.moneyReceived),
                        price: formatPrice(price),
                        change: formatPrice(change),
                        cashRaw: order.moneyReceived,
                        priceRaw: price,
                        changeRaw: change,
                        username: getFullUsername(order.user, {short: this.$mobile}),
                    }
                });
        },
        ordersSummary(): OrdersSummary {
            const summary: OrdersSummary = {
                totalPrice: 0,
                services: [],
            };

            this.orders.forEach(order => {
                summary.totalPrice += order.priceRaw;

                order.services.forEach(service => {
                    const summaryService = summary.services.find(s => s.id === service.id);
                    if (summaryService) {
                        summaryService.amount += service.amount;
                    } else {
                        summary.services.push({ ...service });
                    }
                });
            });

            if (summary.services.length) {
                summary.services.sort((f, s) => f.id - s.id);
            }

            return summary;
        }
    },
    methods: {
        async refreshOrders() {
            this.$router.push({
                query: {
                    ...this.$route.query,
                    archived: this.showArchivedOrders ? 'true' : undefined,
                    all: this.showAllOrders ? 'true' : undefined,
                }
            });

            this.ordersRaw = [];

            Loader.SetState(true);

            await this.refreshServices();
            await this.loadOrders();
        },
        async loadOrders() {
            const response = this.$rootAccess && this.showAllOrders
                ? await OrdersService.GetAllPrivate({deleted: this.showArchivedOrders})
                : await OrdersService.GetAll({deleted: this.showArchivedOrders});


            if (response.status) {
                this.ordersRaw = (response.data as Array<Order>)
                    .sort((f, s) => {
                        const first = this.showArchivedOrders ? f : s;
                        const second = this.showArchivedOrders ? s : f;

                        return (new Date(first.createdAt as string)).getTime() - (new Date(second.createdAt as string)).getTime()
                    });
            } else {
                this.ordersRaw = [];
            }
        },
        customOrderRow(record: any, index: number) {
            if (!index) {
                Loader.SetState(false);
            }

            return {
                class: {
                    expanded: this.expandedRowKeys.some(key => key === record.id),
                },
            }
        },
        customOrderServiceRow(orderRecord: OrderData, record: OrderInnerData, index: number) {
            return {
                class: {
                    test: true,
                }
            }
        },
        archiveOrderClick(e: Event, record: OrderData) {
            e.stopPropagation();
            this.showArchiveOrderConfirm(record);
        },
        restoreOrderClick(e: Event, record: OrderData) {
            e.stopPropagation();
            this.showRestoreOrderConfirm(record);
        },
        removeOrderClick(e: Event, record: OrderData) {
            e.stopPropagation();
            this.showRemoveOrderConfirm(record);
        },
        showArchiveOrderConfirm(record: OrderData) {
            Modal.confirm({
                title: () => this.$locale.ordersPage.modals.archive.title,
                icon: () => createVNode(QuestionCircleOutlined),
                content: () => `${this.$locale.ordersPage.modals.archive.content} #${record.id}?`,
                class: "unselectable",
                centered: true,
                okText: this.$locale.ordersPage.ordersTableActions.archiveButtonTitle,
                cancelText: this.$locale.cancelText,
                okType: "primary",
                autoFocusButton: "cancel",
                okButtonProps: {danger: true},
                onOk: () => {
                    Loader.Use(async () => {
                        const response = this.$rootAccess && this.showAllOrders
                            ? await OrdersService.RemovePrivate(record.id)
                            : await OrdersService.Remove(record.id);
                        await this.refreshOrders();
                    });
                },
            });
        },
        showRemoveOrderConfirm(record: OrderData) {
            Modal.confirm({
                title: () => this.$locale.ordersPage.modals.remove.title,
                icon: () => createVNode(QuestionCircleOutlined),
                content: () => `${this.$locale.ordersPage.modals.remove.content} #${record.id}?`,
                class: "unselectable",
                centered: true,
                okText: this.$locale.ordersPage.ordersTableActions.removeButtonTitle,
                cancelText: this.$locale.cancelText,
                okType: "primary",
                autoFocusButton: "cancel",
                okButtonProps: {danger: true},
                onOk: () => {
                    Loader.Use(async () => {
                        const response = this.$rootAccess && this.showAllOrders
                            ? await OrdersService.RemovePrivate(record.id, true)
                            : await OrdersService.Remove(record.id, true);
                        await this.refreshOrders();
                    });
                },
            });
        },
        showRestoreOrderConfirm(record: OrderData) {
            Modal.confirm({
                title: () => this.$locale.ordersPage.modals.restore.title,
                icon: () => createVNode(QuestionCircleOutlined),
                content: () => `${this.$locale.ordersPage.modals.restore.content} #${record.id}?`,
                class: "unselectable",
                centered: true,
                okText: this.$locale.ordersPage.ordersTableActions.restoreButtonTitle,
                cancelText: this.$locale.cancelText,
                okType: "primary",
                autoFocusButton: "cancel",
                onOk: () => {
                    Loader.Use(async () => {
                        const response = this.$rootAccess && this.showAllOrders
                            ? await OrdersService.RestorePrivate(record.id)
                            : await OrdersService.Restore(record.id);
                        await this.refreshOrders();
                    });
                },
            });
        },
        newOrder() {
            const panes = this.$store.getters.panes as Array<Pane>;

            if (panes.length === 1 && panes[0].order.empty) {
                return;
            }

            this.$store.commit("addPane");
        }
    },
    watch: {
        $rootAccess(current: boolean, old: boolean) {
            if (current) {
                this.updateUsers();
                this.loadOrders();
            }
        },
        async showAllOrders(state: boolean) {
            if (state && this.$rootAccess) {
                await this.updateUsers();
            }
        },
    },
    mounted() {
        this.refreshOrders();
    },
});
</script>

<style lang="less">
.orders .ant-table-row.expanded {
    color: rgba(0, 0, 0, .3);
}

.test-font {
    font-size: 1.7em !important;
}

.summary-wrapper {
    min-width: 400px;
}
</style>
