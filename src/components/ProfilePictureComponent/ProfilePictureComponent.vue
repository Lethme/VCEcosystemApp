<template>
    <vc-layout
        class="flex-grow-0"
        :shadow="shadow"
        :style="{width: `${width}px`, height: `${height}px`, padding: 0, borderRadius: '50%', overflow: 'hidden'}"
    >
        <a-image
            v-if="preview"
            :width="width"
            :height="height"
            :style="{ padding: 0, borderRadius: '50%', overflow: 'hidden' }"
            :src="self
                ? ($user.hasProfilePicture ? $user.getProfilePictureUrl() : $pictureFallback)
                : (uuid ? getProfilePicUrl(uuid) : $pictureFallback)"
            :preview="true"
            @click.stop
        />
        <div v-else :class="{ 'profile-picture-img': true, 'shadowed': shadow, 'd-flex': true }" :style="{
            fontSize: `${Math.round(+width / 12.5)}px`,
            background: self
                ? ($user.hasProfilePicture ? 'url(' + $user.getProfilePictureUrl() + ') center center/cover no-repeat' : 'url('+ $pictureFallback +') center center/cover no-repeat')
                : (uuid ? 'url(' + getProfilePicUrl(uuid) + ') center center/cover no-repeat' : 'url('+ $pictureFallback +') center center/cover no-repeat'),
            boxShadow: $user.hasProfilePicture ? '' : 'none'
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
import {computed, defineComponent, PropType} from "vue";
import {CameraOutlined} from "@ant-design/icons-vue";
import {fileDialog} from "file-select-dialog";
import {ApiService, UsersService} from "@/api/services";
import {Loader} from "@/utils";

export default defineComponent({
    name: "VcProfilePicture",
    components: {
        CameraOutlined,
    },
    setup() {
        return {
            ApiService,
        }
    },
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
        self: {
            type: Boolean as PropType<boolean>,
            required: false,
            default() {
                return true;
            }
        },
        uuid: {
            type: String as PropType<string>,
            required: false,
        },
        preview: {
            type: Boolean as PropType<boolean>,
            required: false,
            default() {
                return false;
            }
        },
    },
    data() {
        return {
            exception: "",
        }
    },
    methods: {
        getProfilePicUrl(uuid: string) {
            return ApiService.GetProfilePicturePath(uuid);
        },
        async selectFile(): Promise<void> {
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
        getBase64(file: File | null, callback: (base64: string) => Promise<void>): void {
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
})
</script>

<style lang="less">
@import "./ProfilePictureComponent";
</style>