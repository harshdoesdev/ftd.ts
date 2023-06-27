import { ftd } from '../dist/index.js';

const ast = ftd`
-- ftd.text: Hello World

-- ftd.column:

    -- ftd.row:

        -- ftd.container:

            --ftd.text: Hello Again

        -- end: ftd.container

    -- end: ftd.row

-- end: ftd.column
`;

console.log(ast);