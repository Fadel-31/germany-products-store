import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Lottie from "lottie-react";
import separator_Green from "../../public/lottie/separator_Green.json"
export default function Storefront() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const scrollRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await axios.get("https://germany-products-backend-production.up.railway.app/api/products");
        setProducts(res.data);
      } catch {
        alert("Failed to load products");
      }
    }
    fetchProducts();
  }, []);

  // Drag to scroll logic
  useEffect(() => {
    const slider = scrollRef.current;
    if (!slider) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    function mouseDown(e) {
      isDown = true;
      slider.classList.add("cursor-grabbing");
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    }

    function mouseLeave() {
      isDown = false;
      slider.classList.remove("cursor-grabbing");
    }

    function mouseUp() {
      isDown = false;
      slider.classList.remove("cursor-grabbing");
    }

    function mouseMove(e) {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2;
      slider.scrollLeft = scrollLeft - walk;
    }

    slider.addEventListener("mousedown", mouseDown);
    slider.addEventListener("mouseleave", mouseLeave);
    slider.addEventListener("mouseup", mouseUp);
    slider.addEventListener("mousemove", mouseMove);

    return () => {
      slider.removeEventListener("mousedown", mouseDown);
      slider.removeEventListener("mouseleave", mouseLeave);
      slider.removeEventListener("mouseup", mouseUp);
      slider.removeEventListener("mousemove", mouseMove);
    };
  }, []);

  function selectProduct(product) {
    setSelectedProduct(product);
    setSelectedCategory(null);
    // Scroll to top of content when selecting a new product
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function closeModal() {
    setSelectedCategory(null);
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col h-[calc(100vh-64px)]"> {/* Adjust based on navbar height */}
        {/* Fixed product selector */}
        {/* Fixed product selector */}
        <div className="sticky top-0 z-10 bg-white pt-4 pb-2 px-6 shadow-sm">

          {/* Moving marquee text */}
          <div className="overflow-hidden whitespace-nowrap mb-5">
            <motion.div
              animate={{ x: ["100%", "-100%"] }}
              transition={{ repeat: Infinity, duration: 13, ease: "linear" }}
              className="text-sm sm:text-base font-medium text-black"
            >
              Keep your home fresh & clean • Premium body care essentials • Nivea Shampoo • Fa Shower Gel • Persil Laundry Detergent • Dove Conditioner • Lux Soap • Always Gentle to Your Skin • Perfume • Victora's secret • chanel • Givenchy
            </motion.div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold mb-4 text-left sm:text-left 
    [@media(max-width:450px)]:text-center">
            Our Products
          </h1>
          {/* Lottie separator */}
          <div className="w-full max-w-xl mx-auto mb-8">
            <Lottie
              animationData={separator_Green}
              loop={true}
              autoplay={true}
              style={{ height: 100, width: '100%' }}
            />
          </div>

          <div
            ref={scrollRef}
            className="flex space-x-6 overflow-x-auto no-scrollbar cursor-grab py-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {products.map((product) => (
              <div
                key={product._id}
                onClick={() => selectProduct(product)}
                className="min-w-[120px] sm:min-w-[180px] cursor-pointer flex flex-col items-center p-2 sm:p-4"
              >
                {product.logo && (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mb-2 rounded-full overflow-hidden border-2 border-gray-200">
                    <img
                      src={`https://germany-products-backend-production.up.railway.app/uploads/${product.logo}`}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="relative w-full text-center">
                  <span className="text-sm sm:text-lg font-semibold block pb-1">
                    {product.title}
                  </span>
                  {selectedProduct?._id === product._id && (
                    <motion.div
                      layoutId="productUnderline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      exit={{ scaleX: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>


        {/* Scrollable content area */}
        <div ref={contentRef} className="flex-1 overflow-y-auto px-6 pb-8">
          <AnimatePresence mode="wait">
            {selectedProduct ? (
              <motion.div
                key={selectedProduct._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4 }}
                className="mt-8"
              >
                <h2 className="text-xl sm:text-3xl font-semibold mb-6 font-sans tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  {selectedProduct.title}
                </h2>
                {selectedProduct.categories.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {selectedProduct.categories.map((cat, i) => (
                      <motion.div
                        key={cat._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="border rounded p-4 bg-gray-50 shadow flex flex-col items-center cursor-pointer"
                        onClick={() => setSelectedCategory(cat)}
                      >
                        {cat.image && (
                          <img
                            src={`https://germany-products-backend-production.up.railway.app/uploads/${cat.image}`}
                            alt={cat.description}
                            className="w-32 h-32 object-contain rounded mb-4"
                          />
                        )}
                        <p className="text-center font-semibold">{cat.description}</p>
                        <p className="text-green-700 font-bold mt-2">${cat.price}</p>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="italic text-gray-500">No categories available for this product.</p>
                )}
              </motion.div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-center text-gray-500">Select a product to see its categories</p>
              </div>
            )}
          </AnimatePresence>

          {/* Category modal */}
          <AnimatePresence>
            {selectedCategory && (
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeModal}
              >
                <motion.div
                  className="bg-white rounded-lg max-w-md w-full p-6 relative"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {selectedCategory.image && (
                    <img
                      src={`https://germany-products-backend-production.up.railway.app/uploads/${selectedCategory.image}`}
                      alt={selectedCategory.description}
                      className="w-full h-48 object-contain rounded mb-4"
                    />
                  )}
                  <h3 className="text-xl font-semibold mb-2">{selectedCategory.title}</h3>
                  <p className="mb-4">{selectedCategory.description}</p>
                  <p className="text-green-700 font-bold mb-6">${selectedCategory.price}</p>
                  <button
                    onClick={() => {
                      const message = `I'm interested in ${selectedCategory.title} (${selectedCategory.description}) for $${selectedCategory.price}. Is delivery available?`;
                      const encodedMessage = encodeURIComponent(message);
                      window.open(`https://wa.me/96181890715?text=${encodedMessage}`, '_blank');
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Shop Now
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600&display=swap');
    }
      `}</style>
      {/* Contact Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-50 py-8 px-4 border-t border-gray-200 text-xs sm:text-base"
        id="contact"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-6">Contact Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="bg-blue-100 p-2 sm:p-3 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>              </div>
              <div>
                <h3 className="font-medium text-gray-500 text-sm sm:text-base">Phone</h3>
                <p className="font-semibold sm:text-lg">+961 81 890715</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="bg-blue-100 p-2 sm:p-3 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>              </div>
              <div>
                <h3 className="font-medium text-gray-500 text-sm sm:text-base">Location</h3>
                <p className="font-semibold sm:text-lg">Nabaiteh, Hay Alsaray</p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </>
  );
}