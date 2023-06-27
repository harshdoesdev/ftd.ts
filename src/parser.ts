import { FTDContainerNode, FTDNode, FTDParam, FTDRootNode } from "./tree";
import { extractComponentAndParams, removeInlineComments, shouldEndComponent } from "./util";

import { CONTAINER_NODES } from "./constants.js";

export const parser = (code: string) => {
    const lines = code.split(/\n/);

    const rootNode = new FTDRootNode();

    let node = rootNode;

    const len = lines.length;

    let i = 0;

    while(i < len) {
        const line = lines[i].trimStart();

        if(line.startsWith(';;')) {
            // do nothing
        } else if(line.startsWith('--')) {
            const [component, param] = extractComponentAndParams(line);

            if(component === 'end') {
                if(!node.isContainerNode && !node.isRootNode) {
                    node = node.parent;
                }

                if(shouldEndComponent(node, param)) {
                    node = node.parent;
                } else {
                    throw new Error(
                        `FTD Parsing Error: ${node.component} is a container node and should be closed.\n\n` +
                        `You are missing '-- end: ${node.component}'`
                    );
                }
            } else {
                if(!node.isContainerNode && !node.isRootNode) {
                    node = node.parent;
                }

                if(CONTAINER_NODES.includes(component)) {
                    const child = new FTDContainerNode(component, param, node);

                    node.children.push(child);

                    node.hasChildNodes = true;
                    
                    node = child;
                } else {
                    const child = new FTDNode(component, param, node);

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