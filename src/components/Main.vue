<template>
  <!-- 메인 프레임 -->
  <div :class="padded ? 'padded main-frame ' : 'main-frame'">
    <!-- 슬롯을 사용하여 컴포넌트 내부에 컨텐츠 삽입 -->
    <slot></slot>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

// 컴포넌트 props 정의
const props = defineProps({
  // padded prop (기본값: false)
  padded: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
.main-frame {
  background-color: var(--background);
  position: absolute;
  width: 100%;
  height: calc(100% - 76px);
  overflow-x: hidden;
  overflow-y: scroll;
}

.padded {
  padding: 0px 5.56%;
}
</style>
