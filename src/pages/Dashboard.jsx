import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [title, setTitle] = useState("");
  const [logo, setLogo] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [categoryDesc, setCategoryDesc] = useState("");
  const [categoryPrice, setCategoryPrice] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [categoryTitle, setCategoryTitle] = useState("");
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [loadingCategory, setLoadingCategory] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch (err) {
      alert("Failed to load products");
    }
  }

  async function handleAddProduct(e) {
    e.preventDefault();
    if (!title) return alert("Provide product title");

    setLoadingProduct(true);

    const formData = new FormData();
    formData.append("title", title);
    if (logo) formData.append("logo", logo);

    try {
      const res = await axios.post("http://localhost:5000/api/products", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      setProducts((prev) => [...prev, res.data]);
      setTitle("");
      setLogo(null);
      setSelectedProductId(res.data._id);
    } catch {
      alert("Failed to add product");
    }

    setLoadingProduct(false);
  }

  async function handleAddCategory(e) {
    e.preventDefault();
    if (!selectedProductId) return alert("Select a product");
    if (!categoryDesc || !categoryPrice || !categoryImage) return alert("Fill all category fields");

    setLoadingCategory(true);

    const formData = new FormData();
    formData.append("description", categoryDesc);
    formData.append("price", categoryPrice);
    formData.append("image", categoryImage);
    formData.append("title", categoryTitle);

    try {
      const res = await axios.post(
        `http://localhost:5000/api/products/${selectedProductId}/categories`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        }
      );
      setProducts((prev) =>
        prev.map((p) => (p._id === res.data._id ? res.data : p))
      );
      setCategoryDesc("");
      setCategoryPrice("");
      setCategoryImage(null);
    } catch {
      alert("Failed to add category");
    }

    setLoadingCategory(false);
  }

  async function deleteProduct(id) {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch {
      alert("Failed to delete product");
    }
  }

  async function deleteCategory(productId, categoryId) {
    if (!window.confirm("Delete this category?")) return;
    try {
      await axios.delete(
        `http://localhost:5000/api/products/${productId}/categories/${categoryId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setProducts((prev) =>
        prev.map((p) =>
          p._id === productId
            ? { ...p, categories: p.categories.filter((c) => c._id !== categoryId) }
            : p
        )
      );
    } catch {
      alert("Failed to delete category");
    }
  }

  function toggleProduct(id) {
    setSelectedProductId((prev) => (prev === id ? "" : id));
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-10">
      <h1 className="text-2xl sm:text-3xl font-bold text-center">Admin Panel</h1>

      <form onSubmit={handleAddProduct} className="bg-white p-4 rounded shadow space-y-4">
        <h2 className="text-xl font-semibold">Add Product</h2>
        <input
          type="text"
          placeholder="Product Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border rounded p-2 w-full text-sm"
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setLogo(e.target.files[0])}
          className="w-full text-sm"
        />
        <button
          disabled={loadingProduct}
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 w-full sm:w-auto"
        >
          {loadingProduct ? "Adding..." : "Add Product"}
        </button>
      </form>

      <div>
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Products</h2>
        <ul className="space-y-4">
          {products.map((product) => (
            <li key={product._id} className="border rounded p-4 bg-white shadow">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <button
                  className="flex items-center space-x-4 text-left"
                  onClick={() => toggleProduct(product._id)}
                >
                  {product.logo && (
                    <img
                      src={`http://localhost:5000/uploads/${product.logo}`}
                      alt={product.title}
                      className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                    />
                  )}
                  <span className="text-base sm:text-lg font-medium">{product.title}</span>
                </button>
                <button
                  onClick={() => deleteProduct(product._id)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Delete
                </button>
              </div>

              <AnimatePresence>
                {selectedProductId === product._id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 space-y-2 overflow-hidden"
                  >
                    {product.categories.length > 0 ? (
                      product.categories.map((cat, i) => (
                        <motion.div
                          key={cat._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex flex-col sm:flex-row sm:items-center sm:justify-between border rounded p-3 bg-gray-50 gap-2"
                        >
                          <div className="flex items-center space-x-4">
                            {cat.image && (
                              <img
                                src={`http://localhost:5000/uploads/${cat.image}`}
                                alt={cat.description}
                                className="w-12 h-12 sm:w-16 sm:h-16 object-contain rounded"
                              />
                            )}
                            <div>
                              <p className="text-sm">{cat.description}</p>
                              <p className="font-semibold text-green-700 text-sm">
                                ${cat.price}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => deleteCategory(product._id, cat._id)}
                            className="text-sm text-red-500 hover:underline"
                          >
                            Delete
                          </button>
                        </motion.div>
                      ))
                    ) : (
                      <p className="italic text-gray-500">No categories added yet.</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>
      </div>

      <form
        onSubmit={handleAddCategory}
        className="bg-white p-4 rounded shadow space-y-4"
      >
        <h2 className="text-xl font-semibold">Add Category</h2>
        <select
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
          className="border rounded p-2 w-full text-sm"
          required
        >
          <option value="" disabled>
            Select Product
          </option>
          {products.map((product) => (
            <option key={product._id} value={product._id}>
              {product.title}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Category Title"
          value={categoryTitle}
          onChange={(e) => setCategoryTitle(e.target.value)}
          className="border rounded p-2 w-full text-sm"
          required
        />
        <input
          type="text"
          placeholder="Category Description"
          value={categoryDesc}
          onChange={(e) => setCategoryDesc(e.target.value)}
          className="border rounded p-2 w-full text-sm"
          required
        />
        <input
          type="number"
          min="0"
          placeholder="Price"
          value={categoryPrice}
          onChange={(e) => setCategoryPrice(e.target.value)}
          className="border rounded p-2 w-full text-sm"
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setCategoryImage(e.target.files[0])}
          className="w-full text-sm"
        />
        <button
          disabled={loadingCategory}
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 w-full sm:w-auto"
        >
          {loadingCategory ? "Adding..." : "Add Category"}
        </button>
      </form>
    </div>
  );
}
