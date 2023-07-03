import { COMMENT_BEGIN } from "./constants";
import { FTDNodeType, FTDRootNode } from './types';

export const removeInlineComments = (v: string) => {
    let index = v.indexOf(COMMENT_BEGIN);

    let output = v;

    while(index > 0) {
        const escaped = v[index - 1] === '\\';

        if(escaped) {
            index = v.indexOf(COMMENT_BEGIN, index + 1);
        } else {
            output = v.slice(0, index).trim();
            break;
        }
    }

    return output;
};

export const extractTypeAndParams = (line: string) => {
    const trimmed = line.substring(2).trimStart();
    const index = trimmed.indexOf(':');

    const [type, identifier] = trimmed.slice(0, index).trim().split(/\s+/);
    const params = removeInlineComments(trimmed.slice(index + 1).trim());

    return [type, identifier, params];
};

export const isFTDComponent = (v: string) => v.split('.')[0] === 'ftd';

export const shouldEndNode = (node: FTDRootNode | FTDNodeType, endingBlock: string) => {
    if(node.isRootNode) {
        return true;
    }

    if(node.identifier && node.identifier === endingBlock) {
        return true;
    }

    return node.type === endingBlock;
};