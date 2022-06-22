import { useState } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';

import Input from './Input';
import Button from '../UI/Button';

import { GlobalStyles } from '../../constants/styles';

import { getFormattedDate } from '../../util/date';

function ExpenseForm({ formTitle, submitButtonLabel, onCancel, onSubmit, defaultValues }) {
    const [inputs, setInputs] = useState({
        date:  {
            value: defaultValues ? getFormattedDate(defaultValues.date) : '',
            isValid: true,
        },
        amount:  {
            value: defaultValues ? defaultValues.amount.toFixed(2).toString() : '',
            isValid: true,
        },
        description: {
            value: defaultValues ? defaultValues.description : '',
            isValid: true,
        },
    });

    function inputChangedHandler(inputIdentifier, enteredValue) {
        setInputs((curInputValues) => {
            return {
                ...curInputValues,
                [inputIdentifier]: { value: enteredValue,isValid: true, },
            }
        });
    }

    function submitHandler() {
        const expenseData ={
            date: new Date(inputs.date.value),
            amount: +inputs.amount.value,
            description: inputs.description.value,
        };

        const dateIsValid = expenseData.date.toString() !== 'Invalid Date';
        const amountIsValid = !isNaN(expenseData.amount) && expenseData.amount > 0;
        const descriptionIsValid = expenseData.description.trim().length > 0;

        if (!dateIsValid || !amountIsValid || !descriptionIsValid){
            //Alert.alert('Error Occurred!', errMsg);
            setInputs((curInputs) => {
                return {
                    date: { value: curInputs.date.value, isValid: dateIsValid },
                    amount: { value: curInputs.amount.value, isValid: amountIsValid },
                    description: { 
                        value: curInputs.description.value, 
                        isValid: descriptionIsValid 
                    }
                }
            });
            return;
        }else{
            onSubmit(expenseData);
        }

    }

    const haveError = 
        !inputs.amount.isValid || 
        !inputs.date.isValid || 
        !inputs.description.isValid;

    return (
        <View style={styles.form}>
            <Text style={styles.title}>
                {formTitle}
            </Text>
            <View style={styles.inputRow}>
                <Input 
                    style={styles.rowInput}
                    label="Date (YYYY-MM-DD)" 
                    invalid={!inputs.date.isValid}
                    textInputConfig={{
                        placeholder: 'YYYY-MM-DD',
                        maxLength: 10,
                        onChangeText: inputChangedHandler.bind(this, 'date'),
                        value: inputs.date.value,
                    }} 
                />
                <Input 
                    style={styles.rowInput}
                    label="Amount (RM)" 
                    invalid={!inputs.amount.isValid}
                    textInputConfig={{
                        placeholder: 'Amount',
                        keyboardType: 'decimal-pad',
                        onChangeText: inputChangedHandler.bind(this, 'amount'),
                        value: inputs.amount.value,
                    }}
                />
            </View>
            <Input 
                style={styles.marginDesc}
                label="Description" 
                invalid={!inputs.description.isValid}
                textInputConfig={{
                    placeholder: 'Description',
                    multiline: true,
                    //autoCapitalize: 'none',
                    //autoCorrect: false, //default is true
                    onChangeText: inputChangedHandler.bind(this, 'description'),
                    value: inputs.description.value,
                }}
            />
            {haveError && (
                <Text style={styles.errorText}>Invalid input detected! Please check your entered values.</Text>
            )}
            <View style={styles.buttons}>
                <Button 
                    mode="flat" 
                    onPress={onCancel}
                    style={styles.button}
                >
                    Cancel
                </Button>
                <Button 
                    onPress={submitHandler}
                    style={styles.button}
                >
                    {submitButtonLabel}
                </Button>
            </View>
        </View>
    );
}

export default ExpenseForm;

const styles = StyleSheet.create({
    form: {
        marginTop: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginVertical: 24,
        textAlign: 'center',
    },
    inputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    rowInput: {
        flex: 1,
    },
    marginDesc: {
        marginBottom: 24,
    },
    errorText: {
        textAlign: 'center',
        backgroundColor: GlobalStyles.colors.primary100,
        color: GlobalStyles.colors.error500,
        margin: 8,
        padding: 6,
        borderRadius: 6,
        fontWeight: 'bold',
        marginBottom: 24,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        minWidth: 120,
        marginHorizontal: 8,
    },
});