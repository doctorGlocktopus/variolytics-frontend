export function getColor(value, max) {
  const percentage = (value / max) * 100;
  if (percentage <= 33) {
    return 'green';
  } else if (percentage <= 66) {
    return 'yellow';
  } else {
    return 'red';
  }
}
export const formatDate = (isoDateString) => {
  const date = new Date(isoDateString);
  if (!isNaN(date.getTime())) {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0'); 
      return `${day}/${month}, ${hours}:${minutes}`;
  }
  return isoDateString;
};