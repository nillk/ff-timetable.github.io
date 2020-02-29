import requests
import json

from bs4 import BeautifulSoup, NavigableString


GRADE_INFO = {
  '전체관람가': 'G',
  '12세관람가': '12',
  '15세관람가': '15',
  '청소년관람불가': '18',
}


def get_text(element):
  return element.text.strip()


def get_schedule():
    response = requests.get('http://www.sipff.kr/m/m_01.asp')
    response.encoding = None

    soup = BeautifulSoup(response.text, 'html.parser')
    all_tables = soup.find('div', {'id': 'sub_content'}).find('table').find_all('table')

    schedule = {}

    for table in all_tables[:-1]:
      all_tr = table.find_all('tr')
      theater = get_text(all_tr[1].find('strong'))

      for tr in all_tr[3:]:
        showtime = tr.find_all('td')

        if tr.find('td').has_attr('rowspan') or len(tr.find_all('td')) > 4:
          date_str = get_text(tr.find('td').find('strong'))
          date = 'day' + date_str.split('(')[0]
          showtime = tr.find_all('td')[1:]
          if date not in schedule:
            schedule[date] = { 'name': 'sipff', 'year': 2019, 'date': date, 'dateStr': date_str, 'screening': [] }

        if len(showtime) > 3:
          showtime = parse_showtime(showtime)
          is_find = False
          for screen in schedule[date]['screening']:
            if screen['theater'] == theater:
              screen['times'].append(showtime)
              is_find= True
              break
          if not is_find:
            schedule[date]['screening'].append({'theater': theater, 'times': [showtime]})

    return schedule

def parse_showtime(td_list):
  time = get_text(td_list[0].find('strong'))
  title, title_eng, grades, programs = parse_program(td_list[1])

  return {
    'time': time,
    'title': title,
    'titleEng': title_eng,
    'grades': grades,
    'programs': programs
  }


def parse_program(program):
  title, title_eng = split_title(get_text(program.find('a')))
  grades = []
  programs = []

  if len(program.find_all('p')) > 1 or (len(program.find_all('p')) == 1 and len(program.find('p').find_all('a')) > 1):
    sub_programs = program.find_all('p')[-1].find_all('a')
    for sub in sub_programs:
      url = full_url(sub.get('href'))
      grade, detail = get_program_detail(url)
      grades.append(grade)
      programs.append(detail)
  else:
    url = full_url(program.find('a').get('href'))
    grade, detail = get_program_detail(url)
    grades.append(grade)
    programs.append(detail)

  return title, title_eng, grades, programs


def full_url(url):
  if not url.startswith('http'):
    url = 'http://www.sipff.kr/p/view.asp?' + url
  return url


def get_program_detail(url):
  if url == 'http://www.sipff.kr/p/view.asp?#':
    return None, {}

  response = requests.get(url)
  response.encoding = None

  soup = BeautifulSoup(response.text, 'html.parser')
  program_category = get_text(soup.find('div', {'class': 'title'}))

  if '개막식' in program_category or '폐막식' in program_category:
    return None, {}

  if '개막작' in program_category:
    url = 'http://www.sipff.kr/p/view.asp?goods_idx=2114&page=1&goods_admin_code=&top_division=504&top_division_title=&middle_division=505&middle_division_title=&bottom_division=&bottom_division_title=&Cate_code=&c_ret01=&c_ret02=&search_division=&search_text=&URL='
    response = requests.get(url)
    response.encoding = None

    soup = BeautifulSoup(response.text, 'html.parser')

  content = soup.find('div', {'id': 'sub_content'}).find('table').find('table')
  details = content.find('table').find('tr').find_all('td')[3].find('table').find_all('tr')

  title, title_eng = get_text(details[0].find('span', {'class': 'pro_ttl'})).split(' / ')
  director = get_text(details[1].find_all('td')[1])
  year_of_production, movie_format, color, length = get_text(details[2].find_all('td')[1]).split('┃')
  grade = GRADE_INFO.get(get_text(details[6].find_all('td')[1]), get_text(details[6].find_all('td')[1]))

  desc = get_text(content.find('td', {'class': 'pd_tb10'}))

  return grade, {
    'title': title.strip(),
    'titleEng': title_eng.strip(),
    'url': url.strip(),
    'desc': desc.strip(),
    'info': {
      'yearOfProduction': year_of_production.strip(),
      'length': length.strip(),
      'format': movie_format.strip(),
      'color': color.strip(),
      'genre': [program_category.strip()]
    },
    'credit': {
      'director': director.strip()
    }
  }


def split_title(title):
  if title.startswith('120BPM'):
    return '120BPM', '120 Beats Per Minute'

  for i, c in enumerate(title):
      if i > 2 and ord('a') <= ord(c.lower()) <= ord('z'):
        title_ko = title[:i].strip()
        if title_ko.endswith('-'):
          title_ko = title_ko[:-1].strip()
        title_en = title[i:]
        return title_ko, title_en


if __name__ == '__main__':
  all_schedule = get_schedule()
  for day, sch in all_schedule.items():
    with open(f'day{int(day):02}.json', 'w', encoding='UTF-8') as f:
      f.write(json.dumps(sch, indent=2, ensure_ascii=False))
    print(f'Day {day} done.')
