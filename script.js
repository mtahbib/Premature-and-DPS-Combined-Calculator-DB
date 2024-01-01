function decideAndCalculate() {
    const years = document.getElementById('years').value;
    const rate = document.getElementById('rate').value;
    const months = document.getElementById('months').value;
    const savingsRate = document.getElementById('savingsRate').value;
    const installmentSize = document.getElementById('installmentSize').value;

    let allInputsProvided = years && rate && months && savingsRate && installmentSize;

    if (allInputsProvided) {
        const result1 = calculateMaturity(allInputsProvided);
        const result2 = calculateMaturity1();

        const combinedMaturity = result1.maturity.plus(result2.maturity);
        const combinedPrincipal = result1.totalPrincipal.plus(result2.totalPrincipal);
        const combinedProfit = result1.totalProfit.plus(result2.totalProfit);

        displayResult({ maturity: combinedMaturity, totalPrincipal: combinedPrincipal, totalProfit: combinedProfit });
    } else if (years && rate) {
        const result = calculateMaturity(false);
        displayResult(result);
    } else if (months && savingsRate) {
        const result = calculateMaturity1();
        displayResult(result);
    } else {
        alert("Please fill the required fields for at least one calculation.");
    }
}

function calculateMaturity(allInputsProvided) {
    const years = parseInt(document.getElementById('years').value);
    const rate = parseFloat(document.getElementById('rate').value);
    const installmentSize = parseFloat(document.getElementById('installmentSize').value);

    if (isNaN(years) || isNaN(rate) || isNaN(installmentSize)) {
        return new Decimal(0);
    }

    const totalInstallments = years * 12;
    return calculateMaturityAmount(installmentSize, rate, totalInstallments, years, allInputsProvided);
}

function calculateMaturity1() {
    const months = parseInt(document.getElementById('months').value);
    const installmentSize = new Decimal(document.getElementById('installmentSize').value);
    const savingsRate = new Decimal(document.getElementById('savingsRate').value);

    if (isNaN(months) || installmentSize.isNaN() || savingsRate.isNaN()) {
        return new Decimal(0);
    }

    Decimal.set({ precision: 20 });
    return calculateMaturityAmount1(installmentSize, savingsRate, months);
}

function calculateMaturityAmount(installmentSize, rate, totalInstallments, years, allInputsProvided) {
    let totalPrincipal = 0;
    let totalAccrual = 0;

    if (years === 1 && !allInputsProvided) {
        totalPrincipal = installmentSize * totalInstallments;
        return { 
            maturity: new Decimal(totalPrincipal), 
            totalPrincipal: new Decimal(totalPrincipal), 
            totalProfit: new Decimal(0) 
        };
    }

    for (let i = 1; i <= totalInstallments; i++) {
        totalPrincipal += installmentSize;
        totalAccrual += (totalPrincipal * rate * 30) / 36000;

        if (i % 12 === 0 && i < totalInstallments) {
            totalPrincipal += totalAccrual;
            totalAccrual = 0;
        }
    }

    const maturity = totalPrincipal + totalAccrual;
    const totalProfit = maturity - totalPrincipal;
    return { 
        maturity: new Decimal(maturity), 
        totalPrincipal: new Decimal(totalPrincipal), 
        totalProfit: new Decimal(totalProfit) 
    };
}

function calculateMaturityAmount1(installmentSize, savingRate, totalInstallments) {
    let totalPrincipal = new Decimal(0);
    let totalAccrual = new Decimal(0);

    for (let i = 1; i <= totalInstallments; i++) {
        totalPrincipal = totalPrincipal.plus(installmentSize);
        totalAccrual = totalAccrual.plus(totalPrincipal.times(savingRate).times(30).div(36000));
    }

    const maturity = totalPrincipal.plus(totalAccrual);
    const totalProfit = maturity.minus(totalPrincipal);
    return { 
        maturity: maturity, 
        totalPrincipal: totalPrincipal, 
        totalProfit: totalProfit 
    };
}

function displayResult(result) {
    const resultHTML = `
        <div class="mt-8">
            <p class="text-lg font-semibold">Total Maturity Amount: TK ${result.maturity.toFixed(2)}</p>
            <p class="text-lg font-semibold">Principal Amount: TK ${result.totalPrincipal.toFixed(2)}</p>
            <p class="text-lg font-semibold">Total Profit: TK ${result.totalProfit.toFixed(2)}</p>
        </div>
    `;
    document.getElementById('result').innerHTML = resultHTML;
}
