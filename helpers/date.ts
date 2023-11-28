const year = new Date().getFullYear();

const quarterMap = {
  1: { startDate: `${year}-01-01`, endDate: `${year}-03-31` },
  2: { startDate: `${year}-04-01`, endDate: `${year}-06-30` },
  3: { startDate: `${year}-07-01`, endDate: `${year}-09-30` },
  4: { startDate: `${year}-10-01`, endDate: `${year}-12-31` },
};

const calcQuarter = () => {
  const month = new Date().getMonth();
  const quarter = Math.ceil(month / 3);
  return quarter;
};

export const getQuarterDate = () => {
  const quarter = calcQuarter();
  return quarterMap[quarter as keyof typeof quarterMap];
};
