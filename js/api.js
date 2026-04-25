// Simula un backend de productos con fetch y persistencia en sessionStorage.
const PRODUCTS_KEY = "gamehub-products";

const fallbackProducts = [
  {
    id: 1,
    name: "PlayStation 5",
    price: 499.99,
    image:
      "https://gmedia.playstation.com/is/image/SIEPDC/ps5-product-thumbnail-01-en-14sep21?$facebook$",
  },
  {
    id: 2,
    name: "Xbox Series X",
    price: 499.99,
    image:
      "https://cms-assets.xboxservices.com/assets/f0/8d/f08dfa50-f2ef-4873-bc8f-bcb6c34e48c0.png?n=642227_Hero-Gallery-0_C2_857x676.png",
  },
  {
    id: 3,
    name: "Nintendo Switch OLED",
    price: 349.99,
    image:
      "https://assets.nintendo.com/image/upload/f_auto/q_auto/dpr_1.5/c_scale,w_500/ncom/en_US/switch/videos/heg001-07060600/posters/oled-model",
  },
  {
    id: 4,
    name: "SNES Classic Edition",
    price: 129.99,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/5/52/Nintendo_Classic_Mini_Super_Nintendo_Entertainment_System_%28enhanced_image%29.jpg",
  },
  {
    id: 5,
    name: "PlayStation 5 Digital Edition",
    price: 399.99,
    image:
      "https://media.direct.playstation.com/is/image/psdglobal/PS5-Digital-Model-Slim-Hero-1",
  },
  {
    id: 6,
    name: "Xbox Series S 1TB",
    price: 349.99,
    image:
      "https://freemans.scene7.com/is/image/OttoUK/466w/xbox-series-s-console---1tb-white~66K104FRSP.jpg",
  },
  {
    id: 7,
    name: "Nintendo Switch Lite",
    price: 199.99,
    image:
      "https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/en_US/products/hardware/nintendo-switch-lite-gray/110672-nintendo-switch-lite-gray-front-1200x675",
  },
  {
    id: 8,
    name: "Sega Genesis Mini",
    price: 79.99,
    image:
      "https://platform.theverge.com/wp-content/uploads/sites/2/chorus/uploads/chorus_asset/file/15996852/a02kz8aey4wczznpm49r.jpg?quality=90&strip=all&crop=0,4.2595769010863,100,91.480846197827",
  },
];

function readStoredProducts() {
  const rawProducts = sessionStorage.getItem(PRODUCTS_KEY);
  return rawProducts ? JSON.parse(rawProducts) : null;
}

function writeStoredProducts(products) {
  sessionStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  return products;
}

function ensureProductSeed() {
  const storedProducts = readStoredProducts();
  if (storedProducts?.length) {
    return storedProducts;
  }

  return writeStoredProducts(fallbackProducts);
}

export async function fetchProducts() {
  ensureProductSeed();

  try {
    const response = await fetch("/api/productos");
    if (!response.ok) {
      throw new Error("No se pudo obtener /api/productos");
    }

    const products = await response.json();
    return writeStoredProducts(products);
  } catch (error) {
    return ensureProductSeed();
  }
}

export async function createProduct(product) {
  const products = ensureProductSeed();
  const newProduct = {
    id: Date.now(),
    name: product.name.trim(),
    price: Number(product.price),
    image: product.image.trim(),
  };

  writeStoredProducts([...products, newProduct]);
  return newProduct;
}

export async function updateProduct(productId, updates) {
  const products = ensureProductSeed().map((product) =>
    product.id === productId
      ? {
          ...product,
          name: updates.name.trim(),
          price: Number(updates.price),
          image: updates.image.trim(),
        }
      : product,
  );

  writeStoredProducts(products);
  return products.find((product) => product.id === productId);
}

export async function deleteProduct(productId) {
  const products = ensureProductSeed().filter((product) => product.id !== productId);
  writeStoredProducts(products);
  return products;
}
