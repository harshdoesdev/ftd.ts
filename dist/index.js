const COMMAND_BEGIN = "--";
const COMMENT_BEGIN = ";;";
const ROOT_NODE = "#root";
const ESCAPE_CHAR = "\\";
const DEFINITION_KEYWORDS = ["component", "record"];
const KEYWORDS = {
  IMPORT: "import",
  END: "end"
};

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
class FTDImportStmt {
  resource;
  alias;
  constructor(resource, alias = null) {
    this.resource = resource;
    this.alias = alias;
  }
}
class FTDNode {
  type;
  isRootNode = false;
  isContainerNode = false;
  hasChildNodes = false;
  params;
  children = [];
  parent;
  identifier;
  constructor(type, params, parent, identifier) {
    this.type = type;
    this.parent = parent;
    this.params = params ? [new FTDInlineParam(params)] : [];
    this.identifier = identifier;
  }
}
class FTDRootNode extends FTDNode {
  importStatements = [];
  constructor() {
    super(ROOT_NODE, null, null);
    this.isRootNode = true;
  }
}
class FTDContainerNode extends FTDNode {
  constructor(type, params, parent, identifier) {
    super(type, params, parent, identifier);
    this.isContainerNode = true;
  }
}

const isEscaped = (index, chars, stop) => {
  const stopIndex = stop ?? chars.length;
  let count = 0;
  while (index < stopIndex && chars[index] === ESCAPE_CHAR) {
    count++;
    index++;
  }
  if (count % 2 === 0) {
    return false;
  }
  return true;
};
const removeInlineComments = (v) => {
  let index = v.indexOf(COMMENT_BEGIN);
  let j = 0;
  let output = v;
  while (index > 0) {
    let escaped = false;
    while (j < index) {
      escaped = isEscaped(j, v, index);
      j++;
    }
    if (escaped) {
      j = index;
      index = v.indexOf(COMMENT_BEGIN, index + 1);
    } else {
      output = v.slice(0, index).trim();
      break;
    }
  }
  return output;
};
const extractTypeAndParams = (line) => {
  const trimmed = line.substring(2).trimStart();
  const index = trimmed.indexOf(":");
  const [type, identifier] = trimmed.slice(0, index).trim().split(/\s+/);
  const params = removeInlineComments(trimmed.slice(index + 1).trim());
  return [type, identifier, params];
};
const isDefinitionType = (type, containerTypes) => {
  if (DEFINITION_KEYWORDS.includes(type) || containerTypes.includes(type)) {
    return true;
  }
  return false;
};
const shouldEndNode = (node, endingBlock) => {
  if (node.isRootNode) {
    return true;
  }
  if (node.identifier && node.identifier === endingBlock) {
    return true;
  }
  return node.type === endingBlock;
};

const parser = (code, { containerTypes = [] }) => {
  const lines = code.split(/\n/);
  const rootNode = new FTDRootNode();
  let node = rootNode;
  const len = lines.length;
  let i = 0;
  while (i < len) {
    const line = lines[i].trimStart();
    if (line.startsWith(COMMENT_BEGIN)) ; else if (line.startsWith(COMMAND_BEGIN)) {
      const [type, identifier, param] = extractTypeAndParams(line);
      if (type === KEYWORDS.IMPORT) {
        const parts = param.split(/\s+/);
        let aliasIndex = parts.indexOf("as");
        if (aliasIndex === 0) {
          throw new Error(
            `FTD Parsing Error at Line ${i}: Missing resource path in import statement.`
          );
        }
        const resource = parts[0];
        const alias = aliasIndex > 0 ? parts[aliasIndex + 1] : null;
        const stmt = new FTDImportStmt(resource, alias);
        rootNode.importStatements.push(stmt);
      } else if (type === KEYWORDS.END) {
        if (!node.isContainerNode && !node.isRootNode) {
          node = node.parent;
        }
        if (shouldEndNode(node, param)) {
          node = node.parent;
        } else {
          throw new Error(
            `FTD Parsing Error on Line ${i}: ${node.type} is a container node and should be closed.

You are missing '-- end: ${node.type}'`
          );
        }
      } else {
        if (!node.isContainerNode && !node.isRootNode) {
          node = node.parent;
        }
        if (isDefinitionType(type, containerTypes)) {
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
    } else if (!node.hasChildNodes && !node.isRootNode) {
      if (line) {
        const index = line.indexOf(":");
        let j = 0;
        let escaped = false;
        let key = "";
        while (j < index) {
          if (line[j] === ESCAPE_CHAR) {
            escaped = isEscaped(j, line, index);
            j++;
          }
          key += line[j];
          j++;
        }
        key = key.trim();
        if (index > 0 && !escaped) {
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

const createFTDParser = (containerNodes) => (strings, ...values) => {
  const code = values.reduce((output, value, index) => `${output}${value}${strings[index + 1]}`, strings[0]);
  const tree = parser(code, containerNodes);
  return tree;
};

export { createFTDParser, parser };
//# sourceMappingURL=index.js.map
