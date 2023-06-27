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
declare class FTDNode {
    component: string;
    isRootNode: boolean;
    isContainerNode: boolean;
    hasChildNodes: boolean;
    params: FTDParamType[];
    children: FTDNodeType[];
    parent: FTDNode | null;
    constructor(component: string, params: string, parent: FTDNode | null);
}
declare class FTDRootNode extends FTDNode {
    constructor();
}
declare class FTDContainerNode extends FTDNode {
    constructor(component: string, params: string, parent: FTDNode);
}

declare const ftd: (strings: string[], ...values: string[]) => FTDRootNode;

export { ftd };
