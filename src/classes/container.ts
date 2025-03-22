import { Runtime } from "../util/runtime.js";

export class Container<T> extends Runtime {
    readonly type: string;
    private data: T | null = null;

    constructor(type: string) {
        super();
        this.type = type;
        Runtime.addContainer(this);
    }

    public getData(): T | null {
        return this.data;
    }
    public setData(data: T): void {
        this.data = data;
    }
}