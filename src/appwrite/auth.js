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
      const redirectURL = window.location.hostname.includes("localhost")
        ? "http://localhost:5173"
        : "https://ur-expendo.netlify.app";

      return await this.account.createOAuth2Session(
        "google",
        redirectURL,
        redirectURL
      );
    } catch (e) {
      console.error("OAuth login failed:", e);
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
