

export default function (num: string): string {
  const n = num.split('.')[0]
  if (String(n).length >= 6) {
    return `${(parseFloat(num) / Math.pow(10, 6)).toFixed(2)} m`
  }

  if (String(num).length >= 3) {
    return `${(parseFloat(num) / Math.pow(10, 3)).toFixed(2)} k`
  }

  return parseFloat(num).toFixed(2);
}