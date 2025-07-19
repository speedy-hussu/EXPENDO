const config = {
  appWriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
  appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
  appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
  appwriteGroupCollectionId: String(
    import.meta.env.VITE_APPWRITE_GROUP_COLLECTION_ID
  ),
  appwriteExpenseCollectionId: String(
    import.meta.env.VITE_APPWRITE_EXPENSE_COLLLECTION_ID
  ),
};
export default config;
