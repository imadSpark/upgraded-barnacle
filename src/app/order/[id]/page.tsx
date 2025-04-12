'use client'

import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getMealById } from '@/data/meals'
import { useState, FormEvent } from 'react'

export default function OrderPage({ params }: { params: { id: string } }) {
  // No need to unwrap params with React.use()
  const mealId = params.id
  const meal = getMealById(parseInt(mealId))
  
  if (!meal) {
    notFound()
  }

  // Form state
  const [quantity, setQuantity] = useState(1)
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    address: '',
    instructions: ''
  })

  // Validation state
  const [errors, setErrors] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    address: '',
    quantity: ''
  })

  // Track if form was submitted
  const [attemptedSubmit, setAttemptedSubmit] = useState(false)

  // Add loading state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderStatus, setOrderStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null)

  // Handle quantity changes
  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
      validateField('quantity', quantity - 1)
    }
  }

  const handleIncreaseQuantity = () => {
    setQuantity(quantity + 1)
    validateField('quantity', quantity + 1)
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    if (!isNaN(value) && value > 0) {
      setQuantity(value)
      validateField('quantity', value)
    }
  }

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })

    // Validate field if form was already submitted once
    if (attemptedSubmit) {
      validateField(name, value)
    }
  }

  // Validate a single field
  const validateField = (name: string, value: string | number) => {
    let errorMessage = ''

    switch (name) {
      case 'fullName':
        if (!value) errorMessage = 'Full name is required'
        break
      case 'phoneNumber':
        if (!value) {
          errorMessage = 'Phone number is required'
        } else if (!/^\+?[0-9]{10,15}$/.test(value.toString())) {
          errorMessage = 'Please enter a valid phone number'
        }
        break
      case 'email':
        if (!value) {
          errorMessage = 'Email is required'
        } else if (!/\S+@\S+\.\S+/.test(value.toString())) {
          errorMessage = 'Please enter a valid email address'
        }
        break
      case 'address':
        if (!value) errorMessage = 'Delivery address is required'
        break
      case 'quantity':
        const numValue = typeof value === 'string' ? parseInt(value) : value
        if (!value || numValue < 1) errorMessage = 'Quantity must be at least 1'
        break
      default:
        break
    }

    setErrors(prev => ({
      ...prev,
      [name]: errorMessage
    }))

    return !errorMessage
  }

  // Validate all fields
  const validateForm = () => {
    const fieldsToValidate = ['fullName', 'phoneNumber', 'email', 'address', 'quantity']
    let isValid = true

    fieldsToValidate.forEach(field => {
      const value = field === 'quantity' ? quantity : formData[field as keyof typeof formData]
      const fieldIsValid = validateField(field, value)
      if (!fieldIsValid) isValid = false
    })

    return isValid
  }

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setAttemptedSubmit(true)
    setOrderStatus(null)

    if (validateForm()) {
      try {
        setIsSubmitting(true)
        
        // Calculate total
        const total = (meal.price * quantity + 3.99).toFixed(2)
        
        // Order details to be sent to the server
        const orderDetails = {
          meal,
          quantity,
          formData,
          total
        }

        // Call our API to place the order and send WhatsApp notification
        const response = await fetch('/api/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`
          },
          body: JSON.stringify({
            phone: formData.phoneNumber,
            orderDetails
          })
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || 'Failed to place order')
        }

        // Set success status
        setOrderStatus({
          success: true,
          message: 'Order placed successfully! You will receive a WhatsApp confirmation shortly.'
        })

        // Reset form after successful submission
        setFormData({
          fullName: '',
          phoneNumber: '',
          email: '',
          address: '',
          instructions: ''
        })
        setQuantity(1)
      } catch (error) {
        console.error('Error placing order:', error)
        setOrderStatus({
          success: false,
          message: error instanceof Error ? error.message : 'An unexpected error occurred'
        })
      } finally {
        setIsSubmitting(false)
      }
    } else {
      // Form has errors, scroll to the first error
      const errorField = document.querySelector('.error-message')
      if (errorField) {
        errorField.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Order Details 📋</h1>

        {/* Order Status Alert */}
        {orderStatus && (
          <div className={`mb-6 p-4 rounded-lg ${orderStatus.success ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'}`}>
            {orderStatus.message}
          </div>
        )}

        {/* Selected Meal */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="flex gap-6">
            <div className="relative w-32 h-32">
              <Image
                src={meal.image}
                alt={meal.name}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{meal.name}</h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg">${meal.price.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Quantity Selection */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quantity</h2>
            <div className="flex items-center gap-4">
              <button 
                type="button"
                onClick={handleDecreaseQuantity}
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 flex items-center justify-center text-xl"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
                className={`w-20 text-center p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 ${errors.quantity ? 'border-red-500' : ''}`}
              />
              <button 
                type="button"
                onClick={handleIncreaseQuantity}
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 flex items-center justify-center text-xl"
              >
                +
              </button>
            </div>
            {errors.quantity && (
              <p className="text-red-500 text-sm mt-2 error-message">{errors.quantity}</p>
            )}
          </div>

          {/* Delivery Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Delivery Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 ${errors.fullName ? 'border-red-500' : ''}`}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-2 error-message">{errors.fullName}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 ${errors.phoneNumber ? 'border-red-500' : ''}`}
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-2 error-message">{errors.phoneNumber}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-2 error-message">{errors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Delivery Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 ${errors.address ? 'border-red-500' : ''}`}
                  rows={3}
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-2 error-message">{errors.address}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                  Delivery Instructions (Optional)
                </label>
                <textarea
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-800 dark:text-gray-200">
                <span>Subtotal ({quantity} x ${meal.price.toFixed(2)})</span>
                <span>${(meal.price * quantity).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-800 dark:text-gray-200">
                <span>Delivery Fee</span>
                <span>$3.99</span>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-2 border-t dark:border-gray-700 text-gray-900 dark:text-white">
                <span>Total</span>
                <span>${(meal.price * quantity + 3.99).toFixed(2)}</span>
              </div>
            </div>
            <button 
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}