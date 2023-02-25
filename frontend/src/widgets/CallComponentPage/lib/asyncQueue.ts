interface Options {
    maxParallelTasks: number;
}

interface ITask {
    key: string;
    task: () => Promise<void>;
}

interface IQueue {
    task: ITask;
    resolve: (value: void | PromiseLike<void>) => void;
    reject: (reason?: any) => void;
}

class AsyncQueue {
    public queue: IQueue[];

    public executingPromisesCount: number;

    public executingPromises: string[];

    public maxParallelTasks: number;

    constructor({ maxParallelTasks = 5 }: Options) {
        this.maxParallelTasks = maxParallelTasks;
        this.queue = [];
        this.executingPromisesCount = 0;
        this.executingPromises = [];

        this.clear();
    }

    clear(): void {
        this.queue = [];
        this.executingPromisesCount = 0;
        this.executingPromises = [];
    }

    addTask(task: ITask, urgently: boolean): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.queue.length && this.executingPromises.length < this.maxParallelTasks) {
                this.runTask(task, resolve, reject);
                return;
            }
            const taskData = {
                task,
                resolve,
                reject,
            };
            if (urgently) {
                this.queue.unshift(taskData);
            } else {
                this.queue.push(taskData);
            }
        });
    }

    removeTask({ taskKey }: { taskKey: string }): void {
        this.queue = this.queue.filter((q) => q.task.key !== taskKey);
        this.executingPromises = this.executingPromises.filter((k) => k !== taskKey);
    }

    changeMaxParallelTasks(value: number): void {
        if (!value) return;
        this.maxParallelTasks = Math.max(1, this.maxParallelTasks + value);
        if (value < 0) return;
        Array(value)
            .fill(0)
            .map(() => this.runNextTask());
    }

    /**
     * @private
     */
    runTask(task: ITask, resolve: () => void, reject: () => void): void {
        this.executingPromises.push(task.key);
        this.executingPromisesCount++;
        setTimeout(() => this.processTask(task, resolve, reject), 0);
    }

    /**
     * @private
     */
    async processTask(
        task: ITask,
        resolve: (value: void | PromiseLike<void>) => void,
        reject: (reason?: any) => void,
    ): Promise<void> {
        try {
            const res = await task.task();
            setTimeout(() => resolve(res), 0);
        } catch (e) {
            setTimeout(() => reject(e), 0);
        }
        this.executingPromisesCount--;
        this.executingPromises = this.executingPromises.filter((k) => k !== task.key);

        this.runNextTask();
    }

    /**
     * @private
     */
    runNextTask(): void {
        if (!this.queue.length) return;
        if (this.executingPromisesCount >= this.maxParallelTasks) return;
        const { task, resolve, reject } = this.queue.shift() as IQueue;
        this.runTask(task, resolve, reject);
    }
}

export default AsyncQueue;
