export type State = {
  data: Array<number>
  readonly index: [number | null, number | null],
  sorted: boolean[],
  is_swap: boolean,
  is_end: boolean,
};

export function sort(arr: number[]): Array<State> {
  const length = arr.length;
  const tmp: Array<State> = [];
  const sorted = new Array<boolean>(arr.length);
  let is_end = false;
  tmp.push({
    data: [...arr],
    index: [null, null],
    sorted: [...sorted],
    is_swap: false,
    is_end
  })
  for (let i = length - 1; i > 1; i--) {
    for (let j = 0; j < i; ++j) {
      let is_swap = false;
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        is_swap = true;
      }

      tmp.push({
        data: [...arr],
        index: [j, j + 1],
        sorted: [...sorted],
        is_swap,
        is_end
      })
    }
    sorted[i] = true;
  }

  tmp[tmp.length - 1].is_end = true;
  return tmp;
}