import cropsData from "@/services/mockData/crops.json";

class CropService {
  constructor() {
    this.crops = [...cropsData];
    this.delay = 300;
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, this.delay));
    return [...this.crops];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, this.delay));
    const crop = this.crops.find(c => c.Id === parseInt(id));
    if (!crop) {
      throw new Error("Crop not found");
    }
    return { ...crop };
  }

  async create(cropData) {
    await new Promise(resolve => setTimeout(resolve, this.delay));
    
    const newId = Math.max(...this.crops.map(c => c.Id), 0) + 1;
    const newCrop = {
      Id: newId,
      ...cropData
    };
    
    this.crops.push(newCrop);
    return { ...newCrop };
  }

  async update(id, cropData) {
    await new Promise(resolve => setTimeout(resolve, this.delay));
    
    const index = this.crops.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Crop not found");
    }
    
    this.crops[index] = {
      ...this.crops[index],
      ...cropData,
      Id: parseInt(id)
    };
    
    return { ...this.crops[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, this.delay));
    
    const index = this.crops.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Crop not found");
    }
    
    this.crops.splice(index, 1);
    return true;
  }
}

export default new CropService();