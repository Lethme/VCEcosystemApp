<template>
    <div class="header-wrapper d-flex pb-3 flex-column flex-md-row gap-3 justify-content-between align-items-center">
        <div class="headers">
            <h6 v-if="$mobile" class="text-start m-0 d-flex align-items-center gap-2">
                {{ $locale.userProfilePage.contentTitles.users }}
                <sync-outlined class="refresh-btn" @click="updateUsersList"/>
            </h6>
            <h4 v-else class="text-start m-0 d-flex align-items-center gap-2">
                {{ $locale.userProfilePage.contentTitles.users }}
                <sync-outlined class="refresh-btn" @click="updateUsersList"/>
            </h4>
        </div>
        <div class="btn-wrapper">
            <a-button type="primary" :loading="createModalLoading" size="large" @click="showCreateModal">
                {{ $locale.userProfilePage.addUserButtonTitle }}
            </a-button>
        </div>
    </div>
    <div class="table-wrapper">
        <a-table v-if="$mobile" :row-key="record => record.id" table-layout="auto" bordered :data-source="users"
                 :columns="columns" :pagination="{ pageSize: 1000 }" :scroll="{ y: 327 }">
            <template #avatar="{ record }">
                <vc-profile-picture height="50" width="50" :preview="record.hasProfilePicture" :shadow="false" :self="false" :uuid="record.hasProfilePicture ? record.uuid : undefined" />
            </template>
            <template #operation="{ record }">
                <div class="btn-wrapper d-flex justify-content-end gap-2">
                    <a-button type="primary" @click="() => showEditModal(record)">{{ $locale.editText }}</a-button>
                    <a-button v-if="!record.active" type="primary" @click="() => showConfirmLinkModal(record)">
                        {{ $locale.userProfilePage.usersTableButtonsTitles.confirmLink }}
                    </a-button>
                    <a-popconfirm
                        v-else
                        :title="$locale.userProfilePage.usersTableButtonsTitles.deactivate + '?'"
                        @confirm="record.id === $user.id ? showDisableUserAccountModal(record) : disableUserAccount(record.id)"
                    >
                        <a-button type="primary" danger>{{
                                $locale.userProfilePage.usersTableButtonsTitles.deactivate
                            }}
                        </a-button>
                    </a-popconfirm>
                </div>
            </template>
            <template #roles="{ record }">
                <span class="roles">{{ record.roles.map(role => $locale.roles[role.value]).join(', ') }}</span>
            </template>
            <template #active="{ record }">
                <check-circle-filled v-if="record.active" :style="{color: '#52C41A'}"/>
                <close-circle-filled v-else :style="{color: '#FF4D4F'}"/>
            </template>
        </a-table>
        <a-table v-else bordered :data-source="users" :columns="columns" :pagination="{ pageSize: 8 }">
            <template #avatar="{ record }">
                <vc-profile-picture height="70" width="70" :preview="record.hasProfilePicture" :shadow="false" :self="false" :uuid="record.hasProfilePicture ? record.uuid : undefined" />
            </template>
            <template #operation="{ record }">
                <div class="btn-wrapper d-flex justify-content-end gap-2">
                    <a-button type="primary" @click="() => showEditModal(record)">{{ $locale.editText }}</a-button>
                    <a-button v-if="!record.active" type="primary" @click="() => showConfirmLinkModal(record)">
                        {{ $locale.userProfilePage.usersTableButtonsTitles.confirmLink }}
                    </a-button>
                    <a-popconfirm
                        v-else
                        :title="$locale.userProfilePage.usersTableButtonsTitles.deactivate + '?'"
                        @confirm="record.id === $user.id ? showDisableUserAccountModal(record) : disableUserAccount(record.id)"
                    >
                        <a-button type="primary" danger>{{
                                $locale.userProfilePage.usersTableButtonsTitles.deactivate
                            }}
                        </a-button>
                    </a-popconfirm>
                </div>
            </template>
            <template #roles="{ record }">
                <span class="roles">{{ record.roles.map(role => $locale.roles[role.value]).join(', ') }}</span>
            </template>
            <template #active="{ record }">
                <check-circle-filled v-if="record.active" :style="{color: '#52C41A'}"/>
                <close-circle-filled v-else :style="{color: '#FF4D4F'}"/>
            </template>
        </a-table>
        <a-modal
            :visible="createModalVisible"
            :title="$locale.userProfilePage.addUserButtonTitle"
            :ok-text="$locale.userProfilePage.addUserButtonTitle"
            :cancel-text="$locale.cancelText"
            :confirm-loading="createModalConfirmLoading"
            :onCancel="() => createModalVisible = false"
            @ok="createUser"
            centered
        >
            <div class="input-wrapper d-flex flex-column align-items-start py-2">
                <h6>{{ $locale.userProfilePage.usersTableHeaders.username }}</h6>
                <a-input size="large" required :disabled="createModalConfirmLoading" class="w-100"
                         v-model:value="createUserState.username" @pressEnter="createUser"/>
            </div>
            <div class="input-wrapper d-flex flex-column align-items-start py-2">
                <h6>{{ $locale.userProfilePage.usersTableHeaders.lastName }}</h6>
                <a-input size="large" required :disabled="createModalConfirmLoading" class="w-100"
                         v-model:value="createUserState.lastName" @pressEnter="createUser"/>
            </div>
            <div class="input-wrapper d-flex flex-column align-items-start py-2">
                <h6>{{ $locale.userProfilePage.usersTableHeaders.firstName }}</h6>
                <a-input size="large" required :disabled="createModalConfirmLoading" class="w-100"
                         v-model:value="createUserState.firstName" @pressEnter="createUser"/>
            </div>
            <div class="input-wrapper d-flex flex-column align-items-start py-2">
                <h6>{{ $locale.userProfilePage.usersTableHeaders.patronymic }}</h6>
                <a-input size="large" required :disabled="createModalConfirmLoading" class="w-100"
                         v-model:value="createUserState.patronymic" @pressEnter="createUser"/>
            </div>
            <div class="input-wrapper d-flex flex-column align-items-start py-2">
                <h6>{{ $locale.userProfilePage.usersTableHeaders.roles }}</h6>
                <a-select
                    v-model:value="createUserState.roles"
                    show-search
                    show-arrow
                    size="large"
                    :disabled="createModalConfirmLoading"
                    mode="multiple"
                    :placeholder="$locale.userProfilePage.createUserModal.selectRolesPlaceholder"
                    class="w-100"
                    allow-clear
                    :options="roles"
                    :filter-option="filterRoles"
                    @pressEnter="createUser"
                />
            </div>
            <div class="input-wrapper d-flex flex-column align-items-start py-2">
                <h6>{{ $locale.userProfilePage.usersTableHeaders.rate }}</h6>
                <a-select
                    v-model:value="createUserState.rateId"
                    size="large"
                    show-search
                    :disabled="createModalConfirmLoading"
                    :placeholder="$locale.userProfilePage.createUserModal.selectRatePlaceholder"
                    class="w-100"
                    :options="rates"
                    allow-clear
                    :filter-option="filterRates"
                    @pressEnter="createUser"
                />
            </div>
            <a-alert
                class="mt-2"
                size="large"
                v-if="createModalException"
                :message="createModalException"
                type="error"
                :after-close="() => createModalException = ''"
                closable
            />
        </a-modal>
        <a-modal
            :visible="editModalVisible"
            :title="getFullUsername(editUserRecord, { short: $mobile })"
            :ok-text="$locale.saveText"
            :cancel-text="$locale.cancelText"
            :confirm-loading="editModalConfirmLoading"
            :onCancel="() => editModalVisible = false"
            @ok="editUser"
            centered
        >
            <div class="input-wrapper d-flex flex-column align-items-start py-2">
                <h6>{{ $locale.userProfilePage.usersTableHeaders.username }}</h6>
                <a-input size="large" required :disabled="createModalConfirmLoading" class="w-100"
                         v-model:value="editUserState.username" @pressEnter="editUser"/>
            </div>
            <div class="input-wrapper d-flex flex-column align-items-start py-2">
                <h6>{{ $locale.userProfilePage.usersTableHeaders.lastName }}</h6>
                <a-input size="large" required :disabled="createModalConfirmLoading" class="w-100"
                         v-model:value="editUserState.lastName" @pressEnter="editUser"/>
            </div>
            <div class="input-wrapper d-flex flex-column align-items-start py-2">
                <h6>{{ $locale.userProfilePage.usersTableHeaders.firstName }}</h6>
                <a-input size="large" required :disabled="createModalConfirmLoading" class="w-100"
                         v-model:value="editUserState.firstName" @pressEnter="editUser"/>
            </div>
            <div class="input-wrapper d-flex flex-column align-items-start py-2">
                <h6>{{ $locale.userProfilePage.usersTableHeaders.patronymic }}</h6>
                <a-input size="large" required :disabled="createModalConfirmLoading" class="w-100"
                         v-model:value="editUserState.patronymic" @pressEnter="editUser"/>
            </div>
            <div v-if="!(editUserRecord.roles.length === 1 && editUserRecord.roles[0].value === ApiRole.Root)"
                 class="input-wrapper d-flex flex-column align-items-start py-2">
                <h6>{{ $locale.userProfilePage.usersTableHeaders.roles }}</h6>
                <a-select
                    v-model:value="editUserState.roles"
                    show-search
                    show-arrow
                    size="large"
                    :disabled="createModalConfirmLoading"
                    mode="multiple"
                    :placeholder="$locale.userProfilePage.createUserModal.selectRolesPlaceholder"
                    class="w-100"
                    allow-clear
                    :options="roles"
                    :filter-option="filterRoles"
                    @pressEnter="editUser"
                />
            </div>
            <div class="input-wrapper d-flex flex-column align-items-start py-2">
                <h6>{{ $locale.userProfilePage.usersTableHeaders.rate }}</h6>
                <a-select
                    v-model:value="editUserState.rateId"
                    size="large"
                    show-search
                    :disabled="createModalConfirmLoading"
                    :placeholder="$locale.userProfilePage.createUserModal.selectRatePlaceholder"
                    class="w-100"
                    :options="rates"
                    allow-clear
                    :filter-option="filterRates"
                    @pressEnter="editUser"
                />
            </div>
            <a-alert
                class="mt-2"
                v-if="editModalException"
                :message="editModalException"
                type="error"
                :after-close="() => editModalException = ''"
                closable
            />
        </a-modal>
    </div>
