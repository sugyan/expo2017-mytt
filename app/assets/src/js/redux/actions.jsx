export const UPDATE_TIMETABLE       = 'UPDATE_TIMETABLE';
export const FILTER_TOGGLE_CHECKBOX = 'FILTER_TOGGLE_CHECKBOX';
export const FILTER_CHANGE_KEYWORD  = 'FILTER_CHANGE_KEYWORD';
export const SELECT_ITEM            = 'SELECT_ITEM';
export const SELECT_ITEMS           = 'SELECT_ITEMS';
export const GENERATE_RESULT        = 'GENERATE_RESULT';

export const updateTimeTable = (data) => {
    return { type: UPDATE_TIMETABLE, data };
};

export const filterToggleCheckbox = (name) => {
    return { type: FILTER_TOGGLE_CHECKBOX, name };
};

export const filterChangeKeyword = (word) => {
    return { type: FILTER_CHANGE_KEYWORD, word };
};

export const selectItem = (id, checked) => {
    return { type: SELECT_ITEM, id, checked };
};

export const selectItems = (ids) => {
    return { type: SELECT_ITEMS, ids };
};

export const generateResult = (src) => {
    return { type: GENERATE_RESULT, src };
};
