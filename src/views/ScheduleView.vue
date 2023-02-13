<template>
    <div class="container-fluid pt-4 pb-4 d-flex flex-grow-1">
        <vc-layout class="w-100 p-4" class-inner="d-flex flex-column gap-3" :shadow="true">
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
                <a-table class="cell-width-auto" bordered :data-source="schedule" :columns="columns" :pagination="false" :custom-row="customScheduleRow" :custom-cell="customScheduleCell">
                    <template #date="{ record }">
                        <span>{{ (new Date(record.date)).getDate() }}</span>
                    </template>
                    <template #day="{ record }">
                        <span>{{ $locale.daysOfWeek[record.day] }}</span>
                    </template>
                    <template #firstShift="{ record }">
                        <div v-if="record.firstShiftUser" class="wrapper d-flex gap-2 align-items-center">
                            <vc-profile-picture height="40" width="40" :preview="record.firstShiftUser?.hasProfilePicture" :shadow="false" :self="false" :uuid="record.firstShiftUser?.hasProfilePicture ? record.firstShiftUser?.uuid : undefined" />
                            <span :style="{ color: record.firstShiftUser?.id === $user?.id ? '#6096B4' : '#000' }">{{ record.firstShiftUser?.lastName }}</span>
                        </div>
                    </template>
                    <template #secondShift="{ record }">
                        <div v-if="record.secondShiftUser" class="wrapper d-flex gap-2 align-items-center">
                            <vc-profile-picture height="40" width="40" :preview="record.secondShiftUser?.hasProfilePicture" :shadow="false" :self="false" :uuid="record.secondShiftUser?.hasProfilePicture ? record.secondShiftUser?.uuid : undefined" />
                            <span :style="{ color: record.secondShiftUser?.id === $user?.id ? '#6096B4' : '#000' }">{{ record.secondShiftUser?.lastName }}</span>
                        </div>
                    </template>
                </a-table>
            </div>
        </vc-layout>
    </div>
</template>

<script lang="ts">
import {ScheduleService} from "@/api/services";
import {Schedule, ScheduleResponse, ScheduleUser, User} from "@/api/services/types";
import {LocaleRecord} from "@/store/modules/locales/types/LocaleRecord";
import {Loader} from "@/utils";
import moment, {Moment} from "moment";
import 'moment/dist/locale/ru';
moment.locale('ru');

import {computed, defineComponent, onMounted, ref, watch} from "vue";
import calendarRU from 'ant-design-vue/es/calendar/locale/ru_RU';
import calendarEN from 'ant-design-vue/es/calendar/locale/en_US';
import {Locale} from "@/store/modules/locales/types/Locale";
import {
    RightSquareTwoTone,
    LeftSquareTwoTone,
    SyncOutlined,
    CoffeeOutlined,
} from "@ant-design/icons-vue";
import { getFullUsername } from "@/api/utils/getFullUsername";
import {ApiService} from "@/api/services";
import {useStore} from "vuex";

interface ScheduleData extends Schedule {
    firstShiftUser?: ScheduleUser;
    secondShiftUser?: ScheduleUser;
}

export default defineComponent({
    components: {
        SyncOutlined,
    },
    setup() {
        const store = useStore();
        const locale = computed(() => store.getters.localeRecord as LocaleRecord);
        const schedule = ref<Array<ScheduleData>>([]);
        const users = ref<Array<ScheduleUser>>([]);
        const date = ref<Date>(new Date());

        const updateSchedule = async () => {
            await Loader.Use(async () => {
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
            });
        }

        const customScheduleRow = (record: ScheduleData, index: number) => {
            return {
                style: record.weekend ? {
                    //background: '#FD8A8A20',
                    pointerEvents: 'none',
                    color: '#0005'
                } : {

                }
            }
        }

        const customScheduleCell = (record: ScheduleData, index: number) => {
            return {
                style: {
                    background: record.weekend ? '#FD8A8A20' : 'none',
                }
            }
        }

        onMounted(async () => {
            await updateSchedule();
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

        const columns = computed(() => {
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
            ]
        })

        return {
            Locale,
            ApiService,
            calendarRU,
            calendarEN,
            schedule,
            users,
            date,
            columns,
            getFullUsername,
            showNextMonth,
            showPrevMonth,
            updateSchedule,
            customScheduleRow,
            customScheduleCell,
        }
    }
});
</script>

<style lang="less">

</style>