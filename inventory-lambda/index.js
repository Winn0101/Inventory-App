import React, { useEffect, useState } from 'react';
import { Package, Plus, Trash2, Edit3, AlertCircle } from 'lucide-react';

function App() {
  const [products, setProducts] = useState([]);
  
  // Replace with your actual API Gateway URL
  const apiBaseUrl = "https://xxxxxxx.execute-api.YOUR_REGION.amazonaws.com/dev";
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    try {
      const resp = await fetch(`${apiBaseUrl}/products`);
      const data = await resp.json();
      setProducts(data);
    } catch (error) {
      console.error("Fetch products failed:", error);
      setError("Failed to load products");
    }
  };

  const addProduct = async () => {
    if (!name.trim() || !quantity || !description.trim()) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      const resp = await fetch(`${apiBaseUrl}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), quantity: parseInt(quantity, 10), description: description.trim() })
      });
      
      if (resp.ok) {
        fetchProducts(); // Refresh the list
        setName('');
        setQuantity('');
        setDescription('');
        setError('');
      } else {
        console.error("Add product failed:", await resp.text());
        setError("Failed to add product");
      }
    } catch (error) {
      console.error("Add product error:", error);
      setError("Failed to add product");
    }
  };

  const deleteProduct = async (id) => {
    try {
      const resp = await fetch(`${apiBaseUrl}/products/${id}`, {
        method: 'DELETE'
      });
      
      if (resp.ok) {
        fetchProducts(); // Refresh the list
      } else {
        console.error("Delete product failed:", await resp.text());
        setError("Failed to delete product");
      }
    } catch (error) {
      console.error("Delete product error:", error);
      setError("Failed to delete product");
    }
  };

  const updateProduct = async (id, updatedFields) => {
    try {
      const resp = await fetch(`${apiBaseUrl}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
      
      if (resp.ok) {
        fetchProducts(); // Refresh the list
      } else {
        console.error("Update failed:", await resp.text());
        setError("Failed to update product");
      }
    } catch (error) {
      console.error("Update error:", error);
      setError("Failed to update product");
    }
  };

  const handleQuantityUpdate = (product) => {
    const newQty = prompt("Enter new quantity:", product.quantity);
    if (newQty !== null && !isNaN(newQty)) {
      updateProduct(product.id, { quantity: parseInt(newQty, 10) });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Package className="w-10 h-10 text-indigo-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">Inventory Tracker</h1>
          </div>
          <p className="text-gray-600">Manage your product inventory with ease</p>
        </div>

        {/* Add Product Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Plus className="w-5 h-5 mr-2 text-indigo-600" />
            Add New Product
          </h2>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center">
              <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Product Name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              min="0"
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            />
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <button
            onClick={addProduct}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </button>
        </div>

        {/* Products List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-800">
              Products ({products.length})
            </h2>
          </div>
          
          {products.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No products in inventory yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {products.map(product => (
                <div key={product.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-lg mb-1">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 mb-2">{product.description}</p>
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          product.quantity > 50 ? 'bg-green-100 text-green-800' :
                          product.quantity > 10 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          Qty: {product.quantity}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleQuantityUpdate(product)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Update Quantity"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
