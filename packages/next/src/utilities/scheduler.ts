type Callback = () => void;
type Queue = Array<Callback>;
type Runner = (fn: () => void) => void;

const flushQueue = (queue: Queue, callback: Callback) => {
    let job;

    while ((job = queue.shift())) {
        callback();
    }

    return job;
};

const queueTask = (callback: Callback) => {
    try {
        const ch = new MessageChannel();
        ch.port1.onmessage = callback;
        ch.port2.postMessage(null);
    } catch {}
};

const setupScheduler = (runner: Runner) => {
    const queue: Queue = [];
    return (callback: Callback) =>
        queue.push(callback) && runner(() => flushQueue(queue, callback));
};

export const scheduleMacrotask = (callback: Callback) => {
    const scheduler = setupScheduler(queueTask);
    return scheduler(callback);
};

export const scheduleMicrotask = (callback: Callback) => {
    const scheduler = setupScheduler(queueMicrotask);
    return scheduler(callback);
};
