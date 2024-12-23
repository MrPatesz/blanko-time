import { chars } from './chars';

export const calculatePoints = (word: string) => {
    const letters = word.toLowerCase().split('');
    let points = 0;

    for (let i = 0; i < letters.length; i++) {
        const char1 = letters[i];
        const char2 = letters[i + 1];
        const twoChars = `${char1}${char2}`;

        if (twoChars in chars.double) {
            points += chars.double[twoChars as keyof typeof chars.double];
            i++;
        } else {
            points +=
                char1 in chars.single
                    ? chars.single[char1 as keyof typeof chars.single]
                    : 0;
        }
    }

    return points;
};
