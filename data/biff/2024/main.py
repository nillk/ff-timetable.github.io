import requests
import json
import urllib.parse

from bs4 import BeautifulSoup, NavigableString


BASE_URL = 'https://www.biff.kr'
YEAR = 2024

FILM_INFO_ENG = {
    '국가': 'productionCountry',
    '제작연도': 'yearOfProduction',
    '러닝타임': 'length',
    '상영포맷': 'format',
    '컬러': 'color',
    '장르': 'genre'
}

DATE_KOR = {
    '02': '수',
    '03': '목',
    '04': '금',
    '05': '토',
    '06': '일',
    '07': '월',
    '08': '화',
    '09': '수',
    '10': '목',
    '11': '금',
}


def get_text(element):
    return element.text.strip().replace('′', '\'')


def get_schedule(day):
    schedule_url = f'{BASE_URL}/kor/html/schedule/date.asp?day1={day}'
    response = requests.get(schedule_url)
    return response.text


def parse_schedule(day, text):
    soup = BeautifulSoup(text, 'html.parser')
    date = str(day).zfill(2)

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

    code = get_text(element.find('span', {'class': 'code'}))
    film_tit = element.find('div', {'class': 'film_tit'})

    if film_tit.find('div', {'class': 'pack'}):
        sub_programs = film_tit.find('div', {'class': 'pack'}).find_all('a')
        result['title'] = get_text(film_tit.find('span', {'class': 'film_tit_kor'}))
        result['grades'] = _parse_grade(element)
        result['code'] = code
        result['programs'] = [_parse_program(sub) for sub in sub_programs]
    else:
        parsed_program = _parse_program(element)
        result['title'] = parsed_program['title']
        result['grades'] = _parse_grade(element)
        result['code'] = code
        result['programs'] = [parsed_program]

    return result


def _parse_grade(element):
    grades = element.find('div', {'class': 'grade'}).find_all('span', {'class': 'ico_grade'})
    return [grade['class'][1].replace('ico_', '') for grade in grades]


def _parse_program(element):
    try:
        title_kor = get_text(element.find('span', {'class': 'film_tit_kor'}))
    except Exception as e:
        title_kor = get_text(element.find('p', {'class': 'film_tit_kor'}))

    try:
        title_eng = get_text(element.find('span', {'class': 'film_tit_eng'}))
    except Exception as e:
        title_eng = get_text(element.find('p', {'class': 'film_tit_eng'}))

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
        # desc = get_text(soup.find('p', {'class': 'box_basic'}))
        return None, None, None

    try:
        film_info_title = soup.find('div', {'class': 'film_info_title'})
        info = _parse_film_info(film_info_title)

        desc = get_text(soup.find('div', {'class': 'desc'}))

        credits = [c for c in soup.find('div', {'class': 'credits'}).find_all('li') if c != '\n']
        credit = _parse_film_credit(credits)

        return info, desc, credit
    except Exception as e:
        print(f'Failed to parse detail of [{title}]')
        print(e)
        return None, None, None


def _parse_film_info(film_info_title):
    info_result = {}

    genres = film_info_title.find_all('div', {'class': 'keywords'})
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

    for credit in credits:
        key = get_text(credit.find('strong')).replace(u'\xa0', u' ')
        value = [c.replace(u'\xa0', u' ').replace('′', '\'').strip() for c in credit.find('span').contents if c.name != 'br']

        camelCaseKey = key[0].lower() + key[1:].replace(' ', '')
        credit_result[camelCaseKey] = value

    return credit_result


if __name__ == '__main__':
    for i in range(2, 12):
        schedule = get_schedule(i)
        day = f'day{i:02}'
        with open(f'{day}.json', 'w', encoding='UTF-8') as f:
            parsed_schedule = parse_schedule(i, schedule)
            json_schedule = {'name': 'biff',
                             'year': YEAR,
                             'date': day,
                             'dateStr': parsed_schedule[0],
                             'screening': parsed_schedule[1]}
            f.write(json.dumps(json_schedule, indent=2, ensure_ascii=False))
        print(f'Day {i} done.')
