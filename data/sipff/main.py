import requests
import json

from bs4 import BeautifulSoup, NavigableString


BASE_URL = 'http://www.sipff.kr/m/m_01.asp'


def get_text(element):
    return element.text.strip()


def get_schedule():
    response = requests.get(BASE_URL)
    response.encoding = None
    return response.text


def parse_schedule(text):
    soup = BeautifulSoup(text, 'html.parser')
    all_tables = soup.find('div', {'id': 'sub_content'}).find('table').find_all('table')

    schedule = {}

    for table in all_tables[:-1]:
      all_tr = table.find_all('tr')
      theater = get_text(all_tr[1].find('strong'))

      for tr in all_tr[3:]:
        showtime = tr.find_all('td')

        if tr.find('td').has_attr('rowspan') or len(tr.find_all('td')) > 4:
          date_str = get_text(tr.find('td').find('strong'))
          date = date_str.split('(')[0]
          showtime = tr.find_all('td')[1:]
          if date not in schedule:
            schedule[date] = { 'date': date, 'dateStr': date_str, 'screening': [] }

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
  title, title_eng, programs = parse_program(td_list[1])
  length = get_text(td_list[2])[:-1]
  grade = get_text(td_list[3])
  return {
    'time': time,
    'title': title,
    'titleEng': title_eng,
    'grades': [grade],
    'programs': programs
  }


def parse_program(program):
  title, title_eng = split_title(get_text(program.find('a')))
  programs = []

  if len(program.find_all('p')) > 1 or (len(program.find_all('p')) == 1 and len(program.find('p').find_all('a')) > 1):
    sub_programs = program.find_all('p')[-1].find_all('a')
    for sub in sub_programs:
      sub_title = get_text(sub)[1:-1]
      url = sub.get('href')
      programs.append({ 'title': sub_title, 'titleEng': title_eng, 'url': url})
  else:
    url = program.find('a').get('href')
    programs.append({ 'title': title, 'titleEng': title_eng, 'url': url })

  return title, title_eng, programs


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
  formatted_schedule = parse_schedule(all_schedule)
  for day, sch in formatted_schedule.items():
    with open(f'day{int(day):02}.json', 'w', encoding='UTF-8') as f:
      f.write(json.dumps(sch, indent=2, ensure_ascii=False))
    print(f'Day {day} done.')
