import {
  createProduct,
  deleteProduct,
  fetchProducts,
  updateProduct,
} from "./api.js";
import {
  addToCart,
  clearCart,
  getCart,
  getCartCount,
  getCartTotal,
  removeFromCart,
  updateQuantity,
} from "./cart.js";
import {
  enableFormValidation,
  fillAdminForm,
  hideFeedback,
  renderAdminProducts,
  renderCart,
  renderPagination,
  renderProducts,
  showAddToCartModal,
  showFeedback,
  updateCartIndicators,
} from "./ui.js";

const PRODUCTS_PER_PAGE = 4;
const cartDrafts = {};

function refreshCartUI() {
  updateCartIndicators(
    getCartCount(),
    getCartTotal(),
    document.querySelectorAll("[data-cart-count]"),
    document.querySelector("#cartTotal"),
    document.querySelector("#cartItemCount"),
    document.querySelector("#checkoutBtn"),
  );
}

function bindActionButtons() {
  document.querySelectorAll("[data-demo-action]").forEach((button) => {
    button.addEventListener("click", () => {
      showFeedback(button.dataset.demoAction, "info");
    });
  });
}

async function initHomePage() {
  const productList = document.querySelector("#productList");
  const prevButton = document.querySelector("#prevPageBtn");
  const nextButton = document.querySelector("#nextPageBtn");
  const pageIndicator = document.querySelector("#pageIndicator");

  if (!productList || !prevButton || !nextButton || !pageIndicator) {
    return;
  }

  const products = await fetchProducts();
  const totalPages = Math.max(1, Math.ceil(products.length / PRODUCTS_PER_PAGE));
  let currentPage = 1;

  const drawPage = () => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const pageProducts = products.slice(start, start + PRODUCTS_PER_PAGE);

    renderProducts(pageProducts, productList);
    renderPagination(currentPage, totalPages, prevButton, nextButton, pageIndicator);
  };

  prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage -= 1;
      drawPage();
    }
  });

  nextButton.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage += 1;
      drawPage();
    }
  });

  productList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-add-to-cart]");
    if (!button) {
      return;
    }

    const productId = button.dataset.addToCart;
    const selectedProduct = products.find((product) => String(product.id) === productId);

    if (!selectedProduct) {
      return;
    }

    addToCart(selectedProduct);
    refreshCartUI();
    showAddToCartModal(selectedProduct.name);
  });

  drawPage();
}

function initCartPage() {
  const cartItemsContainer = document.querySelector("#cartItems");
  const checkoutButton = document.querySelector("#checkoutBtn");

  if (!cartItemsContainer) {
    return;
  }

  const redrawCart = () => {
    const cart = getCart();
    Object.keys(cartDrafts).forEach((productId) => {
      if (!cart.find((item) => String(item.id) === productId)) {
        delete cartDrafts[productId];
      }
    });
    renderCart(cart, cartItemsContainer, cartDrafts);
    refreshCartUI();
  };

  cartItemsContainer.addEventListener("click", (event) => {
    const editButton = event.target.closest("[data-edit-id]");
    const increaseButton = event.target.closest("[data-increase-id]");
    const decreaseButton = event.target.closest("[data-decrease-id]");
    const confirmButton = event.target.closest("[data-confirm-id]");
    const cancelButton = event.target.closest("[data-cancel-id]");
    const removeButton = event.target.closest("[data-remove-id]");

    if (editButton) {
      const productId = editButton.dataset.editId;
      const item = getCart().find((product) => String(product.id) === productId);
      if (item) {
        cartDrafts[productId] = { quantity: item.quantity };
        redrawCart();
      }
      return;
    }

    if (increaseButton) {
      const productId = increaseButton.dataset.increaseId;
      if (cartDrafts[productId]) {
        cartDrafts[productId].quantity += 1;
        redrawCart();
      }
      return;
    }

    if (decreaseButton) {
      const productId = decreaseButton.dataset.decreaseId;
      if (cartDrafts[productId] && cartDrafts[productId].quantity > 1) {
        cartDrafts[productId].quantity -= 1;
        redrawCart();
      }
      return;
    }

    if (confirmButton) {
      const productId = confirmButton.dataset.confirmId;
      if (cartDrafts[productId]) {
        updateQuantity(productId, cartDrafts[productId].quantity);
        delete cartDrafts[productId];
        redrawCart();
        showFeedback("Cantidad actualizada correctamente.", "success");
      }
      return;
    }

    if (cancelButton) {
      const productId = cancelButton.dataset.cancelId;
      delete cartDrafts[productId];
      redrawCart();
      showFeedback("Edicion cancelada.", "secondary");
      return;
    }

    if (removeButton) {
      const productId = removeButton.dataset.removeId;
      delete cartDrafts[productId];
      removeFromCart(productId);
      redrawCart();
      showFeedback("Producto eliminado del carrito.", "warning");
    }
  });

  cartItemsContainer.addEventListener("input", (event) => {
    const input = event.target.closest("[data-quantity-id]");
    if (!input) {
      return;
    }

    const productId = input.dataset.quantityId;
    if (cartDrafts[productId]) {
      cartDrafts[productId].quantity = Math.max(1, Number(input.value) || 1);
      redrawCart();
    }
  });

  if (checkoutButton) {
    checkoutButton.addEventListener("click", () => {
      clearCart();
      Object.keys(cartDrafts).forEach((key) => delete cartDrafts[key]);
      redrawCart();
      showFeedback("Compra finalizada con exito.", "success");
    });
  }

  redrawCart();
}

async function initAdminPage() {
  const form = document.querySelector("#adminProductForm");
  const list = document.querySelector("#adminProductList");

  if (!form || !list) {
    return;
  }

  const drawProducts = async () => {
    const products = await fetchProducts();
    renderAdminProducts(products, list);
  };

  const resetForm = () => {
    form.reset();
    form.classList.remove("was-validated");
    fillAdminForm(form, null);
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    const payload = {
      name: form.elements.productName.value,
      price: form.elements.productPrice.value,
      image: form.elements.productImage.value,
    };

    if (form.elements.productId.value) {
      await updateProduct(form.elements.productId.value, payload);
      showFeedback("Producto actualizado correctamente.", "success");
    } else {
      await createProduct(payload);
      showFeedback("Producto creado correctamente.", "success");
    }

    resetForm();
    await drawProducts();
  });

  form.elements.cancelEdit.addEventListener("click", () => {
    resetForm();
    showFeedback("Edicion cancelada.", "secondary");
  });

  list.addEventListener("click", async (event) => {
    const editButton = event.target.closest("[data-admin-edit]");
    const deleteButton = event.target.closest("[data-admin-delete]");
    const products = await fetchProducts();

    if (editButton) {
      const product = products.find((item) => String(item.id) === editButton.dataset.adminEdit);
      if (product) {
        fillAdminForm(form, product);
        showFeedback("Producto cargado en el formulario para edicion.", "info");
      }
      return;
    }

    if (deleteButton) {
      await deleteProduct(deleteButton.dataset.adminDelete);
      showFeedback("Producto eliminado correctamente.", "warning");
      resetForm();
      await drawProducts();
    }
  });

  resetForm();
  await drawProducts();
}

function initStaticPages() {
  refreshCartUI();
  enableFormValidation();
  bindActionButtons();
}

document.addEventListener("DOMContentLoaded", async () => {
  const page = document.body.dataset.page;

  initStaticPages();
  hideFeedback();

  if (page === "home") {
    await initHomePage();
    return;
  }

  if (page === "cart") {
    initCartPage();
    return;
  }

  if (page === "admin") {
    await initAdminPage();
  }
});
