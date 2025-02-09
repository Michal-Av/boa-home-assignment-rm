BOA-Home Shopify App
This repository contains a Shopify App with a custom Checkout UI Extension that enables users to save and restore their cart items during checkout. The project is split into several parts: a backend, a frontend, shared libraries, and the actual extension files.

Table of Contents
Introduction
Project Structure
Extension: Save-Cart-for-Later
Installation & Setup
Local Development
Deployment
Environment Variables
Additional Notes
Introduction
The Save Cart feature allows logged-in Shopify customers to select items in their current cart and save them for later use. When they return to checkout in the future, they can easily restore these saved items to the new cart.

In this project, you’ll find:

A backend for handling data persistence (saving/retrieving carts).
A frontend (if you have any custom UI beyond the extension).
A Checkout UI Extension in the extensions/save-cart-for-later folder that integrates with Shopify’s new checkout and displays the “Save” and “Retrieve” functionality.
Project Structure
Here is an overview of the folders and files based on the screenshot:

kotlin
Copy
Edit
BOA-HOME/
├─ .shopify/                   // Shopify-specific metadata (auto-generated)
│
├─ extensions/
│   └─ save-cart-for-later/    // Our custom Checkout UI Extension
│       ├─ dist/              // Compiled/dist output for the extension
│       ├─ locales/           // Translation files (if any)
│       ├─ src/
│       │   └─ Checkout.tsx   // Main extension code (React-based)
│       ├─ README.md          // Extension-specific README (optional)
│       ├─ shopify.extension.toml // Extension config (defines target, etc.)
│       ├─ tsconfig.json
│       └─ node_modules
│
├─ node_modules/               // App-level dependencies
│
├─ src/
│   ├─ backend/                // Backend logic (e.g., Node/Express or other)
│   ├─ frontend/               // Frontend logic (if separate from extension)
│   └─ libs/                   // Shared libraries/modules
│
├─ .env                        // Environment variables for local dev
├─ .gitignore
├─ index.ts                    // Entry point (possibly for a Node server or framework)
├─ package-lock.json
├─ package.json
├─ shopify.ts                  // Common Shopify config or server logic
├─ shopify.web.toml            // App-level web configuration for Shopify
├─ shopify.app.toml            // Main Shopify app configuration
├─ tsconfig.json               // TypeScript configuration
└─ (other files as needed)
Key Folders
extensions/save-cart-for-later/
Contains all code and configuration for the Checkout UI Extension.
src/backend/
Where the server logic resides (e.g., saving/retrieving cart items, database connections, etc.).
src/frontend/
Any custom frontend code, if you have a merchant-facing UI or additional features outside of checkout.
src/libs/
Shared libraries or utility functions used across backend or frontend.
Extension: Save-Cart-for-Later
This folder is where the actual checkout extension logic lives. The primary file is Checkout.tsx:

Checkout.tsx

Utilizes Shopify’s UI Extensions React APIs to:
Detect if the customer is logged in.
Display a list of current cart items with checkboxes.
Save selected items to a backend when “Confirm Save” is clicked.
Restore previously saved items into the current cart.
shopify.extension.toml

Defines the extension type (ui_extension).
Points to the extension’s JavaScript or TypeScript entry file (e.g., module = "./src/Checkout.tsx").
Specifies where the extension appears in checkout (target = "purchase.checkout.contact.render-after" or another extension point).
For more details on how the extension works, see the in-file comments in Checkout.tsx.

Installation & Setup
Clone this repository or download it to your local machine.
Install dependencies in the root folder:
bash
Copy
Edit
npm install
or
bash
Copy
Edit
yarn
Set up environment variables in .env (see Environment Variables).
Local Development
1. Shopify App / Backend
If your app uses Shopify CLI, run:

bash
Copy
Edit
shopify app serve
This may start a local server, open an ngrok tunnel, and let you preview the app and any web endpoints.

If you have a separate command to run the backend (e.g., Node/Express):

bash
Copy
Edit
npm run dev:backend
or something similar, depending on your script definitions in package.json.

2. Checkout UI Extension
Inside the extensions/save-cart-for-later folder, you can run:

bash
Copy
Edit
npm run dev
(or yarn dev) to start the extension development server. This will:

Build the extension in watch mode.
Open a tunnel for your extension.
Provide a URL for previewing the extension in your development store’s checkout.
Deployment
Deploy the App

If you’re using Shopify CLI, run in the root directory:
bash
Copy
Edit
shopify app deploy
This will upload and register your app (and any included extensions) with Shopify.
Deploy the Extension Only (optional)

If you need to deploy just the extension, navigate to extensions/save-cart-for-later and run:
bash
Copy
Edit
shopify extension deploy
This updates only the Checkout UI Extension code.
Verify in Shopify Admin

Go to Settings → Checkout → Customize checkout in your development or live Shopify store.
You should see the “Save Cart” extension block in the checkout editor. Drag it to your desired location if needed (unless you explicitly set a different target that is fixed).
Environment Variables
A typical .env might include values such as:

ini
Copy
Edit
SHOPIFY_API_KEY=...
SHOPIFY_API_SECRET=...
HOST=...
APP_URL=...
APP_PROXY_URL=...
NGROK_AUTH_TOKEN=...
DATABASE_URL=...
Make sure to update your environment variables to match your actual setup.
Do not commit the .env file to version control if it contains sensitive data.
Additional Notes
You must be logged in as a Shopify customer in checkout for the “Save Cart” functionality to appear.
Data Storage: Ensure your backend (src/backend) has the necessary code to store and retrieve saved cart items (e.g., in a database).
Customization: Feel free to update extension point, UI layout, or styles based on your store’s needs.
If you have any questions or run into issues, please open an issue or contact the project maintainers.

Enjoy saving and restoring your cart with the BOA-Home Shopify App!
