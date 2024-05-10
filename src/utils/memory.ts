// creeps

export const SetKVInMemory = (creep: Creep, k: string, v: string) => {
    (creep.memory as { [key: string]: any })[k] = v
}

export const GetKVInMemory = (creep: Creep, k: string): string | undefined => {
    return (creep.memory as { [key: string]: any })[k] as string | undefined;
}
