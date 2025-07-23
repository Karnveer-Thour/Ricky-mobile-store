import * as moment from 'moment';

// function that converts date to UTC
export const dateToUTC = (date = null) => {
  return (date ? moment(date) : moment()).utc().toDate();
};

// function that converts date of birth to age
export const birthToAge = (dateBirth: Date): number | null => {
  if (!dateBirth) return null;

  const birthMoment = moment(dateBirth);
  const today = moment();

  return today.diff(birthMoment, 'years');
};
