<template>
    <div class="notification-wrapper pt-2 pb-2">
        <div class="notification d-flex flex-row justify-content-between gap-3 pt-2">
            <div class="notification-main d-flex flex-column">
                <h6 class="notification-title" v-html="title" />
                <a-divider class="m-0 pt-1 pb-1 divider inner" />
                <h6 v-if="content" class="notification-content" v-html="content" />
                <div v-else class="notification-content">
                    <slot />
                </div>
            </div>
            <div class="notification-actions d-flex">
                <close-outlined class="close" @click="closeClick" style="align-self: start"/>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {CloseOutlined} from '@ant-design/icons-vue';

export default defineComponent({
    name: "VcNotification",
    components: {
        CloseOutlined,
    },
    props: {
        title: {
            type: String as PropType<string>,
            required: true,
        },
        content: {
            type: String as PropType<string>,
            required: false,
        },
    },
    setup(props, context) {
        const closeClick = () => {
            context.emit('close');
        }

        return {
            closeClick,
        }
    }
})
</script>

<style lang="less" scoped>
@import 'NotificationComponent';
</style>