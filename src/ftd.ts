import { parser } from "./parser.js";
import { FTDParserOptions } from "./types";

export const createFTDParser = (containerNodes: FTDParserOptions) => (strings: string[], ...values: string[]) => {
    const code = values
        .reduce((output, value, index) => `${output}${value}${strings[index + 1]}`, strings[0]);

    const tree = parser(code, containerNodes);

    return tree;
};