'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { useOrders } from '@/hooks/useOrders';
import { MapPin, Calendar, Weight, DollarSign, Upload, X } from 'lucide-react';

export default function CreateOrderPage() {
  const router = useRouter();
  const { user } = useUser();
  const { createOrder } = useOrders();
  
  const [formData, setFormData] = useState({
    from_location: '',
    to_location: '',
    description: '',
    price: '',
    delivery_date: '',
    weight_kg: '',
  });
  
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: string[] = [];
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            newImages.push(event.target.result as string);
            if (newImages.length === Array.from(files).length) {
              setImages(prev => [...prev, ...newImages]);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('Необходимо войти в систему');
      return;
    }

    // Валидация
    if (!formData.from_location || !formData.to_location || !formData.description || 
        !formData.price || !formData.delivery_date || !formData.weight_kg) {
      setError('Все поля обязательны для заполнения');
      return;
    }

    const price = parseFloat(formData.price);
    const weight = parseFloat(formData.weight_kg);

    if (isNaN(price) || price <= 0) {
      setError('Цена должна быть больше 0');
      return;
    }

    if (isNaN(weight) || weight <= 0) {
      setError('Вес должен быть больше 0');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await createOrder({
        executor_id: null,
        from_location: formData.from_location,
        to_location: formData.to_location,
        description: formData.description,
        price,
        delivery_date: formData.delivery_date,
        weight_kg: weight,
        image_urls: images,
        status: 'new',
      }, user.telegramId);

      if (result.success) {
        router.push('/');
      } else {
        setError(result.error || 'Ошибка создания заказа');
      }
    } catch (err) {
      setError('Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">
                Создать заказ на доставку
              </h1>

              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="inline h-4 w-4 mr-1" />
                      Откуда
                    </label>
                    <input
                      type="text"
                      name="from_location"
                      value={formData.from_location}
                      onChange={handleInputChange}
                      placeholder="Город отправления"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="inline h-4 w-4 mr-1" />
                      Куда
                    </label>
                    <input
                      type="text"
                      name="to_location"
                      value={formData.to_location}
                      onChange={handleInputChange}
                      placeholder="Город назначения"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Описание посылки
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Опишите, что нужно доставить..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <DollarSign className="inline h-4 w-4 mr-1" />
                      Цена (₽)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Weight className="inline h-4 w-4 mr-1" />
                      Вес (кг)
                    </label>
                    <input
                      type="number"
                      name="weight_kg"
                      value={formData.weight_kg}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="inline h-4 w-4 mr-1" />
                      Дата доставки
                    </label>
                    <input
                      type="date"
                      name="delivery_date"
                      value={formData.delivery_date}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Upload className="inline h-4 w-4 mr-1" />
                    Фотографии (необязательно)
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  
                  {images.length > 0 && (
                    <div className="mt-3 grid grid-cols-4 gap-2">
                      {images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image}
                            alt={`Изображение ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Создание...' : 'Создать заказ'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
