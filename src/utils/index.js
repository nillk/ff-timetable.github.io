const DATA_INFO = {
  director: 'credit',
  cast: 'credit',
  genre: 'info',
};

const getDataOfPrograms = key => programs =>
  programs
    .filter(program => program[DATA_INFO[key]] && program[DATA_INFO[key]][key])
    .flatMap(program => program[DATA_INFO[key]][key]);

const getDataOfScreen = key => screen =>
  screen.times
    .filter(time => time.programs)
    .flatMap(time => getDataOfPrograms(key)(time.programs));

export const getAllDistinctData = (key, screening) => {
  const allDatas = screening.flatMap(getDataOfScreen(key));
  return [...new Set(allDatas)].sort();
};

export const getAllDistinctGrades = screening => {
  const allGenres = screening.flatMap(screen =>
    screen.times.flatMap(time => time.grades.map(g => g.toUpperCase())),
  );
  return [...new Set(allGenres)].sort();
};

const isFilterEmpty = state =>
  Object.values(state).every(value => value.length === 0);
const checkPrograms = (key, state, screen) =>
  getDataOfPrograms(key)(screen).some(d => state[key].includes(d));
const checkScreen = (key, state, screen) =>
  getDataOfScreen(key)(screen).some(d => state[key].includes(d));

export const showScreen = (state, screen) =>
  isFilterEmpty(state) ||
  Object.keys(state).some(key => checkScreen(key, state, screen));

export const showTime = (state, time) =>
  isFilterEmpty(state) ||
  Object.keys(state).some(key => checkPrograms(key, state, time.programs));
