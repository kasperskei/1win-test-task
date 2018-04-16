<template>
  <div class="websocket">
    <h1>Todo</h1>

    <section class="row">
      <a class="cell" @click="filter = 'all'">All</a>
      <a class="cell" @click="filter = 'active'">Active</a>
      <a class="cell" @click="filter = 'done'">Done</a>
      <span class="cell">|</span>
      <a class="cell" @click="tryRemoveAllTaskInOrder">Delete all</a>
    </section>

    <form @submit.prevent="createTask">
      <input v-model="input" type="text" placeholder="Write something...">
      <button type="submit">+</button>
    </form>

    <section class="todo-list">
      <div v-for="task in filteredTasks" :key="task.id" class="todo-list-item">
        <a class="is-right" @click="tryRemoveTask(task.id)">×</a>
        <a :class="`is-${task.status}`" @click="changeTaskStatus(task)">{{ task.name }}</a>
      </div>
    </section>
  </div>
</template>

<script>
import queueMixin from '@/mixins/queueMixin'
import Guid from '@/models/Guid'

export default {
  mixins: [queueMixin],
  name: 'Websocket',
  data() {
    return {
      filter: 'all',
      input: '',
      tasks: [
        {
          id: Guid.New,
          name: 'Написать диплом',
          status: 'active'
        },
        {
          id: Guid.New,
          name: 'Помыть полы',
          status: 'active'
        },
        {
          id: Guid.New,
          name: 'Доесть еду соседа',
          status: 'done'
        },
        {
          id: Guid.New,
          name: 'Поспасть',
          status: 'active'
        },
        {
          id: Guid.New,
          name: 'Написать "Hello world"',
          status: 'active'
        }
      ]
    }
  },
  computed: {
    filteredTasks() {
      if (this.filter === 'all') return this.tasks
      return this.tasks.filter(it => it.status === this.filter)
    }
  },
  methods: {
    changeTaskStatus(task) {
      task.status = task.status === 'active' ? 'done' : 'active'
    },
    createTask() {
      if (!this.input.length) return
      const task = {
        id: Guid.New,
        name: this.input,
        status: 'active'
      }
      this.input = ''
      this.tasks.unshift(task)
    },
    removeTask(taskID) {
      console.log('removeTask', taskID)

      if (!taskID) return
      const index = this.tasks.findIndex(it => it.id == taskID)
      if (index === -1) return
      this.tasks.splice(index, 1)
    },
    tryRemoveTask(taskID) {
      const key = 'removeTask' + taskID
      const job = this.queueJobCreate(this.removeTask, taskID)
      this.queuePush(key, job)
      this.sendMessage(taskID, key, job.id)
    },
    tryRemoveAllTaskInOrder() {
      const key = 'removeAllTask'
      this.tasks.forEach((it, i) => {
        const job = this.queueJobCreate(this.removeTask, it.id)
        this.queuePush(key, job)

        setTimeout(() => {
          this.sendMessage(it.id, key, job.id)
        }, Math.random() * 1000)
      })
    },
    sendMessage(data, flow, job) {
      this.$socket.sendObj({
        data,
        flow,
        job
      })
    },
    onMessage(event) {
      console.info('onMessage', event)

      const response = JSON.parse(event.data)
      const flow = this.queue.flows[response.flow]
      this.queueUnshift(response.flow, response.job)
    }
  },
  created() {
    this.$options.sockets.onmessage = this.onMessage
  },
  components: {}
}
</script>

<style lang="scss" scoped>
@import '../styles/colors';

.websocket {
  margin: 0 auto;
  width: fit-content;

  .todo-list {
    margin-bottom: 0.75rem;
    .todo-list-item {
      .is-active {
        color: $white;
      }
      .is-done {
        color: $secondary;
        text-decoration: line-through;
      }
      .is-right {
        float: right;
      }
    }
  }
}
</style>