</template>

<script lang="ts">
import {RatesService, UsersService, AuthService, ServicesService} from "@/api/services";
import {ApiRole} from "@/api/services/enums/ApiRole";
import {CreateUserDto, EditUserDto, Rate, User} from "@/api/services/types";
import {getFullUsername} from "@/api/utils/getFullUsername";
import {LocaleRecord} from "@/store/modules/locales/types/LocaleRecord";
import {Loader} from "@/utils";
import {Modal} from "ant-design-vue";
import {computed, defineComponent, onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {useStore} from "vuex";

import {
    SyncOutlined,
    CheckCircleFilled,
    CloseCircleFilled,
} from "@ant-design/icons-vue";
import VcProfilePicture from "@/components/ProfilePictureComponent/ProfilePictureComponent.vue";

export default defineComponent({
    name: "VcProfileUsers",
    components: {
        SyncOutlined,
        CheckCircleFilled,
        CloseCircleFilled,
    },
    setup(props, context) {
        const store = useStore();
        const router = useRouter();
        const locale = computed(() => store.getters.localeRecord as LocaleRecord);
        const user = computed(() => store.getters.userInfo as User);
        const rootAccess = computed(() => user.value ? user.value.roles.some(role => role.value === ApiRole.Root) : false);
        const users = ref<Array<User>>([]);
        const updateUsersList = async (useLoader = true) => {
            useLoader && Loader.SetState(true);

            const response = await UsersService.GetUsersPrivate();
            if (response.status) {
                users.value = (response.data as Array<User>).sort((f, s) => f.id - s.id);
            } else {
                users.value = [];
            }

            useLoader && Loader.SetState(false);
        }

        const columns = computed(() => {
            return [
                {
                    title: locale.value.userProfilePage.usersTableHeaders.id,
                    dataIndex: 'id',
                    key: 'id',
                    fixed: !store.getters.mobile ? 'left' : false,
                },
                {
                    title: locale.value.userProfilePage.usersTableHeaders.avatar,
                    key: 'avatar',
                    slots: {customRender: "avatar"},
                },
                {
                    title: locale.value.userProfilePage.usersTableHeaders.lastName,
                    dataIndex: 'lastName',
                    key: 'lastName',
                },
                {
                    title: locale.value.userProfilePage.usersTableHeaders.firstName,
                    dataIndex: 'firstName',
                    key: 'firstName',
                },
                {
                    title: locale.value.userProfilePage.usersTableHeaders.patronymic,
                    dataIndex: 'patronymic',
                    key: 'patronymic',
                },
                {
                    title: locale.value.userProfilePage.usersTableHeaders.username,
                    dataIndex: 'username',
                    key: 'username',
                },
                {
                    title: locale.value.userProfilePage.usersTableHeaders.roles,
                    dataIndex: 'roles',
                    key: 'roles',
                    slots: {customRender: "roles"},
                },
                {
                    title: locale.value.userProfilePage.usersTableHeaders.shifts,
                    dataIndex: 'rate',
                    key: 'rate',
                    customRender({record}: { record: User }) {
                        return record.rate ? record.rate.rate : null;
                    }
                },
                {
                    title: locale.value.userProfilePage.usersTableHeaders.active,
                    dataIndex: 'active',
                    key: 'active',
                    slots: {customRender: 'active'},
                },
                {
                    title: locale.value.userProfilePage.usersTableHeaders.actions,
                    dataIndex: 'operation',
                    key: 'operation',
                    align: "right",
                    fixed: !store.getters.mobile ? 'right' : false,
                    slots: {customRender: 'operation'},
                },
            ]
        })

        onMounted(async () => {
            await updateUsersList();
        });

        const showConfirmLinkModal = (record: User) => {
            navigator.clipboard.writeText(`${window.location.origin}/confirm/${record.uuid}`);
            Modal.success({
                title: () => getFullUsername(record, {
                    short: store.getters.windowWidth <= 576,
                }),
                width: "auto",
                content: () => `${window.location.origin}/confirm/${record.uuid}`,
                centered: true,
                okType: "primary",
            });
        }

        const showDisableUserAccountModal = (user: User) => {
            navigator.clipboard.writeText(`${window.location.origin}/confirm/${user.uuid}`);
            Modal.confirm({
                title: () => locale.value.userProfilePage.usersDeactivateOwnAccountTitle,
                width: "auto",
                content: () => `${window.location.origin}/confirm/${user.uuid}`,
                onOk: async () => await disableUserAccount(user.id),
                centered: true,
                okType: "primary",
                cancelText: locale.value.cancelText,
                okText: locale.value.userProfilePage.usersTableButtonsTitles.deactivate,
            });
        }

        const disableUserAccount = async (id: number) => {
            await Loader.Use(async () => {
                const response = await UsersService.DisableUserAccountPrivate(id);

                if (response.status) {
                    await updateUsersList();
                }
            });
        }

        const createModalLoading = ref(false);
        const createModalVisible = ref(false);
        const createModalConfirmLoading = ref(false);
        const createModalException = ref('');
        const createUserState = ref<CreateUserDto>({
            username: '',
            lastName: '',
            firstName: '',
            patronymic: '',
            roles: [],
            rateId: undefined,
        });

        const editModalLoading = ref(false);
        const editModalVisible = ref(false);
        const editModalConfirmLoading = ref(false);
        const editModalException = ref('');
        const editUserRecord = ref<User | undefined>(undefined);
        const editUserState = ref<EditUserDto>({
            username: '',
            lastName: '',
            firstName: '',
            patronymic: '',
            roles: [],
            rateId: undefined,
        });

        const ratesRaw = ref<Array<Rate>>([]);
        const rates = computed(() => ratesRaw.value
            .map(rate => ({key: rate.id, value: rate.id, label: rate.title}))
            .sort((f, s) => f.label.charCodeAt(0) - s.label.charCodeAt(0))
        );

        const roles = computed(() => {
            return Object.values(ApiRole)
                .map(role => ({key: role, value: role, label: locale.value.roles[role]}));
        });

        const filterRoles = (input: string, item: { key: string, value: string, label: string }) => {
            return (item.label ?? '').toLocaleLowerCase().includes(input.toLocaleLowerCase());
        }

        const filterRates = (input: string, item: { key: string, value: string, label: string }) => {
            return (item.label ?? '').toLocaleLowerCase().includes(input.toLocaleLowerCase());
        }

        const setDefaultCreateUserState = () => {
            createUserState.value.username = '';
            createUserState.value.lastName = '';
            createUserState.value.firstName = '';
            createUserState.value.patronymic = '';
            createUserState.value.roles = [];
            createUserState.value.rateId = undefined;
        }

        const setDefaultEditUserState = () => {
            editUserRecord.value = undefined;
            editUserState.value.username = '';
            editUserState.value.lastName = '';
            editUserState.value.firstName = '';
            editUserState.value.patronymic = '';
            editUserState.value.roles = [];
            editUserState.value.rateId = undefined;
        }

        const updateRatesList = async () => {
            const response = await RatesService.GetRatesPrivate(true);

            if (response.status) {
                ratesRaw.value = (response.data as Array<Rate>).filter(rate => !rate.deletedAt);
            } else {
                ratesRaw.value = [];
            }
        }

        updateRatesList();

        const showCreateModal = async () => {
            createModalLoading.value = true;
            await updateRatesList();

            setDefaultCreateUserState();

            createModalVisible.value = true;
            createModalLoading.value = false;
        }

        const showEditModal = async (user: User) => {
            editModalLoading.value = true;
            await updateRatesList();

            editUserRecord.value = user;
            editUserState.value.username = user.username;
            editUserState.value.lastName = user.lastName;
            editUserState.value.firstName = user.firstName;
            editUserState.value.patronymic = user.patronymic;
            editUserState.value.roles = user.roles.map(role => role.value);
            editUserState.value.rateId = user.rate?.id;

            editModalVisible.value = true;
            editModalLoading.value = false;
        }

        const createUser = async () => {
            if (!createUserState.value.username.length) {
                createModalException.value = locale.value.userProfilePage.createUserModal.exceptions.emptyUsername;
                return;
            }

            if (createUserState.value.username.length < 8) {
                createModalException.value = locale.value.userProfilePage.createUserModal.exceptions.usernameWrongLength;
                return;
            }

            if (
                !(
                    createUserState.value.lastName.length &&
                    createUserState.value.firstName.length &&
                    createUserState.value.patronymic.length
                )
            ) {
                createModalException.value = locale.value.userProfilePage.createUserModal.exceptions.emptyNameFields;
                return;
            }

            createModalConfirmLoading.value = true;

            const response = await AuthService.RegisterPrivate(createUserState.value);

            if (response && response.status) {
                await updateUsersList(false);
                setDefaultCreateUserState();
            }

            createModalConfirmLoading.value = false;
            createModalVisible.value = false;

            if (response && response.status) {
                showConfirmLinkModal(response.data as User);
            }
        }

        const editUser = async () => {
            if (editUserState.value.username && !editUserState.value.username.length) {
                editModalException.value = locale.value.userProfilePage.createUserModal.exceptions.emptyUsername;
                return;
            }

            if (editUserState.value.username && editUserState.value.username.length < 8) {
                editModalException.value = locale.value.userProfilePage.createUserModal.exceptions.usernameWrongLength;
                return;
            }

            if (
                !(
                    editUserState.value.lastName && editUserState.value.lastName.length &&
                    editUserState.value.firstName && editUserState.value.firstName.length &&
                    editUserState.value.patronymic && editUserState.value.patronymic.length
                )
            ) {
                editModalException.value = locale.value.userProfilePage.createUserModal.exceptions.emptyNameFields;
                return;
            }

            editModalConfirmLoading.value = true;

            const response = await UsersService.EditUserPrivate(editUserRecord.value!.id, editUserState.value);

            if (response && response.status) {
                if (editUserRecord.value?.id === user.value.id) {
                    await store.dispatch("updateUserInfo");
                }

                if (rootAccess.value) {
                    await updateUsersList(false);
                } else {
                    await router.push({
                        path: "/profile",
                    });
                }
            }

            //setDefaultEditUserState();
            editModalConfirmLoading.value = false;
            editModalVisible.value = false;
        }

        return {
            users,
            columns,
            roles,
            rates,
            filterRoles,
            filterRates,
            updateUsersList,
            showConfirmLinkModal,
            disableUserAccount,
            showDisableUserAccountModal,
            createModalLoading,
            createModalVisible,
            createModalConfirmLoading,
            createModalException,
            createUserState,
            editModalLoading,
            editModalVisible,
            editModalConfirmLoading,
            editModalException,
            editUserState,
            editUserRecord,
            createUser,
            editUser,
            showCreateModal,
            showEditModal,
            getFullUsername,
            ApiRole,
        }
    },
})
</script>

<style lang="less">
@import "ProfileUsersComponent";
</style>