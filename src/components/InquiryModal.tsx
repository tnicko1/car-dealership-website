'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useModal } from '@/providers/ModalProvider';

export default function InquiryModal() {
    const { modalType, closeModal, selectedCar } = useModal();
    const isOpen = modalType === 'inquiry';

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Handle form submission
        closeModal();
    };
    
    if (!selectedCar) return null;

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={closeModal}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
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
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-gray-800">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                                >
                                    Inquire about the {selectedCar.year} {selectedCar.make} {selectedCar.model}
                                </Dialog.Title>
                                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                                    <div>
                                        <label htmlFor="name" className="sr-only">Your Name</label>
                                        <input id="name" type="text" name="name" placeholder="Your Name" required className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="sr-only">Your Email</label>
                                        <input id="email" type="email" name="email" placeholder="Your Email" required className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                                    </div>
                                    <div>
                                        <label htmlFor="phone" className="sr-only">Your Phone</label>
                                        <input id="phone" type="tel" name="phone" placeholder="Your Phone" required className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                                    </div>
                                    <div>
                                        <label htmlFor="message" className="sr-only">Your Message</label>
                                        <textarea id="message" name="message" placeholder="Your Message (optional)" className="p-2 border rounded w-full h-24 dark:bg-gray-700 dark:border-gray-600"></textarea>
                                    </div>
                                    <div className="mt-4">
                                        <button
                                            type="submit"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                        >
                                            Send Inquiry
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}
