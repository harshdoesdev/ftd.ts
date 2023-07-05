import { FTDContainerNode, FTDImportStmt, FTDNode, FTDParam, FTDParserOptions, FTDRootNode } from "./types";
import { extractTypeAndParams, isDefinitionType, isEscaped, removeInlineComments, shouldEndNode } from "./util";

import { COMMAND_BEGIN, COMMENT_BEGIN, ESCAPE_CHAR, KEYWORDS } from "./constants";

export const parser = (code: string, { containerTypes = [] }: FTDParserOptions) => {
    const lines = code.split(/\n/);

    const rootNode = new FTDRootNode();

    let node: FTDNode | FTDRootNode = rootNode;

    const len = lines.length;

    let i = 0;

    while(i < len) {
        const line = lines[i].trimStart();

        if(line.startsWith(COMMENT_BEGIN)) {
            // do nothing
        } else if(line.startsWith(COMMAND_BEGIN)) {
            const [type, identifier, param] = extractTypeAndParams(line);

            if(type === KEYWORDS.IMPORT) {
                const parts = param.split(/\s+/);

                let aliasIndex = parts.indexOf('as');

                if(aliasIndex === 0) {
                    throw new Error(
                        `FTD Parsing Error at Line ${i}: Missing resource path in import statement.`
                    );
                }

                const resource = parts[0];

                const alias = aliasIndex > 0 ? parts[aliasIndex + 1] : null;

                const stmt = new FTDImportStmt(resource, alias);

                rootNode.importStatements.push(stmt);
            } else if(type === KEYWORDS.END) {
                if(!node.isContainerNode && !node.isRootNode) {
                    node = node.parent;
                }

                if(shouldEndNode(node, param)) {
                    node = node.parent;
                } else {
                    throw new Error(
                        `FTD Parsing Error on Line ${i}: ${node.type} is a container node and should be closed.\n\n` +
                        `You are missing '-- end: ${node.type}'`
                    );
                }
            } else {
                if(!node.isContainerNode && !node.isRootNode) {
                    node = node.parent;
                }

                if(isDefinitionType(type, containerTypes)) {
                    const child = new FTDContainerNode(type, param, node, identifier);

                    node.children.push(child);

                    node.hasChildNodes = true;
                    
                    node = child;
                } else {
                    const child = new FTDNode(type, param, node);

                    node.children.push(child);

                    node = child;
                }
            }
        } else if(!node.hasChildNodes && !node.isRootNode) {
            if(line) {
                const index = line.indexOf(':');
                
                let j = 0;

                let escaped = false;

                let key = '';

                while(j < index) {
                    if(line[j] === ESCAPE_CHAR) {
                        escaped = isEscaped(j, line, index);

                        j++;
                    }

                    key += line[j];

                    j++;
                }

                key = key.trim();
    
                if(index > 0 && !escaped) {
                    const value = removeInlineComments(line.slice(index + 1).trim());

                    node.params.push(new FTDParam(key, value));
                } else {
                    node.params.push(removeInlineComments(line));
                }
            }
        }

        i++;
    }

    if(node !== rootNode) {
        node = rootNode;
    }

    return node;
};