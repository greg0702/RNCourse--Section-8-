import { useContext, useLayoutEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import IconButton from '../components/UI/IconButton';
import ExpenseForm from '../components/ManageExpense/ExpenseForm';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import ErrorOverlay from '../components/UI/ErrorOverlay';

import { GlobalStyles } from '../constants/styles';

import { ExpensesContext } from '../store/expenses-context';
import { deleteExpense, storeExpense, updateExpense } from '../util/http';

function ManageExpense ({ route, navigation }) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const expensesCtx = useContext(ExpensesContext);

    const editedExpenseId = route.params?.expenseId;
    //!! to convert a truthy value to true; falsy value to false in boolean
    const isEditing = !!editedExpenseId;

    const selectedExpense = expensesCtx.expenses.find(expense => expense.id === editedExpenseId);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: isEditing ? 'Edit Expense' : 'Add New Expense'
        });
    }, [navigation, isEditing]);

    async function deleteExpenseHandler() {
        setIsLoading(true);
        try {
            await deleteExpense(editedExpenseId);
            expensesCtx.deleteExpense(editedExpenseId);
            navigation.goBack();
        }catch (error) {
            setError('An error occurred while deleting this expenses! Please try again later.');
        }
        //no need to do for delete as screen will be close after that
        setIsLoading(false);
    }

    function cancelHandler() {
        navigation.goBack();
    }

    async function confirmHandler(expenseData) {
        setIsLoading(true);

        try {
            if (isEditing){
                expensesCtx.updateExpense(editedExpenseId, expenseData);
                await updateExpense(editedExpenseId, expenseData);
                navigation.goBack();
            }else{
                const id = await storeExpense(expenseData);
                expensesCtx.addExpense({ ...expenseData, id: id });
            }
        } catch (error) {
            setError('An error occurred while saving this expenses! Please try again later.');
        }

        //same as delete
        setIsLoading(false);
    }
    
    if (error && !isLoading) {
        return (
            <ErrorOverlay message={error} />
        );
    }

    if (isLoading) {
        return (
            <LoadingOverlay />
        );
    }

    return (
        <View style={styles.container}>
            <ExpenseForm 
                formTitle={isEditing ? 'Edit Your Expense' : 'Add A New Expense'}
                submitButtonLabel={isEditing ? 'Update' : 'Add'}
                onCancel={cancelHandler} 
                onSubmit={confirmHandler}
                defaultValues={selectedExpense}
            />
            {isEditing && (
                <View style={styles.deleteContainer}>
                    <IconButton 
                    icon="trash" 
                    color={GlobalStyles.colors.error500} 
                    size={36} 
                    onPress={deleteExpenseHandler}
                    />
                </View>
            )}
        </View>
    );
}

export default ManageExpense;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: GlobalStyles.colors.primary800,
    },
    deleteContainer: {
        marginTop: 16,
        paddingTop: 8,
        borderTopWidth: 2,
        borderTopColor: GlobalStyles.colors.primary200,
        alignItems: 'center',
    },
});