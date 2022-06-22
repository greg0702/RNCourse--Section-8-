import { useContext } from 'react';
import { StyleSheet } from 'react-native';

import ExpensesOutput from '../components/ExpensesOutput/ExpensesOutput';

import { ExpensesContext } from '../store/expenses-context';

function AllExpenses () {
    const expensesCtx = useContext(ExpensesContext);

    return (
        <ExpensesOutput 
            expenses={expensesCtx.expenses}
            expensesPeriod="Total" 
            fallbackText="No expenses added yet! Click + to add now!"
        />
    );
}

export default AllExpenses;

const styles = StyleSheet.create({

});