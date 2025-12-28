(function() {
    // Private data storage
    let formData = {
        statePensionMonthly: 0,
        privatePensionMonthly: 0,
        otherIncomeYearly: 0,
        taxYear: '2025-26'
    };

    const TAX_BANDS = {
        '2025-26': {
            personalAllowance: 12570,
            basicRateLimit: 37700,  // Amount taxable at 20% (above personal allowance)
            basicRate: 0.20,
            higherRate: 0.40
        },
        '2026-27': {
            personalAllowance: 12570,  // Assuming same for now
            basicRateLimit: 37700,
            basicRate: 0.20,
            higherRate: 0.40
        }
    };

    // Capture form data safely
    function collectUserData() {
        const form = document.getElementById('pension-form');
        const formDataObj = new FormData(form);
        
        formData.statePensionMonthly = parseFloat(formDataObj.get('statePensionMonthly')) || 0;
        formData.privatePensionMonthly = parseFloat(formDataObj.get('privatePensionMonthly')) || 0;
        formData.otherIncomeYearly = parseFloat(formDataObj.get('otherIncomeYearly')) || 0;
        formData.taxYear = formDataObj.get('taxYear') || '2025-26';
    }

    // Main tax calculation
  function calculateTax() {
    collectUserData();
    const bands = TAX_BANDS[formData.taxYear] || TAX_BANDS['2025-26'];
    
    // Convert monthly to yearly
    const stateYearly = formData.statePensionMonthly * 12;
    const privateYearly = formData.privatePensionMonthly * 12;
    const totalIncome = stateYearly + privateYearly + formData.otherIncomeYearly;
    
    // Calculate taxable income
    const taxableIncome = Math.max(0, totalIncome - bands.personalAllowance);
    
    // Apply tax bands
    let tax = 0;
    if (taxableIncome > 0) {
        if (taxableIncome <= bands.basicRateLimit) {
            tax = taxableIncome * bands.basicRate;
        } else {
            tax = (bands.basicRateLimit * bands.basicRate) + 
                  ((taxableIncome - bands.basicRateLimit) * bands.higherRate);
        }
    }
    
    // Display results
    document.getElementById('annualTax').textContent = 
        `Yearly income tax: £${tax.toFixed(2)}`;
    document.getElementById('monthlySetAside').textContent = 
        `Suggested monthly amount to set aside: £${(tax / 12).toFixed(2)}`;
    
    // Show results section AND smoothly scroll to it
    const resultsSection = document.getElementById('results');
    resultsSection.style.display = 'block';
    
    // Smooth scroll to results with nice offset
    resultsSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
    });
    
    // Optional: Add a little padding above for better visual
    window.scrollBy(0, -80);


        
        // Display results
        document.getElementById('annualTax').textContent = 
            `Yearly income tax: £${tax.toFixed(2)}`;
        document.getElementById('monthlySetAside').textContent = 
            `Suggested monthly amount to set aside: £${(tax / 12).toFixed(2)}`;
        
        // Show results section
        document.getElementById('results').style.display = 'block';
    
  }

    // Initialize when DOM is ready
    function init() {
        const form = document.getElementById('pension-form');
        const calculateBtn = document.getElementById('calculateBtn');
        
        // Form submit handler
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            calculateTax();
        });
        
        // Button click handler (backup)
        calculateBtn.addEventListener('click', function(e) {
            e.preventDefault();
            calculateTax();
        });
        
        // Hide results initially
        document.getElementById('results').style.display = 'none';
    }

    // Start when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
