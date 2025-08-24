'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { X } from 'lucide-react';
import { useModal } from '@/providers/ModalProvider';

export default function TradeInModal() {
  const { modalType, closeModal, selectedCar } = useModal();
  const isOpen = modalType === 'tradeIn';
  
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    console.log({
        carOfInterestId: selectedCar?.id,
        tradeIn: {
            make: formData.get('make'),
            model: formData.get('model'),
            year: formData.get('year'),
            mileage: formData.get('mileage'),
            vin: formData.get('vin'),
            condition: formData.get('condition'),
        },
        contact: {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
        }
    });

    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setMessage('Your trade-in information has been submitted! We will contact you with an estimate shortly.');
  };

  function handleClose() {
    closeModal();
    setMessage('');
  }
  
  if (!selectedCar) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                  Value Your Trade-In
                </Dialog.Title>
                <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
                
                {message ? (
                  <div className="mt-4 text-center p-4 bg-green-100 text-green-800 rounded-lg">
                    <p>{message}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200">Your Vehicle</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                            <input type="text" name="make" placeholder="Make" required className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                            <input type="text" name="model" placeholder="Model" required className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                            <input type="number" name="year" placeholder="Year" required className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                            <input type="number" name="mileage" placeholder="Mileage" required className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                        </div>
                        <input type="text" name="vin" placeholder="VIN (Optional)" className="w-full p-2 border rounded mt-4 dark:bg-gray-700 dark:border-gray-600" />
                        <textarea name="condition" placeholder="Describe the condition of your vehicle (e.g., scratches, dents, mechanical issues)" rows={3} className="w-full p-2 border rounded mt-4 dark:bg-gray-700 dark:border-gray-600"></textarea>
                    </div>
                    
                    <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200">Your Contact Information</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                            <input type="text" name="name" placeholder="Your Name" required className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                            <input type="email" name="email" placeholder="Your Email" required className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                        </div>
                        <input type="tel" name="phone" placeholder="Your Phone" required className="w-full p-2 border rounded mt-4 dark:bg-gray-700 dark:border-gray-600" />
                    </div>

                    <div className="mt-6">
                      <button type="submit" disabled={isSubmitting} className="inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:bg-gray-400">
                        {isSubmitting ? 'Submitting...' : 'Get My Estimate'}
                      </button>
                    </div>
                  </form>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
