
export const parseArrayString = (str?: string, defaultValue = []) => {
    if (!str) {
        return defaultValue;
    }
    try {
        return str.split(',');
    } catch (e) {
        return defaultValue;
    }
};