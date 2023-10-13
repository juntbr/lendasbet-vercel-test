interface TaskParams {
  duration: number;
  interval?: number;
  task: (
    success?: (value?: unknown) => void,
    failed?: (value?: unknown) => void,
    currentTime?: number
  ) => void;
  returnIfExpired?: unknown;
}

export function taskInterval<T>(params: TaskParams) {
  const { duration, interval = 1000, task, returnIfExpired = null } = params;

  let currentTime = 0;

  return new Promise<T>((resolve, reject) => {
    const taskInterval = setInterval(() => {
      if (currentTime <= duration) {
        task(
          (value: T) => {
            clearInterval(taskInterval);
            resolve(value);
          },
          (value: T) => {
            clearInterval(taskInterval);
            reject(value);
          },
          currentTime
        );
      } else {
        clearInterval(taskInterval);
        reject(returnIfExpired);
      }

      currentTime += interval;
    }, interval);
  });
}
