import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface Product {
    _id: string;
    name: string;
    price: number;
    description: string;
    image: string;
    stock: number;
    category: string;
}

interface CartItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
}

export default function ShopPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [showCart, setShowCart] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState('');
    const { user, logout } = useAuth();

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const data = await apiService.getProducts();
            setProducts(data);
        } catch (err) {
            console.error('Failed to load products:', err);
        }
    };

    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(item => item.productId === product._id);
            if (existing) {
                return prev.map(item =>
                    item.productId === product._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { productId: product._id, name: product.name, price: product.price, quantity: 1 }];
        });
    };

    const removeFromCart = (productId: string) => {
        setCart(prev => prev.filter(item => item.productId !== productId));
    };

    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleCheckout = async () => {
        if (!cart.length) return;
        try {
            await apiService.placeOrder(cart);
            setOrderSuccess('Order placed successfully!');
            setCart([]);
            setTimeout(() => setOrderSuccess(''), 3000);
        } catch (err: any) {
            alert(err.message);
        }
    };

    return (
        <div className="app-container">
            <nav className="navbar glass-panel">
                <div className="logo gradient-text">NexusShop</div>
                <div className="nav-right">
                    <span className="user-greeting">Hi, {user?.name}</span>
                    <button className="cart-btn" onClick={() => setShowCart(!showCart)}>
                        Cart ({cart.reduce((sum, i) => sum + i.quantity, 0)})
                    </button>
                    <button className="logout-btn" onClick={logout}>Logout</button>
                </div>
            </nav>

            {orderSuccess && <div className="success-banner">{orderSuccess}</div>}

            {showCart && (
                <div className="cart-overlay glass-panel">
                    <h3>Your Cart</h3>
                    {cart.length === 0 ? (
                        <p className="cart-empty">Cart is empty</p>
                    ) : (
                        <>
                            {cart.map(item => (
                                <div key={item.productId} className="cart-item">
                                    <div>
                                        <strong>{item.name}</strong>
                                        <span className="cart-qty"> x{item.quantity}</span>
                                    </div>
                                    <div className="cart-item-right">
                                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                                        <button className="cart-remove" onClick={() => removeFromCart(item.productId)}>✕</button>
                                    </div>
                                </div>
                            ))}
                            <div className="cart-total">
                                <strong>Total: ${totalAmount.toFixed(2)}</strong>
                            </div>
                            <button className="checkout-btn" onClick={handleCheckout}>Place Order</button>
                        </>
                    )}
                </div>
            )}

            <main>
                <section className="hero">
                    <h1>Experience the <span className="gradient-text">Future of Tech</span></h1>
                    <p>Curated premium technology built for developers and designers.</p>
                </section>

                {products.length === 0 ? (
                    <div className="empty-state">
                        <p>No products available yet. Add some via the API!</p>
                    </div>
                ) : (
                    <section className="product-grid">
                        {products.map(p => (
                            <div key={p._id} className="product-card glass-panel">
                                <div className="product-image-skeleton">
                                    <span style={{ opacity: 0.3, fontSize: '2rem' }}>🎧</span>
                                </div>
                                <div className="product-info">
                                    <span className="product-category">{p.category}</span>
                                    <h3>{p.name}</h3>
                                    <p>{p.description}</p>
                                </div>
                                <div className="product-footer">
                                    <span className="price">${p.price.toFixed(2)}</span>
                                    <button className="buy-btn" onClick={() => addToCart(p)}>
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </section>
                )}
            </main>
        </div>
    );
}
