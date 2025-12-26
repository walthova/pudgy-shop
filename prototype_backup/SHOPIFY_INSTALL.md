# IBG Pop-Up Shop: Shopify Installation Guide

This React prototype is structured to be "Shopify Ready" via the **Shopify Storefront API**. Here is how to implement it:

## 1. Prerequisites
- A Shopify Store.
- A **Storefront Access Token** (created in Shopify Admin > Apps and sales channels > Develop apps).

## 2. Implementation Options

### Option A: Shopify Hydrogen (Recommended)
If you are building a custom React storefront:
1. Copy [IBG_Shop_Prototype.jsx](file:///Users/w.m/.gemini/antigravity/scratch/pudgy-shop/IBG_Shop_Prototype.jsx) into your `app/components` folder.
2. In your page loader, fetch products using the Shopify GraphQL API.
3. Pass the products to the `IBGShop` component.

### Option B: Custom Shopify Liquid Theme
To use this inside a standard Shopify Liquid theme:
1. Build this React component into a **Web Component** or a bundle using Vite.
2. Upload the JS/CSS assets to your Shopify theme files.
3. Create a custom `liquid` section that renders the container:
   ```html
   <div id="ibg-shop-container"></div>
   ```
4. Pass Shopify's Liquid product data into the component as a JSON object.

## 3. Data Mapping
The component expects an array of products in this format:
```javascript
{
  id: "gid://shopify/Product/...",
  title: "Product Name",
  handle: "product-handle",
  price: 100.00,
  images: [{ url: "..." }],
  description: "...",
  badge: "...", // Optional
  variants: [{ id: "gid://shopify/ProductVariant/..." }]
}
```

## 4. Customization
- **Colors**: Open [IBG_Shop_Prototype.jsx](file:///Users/w.m/.gemini/antigravity/scratch/pudgy-shop/IBG_Shop_Prototype.jsx) and edit the `IBG_SHOP_CONFIG` object at the top.
- **Images**: All images are currently placeholders. Once connected to Shopify, these will automatically be replaced by your real product images.
- **Shopify Flow**: The "Checkout" button should be linked to the `checkoutUrl` returned by the Shopify Storefront API's `checkoutCreate` mutation.
