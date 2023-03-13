<template>
    <vc-layout class="mb-4">
        <div class="telegram-link-wrapper d-flex flex-column align-items-center gap-2">
            <h4 v-if="$user.telegramLinked">Your Telegram ID: {{ $user.telegramId }}</h4>
            <h4 v-else>You can link your Telegram Account</h4>
            <a-button
                v-if="!$user?.telegramLinked"
                type="primary"
                style="background: #2AABEE"
                :size="$windowWidth >= 576 ? 'large' : 'default'"
                class="d-flex align-items-center gap-2"
                @click="telegramLinkModalVisible = true"
            >
                <template #icon>
                    <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50" style="fill: #fff" width="20px" height="20px"><path d="M46.137,6.552c-0.75-0.636-1.928-0.727-3.146-0.238l-0.002,0C41.708,6.828,6.728,21.832,5.304,22.445	c-0.259,0.09-2.521,0.934-2.288,2.814c0.208,1.695,2.026,2.397,2.248,2.478l8.893,3.045c0.59,1.964,2.765,9.21,3.246,10.758	c0.3,0.965,0.789,2.233,1.646,2.494c0.752,0.29,1.5,0.025,1.984-0.355l5.437-5.043l8.777,6.845l0.209,0.125	c0.596,0.264,1.167,0.396,1.712,0.396c0.421,0,0.825-0.079,1.211-0.237c1.315-0.54,1.841-1.793,1.896-1.935l6.556-34.077	C47.231,7.933,46.675,7.007,46.137,6.552z M22,32l-3,8l-3-10l23-17L22,32z"/></svg>
                </template>
                {{ `${$locale.linkTelegramText} ${$locale.telegramText} ${$locale.accountText}` }}
            </a-button>
            <a-popconfirm
                v-else
                :title="`${$locale.unlinkTelegramText} ${$locale.telegramText} ${$locale.accountText}?`"
                @confirm="unlinkTelegramAccount"
            >
                <a-button
                    type="primary"
                    style="background: #2AABEE"
                    :size="$windowWidth >= 576 ? 'large' : 'default'"
                    class="d-flex align-items-center gap-2"
                >
                    <template #icon>
                        <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50" style="fill: #fff" width="20px" height="20px"><path d="M46.137,6.552c-0.75-0.636-1.928-0.727-3.146-0.238l-0.002,0C41.708,6.828,6.728,21.832,5.304,22.445	c-0.259,0.09-2.521,0.934-2.288,2.814c0.208,1.695,2.026,2.397,2.248,2.478l8.893,3.045c0.59,1.964,2.765,9.21,3.246,10.758	c0.3,0.965,0.789,2.233,1.646,2.494c0.752,0.29,1.5,0.025,1.984-0.355l5.437-5.043l8.777,6.845l0.209,0.125	c0.596,0.264,1.167,0.396,1.712,0.396c0.421,0,0.825-0.079,1.211-0.237c1.315-0.54,1.841-1.793,1.896-1.935l6.556-34.077	C47.231,7.933,46.675,7.007,46.137,6.552z M22,32l-3,8l-3-10l23-17L22,32z"/></svg>
                    </template>
                    {{ `${$locale.unlinkTelegramText} ${$locale.telegramText} ${$locale.accountText}` }}
                </a-button>
            </a-popconfirm>
            <a-modal
                v-if="!$user?.telegramLinked"
                v-model:visible="telegramLinkModalVisible"
                :title="$locale.telegramText"
                :ok-text="$locale.closeText"
                :onOk="() => telegramLinkModalVisible = false"
                :after-close="refreshUserInfo"
                :cancel-button-props="{ style: { display: 'none' }}"
                :width="1000"
                :style="{ maxWidth: '100%' }"
                centered
                closable
            >
                <div class="telegram-link-modal-body d-flex flex-row gap-3">
                    <qrcode-vue :value="$user?.getTelegramBotLink()" :size="200" level="H" />
                    <div class="telegram-link">
                        <h5>{{ $locale.telegramLinkText }}: <a :href="$user?.getTelegramBotLink()">{{ $locale.followLinkText }}</a></h5>
                    </div>
                </div>
            </a-modal>
        </div>
    </vc-layout>
    <vc-layout class="mb-4" class-inner="d-flex flex-column gap-3" v-if="$user && $rootAccess">
        <div class="select-wrapper d-flex flex-column flex-lg-row gap-3">
            <a-cascader
                style="min-width: 300px;"
                class="text-start w-100"
                size="large"
                expand-trigger="hover"
                multiple
                allow-clear
                :placeholder="$locale.ordersPage.filter.userSelect"
                :options="sendMessageCascaderOptions"
                v-model:value="sendMessageCascaderValue"
            />
        </div>
        <a-input :disabled="!(sendMessageCascaderValue && sendMessageCascaderValue.length) || messageSending" v-model:value="message" size="large" placeholder="Basic usage" @keydown.enter="sendMessage" @keydown.esc="message = ''">
            <template #suffix>
                <send-outlined v-if="!messageSending" class="send-btn" @click="sendMessage" />
                <loading-outlined v-else class="send-btn" />
            </template>
        </a-input>
    </vc-layout>
