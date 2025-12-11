# KDP Calculator for WordPress

A comprehensive Amazon Kindle Direct Publishing calculator that authors can use to estimate their book earnings, printing costs, and optimal pricing strategies.

## Features

- **Real-time calculations** for KDP royalties and profits
- **Support for both paperback and hardcover** formats
- **Multiple book dimensions** including custom sizes
- **Paper type selection** (white, cream)
- **Ink type selection** (black & white, color)
- **Pricing suggestions** based on different profit margins
- **Monthly/annual profit projections**
- **Input validation and warnings**
- **Responsive design** for mobile and desktop
- **WordPress-friendly** - easy to integrate

## Files Included

1. `kdp-calculator.html` - Main calculator page
2. `kdp-calculator.js` - JavaScript functionality
3. `wordPress-integration.html` - WordPress-ready version
4. `README.md` - This documentation

## WordPress Integration Instructions

### Method 1: Custom Page Template

1. Copy the contents of `wordPress-integration.html`
2. Create a new page in WordPress
3. Switch to "Text" or "Code" editor mode
4. Paste the HTML content
5. Add the JavaScript to your theme's `functions.php`:

```php
function enqueue_kdp_calculator_scripts() {
    if (is_page('kdp-calculator')) {
        wp_enqueue_script('kdp-calculator', get_template_directory_uri() . '/js/kdp-calculator.js', array(), '1.0.0', true);
    }
}
add_action('wp_enqueue_scripts', 'enqueue_kdp_calculator_scripts');
```

### Method 2: Custom HTML Block

1. Create a new page in WordPress
2. Add a "Custom HTML" block
3. Copy and paste the HTML content from `wordPress-integration.html`
4. The calculator will work immediately

### Method 3: Plugin Integration

1. Create a folder named `kdp-calculator` in your `/wp-content/plugins/` directory
2. Create `kdp-calculator.php` with plugin header:

```php
<?php
/*
Plugin Name: KDP Calculator
Description: Amazon KDP Earnings Calculator
Version: 1.0
Author: Your Name
*/

function kdp_calculator_shortcode() {
    ob_start();
    include(plugin_dir_path(__FILE__) . 'calculator-content.html');
    return ob_get_clean();
}
add_shortcode('kdp_calculator', 'kdp_calculator_shortcode');
```

3. Create `calculator-content.html` with the calculator HTML
4. Add the JavaScript to the plugin folder
5. Activate the plugin and use shortcode `[kdp_calculator]` on any page

## Customization

### Colors and Styling

The calculator uses CSS custom properties that can be easily customized:

```css
:root {
    --primary-color: #ff9900;      /* Amazon orange */
    --secondary-color: #232f3e;    /* Amazon dark blue */
    --accent-color: #e3f2fd;       /* Light blue for suggestions */
    --warning-color: #fff3cd;      /* Warning background */
}
```

### KDP Rate Updates

To update KDP printing rates, modify the `dimensionCosts` object in `kdp-calculator.js`:

```javascript
this.dimensionCosts = {
    '6x9': { base: 0.012, pages: 444 },  // Update base cost here
    // ... other dimensions
};
```

## Browser Compatibility

- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Technical Details

### KDP Calculation Formulas

**Print Cost Calculation:**
- Base cost per dimension
- Paper type surcharge
- Ink type surcharge
- Per-page cost (varies by ink type)
- Hardcover premium

**Royalty Calculation:**
- Net Revenue = Sale Price - (Sale Price × 15% Amazon Commission)
- Profit = Net Revenue - Print Cost

**Pricing Suggestions:**
- Suggest prices at 20%, 30%, 40%, and 50% profit margins
- Ensure suggested prices meet KDP minimum requirements

### Performance Optimizations

- Debounced input calculations (500ms delay)
- Efficient DOM manipulation
- Minimal external dependencies
- Responsive images and layouts

## Support

For issues or feature requests, please contact the developer or submit through your WordPress support channels.

## License

This KDP Calculator is provided as-is for educational and commercial use. Amazon KDP rates may change, so please verify current rates regularly.

---

**Note:** This calculator provides estimates based on publicly available KDP information. Actual costs and royalties may vary. Always verify current Amazon KDP rates and terms.