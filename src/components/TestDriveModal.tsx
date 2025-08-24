'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { X } from 'lucide-react';
import { useModal } from '@/providers/ModalProvider';

export default function TestDriveModal() {
  const { modalType, closeModal, selectedCar } = useModal();
  const isOpen = modalType === 'testDrive';
  
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    console.log({
        carId: selectedCar?.id,
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        preferredDate: formData.get('date'),
        preferredTime: formData.get('time'),
    });

    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setMessage('Your test drive request has been submitted! We will contact you shortly.');
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                  Book a Test Drive for the {selectedCar.year} {selectedCar.make} {selectedCar.model}
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
                    <input type="text" name="name" placeholder="Your Name" required className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                    <input type="email" name="email" placeholder="Your Email" required className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                    <input type="tel" name="phone" placeholder="Your Phone" required className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Preferred Date</label>
                            <input type="date" id="date" name="date" required className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                        </div>
                        <div>
                            <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Preferred Time</label>
                            <input type="time" id="time" name="time" required className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                        </div>
                    </div>

                    <div className="mt-6">
                      <button type="submit" disabled={isSubmitting} className="inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:bg-gray-400">
                        {isSubmitting ? 'Submitting...' : 'Request Test Drive'}
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
