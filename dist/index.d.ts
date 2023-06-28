type FTDNodeType = FTDNode | FTDContainerNode;
type FTDParamType = string | FTDInlineParam | FTDParam;
declare class FTDInlineParam {
    value: string;
    constructor(value: string);
}
declare class FTDParam {
    key: string;
    value: string;
    constructor(key: string, value: string);
}
declare class FTDImportStmt {
    resource: string;
    alias: string | null;
    constructor(resource: string, alias?: string | null);
}
declare class FTDNode {
    type: string;
    isRootNode: boolean;
    isContainerNode: boolean;
    hasChildNodes: boolean;
    params: FTDParamType[];
    children: FTDNodeType[];
    parent: FTDNode | null;
    constructor(type: string, params: string, parent: FTDNode | null);
}
declare class FTDRootNode extends FTDNode {
    importStatements: FTDImportStmt[];
    constructor();
}
declare class FTDContainerNode extends FTDNode {
    constructor(type: string, params: string, parent: FTDNode);
}

declare const ftd: (strings: string[], ...values: string[]) => FTDNode | FTDRootNode;

export { ftd };
