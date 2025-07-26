'use client';

import { useState } from 'react';

export default function FinancingCalculator({ price }: { price: number }) {
    const [loanAmount, setLoanAmount] = useState(price);
    const [interestRate, setInterestRate] = useState(5);
    const [loanTerm, setLoanTerm] = useState(60);
    const [downPayment, setDownPayment] = useState(0);

    const calculateMonthlyPayment = () => {
        const principal = loanAmount - downPayment;
        const monthlyInterestRate = interestRate / 100 / 12;
        const numberOfPayments = loanTerm;

        if (principal <= 0) return 0;

        const monthlyPayment = (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
            (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

        return monthlyPayment.toFixed(2);
    };

    return (
        <div className="p-8 md:p-12 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Financing Calculator
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div>
                        <label htmlFor="loanAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Loan Amount ($)</label>
                        <input type="number" id="loanAmount" value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <div>
                        <label htmlFor="downPayment" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Down Payment ($)</label>
                        <input type="number" id="downPayment" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <div>
                        <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Interest Rate (%)</label>
                        <input type="number" id="interestRate" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <div>
                        <label htmlFor="loanTerm" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Loan Term (Months)</label>
                        <input type="number" id="loanTerm" value={loanTerm} onChange={(e) => setLoanTerm(Number(e.target.value))} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                </div>
                <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-900 rounded-lg p-8">
                    <div className="text-center">
                        <p className="text-lg text-gray-600 dark:text-gray-400">Estimated Monthly Payment</p>
                        <p className="text-5xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                            ${calculateMonthlyPayment()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
