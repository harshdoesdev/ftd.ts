import { FTDContainerNode, FTDImportStmt, FTDNode, FTDParam, FTDRootNode } from "./types";
import { extractTypeAndParams, removeInlineComments, shouldEndNode } from "./util";

import { CONTAINER_NODES } from "./constants.js";

export const parser = (code: string) => {
    const lines = code.split(/\n/);

    const rootNode = new FTDRootNode();

    let node: FTDNode | FTDRootNode = rootNode;

    const len = lines.length;

    let i = 0;

    while(i < len) {
        const line = lines[i].trimStart();

        if(line.startsWith(';;')) {
            // do nothing
        } else if(line.startsWith('--')) {
            const [type, param] = extractTypeAndParams(line);

            if(type === 'import') {
                const parts = param.split(/\s+/);

                let aliasIndex = parts.indexOf('as');

                if(aliasIndex === 0) {
                    throw new Error(
                        `FTD Parsing Error: Missing resource path in import statement.\n\n` +
                        `This error occured at Line: ${i}'`
                    );
                }

                const resource = parts[0];

                const alias = aliasIndex > 0 ? parts[aliasIndex + 1] : null;

                const stmt = new FTDImportStmt(resource, alias);

                rootNode.importStatements.push(stmt);
            } else if(type === 'end') {
                if(!node.isContainerNode && !node.isRootNode) {
                    node = node.parent;
                }

                if(shouldEndNode(node, param)) {
                    node = node.parent;
                } else {
                    throw new Error(
                        `FTD Parsing Error: ${node.type} is a container node and should be closed.\n\n` +
                        `You are missing '-- end: ${node.type}'`
                    );
                }
            } else {
                if(!node.isContainerNode && !node.isRootNode) {
                    node = node.parent;
                }

                if(CONTAINER_NODES.includes(type)) {
                    const child = new FTDContainerNode(type, param, node);

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
    
                if(index > 0 && line[index - 1] !== '\\') {
                    const key = line.slice(0, index).trim();
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