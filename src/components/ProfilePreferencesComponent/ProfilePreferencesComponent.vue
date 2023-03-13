<template>
    <div class="header-wrapper d-flex pb-3 flex-column flex-md-row gap-3 justify-content-between align-items-center">
        <div class="headers">
            <h6 v-if="$mobile" class="text-start m-0 d-flex align-items-center gap-2">
                {{ $locale.userProfilePage.contentTitles.preferences }}
                <sync-outlined class="refresh-btn" @click="refreshUserInfo"/>
            </h6>
            <h4 v-else class="text-start m-0 d-flex align-items-center gap-2">
                {{ $locale.userProfilePage.contentTitles.preferences }}
                <sync-outlined class="refresh-btn" @click="refreshUserInfo"/>
            </h4>
        </div>
        <div class="btn-wrapper">
            <a-button type="primary" size="large" @click="showCreateModal">
                {{ $locale.userProfilePage.addPreferenceButtonTitle }}
            </a-button>
        </div>
    </div>
    <div class="table-wrapper">
        <a-table bordered :data-source="preferences" :columns="columns" :pagination="{ pageSize: 8 }">
            <template #day="{ record }">
                <span>{{ $locale.daysOfWeek[record.day] }}</span>
            </template>
            <template #preference="{ record }">
                <check-circle-filled v-if="record.preference" :style="{color: '#52C41A'}"/>
                <close-circle-filled v-else :style="{color: '#FF4D4F'}"/>
            </template>
            <template #operation="{ record }">
                <div class="btn-wrapper d-flex justify-content-end gap-2">
                    <a-button type="primary" @click="showEditModal(record)">{{ $locale.editText }}</a-button>
                    <a-popconfirm
                        :title="$locale.removeText + '?'"
                        @confirm="removePreference(record.id)"
                    >
                        <a-button type="primary" danger>{{ $locale.removeText }}</a-button>
                    </a-popconfirm>
                </div>
            </template>
        </a-table>
        <a-modal
            :visible="createModalVisible"
            :title="$locale.userProfilePage.addPreferenceButtonTitle"
            :ok-text="$locale.userProfilePage.addPreferenceButtonTitle"
            :cancel-text="$locale.cancelText"
            :confirm-loading="createModalConfirmLoading"
            :onCancel="() => createModalVisible = false"
            @ok="createPreference"
            centered
        >
            <div class="input-wrapper d-flex flex-column align-items-start py-2">
                <h6>{{ $locale.userProfilePage.preferencesTableHeaders.day }}</h6>
                <a-select
                    v-model:value="createModalState.day"
                    size="large"
                    show-arrow
                    :disabled="createModalConfirmLoading"
                    class="w-100"
                    :options="days"
                />
            </div>
            <div class="input-wrapper d-flex flex-column align-items-start py-2">
                <h6>{{ $locale.userProfilePage.preferencesTableHeaders.shift }}</h6>
                <a-select
                    v-model:value="createModalState.shiftIndex"
                    size="large"
                    show-arrow
                    :disabled="createModalConfirmLoading"
                    class="w-100"
                    :options="shifts"
                />
            </div>
            <div class="input-wrapper d-flex flex-column align-items-start py-2">
                <h6>
                    {{ $locale.userProfilePage.preferencesTableHeaders.preference }}
                    <check-circle-filled v-if="createModalState.preference"
                                         :style="{color: '#52C41A', marginLeft: '3px'}"/>
                    <close-circle-filled v-else :style="{color: '#FF4D4F', marginLeft: '3px'}"/>
                </h6>
                <a-switch
                    :checked-children="$locale.userProfilePage.preferenceSwitch.checked"
                    :un-checked-children="$locale.userProfilePage.preferenceSwitch.unchecked"
                    :disabled="createModalConfirmLoading"
                    v-model:checked="createModalState.preference"
                />
            </div>
        </a-modal>
        <a-modal
            :visible="editModalVisible"
            :title="$locale.userProfilePage.preferencesTableHeaders.preference"
            :ok-text="$locale.saveText"
            :cancel-text="$locale.cancelText"
            :confirm-loading="editModalConfirmLoading"
            :onCancel="() => editModalVisible = false"
            @ok="savePreference"
            centered
        >
            <div class="input-wrapper d-flex flex-column align-items-start py-2">
                <h6>{{ $locale.userProfilePage.preferencesTableHeaders.day }}</h6>
                <a-select
                    v-model:value="editModalState.day"
                    size="large"
                    show-arrow
                    :disabled="editModalConfirmLoading"
                    class="w-100"
                    :options="days"
                />
            </div>
            <div class="input-wrapper d-flex flex-column align-items-start py-2">
                <h6>{{ $locale.userProfilePage.preferencesTableHeaders.shift }}</h6>
                <a-select
                    v-model:value="editModalState.shiftIndex"
                    size="large"
                    show-arrow
                    :disabled="editModalConfirmLoading"
                    class="w-100"
                    :options="shifts"
                />
            </div>
            <div class="input-wrapper d-flex flex-column align-items-start py-2">
                <h6>
                    {{ $locale.userProfilePage.preferencesTableHeaders.preference }}
                    <check-circle-filled v-if="editModalState.preference"
                                         :style="{color: '#52C41A', marginLeft: '3px'}"/>
                    <close-circle-filled v-else :style="{color: '#FF4D4F', marginLeft: '3px'}"/>
                </h6>
                <a-switch
                    :checked-children="$locale.userProfilePage.preferenceSwitch.checked"
                    :un-checked-children="$locale.userProfilePage.preferenceSwitch.unchecked"
                    :disabled="editModalConfirmLoading"
                    v-model:checked="editModalState.preference"
                />
            </div>
        </a-modal>
    </div>
</template>

