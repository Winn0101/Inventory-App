import React, { useState, useEffect } from 'react';

const API_ENDPOINT = 'https://zqiko4dzkl.execute-api.us-east-1.amazonaws.com/Prod'; // Replace with your new API Gateway endpoint

const App = () => {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');
  const [message, setMessage] = useState('');

  // Function to fetch all items on initial load
  useEffect(() => {
    // This is a placeholder. You can add a GET method if you need to display the inventory.
    // For this request, we are only focusing on POST and DELETE.
    // However, a real-world app would need a way to display data.
    // For now, let's keep the `items` state empty and focus on the requested logic.
  }, []);

  const handlePostItem = async () => {
    setMessage('');
    if (!itemName || !itemPrice || !itemQuantity) {
      setMessage('Please fill in all fields.');
      return;
    }

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'add',
          itemName,
          itemPrice: parseFloat(itemPrice),
          itemQuantity: parseInt(itemQuantity),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(`Success: ${data.message}`);
        // Clear input fields
        setItemName('');
        setItemPrice('');
        setItemQuantity('');
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error posting item:', error);
      setMessage('Failed to add item. Check console for details.');
    }
  };

  const handleDeleteItem = async (itemId) => {
    setMessage('');
    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'delete',
          itemId, // This will be the partition key (e.g., 'itemName' in this case)
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(`Success: ${data.message}`);
        // This is where you would update your local state if you were displaying the inventory
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      setMessage('Failed to delete item. Check console for details.');
    }
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Inventory Management</h1>
      <p style={messageStyle}>{message}</p>
      
      <div style={formStyle}>
        <h2>Add Inventory Item</h2>
        <input
          type="text"
          placeholder="Item Name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          style={inputStyle}
        />
        <input
          type="number"
          placeholder="Price"
          value={itemPrice}
          onChange={(e) => setItemPrice(e.target.value)}
          style={inputStyle}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={itemQuantity}
          onChange={(e) => setItemQuantity(e.target.value)}
          style={inputStyle}
        />
        <button onClick={handlePostItem} style={buttonStyle}>Add Item</button>
      </div>

      <div style={deleteFormStyle}>
        <h2>Delete Inventory Item</h2>
        <p>You can delete an item by its name, which serves as the primary key.</p>
        <input
          type="text"
          placeholder="Item Name to Delete"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          style={inputStyle}
        />
        <button onClick={() => handleDeleteItem(itemName)} style={{...buttonStyle, backgroundColor: '#dc3545'}}>Delete Item</button>
      </div>
      
    </div>
  );
};

// Simple inline styles for a clean UI
const containerStyle = {
  fontFamily: 'Arial, sans-serif',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  backgroundColor: '#f4f4f9',
  minHeight: '100vh',
};

const headingStyle = {
  color: '#333',
};

const messageStyle = {
  marginTop: '10px',
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  backgroundColor: '#e9ecef',
  color: '#495057',
};

const formStyle = {
  marginTop: '20px',
  padding: '20px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  backgroundColor: '#fff',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  width: '300px',
};

const deleteFormStyle = {
  ...formStyle,
  marginTop: '20px',
};

const inputStyle = {
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
};

const buttonStyle = {
  padding: '10px',
  borderRadius: '5px',
  border: 'none',
  backgroundColor: '#007bff',
  color: 'white',
  cursor: 'pointer',
};

export default App;
