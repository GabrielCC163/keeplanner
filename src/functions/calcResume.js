export default (savings, installments, incomes, expenses) => {	
    let balanceValue = 0;
    let totalSavingsValue = 0;
    let totalInstallmentsValue = 0;
    let totalAvailableMonthValue = 0;
    let totalIncomeValue = 0;
    let totalExpenseValue = 0;

    if (savings) {
        totalSavingsValue = savings.reduce((acc, item) => {
            return item.totalValue + acc;
        }, 0);
        balanceValue = totalSavingsValue;
    }
    
    if (installments) {
        totalInstallmentsValue = installments.reduce((acc, item) => {
            return item.value + acc;
        }, 0);
    }

    if (incomes) {
        totalIncomeValue = incomes.reduce((acc, item) => {
            return item.totalValue + acc;
        }, 0);
        totalAvailableMonthValue = totalIncomeValue;
    }

    if (expenses) {
        totalExpenseValue = expenses.reduce((acc, item) => {
            return item.totalValue + acc;
        }, 0);
        totalAvailableMonthValue -= totalExpenseValue;
    }

    balanceValue += totalAvailableMonthValue;

    return { balanceValue, totalSavingsValue, totalInstallmentsValue, totalAvailableMonthValue, totalIncomeValue, totalExpenseValue };
};