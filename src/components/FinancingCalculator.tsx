'use client';

import { useState, useMemo } from 'react';
import CountUp from './CountUp';

export default function FinancingCalculator({ price }: { price: number }) {
    const [loanAmount, setLoanAmount] = useState(price);
    const [interestRate, setInterestRate] = useState(5);
    const [loanTerm, setLoanTerm] = useState(60);
    const [downPayment, setDownPayment] = useState(0);

    const monthlyPayment = useMemo(() => {
        const principal = loanAmount - downPayment;
        const monthlyInterestRate = interestRate / 100 / 12;
        const numberOfPayments = loanTerm;

        if (principal <= 0 || monthlyInterestRate <= 0) return 0;

        if (principal <= 0 || monthlyInterestRate <= 0) return 0;

        return (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
            (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    }, [loanAmount, downPayment, interestRate, loanTerm]);

    return (
        <div className="p-6 border rounded-lg bg-gray-50 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Financing Calculator
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Inputs Section */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="loanAmount" className="block text-sm font-medium text-gray-600">Loan Amount</label>
                        <input type="number" id="loanAmount" value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))} className="mt-1 block w-full p-2 border rounded-md text-base" />
                    </div>
                    <div>
                        <label htmlFor="downPayment" className="block text-sm font-medium text-gray-600">Down Payment</label>
                        <input type="number" id="downPayment" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} className="mt-1 block w-full p-2 border rounded-md text-base" />
                    </div>
                    <div>
                        <label htmlFor="interestRate" className="block text-sm font-medium text-gray-600">Interest Rate (%)</label>
                        <input type="number" id="interestRate" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} className="mt-1 block w-full p-2 border rounded-md text-base" />
                    </div>
                    <div>
                        <label htmlFor="loanTerm" className="block text-sm font-medium text-gray-600">Term (Months)</label>
                        <input type="number" id="loanTerm" value={loanTerm} onChange={(e) => setLoanTerm(Number(e.target.value))} className="mt-1 block w-full p-2 border rounded-md text-base" />
                    </div>
                </div>
                
                {/* Result Section */}
                <div className="relative rounded-lg p-6 text-center h-full flex flex-col justify-center overflow-hidden bg-gray-800">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-indigo-600 animate-slow-pulse"></div>
                    <div className="relative z-10">
                        <p className="text-lg text-white/80">Monthly Payment</p>
                        <div className="text-5xl font-bold text-white mt-2">
                            $
                            <CountUp
                                to={monthlyPayment}
                                duration={1.5}
                                separator=","
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
