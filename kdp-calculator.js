// KDP Calculator JavaScript
// Amazon Kindle Direct Publishing Calculator

class KDPCalculator {
    constructor() {
        this.dimensionCosts = {
            '6x9': { base: 0.012, pages: 444 },
            '5.5x8.5': { base: 0.010, pages: 444 },
            '5x8': { base: 0.009, pages: 444 },
            '5.25x8': { base: 0.0095, pages: 444 },
            '6.14x9.21': { base: 0.013, pages: 444 },
            '7x10': { base: 0.018, pages: 444 },
            '8.5x11': { base: 0.025, pages: 444 }
        };
        
        this.paperTypes = {
            'white': 0,
            'cream': 0.002
        };
        
        this.inkTypes = {
            'black': 0,
            'color': 0.012
        };
        
        this.amazonCommission = 0.15;
        this.minimumPrice = 5.99; // KDP minimum price
    }

    calculatePrintCost() {
        const format = document.querySelector('input[name="format"]:checked').value;
        const pageCount = parseInt(document.getElementById('pageCount').value) || 0;
        const paperType = document.getElementById('paperType').value;
        const inkType = document.getElementById('inkType').value;
        
        let dimension = document.getElementById('dimensions').value;
        let width, height;
        
        if (dimension === 'custom') {
            width = parseFloat(document.getElementById('customWidth').value) || 6;
            height = parseFloat(document.getElementById('customHeight').value) || 9;
        } else {
            const dims = dimension.split('x');
            width = parseFloat(dims[0]);
            height = parseFloat(dims[1]);
        }
        
        // Find closest dimension cost
        let closestDim = this.findClosestDimension(width, height);
        let costData = this.dimensionCosts[closestDim];
        
        // Calculate print cost
        let printCost = costData.base;
        
        // Add paper type cost
        printCost += this.paperTypes[paperType];
        
        // Add ink type cost
        printCost += this.inkTypes[inkType];
        
        // Add page cost (per page)
        let pageCost = 0.002;
        if (inkType === 'color') {
            pageCost = 0.015;
        }
        
        printCost += (pageCount * pageCost);
        
        // Calculate final cost
        let finalCost = printCost;
        
        // Apply format multiplier
        if (format === 'hardcover') {
            finalCost += 2.50; // Hardcover premium
        }
        
        return Math.max(finalCost, 2.55); // Minimum KDP charge
    }

    findClosestDimension(width, height) {
        let closest = '6x9';
        let closestDistance = Infinity;
        
        for (let dim in this.dimensionCosts) {
            const [w, h] = dim.split('x').map(d => parseFloat(d));
            const distance = Math.abs(width - w) + Math.abs(height - h);
            if (distance < closestDistance) {
                closestDistance = distance;
                closest = dim;
            }
        }
        
        return closest;
    }

    calculateRoyalties() {
        const salePrice = parseFloat(document.getElementById('salePrice').value) || 0;
        const printCost = this.calculatePrintCost();
        
        // Amazon commission calculation
        const amazonCommission = salePrice * this.amazonCommission;
        
        // Net revenue (what Amazon gives you before print costs)
        const netRevenue = salePrice - amazonCommission;
        
        // Profit per book
        const profitPerBook = netRevenue - printCost;
        
        return {
            printCost,
            amazonCommission,
            netRevenue,
            profitPerBook
        };
    }

    generatePricingSuggestions() {
        const printCost = this.calculatePrintCost();
        const suggestions = [];
        
        // Different profit margin strategies
        const margins = [0.20, 0.30, 0.40, 0.50]; // 20%, 30%, 40%, 50%
        
        margins.forEach(margin => {
            const suggestedPrice = (printCost + (printCost * margin)) / (1 - this.amazonCommission);
            
            if (suggestedPrice >= this.minimumPrice) {
                const netRevenue = suggestedPrice - (suggestedPrice * this.amazonCommission);
                const profitPerBook = netRevenue - printCost;
                
                suggestions.push({
                    price: suggestedPrice,
                    profit: profitPerBook,
                    margin: margin * 100
                });
            }
        });
        
        return suggestions.slice(0, 3); // Return top 3 suggestions
    }

    validateInputs() {
        const warnings = [];
        const pageCount = parseInt(document.getElementById('pageCount').value) || 0;
        const salePrice = parseFloat(document.getElementById('salePrice').value) || 0;
        const printCost = this.calculatePrintCost();
        
        // Check page count limits
        if (pageCount < 1) {
            warnings.push('Page count must be at least 1 page.');
        }
        if (pageCount > 828) {
            warnings.push('Maximum page count for KDP is 828 pages.');
        }
        
        // Check pricing
        if (salePrice < this.minimumPrice) {
            warnings.push(`Minimum sale price is $${this.minimumPrice}.`);
        }
        
        if (salePrice <= printCost) {
            warnings.push('Sale price is too low and will result in a loss per book.');
        }
        
        // Check for very low profit
        const royalties = this.calculateRoyalties();
        if (royalties.profitPerBook < 1 && salePrice > printCost) {
            warnings.push('Profit per book is very low. Consider increasing the sale price.');
        }
        
        return warnings;
    }
}

