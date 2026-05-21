import type { ShoppingItem } from "@/lib/types";

export const shoppingList: ShoppingItem[] = [
  { id: "sh1", name: "Leche entera", quantity: 4, unit: "L", estimatedPrice: 4800, category: "Frescos", priority: "alta", bought: false },
  { id: "sh2", name: "Pan integral", quantity: 2, unit: "u", estimatedPrice: 3200, category: "Almacén", priority: "media", bought: false },
  { id: "sh3", name: "Detergente", quantity: 1, unit: "u", estimatedPrice: 2700, category: "Limpieza", priority: "alta", bought: false },
  { id: "sh4", name: "Café molido", quantity: 1, unit: "kg", estimatedPrice: 9500, category: "Almacén", priority: "media", bought: false },
  { id: "sh5", name: "Huevos", quantity: 30, unit: "u", estimatedPrice: 6800, category: "Frescos", priority: "alta", bought: true },
  { id: "sh6", name: "Yerba mate", quantity: 1, unit: "kg", estimatedPrice: 4200, category: "Almacén", priority: "media", bought: false },
  { id: "sh7", name: "Shampoo", quantity: 1, unit: "u", estimatedPrice: 5400, category: "Higiene", priority: "baja", bought: false },
  { id: "sh8", name: "Papel higiénico", quantity: 1, unit: "pack 12", estimatedPrice: 8900, category: "Limpieza", priority: "media", bought: false },
  { id: "sh9", name: "Gaseosa 2.25L", quantity: 3, unit: "u", estimatedPrice: 9600, category: "Bebidas", priority: "baja", bought: false },
  { id: "sh10", name: "Tomates", quantity: 1, unit: "kg", estimatedPrice: 2800, category: "Frescos", priority: "media", bought: true },
  { id: "sh11", name: "Arroz", quantity: 2, unit: "kg", estimatedPrice: 3400, category: "Almacén", priority: "media", bought: false },
];
