<template>
    <vc-layout
        class="flex-grow-0"
        :shadow="shadow"
        :style="{width: `${width}px`, height: `${height}px`, padding: 0, borderRadius: '50%', overflow: 'hidden'}"
    >
        <div :class="{ 'profile-picture-img': true, 'shadowed': shadow }" :style="{
            fontSize: `${Math.round(+width / 12.5)}px`,
            background: $user?.hasProfilePicture ? 'url(' + $user.getProfilePictureUrl() + ') center center/cover no-repeat' : 'url('+ $pictureFallback +') center center/cover no-repeat', boxShadow: $user.hasProfilePicture ? '' : 'none'
        }">
            <div
                v-if="uploadable"
                @click="selectFile"
                class="inner-layout d-flex flex-column justify-content-center align-items-center gap-1"
            >
                <camera-outlined class="icon"/>
                <h6 class="text m-0">Upload</h6>
            </div>
        </div>
    </vc-layout>
    <a-alert
        v-if="exception"
        :message="exception"
        :after-close="() => exception = ''"
        type="error"
        closable
    />
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {CameraOutlined} from "@ant-design/icons-vue";
import {fileDialog} from "file-select-dialog";
import {UsersService} from "@/api/services";
import {Loader} from "@/utils";

export default defineComponent({
    name: "VcProfilePicture",
    props: {
        width: {
            type: String as PropType<string>,
            required: false,
            default() {
                return '200';
            },
        },
        height: {
            type: String as PropType<string>,
            required: false,
            default() {
                return '200';
            },
        },
        uploadable: {
            type: Boolean as PropType<boolean>,
            required: false,
            default() {
                return false;
            },
        },
        shadow: {
            type: Boolean as PropType<boolean>,
            required: false,
            default() {
                return true;
            },
        },
    },
    data() {
        return {
            exception: "",
        }
    },
    methods: {
        async selectFile() {
            const fileList = await fileDialog({
                accept: ['.jpg', '.png', 'jpeg'],
            });

            if (fileList && fileList.length) {
                const file = fileList.item(0);
                this.getBase64(file, async (base64) => {
                    await Loader.Use(async () => {
                        const response = await UsersService.SetProfilePicture({base64});

                        if (response.status) {
                            this.$router.go(0);
                        } else {
                            this.exception = "Upload failed";
                        }
                    });
                });
            }
        },
        getBase64(file: File | null, callback: (base64: string) => Promise<void>) {
            if (file) {
                if (file.size / 1024 / 1024 > 1) {
                    this.exception = "Image size must be up to 1mb";
                    return;
                }

                let reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function () {
                    callback.call(null, reader.result as string);
                };
                reader.onerror = function (error) {
                    console.log('Error: ', error);
                };
            }
        },
    },
    components: {
        CameraOutlined,
    },
})
</script>

<style lang="less">
@import "./ProfilePictureComponent";
</style>