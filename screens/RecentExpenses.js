import { useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

import ExpensesOutput from '../components/ExpensesOutput/ExpensesOutput';
import ErrorOverlay from '../components/UI/ErrorOverlay';
import LoadingOverlay from '../components/UI/LoadingOverlay';

import { ExpensesContext } from '../store/expenses-context';
import { getDateMinusDays } from '../util/date';
import { getExpenses } from '../util/http';

function RecentExpenses () {
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState();

    const expensesCtx = useContext(ExpensesContext);

    useEffect(() => {
        async function fetchExpenses() {
            setIsFetching(true);
            try{
                const expenses = await getExpenses();
                expensesCtx.setExpenses(expenses);
            }catch (error) {
                setError('An error occurred while fetching expenses! Please try again later.');
            }
            setIsFetching(false);
        }

        fetchExpenses();
    }, []);

    if (error && !isFetching) {
        return (
            <ErrorOverlay message={error} />
        );
    }

    if (isFetching) {
        return (
            <LoadingOverlay />
        );
    }

    const recentExpenses = expensesCtx.expenses.filter((expense) => {
        const today = new Date();
        const date7DaysAgo = getDateMinusDays(today, 7);

        return (expense.date >= date7DaysAgo) && (expense.date <= today);
    });

    return (
        <ExpensesOutput 
            expenses={recentExpenses} 
            expensesPeriod="Last 7 Days" 
            fallbackText="No expenses found for the last 7 days!"
        />
    );
}

export default RecentExpenses;

const styles = StyleSheet.create({
    
});