// Initialize calculator
const kdpCalc = new KDPCalculator();

// Main calculation function
function calculateKDP() {
    try {
        const royalties = kdpCalc.calculateRoyalties();
        const monthlySales = parseInt(document.getElementById('monthlySales').value) || 0;
        
        // Update results display
        document.getElementById('printCost').textContent = `$${royalties.printCost.toFixed(2)}`;
        document.getElementById('amazonCommission').textContent = `$${royalties.amazonCommission.toFixed(2)}`;
        document.getElementById('netRevenue').textContent = `$${royalties.netRevenue.toFixed(2)}`;
        document.getElementById('profitPerBook').textContent = `$${royalties.profitPerBook.toFixed(2)}`;
        document.getElementById('monthlyProfit').textContent = `$${(royalties.profitPerBook * monthlySales).toFixed(2)}`;
        document.getElementById('annualProfit').textContent = `$${(royalties.profitPerBook * monthlySales * 12).toFixed(2)}`;
        
        // Update warnings
        updateWarnings();
        
        // Update pricing suggestions
        updatePricingSuggestions();
        
    } catch (error) {
        console.error('Calculation error:', error);
        alert('Error calculating KDP values. Please check your inputs.');
    }
}

function updateWarnings() {
    const warnings = kdpCalc.validateInputs();
    const warningsDiv = document.getElementById('warnings');
    
    if (warnings.length > 0) {
        let warningHTML = '<div class="warnings"><h4>⚠️ Considerations:</h4>';
        warnings.forEach(warning => {
            warningHTML += `<div class="warning-item">• ${warning}</div>`;
        });
        warningHTML += '</div>';
        warningsDiv.innerHTML = warningHTML;
    } else {
        warningsDiv.innerHTML = '';
    }
}

function updatePricingSuggestions() {
    const suggestions = kdpCalc.generatePricingSuggestions();
    const suggestionsDiv = document.getElementById('pricingSuggestions');
    
    let suggestionsHTML = '';
    suggestions.forEach(suggestion => {
        suggestionsHTML += `
            <div class="suggestion-card">
                <div class="suggestion-price">$${suggestion.price.toFixed(2)}</div>
                <div class="suggestion-profit">Profit: $${suggestion.profit.toFixed(2)}</div>
                <div class="suggestion-margin">${suggestion.margin}% margin</div>
            </div>
        `;
    });
    
    if (suggestionsHTML) {
        suggestionsDiv.innerHTML = suggestionsHTML;
    } else {
        suggestionsDiv.innerHTML = '<p>Unable to generate pricing suggestions. Check your book specifications.</p>';
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Calculate button
    const calculateBtn = document.querySelector('.calculate-btn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateKDP);
    }
    
    // Format change handler
    document.querySelectorAll('input[name="format"]').forEach(radio => {
        radio.addEventListener('change', function() {
            updateFormForFormat(this.value);
        });
    });
    
    // Dimension change handler
    const dimensionsSelect = document.getElementById('dimensions');
    if (dimensionsSelect) {
        dimensionsSelect.addEventListener('change', function() {
            const customDiv = document.getElementById('customDimensions');
            if (this.value === 'custom') {
                customDiv.style.display = 'block';
            } else {
                customDiv.style.display = 'none';
            }
        });
    });
    
    // Auto-calculate on input changes (debounced)
    const inputs = document.querySelectorAll('input, select');
    let calculationTimeout;
    
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            clearTimeout(calculationTimeout);
            calculationTimeout = setTimeout(calculateKDP, 500);
        });
        
        input.addEventListener('change', calculateKDP);
    });
    
    // Initial calculation
    calculateKDP();
});

function updateFormForFormat(format) {
    const paperTypeSelect = document.getElementById('paperType');
    const inkTypeSelect = document.getElementById('inkType');
    
    if (format === 'hardcover') {
        // Hardcover typically uses better paper
        paperTypeSelect.value = 'white';
        paperTypeSelect.disabled = true;
        
        // Hardcover is usually color for images
        if (inkTypeSelect.value === 'black') {
            inkTypeSelect.value = 'color';
        }
    } else {
        paperTypeSelect.disabled = false;
        inkTypeSelect.disabled = false;
    }
}

// Real-time currency formatting
function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(value);
}

// Export functions for external use
window.KDPCalculator = KDPCalculator;
window.calculateKDP = calculateKDP;