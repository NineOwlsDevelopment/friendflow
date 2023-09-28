class Queue {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
  }

  add(task) {
    return new Promise((resolve, reject) => {
      const taskWrapper = async () => {
        try {
          const result = await task();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };

      this.queue.push(taskWrapper);

      if (!this.isProcessing) {
        this.processQueue();
      }
    });
  }

  async processQueue() {
    this.isProcessing = true;

    while (this.queue.length > 0) {
      const task = this.queue.shift();
      await task();
    }

    this.isProcessing = false;
  }
}

const queue = new Queue();

module.exports = queue;
