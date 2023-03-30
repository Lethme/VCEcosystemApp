<template>
    <div class="container-fluid pt-4 pb-4 d-flex flex-column flex-grow-1 gap-4">
        <vc-layout v-if="exchangeRequests && exchangeRequests.length" class="w-100 p-4" class-inner="d-flex flex-column gap-3" :shadow="true">
            <div class="header d-flex flex-column justify-content-center align-items-center">
                <h4 class="mb-4 text-center d-flex align-items-center gap-2" v-html="$locale.schedulePage.shiftsExchangeTitle" />
                <div class="table-wrapper w-100">
                    <a-table class="cell-width-auto unselectable" bordered :data-source="exchangeRequests" :columns="exchangeRequestsTableColumns" :custom-row="customShiftsExchangeRow" :pagination="false">
                        <template #desiredShift="{ record }">
                            {{ `${(new Date(record.desiredDate)).toLocaleDateString($locale.locale, { day: '2-digit', month: '2-digit', year: 'numeric' })} - ${$locale.daysOfWeek[(new Date(record.desiredDate)).getDay() || 7]} - ${record.desiredShift}` }}
                        </template>
                        <template #suggestedShift="{ record }">
                            {{ `${(new Date(record.suggestedDate)).toLocaleDateString($locale.locale, { day: '2-digit', month: '2-digit', year: 'numeric' })} - ${$locale.daysOfWeek[(new Date(record.suggestedDate)).getDay() || 7]} - ${record.suggestedShift}` }}
                        </template>
                        <template #sender="{ record }">
                            <div v-if="record.sender" class="wrapper d-flex gap-2 align-items-center">
                                <vc-profile-picture height="40" width="40" :preview="record.sender.hasProfilePicture" :shadow="false" :self="false" :uuid="record.sender.hasProfilePicture ? record.sender.uuid : undefined" />
                                <span>{{ getFullUsername(record.sender, { short: true }) }}</span>
                            </div>
                        </template>
                        <template #actions="{ record }">
                            <div class="btn-wrapper d-flex flex-row gap-2 justify-content-end">
                                <a-button type="secondary" @click="selectedExchangeRequest = selectedExchangeRequest?.id === record.id ? undefined : record">{{ selectedExchangeRequest?.id === record.id ? $locale.hideText : $locale.showText }}</a-button>
                                <a-button type="primary" @click="resolveShiftsExchangeRequest(record.id, true)">{{ $locale.acceptText }}</a-button>
                                <a-button type="primary" @click="resolveShiftsExchangeRequest(record.id, false)" danger>{{ $locale.rejectText }}</a-button>
                            </div>
                        </template>
                    </a-table>
                </div>
            </div>
        </vc-layout>
        <div class="container-fluid p-0 d-flex flex-column-reverse flex-xl-row gap-4">
            <vc-layout class="flex-grow-1 p-4" class-inner="d-flex flex-column gap-3" :shadow="true">
                <div v-if="!$mobile" class="header d-flex flex-row justify-content-between">
                    <a-button size="large" type="primary" @click="showPrevMonth" :disabled="date.getMonth() * date.getFullYear() <= (new Date()).getMonth() * (new Date()).getFullYear()">{{ $locale.schedulePage.prevMonth }}</a-button>
                    <h4 class="m-0 d-flex align-items-center gap-2">
                        {{ date.toLocaleString($locale.locale, { month: 'long' }).capitalize() + ', ' + date.getFullYear() }}
                        <sync-outlined class="refresh-btn" @click="updateSchedule"/>
                    </h4>
                    <a-button size="large" type="primary" @click="showNextMonth" :disabled="date.getDate() < 26">{{ $locale.schedulePage.nextMonth }}</a-button>
                </div>
                <div v-else class="header d-flex flex-column gap-2">
                    <h4>{{ date.toLocaleString('default', { month: 'long' }).capitalize() + ', ' + date.getFullYear() }}</h4>
                    <div class="btn-wrapper d-flex flex-row gap-2">
                        <a-button block size="large" type="primary" @click="showPrevMonth" :disabled="date.getMonth() * date.getFullYear() <= (new Date()).getMonth() * (new Date()).getFullYear()">Previous Month</a-button>
                        <a-button block size="large" type="primary" @click="showNextMonth" :disabled="date.getDate() < 26">Next Month</a-button>
                    </div>
                </div>
                <div class="table-wrapper">
                    <a-table id="scheduleTable" class="cell-width-auto unselectable" bordered :data-source="schedule" :columns="scheduleTableColumns" :pagination="false" :custom-row="customScheduleRow">
                        <template #date="{ record }">
                            <span>{{ (new Date(record.date)).getDate() }}</span>
                        </template>
                        <template #day="{ record }">
                            <span>{{ $locale.daysOfWeek[record.day] }}</span>
                        </template>
                        <template #weekend="{ record }">
                            <a-switch v-if="record.day !== ApiDay.Sunday" :checked-value="!record.weekend" @change="setWeekend(record)" />
                        </template>
                        <template #firstShift="{ record }">
                            <a-dropdown :disabled="tableShiftWrapperSelectUnavailable(record, 2) || !$rootAccess" :trigger="['contextmenu']">
                                <div
                                    :class="tableShiftWrapperClasses(record, 1)"
                                    :style="selectedExchangeRequestStyle(record, 1)"
                                >
                                    <div
                                        v-if="record.firstShiftUser && !record.weekend"
                                        class="wrapper d-flex gap-2 align-items-center"
                                        @click="$operatorAccess ? scheduleShiftClick(getScheduleShiftData(record, 1)) : null"
                                    >
                                        <vc-profile-picture height="40" width="40" :preview="record.firstShiftUser?.hasProfilePicture" :shadow="false" :self="false" :uuid="record.firstShiftUser?.hasProfilePicture ? record.firstShiftUser?.uuid : undefined" />
                                        <span>{{ record.firstShiftUser?.lastName }}</span>
                                    </div>
                                </div>
                                <template #overlay>
                                    <div class="overlay-wrapper d-flex flex-column" style="border: 1px solid #ddd">
                                        <a-menu>
                                            <h6 class="ant-menu-item ant-menu-item-disabled" style="cursor: unset">
                                                {{ (new Date(record.date)).toLocaleDateString($locale.locale, { day: '2-digit', month: '2-digit', year: '2-digit' }) }}
                                                 |
                                                {{ $locale.daysOfWeek[record.day] }}
                                                 |
                                                {{ record.firstShiftUser?.lastName }}
                                            </h6>
                                            <a-sub-menu key="selectUserFirstShift" class="d-flex flex-row align-items-center">
                                                <template #title>{{ $locale.schedulePage.shiftContextMenu.selectUser }}</template>
                                                <a-menu-item
                                                    v-for="operator in operators.filter(op => op.id !== record.firstShiftUser?.id)"
                                                    :key="operator.id"
                                                    class="py-2 px-3 h-auto"
                                                    @click="setUserShift(record, 1, operator)"
                                                >
                                                    <vc-profile-picture height="40" width="40" :preview="false" :shadow="false" :self="false" :uuid="operator.hasProfilePicture ? operator.uuid : undefined" />
                                                    {{ operator.lastName }}
                                                </a-menu-item>
                                            </a-sub-menu>
                                        </a-menu>
                                    </div>
                                </template>
                            </a-dropdown>
                        </template>
                        <template #secondShift="{ record }">
                            <a-dropdown :disabled="tableShiftWrapperSelectUnavailable(record, 2) || !$rootAccess" :trigger="['contextmenu']">
                                <div
                                    :class="tableShiftWrapperClasses(record, 2)"
                                    :style="selectedExchangeRequestStyle(record, 2)"
                                >
                                    <div
                                        v-if="record.secondShiftUser && !record.weekend"
                                        class="wrapper d-flex gap-2 align-items-center"
                                        @click="$operatorAccess ? scheduleShiftClick(getScheduleShiftData(record, 2)) : null"
                                    >
                                        <vc-profile-picture height="40" width="40" :preview="record.secondShiftUser?.hasProfilePicture" :shadow="false" :self="false" :uuid="record.secondShiftUser?.hasProfilePicture ? record.secondShiftUser?.uuid : undefined" />
                                        <span>{{ record.secondShiftUser?.lastName }}</span>
                                    </div>
                                </div>
                                <template #overlay>
                                    <div class="overlay-wrapper d-flex flex-column" style="border: 1px solid #ddd">
                                        <a-menu>
                                            <h6 class="ant-menu-item ant-menu-item-disabled" style="cursor: unset">
                                                {{ (new Date(record.date)).toLocaleDateString($locale.locale, { day: '2-digit', month: '2-digit', year: '2-digit' }) }}
                                                 |
                                                {{ $locale.daysOfWeek[record.day] }}
                                                 |
                                                {{ record.secondShiftUser?.lastName }}
                                            </h6>
                                            <a-sub-menu key="selectUserSecondShift" class="d-flex flex-row align-items-center">
                                                <template #title>{{ $locale.schedulePage.shiftContextMenu.selectUser }}</template>
                                                <a-menu-item
                                                    v-for="operator in operators.filter(op => op.id !== record.secondShiftUser?.id)"
                                                    :key="operator.id"
                                                    class="py-2 px-3 h-auto"
                                                    @click="setUserShift(record, 2, operator)"
                                                >
                                                    <vc-profile-picture height="40" width="40" :preview="false" :shadow="false" :self="false" :uuid="operator.hasProfilePicture ? operator.uuid : undefined" />
                                                    {{ operator.lastName }}
                                                </a-menu-item>
                                            </a-sub-menu>
                                        </a-menu>
                                    </div>
                                </template>
                            </a-dropdown>
                        </template>
                    </a-table>
                </div>
            </vc-layout>
