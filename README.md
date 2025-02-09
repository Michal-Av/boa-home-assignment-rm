# BOA-Home Shopify App

This repository contains a **Shopify App** with a custom **Checkout UI Extension** that enables users to **save** and **restore** their cart items during checkout. The project is split into several parts: a **backend**, a **frontend**, shared libraries, and the actual extension files.

**Two-Part Save Cart Feature**
**Part 1**: Saving the Cart During Checkout (Checkout UI Extension)
This extension (in extensions/save-cart-for-later) allows customers to save their current cart at checkout. As a bonus feature, it also provides the ability to restore a previously saved cart directly from the checkout interface. This way, customers can either save items for later or retrieve them on the spot without leaving the checkout.

**Part 2:** Retrieving the Saved Cart (Shopify Section + App Proxy API)
To enable cart retrieval on the storefront, we added a theme customization feature under sections/import-saved-cart.liquid. This liquid section uses the App Proxy API to fetch the saved cart items from the backend and display them on the site. We placed this section on 
the /cart page, so customers can easily import their previously saved items into the current cart.

---

## Table of Contents

- [Introduction](#introduction)
- [Project Structure](#project-structure)
- [Extension: Save-Cart-for-Later](#extension-save-cart-for-later)
- [Additional Notes](#additional-notes)

---

## Introduction

The **Save Cart** feature allows logged-in Shopify customers to select items in their current cart and save them for later use. When they return to checkout in the future, they can easily restore these saved items to the new cart.

In this project, you’ll find:

- A **backend** for handling data persistence (saving/retrieving carts).  
- A **frontend** (if you have any custom UI beyond the extension).  
- A **Checkout UI Extension** in the `extensions/save-cart-for-later` folder that integrates with Shopify’s new checkout and displays the “Save” and “Retrieve” functionality.

---

## Project Structure

Below is an overview of the folders and files based on the screenshot:
![image](https://github.com/user-attachments/assets/f8b0a917-6f22-4426-8b77-e531b2576f97)



### Key Folders

- **`extensions/save-cart-for-later/`**  
  Contains all code and configuration for the Checkout UI Extension.

- **`src/backend/`**  
  Where the server logic resides (e.g., saving/retrieving cart items, database connections, etc.).

- **`src/frontend/`**  
  Any custom frontend code, if you have a merchant-facing UI or additional features outside of checkout.

- **`src/libs/`**  
  Shared libraries or utility functions used across backend or frontend.

---

## Extension: Save-Cart-for-Later

This folder is where the actual checkout extension logic lives. The primary file is **`Checkout.tsx`**:

- **`Checkout.tsx`**  
  - Utilizes Shopify’s [UI Extensions React APIs](https://shopify.dev/docs/api/checkout-ui-extensions) to:
    - Detect if the customer is logged in.
    - Display a list of current cart items with checkboxes.
    - Save selected items to a backend when “Confirm Save” is clicked.
    - Restore previously saved items into the current cart.

- **`shopify.extension.toml`**  
  - Defines the extension type (`ui_extension`).
  - Points to the extension’s JavaScript/TypeScript entry file (e.g., `module = "./src/Checkout.tsx"`).
  - Specifies **where** the extension appears in checkout, e.g. `target = "purchase.checkout.contact.render-after"`.

For more details on how the extension works, see the in-file comments in `Checkout.tsx`.

---

## Additional Notes
  **- You must be logged in**  as a Shopify customer in checkout for the “Save Cart” functionality to appear.
  **- Data Storage:** Ensure your backend (src/backend) has the necessary code to store and retrieve saved cart items (e.g., in a database).
  **- Customization:** Feel free to update the extension point, UI layout, or styles based on your store’s needs.

💬 Contact

Author: Michal Rahat

Email: michalus.av@gmail.com.
GitHub: Michal-Av
