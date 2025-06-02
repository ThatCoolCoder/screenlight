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

export function validateMultiple(conditions: Array<string | null>) {
    return conditions.filter(x => x != null)[0] ?? null;
}