<!--            <vc-layout v-if="selectedShiftForExchange" class="flex-grow-1 flex-xl-grow-0 p-4" style="min-width: 350px" class-inner="d-flex flex-column gap-3" :shadow="true">-->
<!--                123-->
<!--            </vc-layout>-->
        </div>
    </div>
</template>

<script lang="ts">
import {ApiService, ScheduleService, ShiftsExchangeService, UsersService} from "@/api/services";
import {ApiDay} from "@/api/services/enums/ApiDay";
import {ApiRole} from "@/api/services/enums/ApiRole";
import {
    Schedule,
    ScheduleResponse,
    ScheduleUser,
    ShiftsExchange,
    ShiftsExchangeRequestDto,
    User
} from "@/api/services/types";
import {getFullUsername} from "@/api/utils/getFullUsername";
import VcLayout from "@/components/LayoutComponent/LayoutComponent.vue";
import {Locale} from "@/store/modules/locales/types/Locale";
import {LocaleRecord} from "@/store/modules/locales/types/LocaleRecord";
import {Loader} from "@/utils";
import {datesEqual} from "@/utils/datesEqual";
import {SyncOutlined,} from "@ant-design/icons-vue";
import {Modal} from "ant-design-vue";
import calendarEN from 'ant-design-vue/es/calendar/locale/en_US';
import calendarRU from 'ant-design-vue/es/calendar/locale/ru_RU';
import moment from "moment";
import 'moment/dist/locale/ru';
import {computed, defineComponent, onMounted, onUnmounted, ref, watch} from "vue";
import {useStore} from "vuex";

