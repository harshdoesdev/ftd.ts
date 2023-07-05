import { createFTDParser, parser } from '../dist/index.js';

const ftd = createFTDParser({
    containerTypes: ['ftd.column', 'ftd.row'],
});

const ast = ftd`

-- import: COMMENT

`;

console.log(ast);