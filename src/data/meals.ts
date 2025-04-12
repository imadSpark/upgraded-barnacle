// Define meal type for better type safety
export interface Meal {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

// Centralized mock meals data
export const MEALS: Meal[] = [
  {
    id: 1,
    name: 'Spaghetti Bolognese',
    price: 12.99,
    image: '/spaghetti.png',
    category: 'Lunch'
  },
  {
    id: 2,
    name: 'Meatball Burger',
    price: 10.99,
    image: '/meatball.png',
    category: 'Lunch'
  },
  {
    id: 3,
    name: 'Chicken Fried Steak',
    price: 14.99,
    image: '/chickenfried.png',
    category: 'Dinner'
  },
  {
    id: 4,
    name: 'Pasta Primavera',
    price: 11.99,
    image: '/pasta.png',
    category: 'Lunch'
  },
  {
    id: 5,
    name: 'Garden Salad',
    price: 8.99,
    image: '/salad.png',
    category: 'Breakfast'
  },
  {
    id: 6,
    name: 'Grilled Steak',
    price: 16.99,
    image: '/steak.png',
    category: 'Dinner'
  }
];

// Helper function to get meal by ID
export function getMealById(id: number): Meal | undefined {
  return MEALS.find(meal => meal.id === id);
}

// Helper function to get unique categories
export function getUniqueCategories(): string[] {
  return ['All', ...new Set(MEALS.map(meal => meal.category))];
} 