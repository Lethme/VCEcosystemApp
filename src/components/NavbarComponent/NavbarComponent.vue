<template>
    <a-layout class="flex-grow-0 sticky-top t-0">
        <a-layout-content>
            <div class="container-fluid">
                <a-menu v-model:selectedKeys="current" :selectable="false" mode="horizontal" class="vc-navbar">
                    <a-menu-item key="logo" class="logo-item">
                        <div class="logo">
                            <router-link to="/">
                                <img src="/vc_logo.png" alt="" class="logo-img">
                            </router-link>
                        </div>
                    </a-menu-item>
                    <a-menu-item-group key="userGroup" class="d-flex flex-row align-items-center" style="margin-left: auto;">
                        <template #title>
                            <i class="hide-parent"></i>
                        </template>
                        <a-menu-item key="notifications" class="p-0" style="align-self: center">
                            <a-badge count="100">
                                <bell-outlined style="font-size: 1.8em"/>
                            </a-badge>
                        </a-menu-item>
                        <a-menu-item v-if="!$authorized" class="d-flex align-items-center" key="login"
                                     style="margin-left: auto">
                            <template #icon>
                                <login-outlined/>
                            </template>
                            <router-link to="/login">Войти</router-link>
                        </a-menu-item>
                        <a-sub-menu v-else key="userProfile1" style="margin-left: auto">
                            <template #title>
                                <vc-profile-picture :shadow="false" width="30" height="30"/>
                                {{ username }}
                            </template>
                            <a-menu-item v-if="tempOrdersExist" key="editNewOrders" class="d-flex align-items-center">
                                <template #icon>
                                    <bars-outlined/>
                                </template>
                                <router-link to="/orders/create">{{
                                        $locale.mainMenuItemTitles.newOrder.edit
                                    }}
                                </router-link>
                            </a-menu-item>
                            <a-menu-item v-else key="newOrder" class="d-flex align-items-center">
                                <template #icon>
                                    <file-outlined/>
                                </template>
                                <router-link to="/orders/create">{{ $locale.mainMenuItemTitles.newOrder.new }}</router-link>
                            </a-menu-item>
                            <a-menu-item key="orders" class="d-flex align-items-center">
                                <template #icon>
                                    <solution-outlined/>
                                </template>
                                <router-link to="/orders">{{ $locale.mainMenuItemTitles.orders }}</router-link>
                            </a-menu-item>
                            <a-menu-item key="schedule" class="d-flex align-items-center">
                                <template #icon>
                                    <calendar-outlined/>
                                </template>
                                <router-link to="/schedule">{{ $locale.mainMenuItemTitles.schedule }}</router-link>
                            </a-menu-item>
                            <a-divider class="m-0"/>
                            <a-sub-menu key="locales" class="d-flex flex-row align-items-center">
                                <template #icon>
                                    <zhihu-outlined/>
                                </template>
                                <template #title>{{ $locale.mainMenuItemTitles.locales }}</template>
                                <a-menu-item v-for="locale in $localeRecords" :key="locale.locale"
                                             @click="$store.dispatch('setLocale', locale.locale)"
                                             :class="{ 'locale-selected': locale.locale === $locale.locale }">
                                    {{ $locale.localeTitles[locale.locale] }}
                                    <check-outlined v-if="locale.locale === $locale.locale" class="ms-auto"/>
                                </a-menu-item>
                            </a-sub-menu>
                            <a-divider class="m-0"/>
                            <a-menu-item key="account" class="d-flex align-items-center">
                                <template #icon>
                                    <user-outlined/>
                                </template>
                                <router-link to="/profile">{{ $locale.mainMenuItemTitles.account }}</router-link>
                            </a-menu-item>
                            <a-divider class="m-0"/>
                            <a-menu-item key="logout" class="log-out d-flex align-items-center" @click="$user.logout">
                                <template #icon>
                                    <logout-outlined/>
                                </template>
                                {{ $locale.mainMenuItemTitles.logOut }}
                            </a-menu-item>
                        </a-sub-menu>
                    </a-menu-item-group>
                </a-menu>
            </div>
        </a-layout-content>
    </a-layout>
</template>

<script lang="ts">
import {defineComponent, onMounted, ref, watch} from 'vue';
import {
    LoginOutlined,
    LogoutOutlined,
    SolutionOutlined,
    UserOutlined,
    FileOutlined,
    BarsOutlined,
    ZhihuOutlined,
    CheckOutlined,
    CalendarOutlined,
    BellOutlined,
} from '@ant-design/icons-vue';
import {getFullUsername} from "@/api/utils/getFullUsername";

export default defineComponent({
    name: "VcNavbar",
    components: {
        LoginOutlined,
        LogoutOutlined,
        SolutionOutlined,
        UserOutlined,
        FileOutlined,
        BarsOutlined,
        ZhihuOutlined,
        CheckOutlined,
        CalendarOutlined,
        BellOutlined,
    },
    setup() {
        const current = ref<string[]>([]);

        return {
            current,
        };
    },
    computed: {
        username() {
            return getFullUsername(this.$user, {
                short: this.$windowWidth <= 576,
            })
        },
        tempOrdersExist() {
            return this.$store.getters.panes.length > 1
                || (this.$store.getters.panes.length === 1 && this.$store.getters.panes[0].order.dataSource.length);
        }
    }
});
</script>

<style lang="less">
@import 'NavbarComponent';
</style>