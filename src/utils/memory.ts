// creeps func


import _ from "lodash";

export const SaveCreepPropertiesInMemory = (creepMemory: CreepMemory, p: Partial<CreepProperty>) => {
    _.assign(creepMemory, p);
}

export const GetCreepPropertiesInMemory = (creepMemory: CreepMemory): Partial<CreepProperty> => {
    return _.pickBy(creepMemory, (_, k) => {
        return __defaultCreepProperty.hasOwnProperty(k)
    })
}


interface CreepProperty {
    role: string
    working: boolean
    path: PathStep[]
}


const __defaultCreepProperty: CreepProperty = {
    role: '',
    working: false,
    path: []
}