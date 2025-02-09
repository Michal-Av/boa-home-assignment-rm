import {
  reactExtension,
  useCustomer,
  useApplyCartLinesChange,
  useCartLines,
  Text,
  Button,
  BlockStack,
  Checkbox,
  View,
  InlineStack,
  Grid
} from "@shopify/ui-extensions-react/checkout";
import { useEffect, useState } from "react";

/**
 * Entry point for the "Save Cart" functionality, 
 * using the "purchase.checkout.contact.render-after" extension point.
 * This means the block will be rendered right after the contact section in the Checkout.
 */
export default reactExtension("purchase.checkout.contact.render-after", () => <SaveCartExtension />);

/**
 * Main component for saving and restoring the cart.
 */
function SaveCartExtension() {
  // Hooks from Shopify Checkout UI Extensions
  const cartLines = useCartLines(); // Retrieves the current cart line items
  const customer = useCustomer();   // Retrieves info about the currently logged-in customer
  const applyCartLinesChange = useApplyCartLinesChange(); // Allows modifications to the cart lines

  // React state variables
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [showSaveOptions, setShowSaveOptions] = useState(false); 
  const [savedCartExists, setSavedCartExists] = useState(false); 

  // Your public or ngrok-based URL for proxying requests to your backend
  const APP_PROXY_URL = " https://e1b7-2a06-c701-4741-d400-bc17-9d2e-2020-9b62.ngrok-free.app/shopify/cart";

  /**
   * useEffect will check if the customer is logged in as soon as we have the customer data,
   * and if logged in, it will call checkForSavedCart() to see if the user has an existing saved cart.
   */
  useEffect(() => {
    if (customer !== undefined) {
      setIsLoggedIn(customer && customer.id ? true : false);
      setIsLoaded(true);
      if (isLoggedIn) {
        checkForSavedCart();
      }
    }
  }, [customer]);

  /**
   * checkForSavedCart() makes a GET request to retrieve a previously saved cart for this customer.
   * If a saved cart is found, we store it in the cartItems state and set savedCartExists to true.
   */
  async function checkForSavedCart() {
    try {
      const url = `${APP_PROXY_URL}/retrieve?shop=mystore&customerId=${extractId(customer.id)}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true"
        }
      });

      if (!response.ok) throw new Error("Server returned error");

      const data = await response.json();
      if (data.cartItems) {
        setCartItems(data.cartItems);
        setSavedCartExists(true);
      }
    } catch (error) {
      console.error("Error fetching saved cart:", error);
      setSavedCartExists(false);
    }
  }

  /**
   * toggleSelection() manages a set of selected cart line item IDs.
   * If an ID is already in the set, it's removed (unselected); 
   * otherwise, it's added (selected).
   */
  function toggleSelection(id) {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }

  /**
   * saveCart() is triggered by "Confirm Save" after the user selects items.
   * It sends a POST request to your backend to store the selected cart lines for the user.
   */
  function saveCart(cartLines, customer) {
    console.log(cartLines);

    // Filters out only the checked (selected) items
    const selectedCartItems = cartLines
      .filter(item => selectedItems.has(item.id))
      .map(item => ({
        id: extractId(item.merchandise.id),
        name: item.merchandise.title,
        price: item.cost.totalAmount.amount
      }));

    if (selectedCartItems.length === 0) {
      console.log("No items selected.");
      return;
    }

    const cartItems = {
      shop: "mystore",
      cartItems: selectedCartItems,
      customerId: extractId(customer.id)
    };

    fetch(`${APP_PROXY_URL}/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cartItems),
    })
      .then((res) => res.json())
      .then(data => {
        if (data.error) {
          console.error("Error saving cart:", data.error);
        } else {
          console.log("Cart saved successfully!");
          setSavedCartExists(true);
          setShowSaveOptions(false);
          setCartItems(selectedCartItems);
        }
      })
      .catch(error => {
        console.error("Request failed:", error);
      });
  }

  /**
   * restoreCart() retrieves the saved cartItems from state,
   * and adds them back into the current cart using applyCartLinesChange.
   */
  async function restoreCart() {
    console.log("Restoring saved cart:", cartItems);
    
    try {
      if (!cartItems || cartItems.length === 0) {
        console.error("No items in saved cart.");
        return;
      }

      // Loop through each saved item and add it to the current cart
      for (const item of cartItems) {
        const result = await applyCartLinesChange({
          type: "addCartLine",
          merchandiseId: `gid://shopify/ProductVariant/${item.id}`,
          quantity: item.quantity || 1,
        });

        if (result.type === "error") {
          console.error(`Failed to add item ${item.id} to cart:`, result.message);
        } else {
          console.log(`Item ${item.id} added successfully to cart`);
        }
      }
    } catch (error) {
      console.error("Error restoring cart:", error);
    }
  }

  /**
   * Renders the UI block:
   * - Title "Save Your Cart"
   * - Buttons to save or retrieve the cart, shown only if user is logged in
   * - If user isn't logged in, shows a prompt to log in
   */
  return (
    <View border="base" padding="base" borderRadius="large">
      <BlockStack spacing="loose">
        <Text size="extraLarge" emphasis="bold">Save Your Cart 🛒</Text>
  
        {isLoggedIn ? (
          <>
            {savedCartExists ? (
              <Grid columns={["1fr", "1fr"]} spacing="base">
                <Button kind="secondary" onPress={restoreCart}>
                  Retrieve Saved Cart
                </Button>
                <Button kind="secondary" onPress={() => setShowSaveOptions(true)}>
                  Save Cart
                </Button>
              </Grid>
            ) : (
              <Text size="medium">No saved cart found.</Text>
            )}
  
            {showSaveOptions && (
              <>
                {cartLines.length > 0 ? (
                  <BlockStack spacing="tight">
                    {cartLines.map((line) => (
                      <InlineStack key={line.id} spacing="base">
                        <Checkbox
                          name={line.id}
                          onChange={() => toggleSelection(line.id)}
                          checked={selectedItems.has(line.id)}
                        >
                          {line.merchandise.title}
                        </Checkbox>
                      </InlineStack>
                    ))}
                  </BlockStack>
                ) : (
                  <Text size="medium">Your cart is empty.</Text>
                )}
                <Button kind="primary" onPress={() => saveCart(cartLines, customer)}>
                  Confirm Save ✅
                </Button>
              </>
            )}
          </>
        ) : (
          <Text emphasis="bold">
            🔒 You need to log in to use this feature.
          </Text>
        )}
      </BlockStack>
    </View>
  );
}

/**
 * extractId() extracts the numeric ID from Shopify's GraphQL GID format.
 * For example: "gid://shopify/ProductVariant/123456789" --> "123456789".
 */
function extractId(gid) {
  const match = gid.match(/(\d+)$/);
  return match ? match[0] : null;
}
