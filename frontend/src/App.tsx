// frontend/src/App.tsx
import { useState } from 'react';
import './index.css';

// Mocked Data based on our CQRS Read Model structure
const initialProducts = [
  { id: 'p1', displayName: 'Premium Wireless Headphones', priceFormatted: '$299.99', isAvailable: true, description: 'Noise-cancelling over-ear.' },
  { id: 'p2', displayName: 'Mechanical Keyboard v2', priceFormatted: '$149.00', isAvailable: true, description: 'Tactile switches, RGB.' },
  { id: 'p3', displayName: 'Ultra-wide Monitor 34"', priceFormatted: '$899.99', isAvailable: true, description: '144Hz curved display.' },
  { id: 'p4', displayName: 'Ergonomic Mouse', priceFormatted: '$79.50', isAvailable: true, description: 'Wireless precision.' },
];

function App() {
  const [cartCount, setCartCount] = useState(0);
  const [products] = useState(initialProducts);

  const handleBuy = (productName: string) => {
    // In a real app, this would dispatch an event to the backend API
    console.log(`Command: Place Order for ${productName}`);
    setCartCount(c => c + 1);
  };

  return (
    <div className="app-container">
      <nav className="navbar glass-panel">
        <div className="logo gradient-text">NexusShop</div>
        <button className="cart-btn">
          Cart ({cartCount})
        </button>
      </nav>

      <main>
        <section className="hero">
          <h1>Experience the <span className="gradient-text">Future of Tech</span></h1>
          <p>
            Curated premium technology built for developers and designers. 
            Discover tools that enhance your workflow and aesthetic.
          </p>
        </section>

        <section className="product-grid">
          {products.map(p => (
            <div key={p.id} className="product-card glass-panel">
              <div className="product-image-skeleton">
                {/* Normally an image element goes here */}
                <span style={{opacity: 0.2}}>Image Placeholder</span>
              </div>
              <div className="product-info">
                <h3>{p.displayName}</h3>
                <p>{p.description}</p>
              </div>
              <div className="product-footer">
                <span className="price">{p.priceFormatted}</span>
                <button 
                  className="buy-btn" 
                  onClick={() => handleBuy(p.displayName)}
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

export default App;
