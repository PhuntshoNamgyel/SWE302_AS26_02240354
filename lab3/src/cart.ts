export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export class ShoppingCart {
  private items: CartItem[] = [];
  private readonly DISCOUNT_THRESHOLD = 100;
  private readonly DISCOUNT_RATE = 0.1;

  addItem(item: CartItem): void {
    this.validateItem(item);

    const existingItem = this.findItemById(item.id);

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      this.items.push(item);
    }
  }

  removeItem(id: string): void {
    const existingItem = this.findItemById(id);

    if (!existingItem) {
      throw new Error('Item not found in cart');
    }

    this.items = this.items.filter(item => item.id !== id);
  }

  calculateTotal(): number {
    const subtotal = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (subtotal > this.DISCOUNT_THRESHOLD) {
      return subtotal * (1 - this.DISCOUNT_RATE);
    }

    return subtotal;
  }

  getItems(): CartItem[] {
    return [...this.items];
  }

  private validateItem(item: CartItem): void {
    if (item.price <= 0) {
      throw new Error('Price must be greater than 0');
    }

    if (item.quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }
  }

  private findItemById(id: string): CartItem | undefined {
    return this.items.find(item => item.id === id);
  }
}