import requests
import json

from bs4 import BeautifulSoup, NavigableString


BASE_URL = 'http://www.biff.kr'


FILM_INFO_ENG = {
  '국가': 'productionCountry',
  '제작연도': 'yearOfProduction',
  '러닝타임': 'length',
  '상영포맷': 'format',
  '컬러': 'color',
  '장르': 'genre'
}


FILM_CREDIT_CAMEL = {
  'Cast': 'cast',
  'Cinematography': 'cinematography',
  'Director': 'director',
  'Editor': 'editor',
  'Music': 'music',
  'Producer': 'producer',
  'Production Company': 'productionCompany',
  'Production Design': 'productionDesign',
  'Screenplay': 'screenplay',
  'Sound': 'sound',
  'Story': 'story',
  'World Sales': 'worldSales'
}

def get_text(element):
  return element.text.strip()


def get_schedule(day):
  schedule_url = f'{BASE_URL}/kor/html/schedule/date.asp?day1={day}'
  response = requests.get(schedule_url)
  return response.text


def parse_schedule(text):
  soup = BeautifulSoup(text, 'html.parser')
  sch_li = soup.find_all('div', {'class': 'sch_li'})
  return [{'theater': _parse_theater_name(sch), 'times': _parse_theater_schedule(sch)} for sch in sch_li]


def _parse_theater_name(element):
  return get_text(element.find('div', {'class': 'sch_li_tit'}))


def _parse_theater_schedule(element):
  programs = element.find_all('div', {'class': 'sch_it'})
  return [_parse_time_schedule(program) for program in programs if _is_time_not_blank(program)]


def _is_time_not_blank(element):
    return element.find('p', {'class': 'time'}) is not None


def _parse_time_schedule(element):
    program_result = {}

    time = get_text(element.find('p', {'class': 'time'}))
    program_result['time'] = time

    first_content = element.find('div', {'class': 'film_tit'}).contents[0]
    if isinstance(first_content, NavigableString):
      sub_programs = element.find_all('a')
      program_result['title'] = first_content
      program_result['programs'] = [_parse_program(sub) for sub in sub_programs]
    else:
      parsed_program = _parse_program(element)
      program_result['title'] = parsed_program['title']
      program_result['programs'] = [parsed_program]

    return program_result


def _parse_program(element):
  title_kor = get_text(element.find('span', {'class': 'film_tit_kor'}))
  title_eng = get_text(element.find('span', {'class': 'film_tit_eng'}))

  if element.find('a'):
    detail_url = element.find('a').get('href')
  else:
    detail_url = element.get('href')

  detail_url = f'{BASE_URL}{detail_url}'
  raw_detail = get_detail(detail_url)
  info, desc, credit = parse_detail(title_kor, raw_detail)

  return {'title': title_kor, 'titleEng': title_eng, 'url': detail_url, 'desc': desc, 'info': info, 'credit': credit}


def get_detail(detail_url):
  response = requests.get(detail_url)
  return response.text


def parse_detail(title, text):
  soup = BeautifulSoup(text, 'html.parser')

  try:
    info_list = soup.find('div', {'class': 'pgv_film_info'}).find_all('li')
    info = _parse_film_info(info_list) 

    desc = get_text(soup.find('div', {'class': 'desc'}))

    credit_list = soup.find('ul', {'class': 'credit_list'}).find_all('li')
    credit = _parse_film_credit(credit_list)

    return info, desc, credit
  except:
    print(f'Failed to parse detail of [{title}]')
    return None, None, None


def _parse_film_info(info_list):
  info_result = {}

  for info in info_list:
    key = get_text(info.contents[0])
    value = info.contents[1].strip()

    key_eng = FILM_INFO_ENG[key]
    if key_eng == 'genre':
      value = [g.strip() for g in value.split('·')]

    info_result[key_eng] = value

  return info_result


def _parse_film_credit(credit_list):
  credit_result = {}

  for credit in credit_list:
    key = FILM_CREDIT_CAMEL[get_text(credit.find('strong')).replace(u'\xa0', u' ')]
    value = get_text(credit.find('span')).replace(u'\xa0', u' ')

    credit_result[key] = value

  return credit_result


if __name__ == '__main__':
  for i in range(3, 13):
    schedule = get_schedule(i)
    day = f'day{i:02}'
    with open(f'{day}.json', 'w', encoding='UTF-8') as f:
      json_schedule = {'date': day, 'screening': parse_schedule(schedule)}
      f.write(json.dumps(json_schedule, indent=2, ensure_ascii=False))
    print(f'Day {i} done.')
