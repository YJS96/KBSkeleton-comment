import { defineStore } from 'pinia';
import { reactive, computed } from 'vue';
import axios from 'axios';
import moment from 'moment';

// Pinia를 사용해 사용자 정보 스토어에 정의
export const useUserInfoStore = defineStore('userInfo', () => {
  const BASEURL = '/api/user';
  // 사용자 정보를 저장할 반응형 상태 객체
  const state = reactive({
    userInfo: [],
  });

  // 서버에 사용자 정보 요청하는 함수
  const fetchuserInfo = async () => {
    try {
      const response = await axios.get(BASEURL);
      state.userInfo = await response.data;
    } catch (err) {
      // console.log(err);
    }
  };

  // 사용자 이름 변경 요청
  const changeUsername = async (newName) => {
    try {
      const response = await axios.patch(BASEURL, {
        name: newName,
        profileImage:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyPkxMuo6NOHcNx-aO-wOo3eyVnB2oTq-ZwA&s',
        balance: 2478920,
      });
    } catch (err) {
      // console.log(err);
    }
  };

  // 사용자 정보 가져오는 초기 실행
  fetchuserInfo();
  // 컴포넌트에서 사용할 수 있는 userInfo 값
  const userInfo = computed(() => state.userInfo);

  // 외부에서 사용할 함수 및 값
  return { fetchuserInfo, changeUsername, userInfo };
});

