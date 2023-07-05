import { COMMENT_BEGIN, DEFINITION_KEYWORDS, ESCAPE_CHAR } from "./constants";
import { FTDNodeType, FTDRootNode } from './types';

export const isEscaped = (index: number, chars: string|string[], stop?: number) => {
    const stopIndex = stop ?? chars.length;

    let count = 0;

    while(index < stopIndex && chars[index] === ESCAPE_CHAR) {
        count++;

        index++;
    }

    if(count % 2 === 0) {
        return false;
    }

    return true;
};

export const removeInlineComments = (v: string) => {
    let index = v.indexOf(COMMENT_BEGIN);

    let j = 0;
    
    let output = v;

    while(index >= 0) {
        let escaped = false;

        while(j < index) {
            escaped = isEscaped(j, v, index);

            j++;
        }

        if(escaped) {
            j = index;
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

export const isDefinitionType = (type: string, containerTypes: string[]) => {
    if(DEFINITION_KEYWORDS.includes(type) || containerTypes.includes(type)) {
        return true;
    }

    return false;
};

export const shouldEndNode = (node: FTDRootNode | FTDNodeType, endingBlock: string) => {
    if(node.isRootNode) {
        return true;
    }

    if(node.identifier && node.identifier === endingBlock) {
        return true;
    }

    return node.type === endingBlock;
};