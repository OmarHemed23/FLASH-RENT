export default function TransactionCard({ isDeposit, refNo, transactionDate, amount }) {
  return (
    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md p-3">
        <div className="flex justify-between w-full">
            <div className={`text-lg font-bold ${isDeposit ? 'text-green-500' : 'text-red-500'}`}>
                {isDeposit ? 'Deposit' : 'Withdrawal'}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-300">
                {refNo}
            </div>
        </div>
        <div className="mb-2 text-sm text-gray-500 dark:text-gray-300">
            {transactionDate}
        </div>
        <div className="text-xl font-bold">
            {isDeposit ? '+' : '-'} ${amount}
        </div>
    </div>
  );
};