// Pinia를 사용해 활동 정보 스토어에 정의
export const useHistoryStore = defineStore('history', () => {
  const BASEURL = '/api/history';
  const state = reactive({
    historyList: [],
    selectedDate: '',
    selectedDateHistory: {},
  });

  // 리스트 받아오기
  const fetchHistory = async () => {
    try {
      const response = await axios.get(BASEURL);
      state.historyList = await response.data;
      // console.log(response.data);
    } catch (err) {
      // console.log(err);
    }
  };

  // 홈 페이지에서 사용할 함수들
  // 내역 추가
  const postHistory = async (obj) => {
    try {
      const response = await axios.post(BASEURL, obj);
      // console.log(response);
      fetchHistory();
    } catch (err) {
      // console.log(err);
    }
  };

  // 월 전체 수입
  const totalIncomeByMonth = (month) => {
    const targetMonth = String(month).padStart(2, '0');
    const incomeList = state.historyList.filter(
      (history) =>
        moment(history.date).format('MM') === targetMonth &&
        history.type === 'income'
    );

    return incomeList.reduce((sum, history) => sum + Number(history.amount), 0);
  };

  // 월 전체 지출
  const totalOutcomeByMonth = (month) => {
    const targetMonth = String(month).padStart(2, '0');
    const incomeList = state.historyList.filter(
      (history) =>
        moment(history.date).format('MM') === targetMonth &&
        history.type === 'outcome'
    );

    return incomeList.reduce((sum, history) => sum + Number(history.amount), 0);
  };

  // 월 최근 5개 내역
  const recentHistoryByMonth = (month) => {
    const targetMonth = String(month).padStart(2, '0');
    const filteredHistory = state.historyList.filter(
      (history) => moment(history.date).format('MM') === targetMonth
    );

    const sortedHistory = filteredHistory.sort((a, b) =>
      moment(b.date).diff(moment(a.date))
    );

    return sortedHistory.slice(0, 5);
  };

  // 월 단일 최대 금액
  const maxOutcomeByMonth = (month) => {
    const targetMonth = String(month).padStart(2, '0');
    const filteredOutcome = state.historyList.filter(
      (history) =>
        moment(history.date).format('MM') === targetMonth &&
        history.type === 'outcome'
    );

    if (filteredOutcome.length === 0) {
      return null;
    }

    const maxOutcome = filteredOutcome.reduce((max, history) =>
      history.amount > max.amount ? history : max
    );

    return maxOutcome;
  };

  // 날짜별 지출
  const totalByDaily = () => {
    // const groupedByDate = {
    //   outcome: [],
    //   income: [],
    // };

    const groupedByDate = [];

    state.historyList.forEach((item) => {
      // console.log(item);

      // 날짜를 키로 사용
      const date = item.date;

      // 그룹이 없을 경우, 초기화
      if (!groupedByDate[date]) {
        groupedByDate[date] = [];
      }

      // type별로 분류
      groupedByDate[date].push(item);
    });

    // 결과를 콘솔에 출력 (선택 사항)
    // console.log(groupedByDate);

    return groupedByDate;
  };

  // 가장 많은 지출처
  const mostFrequentMemoByMonth = (month) => {
    const targetMonth = String(month).padStart(2, '0');
    const filteredOutcome = state.historyList.filter(
      (history) =>
        moment(history.date).format('MM') === targetMonth &&
        history.type === 'outcome'
    );

    if (filteredOutcome.length === 0) {
      return null;
    }

    const memoCount = filteredOutcome.reduce((count, history) => {
      const { memo } = history;
      count[memo] = (count[memo] || 0) + 1;
      return count;
    }, {});

    const maxCount = Math.max(...Object.values(memoCount));
    const mostFrequentMemo = Object.keys(memoCount).find(
      (memo) => memoCount[memo] === maxCount
    );

    return mostFrequentMemo;
  };

  // 가장 많은 카테고리
  const mostFrequentCategoryByMonth = (month) => {
    const targetMonth = String(month).padStart(2, '0');
    const filteredOutcome = state.historyList.filter(
      (history) =>
        moment(history.date).format('MM') === targetMonth &&
        history.type === 'outcome'
    );

    if (filteredOutcome.length === 0) {
      return null;
    }

    const categoryCount = filteredOutcome.reduce((count, history) => {
      const { category } = history;
      count[category] = (count[category] || 0) + 1;
      return count;
    }, {});

    const maxCount = Math.max(...Object.values(categoryCount));
    const mostFrequentCategory = Object.keys(categoryCount).find(
      (category) => categoryCount[category] === maxCount
    );

    return mostFrequentCategory;
  };

  // 차트 페이지에서 사용할 함수들
  // 파이 차트
  // 월별 카테고리별 합 배열 반환
  const outcomeByCategoryAndMonth = (month) => {
    const targetMonth = String(month).padStart(2, '0');
    const filteredOutcome = state.historyList.filter(
      (history) =>
        moment(history.date).format('MM') === targetMonth &&
        history.type === 'outcome'
    );

    const categories = ['식비', '교통', '문화', '통신', '기타'];
    const outcomeByCategory = categories.map((category) => {
      const categoryOutcome = filteredOutcome
        .filter((history) => history.category === category)
        .reduce((sum, history) => sum + history.amount, 0);
      return categoryOutcome;
    });

    return outcomeByCategory;
  };

  // 카테고리별 지출 합계, 퍼센트 반환
  const outcomeByCategoryAndMonthWithPercentage = (month) => {
    const targetMonth = String(month).padStart(2, '0');
    const filteredOutcome = state.historyList.filter(
      (history) =>
        moment(history.date).format('MM') === targetMonth &&
        history.type === 'outcome'
    );

    const totalOutcome = filteredOutcome.reduce(
      (sum, history) => sum + history.amount,
      0
    );

    const categoryOutcome = filteredOutcome.reduce((acc, history) => {
      const { category, amount } = history;
      acc[category] = (acc[category] || 0) + amount;
      return acc;
    }, {});

    const outcomeData = Object.entries(categoryOutcome).map(
      ([category, sumAmount]) => ({
        category,
        sumAmount,
        percentage: parseFloat(((sumAmount / totalOutcome) * 100).toFixed(2)),
      })
    );

    outcomeData.sort((a, b) => b.sumAmount - a.sumAmount);

    return outcomeData;
  };

  // 1~6월 카테고리별 누적 금액
  const getAmountsByMonthAndCategory = () => {
    const categories = ['식비', '교통', '문화', '통신', '기타'];
    const months = [1, 2, 3, 4, 5, 6];

    const result = {
      income: [],
      outcome: [],
      ...categories.reduce((acc, category) => {
        acc[category] = [];
        return acc;
      }, {}),
    };

    months.forEach((month) => {
      const targetMonth = String(month).padStart(2, '0');
      const filteredHistory = state.historyList.filter(
        (history) => moment(history.date).format('MM') === targetMonth
      );

      const incomeAmount = filteredHistory
        .filter((history) => history.type === 'income')
        .reduce((sum, history) => sum + history.amount, 0);

      const outcomeAmount = filteredHistory
        .filter((history) => history.type === 'outcome')
        .reduce((sum, history) => sum + history.amount, 0);

      result.income.push(incomeAmount);
      result.outcome.push(outcomeAmount);

      categories.forEach((category) => {
        const categoryAmount = filteredHistory
          .filter(
            (history) =>
              history.type === 'outcome' && history.category === category
          )
          .reduce((sum, history) => sum + history.amount, 0);

        result[category].push(categoryAmount);
      });
    });

    return result;
  };

  // 지정 월과 이전 월의 카테고리별 지출 증감, 퍼센트 반환
  const getComparisonWithPreviousMonth = (month) => {
    const targetMonth = String(month).padStart(2, '0');
    const previousMonth = String(month - 1).padStart(2, '0');

    const filteredTargetMonth = state.historyList.filter(
      (history) => moment(history.date).format('MM') === targetMonth
    );

    const filteredPreviousMonth = state.historyList.filter(
      (history) => moment(history.date).format('MM') === previousMonth
    );

    const categories = ['식비', '교통', '문화', '통신', '기타'];

    const getCount = (data, type, category = null) =>
      data.filter(
        (history) =>
          history.type === type &&
          (category ? history.category === category : true)
      ).length;

    const getSum = (data, type, category = null) =>
      data
        .filter(
          (history) =>
            history.type === type &&
            (category ? history.category === category : true)
        )
        .reduce((sum, history) => sum + history.amount, 0);

    const getGrowthRate = (targetValue, previousValue) =>
      previousValue === 0
        ? targetValue === 0
          ? 0
          : Infinity
        : parseFloat(
            (((targetValue - previousValue) / previousValue) * 100).toFixed(2)
          );

    const incomeCountDiff =
      getCount(filteredTargetMonth, 'income') -
      getCount(filteredPreviousMonth, 'income');
    const incomeSumDiff =
      getSum(filteredTargetMonth, 'income') -
      getSum(filteredPreviousMonth, 'income');
    const incomeGrowthRate = getGrowthRate(
      getSum(filteredTargetMonth, 'income'),
      getSum(filteredPreviousMonth, 'income')
    );

    const outcomeCountDiff =
      getCount(filteredTargetMonth, 'outcome') -
      getCount(filteredPreviousMonth, 'outcome');
    const outcomeSumDiff =
      getSum(filteredTargetMonth, 'outcome') -
      getSum(filteredPreviousMonth, 'outcome');
    const outcomeGrowthRate = getGrowthRate(
      getSum(filteredTargetMonth, 'outcome'),
      getSum(filteredPreviousMonth, 'outcome')
    );

    const categoryComparison = categories.map((category) => ({
      category,
      countDiff:
        getCount(filteredTargetMonth, 'outcome', category) -
        getCount(filteredPreviousMonth, 'outcome', category),
      sumDiff:
        getSum(filteredTargetMonth, 'outcome', category) -
        getSum(filteredPreviousMonth, 'outcome', category),
      growthRate: getGrowthRate(
        getSum(filteredTargetMonth, 'outcome', category),
        getSum(filteredPreviousMonth, 'outcome', category)
      ),
    }));

    return {
      incomeCountDiff,
      incomeSumDiff,
      incomeGrowthRate,
      outcomeCountDiff,
      outcomeSumDiff,
      outcomeGrowthRate,
      categoryComparison,
    };
  };

  // 특정 날짜의 거래 내역, 수입/지출 합계
  const getHistoryByDate = (date) => {
    const filteredHistory = state.historyList.filter(
      (history) =>
        moment(history.date).format('YYYY-MM-DD') ===
        moment(date).format('YYYY-MM-DD')
    );

    const incomeSum = filteredHistory
      .filter((history) => history.type === 'income')
      .reduce((sum, history) => sum + Number(history.amount), 0);

    const outcomeSum = filteredHistory
      .filter((history) => history.type === 'outcome')
      .reduce((sum, history) => sum + Number(history.amount), 0);

    state.selectedDate = date;
    state.selectedDateHistory = {
      history: filteredHistory,
      incomeSum,
      outcomeSum,
    };
  };

  // 공통 사용 유틸리티 함수
  // 숫자 세개 단위 콤마
  const addComma = (val) => {
    return val.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
  };

  // 수입일 경우 + 기호, 지출일 경우 - 기호 + 콤마
  const addSymbolComma = (val, type) => {
    const newVal = val
      .toString()
      .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
    if (type === 'income') {
      return `+${newVal}`;
    } else {
      return `-${newVal}`;
    }
  };

  // 숫자가 양수일 경우 +, 음수일경우 -, 콤마추가
  const addPlusComma = (num) => {
    let newNum = num.toString();
    if (num >= 0) {
      return `+${newNum.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')}`;
    } else {
      return newNum.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
    }
  };

  // 초기 데이터 로드
  fetchHistory();

  // 컴포넌트에서 사용할 수 있는 계산된 값
  const historyList = computed(() => state.historyList);
  const selectedDate = computed(() => state.selectedDate);
  const selectedDateHistory = computed(() => state.selectedDateHistory);

  // 외부에서 사용할 함수 및 값
  return {
    historyList,
    selectedDate,
    selectedDateHistory,
    postHistory,
    addComma,
    totalByDaily,
    addSymbolComma,
    fetchHistory,
    totalIncomeByMonth,
    totalOutcomeByMonth,
    recentHistoryByMonth,
    maxOutcomeByMonth,
    mostFrequentMemoByMonth,
    mostFrequentCategoryByMonth,
    outcomeByCategoryAndMonth,
    outcomeByCategoryAndMonthWithPercentage,
    addPlusComma,
    getAmountsByMonthAndCategory,
    getComparisonWithPreviousMonth,
    getHistoryByDate,
  };
});