moment.locale('ru');

interface ScheduleData extends Schedule {
    firstShiftUser?: ScheduleUser;
    secondShiftUser?: ScheduleUser;
}

interface ScheduleShiftData {
    day: ApiDay;
    date: Date;
    shift: number;
    myShift: boolean;
    user?: ScheduleUser;
}

export default defineComponent({
    components: {
        VcLayout,
        SyncOutlined,
    },
    setup() {
        const store = useStore();
        const locale = computed(() => store.getters.localeRecord as LocaleRecord);
        const user = computed(() => store.getters.userInfo as User);
        const schedule = ref<Array<ScheduleData>>([]);
        const users = ref<Array<ScheduleUser>>([]);
        const date = ref<Date>(new Date());
        const exchangeRequests = ref<Array<ShiftsExchange>>([]);
        const selectedExchangeRequest = ref<ShiftsExchange>();
        const scheduleUpdateIntervalId = ref<number>();

        const access = computed(() => user.value?.roles.some(role => role.value === ApiRole.Root || role.value === ApiRole.Moderator));
        const rootAccess = computed(() => user.value?.roles.some(role => role.value === ApiRole.Root));

        const operators = ref<Array<User>>([]);

        const selectedShiftForExchange = ref<ScheduleShiftData>();

        const updateSchedule = async (useLoader = true) => {
            useLoader && Loader.SetState(true);
            const response = await ScheduleService.Get(date.value.getMonth(), date.value.getFullYear());

            if (response && response.status) {
                users.value = (response.data as ScheduleResponse).users;
                schedule.value = (response.data as ScheduleResponse).schedule.map(s => {
                    return {
                        ...s,
                        firstShiftUser: users.value.find(u => u.id === s.firstShiftUserId),
                        secondShiftUser: users.value.find(u => u.id === s.secondShiftUserId),
                    } as ScheduleData;
                });
            }

            await updateShiftsExchangeRequests(useLoader);
            useLoader && Loader.SetState(false);
        }

        const updateShiftsExchangeRequests = async (useLoader = true) => {
            useLoader && Loader.SetState(true);
            const response = await ShiftsExchangeService.GetRequests(date.value.getMonth(), date.value.getFullYear());

            if (response && response.status) {
                exchangeRequests.value = (response.data as Array<ShiftsExchange>).filter(request => request.receiverId === user.value.id);

                if (selectedExchangeRequest.value && !exchangeRequests.value.some(request => request.id === selectedExchangeRequest.value?.id)) {
                    selectedExchangeRequest.value = undefined;
                }
            }
            useLoader && Loader.SetState(false);
        }

        const resolveShiftsExchangeRequest = async (id: number, accept: boolean) => {
            await Loader.Use(async () => {
                const response = await ShiftsExchangeService.ResolveRequest(id, accept);

                if (response && response.status) {
                    await updateSchedule();
                }
            });
        }

        const customScheduleRow = (record: ScheduleData, index: number) => {
            return {
                style: record.weekend ? {
                    //background: '#FD8A8A20',
                    //pointerEvents: 'none',
                    color: '#0005'
                } : {

                }
            }
        }

        const customShiftsExchangeRow = (record: ShiftsExchange, index: number) => {
            return {
                style: {
                    background: selectedExchangeRequest.value && selectedExchangeRequest.value?.id === record.id ? '#FD8A8A20' : 'none',
                },
            }
        }

        const selectedExchangeRequestStyle = (record: ScheduleData, shiftIndex: number) => {
            if (selectedExchangeRequest.value && (
                (
                    datesEqual(new Date(record.date), new Date(selectedExchangeRequest.value!.desiredDate)) &&
                    shiftIndex === selectedExchangeRequest.value?.desiredShift
                ) ||
                (
                    datesEqual(new Date(record.date), new Date(selectedExchangeRequest.value!.suggestedDate)) &&
                    shiftIndex === selectedExchangeRequest.value?.suggestedShift
                )
            )) {
                return {
                    background: '#FD8A8A20',
                }
            }

            return {
                background: 'none',
            }
        }

        onMounted(async () => {
            await updateSchedule();
            scheduleUpdateIntervalId.value = setInterval(updateSchedule.bind(null, false), 5000);
        });

        onUnmounted(async () => {
            clearInterval(scheduleUpdateIntervalId.value);
        });

        watch(() => rootAccess.value, async (value) => {
            if (value) {
                const response = await UsersService.GetUsersPrivate();

                if (response && response.status) {
                    operators.value = (response.data as Array<User>).filter(u => u.roles.some(role => role.value === ApiRole.Operator));
                }
            } else {
                operators.value = [];
            }
        });

        watch(() => date.value, async () => {
            await updateSchedule();
        });

        const showNextMonth = () => {
            date.value = new Date(date.value.setMonth(date.value.getMonth() + 1));
        }

        const showPrevMonth = () => {
            date.value = new Date(date.value.setMonth(date.value.getMonth() - 1));
        }

        const setWeekend = async (record: ScheduleData) => {
            if (!access.value) return;

            const response = await ScheduleService.SetWeekendPrivate(record.date, !record.weekend);

            if (response && response.status) {
                await updateSchedule(false);
            }
        }

        const scheduleTableColumns = computed(() => {
            return [
                {
                    title: locale.value.schedulePage.scheduleTableHeaders.date,
                    key: 'date',
                    fixed: 'left',
                    slots: {customRender: "date"},
                },
                {
                    title: locale.value.schedulePage.scheduleTableHeaders.day,
                    key: 'day',
                    slots: {customRender: "day"},
                },
                access.value ?
                    {
                        title: locale.value.schedulePage.scheduleTableHeaders.weekend,
                        key: "weekend",
                        slots: {customRender: "weekend"},
                    }
                    : null,
                {
                    title: locale.value.schedulePage.scheduleTableHeaders.firstShift,
                    key: 'firstShift',
                    slots: {customRender: "firstShift"},
                },
                {
                    title: locale.value.schedulePage.scheduleTableHeaders.secondShift,
                    key: 'secondShift',
                    slots: {customRender: "secondShift"},
                },
            ].filter(col => col)
        });

        const exchangeRequestsTableColumns = computed(() => {
            return [
                {
                    title: locale.value.schedulePage.exchangeRequestsTableHeaders.desiredShift,
                    key: 'desiredShift',
                    slots: {customRender: "desiredShift"},
                },
                {
                    title: locale.value.schedulePage.exchangeRequestsTableHeaders.suggestedShift,
                    key: 'suggestedShift',
                    slots: {customRender: "suggestedShift"},
                },
                {
                    title: locale.value.schedulePage.exchangeRequestsTableHeaders.sender,
                    key: 'sender',
                    slots: {customRender: "sender"},
                },
                {
                    title: locale.value.schedulePage.exchangeRequestsTableHeaders.actions,
                    key: 'actions',
                    align: 'right',
                    slots: {customRender: "actions"},
                },
            ]
        });

        const tableShiftWrapperClasses = (record: ScheduleData, shiftIndex: number) => {
            const scheduleShiftData = getScheduleShiftData(record, shiftIndex);
            const myShift = shiftIndex === 1 ? record.firstShiftUserId === user.value?.id : record.secondShiftUserId === user.value?.id;

            return {
                'ant-table-cell-wrapper': true,
                'my-shift': myShift,
                'selected': selectedShiftForExchange.value && scheduleShiftDataEqual(scheduleShiftData, selectedShiftForExchange.value),
                'select-unavailable': selectedShiftForExchange.value && !myShift && !scheduleShiftDataEqual(scheduleShiftData, selectedShiftForExchange.value)
            }
        }

        const tableShiftWrapperSelectUnavailable = (record: ScheduleData, shiftIndex: number) => {
            const scheduleShiftData = getScheduleShiftData(record, shiftIndex);
            const myShift = shiftIndex === 1 ? record.firstShiftUserId === user.value?.id : record.secondShiftUserId === user.value?.id;

            return selectedShiftForExchange.value && !myShift && !scheduleShiftDataEqual(scheduleShiftData, selectedShiftForExchange.value);
        }

        const setUserShift = async (record: ScheduleData, shiftIndex: number, operator: User) => {
            if (rootAccess.value) {
                const scheduleShiftData = getScheduleShiftData(record, shiftIndex);

                const dto = {
                    date: scheduleShiftData.date,
                    shiftIndex,
                    userId: operator.id,
                };

                const response = await ScheduleService.SetUserShiftPrivate(dto);

                if (response && response.status) {
                    await updateSchedule();
                }
            }
        }

        const getScheduleShiftData = (record: ScheduleData, shiftIndex: number): ScheduleShiftData => {
            const shiftUser = shiftIndex === 1 ? record.firstShiftUser : record.secondShiftUser;

            return {
                day: record.day,
                date: new Date(record.date),
                shift: shiftIndex,
                user: shiftUser,
                myShift: shiftUser?.id === user.value?.id,
            } as ScheduleShiftData
        }

        const scheduleShiftDataEqual = (first: ScheduleShiftData, second: ScheduleShiftData) => {
            return datesEqual(first.date, second.date) && first.shift === second.shift;
        }

        const scheduleShiftClick = (record: ScheduleShiftData) => {
            if (record.myShift && !selectedShiftForExchange.value) {
                Modal.info({
                    title: locale.value.locale === Locale.Ru
                        ? "Обмен сменами"
                        : "Shifts Exchange",
                    content: locale.value.locale === Locale.Ru
                        ? "Сначала выберите смену другого пользователя."
                        : "Select other user's shift first.",
                    centered: true,
                });

                return;
            }

            if (selectedShiftForExchange.value && scheduleShiftDataEqual(selectedShiftForExchange.value, record)) {
                selectedShiftForExchange.value = undefined;
                return;
            }

            if (selectedShiftForExchange.value && record.myShift) {
                const title = locale.value.locale === Locale.Ru
                    ? "Подтверждение создания запроса на обмен сменами"
                    : "Shifts Exchange Request Confirmation";

                const desiredDate = selectedShiftForExchange.value.date.toLocaleDateString(locale.value.locale, { day: '2-digit', month: '2-digit', year: 'numeric' });
                const suggestedDate = record.date.toLocaleDateString(locale.value.locale, { day: '2-digit', month: '2-digit', year: 'numeric' });
                const desiredShiftUsername = getFullUsername(selectedShiftForExchange.value?.user);

                const content = locale.value.locale === Locale.Ru
                    ? `Вы хотите обменять Вашу ${record.shift === 1 ? 'первую' : 'вторую'} смену ` +
                        `с ${suggestedDate} ` +
                        `на ${desiredDate} ` +
                        `${selectedShiftForExchange.value.shift === 1 ? 'первую' : 'вторую'} смену ` +
                        `пользователя ${desiredShiftUsername}. Отправить запрос?`
                    : `You want to exchange your ${record.shift === 1 ? 'first' : 'second'} shift ` +
                        `from ${suggestedDate} ` +
                        `to ${desiredDate} ` +
                        `${selectedShiftForExchange.value.shift === 1 ? 'first' : 'second'} shift ` +
                        `of user ${desiredShiftUsername}. Send request?`

                const okText = locale.value.locale === Locale.Ru
                    ? 'Отправить запрос'
                    : 'Send Request'

                Modal.confirm({
                    title,
                    content,
                    okText,
                    cancelText: locale.value.cancelText,
                    onCancel: () => {
                        selectedShiftForExchange.value = undefined;
                    },
                    onOk: async () => {
                        const shiftsExchangeRequestDto: ShiftsExchangeRequestDto = {
                            suggestedDate: record.date,
                            desiredDate: selectedShiftForExchange.value!.date,
                            suggestedShift: record.shift,
                            desiredShift: selectedShiftForExchange.value!.shift,
                            senderId: record.user!.id,
                            receiverId: selectedShiftForExchange.value!.user!.id,
                        }

                        await Loader.Use(async () => {
                            const response = await ShiftsExchangeService.CreateRequest(shiftsExchangeRequestDto);

                            if (response && response.status) {
                                Modal.success({
                                    title: locale.value.locale === Locale.Ru
                                        ? "Запрос успешно отправлен!"
                                        : "Request has been successfully sent!"
                                });
                            } else {
                                Modal.error({
                                    title: locale.value.locale === Locale.Ru
                                        ? "Во время отправки запроса произошла ошибка."
                                        : "An exception occurred on request send."
                                });
                            }
                        });

                        selectedShiftForExchange.value = undefined;
                    }
                });
            } else {
                selectedShiftForExchange.value = record;
            }
        }

        const profilePictureClick = (event: Event) => {
            event.stopPropagation();
        }

        return {
            setWeekend,
            profilePictureClick,
            scheduleShiftClick,
            getScheduleShiftData,
            scheduleShiftDataEqual,
            tableShiftWrapperClasses,
            Locale,
            ApiDay,
            ApiService,
            calendarRU,
            calendarEN,
            schedule,
            users,
            date,
            operators,
            exchangeRequests,
            scheduleTableColumns,
            exchangeRequestsTableColumns,
            selectedExchangeRequest,
            selectedShiftForExchange,
            getFullUsername,
            showNextMonth,
            showPrevMonth,
            updateSchedule,
            customScheduleRow,
            resolveShiftsExchangeRequest,
            customShiftsExchangeRow,
            selectedExchangeRequestStyle,
            tableShiftWrapperSelectUnavailable,
            setUserShift,
        }
    }
});
</script>

<style lang="less">
    #scheduleTable tbody .ant-table-cell {
        padding: 0;

        & .ant-table-cell-wrapper .wrapper,
        &:not(:last-child):not(:nth-last-child(2)) {
            padding: 16px;
            box-shadow: none;
            transition: all .1s linear;
        }

        & .ant-table-cell-wrapper {
            opacity: 1;
            transition: all .2s ease;
            cursor: pointer;
        }

        & .ant-table-cell-wrapper.select-unavailable {
            cursor: not-allowed;
            opacity: .3;

            & .wrapper {
                pointer-events: none;
            }
        }

        & .ant-table-cell-wrapper.my-shift .wrapper {
            background: #1890ff0F;
            font-weight: 500;
        }

        & .ant-table-cell-wrapper.selected .wrapper {
            //background: #33CC3310;
            //border: 1px solid rgba(0, 0, 0, .15);
            box-shadow: 0 0 5px 1px #33CC3377 inset;
        }
    }
</style>