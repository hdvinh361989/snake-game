export function getRandomItem(arr: Array<any>): any {
  return arr[Math.floor(Math.random() * arr.length)];
}
