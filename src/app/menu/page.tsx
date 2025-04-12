'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MEALS, getUniqueCategories } from '@/data/meals'

// Extract unique categories for filter buttons
const categories = getUniqueCategories();

export default function MenuPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Handle search input change
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  // Filter meals based on search query and selected category
  const filteredMeals = MEALS.filter(meal => {
    const matchesSearch = meal.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || meal.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">Select Your Meal 🍽️</h1>
      
      {/* Search and Categories */}
      <div className="max-w-2xl mx-auto mb-8">
        <input
          type="search"
          placeholder="Search meals..."
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:placeholder-gray-400 mb-4"
          value={searchQuery}
          onChange={handleSearch}
        />
        
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(category => (
            <button 
              key={category}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedCategory === category 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              onClick={() => handleCategorySelect(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Meal Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {filteredMeals.length > 0 ? (
          filteredMeals.map((meal) => (
            <div key={meal.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={meal.image}
                  alt={meal.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">{meal.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">${meal.price.toFixed(2)}</p>
                <Link
                  href={`/order/${meal.id}`}
                  className="block text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Select
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-600 dark:text-gray-300 text-lg">No meals found matching your search criteria</p>
          </div>
        )}
      </div>
    </div>
  )
} 