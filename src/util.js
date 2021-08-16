export function pad(input) {
    if (input > 9) return new String(input);
    return `0${input}`;
}

// function randInt(min, max) {
//     return Math.round(Math.random() * (max - min) + min);
// }