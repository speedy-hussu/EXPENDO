import { Client, Account, OAuthProvider } from "appwrite";
import config from "../config/config";
export class AuthService {
  client = new Client();
  account;
  constructor() {
    this.client
      .setEndpoint(config.appWriteUrl)
      .setProject(config.appwriteProjectId);
    this.account = new Account(this.client);
  }
  async authLogin() {
    try {
      this.account.createOAuth2Session("google", "http://localhost:5173");
    } catch (e) {
      console.error(e);
    }
  }
  async authLogout() {
    try {
      return await this.account.deleteSessions();
    } catch (e) {
      console.error(e);
    }
  }
  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (e) {
      console.log("No user logged in");
    }
  }
}

const authService = new AuthService();
export default authService;
