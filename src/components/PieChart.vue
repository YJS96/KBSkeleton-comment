<template>
  <div class="chart-container">
    <!-- 월 선택 -->
    <div class="month">
      <select v-model="month" class="month-select">
        <option value="1">1월</option>
        <option value="2">2월</option>
        <option value="3">3월</option>
        <option value="4">4월</option>
        <option value="5">5월</option>
        <option value="6">6월</option>
      </select>
    </div>
    <!-- chart.js 캔버스 -->
    <div class="chart-frame">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
  <!-- 카테고리별 지출 비율 컴포넌트 -->
  <Percentage
    v-for="percentageObj in percentageList"
    :key="percentageObj.sumAmount"
    :category="percentageObj.category"
    :sumAmount="percentageObj.sumAmount"
    :percentage="percentageObj.percentage"
  />
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import { useHistoryStore } from '@/stores/history';

import Percentage from './Percentage.vue';

// 현재 월 초기값 설정
const date = new Date();
const month = ref(date.getMonth() + 1);

// Pinia 스토어 사용
const historyStore = useHistoryStore();
const { outcomeByCategoryAndMonth, outcomeByCategoryAndMonthWithPercentage } = historyStore;

// 선택한 월의 카테고리별 지출액 계산
const outcomeList = computed(() => outcomeByCategoryAndMonth(month.value));
// 선택한 월의 카테고리별 지출액과 비율 계산
const percentageList = computed(() => outcomeByCategoryAndMonthWithPercentage(month.value));

// Chart.js 플러그인 등록
Chart.register(...registerables);
Chart.register(ChartDataLabels);

// 차트 캔버스 참조
const chartCanvas = ref(null);
// 최초 Chart는 null로 설정
let chart = null;


// 차트 생성을 함수화
const createChart = () => {
  if (chart) {
    chart.destroy();
  }

  const ctx = chartCanvas.value.getContext('2d');

  // 차트 옵션
  // https://www.chartjs.org/docs/latest/configuration/
  chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['식비', '교통', '문화', '통신', '기타'],
      datasets: [
        {
          label: '지출액',
          data: outcomeList.value,
          backgroundColor: ['#44c4a1', '#ff553e', '#eeae55', '#64798a', '#569ddf'],
          borderColor: ['#44c4a1', '#ff553e', '#eeae55', '#64798a', '#569ddf'],
          borderWidth: 1,
          datalabels: {
            color: '#727272',
            anchor: 'end',
            align: 'end',
            offset: 2,
            font: {
              family: 'Pretendard',
              size: 14,
              weight: 500,
            },
            formatter: (value, ctx) => {
              const label = ctx.chart.data.labels[ctx.dataIndex];
              return label;
            },
          },
        },
      ],
    },
    options: {
      responsive: true,
      layout: {
        padding: {
          top: 28,
          right: 28,
          bottom: 28,
          left: 28,
        },
      },
      plugins: {
        legend: {
          display: false,
          // position: 'right',
          // labels: {
          //   color: '#727272',
          //   boxWidth: 6,
          //   boxHeight: 6,
          //   padding: 12,
          //   font: {
          //     family: 'Pretendard',
          //     size: 14,
          //     weight: 500,
          //   },
          // },
        },
        title: {
          display: false,
          text: '월별 카테고리',
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: (context) => {
              const label = context.label;
              const value = context.parsed;
              return label + ': ' + value.toLocaleString() + '원';
            },
          },
        },
      },
    },
  });
};

// 컴포넌트 마운트 시 차트 생성
onMounted(() => {
  createChart();
});

// 월 변경 시 차트 갱신
watch(month, () => {
  createChart();
});
</script>

<style scoped>
.chart-container {
  background-color: var(--white);
  height: 320px;
  margin-bottom: 16px;
}

.month {
  margin-left: 5.56%;
  font-size: 20px;
  display: flex;
  align-items: center;
}

.month-select {
  background-color: transparent;
  border: 0 none;
  outline: 0 none;
}

.chart-frame {
  max-height: 290px;
  display: flex;
  justify-content: center;
}
</style>
