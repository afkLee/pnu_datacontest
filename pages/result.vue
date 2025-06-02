<template>
    <div :class="styles.pageWrap">
        <!-- 상단 헤더 + 검색 -->
        <div :class="styles.headerBar">
            <b :class="styles.title" @click="goHome">산업 용어 통합 서비스</b>
            <input v-model="searchInput" :class="styles.searchInput" type="text" placeholder="검색어를 입력하세요"
                @keydown.enter="doSearch" autofocus />
            <button :class="styles.searchBtn" @click="doSearch">검색</button>
            <button :class="styles.favoritesBtn" @click="goFavorites">
                <span :class="styles.favoritesIcon">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="#f8c33b">
                        <path
                            d="M10 2.5L12.4721 7.42158L17.9021 8.18034L13.951 12.0456L14.9442 17.4544L10 14.75L5.05575 17.4544L6.04899 12.0456L2.09789 8.18034L7.52786 7.42158L10 2.5Z"
                            fill="#4e73df" stroke="#4e73df" stroke-width="1.3" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                </span>
                <span :class="styles.favoritesText">즐겨찾기</span>
            </button>
        </div>
        <!-- 검색 결과 헤더 -->
        <div :class="styles.resultHeader">
            <span>
                <b>{{ searchCategoryLabel }}</b>에서
                <b>‘{{ searchKeyword }}’</b>로 검색
            </span>
            <span :class="styles.resultCount">{{ cards.length }}개의 검색결과</span>
        </div>
        <!-- 결과 없음 안내 -->
        <div v-if="!loading && cards.length === 0" :class="styles.emptyBox">
            <div :class="styles.emptyText">
                <span style="color:#4e73df;">‘{{ searchKeyword }}’</span>
                <span> 에 대한 검색결과가 없습니다.</span>
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
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import styles from '~/assets/css/result.module.css'
import Star from '~/assets/icons/star.svg'
import ActiveStar from '~/assets/icons/active_star.svg'

const route = useRoute()
const router = useRouter()

const searchCategory = computed(() => route.query.category as string || 'all')
const searchKeyword = ref((route.query.keyword as string) || '')
const searchInput = ref(searchKeyword.value)

const categoryLabels = {
    all: '전체',
    metal: '금속',
    trade: '통상',
    abbreviation: '산업약어',
} as const
const searchCategoryLabel = computed(
    () => categoryLabels[searchCategory.value as keyof typeof categoryLabels] || ''
)
function goFavorites() {
    router.push('/favorites')
}

function goHome() {
    router.push('/')
}

const allCards = [
    { id: 1, title: '금속 검색', name: '철물점', reading: '[鐵物店]', desc: '쇠로 만든 여러 가지 물건을 파는 가게', isStar: false },
    { id: 2, title: '통상 검색', name: '상점', reading: '[商店]', desc: '상품을 파는 가게', isStar: false },
    { id: 3, title: '산업 약어 검색', name: '공장', reading: '[工場]', desc: '제품을 만드는 곳', isStar: false },
    { id: 4, title: '금속 검색', name: '용접기', reading: '[溶接器]', desc: '금속을 녹여 붙이는 기계', isStar: false },
]
const cards = ref([...allCards])
const loading = ref(false)

function doSearch() {
    searchKeyword.value = searchInput.value
    cards.value = allCards.filter(card =>
        card.name.includes(searchInput.value) ||
        card.desc.includes(searchInput.value)
    )
}
function toggleStar(cardId: number) {
    const card = cards.value.find(c => c.id === cardId)
    if (card) card.isStar = !card.isStar
}
</script>
