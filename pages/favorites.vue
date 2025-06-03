<template>
  <div :class="styles.pageWrap">
    <!-- 상단 헤더 + 검색 -->
    <div :class="styles.headerBar">
      <b :class="styles.title" @click="goHome">산업 용어 통합 서비스</b>
      <input v-model="searchInput" :class="styles.searchInput" type="text" placeholder="검색어를 입력하세요"
        @keydown.enter="doSearch" autofocus />
      <button :class="styles.searchBtn" @click="doSearch">검색</button>
    </div>
    <!-- 검색 결과 헤더 -->
    <div :class="styles.resultHeader">
      <span>
        내 즐겨찾기

      </span>
      <span :class="styles.resultCount">{{ cards.length }}개</span>
    </div>
    <!-- 결과 없음 안내 -->
    <div v-if="!loading && cards.length === 0" :class="styles.emptyBox">
      <div :class="styles.emptyText">
        <span>내 즐겨찾기가 없습니다.</span>
      </div>
      <div :class="styles.goHome" @click="goHome">메인화면으로 돌아가기</div>
      <div :class="styles.emptyDivider"></div>
      <div :class="styles.emptyGuide">
        <ul :class="styles.guideList">
          <li>검색어의 단어수를 줄이거나, 보다 일반적인 단어로 검색해 보세요.</li>
          <li>두 단어 이상의 키워드로 검색하신 경우, 정확하게 띄어쓰기를 한 후 검색해 보세요.</li>
          <li>키워드에 있는 특수문자를 뺀 후 검색해 보세요.</li>
        </ul>
      </div>
    </div>
    <!-- 카드 리스트 -->
    <div :class="styles.cardList">
      <div v-for="card in cards" :key="card.id" :class="styles.searchCardWrapper">
        <div :class="styles.searchCardTitle">{{ card.title }}</div>
        <div :class="styles.divider"></div>
        <div :class="styles.searchCardBody">
          <div :class="styles.searchResultBox">
            <div :class="styles.termHeader">
              <div :class="styles.termName">{{ card.name }}</div>
              <div :class="styles.termReading">{{ card.reading }}</div>
            </div>
            <div :class="styles.termDescription">
              <ul :class="styles.termList">
                <li>{{ card.desc }}</li>
              </ul>
            </div>
          </div>
          <div :class="styles.starIconWrapper" @click="toggleStar(card.id)" style="cursor:pointer;">
            <component :is="card.isStar ? ActiveStar : Star" :class="styles.searchCardIcon" />
          </div>
        </div>
      </div>
    </div>
    <div :class="styles.footer">
      <span>서비스 이용 약관</span>
      <span :class="styles.footerDot">·</span>
      <span>개인정보 처리 방침</span>
      <span :class="styles.footerDot">·</span>
      <span>문의하기</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import styles from '~/assets/css/result.module.css'
import Star from '~/assets/icons/star.svg'
import ActiveStar from '~/assets/icons/active_star.svg'

// userId 준비: 없으면 랜덤 생성
function generateRandomId(length = 16) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
let uid = localStorage.getItem('userId') || ''
if (!uid) {
  uid = generateRandomId(16)
  localStorage.setItem('userId', uid)
}
const userId = ref(uid)

const router = useRouter()
const searchInput = ref('')
const searchKeyword = ref('')
const cards = ref<any[]>([])
const cardsOriginal = ref<any[]>([]) // 전체 즐겨찾기 원본
const loading = ref(false)

// 즐겨찾기 목록 불러오기
async function fetchFavorites() {
  loading.value = true
  try {
    const res = await fetch(`http://54.180.150.211:3000/favorites?userId=${userId.value}`)
    const data = await res.json()
    // API 데이터 가공해서 cards에 저장
    const mapped = Array.isArray(data)
      ? data.map((card: any) => ({
          id: card.id,
          title: card.category === 'abbreviation' ? '산업약어' : card.category,
          name: card.term,
          reading: [card.abbreviation, card.termEn].filter(Boolean).join(' | '),
          desc: card.definition,
          isStar: true, // 즐겨찾기라서 무조건 true
        }))
      : []
    cards.value = mapped
    cardsOriginal.value = mapped // 원본 저장
  } catch (e) {
    cards.value = []
    cardsOriginal.value = []
  } finally {
    loading.value = false
  }
}

// 검색어로 필터링 (API 안씀)
function doSearch() {
  searchKeyword.value = searchInput.value
  if (!searchInput.value) {
    // 검색어 없으면 전체 보여줌
    cards.value = cardsOriginal.value
    return
  }
  const keyword = searchInput.value.toLowerCase()
  cards.value = cardsOriginal.value.filter(card =>
    (card.name && card.name.toLowerCase().includes(keyword)) ||
    (card.desc && card.desc.toLowerCase().includes(keyword)) ||
    (card.reading && card.reading.toLowerCase().includes(keyword)) ||
    (card.title && card.title.toLowerCase().includes(keyword))
  )
}

// 즐겨찾기 해제 (DELETE)
async function toggleStar(cardId: number) {
  try {
    await fetch('http://54.180.150.211:3000/favorites', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: userId.value, termId: cardId }),
    })
    // 성공시 목록 다시 불러오기
    fetchFavorites()
  } catch (e) {
    // 실패시 별도 처리
  }
}

function goHome() {
  router.push('/')
}

onMounted(() => {
  fetchFavorites()
})

</script>


