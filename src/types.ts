import { ROOT_NODE } from './constants';

export type FTDNodeType = FTDNode | FTDContainerNode;

type FTDParamType = string | FTDInlineParam | FTDParam;

export class FTDInlineParam {
    public value: string

    constructor(value: string) {
        this.value = value;
    }
}

export class FTDParam {
    public key: string
    public value: string

    constructor(key: string, value: string) {
        this.key = key;
        this.value = value;
    }
}

export class FTDImportStmt {
    public resource: string
    public alias: string|null

    constructor(resource: string, alias: string|null = null) {
        this.resource = resource;
        this.alias = alias;
    }
}

export class FTDNode {
    public type: string
    public isRootNode: boolean = false
    public isContainerNode: boolean = false
    public hasChildNodes: boolean = false
    public params: FTDParamType[]
    public children: FTDNodeType[] = []
    public parent: FTDNode|null
    public identifier: string|null
    
    constructor(type: string, params: string, parent: FTDNode|null, identifier?: string|null) {
        this.type = type;
        this.parent = parent;
        this.params = params ? [new FTDInlineParam(params)] : [];
        this.identifier = identifier;
    }
}

export class FTDRootNode extends FTDNode {
    importStatements: FTDImportStmt[] = []

    constructor() {
        super(ROOT_NODE, null, null);
        this.isRootNode = true;
    }
}

export class FTDContainerNode extends FTDNode {
    constructor(type: string, params: string, parent: FTDNode, identifier: string|null) {
        super(type, params, parent, identifier);

        this.isContainerNode = true;
    }
}

export interface FTDParserOptions {
    containerTypes: string[]
}