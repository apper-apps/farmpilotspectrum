import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Empty from "@/components/ui/Empty";
import FormField from "@/components/molecules/FormField";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import Modal from "@/components/ui/Modal";
import taskService from '@/services/api/taskService'
import farmService from '@/services/api/farmService'

const taskTypes = [
  "Watering",
  "Fertilizing",
  "Planting",
  "Harvesting",
  "Pruning",
  "Pest Control",
  "Soil Testing",
  "Maintenance"
];

const Activities = () => {
  const [tasks, setTasks] = useState([]);
  const [farms, setFarms] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
const [formData, setFormData] = useState({
    title: "",
    type: "",
    farmId: "",
    notes: "",
    dueDate: "",
    priority: "medium"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setFilteredTasks(tasks);
  }, [tasks]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tasksData, farmsData] = await Promise.all([
        taskService.getAll(),
        farmService.getAll()
      ]);
      setTasks(tasksData || []);
      setFarms(farmsData || []);
    } catch (error) {
      console.error("Failed to load data:", error);
      toast.error("Failed to load activities");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredTasks(tasks);
      return;
    }
    
    const filtered = tasks.filter(task => 
task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.type?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTasks(filtered);
  };

  const handleAddTask = () => {
    if (farms.length === 0) {
      toast.error("Please create at least one farm before adding activities");
      return;
    }
    setSelectedTask(null);
    setFormData({
      title: "",
      type: "",
      farmId: "",
notes: "",
      dueDate: "",
      priority: "medium"
    });
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
setSelectedTask(task);
    setFormData({
      title: task.title || "",
      type: task.type || "",
      farmId: task.farmId || "",
notes: task.notes || "",
      dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
      priority: task.priority || "Medium"
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.type || !formData.farmId) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
const taskData = {
        title: formData.title,
        type: formData.type,
        farmId: formData.farmId,
        notes: formData.notes,
        dueDate: formData.dueDate || new Date().toISOString(),
        priority: formData.priority,
        completed: selectedTask?.completed || false
      };

      if (selectedTask) {
        await taskService.update(selectedTask.id, taskData);
        toast.success("Activity updated successfully!");
      } else {
        await taskService.create(taskData);
        toast.success("Activity created successfully!");
      }

      setIsModalOpen(false);
      await loadData();
    } catch (error) {
      console.error("Failed to save activity:", error);
      toast.error("Failed to save activity");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this activity?")) {
      return;
    }

    try {
      await taskService.delete(taskId);
      toast.success("Activity deleted successfully!");
      await loadData();
    } catch (error) {
      console.error("Failed to delete activity:", error);
      toast.error("Failed to delete activity");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary-700">Activities</h1>
          <p className="text-gray-600 mt-1">Track and manage your farm activities and schedules</p>
        </div>
        <Button onClick={handleAddTask} className="w-full sm:w-auto">
          <ApperIcon name="Plus" className="h-5 w-5 mr-2" />
          Add New Activity
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search activities by title or type..."
          className="lg:max-w-md"
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        {filteredTasks.length === 0 ? (
          <Empty
            title="No activities found"
            message={tasks.length === 0 
              ? "Create your first activity to start organizing your farm work."
              : "No activities match your current filters. Try adjusting your search or filter criteria."
            }
            actionLabel="Add New Activity"
            onAction={handleAddTask}
            icon="CheckSquare"
          />
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredTasks.map((task) => (
              <div key={task.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {task.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Type: {task.type} • Farm: {farms.find(f => f.id === task.farmId)?.name || 'Unknown'}
                    </p>
                    {task.description && (
                      <p className="text-gray-700 mt-2">{task.description}</p>
                    )}
                    {task.scheduledDate && (
                      <p className="text-sm text-gray-500 mt-2">
                        Scheduled: {new Date(task.scheduledDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditTask(task)}
                    >
                      <ApperIcon name="Edit" className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <ApperIcon name="Trash2" className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedTask ? "Edit Activity" : "Add New Activity"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Activity Title"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder="e.g., Water tomato plants"
            required
          />

          <FormField
            label="Activity Type"
            type="select"
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
            options={taskTypes.map(type => ({ value: type, label: type }))}
            required
          />

          <FormField
            label="Farm"
            type="select"
value={formData.farmId}
            onChange={(e) => setFormData({...formData, farmId: e.target.value})}
            options={farms.map(farm => ({ value: farm.Id.toString(), label: farm.name_c || farm.Name }))}
            required
          />

          <FormField
            label="Description"
            type="textarea"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Optional description..."
            rows={3}
          />

          <FormField
            label="Scheduled Date"
            type="date"
            value={formData.scheduledDate}
            onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
          />

          <FormField
            label="Priority"
            type="select"
            value={formData.priority}
            onChange={(e) => setFormData({...formData, priority: e.target.value})}
            options={[
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" }
            ]}
            required
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {selectedTask ? "Update Activity" : "Create Activity"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Activities;