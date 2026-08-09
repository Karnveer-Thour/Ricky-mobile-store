import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { AppProvider, useApp } from './AppContext';
import { describe, it, expect, vi } from 'vitest';

// Consumer component that exposes AppContext functions for testing
const TestComponent = () => {
  const {
    cart,
    wishlist,
    cartCount,
    cartTotal,
    cartOpen,
    setCartOpen,
    addToCart,
    updateQty,
    clearCart,
    toggleWishlist,
    trackedOrderId,
    setTrackedOrderId,
    chatMsgs,
    setChatInput,
    sendChat,
  } = useApp();

  return (
    <div>
      <div data-testid="cart-count">{cartCount}</div>
      <div data-testid="cart-total">{cartTotal}</div>
      <div data-testid="cart-open">{cartOpen ? 'open' : 'closed'}</div>
      <div data-testid="wishlist-length">{wishlist.length}</div>
      <div data-testid="tracked-order-id">{trackedOrderId || 'none'}</div>
      <div data-testid="chat-messages">
        {chatMsgs.map((msg) => (
          <span key={msg.id} data-testid={`msg-${msg.id}`}>
            {msg.sender}: {msg.message}
          </span>
        ))}
      </div>
      <div data-testid="cart-items">
        {cart.map((item, idx) => (
          <span key={idx} data-testid={`item-${item.productId}`}>
            Prod:{item.productId}-Qty:{item.qty}
          </span>
        ))}
      </div>
      <button data-testid="add-btn" onClick={() => addToCart(1, 101, 'Matte Black', 2)}>
        Add Product 1
      </button>
      <button data-testid="add-another-btn" onClick={() => addToCart(1, 101, 'Matte Black', 1)}>
        Add Product 1 again
      </button>
      <button data-testid="inc-btn" onClick={() => updateQty(1, 101, 1)}>
        Inc Qty
      </button>
      <button data-testid="dec-btn" onClick={() => updateQty(1, 101, -1)}>
        Dec Qty
      </button>
      <button data-testid="wishlist-btn" onClick={() => toggleWishlist(5)}>
        Toggle Wishlist 5
      </button>
      <button data-testid="clear-btn" onClick={clearCart}>
        Clear Cart
      </button>
      <button data-testid="open-cart-btn" onClick={() => setCartOpen(true)}>
        Open Cart
      </button>
      <button data-testid="track-btn" onClick={() => setTrackedOrderId('order-123')}>
        Track Order
      </button>
      <button data-testid="input-chat-btn" onClick={() => setChatInput('Hello support!')}>
        Set Chat Input
      </button>
      <button data-testid="send-chat-btn" onClick={sendChat}>
        Send Chat
      </button>
    </div>
  );
};

describe('AppContext & AppProvider Storefront State Provider', () => {
  it('should initialize with default empty values', () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    expect(screen.getByTestId('cart-count').textContent).toBe('0');
    expect(screen.getByTestId('cart-total').textContent).toBe('0');
    expect(screen.getByTestId('cart-open').textContent).toBe('closed');
    expect(screen.getByTestId('wishlist-length').textContent).toBe('0');
    expect(screen.getByTestId('tracked-order-id').textContent).toBe('none');
  });

  it('should add items to cart and open cart panel', () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    const addBtn = screen.getByTestId('add-btn');
    act(() => {
      addBtn.click();
    });

    expect(screen.getByTestId('cart-count').textContent).toBe('2');
    expect(screen.getByTestId('cart-open').textContent).toBe('open');
    expect(screen.getByTestId('cart-items').textContent).toContain('Prod:1-Qty:2');
  });

  it('should stack quantity when adding the same product color variant', () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    act(() => {
      screen.getByTestId('add-btn').click();
    });
    act(() => {
      screen.getByTestId('add-another-btn').click();
    });

    expect(screen.getByTestId('cart-count').textContent).toBe('3');
    expect(screen.getByTestId('cart-items').textContent).toContain('Prod:1-Qty:3');
  });

  it('should update item quantity correctly and remove when qty goes to 0', () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    act(() => {
      screen.getByTestId('add-btn').click(); // Qty: 2
    });
    act(() => {
      screen.getByTestId('inc-btn').click(); // Qty: 3
    });
    expect(screen.getByTestId('cart-count').textContent).toBe('3');

    act(() => {
      screen.getByTestId('dec-btn').click(); // Qty: 2
    });
    expect(screen.getByTestId('cart-count').textContent).toBe('2');

    act(() => {
      screen.getByTestId('dec-btn').click(); // Qty: 1
    });
    act(() => {
      screen.getByTestId('dec-btn').click(); // Qty: 0 -> removed
    });
    expect(screen.getByTestId('cart-count').textContent).toBe('0');
  });

  it('should toggle wishlist items successfully', () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    const wishlistBtn = screen.getByTestId('wishlist-btn');
    act(() => {
      wishlistBtn.click();
    });
    expect(screen.getByTestId('wishlist-length').textContent).toBe('1');

    act(() => {
      wishlistBtn.click();
    });
    expect(screen.getByTestId('wishlist-length').textContent).toBe('0');
  });

  it('should clear cart on demand', () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    act(() => {
      screen.getByTestId('add-btn').click();
    });
    expect(screen.getByTestId('cart-count').textContent).toBe('2');

    act(() => {
      screen.getByTestId('clear-btn').click();
    });
    expect(screen.getByTestId('cart-count').textContent).toBe('0');
  });

  it('should update tracked order ID state', () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    expect(screen.getByTestId('tracked-order-id').textContent).toBe('none');

    act(() => {
      screen.getByTestId('track-btn').click();
    });
    expect(screen.getByTestId('tracked-order-id').textContent).toBe('order-123');
  });

  it('should send chat message and receive canned support response after delay', () => {
    vi.useFakeTimers();

    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    const messages = screen.getByTestId('chat-messages');
    expect(messages.textContent).toContain('support: Hi Ricky! Welcome to Ricky Mobile Store support. How can I help you today?');

    act(() => {
      screen.getByTestId('input-chat-btn').click();
    });
    act(() => {
      screen.getByTestId('send-chat-btn').click();
    });

    expect(messages.textContent).toContain('user: Hello support!');

    act(() => {
      vi.advanceTimersByTime(1200);
    });

    expect(messages.textContent).toContain('support: Thanks for your message! Our team will get back to you shortly. Typical response time is under 5 minutes.');

    vi.useRealTimers();
  });
});
