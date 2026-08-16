import { ShoppingCart } from '../src/cart';

describe('ShoppingCart - Add Item', () => {
  it('should allow adding a valid item to the cart', () => {
    const cart = new ShoppingCart();

    cart.addItem({ id: '1', name: 'Apple', price: 10, quantity: 2 });

    expect(cart.getItems()).toHaveLength(1);
    expect(cart.getItems()[0]).toEqual({ id: '1', name: 'Apple', price: 10, quantity: 2 });
  });

  it('should increase quantity if item with same id is added again', () => {
    const cart = new ShoppingCart();

    cart.addItem({ id: '1', name: 'Apple', price: 10, quantity: 2 });
    cart.addItem({ id: '1', name: 'Apple', price: 10, quantity: 3 });

    expect(cart.getItems()).toHaveLength(1);
    expect(cart.getItems()[0]!.quantity).toBe(5);
  });

  it('should reject an item with price of 0 or negative', () => {
    const cart = new ShoppingCart();

    expect(() => {
      cart.addItem({ id: '2', name: 'Banana', price: 0, quantity: 1 });
    }).toThrow('Price must be greater than 0');
  });

  it('should reject an item with quantity of 0 or negative', () => {
    const cart = new ShoppingCart();

    expect(() => {
      cart.addItem({ id: '3', name: 'Cherry', price: 5, quantity: 0 });
    }).toThrow('Quantity must be greater than 0');
  });
});

describe('ShoppingCart - Remove Item', () => {
  it('should remove an item from the cart by id', () => {
    const cart = new ShoppingCart();
    cart.addItem({ id: '1', name: 'Apple', price: 10, quantity: 2 });

    cart.removeItem('1');

    expect(cart.getItems()).toHaveLength(0);
  });

  it('should throw an error when removing an item that does not exist', () => {
    const cart = new ShoppingCart();
    cart.addItem({ id: '1', name: 'Apple', price: 10, quantity: 2 });

    expect(() => {
      cart.removeItem('999');
    }).toThrow('Item not found in cart');
  });

  it('should throw an error when removing from an empty cart', () => {
    const cart = new ShoppingCart();

    expect(() => {
      cart.removeItem('1');
    }).toThrow('Item not found in cart');
  });
});

describe('ShoppingCart - Calculate Total', () => {
  it('should return 0 for an empty cart', () => {
    const cart = new ShoppingCart();

    expect(cart.calculateTotal()).toBe(0);
  });

  it('should calculate the total price of items without discount', () => {
    const cart = new ShoppingCart();
    cart.addItem({ id: '1', name: 'Apple', price: 10, quantity: 2 });
    cart.addItem({ id: '2', name: 'Banana', price: 5, quantity: 4 });

    expect(cart.calculateTotal()).toBe(40);
  });

  it('should not apply a discount when total is exactly 100', () => {
    const cart = new ShoppingCart();
    cart.addItem({ id: '1', name: 'Widget', price: 50, quantity: 2 });

    expect(cart.calculateTotal()).toBe(100);
  });

  it('should apply a 10% discount when total exceeds 100', () => {
    const cart = new ShoppingCart();
    cart.addItem({ id: '1', name: 'Widget', price: 60, quantity: 2 });

    expect(cart.calculateTotal()).toBe(108);
  });
});