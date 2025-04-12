import Link from 'next/link'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          🍽️ SparkMeals
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Quick Meal Order Service
        </p>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
            🎯 How It Works
          </h2>
          
          <div className="grid gap-4 mb-8">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-medium dark:text-white">1. Choose your meal</h3>
              <p className="text-gray-600 dark:text-gray-300">Browse our delicious selection</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-medium dark:text-white">2. Set quantity</h3>
              <p className="text-gray-600 dark:text-gray-300">Tell us how many servings you need</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-medium dark:text-white">3. Add delivery details</h3>
              <p className="text-gray-600 dark:text-gray-300">Where should we deliver your meal?</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-medium dark:text-white">4. Get your food delivered!</h3>
              <p className="text-gray-600 dark:text-gray-300">Enjoy your delicious meal</p>
            </div>
          </div>

          <Link 
            href="/menu"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Start Ordering Now
          </Link>
        </div>
      </div>
    </div>
  )
}
