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

        if (principal <= 0 || monthlyInterestRate <= 0) return 0;

        const monthlyPayment = (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
            (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

        return monthlyPayment.toFixed(2);
    };

    return (
        <div className="p-6 border rounded-lg bg-gray-50 dark:bg-gray-900/50 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Financing Calculator
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                {/* Inputs Column */}
                <div className="md:col-span-2 grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="loanAmount" className="block text-xs font-medium text-gray-600 dark:text-gray-400">Loan Amount</label>
                        <input type="number" id="loanAmount" value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))} className="mt-1 block w-full p-2 border rounded-md text-sm dark:bg-gray-800 dark:border-gray-600" />
                    </div>
                    <div>
                        <label htmlFor="downPayment" className="block text-xs font-medium text-gray-600 dark:text-gray-400">Down Payment</label>
                        <input type="number" id="downPayment" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} className="mt-1 block w-full p-2 border rounded-md text-sm dark:bg-gray-800 dark:border-gray-600" />
                    </div>
                    <div>
                        <label htmlFor="interestRate" className="block text-xs font-medium text-gray-600 dark:text-gray-400">Interest Rate (%)</label>
                        <input type="number" id="interestRate" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} className="mt-1 block w-full p-2 border rounded-md text-sm dark:bg-gray-800 dark:border-gray-600" />
                    </div>
                    <div>
                        <label htmlFor="loanTerm" className="block text-xs font-medium text-gray-600 dark:text-gray-400">Term (Months)</label>
                        <input type="number" id="loanTerm" value={loanTerm} onChange={(e) => setLoanTerm(Number(e.target.value))} className="mt-1 block w-full p-2 border rounded-md text-sm dark:bg-gray-800 dark:border-gray-600" />
                    </div>
                </div>
                
                {/* Result Column */}
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center h-full flex flex-col justify-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Payment</p>
                    <p className="text-3xl font-bold text-primary dark:text-primary-400">
                        ${calculateMonthlyPayment()}
                    </p>
                </div>
            </div>
        </div>
    )
}
