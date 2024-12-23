import { chars } from './chars';

export const calculatePoints = (word: string) => {
    let remainingWord = word.toLowerCase();
    let points = 0;

    Object.entries(chars.double).forEach(([key, value]) => {
        if (remainingWord.includes(key)) {
            points += value;
            remainingWord = remainingWord.replace(key, '');
        }
    });

    remainingWord.split('').forEach((char) => {
        points +=
            char in chars.single
                ? chars.single[char as keyof typeof chars.single]
                : 0;
    });

    return points;
};
