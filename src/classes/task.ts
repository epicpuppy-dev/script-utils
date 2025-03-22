import { Runner } from "../util/runner.js";
import { Runtime } from "../util/runtime.js";
import { Container } from "./container.js";

export class Task<I extends unknown[], O extends unknown[]> extends Runtime {
    readonly id: string;
    readonly name: string;
    private inputs: string[];
    private outputs: string[];
    private inputData: Record<string, unknown> = {};
    private outputData: Record<string, unknown> = {};
    private execute: (runner: Runner, ...args: I) => Promise<O>;

    constructor(id: string, name: string, inputs: string[], outputs: string[], execute: (runner: Runner, ...args: I) => Promise<O>) {
        super();
        this.id = id;
        this.name = name;
        this.inputs = inputs;
        this.outputs = outputs;
        this.execute = execute;
        Runtime.addTask(this);
    }

    public populate(containers: Map<string, Container<unknown>>): void {
        for (const input of this.inputs) {
            const container = containers.get(input);
            if (!container) {
                throw new Error(`Invalid input container: '${input}'`);
            }
            const data = container.getData();
            if (data === null) {
                Runtime.runner.warn(`WARN: Input container '${input}' is null`);
            }
            this.inputData[input] = container.getData();
        }
    }
    public extract(type: string): unknown {
        if (!this.outputs.includes(type)) {
            throw new Error(`Invalid output type: '${type}'`);
        }
        return this.outputData[type];
    }
    public export(containers: Map<string, Container<unknown>>): void {
        for (const output of this.outputs) {
            const container = containers.get(output);
            if (!container) {
                throw new Error(`Invalid output container: '${output}'`);
            }
            container.setData(this.outputData[output]);
        }
    }
    public async run() {
        const inputs = this.inputs.map((type) => this.inputData[type]);
        const outputs = await this.execute(Runtime.runner, ...inputs as I);
        this.outputs.forEach((type, index) => {
            this.outputData[type] = outputs[index];
        });
    }
}