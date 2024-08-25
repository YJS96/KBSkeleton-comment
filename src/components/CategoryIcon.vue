<template>
  <!-- 카테고리가 '지출 전체'일 경우 해당 이미지 표시 -->
  <img
    v-if="category === '지출 전체'"
    src="/category_icon/pay.svg"
    alt="지출전체"
    :style="{ width: width + 'px' }"
  />

  <!-- 그 외의 카테고리일 경우 해당 카테고리의 이미지 표시 -->
  <img
    v-else
    :src="getCategoryImgSrc(category)"
    :alt="category"
    :style="{ width: width + 'px' }"
  />
</template>
<script setup>
import { defineProps, computed } from 'vue';
import categoryList from '@/assets/category.json';

// 컴포넌트 props 정의
const props = defineProps({
  // 카테고리 prop (필수)
  category: {
    type: String,
    required: true,
  },
  // 이미지 너비 prop (선택)
  width: {
    type: Number,
    required: false,
  },
});

// 카테고리에 따른 이미지 경로를 반환하는 computed 함수
const getCategoryImgSrc = computed(() => {
  return (category) => {
    // categoryList에서 해당 카테고리 이름과 일치하는 객체 찾기
    const found = categoryList.find((item) => item.name === category);
    // 일치하는 객체가 있으면 imgSrc 반환, 없으면 빈 문자열 반환
    return found ? found.imgSrc : '';
  };
});
</script>
<style></style>
