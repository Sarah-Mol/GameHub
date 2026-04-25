// Maneja persistencia y operaciones del carrito en sessionStorage.
const CART_KEY = "gamehub-cart";

export function getCart() {
  const rawCart = sessionStorage.getItem(CART_KEY);
  return rawCart ? JSON.parse(rawCart) : [];
}

export function saveCart(cart) {
  sessionStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addToCart(product) {
  const cart = getCart();
  const existingProduct = cart.find((item) => item.id === product.id);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart(cart);
  return cart;
}

export function updateQuantity(productId, quantity) {
  const safeQuantity = Math.max(1, Number(quantity) || 1);
  const cart = getCart().map((item) =>
    item.id === productId ? { ...item, quantity: safeQuantity } : item,
  );

  saveCart(cart);
  return cart;
}

export function removeFromCart(productId) {
  const cart = getCart().filter((item) => item.id !== productId);
  saveCart(cart);
  return cart;
}

export function clearCart() {
  saveCart([]);
  return [];
}

export function getCartCount() {
  return getCart().reduce((total, item) => total + item.quantity, 0);
}

export function getCartTotal() {
  return getCart().reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
}
