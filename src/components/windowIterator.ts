export function* windowIterator<T>(array: T[] ): Generator<[T, T|undefined, T|undefined]> {
    if (array.length === 0) {
        return;
    }

    for (let i = 0; i < array.length; i++) {
        yield [array[i], array[i - 1], array[i + 1]];
    }
}