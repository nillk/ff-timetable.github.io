import requests
import json

from bs4 import BeautifulSoup, NavigableString


BASE_URL = 'http://www.biff.kr'


def get_schedule(day):
  schedule_url = f'{BASE_URL}/kor/html/schedule/date.asp?day1={day}'
  response = requests.get(schedule_url)
  return response.text


def parse_schedule(text):
  soup = BeautifulSoup(text, 'html.parser')
  sch_li = soup.find_all('div', {'class': 'sch_li'})
  return {_parse_theater_name(sch): _parse_theater_schedule(sch) for sch in sch_li}


def _parse_theater_name(element):
  return element.find('div', {'class': 'sch_li_tit'}).text.strip()


def _parse_theater_schedule(element):
  programs = element.find_all('div', {'class': 'sch_it'})

  result = {}
  for program in programs:
    time = program.find('p', {'class': 'time'})
    if time:
      time = time.text
      first_content = program.find('div', {'class': 'film_tit'}).contents[0]
      if isinstance(first_content, NavigableString):
        sub_programs = program.find_all('a')
        result[time] = {'title': first_content, 'programs': [_parse_program(sub) for sub in sub_programs]}
      else:
        parsed_program = _parse_program(program)
        result[time] = {'title': parsed_program['title'], 'programs': [parsed_program]}

  return result


def _parse_program(element):
  title_kor = element.find('span', {'class': 'film_tit_kor'}).text
  title_en = element.find('span', {'class': 'film_tit_eng'}).text

  if element.find('a'):
    detail_url = element.find('a').get('href')
  else:
    detail_url = element.get('href')

  detail_url = f'{BASE_URL}{detail_url}'
  raw_detail = get_detail(detail_url)
  info, desc, credit = parse_detail(title_kor, raw_detail)

  return {'title': title_kor, 'title_en': title_en, 'url': detail_url, 'desc': desc, 'info': info, 'credit': credit}


def get_detail(detail_url):
  response = requests.get(detail_url, headers={'User-Agent': 'Mozilla/5.0'})
  return response.text


def parse_detail(title, text):
  soup = BeautifulSoup(text, 'html.parser')

  try:
    info_list = soup.find('div', {'class': 'pgv_film_info'}).find_all('li', {'class', 'en'})
    info = {info.contents[0].text.strip(): info.contents[1].strip() for info in info_list}

    desc = soup.find('div', {'class': 'desc'}).text.strip()

    credit_list = soup.find('ul', {'class': 'credit_list'}).find_all('li')
    credit = {credit.find('strong').text.strip().replace(u'\xa0', u' ') : credit.find('span').text.strip().replace(u'\xa0', u' ') for credit in credit_list}

    return info, desc, credit
  except:
    print(f'Failed to parse detail of [{title}]')
    return None, None, None


if __name__ == '__main__':
  for i in range(3, 13):
    schedule = get_schedule(i)
    day = f'day{i:02}'
    with open(f'{day}.json', 'w', encoding='UTF-8') as f:
      json_schedule = {day: parse_schedule(schedule)}
      f.write(json.dumps(json_schedule, indent=2, ensure_ascii=False))
    print(f'Day {i} done.')
