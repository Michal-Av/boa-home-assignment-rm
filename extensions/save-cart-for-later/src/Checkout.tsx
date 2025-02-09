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
  InlineStack,Grid
} from "@shopify/ui-extensions-react/checkout";
import { useEffect, useState } from "react";

export default reactExtension("purchase.checkout.block.render", () => <SaveCartExtension />);

function SaveCartExtension() {
  const cartLines = useCartLines();
  const customer = useCustomer();
  const applyCartLinesChange = useApplyCartLinesChange();

  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [showSaveOptions, setShowSaveOptions] = useState(false); 
  const [savedCartExists, setSavedCartExists] = useState(false); 

  const APP_PROXY_URL = " https://e1b7-2a06-c701-4741-d400-bc17-9d2e-2020-9b62.ngrok-free.app/shopify/cart";

  useEffect(() => {
    if (customer !== undefined) {
      setIsLoggedIn(customer && customer.id ? true : false);
      setIsLoaded(true);
      if (isLoggedIn) {
        checkForSavedCart();
      }
    }
  }, [customer]);

  async function checkForSavedCart() {
    try {
      
      const url = `${APP_PROXY_URL}/retrieve?shop=mystore&customerId=${extractId(customer.id)}`;
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json",
                   "ngrok-skip-browser-warning": "true"
         },});

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

  function toggleSelection(id) {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id); // אם כבר נבחר – מסירים
      } else {
        newSet.add(id); // אם לא נבחר – מוסיפים
      }
      return newSet;
    });
  }

  /** פונקציה לשמירת עגלה */
  function saveCart(cartLines, customer) {
    console.log(cartLines);
    const selectedCartItems = cartLines
    .filter(item => selectedItems.has(item.id)) // סינון לפי checkbox מסומן בלבד
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
      }
    })
    .catch(error => {
      console.error("Request failed:", error);
    });
  }

  async function restoreCart() {
    console.log("Restoring saved cart:", cartItems);
    
    try {
      if (!cartItems || cartItems.length === 0) {
        console.error("No items in saved cart.");
        return;
      }

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


function extractId(gid) {
  const match = gid.match(/(\d+)$/);
  return match ? match[0] : null;
}
