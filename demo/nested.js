import { createFTDParser } from '../dist/index.js';

const ftd = createFTDParser({
    containerTypes: ['ftd.column', 'ftd.row'],
});

const ast = ftd`
-- import: stuff

;; This is a comment

-- ftd.text: Hello World ;; This is an inline comment

;; Nesting

-- ftd.column:

    -- ftd.row:

        -- ftd.text:
        color: red

        This is a 
        mulitline string

        -- ftd.text: Hello Again!

    -- end: ftd.row

-- end: ftd.column
`;

console.log(ast); // Marvel at the magnificent Abstract Syntax Tree! 🌳🤩