<template>
  <Main>
    <!-- 상단 탭 선택 헤더 -->
    <div class="head-bar-frame">
      <div class="head-bar">
        <div class="tab-selector">
          <!-- 월간 탭 -->
          <div
            :class="selectedTab === 'left' ? 'tab tab-selected' : 'tab'"
            @click="tabHandler('left')"
          >
            월간
          </div>
          <!-- 월별 탭 -->
          <div
            :class="selectedTab === 'right' ? 'tab tab-selected' : 'tab'"
            @click="tabHandler('right')"
          >
            월별
          </div>
        </div>
      </div>
    </div>
    <!-- 선택된 탭에 따라 차트 컴포넌트 표시 -->
    <PieChart v-if="selectedTab === 'left'" />
    <LineChart v-else />
  </Main>
</template>

<script setup>
import Main from '@/components/Main.vue';
import PieChart from '@/components/PieChart.vue';
import LineChart from '@/components/LineChart.vue';
import { ref } from 'vue';

// 선택된 탭 상태
const selectedTab = ref('left');

// 탭 선택 변경 함수
const tabHandler = (tab) => {
  selectedTab.value = tab;
};
</script>

<style scoped>
.head-bar-frame {
  background-color: var(--white);
  padding: 16px 0 8px 0;
}

.head-bar {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tab-selector {
  position: relative;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2px;
  font-size: 16px;
  border: 1px solid var(--gray);
  border-radius: 6px;
  padding: 12px 8px;
}

.tab {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 8px;
  border-radius: 4px;
}

.tab-selected {
  background-color: var(--nav-gray);
}
</style>
