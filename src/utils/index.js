const getDataOfPrograms = (key, subKey) => programs =>
  programs
    .filter(program => program[key] && program[key][subKey])
    .flatMap(program => program[key][subKey]);

const getGenresOfPrograms = getDataOfPrograms('info', 'genre');
const getDirectorsOfPrograms = getDataOfPrograms('credit', 'director');

const getDataOfScreen = getDataOfPrograms => screen =>
  screen.times
    .filter(time => time.programs)
    .flatMap(time => getDataOfPrograms(time.programs));

const getGenresOfScreen = getDataOfScreen(getGenresOfPrograms);
const getDirectorsOfScreen = getDataOfScreen(getDirectorsOfPrograms);

export const getAllDistinctGenres = screening => {
  const allGenres = screening.flatMap(getGenresOfScreen);
  return [...new Set(allGenres)].sort();
};

export const getAllDistinctDirectors = screening => {
  const allDirectors = screening.flatMap(getDirectorsOfScreen);
  return [...new Set(allDirectors)].sort();
};

export const getAllDistinctGrades = screening => {
  const allGenres = screening.flatMap(screen =>
    screen.times.flatMap(time => time.grades.map(g => g.toUpperCase())),
  );
  return [...new Set(allGenres)].sort();
};

export const showScreen = (state, screen) =>
  (state.genre.length === 0 && state.director.length === 0) ||
  getGenresOfScreen(screen).some(g => state.genre.includes(g)) ||
  getDirectorsOfScreen(screen).some(d => state.director.includes(d));

export const showTime = (state, time) =>
  (state.genre.length === 0 && state.director.length === 0) ||
  getGenresOfPrograms(time.programs).some(g => state.genre.includes(g)) ||
  getDirectorsOfPrograms(time.programs).some(d => state.director.includes(d));
