class CropService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'crop_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "crop_type_c" } },
          { field: { Name: "field_c" } },
          { field: { Name: "planting_date_c" } },
          { field: { Name: "expected_harvest_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "Tags" } },
          {
            field: { Name: "farm_id_c" },
            referenceField: { field: { Name: "Name" } }
          }
        ],
        orderBy: [
          {
            fieldName: "planting_date_c",
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

      return response.data.map(crop => ({
        Id: crop.Id,
        cropType: crop.crop_type_c || crop.Name,
        field: crop.field_c || '',
        plantingDate: crop.planting_date_c || new Date().toISOString(),
        expectedHarvest: crop.expected_harvest_c || new Date().toISOString(),
        status: crop.status_c || 'Planned',
        notes: crop.notes_c || '',
        farmId: crop.farm_id_c?.Id || crop.farm_id_c,
        farmName: crop.farm_id_c?.Name || 'Unknown Farm',
        tags: crop.Tags || ''
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching crops:", error?.response?.data?.message);
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
          { field: { Name: "crop_type_c" } },
          { field: { Name: "field_c" } },
          { field: { Name: "planting_date_c" } },
          { field: { Name: "expected_harvest_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "Tags" } },
          {
            field: { Name: "farm_id_c" },
            referenceField: { field: { Name: "Name" } }
          }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response || !response.data) {
        return null;
      }

      const crop = response.data;
      return {
        Id: crop.Id,
        cropType: crop.crop_type_c || crop.Name,
        field: crop.field_c || '',
        plantingDate: crop.planting_date_c || new Date().toISOString(),
        expectedHarvest: crop.expected_harvest_c || new Date().toISOString(),
        status: crop.status_c || 'Planned',
        notes: crop.notes_c || '',
        farmId: crop.farm_id_c?.Id || crop.farm_id_c,
        farmName: crop.farm_id_c?.Name || 'Unknown Farm',
        tags: crop.Tags || ''
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching crop with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  async create(cropData) {
    try {
      const params = {
        records: [
          {
            Name: cropData.cropType || '',
            crop_type_c: cropData.cropType || '',
            field_c: cropData.field || '',
            planting_date_c: cropData.plantingDate || new Date().toISOString(),
            expected_harvest_c: cropData.expectedHarvest || new Date().toISOString(),
            status_c: cropData.status || 'Planned',
            notes_c: cropData.notes || '',
            farm_id_c: parseInt(cropData.farmId),
            Tags: cropData.tags || ''
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
          console.error(`Failed to create crop ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const crop = successfulRecords[0].data;
          return {
            Id: crop.Id,
            cropType: crop.crop_type_c || crop.Name,
            field: crop.field_c || '',
            plantingDate: crop.planting_date_c || new Date().toISOString(),
            expectedHarvest: crop.expected_harvest_c || new Date().toISOString(),
            status: crop.status_c || 'Planned',
            notes: crop.notes_c || '',
            farmId: crop.farm_id_c?.Id || crop.farm_id_c,
            tags: crop.Tags || ''
          };
        }
      }

      throw new Error('Failed to create crop');
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating crop:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error(error);
        throw error;
      }
    }
  }

  async update(id, cropData) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(id),
            Name: cropData.cropType || '',
            crop_type_c: cropData.cropType || '',
            field_c: cropData.field || '',
            planting_date_c: cropData.plantingDate || new Date().toISOString(),
            expected_harvest_c: cropData.expectedHarvest || new Date().toISOString(),
            status_c: cropData.status || 'Planned',
            notes_c: cropData.notes || '',
            farm_id_c: parseInt(cropData.farmId),
            Tags: cropData.tags || ''
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
          console.error(`Failed to update crop ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const crop = successfulUpdates[0].data;
          return {
            Id: crop.Id,
            cropType: crop.crop_type_c || crop.Name,
            field: crop.field_c || '',
            plantingDate: crop.planting_date_c || new Date().toISOString(),
            expectedHarvest: crop.expected_harvest_c || new Date().toISOString(),
            status: crop.status_c || 'Planned',
            notes: crop.notes_c || '',
            farmId: crop.farm_id_c?.Id || crop.farm_id_c,
            tags: crop.Tags || ''
          };
        }
      }

      throw new Error('Failed to update crop');
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating crop:", error?.response?.data?.message);
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
          console.error(`Failed to delete crop ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }

      throw new Error('Failed to delete crop');
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting crop:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error(error);
        throw error;
      }
    }
  }
}

export default new CropService();