import React, { useSEffect, useState } from 'react';
import { Package, Plus, Trash2, Edit3, AlertCircle, X, ShoppingCart, Search, Filter, TrendingUp } from 'lucide-react';

// Main App component
function App() {
  const [products, setProducts] = useState([]);
  const apiBaseUrl = "https://tft4vyo5rj.execute-api.us-east-1.amazonaws.com/Prod";
  
  // State for the product creation form
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // State for search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');

  // State for the update modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [updatedValue, setUpdatedValue] = useState('');
  const [updateField, setUpdateField] = useState('');

  // Function to fetch all products from the API
  const fetchProducts = async () => {
    try {
      const resp = await fetch(`${apiBaseUrl}/products`);
      const data = await resp.json();
      setProducts(data);
      setError('');
    } catch (error) {
      console.error("Fetch products failed:", error);
      setError("Failed to load products. Please check the API URL.");
    }
  };

  // Function to add a new product
  const addProduct = async () => {
    if (!name.trim() || !sku.trim() || !quantity || !description.trim()) {
      setError('Please fill in all fields (Name, SKU, Quantity, Description).');
      setSuccess('');
      return;
    }
    
    try {
      const resp = await fetch(`${apiBaseUrl}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          sku: sku.trim(),
          quantity: parseInt(quantity, 10),
          description: description.trim()
        })
      });
      
      if (resp.ok) {
        fetchProducts(); // Refresh the list
        setName('');
        setSku('');
        setQuantity('');
        setDescription('');
        setError('');
        setSuccess('Product added successfully! 🎉');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const errorText = await resp.text();
        console.error("Add product failed:", errorText);
        setError(`Failed to add product: ${errorText}`);
        setSuccess('');
      }
    } catch (error) {
      console.error("Add product error:", error);
      setError("Failed to add product due to a network error.");
      setSuccess('');
    }
  };

  // Function to delete a product
  const deleteProduct = async (id) => {
    try {
      const resp = await fetch(`${apiBaseUrl}/products/${id}`, {
        method: 'DELETE'
      });
      
      if (resp.ok) {
        fetchProducts(); // Refresh the list
        setError('');
        setSuccess('Product deleted successfully! ✅');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const errorText = await resp.text();
        console.error("Delete product failed:", errorText);
        setError(`Failed to delete product: ${errorText}`);
      }
    } catch (error) {
      console.error("Delete product error:", error);
      setError("Failed to delete product due to a network error.");
    }
  };

  // Function to update a product field (used by the modal)
  const updateProduct = async (id, updatedFields) => {
    try {
      const resp = await fetch(`${apiBaseUrl}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
      
      if (resp.ok) {
        fetchProducts(); // Refresh the list
        setError('');
        setSuccess('Product updated successfully! ✨');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const errorText = await resp.text();
        console.error("Update failed:", errorText);
        setError(`Failed to update product: ${errorText}`);
      }
    } catch (error) {
      console.error("Update error:", error);
      setError("Failed to update product due to a network error.");
    }
  };

  // Handlers for opening the update modal
  const openModal = (product, field) => {
    setCurrentProduct(product);
    setUpdateField(field);
    setUpdatedValue(product[field]);
    setIsModalOpen(true);
  };

  // Handler for saving the updated value from the modal
  const handleModalSave = () => {
    const updatedFields = {};
    if (updateField === 'quantity') {
      updatedFields[updateField] = parseInt(updatedValue, 10);
    } else {
      updatedFields[updateField] = updatedValue;
    }
    updateProduct(currentProduct.id, updatedFields);
    setIsModalOpen(false);
  };

  // Filter products based on search and filter criteria
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterBy === 'low-stock') return matchesSearch && product.quantity <= 10;
    if (filterBy === 'medium-stock') return matchesSearch && product.quantity > 10 && product.quantity <= 50;
    if (filterBy === 'high-stock') return matchesSearch && product.quantity > 50;
    return matchesSearch;
  });

  // Calculate inventory stats
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, product) => sum + product.quantity, 0);
  const lowStockItems = products.filter(product => product.quantity <= 10).length;

  // Fetch products on initial component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50 p-4 font-sans antialiased">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-blue-600 rounded-3xl opacity-5 blur-3xl"></div>
          <div className="relative">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-violet-600 to-blue-600 rounded-2xl mr-4">
                <Package className="w-12 h-12 text-white" />
              </div>
              <div>
                <h1 className="text-5xl font-black bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                  Inventory Tracker
                </h1>
                <p className="text-gray-600 text-lg mt-2">Smart inventory management made simple</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total Products</p>
                <p className="text-3xl font-bold">{totalProducts}</p>
              </div>
              <Package className="w-8 h-8 text-blue-200" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Total Stock</p>
                <p className="text-3xl font-bold">{totalStock}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-200" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-6 text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100">Low Stock Items</p>
                <p className="text-3xl font-bold">{lowStockItems}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-200" />
            </div>
          </div>
        </div>

        {/* Notifications */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 mb-6 rounded-xl shadow-sm animate-pulse" role="alert">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-3" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-green-400 text-green-700 p-4 mb-6 rounded-xl shadow-sm animate-pulse" role="alert">
            <div className="flex items-center">
              <div className="w-5 h-5 mr-3 rounded-full bg-green-400 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <span>{success}</span>
            </div>
          </div>
        )}

        {/* Add Product Form */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8 border border-white/50">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <div className="p-2 bg-gradient-to-r from-violet-500 to-blue-500 rounded-xl mr-3">
              <Plus className="w-6 h-6 text-white" />
            </div>
            Add New Product
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <input
              type="text"
              placeholder="Product Name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white focus:bg-white"
            />
            <input
              type="text"
              placeholder="SKU"
              value={sku}
              onChange={e => setSku(e.target.value)}
              className="px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white focus:bg-white"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              min="0"
              className="px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white focus:bg-white"
            />
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white focus:bg-white"
            />
          </div>
          <button
            onClick={addProduct}
            className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 flex items-center justify-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Product
          </button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl p-6 mb-8 border border-white/50">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products, SKU, or description..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 w-full border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filterBy}
                onChange={e => setFilterBy(e.target.value)}
                className="pl-12 pr-8 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm appearance-none cursor-pointer"
              >
                <option value="all">All Stock Levels</option>
                <option value="low-stock">Low Stock (≤10)</option>
                <option value="medium-stock">Medium Stock (11-50)</option>
                <option value="high-stock">High Stock (>50)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products List */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/50">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">
              Products ({filteredProducts.length}{filteredProducts.length !== totalProducts && ` of ${totalProducts}`})
            </h2>
          </div>
          
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <Package className="w-20 h-20 text-gray-400 mx-auto mb-6" />
              <p className="text-gray-500 text-xl mb-2">
                {searchTerm || filterBy !== 'all' ? 'No products match your search' : 'No products in inventory yet'}
              </p>
              <p className="text-gray-400">
                {searchTerm || filterBy !== 'all' ? 'Try adjusting your search or filter' : 'Add your first product above!'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredProducts.map(product => (
                <div key={product.id} className="p-8 hover:bg-white/50 transition-all duration-300 group">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center mb-3">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl mr-3 group-hover:scale-110 transition-transform">
                          <ShoppingCart className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="font-bold text-gray-900 text-xl truncate group-hover:text-violet-600 transition-colors">
                          {product.name}
                        </h3>
                      </div>
                      <p className="text-gray-600 mb-3 truncate">{product.description}</p>
                      <div className="flex items-center flex-wrap gap-3">
                        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gray-100 text-gray-800 border border-gray-200">
                          SKU: {product.sku}
                        </span>
                        <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border-2 ${
                          product.quantity > 50 
                            ? 'bg-green-50 text-green-700 border-green-200' :
                          product.quantity > 10 
                            ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                            'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          Qty: {product.quantity}
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex items-center space-x-2 ml-6 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openModal(product, 'quantity')}
                        className="p-3 text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200 hover:scale-110"
                        title="Update Quantity"
                      >
                        <Edit3 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => openModal(product, 'description')}
                        className="p-3 text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200 hover:scale-110"
                        title="Update Description"
                      >
                        <Edit3 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => openModal(product, 'sku')}
                        className="p-3 text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200 hover:scale-110"
                        title="Update SKU"
                      >
                        <Edit3 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="p-3 text-red-600 hover:bg-red-50 rounded-full transition-all duration-200 hover:scale-110"
                        title="Delete Product"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Update Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 max-w-md w-full relative transform transition-all scale-100 duration-300 border border-white/50">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors hover:scale-110"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="flex items-center mb-4">
              <div className="p-3 bg-gradient-to-r from-violet-500 to-blue-500 rounded-2xl mr-4">
                <Edit3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">
                Update {updateField.charAt(0).toUpperCase() + updateField.slice(1)}
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Editing: <span className="font-semibold text-violet-600">{currentProduct?.name}</span>
            </p>
            <input
              type={updateField === 'quantity' ? 'number' : 'text'}
              value={updatedValue}
              onChange={e => setUpdatedValue(e.target.value)}
              className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all mb-6 bg-white/80 backdrop-blur-sm"
              min={updateField === 'quantity' ? 0 : undefined}
            />
            <button
              onClick={handleModalSave}
              className="w-full bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
