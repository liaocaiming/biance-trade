export default (len = 9): number[] => {
  return Array.from({ length: len }).map((v, k) => k + 1);
}
