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
  