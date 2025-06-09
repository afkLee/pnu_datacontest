# 📡 산업용어 통합검색 API (backend)

**🔧 브랜치:** `backend`  
**🔗 서비스 URL:** [http://13.209.50.203/](http://13.209.50.203/)
**🔗 API 서버 주소:** http://54.180.150.211:3000

> NestJS 기반 산업·통상·금속 용어 통합검색 API 서버입니다.  
> 제13회 산업통상자원부 공공데이터 활용 아이디어 공모전 출품작의 백엔드 코드입니다.

---

## ⚙️ 기술 스택

| 역할         | 기술                                                                 |
|--------------|----------------------------------------------------------------------|
| 백엔드       | [![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com) |
| 데이터베이스 | [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org) |
| 검색엔진     | [![Elasticsearch](https://img.shields.io/badge/Elasticsearch-005571?style=for-the-badge&logo=elasticsearch&logoColor=white)](https://www.elastic.co/elasticsearch/) |
| 배포         | [![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/) + [![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://aws.amazon.com/) |

---


## 📦 API 기능 요약

- 산업/통상/금속 용어 통합 검색
- 공식 해설 또는 GPT 기반 AI 정의 생성
- 즐겨찾기 등록/조회/삭제 기능
- Elasticsearch 색인 동기화 기능

---

## 🧪 주요 API 목록

| Method | Endpoint              | 설명                          |
|--------|------------------------|-------------------------------|
| GET    | `/terms/search`        | 통합 검색 (Elasticsearch 기반) |
| POST   | `/favorites`           | 즐겨찾기 추가                  |
| GET    | `/favorites`           | 즐겨찾기 목록 조회             |
| DELETE | `/favorites`           | 즐겨찾기 삭제                  |
| POST   | `/terms/sync`          | DB → Elasticsearch 전체 색인 |
| POST   | `/terms/ask`           | GPT 기반 용어 정의 생성        |

---

## 🚀 백엔드 배포 정보

- **서버 위치**: AWS EC2 (Ubuntu 22.04)
- **배포 방식**: Docker Compose로 PostgreSQL, Elasticsearch, NestJS API 통합 실행
- **접속 주소**:  
  - API 서버: [http://54.180.150.211:3000](http://54.180.150.211:3000)  
  - Swagger 문서: [http://54.180.150.211:3000/api](http://54.180.150.211:3000/api)

> `.env` 파일은 서버 내부에만 존재하며, `docker compose up`으로 서비스가 실행됩니다.
---

## 🐳 Docker 로컬 실행 방법 (개발용)

```bash
git clone -b backend https://github.com/afkLee/pnu_datacontest.git
cd pnu_datacontest
docker compose up --build
```
---

## 🛠️ 환경변수 (.env 예시)

```env
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=terms
ELASTICSEARCH_URL=http://elasticsearch:9200
```
---

