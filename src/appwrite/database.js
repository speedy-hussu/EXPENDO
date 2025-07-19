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
}
const dbService = new Service();
export default dbService;
