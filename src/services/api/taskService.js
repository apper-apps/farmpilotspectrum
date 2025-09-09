import tasksData from "@/services/mockData/tasks.json";

class TaskService {
  constructor() {
    this.tasks = [...tasksData];
    this.delay = 300;
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, this.delay));
    return [...this.tasks];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, this.delay));
const parsedId = parseInt(id);
    if (isNaN(parsedId)) return null;
    const task = this.tasks.find(t => t.id === parsedId);
    if (!task) {
      throw new Error("Task not found");
    }
    return { ...task };
  }

  async create(taskData) {
    await new Promise(resolve => setTimeout(resolve, this.delay));
    
const newId = this.tasks.length > 0 ? Math.max(...this.tasks.map(t => t.id || 0), 0) + 1 : 1;
    const newTask = {
      Id: newId,
      ...taskData,
      completed: false,
      completedDate: null
    };
    
    this.tasks.push(newTask);
    return { ...newTask };
  }

  async update(id, taskData) {
    await new Promise(resolve => setTimeout(resolve, this.delay));
    
const parsedId = parseInt(id);
    if (isNaN(parsedId)) return null;
    const index = this.tasks.findIndex(t => t.id === parsedId);
    if (index === -1) {
      throw new Error("Task not found");
    }
    
    this.tasks[index] = {
      ...this.tasks[index],
      ...taskData,
id: parsedId
    };
    
    return { ...this.tasks[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, this.delay));
    
const parsedId = parseInt(id);
    if (isNaN(parsedId)) return false;
    const index = this.tasks.findIndex(t => t.id === parsedId);
    if (index === -1) {
      throw new Error("Task not found");
    }
    
    this.tasks.splice(index, 1);
    return true;
  }
}

export default new TaskService();