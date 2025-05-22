export function updateIndex<T>(data: T[], value: T, idx: number) {
    const clone = [...data];
    clone[idx] = value;
    return clone;
}

export function deleteIndex<T>(data: T[], idx: number) {
    const clone = [...data];
    clone.splice(idx, 1);
    return clone;
}