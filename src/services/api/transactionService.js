class TransactionService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'transaction_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "type_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "amount_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "Tags" } },
          {
            field: { Name: "farm_id_c" },
            referenceField: { field: { Name: "Name" } }
          }
        ],
        orderBy: [
          {
            fieldName: "date_c",
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

      return response.data.map(transaction => ({
        Id: transaction.Id,
        type: transaction.type_c || 'expense',
        category: transaction.category_c || 'Other Expense',
        amount: transaction.amount_c || 0,
        date: transaction.date_c || new Date().toISOString(),
        description: transaction.description_c || transaction.Name || '',
        farmId: transaction.farm_id_c?.Id || transaction.farm_id_c,
        farmName: transaction.farm_id_c?.Name || 'All Farms',
        tags: transaction.Tags || ''
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching transactions:", error?.response?.data?.message);
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
          { field: { Name: "type_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "amount_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "description_c" } },
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

      const transaction = response.data;
      return {
        Id: transaction.Id,
        type: transaction.type_c || 'expense',
        category: transaction.category_c || 'Other Expense',
        amount: transaction.amount_c || 0,
        date: transaction.date_c || new Date().toISOString(),
        description: transaction.description_c || transaction.Name || '',
        farmId: transaction.farm_id_c?.Id || transaction.farm_id_c,
        farmName: transaction.farm_id_c?.Name || 'All Farms',
        tags: transaction.Tags || ''
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching transaction with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  async create(transactionData) {
    try {
      const params = {
        records: [
          {
            Name: transactionData.description || `${transactionData.type} - ${transactionData.category}`,
            type_c: transactionData.type || 'expense',
            category_c: transactionData.category || 'Other Expense',
            amount_c: parseFloat(transactionData.amount) || 0,
            date_c: transactionData.date || new Date().toISOString(),
            description_c: transactionData.description || '',
            farm_id_c: parseInt(transactionData.farmId),
            Tags: transactionData.tags || ''
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
          console.error(`Failed to create transaction ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const transaction = successfulRecords[0].data;
          return {
            Id: transaction.Id,
            type: transaction.type_c || 'expense',
            category: transaction.category_c || 'Other Expense',
            amount: transaction.amount_c || 0,
            date: transaction.date_c || new Date().toISOString(),
            description: transaction.description_c || transaction.Name || '',
            farmId: transaction.farm_id_c?.Id || transaction.farm_id_c,
            tags: transaction.Tags || ''
          };
        }
      }

      throw new Error('Failed to create transaction');
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating transaction:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error(error);
        throw error;
      }
    }
  }

  async update(id, transactionData) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(id),
            Name: transactionData.description || `${transactionData.type} - ${transactionData.category}`,
            type_c: transactionData.type || 'expense',
            category_c: transactionData.category || 'Other Expense',
            amount_c: parseFloat(transactionData.amount) || 0,
            date_c: transactionData.date || new Date().toISOString(),
            description_c: transactionData.description || '',
            farm_id_c: parseInt(transactionData.farmId),
            Tags: transactionData.tags || ''
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
          console.error(`Failed to update transaction ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const transaction = successfulUpdates[0].data;
          return {
            Id: transaction.Id,
            type: transaction.type_c || 'expense',
            category: transaction.category_c || 'Other Expense',
            amount: transaction.amount_c || 0,
            date: transaction.date_c || new Date().toISOString(),
            description: transaction.description_c || transaction.Name || '',
            farmId: transaction.farm_id_c?.Id || transaction.farm_id_c,
            tags: transaction.Tags || ''
          };
        }
      }

      throw new Error('Failed to update transaction');
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating transaction:", error?.response?.data?.message);
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
          console.error(`Failed to delete transaction ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }

      throw new Error('Failed to delete transaction');
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting transaction:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error(error);
        throw error;
      }
    }
  }
}

export default new TransactionService();

export default new TransactionService();