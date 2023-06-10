export const arraySum = (arr) => arr.reduce((s, v) => s+v, 0);

export const limitFileName = (fileName, maxLength) => {
    if (fileName.length <= maxLength) {
        return fileName;
    }
    return '...' + fileName.slice(-1*(maxLength-4));
}