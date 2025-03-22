import { Container } from "../classes/container.js";
import { Task } from "../classes/task.js";
import { Runner } from "./runner.js";

export enum RunMode {
    LOG,
    PROGRESS
}

export class Runtime {
    protected static containers: Map<string, Container<unknown>> = new Map();
    protected static tasks: Map<string, Task<unknown[], unknown[]>> = new Map();
    protected static runner = new Runner();
    public static mode: RunMode = RunMode.LOG;
    
    protected static addContainer(container: Container<unknown>) {
        this.containers.set(container.type, container);
    }
    protected static addTask(task: Task<any[], any[]>) {
        this.tasks.set(task.id, task);
    }
}