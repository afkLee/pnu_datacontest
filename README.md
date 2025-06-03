# pnu_datacontest


# 산업용어 통합검색 웹서비스

> **공공데이터를 기반으로 한 산업 · 통상 · 금속 용어 통합검색 플랫폼**  
> 제13회 산업통상자원부 공공데이터 활용 아이디어 공모전 출품작

---

## 🔍 프로젝트 소개

산업 분야에 산재된 전문 용어 데이터를 하나의 플랫폼에서 통합 제공하기 위해 개발된 웹 서비스입니다.  
금속, 통상, 산업 약어 등 3개 분야의 용어를 통합 검색할 수 있으며, 다음과 같은 기능을 제공합니다:

- 분야별 용어 통합검색
- 공식 해설 및 출처 정보 제공
- 분야 필터링 (금속 / 통상 / 산업)
- 즐겨찾기 기능

> 📚 데이터 출처: 산업통상자원부 및 관련 협회에서 공개한 금속표준용어집, 통상용어집, 산업자원용어 해설집

---
## 🔗 배포 주소

👉 [http://13.209.50.203/](http://13.209.50.203/)

---

## ⚙️ 기술 스택

| 역할       | 기술                        |
|------------|-----------------------------|
| 프론트엔드 | [![Nuxt.js](https://img.shields.io/badge/Nuxt.js-00DC82?style=for-the-badge&logo=nuxt.js&logoColor=white)](https://nuxt.com)                     |
| 백엔드     | [![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com) |
| 데이터베이스 | [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org)                  |
| 배포       | [![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://aws.amazon.com)                       |

---

## 🧪 주요 API

| Method | Endpoint        | 설명                      |
|--------|------------------|---------------------------|
| GET    | `/api/v1/search` | 통합 용어 검색            |
| POST   | `/api/v1/favorites` | 즐겨찾기 등록         |
| GET    | `/api/v1/favorites` | 즐겨찾기 목록 조회     |
| DELETE | `/api/v1/favorites` | 즐겨찾기 삭제         |

[![Open in Swagger Editor](https://img.shields.io/badge/Swagger%20Editor-Open-blue?logo=swagger)](https://editor.swagger.io/?url=https://raw.githubusercontent.com/afkLee/pnu_datacontest/main/swagger.yaml)

 **Import URL**: https://raw.githubusercontent.com/afkLee/pnu_datacontest/main/swagger.yaml

---

## 🐳 Docker로 실행하기

이 프로젝트는 PostgreSQL, Elasticsearch, NestJS API로 구성되어 있으며, `docker-compose`를 통해 전체 환경을 빠르게 구축할 수 있습니다.

### 📦 서비스 구성

| 서비스         | 설명             | 주소                      |
|----------------|------------------|---------------------------|
| PostgreSQL     | 데이터베이스     | `localhost:5432`          |
| Elasticsearch  | 검색엔진         | `http://localhost:9200`   |
| NestJS API     | 백엔드 서버      | `http://localhost:3000`   |

### ▶️ 실행 명령어

```bash
docker-compose up --build
```
> 최초 실행 시 **PostgreSQL과 Elasticsearch가 완전히 기동되기까지** 수 초 ~ 수십 초가 소요될 수 있습니다.


### 🧠 Elasticsearch 색인 동기화

NestJS API가 기동된 이후에도 Elasticsearch 색인이 자동으로 동기화되지 않은 경우, 아래와 같이 **수동 요청**을 통해 색인을 생성할 수 있습니다:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
curl http://localhost:9200
```
NESTJS API 로그확인
```bash
docker logs nest-api
```
모든 컨테이너 중지 및 볼륨까지 초기화
```bash
docker-compose down -v
```
---
## 👨‍👩‍👧‍👦 팀 구성

- **문현부**: 백엔드 개발 (NestJS API, DB 설계)
- **이응재**: 프론트엔드 개발 (Nuxt.js UI 구성, DB 설계)

---
## 🗓️ 주차별 개발일정

![주차별 개발일정](./개발일정.png)




## 📈 기대효과

- 산업용어 정보의 일관성 확보 및 신뢰도 향상
- 공공데이터의 민간 활용 확산
- 검색 시간 단축과 정보 접근성 향상
- 업무/연구 생산성 증대

---

