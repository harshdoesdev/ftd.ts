import { parser } from "./parser.js";

export const ftd = (strings: string[], ...values: string[]) => {
    const code = values
        .reduce((output, value, index) => `${output}${value}${strings[index + 1]}`, strings[0]);

    const tree = parser(code);

    return tree;
};