import { Chalk } from "chalk";
import { RunMode, Runtime } from "./runtime.js";

export class Runner {
    readonly ch = new Chalk();
    private barWidth = 20;
    public task: number = 0;
    public taskName: string = "";
    public totalTasks: number = 1;
    private progressMessage: string = "";

    public log (message: string, depth: number = 1) {
        let prefix = depth > 0 ? " ".repeat(depth * 2 - 1) + "->" : "";
        if (Runtime.mode == RunMode.LOG) {
            console.log(prefix + message);
        } else {
            process.stdout.clearLine(0);
            console.log(prefix + message);
            this.progressLine();
        }
    }
    public warn (message: string, depth: number = 1) {
        let prefix = depth > 0 ? " ".repeat(depth * 2 - 1) + "->" : "";
        if (Runtime.mode == RunMode.LOG) {
            console.warn(this.ch.yellow(prefix + message));
        } else {
            process.stdout.clearLine(0);
            console.warn(this.ch.yellow(prefix + message));
            this.progressLine();
        }
    }
    public error (message: string, depth: number = 1) {
        let prefix = depth > 0 ? " ".repeat(depth * 2 - 1) + "->" : "";
        if (Runtime.mode == RunMode.LOG) {
            console.error(this.ch.red(prefix + message));
        } else {
            process.stdout.clearLine(0);
            console.error(this.ch.red(prefix + message));
        }
        throw new Error(message);
    }
    public progress (info: string = "") {
        if (Runtime.mode != RunMode.PROGRESS) return;
        this.progressMessage = info;
        process.stdout.clearLine(0);
        this.progressLine();
    }
    private progressLine() {
        let progress = Math.floor(this.task / this.totalTasks * this.barWidth);
        process.stdout.write(this.ch.green(
            `[${this.task}/${this.totalTasks}] <${'='.repeat(progress)}${' '.repeat(this.barWidth - progress)}> ${this.taskName}${this.progressMessage ? ` - ${this.progressMessage}` : ''}\r`
        ));
    }
}