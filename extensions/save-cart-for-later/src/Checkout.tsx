import {
  reactExtension,
  useCustomer,
  useApi,
  useTranslate,
  useSettings,
  useCartLines, Text, Button, BlockStack, Checkbox,View, InlineStack
} from "@shopify/ui-extensions-react/checkout";
import { useEffect, useState } from "react";

export default reactExtension("purchase.checkout.block.render", () => <SaveCartExtension />);

function SaveCartExtension() {
  const cartLines = useCartLines();
  const customer = useCustomer();

  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (customer !== undefined) {
      setIsLoggedIn(customer && customer.id ? true : false);
      setIsLoaded(true);
    }
  }, [customer]);


  return (
    
    <View 
    border="base"
    padding="base"
    borderRadius="large"
  >
      <BlockStack spacing="loose">
  
        <Text size="extraLarge" emphasis="bold">Save Your Cart 🛒 </Text>
        {isLoggedIn ? (
          <>
        {cartLines.length > 0 ? (
          <BlockStack spacing="tight">
            {cartLines.map((line) => (
              <InlineStack key={line.id} spacing="base">
                 <Checkbox name={line.id}>{line.merchandise.title}</Checkbox>
              </InlineStack>
            ))}
          </BlockStack>
        ) : (
          <Text size="medium">Your cart is empty.</Text>
        )}

        <Button kind="primary" onPress={() => saveCart(cartLines)}>
          Save Cart
        </Button>
        </>
        ) : (
          // אם המשתמש לא מחובר
          <Text emphasis="bold">
            🔒 You need to log in to use this feature.
          </Text>
        )}
      </BlockStack>
    </View>
  );
}

function saveCart(cartLines) {
  // נבצע קריאה לשרת שלנו (נגדיר אותו בשלב הבא)
  fetch("/apps/cart/save", {
    method: "POST",
    body: JSON.stringify({ cartItems: cartLines }),
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res.json())
    .then((data) => alert("Cart saved!"))
    .catch((err) => console.error("Error saving cart:", err));
}
