<template>
  <!-- 그림자 효과가 있는 박스 컨테이너 -->
  <div class="shadow-box" :style="{ height: height + 'px' }">
    <!-- 슬롯을 사용하여 컴포넌트 내부에 컨텐츠 삽입 -->
    <slot></slot>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

// 컴포넌트 props 정의
const props = defineProps({
  // 박스의 높이 prop (기본값: 172)
  height: {
    type: Number,
    required: false,
  },
});
</script>

<style scoped>
.shadow-box {
  position: relative;
  background-color: var(--white);
  width: 100%;
  /* height: 100%; */
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.04);
  border-radius: 10px;
  padding: 16px;
  margin-top: 16px;
}
</style>
