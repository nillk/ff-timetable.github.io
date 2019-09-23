# 영화 시간표

내가 보려고 만드는 영화제 시간표 Viewer :clapper:

## Data format

데이터 파일은 일자별로 아래와 같은 형식

```
{
  date: 일자,
  screening: [
    {
      theater: 상영관,
      times: [
        {
          time: 시간,
          title: 대표제목(단편 모음인 경우 programs에 세부 정보),
          programs: [
            {
              title: 제목,
              titleEng: 영어 제목,
              url: 세부 정보 URL,
              desc: 상세 설명,
              info: {
                productionCountry: 국가,
                yearOfProduction: 제작연도,
                length: 러닝타임,
                format: 상영포맷,
                color: 컬러,
                genre: 장르
              },
              credit: {
                cast,
                cinematography,
                director,
                editor,
                music,
                producer,
                productionCompany,
                productionDesign,
                screenplay,
                sound,
                story,
                worldSales
              }
            },
            ...
          ]
        },
        ...
      ]
    },
    ...
  ]
}
```

## Gatsby

https://github.com/gatsbyjs/gatsby-starter-hello-world
