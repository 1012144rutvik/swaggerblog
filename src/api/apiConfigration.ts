import { Configuration, AuthenticationApi } from "../api/authentication";
// authentication api's configration
const config = new Configuration({ basePath: import.meta.env.VITE_BASE_URL });
const authenticationApi = new AuthenticationApi(config);

export { config, authenticationApi };   

// if you have to one or more swwagger for example Authorization api below
// import  {Configuration as FolderConfig ,FolderApi}  from "../api/folder";
// folder api's configration
// const folderConfig = new FolderConfig({ basePath: import.meta.env.VITE_BASE_URL });
// const folderApi = new FolderApi(config);

// export { folderConfig, folderApi };