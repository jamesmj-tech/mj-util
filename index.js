/**
 * Return index of array if result is match with criteria else return -1
 * @param list
 * @param criteria => {fieldName1: fieldValue1, fieldName2: fieldValue2, ...}
 * @return {number}
 */
export function findIndex(list = [], criteria = {}, ignoreDataType, ignoreCase, isContains) {
    let index = -1;
    for(let i = 0; i < list.length; i++) {
        const isItemFound = Object.keys(criteria).every((criteriaKey) => {
            let listValue = list[i][criteriaKey];
            let criteriaValue = criteria[criteriaKey];
            if (ignoreDataType && listValue && criteriaValue) {
                listValue = listValue.toString();
                criteriaValue = criteriaValue.toString();
            }

            if (ignoreCase) {
                listValue = listValue.toLowerCase();
                criteriaValue = criteriaValue.toLowerCase();
            }
            if (isContains) {
                return listValue.indexOf(criteriaValue) !== -1;
            }
            return listValue === criteriaValue;
        });
        if (isItemFound) {
            index = i;
            break;
        }
    }
    return index;
};

/**
 * Return very first object if result is match with criteria else return null
 * @param list
 * @param criteria => {fieldName1: fieldValue1, fieldName2: fieldValue2, ...}
 * @return {*}
 */
export function find(list = [], criteria = {}, ignoreDataType, ignoreCase) {
    const index = findIndex(list, criteria, ignoreDataType);
    if (index === -1) {
        return null;
    }
    return list[index];
};

/**
 * Return list of object if result is match with criteria else return []
 * @param list
 * @param criteria => {fieldName1: fieldValue1, fieldName2: fieldValue2, ...}
 * @return {*}
 */
export function findAll(list = [], criteria = {}, ignoreDataType) {
    const result = [];
    list.forEach(item => {
        Object.keys(criteria).every((criteriaKey) => {
            let listValue = item[criteriaKey];
            let criteriaValue = criteria[criteriaKey];
            if (ignoreDataType && listValue && criteriaValue) {
                listValue = listValue.toString();
                criteriaValue = criteriaValue.toString();
            }
            if (listValue === criteriaValue) {
                result.push(item);
            }
        });
    });
    return result;
};

/**
 * Return sorted list
 * @param list
 * @param sortByList = [{name: fieldName, sortBy: 'asc/desc'}]
 * @return {Array}
 */
export function orderBy(list = [], sortByList = []) {
    const sortedList = Object.assign([], list);
    for (let i = sortByList.length-1; i > -1 ; i--) {
        const options = sortByList[i].options || {};
        sortedList.sort((a, b) => {
            let valueA = '';
            let valueB = '';
            if (options.type === 'list') {
                const aId = a[sortByList[i].name].id;
                const bId = b[sortByList[i].name].id;
                valueA = find(options.list, {id: aId}).name.toString().toUpperCase();
                valueB = find(options.list, {id: bId}).name.toString().toUpperCase();
            } else {
                valueA = a[sortByList[i].name].toString().toUpperCase();
                valueB = b[sortByList[i].name].toString().toUpperCase();
            }
            const ascValue = sortByList[i].sortBy === 'asc' ? [-1, 1] : [1, -1];
            if (valueA < valueB) {
                return ascValue[0];
            }
            if (valueA > valueB) {
                return ascValue[1];
            }
            return 0;
        });
    }
    return sortedList;
};