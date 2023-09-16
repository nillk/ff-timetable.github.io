import requests
import json
import urllib.parse

from bs4 import BeautifulSoup, NavigableString


BASE_URL = 'https://www.biff.kr'
YEAR = 2023

FILM_INFO_ENG = {
    '국가': 'productionCountry',
    '제작연도': 'yearOfProduction',
    '러닝타임': 'length',
    '상영포맷': 'format',
    '컬러': 'color',
    '장르': 'genre'
}

DATE_KOR = {
    '04': '수',
    '05': '목',
    '06': '금',
    '07': '토',
    '08': '일',
    '09': '월',
    '10': '화',
    '11': '수',
    '12': '목',
    '13': '금',
}


def get_text(element):
    return element.text.strip()


def get_schedule(day):
    schedule_url = f'{BASE_URL}/kor/html/schedule/date.asp?day1={day}'
    response = requests.get(schedule_url)
    return response.text


def parse_schedule(text):
    soup = BeautifulSoup(text, 'html.parser')
    date = get_text(soup.find('h3', {'class': 'tit_schedule'}).find('span', {'class': 'en'})).split('.')[-1].strip()

    full_date = f"{YEAR}.10.{date} {DATE_KOR[date]}"

    sch_li = soup.find_all('div', {'class': 'sch_li'})
    screening = [{'theater': _parse_theater_name(sch),
                  'times': _parse_theater_schedule(sch)} for sch in sch_li]

    return full_date, screening


def _parse_theater_name(element):
    return get_text(element.find('div', {'class': 'sch_li_tit'}))


def _parse_theater_schedule(element):
    programs = element.find_all('div', {'class': 'sch_it'})
    return [_parse_time_schedule(p) for p in programs if _is_time_not_blank(p)]


def _is_time_not_blank(element):
    return element.find('p', {'class': 'time'}) is not None


def _parse_time_schedule(element):
    result = {}

    time = get_text(element.find('p', {'class': 'time'}))
    result['time'] = time

    film_tit = element.find('div', {'class': 'film_tit'})
    if film_tit.find('div', {'class': 'pack'}):
        sub_programs = film_tit.find('div', {'class': 'pack'}).find_all('a')
        result['title'] = get_text(film_tit.find('span', {'class': 'film_tit_kor'}))
        result['grades'] = _parse_grade(element)
        result['programs'] = [_parse_program(sub) for sub in sub_programs]
    else:
        parsed_program = _parse_program(element)
        result['title'] = parsed_program['title']
        result['grades'] = _parse_grade(element)
        result['programs'] = [parsed_program]

    return result


def _parse_grade(element):
    grades = element.find('div', {'class': 'grade'}).find_all('span', {'class': 'ico_grade'})
    return [grade['class'][1].replace('ico_', '') for grade in grades]


def _parse_program(element):
    title_kor = get_text(element.find('span', {'class': 'film_tit_kor'}))
    title_eng = get_text(element.find('span', {'class': 'film_tit_eng'}))

    if element.find('a'):
        detail_url = element.find('a').get('href')
    else:
        detail_url = element.get('href')

    detail_url = urllib.parse.urljoin(base=BASE_URL, url=detail_url)
    raw_detail = get_detail(detail_url)
    info, desc, credit = parse_detail(title_kor, raw_detail)

    return {'title': title_kor,
            'titleEng': title_eng,
            'url': detail_url,
            'desc': desc,
            'info': info,
            'credit': credit}


def get_detail(detail_url):
    response = requests.get(detail_url)
    return response.text


def parse_detail(title, text):
    soup = BeautifulSoup(text, 'html.parser')

    if title.startswith("액터스 하우스") or title.startswith("[마스터 클래스"):
        desc = get_text(soup.find('p', {'class': 'box_basic'}))
        return None, desc, None

    try:
        film_info_title = soup.find('div', {'class': 'film_info_title'})
        info = _parse_film_info(film_info_title)

        desc = get_text(soup.find('div', {'class': 'desc'}))

        credits = [c for c in soup.find('div', {'class': 'credits'}).find('dl') if c != '\n']
        credit = _parse_film_credit(credits)

        return info, desc, credit
    except Exception as e:
        print(f'Failed to parse detail of [{title}]')
        print(e)
        return None, None, None


def _parse_film_info(film_info_title):
    info_result = {}

    genres = film_info_title.find('ul', {'class': 'film_tit_thema'}).find_all('li')
    genres = [get_text(g).strip() for g in genres]

    info_result['genre'] = genres

    for info in film_info_title.find('div', {'class', 'film_info'}).find_all('li'):
        info_contents = info.contents[1:] if len(info.contents) > 2 else info.contents
        key = get_text(info_contents[0])
        value = info_contents[1].strip()

        key_eng = FILM_INFO_ENG[key]

        if key_eng == "productionCountry":
            value = [v.strip() for v in value.split("/")]

        info_result[key_eng] = value

    return info_result


def _parse_film_credit(credits):
    credit_result = {}

    prev_key = ''

    for i in range(0, len(credits), 2):
        key = get_text(credits[i]).replace(u'\xa0', u' ').replace(' ', '')
        value = get_text(credits[i+1]).replace(u'\xa0', u' ')

        key = key[0].lower() + key[1:] if len(key) > 1 else prev_key

        if key in ["director", "producer", "cast"]:  # editor
            value = [v.strip() for v in value.split(",") if v.strip()]

        if key == prev_key:
            credit_result[key] += f', {value}'
        else:
            credit_result[key] = value

        prev_key = key

    return credit_result


if __name__ == '__main__':
    for i in range(4, 14):
        schedule = get_schedule(i)
        day = f'day{i:02}'
        with open(f'{day}.json', 'w', encoding='UTF-8') as f:
            parsed_schedule = parse_schedule(schedule)
            json_schedule = {'name': 'biff',
                             'year': YEAR,
                             'date': day,
                             'dateStr': parsed_schedule[0],
                             'screening': parsed_schedule[1]}
            f.write(json.dumps(json_schedule, indent=2, ensure_ascii=False))
        print(f'Day {i} done.')
