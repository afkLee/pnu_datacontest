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
                <div :class="styles.searchCardTitle">{{ card.category }} 검색</div>
                <div :class="styles.divider"></div>
                <div :class="styles.searchCardBody">
                    <div :class="styles.searchResultBox">
                        <div :class="styles.termHeader">
                            <div :class="styles.termName">{{ card.term }}</div>
                            <div :class="styles.termReading">{{ card.abbreviation }}{{ card.termEn ? ` | ${card.termEn}`
                                : '' }}</div>
                        </div>
                        <div :class="styles.termDescription">
                            <ul :class="styles.termList">
                                <li>{{ card.definition }}</li>
                                <li v-if="card.source" style="color:#aaa;font-size:11px;margin-top:4px;">출처: {{
                                    card.source }}</li>
                            </ul>
                        </div>
                    </div>
                    <div :class="styles.starIconWrapper" @click="toggleStar(card.id)" style="cursor:pointer;">
                        <component :is="card.isFavorite ? ActiveStar : Star" :class="styles.searchCardIcon" />
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
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import styles from '~/assets/css/result.module.css'
import Star from '~/assets/icons/star.svg'
import ActiveStar from '~/assets/icons/active_star.svg'

const route = useRoute()
const router = useRouter()

function generateRandomId(length = 16) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

let uid = localStorage.getItem('userId') || '';
if (!uid) {
    uid = generateRandomId(16);
    localStorage.setItem('userId', uid);
}
const userId = ref(uid);
const searchCategory = ref((route.query.category as string) || 'all')
const searchKeyword = ref((route.query.keyword as string) || '')
const searchInput = ref(searchKeyword.value)

const loading = ref(false)
const cards = ref<any[]>([])

const categoryLabels = {
    all: '전체',
    metal: '금속',
    trade: '통상',
    abbreviation: '산업약어',  // UI 표기용
} as const

const apiCategoryMap = {
    all: undefined,           // 실제 요청시 undefined면 파라미터 안보냄
    metal: '금속',
    trade: '통상',
    abbreviation: '산업',     // API 요청용
} as const

const searchCategoryLabel = computed(
    () => categoryLabels[searchCategory.value as keyof typeof categoryLabels] || ''
)

async function doSearch() {
    loading.value = true
    try {
        const params = new URLSearchParams()
        params.append('query', searchInput.value)
        // all이 아닐 때만 카테고리 추가
        const apiCat = apiCategoryMap[searchCategory.value as keyof typeof apiCategoryMap]
        if (apiCat) params.append('category', apiCat)
        params.append('userId', userId.value)
        const url = `http://54.180.150.211:3000/terms/search?${params.toString()}`
        console.log(url);
        const res = await fetch(url, { method: 'GET' })
        const data = await res.json()
        cards.value = Array.isArray(data) ? data : []
    } catch (e) {
        cards.value = []
    } finally {
        loading.value = false
        searchKeyword.value = searchInput.value
    }
}

// 페이지 진입시 최초 1회, 쿼리 파라미터 변경시마다 재검색
watch(
    () => [route.query.category, route.query.keyword],
    ([cat, keyword]) => {
        searchCategory.value = (cat as string) || 'all'
        searchInput.value = (keyword as string) || ''
        doSearch()
    },
    { immediate: true }
)

function goFavorites() {
    router.push('/favorites')
}
function goHome() {
    router.push('/')
}

// 즐겨찾기 토글 (API 연동)
async function toggleStar(termId: number) {
    const card = cards.value.find((c) => c.id === termId)
    if (!card) return
    // 즐겨찾기 추가
    if (!card.isFavorite) {
        try {
            const res = await fetch('http://54.180.150.211:3000/favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: userId.value,
                    termId
                })
            })
            if (res.ok) card.isFavorite = true
        } catch (e) { /* error 핸들 가능 */ }
    }
    // 즐겨찾기 삭제
    else {
        try {
            const res = await fetch(
                `http://54.180.150.211:3000/favorites?userId=${userId.value}&termId=${termId}`,
                {
                    method: 'DELETE',
                }
            )

            if (res.ok) card.isFavorite = false
        } catch (e) { /* error 핸들 가능 */ }
    }
}
</script>
