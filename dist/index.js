const ROOT_NODE = "#root";
const CONTAINER_NODES = ["ftd.column", "ftd.row", "ftd.container", "ftd.component"];
const COMMENT_BEGIN = ";;";

class FTDInlineParam {
  value;
  constructor(value) {
    this.value = value;
  }
}
class FTDParam {
  key;
  value;
  constructor(key, value) {
    this.key = key;
    this.value = value;
  }
}
class FTDNode {
  component;
  isRootNode = false;
  isContainerNode = false;
  hasChildNodes = false;
  params;
  children = [];
  parent;
  constructor(component, params, parent) {
    this.component = component;
    this.parent = parent;
    this.params = params ? [new FTDInlineParam(params)] : [];
  }
}
class FTDRootNode extends FTDNode {
  constructor() {
    super(ROOT_NODE, null, null);
    this.isRootNode = true;
  }
}
class FTDContainerNode extends FTDNode {
  constructor(component, params, parent) {
    super(component, params, parent);
    this.isContainerNode = true;
  }
}

const removeInlineComments = (v) => {
  let index = v.indexOf(COMMENT_BEGIN);
  let output = v;
  while (index > 0) {
    const escaped = v[index - 1] === "\\";
    if (escaped) {
      index = v.indexOf(COMMENT_BEGIN, index + 1);
    } else {
      output = v.slice(0, index).trim();
      break;
    }
  }
  return output;
};
const extractComponentAndParams = (line) => {
  const trimmed = line.substring(2).trimStart();
  const index = trimmed.indexOf(":");
  const component = trimmed.slice(0, index).trim();
  const params = removeInlineComments(trimmed.slice(index + 1).trim());
  return [component, params];
};
const shouldEndComponent = (node, endingBlock) => {
  if (node.isRootNode) {
    return true;
  }
  return node.component === endingBlock;
};

const parser = (code) => {
  const lines = code.split(/\n/);
  const rootNode = new FTDRootNode();
  let node = rootNode;
  const len = lines.length;
  let i = 0;
  while (i < len) {
    const line = lines[i].trimStart();
    if (line.startsWith(";;")) ; else if (line.startsWith("--")) {
      const [component, param] = extractComponentAndParams(line);
      if (component === "end") {
        if (!node.isContainerNode && !node.isRootNode) {
          node = node.parent;
        }
        if (shouldEndComponent(node, param)) {
          node = node.parent;
        } else {
          throw new Error(
            `FTD Parsing Error: ${node.component} is a container node and should be closed.

You are missing '-- end: ${node.component}'`
          );
        }
      } else {
        if (!node.isContainerNode && !node.isRootNode) {
          node = node.parent;
        }
        if (CONTAINER_NODES.includes(component)) {
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
    } else if (!node.hasChildNodes && !node.isRootNode) {
      if (line) {
        const index = line.indexOf(":");
        if (index > 0 && line[index - 1] !== "\\") {
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
  if (node !== rootNode) {
    node = rootNode;
  }
  return node;
};

const ftd = (strings, ...values) => {
  const code = values.reduce((output, value, index) => `${output}${value}${strings[index + 1]}`, strings[0]);
  const tree = parser(code);
  return tree;
};

export { ftd };
//# sourceMappingURL=index.js.map
