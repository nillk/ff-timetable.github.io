# 영화 시간표

내가 보려고 만드는 영화제 시간표 Viewer :clapper:

## Data format

데이터 파일은 요일별로 아래와 같은 형식

```
{
  영화관: {
    시간: {
      title: 대표 제목 (단편 모음인 경우를 위해),
      programs: [{
        title: 제목,
        title_en: 영어 제목,
        url: 세부 정보 페이지 URL,
        desc: 상세 설명,
        info: {
          국가, 제작연도, 러닝타임, 상영포맷, 컬러
        },
        credit: {
          Director, Producer, Cast, Screenplay, Production Company
        }
      },
      ...]
    },
    ...
  },
  ...
}
```
