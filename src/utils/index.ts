import { v4 as uuidv4 } from 'uuid';

export const generateUUID = () => {
  return uuidv4();
};

export const getDaysInMonth = (currentDate: Date) =>
  new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
