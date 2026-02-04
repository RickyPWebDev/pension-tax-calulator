(function() {
    let formData = {
        statePensionMonthly: 0,
        privatePensionMonthly: 0,
        otherIncomeYearly: 0,
        taxYear: '2025-26',
        costs: 0
    };

    const TAX_BANDS = {
        '2025-26': { personalAllowance: 12570, basicRateLimit: 37700, basicRate: 0.20, higherRate: 0.40, additionalRate: 0.45 },
        '2026-27': { personalAllowance: 12570, basicRateLimit: 37700, basicRate: 0.20, higherRate: 0.40, additionalRate: 0.45 },
        '2027-28': { personalAllowance: 12570, basicRateLimit: 37700, basicRate: 0.20, higherRate: 0.40, additionalRate: 0.45 }
    };

    const GBP_FORMATTER = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });

    function collectUserData() {
        const formDataObj = new FormData(document.getElementById('pension-form'));
        formData.statePensionMonthly = parseFloat(formDataObj.get('statePensionMonthly')) || 0;
        formData.privatePensionMonthly = parseFloat(formDataObj.get('privatePensionMonthly')) || 0;
        formData.otherIncomeYearly = parseFloat(formDataObj.get('otherIncomeYearly')) || 0;
        formData.taxYear = formDataObj.get('taxYear') || '2025-26';
        formData.costs = parseFloat(formDataObj.get('costs')) || 0;
    }

    function calculateTax() {
        collectUserData();
        const bands = TAX_BANDS[formData.taxYear] || TAX_BANDS['2025-26'];

        const stateYearly = formData.statePensionMonthly * 12;
        const privateYearly = formData.privatePensionMonthly * 12;
        const totalIncome = (stateYearly + privateYearly + formData.otherIncomeYearly) - formData.costs;
        const taxableIncome = Math.max(0, totalIncome - bands.personalAllowance);

        // Full tax bands (20% → 40% → 45%)
        let tax = 0;
        let remaining = taxableIncome;
        tax += Math.min(remaining, bands.basicRateLimit) * bands.basicRate;
        remaining -= bands.basicRateLimit;
        if (remaining > 0) {
            const higherBand = 74870;  // To £125,140 total
            tax += Math.min(remaining, higherBand) * bands.higherRate;
            remaining -= higherBand;
            if (remaining > 0) tax += remaining * bands.additionalRate;
        }

        // Formatted display with line breaks & commas
        document.getElementById('totalIncome').textContent = 
            `Total Yearly income\n(state pension + Private Pension + other income): ${GBP_FORMATTER.format(totalIncome)}`;

         document.getElementById('deductibles').textContent = 
           `Total Yearly income\n(deductibles): ${GBP_FORMATTER.format(formData.costs)}`;

        document.getElementById('annualTax').textContent = 
            `Yearly income tax: ${GBP_FORMATTER.format(tax)}`;
        document.getElementById('monthlySetAside').textContent = 
            `Suggested monthly amount to set aside: ${GBP_FORMATTER.format(tax / 12)}`;

        // Show & scroll
        const resultsSection = document.getElementById('results');
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.scrollBy(0, -80);
    }

    function init() {
        const form = document.getElementById('pension-form');
        form.addEventListener('submit', e => { e.preventDefault(); calculateTax(); });
        document.getElementById('calculateBtn').addEventListener('click', e => { e.preventDefault(); calculateTax(); });
        document.getElementById('results').style.display = 'none';
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
