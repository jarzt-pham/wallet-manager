export namespace JobExceptions {
  export class JobNotFound extends Error {
    constructor(jobId: number) {
      super(`Job with jobId ${jobId} not found`);
    }
  }
}
