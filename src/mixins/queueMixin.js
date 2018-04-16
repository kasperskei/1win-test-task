import Guid from '@/models/Guid'

const JOB_STATUS_WAIT = 1
const JOB_STATUS_WORK = 2
const JOB_STATUS_DONE = 3

export default {
  data() {
    return {
      queue: {
        flows: {}
      }
    }
  },
  methods: {
    queueJobCreate(callback, ...args) {
      return {
        id: Guid.New,
        status: JOB_STATUS_WAIT,
        callback() {
          return callback(...args)
        }
      }
    },
    queueCreate(key) {
      this.queue.flows[key] = []
      return this.queue.flows[key]
    },
    queuePush(key, job) {
      const flow = this.queue.flows[key] || this.queueCreate(key)
      flow.push(job)
    },
    queueUnshift(key, jobID) {
      const flow = this.queue.flows[key]
      if (!flow) return false

      const index = flow.findIndex(it => it.id === jobID)
      if (index === -1) return false

      const jobPrev = flow[index - 1]
      const jobCurr = flow[index]
      const jobNext = flow[index + 1]

      if (!jobPrev || jobPrev.status === JOB_STATUS_DONE) {
        jobCurr.callback()
        jobCurr.status = JOB_STATUS_DONE

        if (jobNext && jobNext.status === JOB_STATUS_WORK) {
          return this.queueUnshift(key, jobNext.id)
        }

        if (!jobNext) {
          delete this.queue.flows[key]
        }
      } else {
        jobCurr.status = JOB_STATUS_WORK
      }
    }
  }
}
