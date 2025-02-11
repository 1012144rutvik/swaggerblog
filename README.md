# Creating a Vite + Tailwind CSS + TypeScript Project with Swagger-Generated Client

## Introduction
In this blog, we will walk through the step-by-step process of creating a Vite project with Tailwind CSS and TypeScript. Additionally, we will integrate a Swagger-generated client for API calls using TypeScript, which significantly speeds up API integration. This approach ensures faster development by automatically generating TypeScript types and API methods, reducing manual effort and potential errors. We will cover everything from project setup to making authenticated API calls efficiently.

## Step 1: Create a Vite Project

To start, we need to create a Vite project. Vite is a build tool that aims to provide a faster and leaner development experience for modern web projects. Run the following command to create a Vite project:
for more information [ https://vite.dev/guide/ ]

```bash
npm create vite@latest
```
## Stap2:Install Tailwind CSS
Next, we need to install Tailwind CSS along with its peer dependencies. Tailwind CSS is a utility-first CSS framework for rapidly building custom user interfaces.

Run the following commands to install Tailwind CSS and generate the necessary configuration files:
```bash
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
```
## Step3: Configure Your Template Paths
After installing Tailwind CSS, we need to configure the template paths in the `tailwind.config.js` file. This configuration is necessary for Tailwind to purge unused styles in production builds. Update the `tailwind.config.js` file as follows:

```bash
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```
## Step 4: Add Tailwind Directives to Your CSS
Next, add the Tailwind directives for each of Tailwind’s layers to your `./src/index.css` file. These directives will include Tailwind's base styles, components, and utilities.
```bash
@tailwind base;
@tailwind components;
@tailwind utilities;
```
## Step 5: Run Your Project
Now, you can run your Vite project to see Tailwind CSS in action. Use the following command to start the development server:
```bash
npm run dev
```
# Integrating Swagger-Generated Client with TypeScript
## Step6: Install OpenAPI Generator
If you have Swagger documentation, generate API client classes using OpenAPI Generator:
[https://www.npmjs.com/package/@openapitools/openapi-generator-cli/v/2.0.0]
```bash
npm install @openapitools/openapi-generator-cli -g
```
## Step7: Install Necessary Packages
Install any additional packages you might need. If you're using Axios for HTTP requests, you can install it with:
[https://www.npmjs.com/package/axios]
```bash
npm i axios
```
## Step8: Create a Root Folder
Create a root folder for your Swagger contract files. For example, you can name it `Contract`.
## Step9:Create Swagger YAML File
Inside the Contract folder, create a file named `AuthSwagger.yaml` This file will contain your Swagger documentation.
## Step10:Create .env File
Create a `.env` file in the root of your project and add the following line to specify the base URL for your API:
```bash
VITE_BASE_URL='http://localhost:8000'
```
## Step 11: Generate Swagger Client

Use the OpenAPI Generator CLI to generate the client classes from your Swagger documentation. Run the following command:

```bash
openapi-generator-cli generate -i ./Contract/AuthSwagger.yaml -g typescript-axios -o src/api/authentication
```
### **Explanation of Flags:**
- **`-i ./Contract/AuthSwagger.yaml`**  
  - `-i` stands for **input file**.  
  - Specifies the OpenAPI specification file (`AuthSwagger.yaml`) that defines the API contract.  
  - This file is used to generate the API client.

- **`-g typescript-axios`**  
  - `-g` stands for **generator type**.  
  - Specifies the programming language and HTTP client for code generation.  
  - `typescript-axios` generates a TypeScript API client using Axios.

- **`-o src/api/authentication`**  
  - `-o` stands for **output directory**.  
  - Specifies where the generated API client code will be stored.  
  - In this case, it will be placed in `src/api/authentication`.

## step 12:Create API Configuration File
Create a new file named `apiConfigration.ts` inside the src/api folder. This file will configure the generated API client
```bash
import { Configuration, AuthenticationApi } from "../api/authentication";

// authentication api's configuration
const config = new Configuration({ basePath: import.meta.env.VITE_BASE_URL });
const authenticationApi = new AuthenticationApi(config);

export { config, authenticationApi };

```
## Step 13: Install React Router
Install React Router for navigation within your application:
``` bash
npm install react-router-dom
```
## Step 14: Create Login Page
Create a `login.tsx` file inside the src/pages folder. This file will contain the login form and logic:
```bash
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginRequest } from "../api/authentication";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { authenticationApi } from "../api/apiConfigration";

const Login = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const loginRequest: LoginRequest = { emailOrUsername, password };
      const response = await authenticationApi.login(loginRequest);
      if (response.data.challenge === "2fa") {
        toast.success(response.data.message);
        navigate("/verify-otp", { state: { userId: response.data.userId } });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Login failed", error);
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <ToastContainer />
      <div className="bg-white bg-opacity-10 backdrop-blur-lg p-8 rounded-lg shadow-lg w-96 border border-gray-700">
        <h2 className="text-3xl font-semibold text-white text-center mb-6">Login</h2>
        <input
          type="text"
          placeholder="Email or Username"
          value={emailOrUsername}
          onChange={(e) => setEmailOrUsername(e.target.value)}
          className="mb-4 p-3 w-full rounded-lg bg-gray-800 text-white border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 p-3 w-full rounded-lg bg-gray-800 text-white border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleLogin}
          className={`w-full p-3 rounded-lg bg-blue-500 text-white font-semibold ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600 transition"}`}
          disabled={loading}
        >
          {loading ? "Loading..." : "Login"}
        </button>
        <p className="mt-4 text-center text-gray-400">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-400 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>  
  );
};

export default Login;
```
## Step 15: Setup Main Entry Point
UPDATE a `main.tsx` file in the src folder. This file will configure the React Router and render the application:
```bash
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Login from './pages/login';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  }
]);

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
);
```
### To check Intigration visit This repo
[https://github.com/1012144rutvik/swaggerblog]