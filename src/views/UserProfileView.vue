<template>
  <div class="test d-flex justify-content-center">
    <vc-layout class="flex-grow-0" :style="{width: '200px', height: '200px', padding: 0, borderRadius: '50%', overflow: 'hidden'}">
      <div class="profile-picture-img" :style="{ background: hasProfilePicture ? 'url(' + $user.getProfilePictureUrl() + ') center center/cover no-repeat' : 'url('+ $pictureFallback +') center center/cover no-repeat', boxShadow: hasProfilePicture ? '' : 'none' }">
        <div class="inner-layout d-flex flex-column justify-content-center align-items-center gap-1">
          <camera-outlined class="icon" />
          <h6 class="text m-0">Upload</h6>
        </div>
      </div>
    </vc-layout>
  </div>
</template>

<script lang="ts">
import {UsersService} from "@/api/services";
import {User} from "@/api/services/types";
import {defineComponent, onMounted, ref, watch} from "vue";
import {CameraOutlined} from "@ant-design/icons-vue";
import {useStore} from "vuex";

export default defineComponent({
  components: {
    CameraOutlined,
  },
  setup() {
    const store = useStore();
    const hasProfilePicture = ref<boolean>(false);
    const checkProfilePicture = async () => {
      const user: User = store.getters.userInfo;

      if (user) {
        hasProfilePicture.value = await UsersService.HasProfilePicture(user.uuid);
      }
    }

    onMounted(() => checkProfilePicture());
    watch(() => store.getters.userInfo, () => {
      checkProfilePicture();
    });

    return {
      hasProfilePicture,
      checkProfilePicture,
    };
  },
});
</script>

<style lang="less" scoped>
.profile-picture-img {
  width: 100%;
  height: 100%;

  border-radius: 50%;
  box-shadow: 0px 0px 20px 4px rgba(0, 0, 0, 0.5) inset;

  .inner-layout {
    width: 100%;
    height: 100%;

    border-radius: 50%;

    opacity: 0;
    background: none;
    transition: all .2s ease;

    &:hover,
    &:active {
      cursor: pointer;
      opacity: 1;
      background: rgba(0, 0, 0, .5);
      //box-shadow: inset 0px 10px 10px 0px rgba(0, 0, 0, .8);
    }

    & .text {
      font-size: 1.5em;
    }

    & .icon {
      font-size: 4em;
    }

    * {
      color: #F0F0F0;
    }
  }
}
</style>