</template>

<script lang="ts">
import {BotService, UsersService} from "@/api/services";
import {computed, defineComponent, onMounted, ref, watch} from "vue";
import QrcodeVue from "qrcode.vue";
import {useStore} from "vuex";
import {User} from "@/api/services/types";
import {ApiRole} from "@/api/services/enums/ApiRole";
import VcLayout from "@/components/LayoutComponent/LayoutComponent.vue";
import {Loader} from "@/utils";
import {CascaderProps} from "ant-design-vue";
import {LocaleRecord} from "@/store/modules/locales/types/LocaleRecord";
import {SendOutlined, LoadingOutlined} from "@ant-design/icons-vue";

export default defineComponent({
    name: "VcProfile",
    components: {
        VcLayout,
        QrcodeVue,
        SendOutlined,
        LoadingOutlined,
    },
    setup() {
        const store = useStore();
        const user = computed(() => store.getters.userInfo as User);
        const rootAccess = computed(() => user.value?.roles.some(role => role.value === ApiRole.Root));
        const locale = computed(() => store.getters.localeRecord as LocaleRecord);

        const users = ref<Array<User>>([]);
        const usersWithLinkedTelegram = computed(() => users.value.filter(user => user.telegramLinked));
        const usersWithLinkedTelegramOptions = computed(() => usersWithLinkedTelegram.value.map(user => {
            return {
                label: user.lastName,
                value: user.id,
            }
        }));

        const message = ref<string>("");
        const messageSending = ref<boolean>(false);

        const sendMessageCascaderValue = ref<Array<Array<string | number>>>([]);

        const sendMessageCascaderUsers = computed(() => {
            return [...new Set(sendMessageCascaderValue.value.map(arr => {
                if (arr.length === 1 && (arr[0] == 'users:all' || arr[0] == 'roles:all')) {
                    return usersWithLinkedTelegram.value.map(u => u.id);
                }

                const selector = arr[0];
                const data = arr[1];

                if (typeof data === 'number') return [data];
                else return usersWithLinkedTelegram.value.filter(user => user.roles.some(role => role.value === data as ApiRole)).map(user => user.id)
            }).reduce((acc, arr) => acc.concat(arr)))];
        });

        const sendMessageCascaderOptions = computed<CascaderProps['options']>(() => {
            return [
                {
                    label: locale.value.allUsersText,
                    value: "users:all",
                    children: usersWithLinkedTelegramOptions.value,
                },
                {
                    label: locale.value.rolesText,
                    value: "roles:all",
                    children: [
                        { label: locale.value.roles[ApiRole.Root], value: ApiRole.Root },
                        { label: locale.value.roles[ApiRole.Moderator], value: ApiRole.Moderator },
                        { label: locale.value.roles[ApiRole.Admin], value: ApiRole.Admin },
                        { label: locale.value.roles[ApiRole.Operator], value: ApiRole.Operator },
                        { label: locale.value.roles[ApiRole.Guest], value: ApiRole.Guest },
                    ]
                }
            ]
        });

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

        watch(() => rootAccess.value, async (access) => {
            if (access) {
                await updateUsersList(false);
            }
        });

        const telegramLinkModalVisible = ref(false);
        const unlinkTelegramAccount = async () => {
            const response = await UsersService.UnlinkTelegramAccount();
            await store.dispatch("updateUserInfo");
        };

        const sendMessage = async () => {
            messageSending.value = true;
            const response = await BotService.SendMessagePrivate({ userIds: sendMessageCascaderUsers.value, message: message.value });
            message.value = '';
            messageSending.value = false;
        };

        return {
            users,
            message,
            messageSending,
            telegramLinkModalVisible,
            usersWithLinkedTelegram,
            usersWithLinkedTelegramOptions,
            sendMessageCascaderOptions,
            sendMessageCascaderValue,
            unlinkTelegramAccount,
            sendMessage,
        }
    },
})
</script>

<style lang="less" scoped>
@import 'ProfileComponent';
</style>