<script lang="ts">
import {ServicesService, UsersService} from "@/api/services";
import {ApiDay} from "@/api/services/enums/ApiDay";
import {CreatePreferenceDto, EditPreferenceDto, Preference, User} from "@/api/services/types";
import {LocaleRecord} from "@/store/modules/locales/types/LocaleRecord";
import {Loader} from "@/utils";
import {CheckCircleFilled, CloseCircleFilled, SyncOutlined,} from "@ant-design/icons-vue";
import {computed, defineComponent, onMounted, ref, watch} from "vue";
import {useStore} from "vuex";
import {Modal} from "ant-design-vue";

interface Day {
    value: ApiDay;
    label: string;
}

export default defineComponent({
    name: "VcProfilePreferences",
    components: {
        SyncOutlined,
        CheckCircleFilled,
        CloseCircleFilled,
    },
    setup() {
        const store = useStore();
        const locale = computed(() => store.getters.localeRecord as LocaleRecord);
        const user = computed(() => store.getters.userInfo as User);
        const preferences = computed(() => [...user.value.preferences]
            .sort((f, s) => f.day - s.day)
        );
        const days = computed(() => Object.values(ApiDay)
            .filter(val => typeof val === 'number' && val !== 7)
            .map(day => ({value: day, label: locale.value.daysOfWeek[day as ApiDay]})) as Array<Day>
        );
        const shifts = computed(() => createModalState.value.day === ApiDay.Saturday ? [{value: 1}] : [{value: 1}, {value: 2}]);

        const removePreference = async (id: number) => {
            await Loader.Use(async () => {
                const response = await UsersService.RemovePreference(id);

                if (response && response.status) {
                    await store.dispatch("updateUserInfo");
                }
            });
        }

        const createModalLoading = ref(false);
        const createModalVisible = ref(false);
        const createModalConfirmLoading = ref(false);
        const createModalState = ref<CreatePreferenceDto>({
            day: ApiDay.Monday,
            shiftIndex: 1,
            preference: false,
        });

        watch(() => createModalState.value.day, (day) => {
            if (day === ApiDay.Saturday) {
                createModalState.value.shiftIndex = 1;
            }
        });

        const editModalLoading = ref(false);
        const editModalVisible = ref(false);
        const editModalConfirmLoading = ref(false);
        const editModalStatePreference = ref<Preference>();
        const editModalState = ref<EditPreferenceDto>({
            day: ApiDay.Monday,
            shiftIndex: 1,
            preference: false,
        });

        watch(() => editModalState.value.day, (day) => {
            if (day === ApiDay.Saturday) {
                editModalState.value.shiftIndex = 1;
            }
        });

        const setDefaultCreateModalState = () => {
            createModalState.value.day = ApiDay.Monday;
            createModalState.value.shiftIndex = 1;
            createModalState.value.preference = false;
        }

        const setDefaultEditModalState = () => {
            editModalState.value.day = ApiDay.Monday;
            editModalState.value.shiftIndex = 1;
            editModalState.value.preference = false;
        }

        const showCreateModal = () => {
            setDefaultCreateModalState();
            createModalVisible.value = true;
        }

        const showEditModal = (preference: Preference) => {
            editModalStatePreference.value = preference;
            editModalState.value.day = preference.day;
            editModalState.value.shiftIndex = preference.shiftIndex;
            editModalState.value.preference = preference.preference;

            editModalVisible.value = true;
        }

        const createPreference = async () => {
            createModalConfirmLoading.value = true;

            const response = await UsersService.AddPreference(createModalState.value);

            if (response && response.status) {
                await store.dispatch("updateUserInfo");
                setDefaultCreateModalState();
            } else {
                Modal.error({
                    title: locale.value.userProfilePage.addPreferenceButtonTitle,
                    content: locale.value.exceptions.preferences["409"],
                    centered: true,
                });
            }

            createModalConfirmLoading.value = false;
            createModalVisible.value = false;
        }

        const savePreference = async () => {
            editModalConfirmLoading.value = true;

            const response = await UsersService.EditPreference(editModalStatePreference.value!.id, editModalState.value);

            if (response && response.status) {
                await store.dispatch("updateUserInfo");
                setDefaultEditModalState();
            }

            editModalConfirmLoading.value = false;
            editModalVisible.value = false;
        }

        const columns = computed(() => {
            return [
                {
                    title: locale.value.userProfilePage.preferencesTableHeaders.day,
                    dataIndex: 'day',
                    key: 'day',
                    slots: {customRender: "day"},
                },
                {
                    title: locale.value.userProfilePage.preferencesTableHeaders.shift,
                    dataIndex: 'shiftIndex',
                    key: 'shift',
                },
                {
                    title: locale.value.userProfilePage.preferencesTableHeaders.preference,
                    dataIndex: 'preference',
                    key: 'preference',
                    slots: {customRender: "preference"},
                },
                {
                    title: locale.value.userProfilePage.preferencesTableHeaders.actions,
                    dataIndex: 'operation',
                    key: 'operation',
                    align: "right",
                    fixed: !store.getters.mobile ? 'right' : false,
                    slots: {customRender: "operation"},
                },
            ];
        });

        onMounted(() => {
            Loader.Use(async () => {
                await store.dispatch("updateUserInfo");
            });
        });

        return {
            ApiDay,
            days,
            shifts,
            columns,
            preferences,
            createModalLoading,
            createModalVisible,
            createModalConfirmLoading,
            createModalState,
            editModalLoading,
            editModalVisible,
            editModalConfirmLoading,
            editModalState,
            removePreference,
            showCreateModal,
            createPreference,
            showEditModal,
            savePreference,
        };
    },
})
</script>

<style lang="less">
@import "ProfilePreferencesComponent";
</style>