import config from "../config/config";
import { Client, ID, Databases, Query } from "appwrite";

export class Service {
  client = new Client();
  databases;

  constructor() {
    this.client
      .setEndpoint(config.appWriteUrl)
      .setProject(config.appwriteProjectId);
    this.databases = new Databases(this.client);
  }

  async createGroup(userId, groupName) {
    try {
      return await this.databases.createDocument(
        config.appwriteDatabaseId,
        config.appwriteGroupCollectionId,
        ID.unique(),
        { userId, groupName }
      );
    } catch (e) {
      console.error(e);
    }
  }
  async getGroups(userId) {
    return await this.databases.listDocuments(
      config.appwriteDatabaseId,
      config.appwriteGroupCollectionId,
      [Query.equal("userId", userId)]
    );
  }
  async getGroup(groupId) {
    try {
      return await this.databases.getDocument(
        config.appwriteDatabaseId,
        config.appwriteGroupCollectionId,
        groupId
      );
    } catch (e) {
      console.error(e);
    }
  }
  async deleteGroupAndExpenses(groupId) {
    try {
      // 1. Delete all expenses linked to the group
      const expenseDocs = await this.databases.listDocuments(
        config.appwriteDatabaseId,
        config.appwriteExpenseCollectionId,
        [Query.equal("groupId", groupId)]
      );

      for (const expense of expenseDocs.documents) {
        await this.databases.deleteDocument(
          config.appwriteDatabaseId,
          config.appwriteExpenseCollectionId,
          expense.$id
        );
      }

      // 2. Delete the group document
      await this.databases.deleteDocument(
        config.appwriteDatabaseId,
        config.appwriteGroupCollectionId,
        groupId // Make sure this is the group's $id
      );

      console.log("Group and its expenses deleted successfully.");
    } catch (error) {
      console.error("Error deleting group and expenses:", error);
    }
  }

  async addExpenseToGroup(groupId, userId, title, amount, date) {
    try {
      return await this.databases.createDocument(
        config.appwriteDatabaseId,
        config.appwriteExpenseCollectionId,
        ID.unique(),
        { groupId, title, userId, amount, date }
      );
    } catch (e) {
      console.error(e);
    }
  }
  async getExpenses(groupId) {
    try {
      return await this.databases.listDocuments(
        config.appwriteDatabaseId,
        config.appwriteExpenseCollectionId,
        [Query.equal("groupId", groupId)]
      );
    } catch (e) {
      console.error(e);
    }
  }
  async deleteExpense(expenseId) {
    return await this.databases.deleteDocument(
      config.appwriteDatabaseId,
      config.appwriteExpenseCollectionId,
      expenseId
    );
  }
  async updateExpense(expenseId, title, amount, date) {
    try {
      return await this.databases.updateDocument(
        config.appwriteDatabaseId,
        config.appwriteExpenseCollectionId,
        expenseId,
        { title, amount, date }
      );
    } catch (e) {
      console.error(e);
    }
  }
}
const dbService = new Service();
export default dbService;
