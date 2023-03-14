<template>
    <div class="notification-wrapper pt-2 pb-2" @mouseenter="handleNotificationHover" @mouseleave="handleNotificationLeave">
        <div class="notification d-flex flex-row justify-content-between gap-3 pt-2">
            <div class="notification-main d-flex flex-column">
                <div class="notification-title-wrapper d-flex flex-row gap-2 justify-content-between">
                    <h6 class="notification-title d-flex flex-row gap-2 align-items-center">
                        <span v-if="!notification.read" class="read-state-dot" />
                        {{ notification.title }}
                    </h6>
                    <h6
                        class="date"
                        style="color: rgb(140, 140, 140)"
                        v-html="(new Date(notification.createdAt)).toLocaleDateString($locale.locale, { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })"
                    />
                </div>
                <a-divider class="m-0 pt-1 pb-1 divider inner"/>
                <h6 v-if="notification.content" class="notification-content" style="text-align: justify" v-html="notification.content"/>
                <div v-else class="notification-content">
                    <slot/>
                </div>
            </div>
            <div class="notification-actions d-flex p-2 pt-0 pb-0">
                <delete-outlined class="close" @click="handleRemoveClick" style="align-self: start"/>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {DeleteOutlined} from '@ant-design/icons-vue';
import {Notification} from "@/api/services/types";

export default defineComponent({
    name: "VcNotification",
    components: {
        DeleteOutlined,
    },
    props: {
        notification: {
            type: Object as PropType<Notification>,
            required: true,
        }
    },
    emits: [
        "remove",
        "hover",
        "leave",
    ],
    setup(props, context) {
        const handleRemoveClick = () => {
            context.emit('remove');
        }

        const handleNotificationHover = () => {
            context.emit('hover');
        }

        const handleNotificationLeave = () => {
            context.emit('leave');
        }

        return {
            handleRemoveClick,
            handleNotificationHover,
            handleNotificationLeave,
        }
    }
})
</script>

<style lang="less" scoped>
@import 'NotificationComponent';
</style>