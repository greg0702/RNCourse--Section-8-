import { StyleSheet, View, Text } from 'react-native';

import { GlobalStyles } from '../../constants/styles';

function ExpensesSummary({ expenses, periodName }){
    //reduce execute on arrays to allow combine multiple values in an array into a single value
    //sum will be brought forward each execution other than first time
    //set as 0 at first
    const expensesSum = expenses.reduce((sum, expense) => {
        return sum + expense.amount
    }, 0);

    //toFixed is to fix the value to the number of decimal stated
    return (
        <View style={styles.container}>
            <Text style={styles.period}>{periodName}</Text>
            <Text style={styles.sum}>RM {expensesSum.toFixed(2)}</Text>
        </View>
    );
}

export default ExpensesSummary;

const styles = StyleSheet.create({
    container: {
        padding: 8,
        backgroundColor: GlobalStyles.colors.primary50,
        borderRadius: 6,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    period: {
        fontSize: 12,
        color: GlobalStyles.colors.primary400,
    },
    sum: {
        fontSize: 16,
        fontWeight: 'bold',
        color: GlobalStyles.colors.primary500,
    },
});