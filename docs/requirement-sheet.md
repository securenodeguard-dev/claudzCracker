# Product Enhancement Requirements Sheet

## 1. Product video support
- Add a YouTube video URL field in the admin product form.
- Store the field in the product database.
- Show a video preview on the consumer product detail page.
- Open the video in a modal popup without leaving the current page.
- Accept common YouTube formats such as watch URLs and short links.

## 2. Price update modes
- Keep a single regular price mode for standard products.
- Add an offer mode that supports:
  - original price (strikethrough)
  - offer price (highlighted as active price)
- Admin can choose between regular and offer pricing options while editing a product.
- Consumer pages should show the original price as struck-through when offer mode is used.

## 3. WhatsApp lead capture and admin follow-up
- Provide a customer order capture flow that collects:
  - customer name
  - mobile number
  - WhatsApp number if applicable
  - selected products
  - delivery address
  - source / lead source
- Build a message template for sending the customer requirement to WhatsApp.
- Admin should see lead details in a dedicated dashboard or order list to call the customer back.

## 4. Cart-like order flow
- A customer should be able to add products to a cart or quote list.
- Cart should show selected items and totals.
- Final order can be pushed to WhatsApp or saved as a lead record for admin confirmation.

## 5. Acceptance criteria
- Admin can upload a product with a YouTube video link.
- Consumer product pages display the video preview and open it in-page.
- Offer price mode visually shows old price with strike-through and new offer price.
- Order captures include customer and product details for admin follow-up.
- The admin can confirm or call the customer from the captured lead information.
