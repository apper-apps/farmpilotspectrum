class FarmService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'farm_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "name_c" } },
          { field: { Name: "size_c" } },
          { field: { Name: "size_unit_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "Tags" } }
        ],
        orderBy: [
          {
            fieldName: "created_at_c",
            sorttype: "DESC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(farm => ({
        Id: farm.Id,
        name: farm.name_c || farm.Name,
        size: farm.size_c || 0,
        sizeUnit: farm.size_unit_c || 'acres',
        location: farm.location_c || '',
        createdAt: farm.created_at_c || new Date().toISOString(),
        tags: farm.Tags || ''
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching farms:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "name_c" } },
          { field: { Name: "size_c" } },
          { field: { Name: "size_unit_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "Tags" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response || !response.data) {
        return null;
      }

      const farm = response.data;
      return {
        Id: farm.Id,
        name: farm.name_c || farm.Name,
        size: farm.size_c || 0,
        sizeUnit: farm.size_unit_c || 'acres',
        location: farm.location_c || '',
        createdAt: farm.created_at_c || new Date().toISOString(),
        tags: farm.Tags || ''
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching farm with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  async create(farmData) {
    try {
      const params = {
        records: [
          {
            Name: farmData.name || '',
            name_c: farmData.name || '',
            size_c: parseInt(farmData.size) || 0,
            size_unit_c: farmData.sizeUnit || 'acres',
            location_c: farmData.location || '',
            created_at_c: new Date().toISOString(),
            Tags: farmData.tags || ''
          }
        ]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create farm ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const farm = successfulRecords[0].data;
          return {
            Id: farm.Id,
            name: farm.name_c || farm.Name,
            size: farm.size_c || 0,
            sizeUnit: farm.size_unit_c || 'acres',
            location: farm.location_c || '',
            createdAt: farm.created_at_c || new Date().toISOString(),
            tags: farm.Tags || ''
          };
        }
      }

      throw new Error('Failed to create farm');
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating farm:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error(error);
        throw error;
      }
    }
  }

  async update(id, farmData) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(id),
            Name: farmData.name || '',
            name_c: farmData.name || '',
            size_c: parseInt(farmData.size) || 0,
            size_unit_c: farmData.sizeUnit || 'acres',
            location_c: farmData.location || '',
            Tags: farmData.tags || ''
          }
        ]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update farm ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const farm = successfulUpdates[0].data;
          return {
            Id: farm.Id,
            name: farm.name_c || farm.Name,
            size: farm.size_c || 0,
            sizeUnit: farm.size_unit_c || 'acres',
            location: farm.location_c || '',
            createdAt: farm.created_at_c || new Date().toISOString(),
            tags: farm.Tags || ''
          };
        }
      }

      throw new Error('Failed to update farm');
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating farm:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error(error);
        throw error;
      }
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete farm ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }

      throw new Error('Failed to delete farm');
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting farm:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error(error);
        throw error;
      }
    }
  }
}

export default new FarmService();
export default new FarmService();