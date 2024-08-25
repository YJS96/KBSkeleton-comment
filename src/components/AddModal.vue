<template>
  <!-- 모달 배경 오버레이 -->
  <div class="overlay">
    <!-- 모달 컨테이너 -->
    <div class="modal-container">
      <!-- 모달 닫기 버튼 -->
      <div class="close-frame">
        <i @click="closeModal" class="fa-solid fa-xmark"></i>
      </div>

      <!-- 유형 선택 버튼 -->
      <div class="button-container">
        <div class="button-label">유형</div>
        <div class="type-button-frame">
          <div
            @click="handleType('income')"
            :class="
              selectedType === 'income' ? 'button button-selected' : 'button'
            "
          >
            수입
          </div>
          <div
            @click="handleType('outcome')"
            :class="
              selectedType === 'outcome' ? 'button button-selected' : 'button'
            "
          >
            지출
          </div>
        </div>
      </div>

      <!-- 날짜 선택 입력 -->
      <div class="button-container">
        <div class="button-label">날짜</div>
        <div class="select-box">
          <input class="date-input" type="date" v-model="selectedDate" />
        </div>
      </div>

      <!-- 금액 입력 -->
      <div class="button-container">
        <div class="button-label">금액</div>
        <div class="select-box">
          <input class="memo-input" type="number" v-model="selectedAmount" />
        </div>
      </div>

      <!-- 메모 입력 -->
      <div class="button-container">
        <div class="button-label">메모</div>
        <div class="select-box">
          <input class="memo-input" type="text" v-model="selectedMemo" />
        </div>
      </div>

      <!-- 카테고리 선택 (지출일 경우에만 표시) -->
      <div v-if="selectedType === 'outcome'" class="button-container">
        <div class="button-label">카테고리</div>
        <div class="select-box">
          <select
            name="category"
            class="category-select"
            v-model="selectedCategory"
          >
            <option value="식비">식비</option>
            <option value="교통">교통</option>
            <option value="문화">문화</option>
            <option value="교육">교육</option>
            <option value="통신">통신</option>
            <option value="기타">기타</option>
          </select>
        </div>
      </div>

      <!-- 추가 버튼 -->
      <div @click="addHistory" class="add-button">추가</div>
    </div>
  </div>
</template>

<script setup>
import moment from 'moment';
import { ref, defineEmits } from 'vue';

import { useHistoryStore } from '@/stores/history';

// 모달 닫기 이벤트 emit
const emit = defineEmits(['close-modal']);

// 모달 닫기 함수
const closeModal = () => {
  emit('close-modal', false);
};

// Pinia 스토어 사용
const historyState = useHistoryStore();

// 스토어의 postHistory 함수 가져오기
const { postHistory } = historyState;

// 현재 날짜 가져오기
const date = moment();

// 선택한 값 상태 변수
const selectedType = ref('income');
const selectedAmount = ref();
const selectedMemo = ref('');
const selectedCategory = ref('수입');
const selectedDate = ref(date.format('YYYY-MM-DD'));

// 유형 선택 핸들러 함수
const handleType = (type) => {
  selectedType.value = type;
  if (type === 'income') {
    selectedCategory.value = '수입';
  }
};

// 내역 추가 함수
const addHistory = () => {
  // 서버로 전송할 데이터 객체 생성
  const toSend = {
    memo: selectedMemo.value,
    category: selectedCategory.value,
    type: selectedType.value,
    amount: selectedAmount.value,
    date: selectedDate.value,
    done: true,
  };
  // 스토어의 postHistory 함수 호출하여 내역 추가
  postHistory(toSend);
  // 모달 닫기
  closeModal();
};
</script>

<style scoped>
.overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 3;
  background-color: rgba(0, 0, 0, 0.4);

  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-container {
  position: relative;
  background-color: var(--white);
  width: 80%;
  box-shadow: 0px 4px 8px -2px rgba(0, 0, 0, 0.1), 0px 2px 4px -2px rgba(0.06);
  border-radius: 8px;
  padding: 16px;
}

.close-frame {
  width: 100%;
  text-align: end;
  font-size: 20px;
}

.button-container {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
}

.button-label {
  font-size: 12px;
  color: var(--dark-gray);
  font-weight: 400;
  margin-bottom: 4px;
}

.type-button-frame {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.button {
  width: 100%;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  border: 1px solid var(--dark-gray);
  border-radius: 10px;
}

.button-selected {
  border: 1px solid var(--green);
  background-color: var(--green);
  color: var(--white);
}

.date-input {
  width: 100%;
  height: 34px;
  border: none;
  border-radius: 10px;
  padding: 0 12px;
  font-size: 14px;
  color: var(--dark-gray);
  display: flex;
  align-items: center;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='date']::-webkit-calendar-picker-indicator {
  position: absolute;
  right: 12px;
}

.select-box {
  position: relative;
  width: 100%;
  height: 36px;
  border-radius: 10px;
  border: 1px solid var(--dark-gray);
}

.category-select {
  width: calc(100% - 8px);
  height: 100%;
  background-color: transparent;
  border: 0 none;
  outline: 0 none;
  padding: 0 12px;
  position: relative;
  z-index: 3;
  font-size: 14px;
  color: var(--dark-gray);
}

.memo-input {
  width: 100%;
  height: 36px;
  background-color: transparent;
  border: 0 none;
  outline: 0 none;
  padding: 0 12px;
  position: relative;
  z-index: 3;
  font-size: 14px;
  color: var(--dark-gray);
}

.add-button {
  margin-top: 40px;
  width: 100%;
  height: 40px;
  background-color: var(--green);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  color: var(--white);
  font-size: 16px;
}
</style>
