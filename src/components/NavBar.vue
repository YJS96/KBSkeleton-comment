<template>
  <div class="navbar-frame">
    <!-- 각 탭에 대한 반복 렌더링 -->
    <div class="tab-frame" v-for="(tab, index) in navTabs" :key="index">
      <!-- 탭 경로에 대한 라우터 링크 -->
      <router-link :to="tab.path">
        <!-- 현재 경로와 탭 경로가 일치하면 'tab-active' 클래스 추가 -->
        <div :class="$route.path === tab.path ? 'tab tab-active' : 'tab'">
          <!-- 탭 아이콘 -->
          <i :class="tab.icon"></i>
          <!-- 탭 이름 -->
          <span>{{ tab.name }}</span>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 내비게이션 탭 데이터
const navTabs = ref([
  {
    path: '/',
    name: '홈',
    icon: 'fa-solid fa-house',
  },
  {
    path: '/statistics',
    name: '달력',
    icon: 'fa-solid fa-calendar',
  },
  {
    path: '/charts',
    name: '통계',
    icon: 'fa-solid fa-chart-pie',
  },
  {
    path: '/mypage',
    name: '계정',
    icon: 'fa-solid fa-user',
  },
]);
</script>

<style scoped>
.navbar-frame {
  position: absolute;
  padding: 0 4%;
  bottom: 0;
  width: 100%;
  height: 76px;
  display: flex;
  border-top: 1px solid var(--gray);
  background-color: var(--white);
  z-index: 2;
}

.tab-frame {
  position: relative;
  width: calc(100% / 4);
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tab {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: var(--nav-gray);
}

.tab span {
  font-size: 12px;
  font-weight: 500;
  margin-top: 4px;
  margin-bottom: 12px;
}

.tab-active {
  color: var(--black);
}

a {
  text-decoration: none;
}
</style>
