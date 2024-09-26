export const delay = (time: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(time)
    }, time);
  })
}

interface TItem {
  id: string
}

export const uniqArray = <T extends TItem>(array: T[]) => {
  const seen = new Set();
  const uniqueArray = array.filter(item => {
    const isDuplicate = seen.has(item.id);
    seen.add(item.id);
    return !isDuplicate;
  });
  return uniqueArray
}