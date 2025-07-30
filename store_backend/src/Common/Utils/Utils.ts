import * as moment from 'moment';
import { unlink } from 'fs';

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

export function deleteFile(path: string) {
  unlink(path, (err) => {
    if (err) console.error('Failed to delete file:', err);
    else console.log('CSV file deleted:', path);
  });
}

