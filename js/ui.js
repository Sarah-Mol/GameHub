// Renderiza productos, carrito, administracion y mensajes visuales.
export function formatPrice(value) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function renderProducts(products, container) {
  container.innerHTML = products
    .map(
      (product) => `
        <div class="col-12 col-md-6 col-lg-3">
          <div class="card h-100 shadow-sm">
            <img
              src="${product.image}"
              class="card-img-top p-3 product-card-image"
              alt="${product.name}"
            />
            <div class="card-body text-center d-flex flex-column">
              <h5 class="card-title mt-auto">${product.name}</h5>
              <p class="text-muted">${formatPrice(product.price)}</p>
              <button
                class="btn btn-dark w-100"
                type="button"
                data-add-to-cart="${product.id}"
              >
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>
      `,
    )
    .join("");
}

export function renderPagination(currentPage, totalPages, prevButton, nextButton, indicator) {
  indicator.textContent = `Pagina ${currentPage} de ${totalPages}`;
  prevButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage === totalPages;
}

export function renderCart(cart, container, editingItems = {}) {
  if (!cart.length) {
    container.innerHTML = `
      <div class="empty-state">
        <h4 class="mb-3">Tu carrito esta vacio</h4>
        <p class="text-muted mb-0">Agrega productos desde la pagina principal para comenzar.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = cart
    .map((item) => {
      const isEditing = Boolean(editingItems[item.id]);
      const quantityValue = isEditing ? editingItems[item.id].quantity : item.quantity;

      return `
        <div class="d-flex border p-3 mb-3 rounded bg-white shadow-sm align-items-center cart-row">
          <div class="flex-shrink-0">
            <img
              src="${item.image}"
              class="rounded cart-product-image"
              alt="${item.name}"
            />
          </div>

          <div class="flex-grow-1 ms-3 d-flex flex-column justify-content-center">
            <h5 class="mt-0 mb-1">${item.name}</h5>
            <p class="text-muted mb-2">${formatPrice(item.price)}</p>
            <p class="small mb-2">Subtotal: ${formatPrice(item.price * quantityValue)}</p>
            <div class="d-flex align-items-center flex-wrap gap-2">
              <label for="quantity-${item.id}" class="me-2 mb-0">Cantidad:</label>
              <button
                class="btn btn-outline-secondary btn-sm"
                type="button"
                data-decrease-id="${item.id}"
                ${isEditing ? "" : "disabled"}
              >
                -
              </button>
              <input
                id="quantity-${item.id}"
                type="number"
                class="form-control quantity-input"
                value="${quantityValue}"
                min="1"
                data-quantity-id="${item.id}"
                ${isEditing ? "" : "disabled"}
              />
              <button
                class="btn btn-outline-secondary btn-sm"
                type="button"
                data-increase-id="${item.id}"
                ${isEditing ? "" : "disabled"}
              >
                +
              </button>
            </div>
          </div>

          <div class="d-flex align-items-center ms-3 gap-2 flex-wrap">
            ${
              isEditing
                ? `
              <button class="btn btn-dark btn-sm" type="button" data-confirm-id="${item.id}">
                Confirmar
              </button>
              <button class="btn btn-outline-secondary btn-sm" type="button" data-cancel-id="${item.id}">
                Cancelar
              </button>
            `
                : `
              <button class="btn btn-outline-dark btn-sm" type="button" data-edit-id="${item.id}">
                Editar
              </button>
            `
            }
            <button
              class="btn btn-outline-danger btn-sm"
              type="button"
              data-remove-id="${item.id}"
            >
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      `;
    })
    .join("");
}

export function renderAdminProducts(products, container) {
  if (!products.length) {
    container.innerHTML = `
      <div class="empty-state">
        <h4 class="mb-3">No hay productos registrados</h4>
        <p class="text-muted mb-0">Usa el formulario para crear el primer producto.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = products
    .map(
      (product) => `
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-body d-flex justify-content-between align-items-center flex-wrap gap-3">
              <div class="d-flex align-items-center gap-3">
                <img src="${product.image}" alt="${product.name}" class="admin-product-image rounded" />
                <div>
                  <h5 class="mb-1">${product.name}</h5>
                  <p class="text-muted mb-0">${formatPrice(product.price)}</p>
                </div>
              </div>
              <div class="d-flex gap-2 flex-wrap">
                <button
                  class="btn btn-outline-dark btn-sm"
                  type="button"
                  data-admin-edit="${product.id}"
                >
                  Editar
                </button>
                <button
                  class="btn btn-outline-danger btn-sm"
                  type="button"
                  data-admin-delete="${product.id}"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      `,
    )
    .join("");
}

export function updateCartIndicators(count, total, countNodes, totalNode, itemCountNode, checkoutButton) {
  countNodes.forEach((node) => {
    node.textContent = count;
  });

  if (totalNode) {
    totalNode.textContent = formatPrice(total);
  }

  if (itemCountNode) {
    itemCountNode.textContent = count;
  }

  if (checkoutButton) {
    checkoutButton.disabled = count === 0;
  }
}

export function showAddToCartModal(productName) {
  const messageNode = document.querySelector("#cartFeedbackMessage");
  const modalNode = document.querySelector("#cartFeedbackModal");

  if (messageNode) {
    messageNode.textContent = `${productName} se agrego correctamente al carrito.`;
  }

  if (modalNode && window.bootstrap) {
    const modal = new window.bootstrap.Modal(modalNode);
    modal.show();
  }
}

export function showFeedback(message, type = "primary") {
  const messageNode = document.querySelector("#appFeedback");
  if (!messageNode) {
    return;
  }

  messageNode.className = `alert alert-${type}`;
  messageNode.textContent = message;
  messageNode.classList.remove("d-none");
}

export function hideFeedback() {
  const messageNode = document.querySelector("#appFeedback");
  if (!messageNode) {
    return;
  }

  messageNode.classList.add("d-none");
}

export function fillAdminForm(form, product) {
  form.elements.productId.value = product?.id ?? "";
  form.elements.productName.value = product?.name ?? "";
  form.elements.productPrice.value = product?.price ?? "";
  form.elements.productImage.value = product?.image ?? "";
  form.elements.submitButton.textContent = product ? "Guardar cambios" : "Crear producto";
  form.elements.cancelEdit.classList.toggle("d-none", !product);
}

export function enableFormValidation() {
  const forms = document.querySelectorAll(".needs-validation");

  forms.forEach((form) => {
    form.addEventListener("submit", (event) => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }

      form.classList.add("was-validated");
    });
  });
}
