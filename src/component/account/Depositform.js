import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import Spinner from '../Spinner';
import { TbCurrencyNaira } from "react-icons/tb";
import api from '../../api/api'; // Import your API handler (ensure you have the correct setup)

const DepositForm = ({   setActiveForm }) => {
    const [transactionInfo, setTransactionInfo] = useState({
        account_number: '',
        amount: '',
        description: '',
    });
    const [status, setStatus] = useState('IDLE'); // IDLE, PENDING, SUCCESS, FAILED
    const [error, setError] = useState(null); // Error message

    // Close the deposit form
    const closeDepositForm = () => {
        setActiveForm(null);
        // setShowDepositForm(false);
        // setStatus('IDLE');
        // setError(null);
    };

    // Handle form submission (deposit request)
    const handleDeposit = async (e) => {
        e.preventDefault();
        setStatus('PENDING'); // Set status to pending when the request starts

        try {
            // Make the API call to initiate the deposit request
            const response = await api.post('/account/deposit', {
                account_number: transactionInfo.account_number,
                amount: transactionInfo.amount,
                description: transactionInfo.description,
            });

            if (response.data.success) {
                setStatus('SUCCESS'); // Set status to success if deposit is successful
            } else {
                // Check if the response contains an exception message
                const errorMessage = response.data.exception?.message || 'Deposit failed. Please check your details and try again.';
                setError(errorMessage); // Set the error message from the backend
                setStatus('FAILED');
            }
        } catch (err) {
            // If the API request itself fails (network error, etc.), handle it here
            const errorMessage = err?.response?.data?.exception?.message || 'Error processing deposit. Please try again later.';
            setError(errorMessage); // Set the error message from the backend
            setStatus('FAILED');
        }
    };

    return (
        <section className="flex flex-col p-2 gap-8 sm:w-3/5 xl:w-2/5 sm:p-6 h-3/5 bg-white border rounded-xl absolute right-5 left-5 sm:left-auto sm:h-[550px] mt-12">
            <form className="p-2 w-full flex flex-col justify-between h-full relative" onSubmit={handleDeposit}>
                {status === 'PENDING' && <Spinner />} {/* Show spinner when status is pending */}
                <button className="absolute top-1 right-2" type="button" onClick={closeDepositForm}><FaTimes /></button>

                <div className="flex flex-col gap-4">
                    <label>Deposit Funds</label>
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="account_number">Account Number</label>
                    <input
                        type="text"
                        id="account_number"
                        placeholder="Enter your account number"
                        className="flex-1 p-2 lg:p-3 border-grey-200 border-2 rounded-md"
                        value={transactionInfo.account_number}
                        onChange={(e) => setTransactionInfo({ ...transactionInfo, account_number: e.target.value })}
                        required
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="amount">Amount</label>
                    <div className="flex items-center border-grey-200 border-2 rounded-md">
                        <TbCurrencyNaira className="mr-2" /> {/* Add a margin-right to separate the symbol from the input */}
                        <input
                        type="number"
                        id="amount"
                        placeholder="Enter Amount"
                        className="flex-1 p-2 lg:p-3"
                        value={transactionInfo.amount}
                        onChange={(e) => setTransactionInfo({ ...transactionInfo, amount: e.target.value })}
                        required
                        />
                    </div>
                </div>


                <div className="flex flex-col gap-2">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        placeholder="Enter transaction description"
                        className="flex-1 p-2 lg:p-3 border-grey-200 border-2 rounded-md"
                        value={transactionInfo.description}
                        onChange={(e) => setTransactionInfo({ ...transactionInfo, description: e.target.value })}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={status === 'PENDING' || !transactionInfo.account_number || !transactionInfo.amount || !transactionInfo.description}
                    className="bg-blue-500 p-2 rounded-xl text-white font-bold mt-2 hover:bg-opacity-90 transition-all"
                >
                    Deposit
                </button>

                {status === 'FAILED' && error && <p className="text-red-500 mt-2">{error}</p>} {/* Show error if request fails */}
                {status === 'SUCCESS' && <p className="text-green-500 mt-2">Deposit successful!</p>} {/* Show success message */}
            </form>
        </section>
    );
};

export default DepositForm;
