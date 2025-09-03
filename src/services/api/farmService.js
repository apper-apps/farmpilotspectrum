import farmsData from "@/services/mockData/farms.json";

class FarmService {
  constructor() {
    this.farms = [...farmsData];
    this.delay = 300;
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, this.delay));
    return [...this.farms];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, this.delay));
    const farm = this.farms.find(f => f.Id === parseInt(id));
    if (!farm) {
      throw new Error("Farm not found");
    }
    return { ...farm };
  }

  async create(farmData) {
    await new Promise(resolve => setTimeout(resolve, this.delay));
    
    const newId = Math.max(...this.farms.map(f => f.Id), 0) + 1;
    const newFarm = {
      Id: newId,
      ...farmData,
      createdAt: farmData.createdAt || new Date().toISOString()
    };
    
    this.farms.push(newFarm);
    return { ...newFarm };
  }

  async update(id, farmData) {
    await new Promise(resolve => setTimeout(resolve, this.delay));
    
    const index = this.farms.findIndex(f => f.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Farm not found");
    }
    
    this.farms[index] = {
      ...this.farms[index],
      ...farmData,
      Id: parseInt(id)
    };
    
    return { ...this.farms[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, this.delay));
    
    const index = this.farms.findIndex(f => f.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Farm not found");
    }
    
    this.farms.splice(index, 1);
    return true;
  }
}

export default new FarmService();