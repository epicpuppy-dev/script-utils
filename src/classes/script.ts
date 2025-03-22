import { RunMode, Runtime } from "../util/runtime.js";
import { Task } from "./task.js";

interface ScriptOptions {
    progressMode?: boolean;
}

export class Script<T extends unknown[]> extends Runtime {
    private tasks: [Task<T, unknown[]>, ...Task<unknown[], unknown[]>[]];
    private inputContainers: string[];
    private ch = Runtime.runner.ch;

    constructor(tasks: [Task<T, unknown[]>, ...Task<unknown[], unknown[]>[]], inputs: string[], options: ScriptOptions = {}) {
        super();
        this.tasks = tasks;
        this.inputContainers = inputs;
        if (options.progressMode) {
            Runtime.mode = RunMode.PROGRESS;
        }
    }
    public addTask(task: Task<unknown[], unknown[]>) {
        this.tasks.push(task);
        return this;
    }

    public async execute(...input: T) {
        // Populate each input container with the input data
        for (let i = 0; i < this.inputContainers.length; i++) {
            const container = Runtime.containers.get(this.inputContainers[i]);
            if (container) {
                container.setData(input[i]);
            }
        }
        // Script execution loop
        Runtime.runner.totalTasks = this.tasks.length;
        for (let i = 0; i < this.tasks.length; i++) {
            const task = this.tasks[i];
            Runtime.runner.task = i;
            Runtime.runner.taskName = task.name;
            Runtime.runner.log(this.ch.blueBright.bold(`=> [${i + 1}/${this.tasks.length}] ${task.name}`));
            try {
                task.populate(Runtime.containers);
                await task.run();
                task.export(Runtime.containers);
            } catch (e) {
                Runtime.runner.error(this.ch.red.bold(`=> Script execution failed at task '${task.name}' - ${e}`));
            }
        }
        if (Runtime.mode == RunMode.PROGRESS) {
            Runtime.runner.task = this.tasks.length;
            Runtime.runner.progress();
            process.stdout.write('\n');
        }
    }
}