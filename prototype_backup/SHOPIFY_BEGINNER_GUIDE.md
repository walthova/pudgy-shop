# Beginner's Guide: Setting Up Your Shopify API

This guide will walk you through exactly how to activate the "Storefront API" on Shopify and connect it to your IBG Shop. It is designed for someone who has never done this before.

## Phase 1: Create Your "Custom App" in Shopify
Shopify uses "Apps" to give permission to your code to see your products.

1. **Log in to your Shopify Admin** (e.g., `your-store.myshopify.com/admin`).
2. **Go to Settings**: Look for the gear icon ⚙️ at the bottom left.
3. **Select "Apps and sales channels"**: In the left-hand sidebar.
4. **Click "Develop apps"**: It's a button at the top right.
5. **Click "Create an app"**:
   - Give it a name like `IBG Pop-Up Shop`.
   - Select yourself as the **App developer**.
   - Click **Create app**.

---

## Phase 2: Set API Permissions
Now you need to tell Shopify that this app is allowed to show products.

1. **Click "Configuration"**: This is a tab in the center of your new app page.
2. **Find "Storefront API integration"**: (Usually the second box).
3. **Click "Configure"**:
4. **Select these permissions (Scopes)**: Check the boxes for:
   - `unauthenticated_read_product_listings` (To see your list of products).
   - `unauthenticated_read_product_inventory` (To see if things are in stock).
   - `unauthenticated_write_checkouts` (To allow the "Checkout" button to work).
5. **Click "Save"**: At the bottom or top right.

---

## Phase 3: Get Your API Credentials
This is the "Key" that connects your website to your store.

1. **Click "API credentials"**: This is a tab next to Configuration.
2. **Click "Install app"**: Confirm by clicking the purple button.
3. **Copy your Public Access Token**: 
   > [!IMPORTANT]
   > You only need the **Storefront API access token**. It usually starts with `shpat_` or similar. Do NOT use the Admin API token.
4. **Note your Shop Domain**: This is your store's URL (e.g., `ibg-relics.myshopify.com`).

---

## Phase 4: Put the Secrets into Your Code
Now, go to your file `IBG_Shop_Prototype.jsx`.

Look for the `mockProducts` section. To make it real, a developer (or I can help you) will add a small piece of code called a `fetch` request.

### What it looks like for a beginner:
Inside the code, we will use your **Domain** and **Token** like this:

```javascript
// Replace these with your actual info from Phase 3
const SHOPIFY_DOMAIN = 'your-store.myshopify.com';
const STOREFRONT_ACCESS_TOKEN = 'your_copied_token_here';
```

---

## Phase 5: Testing Your First Product
Once the API is active:
1. Go to your Shopify Admin > **Products**.
2. Make sure at least one product is set to **"Active"**.
3. Under **Product status**, check that "Market" and "Point of Sale" include your new App.

---

### What to do next?
If you have your **Token** and **Domain** ready, paste them here and I can write the final logic to "turn on" the live data for you!
