import "typescript";

declare module "@oozcitak/util/lib/FixedSizeSet" {
  interface FixedSizeSet<T> {
    keys(): SetIterator<T>;
    values(): SetIterator<T>;
    entries(): SetIterator<[T, T]>;
    [Symbol.iterator](): SetIterator<T>;
  }
}
