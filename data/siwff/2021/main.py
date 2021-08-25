import requests
import json

from bs4 import BeautifulSoup, NavigableString


BASE_URL = 'http://www.siwff.or.kr/kor/addon/00000001'


DATE_DAY = {
    27: '금',
    28: '토',
    29: '일',
    30: '월',
    31: '화',
}


GRADE_IMG = {
    'ico_gv': 'GV',
    'ico_event': 'PE',
    'B': 'NE',
    'C': 'N',
    'D': 'KE',
    'E': 'KN',
    'A': 'E',
    'F': 'ND',
    'ico_G': 'G',
    'ico_12': '12',
    'ico_15': '15',
    'ico_18': '18',
}


def get_text(element):
    return element.text.strip()


def get_schedule(day):
    schedule_url = f'{BASE_URL}/schedule_view.asp?QueryStep=1&QueryDate=2021-08-{day}'
    response = requests.get(schedule_url)
    return response.text


def parse_schedule(text):
    soup = BeautifulSoup(text, 'html.parser')

    sch_li = soup.find_all('div', {'class': 'sch_li'})
    screening = [{'theater': _parse_theater_name(sch),
                  'times': _parse_theater_schedule(sch)} for sch in sch_li]

    return screening


def _parse_theater_name(element):
    theater_name = get_text(element.find('span', {'class': 'sch_li_tit_sub'}))
    if '상암월드컵' in theater_name:
        theater_name = theater_name.replace('상암월드컵', '상암 월드컵')

    return theater_name

def _parse_theater_schedule(element):
    programs = element.find_all('div', {'class': 'sch_it'})
    return [_parse_time_schedule(p) for p in programs if _is_time_not_blank(p)]


def _is_time_not_blank(element):
    return element.find('p', {'class': 'time'}) is not None


def _parse_time_schedule(element):
    result = {}

    time = get_text(element.find('p', {'class': 'time'}))
    result['time'] = time.split('-')[0]

    title_kor = get_text(element.find('span', {'class': 'film_tit_kor'}))

    if element.find('div', {'class': 'pack'}):
        sub_programs = element.find('div', {'class': 'pack'}).find_all('li')
        result['title'] = title_kor
        result['grades'] = _parse_grade(element)
        result['programs'] = [_parse_program(
            get_text(sub), sub) for sub in sub_programs]
    else:
        parsed_program = _parse_program(title_kor, element)
        result['title'] = parsed_program['title']
        result['grades'] = _parse_grade(element)
        result['programs'] = [parsed_program]

    return result


def _parse_grade(element):
    grades_img = element.find('div', {'class', 'grade'}).find_all('img')
    grades_src = [grade['src'].split(
        '/')[-1].replace('.png', '').replace('_x2', '') for grade in grades_img]
    return [GRADE_IMG[src] for src in grades_src if src != 'gogogo']


def _parse_program(title, element):
    if element.find('a'):
        detail_url = element.find('a').get('href')
    else:
        detail_url = element.get('href')

    detail_url = f'{BASE_URL}/{detail_url}'
    raw_detail = get_detail(detail_url)
    title_eng, info, desc, credit = parse_detail(title, raw_detail)

    return {'title': title,
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

    try:
        title_eng = get_text(
            soup.find('h1', {'class': 'tit_movie'}).find('span'))

        film_info = soup.find('div', {'class': 'film_info_top'})
        info = _parse_film_info(title, film_info)

        synopsis = get_text(soup.find('div', {'class': 'synopsis'}).find('div', {'class': 'desc'}))
        pg_note = soup.find('div', {'class': 'pg_note'}).find('div', {'class': 'desc'})
        pg_note_text = '<br/>'.join([get_text(d) for d in pg_note.find_all('p')]) if len(pg_note.find_all(
            'p')) > 0 else get_text(pg_note)

        desc = f"""<p><h5><strong>SYNOPSIS</strong></h5>{synopsis}</p><p><h5><strong>PROGRAM NOTE</strong></h5>{pg_note_text}</p>"""

        film_credit = soup.find_all('div', {'class': 'container'})[4]
        credit = _parse_film_credit(title, film_credit)

        return title_eng, info, desc, credit
    except Exception as e:
        print(f'Failed to parse detail of [{title}]')
        print(e)
        return None, None, None, None


def _parse_film_info(title, film_info):
    info_list = film_info.find('ul').find_all('li')

    premier = film_info.find('strong', {'class': 'premiere'})
    keywords = [keyword.strip() for keyword in get_text(
        film_info.find('p', {'class': 'keyword'})).split('/')]

    genre = []

    if premier:
        genre.append(get_text(premier))
    genre.extend(keywords)

    if len(info_list) < 5:
        print(info_list)
        raise Exception('Film info length is not 7')

    # genre.insert(0, get_text(info_list[6]))

    return {
        'productionCountry': get_text(info_list[0]).split(', '),
        'yearOfProduction': get_text(info_list[1]),
        'length': get_text(info_list[2]),
        'color': get_text(info_list[4]),
        'genre': genre
    }


def _parse_film_credit(title, film_credit):
    credit_result = {}

    # print(film_credit)
    directors = _parse_directors(film_credit)
    credit_result['director'] = directors

    credit_container = film_credit.find('div', {'class': 'credit'})
    if credit_container:
        for credit in credit_container.find_all('li'):
            key = get_text(credit.find('strong')).replace(' ', '')
            key = key[0].lower() + key[1:]
            value = get_text(credit.find('span')).split(', ') if key in [
                'cast', 'producer'] else get_text(credit.find('span'))

            credit_result[key] = value

    credit_sales = film_credit.find('div', {'class': 'credit sales2'})
    if credit_sales is not None:
        worldSales = credit_sales.find('div', {'class': 'desc'}).find('p')
        credit_result['worldSales'] = get_text(worldSales)

    return credit_result


def _parse_directors(film_credit):
    directors_kor = get_text(film_credit.find('div', {'class': 'dir_name'}).find(
        'strong', {'class': 'kor'})).split(', ')
    directors_eng = get_text(film_credit.find(
        'div', {'class': 'dir_name'}).find('span', {'class': 'mt10'})).split(', ')
    if len(directors_kor) is not len(directors_eng):
        raise Exception('The eng/kor name of directors length are not same')

    return [director[0] + ' ' + director[1]
            for director in zip(directors_kor, directors_eng)]


if __name__ == '__main__':
    for i in range(27, 32):
        schedule = get_schedule(i)
        day = f'day{i}'
        with open(f'{day}.json', 'w', encoding='UTF-8') as f:
            parsed_schedule = parse_schedule(schedule)
            json_schedule = {'name': 'siwff',
                             'year': 2021,
                             'date': day,
                             'dateStr': f'2021.08.{i} {DATE_DAY[i]}',
                             'screening': parsed_schedule}
            f.write(json.dumps(json_schedule, indent=2, ensure_ascii=False))
        print(f'Day {i} done.')
