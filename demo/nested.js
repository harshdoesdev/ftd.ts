import { createFTDParser, parser } from '../dist/index.js';

const ftd = createFTDParser({
    containerTypes: ['ftd.column', 'ftd.row'],
});

const ast = ftd`
;; This is a comment

-- component MyComponent:

    -- ftd.text: Hello World

-- end: MyComponent

-- ftd.column:

    -- ftd.row:

        -- MyComponent:

    -- end: ftd.row

-- end: ftd.column
`;

console.log(ast);