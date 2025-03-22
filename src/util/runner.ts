import { Chalk } from "chalk";
import { RunMode, Runtime } from "./runtime.js";

export class Runner {
    readonly ch = new Chalk();
    private barWidth = 20;
    public task: number = 0;
    public taskName: string = "";
    public totalTasks: number = 1;
    private progressMessage: string = "";

    public log (message: string) {
        if (Runtime.mode == RunMode.LOG) {
            console.log(message);
        } else {
            process.stdout.clearLine(0);
            console.log(message);
            this.progressLine();
        }
    }
    public warn (message: string) {
        if (Runtime.mode == RunMode.LOG) {
            console.warn(this.ch.yellow(message));
        } else {
            process.stdout.clearLine(0);
            console.warn(this.ch.yellow(message));
            this.progressLine();
        }
    }
    public error (message: string) {
        if (Runtime.mode == RunMode.LOG) {
            console.error(this.ch.red(message));
        } else {
            process.stdout.clearLine(0);
            console.error(this.ch.red(message));
        }
        throw new Error(message);
    }
    public progress (info: string = "") {
        if (Runtime.mode != RunMode.PROGRESS) return;
        this.progressMessage = info;
        this.progressLine();
    }
    private progressLine() {
        let progress = Math.floor(this.task / this.totalTasks * this.barWidth);
        process.stdout.write(this.ch.green(
            `[${this.task}/${this.totalTasks}] <${'='.repeat(progress)}${' '.repeat(this.barWidth - progress)}> ${this.taskName}${this.progressMessage ? ` - ${this.progressMessage}` : ''}\r`
        ));
    }
}