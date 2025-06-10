<template>
    <div :class="styles.frameParent">
        <div :class="styles.headerBar">
            <b :class="styles.b1">산업 용어 통합 서비스</b>
            <button :class="styles.favBtn" @click="goFavorites">
            <span :class="styles.favIcon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                        d="M10 2.5L12.4721 7.42158L17.9021 8.18034L13.951 12.0456L14.9442 17.4544L10 14.75L5.05575 17.4544L6.04899 12.0456L2.09789 8.18034L7.52786 7.42158L10 2.5Z"
                        fill="#4e73df" stroke="#4e73df" stroke-width="1.3" stroke-linecap="round"
                        stroke-linejoin="round" />
                </svg>
            </span>
            <span :class="styles.favText">즐겨찾기</span>
            </button>
        </div>

        <div :class="styles.frameGroup">
            <div :class="styles.parent">
                <b :class="styles.b">산업 용어 통합 검색</b>
                <div :class="styles.div">산업 현장의 모든 전문 용어를 한번에 빠르고 정확하게 검색하세요</div>
            </div>
            <div :class="styles.searchBarWrap">
                <input v-model="searchKeyword" :class="styles.searchInput" type="text" placeholder="산업 용어를 검색하세요"
                    @keydown.enter="search" />
                <button :class="styles.searchBtn" @click="search">
                    검색
                </button>
            </div>
        </div>

        <!-- 카테고리 영역 -->
        <div :class="styles.frameDiv">
            <div v-for="category in categories" :key="category.value" :class="[
                styles.categoryCircle,
                selectedCategory === category.value ? styles.active : ''
            ]" @click="selectCategory(category.value)">
                <div :class="styles.categoryIcon">
                    <component :is="selectedCategory === category.value ? category.activeIcon : category.icon" />
                </div>
                <div :class="styles.div3" :style="{ color: selectedCategory === category.value ? '#4e73df' : '#333' }">
                    {{ category.label }}
                </div>
            </div>

        </div>

        <div :class="styles.group">
            <div :class="styles.div7">서비스 이용 약관</div>
            <div :class="styles.div8">·</div>
            <div :class="styles.div7">개인정보 처리 방침</div>
            <div :class="styles.div8">·</div>
            <div :class="styles.div7">문의하기</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import styles from '~/assets/css/index.module.css'
import AllSvg from '~/assets/icons/all.svg'
import ActiveAllSvg from '~/assets/icons/active_all.svg'
import MetalSvg from '~/assets/icons/metal.svg'
import ActiveMetalSvg from '~/assets/icons/active_metal.svg'
import TradeSvg from '~/assets/icons/trade.svg'
import ActiveTradeSvg from '~/assets/icons/active_trade.svg'
import AbbreviationSvg from '~/assets/icons/abbreviation.svg'
import ActiveAbbreviationSvg from '~/assets/icons/active_abbreviation.svg'
import { useRouter } from 'vue-router'

const router = useRouter()

type CategoryValue = 'all' | 'metal' | 'trade' | 'abbreviation'

interface Category {
    label: string
    value: CategoryValue
    icon: any
    activeIcon: any
}
function goFavorites() {
    router.push('/favorites')
}

// 카테고리 배열 정의 (아이콘 포함)
const categories: Category[] = [
    { label: '전체', value: 'all', icon: AllSvg, activeIcon: ActiveAllSvg },
    { label: '금속', value: 'metal', icon: MetalSvg, activeIcon: ActiveMetalSvg },
    { label: '통상', value: 'trade', icon: TradeSvg, activeIcon: ActiveTradeSvg },
    { label: '산업약어', value: 'abbreviation', icon: AbbreviationSvg, activeIcon: ActiveAbbreviationSvg },
]
const selectedCategory = ref<CategoryValue>('all')
const searchKeyword = ref('')

// 카테고리 선택
function selectCategory(value: CategoryValue) {
    selectedCategory.value = value
}

// 검색 버튼/엔터 클릭 시 result로 이동
function search() {
    router.push({
        path: '/result',
        query: {
            category: selectedCategory.value,
            keyword: searchKeyword.value,
        },
    })
}
</script>
