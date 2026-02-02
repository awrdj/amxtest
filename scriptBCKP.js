document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements
    const searchForm = document.getElementById('searchForm');
    const copyUrlBtn = document.getElementById('copyUrlBtn');
    const resultUrlContainer = document.getElementById('resultUrlContainer');
    const generatedUrlEl = document.getElementById('generatedUrl');
    const visitUrlBtn = document.getElementById('visitUrlBtn');
    const marketplaceSelect = document.getElementById('marketplaceSelect');
    const copyZipBtn = document.querySelector('.copy_area');
    const copyMessage = document.querySelector('.copied-message');
    const productTypeSelect = document.getElementById('productTypeSelect');
    const departmentSelect = document.getElementById('department');
    const categorySelect = document.getElementById('category');
    const customHiddenInput = document.getElementById('customHiddenKeywords');
    const basicTeesCheckbox = document.getElementById('filterBasicTees');
    const cottonCheckbox = document.getElementById('filterCotton');
    const hiddenKeywordsContainer = document.getElementById('hiddenKeywordsContainer');
    const filterBasicTeesContainer = document.getElementById('filterBasicTeesContainer');
    const filterCottonContainer = document.getElementById('filterCottonContainer');
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');

    // Clear Search Button
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    if (searchInput.value.length > 0) {
        clearSearchBtn.style.display = 'block';
    }

    // Product type availability for each marketplace
    const productTypeAvailability = {
        'com': [
            'tshirt', 'premtshirt', 'tanktop', 'longsleeve', 'raglan', 'sweatshirt', 
            'hoodie', 'ziphoodie', 'popsocket', 'case', 'totebag', 'throwpillow', 
            'tumbler', 'coffeemug', 'KDP', 'custom'
        ],
        'co.uk': [
            'tshirt', 'tanktop', 'longsleeve', 'raglan', 'sweatshirt', 
            'hoodie', 'ziphoodie', 'popsocket', 'case', 'KDP', 'custom'
        ],
        'de': [
            'tshirt', 'tanktop', 'longsleeve', 'raglan', 'sweatshirt', 
            'hoodie', 'ziphoodie', 'popsocket', 'case', 'KDP', 'custom'
        ],
        'fr': [
            'tshirt', 'tanktop', 'longsleeve', 'raglan', 'sweatshirt', 
            'hoodie', 'ziphoodie', 'popsocket', 'case', 'KDP', 'custom'
        ],
        'it': [
            'tshirt', 'tanktop', 'longsleeve', 'raglan', 'sweatshirt', 
            'hoodie', 'ziphoodie', 'popsocket', 'case', 'KDP', 'custom'
        ],
        'es': [
            'tshirt', 'tanktop', 'longsleeve', 'raglan', 'sweatshirt', 
            'hoodie', 'ziphoodie', 'popsocket', 'case', 'KDP', 'custom'
        ]
        /*'co.jp': [
            'tshirt', 'longsleeve', 'sweatshirt', 'hoodie', 'ziphoodie', 'case', 'KDP', 'custom'
        ]*/
    };

    // Product type display names
    const productTypeDisplayNames = {
        'tshirt': 'Standard t-shirt',
        'premtshirt': 'Premium t-shirt',
        'tanktop': 'Tank top',
        'longsleeve': 'Long sleeve t-shirt',
        'raglan': 'Raglan',
        'sweatshirt': 'Sweatshirt',
        'hoodie': 'Pullover hoodie',
        'ziphoodie': 'Zip hoodie',
        'popsocket': 'PopSockets',
        'case': 'Phone case',
        'totebag': 'Tote bag',
        'throwpillow': 'Throw pillows',
        'tumbler': 'Tumbler',
        'coffeemug': 'Coffee Mug',
        'KDP': 'KDP',
        'custom': 'None'
    };

    // Function to populate product types based on marketplace
    function populateProductTypes() {
        const marketplace = marketplaceSelect.value;
        const availableTypes = productTypeAvailability[marketplace] || productTypeAvailability.com;
        // Store current selection if any
        const currentValue = productTypeSelect.value;
        // Clear existing options
        productTypeSelect.innerHTML = '';
        // Add available options
        availableTypes.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = productTypeDisplayNames[type] || type;
            productTypeSelect.appendChild(option);
        });
        // Try to restore previous selection if it exists in new options
        if (availableTypes.includes(currentValue)) {
            productTypeSelect.value = currentValue;
        } else {
            // Default to first option
            productTypeSelect.value = availableTypes[0];
            // Update any dependent selections
            updateProductTypeSettings();
            updateDepartmentFromProductType();
        }
    }

    // Function to populate departments
    function populateDepartments() {
        const marketplace = marketplaceSelect.value;
        const config = marketplaceConfig[marketplace] || marketplaceConfig.com;
        departmentSelect.innerHTML = '';
        
        if (config.categories) {
            Object.keys(config.categories).forEach(deptKey => {
                const option = document.createElement('option');
                option.value = deptKey;
                option.textContent = config.categories[deptKey].displayName || deptKey;
                departmentSelect.appendChild(option);
            });
        }
        updateCategoryOptions();
    }

    // ZIP codes for each marketplaces
    const zipCodes = {
        'com': { zip: '90210', location: 'Beverly Hills, CA' },
        'co.uk': { zip: 'E1 6AN', location: 'London' },
        'de': { zip: '10115', location: 'Berlin' },
        'fr': { zip: '75001', location: 'Paris' },
        'it': { zip: '00100', location: 'Rome' },
        'es': { zip: '28001', location: 'Madrid' }
        // 'co.jp': { zip: '100-0001', location: 'Tokyo' }
    };

    // Presets Config
    const presetConfigs = {
/* Possible parameters for the settings object:
productType: (String) Sets the Product Type dropdown (e.g., 'tshirt', 'hoodie', 'custom').
department: (String) Sets the Department dropdown (e.g., 'fashion', 'fashion-novelty', 'stripbooks').
category: (String) Sets the Category dropdown after the department is set (e.g., '7141123011'). Make sure the category ID is valid for the specified department.
sortOrder: (String) Sets the Sort Order dropdown (e.g., 'date-desc-rank', 'most-purchased-rank', 'custom').
timeFilter: (String) Specifies which time filter radio button to check by its ID (e.g., 'timeFilter30Days', 'timeFilter90Days'). If omitted, defaults to 'timeFilterNone'.
reviewsFilter: (Boolean) Set to true to check the "Reviews 4+" checkbox, false or omit to leave it unchecked.
excludeBrands: (Boolean) Set to true to check the "Exclude Major Brands" checkbox, false or omit to leave it unchecked.
minPrice: (String or Number) Sets the minimum price input value.
maxPrice: (String or Number) Sets the maximum price input value.
searchKeywords: (String) - New - Sets the main search input value.
customHiddenKeywords: (String) - New - Sets the custom hidden keywords input value.
productTypeOverrides: (Object) - New - Contains nested objects where keys are product type strings (e.g., 'hoodie') and values are objects that can contain searchKeywords and/or customHiddenKeywords to override the base settings for that specific product type.*/
        // Presets config US
        'com': [
            { value: 'last30-fashion-com', text: '⏱ Last 30 Days Fashion', 
              settings: { timeFilter: 'timeFilter30Days', sortOrder: 'custom', department: 'fashion', category: '7141123011', productType: 'custom', suppressDefaultProductTypeKeywords: false} },
            { value: 'last90-fashion-com', text: '⏱ Last 90 Days Fashion', 
              settings: { timeFilter: 'timeFilter90Days', sortOrder: 'custom', department: 'fashion', category: '7141123011', productType: 'custom', suppressDefaultProductTypeKeywords: false} },
            { value: 'most-purchased-com', text: '⭐️ Most Purchased Fashion', 
              settings: { sortOrder: 'most-purchased-rank', department: 'fashion', productType: 'custom', suppressDefaultProductTypeKeywords: false} },
            { value: 'most-purchased-com-men-novelty', text: '⭐️ Most Purchased Fashion Mens Novelty T-Shirts', 
              settings: { sortOrder: 'most-purchased-rank', department: 'fashion', category: '9056985011', productType: 'custom', suppressDefaultProductTypeKeywords: false} },
            { value: 'most-purchased-com-men-novelty', text: '⭐️ Most Purchased Fashion Novelty & More', 
              settings: { sortOrder: 'most-purchased-rank', department: 'fashion-novelty', category: '9056985011', productType: 'custom', suppressDefaultProductTypeKeywords: false} },
            /*{ value: 'the-trends-com', text: 'Trends Fashion Novelty', 
              settings: { sortOrder: 'date-desc-rank', department: 'fashion-novelty', productType: 'custom', suppressDefaultProductTypeKeywords: false} },*/
            { value: 'archive-view-com', text: '📈 Trends/Archive Fashion Novelty', 
              settings: { sortOrder: 'date-desc-rank', department: 'fashion-novelty', productType: 'custom', suppressDefaultProductTypeKeywords: false} },
            { value: 'competition-checker-com', text: '📊 Competition Checker',
              settings: {
                // Base Settings
                sortOrder: 'custom', /*department: 'fashion-novelty',*/ productType: 'tshirt', /*searchKeywords: 'funny graphic',*/ customHiddenKeywords: 'Lightweight, Classic fit, Double-needle sleeve and bottom hem -Longsleeve -Raglan -Vneck -Tanktop', suppressDefaultProductTypeKeywords: true,
                // Product type overrides
                productTypeOverrides: {
                    'premtshirt': { customHiddenKeywords: 'Fit: Men’s fit runs small, size up for a looser fit. Women’s fit is true to size, order usual size. is made of lightweight fine jersey fabric -Longsleeve -Raglan -Vneck -Tanktop' },
                    'tanktop': { customHiddenKeywords: '"tanktop" Lightweight, Classic fit, Double-needle sleeve and bottom hem -Longsleeve -Raglan -Vneck' },
                    'longsleeve': { customHiddenKeywords: '"Longsleeve" unisex-adult Lightweight, Classic fit, Double-needle sleeve and bottom hem -Raglan -Vneck -sweatshirt -tanktop' },
                    'raglan': { customHiddenKeywords: '"raglan" Lightweight, Classic fit, Double-needle sleeve and bottom hem -Vneck -Tanktop' },
                    'sweatshirt': { customHiddenKeywords: '"sweatshirt" 8.5 oz, Classic fit, Twill-taped neck -Raglan -Vneck -Tanktop -hoodie' },
                    'hoodie': { customHiddenKeywords: '"pullover hoodie" 8.5 oz, Classic fit, Twill-taped neck -Raglan -Vneck -Tanktop -zip' },
                    'ziphoodie': { customHiddenKeywords: '"zip hoodie" 8.5 oz, Classic fit, Twill-taped neck -Raglan -Vneck -Tanktop' },
                    'popsocket': { customHiddenKeywords: '"Popsocket" Printed top is swappable with other compatible PopGrip models. Just press flat, turn 90 degrees until you hear a click and remove to swap.' },
                    'case': { customHiddenKeywords: '"case" "Two-part protective case made from a premium scratch-resistant polycarbonate shell and shock absorbent TPU liner protects against drops"' },
                    'totebag': { customHiddenKeywords: '"Tote Bag" Made of a lightweight, spun polyester canvas-like fabric. All seams and stress points are double-stitched for durability, and the reinforced bottom flattens to fit more items and hold larger objects.' },
                    'throwpillow': { customHiddenKeywords: '"Throw Pillow" Filled with 100% polyester and sewn closed' },
                    'tumbler': { customHiddenKeywords: '"Tumbler" "Merch on Demand"' },
                    'coffeemug': { customHiddenKeywords: '"Ceramic Mug" "Merch on Demand"' },
                    'KDP': { customHiddenKeywords: '"independently published"' }
                }
              }
            }
        ],
        // Presets config UK
        'co.uk': [
            { value: 'last30-fashion-uk', text: 'Last 30 Days Fashion - UK', 
              settings: { timeFilter: 'timeFilter30Days', sortOrder: 'custom', department: 'fashion', productType: 'custom', suppressDefaultProductTypeKeywords: false} },
            { value: 'last90-fashion-uk', text: 'Last 90 Days Fashion - UK', 
              settings: { timeFilter: 'timeFilter90Days', sortOrder: 'custom', department: 'fashion', productType: 'custom', suppressDefaultProductTypeKeywords: false} },
            { value: 'most-purchased-uk', text: 'Most Purchased Fashion Novelty - UK', 
              settings: { sortOrder: 'most-purchased-rank', department: 'fashion', category: '1731104031', productType: 'custom', suppressDefaultProductTypeKeywords: false} },
            { value: 'the-trends-uk', text: 'Trends Fashion - UK', 
              settings: { sortOrder: 'date-desc-rank', department: 'fashion', productType: 'custom', suppressDefaultProductTypeKeywords: false} },
            { value: 'archive-view-uk', text: 'Archive Fashion - UK', 
              settings: { sortOrder: 'date-desc-rank', department: 'fashion', productType: 'tshirt', suppressDefaultProductTypeKeywords: false} },
            { value: 'competition-view-uk', text: 'T-Shirt Competition Checker - UK', 
              settings: { sortOrder: 'custom', department: 'fashion', productType: 'tshirt', suppressDefaultProductTypeKeywords: false} }
        ],
        // Presets config DE
        'de': [
            { value: 'last30-fashion-de', text: 'Last 30 Days Fashion - DE', 
              settings: { timeFilter: 'timeFilter30Days', sortOrder: 'custom', department: 'fashion', productType: 'custom', suppressDefaultProductTypeKeywords: false} },
            { value: 'last90-fashion-de', text: 'Last 90 Days Fashion- DE', 
              settings: { timeFilter: 'timeFilter90Days', sortOrder: 'custom', department: 'fashion', productType: 'custom', suppressDefaultProductTypeKeywords: false} },
            { value: 'most-purchased-de', text: 'Most Purchased Fashion - DE', 
              settings: { sortOrder: 'most-purchased-rank', department: 'fashion', productType: 'custom', suppressDefaultProductTypeKeywords: false} },
            { value: 'the-trends-de', text: 'Trends Fashion - DE', 
              settings: { sortOrder: 'date-desc-rank', department: 'fashion', productType: 'tshirt', suppressDefaultProductTypeKeywords: false} },
            { value: 'archive-view-de', text: 'Archive Fashio - DEn', 
              settings: { sortOrder: 'date-desc-rank', department: 'fashion', productType: 'tshirt', suppressDefaultProductTypeKeywords: false} },
            { value: 'competition-view-de', text: 'T-Shirt Competition Checker - DE', 
              settings: { sortOrder: 'custom', department: 'fashion', productType: 'custom', suppressDefaultProductTypeKeywords: false} }
        ],
        // Presets config FR
        'fr': [
            { value: 'last30-fashion-fr', text: 'Last 30 Days Fashion Fantaisie - FR', 
              settings: { timeFilter: 'timeFilter30Days', sortOrder: 'custom', department: 'fashion', category: '465090031', productType: 'custom', suppressDefaultProductTypeKeywords: false} },
            { value: 'last90-fashion-fr', text: 'Last 90 Days Fashion Fantaisie - FR', 
              settings: { timeFilter: 'timeFilter90Days', sortOrder: 'custom', department: 'fashion', category: '465090031', productType: 'custom', suppressDefaultProductTypeKeywords: false} },
            { value: 'most-purchased-fr', text: 'Most Purchased Fashion Fantaisie - FR', 
              settings: { sortOrder: 'most-purchased-rank', department: 'fashion', category: '465090031', productType: 'custom', suppressDefaultProductTypeKeywords: false} },
            { value: 'the-trends-fr', text: 'Trends Fashion - FR', 
              settings: { sortOrder: 'date-desc-rank', department: 'fashion', productType: 'tshirt', suppressDefaultProductTypeKeywords: false} },
            { value: 'archive-view-fr', text: 'Archive Fashion - FR', 
              settings: { sortOrder: 'date-desc-rank', department: 'fashion', productType: 'tshirt', suppressDefaultProductTypeKeywords: false} },
            { value: 'competition-view-fr', text: 'T-Shirt Competition Checker - FR', 
              settings: { sortOrder: 'custom', department: 'fashion', category: '465090031', productType: 'tshirt', suppressDefaultProductTypeKeywords: false} }
        ],
        // Presets config IT
        'it': [
            { value: 'last30-fashion-fr', text: 'Last 30 Days Fashion Specific Clothing - IT', 
              settings: { timeFilter: 'timeFilter30Days', sortOrder: 'custom', department: 'fashion', category: '2892860031', productType: 'custom', suppressDefaultProductTypeKeywords: false} },
            { value: 'last90-fashion-fr', text: 'Last 90 Days Fashion Specific Clothing - IT', 
              settings: { timeFilter: 'timeFilter90Days', sortOrder: 'custom', department: 'fashion', category: '2892860031', productType: 'custom', suppressDefaultProductTypeKeywords: false} },
            { value: 'most-purchased-fr', text: 'Most Purchased Fashion - IT', 
              settings: { sortOrder: 'most-purchased-rank', department: 'fashion', productType: 'custom', suppressDefaultProductTypeKeywords: false} },
            { value: 'the-trends-fr', text: 'Trends Fashion - IT', 
              settings: { sortOrder: 'date-desc-rank', department: 'fashion', productType: 'tshirt', suppressDefaultProductTypeKeywords: false} },
            { value: 'archive-view-fr', text: 'Archive Fashion - IT', 
              settings: { sortOrder: 'date-desc-rank', department: 'fashion', productType: 'tshirt', suppressDefaultProductTypeKeywords: false} },
            { value: 'competition-view-fr', text: 'T-Shirt Competition Checker - IT', 
              settings: { sortOrder: 'custom', department: 'fashion', category: '2892860031', productType: 'tshirt', suppressDefaultProductTypeKeywords: false} }
        ],
        // Presets config ES
        'es': [
            { value: 'last30-fashion-es', text: 'Last 30 Days Fashion Specialized Clothing - ES', 
              settings: { timeFilter: 'timeFilter30Days', sortOrder: 'custom', department: 'fashion', category: '3074031031', productType: 'custom', suppressDefaultProductTypeKeywords: false} },
            { value: 'last90-fashion-es', text: 'Last 90 Days Fashion Specialized Clothing - ES', 
              settings: { timeFilter: 'timeFilter90Days', sortOrder: 'custom', department: 'fashion', category: '3074031031', productType: 'custom', suppressDefaultProductTypeKeywords: false} },
            { value: 'most-purchased-es', text: 'Most Purchased Fashion Specialized Clothing - ES', 
              settings: { sortOrder: 'most-purchased-rank', department: 'fashion', category: '3074031031', productType: 'custom', suppressDefaultProductTypeKeywords: false} },
            { value: 'the-trends-es', text: 'Trends Fashion - ES', 
              settings: { sortOrder: 'date-desc-rank', department: 'fashion', productType: 'tshirt', suppressDefaultProductTypeKeywords: false} },
            { value: 'archive-view-es', text: 'Archive Fashion - ES', 
              settings: { sortOrder: 'date-desc-rank', department: 'fashion', productType: 'tshirt', suppressDefaultProductTypeKeywords: false} },
            { value: 'competition-view-es', text: 'T-Shirt Competition Checker - ES', 
              settings: { sortOrder: 'custom', department: 'custom', productType: 'custom', suppressDefaultProductTypeKeywords: false} }
        ]
        /*'co.jp': [
            { value: 'last90-review-jp', text: 'JP - Last 90 Days Review', 
              settings: { timeFilter: 'timeFilter90Days', sortOrder: 'review-rank', reviewsFilter: true } },
            { value: 'popular-basic-jp', text: 'JP - 人気順', 
              settings: { sortOrder: 'popularity-rank', excludeBrands: true } }
        ]*/
    };
    
    // Update the presets dropdown based on marketplace
    function updatePresetsDropdown() {
        const marketplace = marketplaceSelect.value;
        const presetsSelect = document.getElementById('presetsSelect');
        // Clear existing options
        presetsSelect.innerHTML = '<option value="">No Preset</option>';
        // Add marketplace-specific presets
        const presets = presetConfigs[marketplace] || presetConfigs.com;
        presets.forEach(preset => {
            const option = document.createElement('option');
            option.value = preset.value;
            option.textContent = preset.text;
            presetsSelect.appendChild(option);
        });
    }

    // Initialize the filterExcludeBrands value when the marketplace changes
    function updateExcludeBrandsFilter() {
      const marketplace = marketplaceSelect.value;
      const config = marketplaceConfig[marketplace] || marketplaceConfig.com;
      
      // Update hidden fields based on marketplace
      if (config.excludeBrands) {
        // We don't set the value here, just use it from the config in generateAmazonUrl
        document.getElementById('filterExcludeBrands').checked = false;
      }
    }

    // Marketplace-specific parameters
    const marketplaceConfig = {
            'com': { // USA
                timeFilters: {
                    '30days': 'p_n_date_first_available_absolute%3A15196852011',
                    '90days': 'p_n_date_first_available_absolute%3A15196853011'
                },
                sellerFilter: 'p_6%3AATVPDKIKX0DER',
                reviewsFilter: 'p_72%3A2661618011',
                // Product type keywords specific to USA
                productTypeKeywords: {
                    'tshirt': 'Lightweight%2C+Classic+fit%2C+Double-needle+sleeve+and+bottom+hem+-Longsleeve+-Raglan+-Vneck+-Tanktop',
                    'premtshirt': 'Fit%3A+Men’s+fit+runs+small%2C+size+up+for+a+looser+fit.+Women’s+fit+is+true+to+size%2C+order+usual+size.+is+made+of+lightweight+fine+jersey+fabric+-Longsleeve+-Raglan+-Vneck+-Tanktop',
                    'tanktop': '"tanktop"+Lightweight%2C+Classic+fit%2C+Double-needle+sleeve+and+bottom+hem+-Longsleeve+-Raglan+-Vneck',
                    'longsleeve': '"Long+sleeve"+unisex-adult+Classic+fit%2C+Double-needle+sleeve+and+bottom+hem+-Raglan+-Vneck+-sweatshirt+-tanktop',
                    'raglan': '"raglan"+Lightweight%2C+Classic+fit%2C+Double-needle+sleeve+and+bottom+hem+-Vneck+-Tanktop',
                    'sweatshirt': '"sweatshirt"+8.5+oz%2C+Classic+fit%2C+Twill-taped+neck+-Raglan+-Vneck+-Tanktop+-hoodie',
                    'hoodie': '"pullover+hoodie"+8.5+oz%2C+Classic+fit%2C+Twill-taped+neck+-Raglan+-Vneck+-Tanktop+-zip',
                    'ziphoodie': '"zip+hoodie"+8.5+oz%2C+Classic+fit%2C+Twill-taped+neck+-Raglan+-Vneck+-Tanktop',
                    'popsocket': '"Popsocket"+Printed+top+is+swappable+with+other+compatible+PopGrip+models.+Just+press+flat%2C+turn+90+degrees+until+you+hear+a+click+and+remove+to+swap.',
                    'case': '"case"+"Two-part+protective+case+made+from+a+premium+scratch-resistant+polycarbonate+shell+and+shock+absorbent+TPU+liner+protects+against+drops"',
                    'totebag': '"Tote+Bag"+Made+of+a+lightweight%2C+spun+polyester+canvas-like+fabric.+All+seams+and+stress+points+are+double-stitched+for+durability%2C+and+the+reinforced+bottom+flattens+to+fit+more+items+and+hold+larger+objects.',
                    'throwpillow': '"Throw+Pillow"+Filled+with+100%25+polyester+and+sewn+closed',
                    'tumbler': '"Tumbler"+"Merch+on+Demand"',
                    'coffeemug': '"Ceramic Mug"+"Merch+on+Demand"',
                    'KDP': '"independently+published"'
                },
                // Sort orders for USA
                sortOrders: [{
                        value: 'featured',
                        text: 'Featured'
                    },
                    {
                        value: 'date-desc-rank',
                        text: 'Newest Arrivals'
                    },
                    {
                        value: 'most-purchased-rank',
                        text: 'Most Purchased Rank'
                    },
                    {
                        value: 'exact-aware-popularity-rank',
                        text: 'Best Sellers'
                    },
                    {
                        value: 'review-rank',
                        text: 'Top Rated (Avg Review Rank)'
                    },
                    {
                        value: 'review-count-rank',
                        text: 'Most Reviews Count Rank'
                    },
                    {
                        value: 'date-asc-rank',
                        text: 'Oldest First'
                    },
                    {
                        value: 'featured-rank',
                        text: 'Featured (featured-rank)'
                    },
                    {
                        value: 'most-wished-for-rank',
                        text: 'Most Wished For Rank'
                    },
                    // { value: 'price-desc-rank', text: 'High to Low Price' }, { value: 'price-asc-rank', text: 'Low to High Price' }, { value: 'relevancerank', text: 'Relevance Rank' }, { value: 'relevanceblender', text: 'Relevance Blender' }, { value: 'popularity-rank', text: 'Popularity Rank' }, { value: 'sale-rank', text: 'Sale Rank' }, { value: 'discount-rank', text: 'Discount Rank' }, { value: 'daterank', text: 'Date (Oldest) Rank' }, { value: 'daterank', text: 'Date (Oldest) Rank' },
                    {
                        value: 'custom',
                        text: 'NONE'
                    }
                ],
                // Departments and categories for USA
                categories: {
                    'fashion-novelty': {
                        displayName: 'Fashion Novelty & More',
                        categories: [{value: '12035955011', text: 'Clothing'}]
                    },
                    'fashion': {
                        displayName: 'Fashion',
                        categories: [
                            {value: '7141123011', text: 'Fashion'},
                            {value: '7147441011', text: 'Men\'s Clothing'},
                            {value: '7147440011', text: 'Women\'s Clothing'},
                            {value: '9056921011', text: 'Women\'s Novelty Tops & Tees'},
                            {value: '9056985011', text: 'Men\'s Novelty T-Shirts'},
                            {value: '1040666', text: 'Boys\' Clothing'},
                            {value: '1040664', text: 'Girls\' Clothing'}
                        ]
                    },
                    'mobile': {
                        displayName: 'Cell Phones & Accessories',
                        categories: []
                    },
                    'garden': {
                        displayName: 'Home & Kitchen',
                        categories: []
                    },
                    // 'stripbooks-intl-ship' MRB uses this // US
                    'stripbooks': {
                        displayName: 'Books (KDP)',
                        categories: [
                            {value: '3248857011', text: 'Calendars'},
                            {value: '4', text: 'Children\'s Books'},
                            {value: '48', text: 'Crafts, Home & Hobbies'}
                        ]
                    },
                    '': {
                        displayName: 'All (No Department)',
                        categories: []
                    }
                },
                // Brands to exclude for USA
                // excludeBrands: '-Officially+-Licensed+-LyricLyfe+-Disney+-Marvel+-StarWars+-Mademark+-HarryPotter+-Pixar+-SANRIO+-EliteAuthentics+-Barbie+-BATMAN+-JeffDunham+-CJGrips+-BreakingT+-SpongebobSquarePants+-BallparkMVP+-DCComics+-LooneyTunes+-SUPERMARIO+-Pokemon+-STARTREK+-StrangerThings+-Fallout+-MTV+-Beetlejuice+-SouthPark+-HelloKitty+-Jeep+-GypsyQueen+-TheRollingStones+-NEWLINECINEMA+-SagittariusGallery+-ScoobyDoo+-OfficialHighSchoolFanGear+-PinkFloyd+-Nickelodeon+-CareBears+-Popfunk+-FanPrint+-WarnerBros+-WWE+-DrSeuss+-NBC+-CuriousGeorge+-MeanGirls+-CartoonNetwork+-SesameStreet+-Hasbro+-CocaCola+-RickMorty+-Nintendo+-DespicableMe+-JurassicPark+-TMNT+-MyLittlePony+-AmericanKennelClub+-AnnoyingOrange+-BeerNuts+-BillNye+-Booba+-Buckedup+-CarlyMartina+-ComradeDetective+-Daria+-DippinDots+-DramaLlama+-Dunkin+-HannahHart+-IMOMSOHARD+-ImpracticalJokers+-JaneAusten+-JaneGoodall+-JennMcAllister+-JoJoSiwa+-Kabillion+-LoveIsland+-LyricVerse+-ModPodge+-NashGrier+-NeildeGrasseTyson+-RickyDillon+-ROBLOX+-ShibSibs+-SpongeBob+-TheDailyWire+-TheGrandTour+-Oddbods+-TheYoungTurks+-TheSoul+-TwinPeaks+-UglyDolls+-Mandalorian+-SpaceJam+-Aerosmith+-Bengals+-Rebelde+-BreakingBad+-FooFighters+-BlackSabbath+-SelenaQuintanilla+-CampusLab+-RobZombie+-Misfits+-Mattel+-Sheeran+-Zelda+-Dunham+-Masha+-DreamWorks+-UniversalStudios+-Paramount+-20thCenturyStudios+-SonyPictures+-Lionsgate+-HBO+-AMC+-BBC+-Netflix+-Hulu+-PlayStation+-Xbox+-Fortnite+-LeagueofLegends+-Overwatch+-CallofDuty+-Minecraft+-EldenRing+-WorldofWarcraft+-TheSims+-AmongUs+-Tetris+-SEGA+-Atari+-Capcom+-Konami+-TheBeatles+-LedZeppelin+-ACDC+-Metallica+-Nirvana+-TaylorSwift+-BTS+-BLACKPINK+-Drake+-GameofThrones+-SquidGame+-PeakyBlinders+-Lego+-Barney+-ThomasandFriends+-PeppaPig+-Bluey+-FisherPrice+-Tonka+-PowerRangers+-Ford+-Chevrolet+-Toyota+-Honda+-Tesla+-BMW+-MercedesBenz+-HarleyDavidson+-Nike+-Adidas+-Puma+-Gucci+-LouisVuitton+-Chanel+-Balenciaga+-Vans+-Fila+-Pepsi+-MountainDew+-Sprite+-DrPepper+-Nestle+-Oreo+-Reeses+-Snickers+-TacoBell+-McDonalds+-KFC+-Starbucks+-NFL+-NBA+-MLB+-NHL+-NCAA+-FIFA+-UFC+-Google+-Facebook+-Instagram+-Snapchat+-YouTube+-Twitter+-TikTok',
                excludeBrands: '-Officially -Licensed -LyricLyfe -Disney -Marvel -StarWars -Mademark -HarryPotter -Pixar -SANRIO -EliteAuthentics -Barbie -BATMAN -JeffDunham -CJGrips -BreakingT -SpongebobSquarePants -DCComics -Looney -SUPERMARIO -Pokemon -STARTREK -Fallout -MTV -Beetlejuice -SouthPark -HelloKitty -Jeep -GypsyQueen -NEWLINECINEMA -ScoobyDoo -Nickelodeon -Popfunk -WWE -DrSeuss -NBC -CartoonNetwork -Hasbro -CocaCola -RickMorty -Nintendo -DespicableMe -JurassicPark -TMNT -MyLittlePony -AmericanKennelClub -AnnoyingOrange -Buckedup -Daria -Dunkin -IMOMSOHARD -Kabillion -LyricVerse -ROBLOX -Oddbods -Mandalorian -Aerosmith -Bengals -Rebelde -Mattel -Sheeran -Zelda -Dunham -Masha -Paramount -Sony -Lionsgate -HBO -AMC -BBC -Netflix -Hulu -PlayStation -Xbox -Fortnite -Overwatch -Minecraft -Tetris -SEGA -Atari -Capcom -Konami -ACDC -Metallica -Nirvana -BTS -BLACKPINK -Lego -Barney -Bluey -Tonka -Ford -Chevrolet -Toyota -Honda -Tesla -BMW -Nike -Adidas -Puma -Gucci -Chanel -Balenciaga -Vans -Fila -Pepsi -Sprite -DrPepper -Nestle -Oreo -Reeses -Snickers -McDonalds -KFC -Starbucks -NFL -NBA -MLB -NHL -NCAA -FIFA -UFC -Google -Facebook -Instagram -Snapchat -YouTube -Twitter -TikTok',
                // No Preset Defaults
                noPresetDefaults: {
                    productType: 'tshirt',
                    department: 'fashion-novelty',
                    sortOrder: 'featured',
                    category: ''
                },
                // Department Exclusive Settings (TimeFilters, Seller & Review Filters, sort Filters for USA
                departmentSettings: {
                    'mobile': {
                    reviewsFilter: 'p_72%3A2491149011'
                  },
                    'garden': {
                    timeFilters: {
                      '30days': 'p_n_date_first_available_absolute%3A1249052011',
                      '90days': 'p_n_date_first_available_absolute%3A1249053011'
                    },
                    reviewsFilter: 'p_72%3A1248915011'
                  },
                  'stripbooks': {
                    timeFilters: {
                      '30days': 'p_n_publication_date%3A1250226011',
                      '90days': 'p_n_publication_date%3A1250227011'
                    },
                    sellerFilter: ' ',
                    reviewsFilter: 'p_72%3A1250221011',
                    sortOrders: [
                        {value: '', text: 'Default (None)'},
                        {value: 'featured', text: 'Featured'},
                        {value: 'exact-aware-popularity-rank', text: 'Best Sellers'},
                        {value: 'most-purchased-rank', text: 'Most Purchased Rank'},
                        {value: 'review-rank', text: 'Avg Review Rank'},
                        {value: 'review-count-rank', text: 'Most Reviews'},
                        {value: 'date-desc-rank', text: 'Publication Date'},
                        {value: 'salesrank', text: 'Sales Rank'}
                    ]
                  }
                },
                // Department to Product mappings UK
                productTypeToDepartment: {
                'KDP': 'stripbooks',
                'tshirt': 'fashion-novelty',
                'premtshirt': 'fashion-novelty',
                'tanktop': 'fashion-novelty',
                'longsleeve': 'fashion-novelty',
                'raglan': 'fashion-novelty',
                'sweatshirt': 'fashion-novelty',
                'hoodie': 'fashion-novelty',
                'ziphoodie': 'fashion-novelty',
                'popsocket': 'mobile',
                'case': 'mobile',
                'totebag': 'fashion',
                'throwpillow': 'garden',
                'tumbler': 'garden',
                'coffeemug': 'garden'
                },
                departmentToProductType: {
                    'stripbooks': 'KDP'
                }
                // OLD ONE productTypeMappings: {
                //    'stripbooks': 'KDP'
                // }
            },
            'co.uk': // UK
                { timeFilters: {
                    '30days': 'p_n_date_first_available_absolute%3A13827689031',
                    '90days': 'p_n_date_first_available_absolute%3A13827690031'
                },
                sellerFilter: 'p_6%3AA3P5ROKL5A1OLE',
                reviewsFilter: 'p_72%3A184324031',
                // Product type keywords specific to UK
                productTypeKeywords: {
                    'tshirt': 'Lightweight%2C+Classic+fit%2C+Double-needle+sleeve+and+bottom+hem+-Longsleeve+-Raglan+-Vneck+-Tanktop',
                    'tanktop': '"tanktop"+Lightweight%2C+Classic+fit%2C+Double-needle+sleeve+and+bottom+hem+-Longsleeve+-Raglan+-Vneck',
                    'longsleeve': '"Long+sleeve"+unisex-adult+Classic+fit%2C+Double-needle+sleeve+and+bottom+hem+-premium+-Raglan+-Vneck+-Sweatshirt+-Tanktop',
                    'raglan': '"raglan"+Lightweight%2C+Classic+fit%2C+Double-needle+sleeve+and+bottom+hem+-Vneck+-Tanktop',
                    'sweatshirt': '"sweatshirt"+8.5+oz%2C+Classic+fit%2C+Twill-taped+neck+-Raglan+-Vneck+-Tanktop+-hoodie',
                    'hoodie': '"pullover+hoodie"+8.5+oz%2C+Classic+fit%2C+Twill-taped+neck+-Raglan+-Vneck+-Tanktop+-zip',
                    'ziphoodie': '"zip+hoodie"+8.5+oz%2C+Classic+fit%2C+Twill-taped+neck+-Raglan+-Vneck+-Tanktop',
                    'popsocket': '"Popsocket"+Adhesive backing attaches the PopGrip to your case or device. Will not stick to silicone, leather, waterproof, or highly textured cases. Works best with smooth, hard, plastic cases.',
                    'case': '"case"+"Two-part+protective+case+made+from+a+premium+scratch-resistant+polycarbonate+shell+and+shock+absorbent+TPU+liner+protects+against+drops"',
                    'KDP': '"independently+published"'
                },
                // Sort orders for UK
                sortOrders: [{
                        value: 'featured',
                        text: 'Featured'
                    },
                    {
                        value: 'date-desc-rank',
                        text: 'Newest Arrivals'
                    },
                    {
                        value: 'most-purchased-rank',
                        text: 'Most Purchased Rank'
                    },
                    {
                        value: 'exact-aware-popularity-rank',
                        text: 'Best Sellers'
                    },
                    {
                        value: 'review-rank',
                        text: 'Top Rated (Avg Review Rank)'
                    },
                    {
                        value: 'review-count-rank',
                        text: 'Most Reviews Count Rank'
                    },
                    {
                        value: 'date-asc-rank',
                        text: 'Oldest First'
                    },
                    {
                        value: 'featured-rank',
                        text: 'Featured (featured-rank)'
                    },
                    {
                        value: 'most-wished-for-rank',
                        text: 'Most Wished For Rank'
                    },
                    {
                        value: 'custom',
                        text: 'NONE'
                    }
                ],
                // Departments and categories for UK
                categories: {
                    'fashion': {
                        displayName: 'Fashion',
                        categories: [
                            {value: '1731104031', text: 'Novelty' /*catParamType: 'bbn'*/},
                            /*{value: '1730929031', text: 'Men\'s Clothing'},
                            {value: '1731296031', text: 'Women\'s Clothing'},
                            {value: '1730756031', text: 'Boys\' Clothing'},
                            {value: '1730841031', text: 'Girls\' Clothing'},*/
                            {value: '1731041031', text: 'Novelty & Special Use' /*catParamType: 'bbn'*/}
                        ]
                    },
                    'electronics': {
                        displayName: 'Electronics & Photo',
                        categories: []
                    },
                    'kitchen': {
                        displayName: 'Home & Kitchen',
                        categories: []
                    },
                    // 'stripbooks-intl-ship' MRB uses this // UK
                    'stripbooks': {
                        displayName: 'Books (KDP)',
                        categories: [
                            {value: '507848', text: 'Calendars'},
                            {value: '69', text: 'Children\'s Books'},
                            {value: '64', text: 'Home & Garden'}
                        ]
                    },
                    '': {
                        displayName: 'All (No Department)',
                        categories: []
                    }
                },
                // Brands to exclude for UK
                excludeBrands: '-Officially+-Licensed+-LyricLyfe+-Disney+-Marvel+-StarWars+-Mademark+-HarryPotter+-Pixar+-SANRIO+-EliteAuthentics+-Barbie+-BATMAN+-JeffDunham+-CJGrips+-BreakingT+-SpongebobSquarePants+-BallparkMVP+-DCComics+-LooneyTunes+-SUPERMARIO+-Pokemon+-STARTREK+-StrangerThings+-Fallout+-MTV+-Beetlejuice+-SouthPark+-HelloKitty+-Jeep+-GypsyQueen+-TheRollingStones+-NEWLINECINEMA+-SagittariusGallery+-ScoobyDoo+-OfficialHighSchoolFanGear+-PinkFloyd+-Nickelodeon+-CareBears+-Popfunk+-FanPrint+-WarnerBros+-WWE+-DrSeuss+-NBC+-CuriousGeorge+-MeanGirls+-CartoonNetwork+-SesameStreet+-Hasbro+-CocaCola+-RickMorty+-Nintendo+-DespicableMe+-JurassicPark+-TMNT+-MyLittlePony+-AmericanKennelClub+-AnnoyingOrange+-BeerNuts+-BillNye+-Booba+-Buckedup+-CarlyMartina+-ComradeDetective+-Daria+-DippinDots+-DramaLlama+-Dunkin+-HannahHart+-IMOMSOHARD+-ImpracticalJokers+-JaneAusten+-JaneGoodall+-JennMcAllister+-JoJoSiwa+-Kabillion+-LoveIsland+-LyricVerse+-ModPodge+-NashGrier+-NeildeGrasseTyson+-RickyDillon+-ROBLOX+-ShibSibs+-SpongeBob+-TheDailyWire+-TheGrandTour+-Oddbods+-TheYoungTurks+-TheSoul+-TwinPeaks+-UglyDolls+-Mandalorian+-SpaceJam+-Aerosmith+-Bengals+-Rebelde+-BreakingBad+-FooFighters+-BlackSabbath+-SelenaQuintanilla+-CampusLab+-RobZombie+-Misfits+-Mattel+-Sheeran+-Zelda+-Dunham+-Masha+-DreamWorks+-UniversalStudios+-Paramount+-20thCenturyStudios+-SonyPictures+-Lionsgate+-HBO+-AMC+-Netflix+-Hulu+-PlayStation+-Xbox+-LeagueofLegends+-Overwatch+-Minecraft+-EldenRing+-WorldofWarcraft+-TheSims+-AmongUs+-Tetris+-SEGA+-Atari+-Capcom+-Konami+-TheBeatles+-ACDC+-Metallica+-Nirvana+-TaylorSwift+-BTS+-BLACKPINK+-Drake+-GameofThrones+-SquidGame+-PeakyBlinders+-Lego+-Barney+-ThomasandFriends+-PeppaPig+-Bluey+-FisherPrice+-Tonka+-PowerRangers+-Ford+-Chevrolet+-Toyota+-Honda+-Tesla+-BMW+-MercedesBenz+-HarleyDavidson+-Nike+-Adidas+-Puma+-Gucci+-LouisVuitton+-Chanel+-Balenciaga+-Vans+-Fila+-Pepsi+-MountainDew+-Sprite+-DrPepper+-Nestle+-Oreo+-Reeses+-Snickers+-TacoBell+-McDonalds+-KFC+-Starbucks+-NFL+-NBA+-MLB+-NHL+-NCAA+-FIFA+-UFC+-Google+-Facebook+-Instagram+-Snapchat+-YouTube+-Twitter+-TikTok+-BBC+-ITV+-Channel4+-Channel5+-VirginMedia+-Vodafone+-Tesco+-Sainsburys+-Morrisons+-Waitrose+-MarksandSpencer+-JohnLewis+-Debenhams+-Harrods+-Selfridges+-WHSmith+-Waterstones+-PenguinBooks+-OxfordUniversityPress+-CambridgeUniversityPress+-Barclays+-HSBC+-LloydsBank+-NatWest+-SantanderUK+-RollsRoyce+-Bentley+-Jaguar+-LandRover+-AstonMartin+-McLaren+-Burberry+-AlexanderMcQueen+-VivienneWestwood+-PaulSmith+-Superdry+-DrMartens+-Topshop+-Primark+-TedBaker+-Mulberry+-EasyJet+-BritishAirways+-Ocado+-PremierLeague+-Arsenal+-Chelsea+-LiverpoolFC+-ManchesterUnited+-TottenhamHotspur+-DoctorWho+-DowntonAbbey+-EastEnders+-RollingStones+-LedZeppelin+-SpiceGirls+-HarryStyles+-OneDirection+-Fortnite+-CallofDuty+-Funko+-LEGO',
                // No Preset Defaults
                noPresetDefaults: {
                    productType: 'tshirt',
                    department: 'fashion',
                    sortOrder: 'featured',
                    category: ''
                },
                // Department Exclusive Settings (TimeFilters, Seller & Review Filters, sort Filters for UK
                departmentSettings: {
                    'electronics': {
                    timeFilters: {
                      '30days': 'p_n_date_first_available_absolute%3A419164031',
                      '90days': 'p_n_date_first_available_absolute%3A419165031'
                    },
                    sellerFilter: 'p_6%3AA3P5ROKL5A1OLE',
                    reviewsFilter: 'p_72%3A419153031'
                  },
                    'kitchen': {
                    timeFilters: {
                      '30days': 'p_n_date_first_available_absolute%3A419164031',
                      '90days': 'p_n_date_first_available_absolute%3A419165031'
                    },
                    sellerFilter: 'p_6%3AA3P5ROKL5A1OLE',
                    reviewsFilter: 'p_72%3A419153031'
                  },
                  'stripbooks': {
                    timeFilters: {
                      '30days': 'p_n_publication_date%3A182241031',
                      '90days': 'p_n_publication_date%3A182242031'
                    },
                    sellerFilter: ' ',
                    reviewsFilter: 'p_72%3A184315031',
                    sortOrders: [
                        {value: '', text: 'Default (None)'},
                        {value: 'featured', text: 'Featured'},
                        {value: 'exact-aware-popularity-rank', text: 'Best Sellers'},
                        {value: 'most-purchased-rank', text: 'Most Purchased Rank'},
                        {value: 'review-rank', text: 'Avg Review Rank'},
                        {value: 'review-count-rank', text: 'Most Reviews'},
                        {value: 'date-desc-rank', text: 'Publication Date'},
                        {value: 'salesrank', text: 'Sales Rank'}
                    ]
                  }
                },
                // Department to Product mappings UK
                productTypeToDepartment: {
                'KDP': 'stripbooks',
                /*'tshirt': {department: 'fashion', category: '1731104031'},*/
                'tshirt': 'fashion',
                'tanktop': 'fashion',
                'longsleeve': 'fashion',
                'raglan': 'fashion',
                'sweatshirt': 'fashion',
                'hoodie': 'fashion',
                'ziphoodie': 'fashion',
                'popsocket': 'electronics',
                'case': 'electronics'
                },
                departmentToProductType: {
                    'stripbooks': 'KDP'
                }
            },
            'de': { // DE
                timeFilters: {
                    '30days': 'p_n_date_first_available_absolute%3A13827501031',
                    '90days': 'p_n_date_first_available_absolute%3A13827502031'
                },
                sellerFilter: 'p_6%3AA3JWKAKR8XB7XF',
                reviewsFilter: 'p_72%3A419117031',
                // Product type keywords specific to DE
                productTypeKeywords: {
                    'tshirt': 'Klassisch geschnitten, doppelt genähter Saum.+-Langarmshirt+-Raglan+-V-Ausschnitt+-Tanktop',
                    'tanktop': '"tank+top"+leichtes, klassisch geschnittenes Tank Top, doppelt genähte Ärmel und Saumabschluss+-Langarmshirt+-Raglan+-V-Ausschnitt',
                    'longsleeve': '"Langarmshirt"+Klassisch geschnitten, doppelt genähter Saum+-Raglan+-V-Ausschnitt+-Sweatshirt+-Tanktop',
                    'raglan': '"raglan"+leichter, klassischer Schnitt, doppelt genähte Ärmel und Saumabschluss+-Langarmshirt+-V-Ausschnitt+-Tanktop',
                    'sweatshirt': '"sweatshirt"+8.5 oz, Klassisch geschnitten+-Raglan+-Vneck+-Tanktop+-hoodie', // '"sweatshirt"+8.5 oz, classic cut+-Raglan+-Vneck+-Tanktop+-hoodie',
                    'hoodie': '"pullover+hoodie"+8.5 oz, Klassisch geschnitten, doppelt genähter Saum+-Raglan+-V-Ausschnitt+-Tanktop+-Zip',
                    'ziphoodie': '"Kapuzenjacke"+241gr leichter, klassischer Schnitt; verstärkter Nacken+-Raglan+-V-Ausschnitt+-Tanktop',
                    'popsocket': '"Popsocket"+Der klebende Rücken befestigt den PopGrip an Ihrem Gehäuse oder Gerät. Klebt nicht auf Silikon-, Leder-, wasserdichten oder stark strukturierten Gehäusen. Funktioniert am besten mit glatten, harten Plastikgehäusen.',
                    'case': '"case" Die zweiteilige Schutzhülle aus einer hochwertigen, kratzfesten Polycarbonatschale und einer stoßdämpfenden TPU-Auskleidung schützt vor Stürzen "merch von amazon"',// '"case"+Die zweiteilige Schutzhülle aus einer hochwertigen, kratzfesten Polycarbonatschale und einer stoßdämpfenden TPU-Auskleidung schützt vor Stürzen+"Merch von Amazon"', // '"case"+"The two-piece protective case made from a high quality scratch resistant polycarbonate shell and shock absorbing TPU liner protects against drops"+"Merch von Amazon"',
                    'KDP': '"independently+published"'
                },
                // Sort orders for DE
                sortOrders: [{
                        value: 'featured',
                        text: 'Featured'
                    },
                    {
                        value: 'date-desc-rank',
                        text: 'Newest Arrivals'
                    },
                    {
                        value: 'most-purchased-rank',
                        text: 'Most Purchased Rank'
                    },
                    {
                        value: 'exact-aware-popularity-rank',
                        text: 'Best Sellers'
                    },
                    {
                        value: 'review-rank',
                        text: 'Top Rated (Avg Review Rank)'
                    },
                    {
                        value: 'review-count-rank',
                        text: 'Most Reviews Count Rank'
                    },
                    {
                        value: 'date-asc-rank',
                        text: 'Oldest First'
                    },
                    {
                        value: 'featured-rank',
                        text: 'Featured (featured-rank)'
                    },
                    {
                        value: 'most-wished-for-rank',
                        text: 'Most Wished For Rank'
                    },
                    {
                        value: 'custom',
                        text: 'NONE'
                    }
                ],
                // Departments and categories for DE
                categories: {
                    'fashion': {
                        displayName: 'Fashion',
                        categories: [
                            {value: '1981473031', text: 'Novelty'},
                            /*{value: '1730929031', text: 'Men\'s Clothing'},
                            {value: '1731296031', text: 'Women\'s Clothing'},
                            {value: '1730756031', text: 'Boys\' Clothing'},
                            {value: '1730841031', text: 'Girls\' Clothing'},*/
                            {value: '1981410031', text: 'Novelty & Special Use'}
                        ]
                    },
                    'electronics': {
                        displayName: 'Electronics & Photo',
                        categories: []
                    },
                    'kitchen': {
                        displayName: 'Home & Kitchen',
                        categories: []
                    },
                    // 'stripbooks-intl-ship' MRB uses this DE
                    'stripbooks': {
                        displayName: 'Books (KDP)',
                        categories: [
                            {value: '118310011', text: 'Calendars'},
                            {value: '5452736031', text: 'Children\'s Books'},
                            {value: '122', text: 'Home & Garden'}
                        ]
                    },
                    '': {
                        displayName: 'All (No Department)',
                        categories: []
                    }
                },
                // Brands to exclude for DE
                excludeBrands: '-Officially+-Licensed+-LyricLyfe+-Disney+-Marvel+-StarWars+-Mademark+-HarryPotter+-Pixar+-SANRIO+-EliteAuthentics+-Barbie+-BATMAN+-JeffDunham+-CJGrips+-BreakingT+-SpongebobSquarePants+-BallparkMVP+-DCComics+-LooneyTunes+-SUPERMARIO+-Pokemon+-STARTREK+-StrangerThings+-Fallout+-MTV+-Beetlejuice+-SouthPark+-HelloKitty+-Jeep+-GypsyQueen+-TheRollingStones+-NEWLINECINEMA+-SagittariusGallery+-ScoobyDoo+-OfficialHighSchoolFanGear+-PinkFloyd+-Nickelodeon+-CareBears+-Popfunk+-FanPrint+-WarnerBros+-WWE+-DrSeuss+-NBC+-CuriousGeorge+-MeanGirls+-CartoonNetwork+-SesameStreet+-Hasbro+-CocaCola+-RickMorty+-Nintendo+-DespicableMe+-JurassicPark+-TMNT+-MyLittlePony+-AmericanKennelClub+-AnnoyingOrange+-BeerNuts+-BillNye+-Booba+-Buckedup+-CarlyMartina+-ComradeDetective+-Daria+-DippinDots+-DramaLlama+-Dunkin+-HannahHart+-IMOMSOHARD+-ImpracticalJokers+-JaneAusten+-JaneGoodall+-JennMcAllister+-JoJoSiwa+-Kabillion+-LoveIsland+-LyricVerse+-ModPodge+-NashGrier+-NeildeGrasseTyson+-RickyDillon+-ROBLOX+-ShibSibs+-SpongeBob+-TheDailyWire+-TheGrandTour+-Oddbods+-TheYoungTurks+-TheSoul+-TwinPeaks+-UglyDolls+-Mandalorian+-SpaceJam+-Aerosmith+-Bengals+-Rebelde+-BreakingBad+-FooFighters+-BlackSabbath+-SelenaQuintanilla+-CampusLab+-RobZombie+-Misfits+-Mattel+-Sheeran+-Zelda+-Dunham+-Masha+-DreamWorks+-UniversalStudios+-Paramount+-20thCenturyStudios+-SonyPictures+-Lionsgate+-HBO+-AMC+-BBC+-Netflix+-Hulu+-PlayStation+-Xbox+-Fortnite+-LeagueofLegends+-Overwatch+-CallofDuty+-Minecraft+-EldenRing+-WorldofWarcraft+-TheSims+-AmongUs+-Tetris+-SEGA+-Atari+-Capcom+-Konami+-TheBeatles+-LedZeppelin+-ACDC+-Metallica+-Nirvana+-TaylorSwift+-BTS+-BLACKPINK+-Drake+-GameofThrones+-SquidGame+-PeakyBlinders+-Lego+-Barney+-ThomasandFriends+-PeppaPig+-Bluey+-FisherPrice+-Tonka+-PowerRangers+-Ford+-Chevrolet+-Toyota+-Honda+-Tesla+-BMW+-MercedesBenz+-HarleyDavidson+-Nike+-Adidas+-Puma+-Gucci+-LouisVuitton+-Chanel+-Balenciaga+-Vans+-Fila+-Pepsi+-MountainDew+-Sprite+-DrPepper+-Nestle+-Oreo+-Reeses+-Snickers+-TacoBell+-McDonalds+-KFC+-Starbucks+-NFL+-NBA+-MLB+-NHL+-NCAA+-FIFA+-UFC+-Google+-Facebook+-Instagram+-Snapchat+-YouTube+-Twitter+-TikTok+-Audi+-Volkswagen+-Porsche+-Opel+-BOSCH+-Siemens+-Allianz+-DeutscheBank+-Commerzbank+-DeutscheTelekom+-VodafoneDE+-TelefonicaDE+-Lufthansa+-Eurowings+-DHL+-DeutschePost+-Bayer+-Henkel+-Miele+-Nivea+-BASF+-Continental+-AldiNord+-AldiSued+-Lidl+-Rewe+-Edeka+-MetroAG+-FCBayernMunich+-BorussiaDortmund+-Bundesliga+-ProSieben+-ZDF+-DeutscheWelle+-Bild+-Spiegel+-Volksbuehne+-Fortnite+-CallofDuty+-PlayStation+-Xbox+-STEIFF+-Playmobil+-Ravensburger',
                // No Preset Defaults
                noPresetDefaults: {
                    productType: 'tshirt',
                    department: 'fashion',
                    sortOrder: 'featured',
                    category: ''
                },
                // Department Exclusive Settings (TimeFilters, Seller & Review Filters, sort Filters for DE
                departmentSettings: {
                    'electronics': {
                    timeFilters: {
                      '30days': 'p_n_date_first_available_absolute%3A419128031',
                      '90days': 'p_n_date_first_available_absolute%3A419129031'
                    },
                    sellerFilter: 'p_6%3AA3JWKAKR8XB7XF',
                    reviewsFilter: 'p_72%3A419117031'
                  },
                    'kitchen': {
                    timeFilters: {
                      '30days': 'p_n_date_first_available_absolute%3A419128031',
                      '90days': 'p_n_date_first_available_absolute%3A419129031'
                    },
                    sellerFilter: 'p_6%3AA3JWKAKR8XB7XF',
                    reviewsFilter: 'p_72%3A419117031'
                  },
                  'stripbooks': {
                    timeFilters: {
                      '30days': 'p_n_publication_date%3A1778535031',
                      '90days': 'p_n_publication_date%3A1778536031'
                    },
                    sellerFilter: ' ',
                    reviewsFilter: 'p_72%3A184738031',
                    sortOrders: [
                        {value: '', text: 'Default (None)'},
                        {value: 'featured', text: 'Featured'},
                        {value: 'exact-aware-popularity-rank', text: 'Best Sellers'},
                        {value: 'most-purchased-rank', text: 'Most Purchased Rank'},
                        {value: 'review-rank', text: 'Avg Review Rank'},
                        {value: 'review-count-rank', text: 'Most Reviews'},
                        {value: 'date-desc-rank', text: 'Publication Date'},
                        {value: 'salesrank', text: 'Sales Rank'}
                    ]
                  }
                },
                // Department to Product mappings for DE
                productTypeToDepartment: {
                'KDP': 'stripbooks',
                /*'tshirt': {department: 'fashion', category: '1731104031'},*/
                'tshirt': 'fashion',
                'tanktop': 'fashion',
                'longsleeve': 'fashion',
                'raglan': 'fashion',
                'sweatshirt': 'fashion',
                'hoodie': 'fashion',
                'ziphoodie': 'fashion',
                'popsocket': 'electronics',
                'case': 'electronics'
                },
                departmentToProductType: {
                    'stripbooks': 'KDP'
                }
            },
            'fr': { // FR
                timeFilters: {
                    '30days': 'p_n_date_first_available_absolute%3A13827697031',
                    '90days': 'p_n_date_first_available_absolute%3A13827698031'
                },
                sellerFilter: 'p_6%3AA1X6FK5RDHNB96',
                reviewsFilter: 'p_72%3A437873031',
                // Product type keywords specific to FR
                productTypeKeywords: {
                    'tshirt': 'Léger,+Coupe+classique,+manche+à+double+couture+et+ourlet+la+base+-Longue+-Raglan+-ColenV+-Débardeur',
                    'tanktop': '"Débardeur"+Léger,+Coupe+classique,+manche+à+double+couture+et+ourlet+la+base+-Longue+-Raglan+-ColenV',
                    'longsleeve': '"Longue"+Léger,+Coupe+classique,+manche+à+double+couture+et+ourlet+la+base+-Raglan+-ColenV+-sweatshirt+-Débardeur',
                    'raglan': '"Raglan"+Léger,+Coupe+classique,+manche+à+double+couture+et+ourlet+la+base+-ColenV+-Débardeur',
                    'sweatshirt': '"sweatshirt"+241 g, coupe classique, col tissé+-Raglan+-ColenV+-Débardeur+-Capuche',
                    'hoodie': '"Capuche"+241 g, coupe classique, col tissé+-Raglan+-ColenV+-Débardeur+-zip',
                    'ziphoodie': '"Capuche"+"zip"+241 g, coupe classique, col tissé+-Raglan+-ColenV+-Débardeur',
                    'popsocket': '"Popsocket"+Le dessus imprimé est interchangeable avec d\'autres modèles de PopGrip compatibles. Il suffit d\'appuyer à plat, de tourner de 90 degrés jusqu\'à entendre un clic et de le retirer pour l\'échanger.',
                    'case': '"Coque"+Coque de protection en deux parties composé d\'une coque en polycarbonate de première qualité résistant aux rayures et d\'une doublure en TPU absorbant les chocs et protégeant contre les chutes+"Merch par Amazon"',
                    'KDP': '"independently+published"'
                },
                // Sort orders for FR
                sortOrders: 
                    [{
                        value: 'featured',
                        text: 'Featured'
                    },
                    {
                        value: 'date-desc-rank',
                        text: 'Newest Arrivals'
                    },
                    {
                        value: 'most-purchased-rank',
                        text: 'Most Purchased Rank'
                    },
                    {
                        value: 'exact-aware-popularity-rank',
                        text: 'Best Sellers'
                    },
                    {
                        value: 'review-rank',
                        text: 'Top Rated (Avg Review Rank)'
                    },
                    {
                        value: 'review-count-rank',
                        text: 'Most Reviews Count Rank'
                    },
                    {
                        value: 'date-asc-rank',
                        text: 'Oldest First'
                    },
                    {
                        value: 'featured-rank',
                        text: 'Featured (featured-rank)'
                    },
                    {
                        value: 'most-wished-for-rank',
                        text: 'Most Wished For Rank'
                    },
                    {
                        value: 'custom',
                        text: 'NONE'
                    }
                ],
                // Departments and categories for FR
                categories: {
                    'fashion': {
                        displayName: 'Mode',
                        categories: [
                            {value: '465090031', text: 'Fantaisie'},
                            /*{value: '436560031', text: 'Homme'},
                            {value: '436559031', text: 'Femme'},
                            {value: '436562031', text: 'Garçon'},
                            {value: '436561031', text: 'Fille'},*/
                            {value: '436564031', text: 'Vêtements techniques et spéciaux'}
                        ]
                    },
                    'electronics': {
                        displayName: 'High-Tech',
                        categories: []
                    },
                    'kitchen': {
                        displayName: 'Cuisine & maison',
                        categories: []
                    },
                    // 'stripbooks-intl-ship' MRB uses this FR
                    'stripbooks': {
                        displayName: 'Livres (KDP)',
                        categories: [
                            {value: '8434456031', text: 'Calendriers et Agendas'},
                            {value: '301137', text: 'Livres pour enfants'}, //76742011
                            {value: '355635011', text: 'Loisirs créatifs, décoration et maison'} //81247011
                        ]
                    },
                    '': {
                        displayName: 'All (No Department)',
                        categories: []
                    }
                },
                // Brands to exclude for FR
                excludeBrands: '-Officially+-Licensed+-LyricLyfe+-Disney+-Marvel+-StarWars+-Mademark+-HarryPotter+-Pixar+-SANRIO+-EliteAuthentics+-Barbie+-BATMAN+-JeffDunham+-CJGrips+-BreakingT+-SpongebobSquarePants+-BallparkMVP+-DCComics+-LooneyTunes+-SUPERMARIO+-Pokemon+-STARTREK+-StrangerThings+-Fallout+-MTV+-Beetlejuice+-SouthPark+-HelloKitty+-Jeep+-GypsyQueen+-TheRollingStones+-NEWLINECINEMA+-SagittariusGallery+-ScoobyDoo+-OfficialHighSchoolFanGear+-PinkFloyd+-Nickelodeon+-CareBears+-Popfunk+-FanPrint+-WarnerBros+-WWE+-DrSeuss+-NBC+-CuriousGeorge+-MeanGirls+-CartoonNetwork+-SesameStreet+-Hasbro+-CocaCola+-RickMorty+-Nintendo+-DespicableMe+-JurassicPark+-TMNT+-MyLittlePony+-AmericanKennelClub+-AnnoyingOrange+-BeerNuts+-BillNye+-Booba+-Buckedup+-CarlyMartina+-ComradeDetective+-Daria+-DippinDots+-DramaLlama+-Dunkin+-HannahHart+-IMOMSOHARD+-ImpracticalJokers+-JaneAusten+-JaneGoodall+-JennMcAllister+-JoJoSiwa+-Kabillion+-LoveIsland+-LyricVerse+-ModPodge+-NashGrier+-NeildeGrasseTyson+-RickyDillon+-ROBLOX+-ShibSibs+-SpongeBob+-TheDailyWire+-TheGrandTour+-Oddbods+-TheYoungTurks+-TheSoul+-TwinPeaks+-UglyDolls+-Mandalorian+-SpaceJam+-Aerosmith+-Bengals+-Rebelde+-BreakingBad+-FooFighters+-BlackSabbath+-SelenaQuintanilla+-CampusLab+-RobZombie+-Misfits+-Mattel+-Sheeran+-Zelda+-Dunham+-Masha+-DreamWorks+-UniversalStudios+-Paramount+-20thCenturyStudios+-SonyPictures+-Lionsgate+-HBO+-AMC+-BBC+-Netflix+-Hulu+-PlayStation+-Xbox+-Fortnite+-LeagueofLegends+-Overwatch+-CallofDuty+-Minecraft+-EldenRing+-WorldofWarcraft+-TheSims+-AmongUs+-Tetris+-SEGA+-Atari+-Capcom+-Konami+-TheBeatles+-LedZeppelin+-ACDC+-Metallica+-Nirvana+-TaylorSwift+-BTS+-BLACKPINK+-Drake+-GameofThrones+-SquidGame+-PeakyBlinders+-Barney+-ThomasandFriends+-PeppaPig+-Bluey+-FisherPrice+-Tonka+-PowerRangers+-Ford+-Chevrolet+-Toyota+-Honda+-Tesla+-BMW+-MercedesBenz+-HarleyDavidson+-Nike+-Adidas+-Puma+-Gucci+-LouisVuitton+-Chanel+-Balenciaga+-Vans+-Fila+-Pepsi+-MountainDew+-Sprite+-DrPepper+-Nestle+-Oreo+-Reeses+-Snickers+-TacoBell+-McDonalds+-KFC+-Starbucks+-NFL+-NBA+-MLB+-NHL+-NCAA+-FIFA+-Olympics+-UFC+-Google+-Facebook+-Instagram+-Snapchat+-YouTube+-Twitter+-TikTok+-Dior+-Hermes+-Cartier+-LVMH+-Kering+-LOreal+-Clarins+-Lancome+-Guerlain+-Peugeot+-Renault+-Citroen+-DSAutomobiles+-AirFrance+-BNPParibas+-SocieteGenerale+-CreditAgricole+-AXA+-Danone+-Michelin+-Decathlon+-Carrefour+-Auchan+-Leclerc+-TotalEnergies+-Engie+-SFR+-BouyguesTelecom+-TF1+-CanalPlus+-FranceTelevisions+-Gaumont+-PSG+-OlympiqueMarseille+-Ligue1+-SMEG+-LEGO+-Schleich',
                // No Preset Defaults
                noPresetDefaults: {
                    productType: 'tshirt',
                    department: 'fashion',
                    sortOrder: 'featured',
                    category: ''
                },
                // Department Exclusive Settings (TimeFilters, Seller & Review Filters, sort Filters for FR
                departmentSettings: {
                    'electronics': {
                    timeFilters: {
                      '30days': 'p_n_date_first_available_absolute%3A437884031',
                      '90days': 'p_n_date_first_available_absolute%3A437885031'
                    },
                    reviewsFilter: 'p_72%3A437873031'
                  },
                    'kitchen': {
                    timeFilters: {
                      '30days': 'p_n_date_first_available_absolute%3A437884031',
                      '90days': 'p_n_date_first_available_absolute%3A437885031'
                    },
                    reviewsFilter: 'p_72%3A437873031'
                  },
                  'stripbooks': {
                    timeFilters: {
                      '30days': 'p_n_publication_date%3A183196031',
                      '90days': 'p_n_publication_date%3A183197031'
                    },
                    sellerFilter: ' ',
                    reviewsFilter: 'p_72%3A184904031',
                    sortOrders: [
                        {value: '', text: 'Default (None)'},
                        {value: 'featured', text: 'Featured'},
                        {value: 'exact-aware-popularity-rank', text: 'Best Sellers'},
                        {value: 'most-purchased-rank', text: 'Most Purchased Rank'},
                        {value: 'review-rank', text: 'Avg Review Rank'},
                        {value: 'review-count-rank', text: 'Most Reviews'},
                        {value: 'date-desc-rank', text: 'Publication Date'},
                        {value: 'salesrank', text: 'Sales Rank'}
                    ]
                  }
                },
                // Department to Product mappings for FR
                productTypeToDepartment: {
                'KDP': 'stripbooks',
                /*'tshirt': {department: 'fashion', category: '1731104031'},*/
                'tshirt': 'fashion',
                'tanktop': 'fashion',
                'longsleeve': 'fashion',
                'raglan': 'fashion',
                'sweatshirt': 'fashion',
                'hoodie': 'fashion',
                'ziphoodie': 'fashion',
                'popsocket': 'electronics',
                'case': 'electronics'
                },
                departmentToProductType: {
                    'stripbooks': 'KDP'
                }
            },
            'it': { // IT
                timeFilters: {
                    // 'last7days': 'p_n_date_first_available_absolute%3A13827471031',
                    '30days': 'p_n_date_first_available_absolute%3A13827472031',
                    '90days': 'p_n_date_first_available_absolute%3A13827473031'
                },
                sellerFilter: 'p_6%3AA11IL2PNWYJU7H',
                reviewsFilter: 'p_72%3A490205031',
                // Product type keywords specific to IT
                productTypeKeywords: {
                    'tshirt': 'Leggera, taglio classico, maniche con doppia cucitura e orlo inferiore+-lunga+-Raglan+-Collo+-Canotta',
                    'tanktop': '"Canotta"+Leggera, taglio classico, maniche con doppia cucitura e orlo inferiore+-lunga+-Raglan+-collo',
                    'longsleeve': '"lunga"+Leggera, taglio classico, maniche con doppia cucitura e orlo inferiore+-Raglan+-collo+-Felpa+-canotta+maglietta',
                    'raglan': '"Raglan"+Leggera, taglio classico, maniche con doppia cucitura e orlo inferiore+-collo+-canotta',
                    'sweatshirt': '"Felpa"+241 g, taglio classico, collo rinforzato con nastro in twill+-Raglan+-canotta+-Cappuccio',
                    'hoodie': '"Cappuccio"+241 g, taglio classico, collo rinforzato con nastro in twill+-Raglan+-canotta+-zip',
                    'ziphoodie': '"Cappuccio"+"zip"+241 g, taglio classico, collo rinforzato con nastro in twill+-Raglan+-canotta',
                    'popsocket': '"Popsocket"+Il coperchio stampato è intercambiabile con altri modelli di PopGrip compatibili. Basta premere piatto, ruotare di 90 gradi fino a sentire uno scatto e rimuoverlo per sostituirlo.',
                    'case': '"custodia"+"Custodia protettiva pieghevole, in stile portafoglio, fatta da policarbonato antigraffio di alta qualità ed un rivestimento in TPU assorbente agli urti. Attutisce i colpi e protegge da cadute accidentali"', //"Merch di Amazon"
                    'KDP': '"independently+published"'
                },
                // Sort orders for IT
                sortOrders: 
                    [{
                        value: 'featured',
                        text: 'Featured'
                    },
                    {
                        value: 'date-desc-rank',
                        text: 'Newest Arrivals'
                    },
                    {
                        value: 'most-purchased-rank',
                        text: 'Most Purchased Rank'
                    },
                    {
                        value: 'exact-aware-popularity-rank',
                        text: 'Best Sellers'
                    },
                    {
                        value: 'review-rank',
                        text: 'Top Rated (Avg Review Rank)'
                    },
                    {
                        value: 'review-count-rank',
                        text: 'Most Reviews Count Rank'
                    },
                    {
                        value: 'date-asc-rank',
                        text: 'Oldest First'
                    },
                    {
                        value: 'featured-rank',
                        text: 'Featured (featured-rank)'
                    },
                    {
                        value: 'most-wished-for-rank',
                        text: 'Most Wished For Rank'
                    },
                    {
                        value: 'custom',
                        text: 'NONE'
                    }
                ],
                // Departments and categories for IT
                categories: {
                    'fashion': {
                        displayName: 'Fashion',
                        categories: [
                            {value: '2892860031', text: 'Specific clothing'}
                            /*{value: '2892862031', text: 'Men'},
                            {value: '2892859031', text: 'Women'},
                            {value: '2892858031', text: 'Boys'},
                            {value: '2892857031', text: 'Girls'},*/
                        ]
                    },
                    'electronics': {
                        displayName: 'Electronics',
                        categories: []
                    },
                    'kitchen': {
                        displayName: 'Home & Kitchen',
                        categories: []
                    },
                    // 'stripbooks-intl-ship' MRB uses this IT
                    'stripbooks': {
                        displayName: 'Books (KDP)',
                        categories: [
                            {value: '508791031', text: 'Calendars & Agendas'},
                            {value: '508715031', text: 'Children Books'},
                            {value: '508821031', text: 'Hobbies & free time'}
                        ]
                    },
                    '': {
                        displayName: 'All (No Department)',
                        categories: []
                    }
                },
                // Brands to exclude for IT
                excludeBrands: '-Officially+-Licensed+-LyricLyfe+-Disney+-Marvel+-StarWars+-Mademark+-HarryPotter+-Pixar+-SANRIO+-EliteAuthentics+-Barbie+-BATMAN+-JeffDunham+-CJGrips+-BreakingT+-SpongebobSquarePants+-BallparkMVP+-DCComics+-LooneyTunes+-SUPERMARIO+-Pokemon+-STARTREK+-StrangerThings+-Fallout+-MTV+-Beetlejuice+-SouthPark+-HelloKitty+-Jeep+-GypsyQueen+-TheRollingStones+-NEWLINECINEMA+-SagittariusGallery+-ScoobyDoo+-OfficialHighSchoolFanGear+-PinkFloyd+-Nickelodeon+-CareBears+-Popfunk+-FanPrint+-WarnerBros+-WWE+-DrSeuss+-NBC+-CuriousGeorge+-MeanGirls+-CartoonNetwork+-SesameStreet+-Hasbro+-CocaCola+-RickMorty+-Nintendo+-DespicableMe+-JurassicPark+-TMNT+-MyLittlePony+-AmericanKennelClub+-AnnoyingOrange+-BeerNuts+-BillNye+-Booba+-Buckedup+-CarlyMartina+-ComradeDetective+-Daria+-DippinDots+-DramaLlama+-Dunkin+-HannahHart+-IMOMSOHARD+-ImpracticalJokers+-JaneAusten+-JaneGoodall+-JennMcAllister+-JoJoSiwa+-Kabillion+-LoveIsland+-LyricVerse+-ModPodge+-NashGrier+-NeildeGrasseTyson+-RickyDillon+-ROBLOX+-ShibSibs+-SpongeBob+-TheDailyWire+-TheGrandTour+-Oddbods+-TheYoungTurks+-TheSoul+-TwinPeaks+-UglyDolls+-Mandalorian+-SpaceJam+-Aerosmith+-Bengals+-Rebelde+-BreakingBad+-FooFighters+-BlackSabbath+-SelenaQuintanilla+-CampusLab+-RobZombie+-Misfits+-Mattel+-Sheeran+-Zelda+-Dunham+-Masha+-DreamWorks+-UniversalStudios+-Paramount+-20thCenturyStudios+-SonyPictures+-Lionsgate+-HBO+-AMC+-BBC+-Netflix+-Hulu+-PlayStation+-Xbox+-Fortnite+-LeagueofLegends+-Overwatch+-CallofDuty+-Minecraft+-EldenRing+-WorldofWarcraft+-TheSims+-AmongUs+-Tetris+-SEGA+-Atari+-Capcom+-Konami+-TheBeatles+-LedZeppelin+-ACDC+-Metallica+-Nirvana+-TaylorSwift+-BTS+-BLACKPINK+-Drake+-GameofThrones+-SquidGame+-PeakyBlinders+-Lego+-Barney+-ThomasandFriends+-PeppaPig+-Bluey+-FisherPrice+-Tonka+-PowerRangers+-Ford+-Chevrolet+-Toyota+-Honda+-Tesla+-BMW+-MercedesBenz+-HarleyDavidson+-Nike+-Adidas+-Puma+-LouisVuitton+-Chanel+-Balenciaga+-Vans+-Fila+-Pepsi+-MountainDew+-Sprite+-DrPepper+-Nestle+-Oreo+-Reeses+-Snickers+-TacoBell+-McDonalds+-KFC+-Starbucks+-NFL+-NBA+-MLB+-NHL+-NCAA+-FIFA+-UFC+-Google+-Facebook+-Instagram+-Snapchat+-YouTube+-Twitter+-TikTok+-Gucci+-Armani+-Versace+-DolceGabbana+-Valentino+-Fendi+-Bulgari+-Ferragamo+-SalvatoreFerragamo+-Benetton+-Prada+-Ferrari+-Lamborghini+-Maserati+-Fiat+-Iveco+-Barilla+-Lavazza+-Ferrero+-Pirelli+-Luxottica+-UniCredit+-IntesaSanpaolo+-TelecomItalia+-Mediaset+-BerlusconiMediaGroup+-JuventusFC+-ACMilan+-InterMilan+-SerieA+-LEGO+-Clementoni',
                // No Preset Defaults
                noPresetDefaults: {
                    productType: 'tshirt',
                    department: 'fashion',
                    sortOrder: 'featured',
                    category: ''
                },
                // Department Exclusive Settings (TimeFilters, Seller & Review Filters, sort Filters for IT
                departmentSettings: {
                    'electronics': {
                    timeFilters: {
                      '30days': 'p_n_date_first_available_absolute%3A490216031',
                      '90days': 'p_n_date_first_available_absolute%3A490217031'
                    },
                    reviewsFilter: 'p_72%3A490205031'
                  },
                    'kitchen': {
                    timeFilters: {
                      '30days': 'p_n_date_first_available_absolute%3A490216031',
                      '90days': 'p_n_date_first_available_absolute%3A490217031'
                    },
                    reviewsFilter: 'p_72%3A490205031'
                  },
                  'stripbooks': {
                    timeFilters: {
                      '30days': 'p_n_date%3A510380031',
                      '90days': 'p_n_date%3A510381031'
                    },
                    sellerFilter: 'p_6%3AA11IL2PNWYJU7H',
                    reviewsFilter: 'p_72%3A490205031',
                    sortOrders: [
                        {value: '', text: 'Default (None)'},
                        {value: 'featured', text: 'Featured'},
                        {value: 'exact-aware-popularity-rank', text: 'Best Sellers'},
                        {value: 'most-purchased-rank', text: 'Most Purchased Rank'},
                        {value: 'review-rank', text: 'Avg Review Rank'},
                        {value: 'review-count-rank', text: 'Most Reviews'},
                        {value: 'date-desc-rank', text: 'Publication Date'},
                        {value: 'salesrank', text: 'Sales Rank'}
                    ]
                  }
                },
                // Department to Product mappings for IT
                productTypeToDepartment: {
                'KDP': 'stripbooks',
                /*'tshirt': {department: 'fashion', category: '1731104031'},*/
                'tshirt': 'fashion',
                'tanktop': 'fashion',
                'longsleeve': 'fashion',
                'raglan': 'fashion',
                'sweatshirt': 'fashion',
                'hoodie': 'fashion',
                'ziphoodie': 'fashion',
                'popsocket': 'electronics',
                'case': 'electronics'
                },
                departmentToProductType: {
                    'stripbooks': 'KDP'
                }
            },
            'es': { // ES
                timeFilters: {
                    //'7days': 'p_n_date_first_available_absolute%3A13827712031',
                    '30days': 'p_n_date_first_available_absolute%3A13827713031',
                    '90days': 'p_n_date_first_available_absolute%3A13827714031'
                },
                sellerFilter: 'p_6%3AA1AT7YVPFBWXBL',
                reviewsFilter: 'p_72%3A831280031',
                // Product type keywords specific to ES
                productTypeKeywords: {
                    'tshirt': 'Ligero, Encaje clasico, Manga de doble puntada y bastilla baja+-Larga+-Raglan+-Cuello-V+-sin',
                    'tanktop': '"sin Mangas"+Ligero, Encaje clasico, Manga de doble puntada y bastilla baja+-Larga+-Raglan+-Cuello-V',
                    'longsleeve': '"Manga Larga"+Ligero, Encaje clasico, Manga de doble puntada y bastilla baja+-Raglan+-Cuello+-Sudadera+-sin',
                    'raglan': '"raglan"+Ligero, Encaje clasico, manga de doble puntada y bastilla baja+-Cuello+-sin',
                    'sweatshirt': '"Sudadera"+241 gr, Encaje clasico, Cinta de sarga en el cuello+-Raglan+-Mangas+-Capucha', // '"sweatshirt"+8.5 oz, classic cut+-Raglan+-Vneck+-Tanktop+-hoodie',
                    'hoodie': '"Capucha"+241 gr, Encaje clasico, Cinta de sarga en el cuello+-Raglan+-Mangas+-cremallera',
                    'ziphoodie': '"Capucha"+"cremallera"+241 gr, Encaje clasico, Cinta de sarga en el cuello+-Raglan+-Mangas',
                    'popsocket': '"Popsocket"+El respaldo adhesivo fija el PopGrip a tu funda o dispositivo. No se adhiere a fundas de silicona, cuero, impermeables o con mucha textura. Funciona mejor con fundas lisas, duras y de plástico.',
                    'case': '"Carcasa"+Funda+protectora+de+dos+piezas+fabricada+con+una+carcasa+de+policarbonato+de+primera+calidad+resistente+a+los+arañazos+y+un+revestimiento+de+TPU+amortiguador+que+protege+contra+las+caídas+"Merch+por+Amazon"',
                    'KDP': '"independently+published"'
                },
                // Sort orders for ES
                sortOrders: [{
                        value: 'featured',
                        text: 'Featured'
                    },
                    {
                        value: 'date-desc-rank',
                        text: 'Newest Arrivals'
                    },
                    {
                        value: 'most-purchased-rank',
                        text: 'Most Purchased Rank'
                    },
                    {
                        value: 'exact-aware-popularity-rank',
                        text: 'Best Sellers'
                    },
                    {
                        value: 'review-rank',
                        text: 'Top Rated (Avg Review Rank)'
                    },
                    {
                        value: 'review-count-rank',
                        text: 'Most Reviews Count Rank'
                    },
                    {
                        value: 'date-asc-rank',
                        text: 'Oldest First'
                    },
                    {
                        value: 'featured-rank',
                        text: 'Featured (featured-rank)'
                    },
                    {
                        value: 'most-wished-for-rank',
                        text: 'Most Wished For Rank'
                    },
                    {
                        value: 'custom',
                        text: 'NONE'
                    }
                ],
                // Departments and categories for ES
                categories: {
                    'fashion': {
                        displayName: 'Fashion',
                        categories: [
                            {value: '3074031031', text: 'Specialized Clothing'}
                            /*{value: '3074027031', text: 'Men\'s Clothing'},
                            {value: '3074028031', text: 'Women\'s Clothing'},
                            {value: '3074030031', text: 'Boys\' Clothing'},
                            {value: '3074029031', text: 'Girls\' Clothing'},*/
                        ]
                    },
                    'electronics': {
                        displayName: 'Electronics & Photo',
                        categories: []
                    },
                    'kitchen': {
                        displayName: 'Home & Kitchen',
                        categories: []
                    },
                    // 'stripbooks-intl-ship' MRB uses this ES
                    'stripbooks': {
                        displayName: 'Books (KDP)',
                        categories: [
                            {value: '902502031', text: 'Calendars'},
                            {value: '902621031', text: 'Children\'s Books'},
                            {value: '902610031', text: 'Home & Garden'}
                        ]
                    },
                    '': {
                        displayName: 'All (No Department)',
                        categories: []
                    }
                },
                // Brands to exclude for ES
                excludeBrands: '-Officially+-Licensed+-LyricLyfe+-Disney+-Marvel+-StarWars+-Mademark+-HarryPotter+-Pixar+-SANRIO+-EliteAuthentics+-Barbie+-BATMAN+-JeffDunham+-CJGrips+-BreakingT+-SpongebobSquarePants+-BallparkMVP+-DCComics+-LooneyTunes+-SUPERMARIO+-Pokemon+-STARTREK+-StrangerThings+-Fallout+-MTV+-Beetlejuice+-SouthPark+-HelloKitty+-Jeep+-GypsyQueen+-TheRollingStones+-NEWLINECINEMA+-SagittariusGallery+-ScoobyDoo+-OfficialHighSchoolFanGear+-PinkFloyd+-Nickelodeon+-CareBears+-Popfunk+-FanPrint+-WarnerBros+-WWE+-DrSeuss+-NBC+-CuriousGeorge+-MeanGirls+-CartoonNetwork+-SesameStreet+-Hasbro+-CocaCola+-RickMorty+-Nintendo+-DespicableMe+-JurassicPark+-TMNT+-MyLittlePony+-AmericanKennelClub+-AnnoyingOrange+-BeerNuts+-BillNye+-Booba+-Buckedup+-CarlyMartina+-ComradeDetective+-Daria+-DippinDots+-DramaLlama+-Dunkin+-HannahHart+-IMOMSOHARD+-ImpracticalJokers+-JaneAusten+-JaneGoodall+-JennMcAllister+-JoJoSiwa+-Kabillion+-LoveIsland+-LyricVerse+-ModPodge+-NashGrier+-NeildeGrasseTyson+-RickyDillon+-ROBLOX+-ShibSibs+-SpongeBob+-TheDailyWire+-TheGrandTour+-Oddbods+-TheYoungTurks+-TheSoul+-TwinPeaks+-UglyDolls+-Mandalorian+-SpaceJam+-Aerosmith+-Bengals+-Rebelde+-BreakingBad+-FooFighters+-BlackSabbath+-SelenaQuintanilla+-CampusLab+-RobZombie+-Misfits+-Mattel+-Sheeran+-Zelda+-Dunham+-Masha+-DreamWorks+-UniversalStudios+-Paramount+-20thCenturyStudios+-SonyPictures+-Lionsgate+-HBO+-AMC+-BBC+-Netflix+-Hulu+-PlayStation+-Xbox+-Fortnite+-LeagueofLegends+-Overwatch+-CallofDuty+-Minecraft+-EldenRing+-WorldofWarcraft+-TheSims+-AmongUs+-Tetris+-SEGA+-Atari+-Capcom+-Konami+-TheBeatles+-LedZeppelin+-ACDC+-Metallica+-Nirvana+-TaylorSwift+-BTS+-BLACKPINK+-Drake+-GameofThrones+-SquidGame+-PeakyBlinders+-Lego+-Barney+-ThomasandFriends+-PeppaPig+-Bluey+-FisherPrice+-Tonka+-PowerRangers+-Ford+-Chevrolet+-Toyota+-Honda+-Tesla+-BMW+-MercedesBenz+-HarleyDavidson+-Nike+-Adidas+-Puma+-Gucci+-LouisVuitton+-Chanel+-Balenciaga+-Vans+-Fila+-Pepsi+-MountainDew+-Sprite+-DrPepper+-Nestle+-Oreo+-Reeses+-Snickers+-TacoBell+-McDonalds+-KFC+-Starbucks+-NFL+-NBA+-MLB+-NHL+-NCAA+-FIFA+-UFC+-Google+-Facebook+-Instagram+-Snapchat+-YouTube+-Twitter+-TikTok+-Zara+-Inditex+-MassimoDutti+-Bershka+-Stradivarius+-Desigual+-CustoBarcelona+-Santander+-BBVA+-CaixaBank+-BancoSabadell+-Bankia+-Iberdrola+-Repsol+-Endesa+-Telefonica+-Movistar+-VodafoneES+-OrangeES+-Iberia+-Vueling+-Renfe+-Mercadona+-DiaES+-ElCorteIngles+-Mahou+-EstrellaDamm+-FCBarcelona+-RealMadrid+-LaLiga+-LEGO',
                // No Preset Defaults
                noPresetDefaults: {
                    productType: 'tshirt',
                    department: 'fashion',
                    sortOrder: 'featured',
                    category: ''
                },
                // Department Exclusive Settings (TimeFilters, Seller & Review Filters, sort Filters for ES
                departmentSettings: {
                    'electronics': {
                    timeFilters: {
                      '30days': 'p_n_date_first_available_absolute%3A831288031',
                      '90days': 'p_n_date_first_available_absolute%3A831289031'
                    },
                    reviewsFilter: 'p_72%3A831280031'
                  },
                    'kitchen': {
                    timeFilters: {
                      '30days': 'p_n_date_first_available_absolute%3A831288031',
                      '90days': 'p_n_date_first_available_absolute%3A831289031'
                    },
                    reviewsFilter: 'p_72%3A831280031'
                  },
                  'stripbooks': {
                    timeFilters: {
                      '30days': 'p_n_date_first_available_absolute%3A831288031',
                      '90days': 'p_n_date_first_available_absolute%3A831289031'
                    },
                    sellerFilter: 'p_6%3AA1AT7YVPFBWXBL',
                    reviewsFilter: 'p_72%3A831280031',
                    sortOrders: [
                        {value: '', text: 'Default (None)'},
                        {value: 'featured', text: 'Featured'},
                        {value: 'exact-aware-popularity-rank', text: 'Best Sellers'},
                        {value: 'most-purchased-rank', text: 'Most Purchased Rank'},
                        {value: 'review-rank', text: 'Avg Review Rank'},
                        {value: 'review-count-rank', text: 'Most Reviews'},
                        {value: 'date-desc-rank', text: 'Publication Date'},
                        {value: 'salesrank', text: 'Sales Rank'}
                    ]
                  }
                },
                // Department to Product mappings for ES
                productTypeToDepartment: {
                'KDP': 'stripbooks',
                /*'tshirt': {department: 'fashion', category: '1731104031'},*/
                'tshirt': 'fashion',
                'tanktop': 'fashion',
                'longsleeve': 'fashion',
                'raglan': 'fashion',
                'sweatshirt': 'fashion',
                'hoodie': 'fashion',
                'ziphoodie': 'fashion',
                'popsocket': 'electronics',
                'case': 'electronics'
                },
                departmentToProductType: {
                    'stripbooks': 'KDP'
                }
            }
            /*'co.jp': { // JP
                timeFilters: {
                    //'7days': 'p_n_date_first_available_absolute%3A2228610051',
                    '30days': 'p_n_date_first_available_absolute%3A5340692051',
                    //'60days': 'p_n_date_first_available_absolute%3A5340693051',
                    '90days': 'p_n_date_first_available_absolute%3A5340693051'
                },
                sellerFilter: 'p_6%3AAN1VRQENFRJN5',
                reviewsFilter: 'p_72%3A2250897051',
                // Product type keywords specific to JP
                productTypeKeywords: {
                    'tshirt': 'Tシャツ+-Longsleeve+-Raglan+-Vneck+-Tanktop',
                    'tanktop': '"tank+top"+Lightweight,+classic+cut+tank+top,+double+stitched+sleeves+and+hem+-Longsleeve+-Raglan+-V-neck',
                    'longsleeve': '"Long+sleeve"+Classic+cut,+double+stitched+hem+-Raglan+-Vneck+-sweatshirt+-tanktop',
                    'raglan': '"raglan"+leichter, klassischer Schnitt, doppelt genähte Ärmel und Saumabschluss+-Longsleeve+-Vneck+-Tanktop',
                    'sweatshirt': '"sweatshirt"+8.5 oz, Klassisch geschnitten+-Raglan+-Vneck+-Tanktop+-hoodie', // '"sweatshirt"+8.5 oz, classic cut+-Raglan+-Vneck+-Tanktop+-hoodie',
                    'hoodie': '"pullover+hoodie"+8.5 oz, Klassisch geschnitten, doppelt genähter Saum+-Raglan+-Vneck+-Tanktop+-zip',
                    'ziphoodie': '"Kapuzenjacke"+241gr leichter, klassischer Schnitt; verstärkter Nacken+-Raglan+-Vneck+-Tanktop',
                    'popsocket': '"Popsocket"+Advanced adhesive allows for easy removal and reapplication to a different position on most phones and phone cases.',
                    'case': 'case merch von amazon',// '"case"+Die zweiteilige Schutzhülle aus einer hochwertigen, kratzfesten Polycarbonatschale und einer stoßdämpfenden TPU-Auskleidung schützt vor Stürzen+"Merch von Amazon"', // '"case"+"The two-piece protective case made from a high quality scratch resistant polycarbonate shell and shock absorbing TPU liner protects against drops"+"Merch von Amazon"',
                    'KDP': '"independently+published"'
                },
                // Sort orders for JP
                sortOrders: [{
                        value: 'featured',
                        text: 'Featured'
                    },
                    {
                        value: 'date-desc-rank',
                        text: 'Newest Arrivals'
                    },
                    {
                        value: 'most-purchased-rank',
                        text: 'Most Purchased Rank'
                    },
                    {
                        value: 'exact-aware-popularity-rank',
                        text: 'Best Sellers'
                    },
                    {
                        value: 'review-rank',
                        text: 'Top Rated (Avg Review Rank)'
                    },
                    {
                        value: 'review-count-rank',
                        text: 'Most Reviews Count Rank'
                    },
                    {
                        value: 'date-asc-rank',
                        text: 'Oldest First'
                    },
                    {
                        value: 'featured-rank',
                        text: 'Featured (featured-rank)'
                    },
                    {
                        value: 'most-wished-for-rank',
                        text: 'Most Wished For Rank'
                    },
                    {
                        value: 'custom',
                        text: 'NONE'
                    }
                ],
                // Departments and categories for JP
                categories: {
                    'fashion': {
                        displayName: 'Fashion',
                        categories: [
                            {value: '2229202051%2Cn%3A2230005051%2Cn%3A2131417051%2Cn%3A5347828051%2Cn%3A2131436051', text: 'T-shirts'},
                            {value: '1981473031', text: 'Novelty'},
                            //{value: '1730929031', text: 'Men\'s Clothing'},
                            //{value: '1731296031', text: 'Women\'s Clothing'},
                            //{value: '1730756031', text: 'Boys\' Clothing'},
                            //{value: '1730841031', text: 'Girls\' Clothing'},
                            {value: '1981410031', text: 'Novelty & Special Use'}
                        ]
                    },
                    'electronics': {
                        displayName: 'Electronics & Photo',
                        categories: []
                    },
                    'kitchen': {
                        displayName: 'Home & Kitchen',
                        categories: []
                    },
                    // 'stripbooks-intl-ship' MRB uses this JP
                    'stripbooks': {
                        displayName: 'Books (KDP)',
                        categories: [
                            {value: '507848', text: 'Calendars'},
                            {value: '69', text: 'Children\'s Books'},
                            {value: '64', text: 'Home & Garden'}
                        ]
                    },
                    '': {
                        displayName: 'All (No Department)',
                        categories: []
                    }
                },
                // Brands to exclude for JP
                excludeBrands: '-Officially+-Licensed+-LyricLyfe+-Disney+-Marvel+-StarWars+-Mademark+-HarryPotter+-Pixar+-SANRIO+-EliteAuthentics+-Barbie+-BATMAN+-JeffDunham+-CJGrips+-BreakingT+-SpongebobSquarePants+-BallparkMVP+-DCComics+-LooneyTunes+-SUPERMARIO+-Pokemon+-STARTREK+-StrangerThings+-Fallout+-MTV+-Beetlejuice+-SouthPark+-HelloKitty+-Jeep+-GypsyQueen+-TheRollingStones+-NEWLINECINEMA+-SagittariusGallery+-ScoobyDoo+-OfficialHighSchoolFanGear+-PinkFloyd+-Nickelodeon+-CareBears+-Popfunk+-FanPrint+-WarnerBros+-WWE+-DrSeuss+-NBC+-CuriousGeorge+-MeanGirls+-CartoonNetwork+-SesameStreet+-Hasbro+-CocaCola+-RickMorty+-Nintendo+-DespicableMe+-JurassicPark+-TMNT+-MyLittlePony+-AmericanKennelClub+-AnnoyingOrange+-BeerNuts+-BillNye+-Booba+-Buckedup+-CarlyMartina+-ComradeDetective+-Daria+-DippinDots+-DramaLlama+-Dunkin+-HannahHart+-IMOMSOHARD+-ImpracticalJokers+-JaneAusten+-JaneGoodall+-JennMcAllister+-JoJoSiwa+-Kabillion+-LoveIsland+-LyricVerse+-ModPodge+-NashGrier+-NeildeGrasseTyson+-RickyDillon+-ROBLOX+-ShibSibs+-SpongeBob+-TheDailyWire+-TheGrandTour+-Oddbods+-TheYoungTurks+-TheSoul+-TwinPeaks+-UglyDolls+-Mandalorian+-SpaceJam+-Aerosmith+-Bengals+-Rebelde+-BreakingBad+-FooFighters+-BlackSabbath+-SelenaQuintanilla+-CampusLab+-RobZombie+-Misfits+-Mattel+-Sheeran+-Zelda+-Dunham+-Masha',
                // Department Exclusive Settings (TimeFilters, Seller & Review Filters, sort Filters for JP
                departmentSettings: {
                  'stripbooks': {
                    timeFilters: {
                      '30days': 'p_n_publication_date%3A1778535031',
                      '90days': 'p_n_publication_date%3A1778536031'
                    },
                    sellerFilter: ' ',
                    reviewsFilter: 'p_72%3A184738031',
                    sortOrders: [
                        {value: '', text: 'Default (None)'},
                        {value: 'featured', text: 'Featured'},
                        {value: 'exact-aware-popularity-rank', text: 'Best Sellers'},
                        {value: 'most-purchased-rank', text: 'Most Purchased Rank'},
                        {value: 'review-rank', text: 'Avg Review Rank'},
                        {value: 'review-count-rank', text: 'Most Reviews'},
                        {value: 'date-desc-rank', text: 'Publication Date'},
                        {value: 'salesrank', text: 'Sales Rank'}
                    ]
                  }
                },
                // Department to Product mappings for JP
                productTypeToDepartment: {
                'KDP': 'stripbooks',
                //'tshirt': {department: 'fashion', category: '1731104031'},
                'tshirt': {department: 'fashion', category: '2229202051%2Cn%3A2230005051%2Cn%3A2131417051%2Cn%3A5347828051%2Cn%3A2131436051'},
                'tanktop': 'fashion',
                'longsleeve': 'fashion',
                'raglan': 'fashion',
                'sweatshirt': 'fashion',
                'hoodie': 'fashion',
                'ziphoodie': 'fashion',
                'popsocket': 'electronics',
                'case': 'electronics'
                },
                departmentToProductType: {
                    'stripbooks': 'KDP'
                }
                // OLD ONE productTypeMappings: {
                //    'stripbooks': 'KDP'
                // }
            }*/
    };

    function applyPresetKeywordOverrides(presetSettings, selectedProductType) {
        const searchInputElem = document.getElementById('searchInput');
        const customHiddenInputElem = document.getElementById('customHiddenKeywords');

        // Define base keywords from the main preset settings
        const baseSearchKeywords = presetSettings.searchKeywords || '';
        const baseCustomHiddenKeywords = presetSettings.customHiddenKeywords || '';

        let finalSearchKeywords = baseSearchKeywords;
        let finalCustomHiddenKeywords = baseCustomHiddenKeywords;

        // Check for overrides
        const overrides = presetSettings.productTypeOverrides;
        if (overrides && overrides[selectedProductType]) {
            const typeOverride = overrides[selectedProductType];
            // Use override value if it exists, otherwise fall back to base
            finalSearchKeywords = typeOverride.searchKeywords !== undefined ? typeOverride.searchKeywords : baseSearchKeywords;
            finalCustomHiddenKeywords = typeOverride.customHiddenKeywords !== undefined ? typeOverride.customHiddenKeywords : baseCustomHiddenKeywords;
        }

        searchInputElem.value = finalSearchKeywords;
        customHiddenInputElem.value = finalCustomHiddenKeywords;

        setTimeout(() => {
            searchInputElem.dispatchEvent(new Event('input'));
        }, 0);
    }

    // Update time filter radio values based on marketplace
    function updateMarketplaceFilters() {
      const marketplace = marketplaceSelect.value;
      const department = departmentSelect.value;
      const config = marketplaceConfig[marketplace] || marketplaceConfig.com;
      // Get department-specific config if available
      const deptConfig = (department && config.departmentSettings && config.departmentSettings[department]) 
        ? config.departmentSettings[department] 
        : null;
      // Update time filters
      document.getElementById('timeFilter30Days').value = deptConfig?.timeFilters?.['30days'] || config.timeFilters['30days'];
      document.getElementById('timeFilter90Days').value = deptConfig?.timeFilters?.['90days'] || config.timeFilters['90days'];
      // Update seller filter
      document.getElementById('sellerAmazon').value = deptConfig?.sellerFilter || config.sellerFilter;
      // Update reviews filter
      document.getElementById('reviewsFilter').value = deptConfig?.reviewsFilter || config.reviewsFilter;
      // Update sort options, category and excluding brand options
      updateExcludeBrandsFilter();
      updateSortOrderOptions();
      updateCategoryOptions();
    }
    
    function updateSortOrderOptions() {
        const marketplace = marketplaceSelect.value;
        const department = departmentSelect.value;
        const config = marketplaceConfig[marketplace] || marketplaceConfig.com;
        const sortOrderSelect = document.getElementById('sortOrder');
        // console.log("[updateSortOrderOptions] Called. Dept:", department);

        // Determine the list of sort options to populate based on current marketplace and department
        const sortOptionsToShow = (department && config.departmentSettings?.[department]?.sortOrders)
            ? config.departmentSettings[department].sortOrders
            : config.sortOrders;

        if (!sortOptionsToShow || sortOptionsToShow.length === 0) {
            // console.warn("[updateSortOrderOptions] No sort options found for current config.");
            sortOrderSelect.innerHTML = '<option value="custom">NONE</option>'; // Fallback
            sortOrderSelect.value = 'custom';
            return;
        }
        
        // Store the PRESET'S desired sort order, if a preset is active
        const activePresetValue = document.getElementById('presetsSelect').value;
        let presetIntendedSortOrder = null;

        if (activePresetValue) {
            const presets = presetConfigs[marketplace] || presetConfigs.com;
            const activePreset = presets.find(p => p.value === activePresetValue);
            if (activePreset && activePreset.settings && activePreset.settings.sortOrder !== undefined) {
                presetIntendedSortOrder = activePreset.settings.sortOrder;
                // console.log("[updateSortOrderOptions] Active preset wants sortOrder:", presetIntendedSortOrder);
            }
        }

        // Populate the dropdown
        const previousSortValue = sortOrderSelect.value;
        sortOrderSelect.innerHTML = '';
        sortOptionsToShow.forEach(option => {
            const optionEl = document.createElement('option');
            optionEl.value = option.value;
            optionEl.textContent = option.text;
            sortOrderSelect.appendChild(optionEl);
        });
        // console.log("[updateSortOrderOptions] Dropdown populated with:", sortOptionsToShow.map(o => o.value));

        if (presetIntendedSortOrder !== null && sortOptionsToShow.some(opt => opt.value === presetIntendedSortOrder)) {
            // If a preset is active AND its intended sort order is valid in the current list, use it.
            sortOrderSelect.value = presetIntendedSortOrder;
            // console.log("[updateSortOrderOptions] Setting sort to PRESET'S value:", presetIntendedSortOrder);
        } else if (!activePresetValue && sortOptionsToShow.some(opt => opt.value === previousSortValue)) {
            // NO preset active, try to preserve user's previous selection if still valid in the new list
            sortOrderSelect.value = previousSortValue;
            // console.log("[updateSortOrderOptions] No preset. Preserving previous valid sort:", previousSortValue);
        } else {
            // Otherwise (no preset and previous invalid, OR preset's sort order invalid for current options), default to the first option.
            if (sortOptionsToShow.length > 0) {
                sortOrderSelect.value = sortOptionsToShow[0].value;
                // console.log("[updateSortOrderOptions] Setting sort to DEFAULT (first option):", sortOptionsToShow[0].value);
            }
        }
        // console.log("[updateSortOrderOptions] Final sortOrder value:", sortOrderSelect.value);
    }

    function updateDepartmentFromProductType() {
        const productType = productTypeSelect.value;
        const marketplace = marketplaceSelect.value;
        const config = marketplaceConfig[marketplace] || marketplaceConfig.com;
        
        if (config.productTypeToDepartment && config.productTypeToDepartment[productType]) {
            const mapping = config.productTypeToDepartment[productType];
            
            if (typeof mapping === 'string') {
                // Old format - just the department
                if (config.categories && config.categories[mapping]) {
                    departmentSelect.value = mapping;
                    updateCategoryOptions();
                    updateGeneratedUrl();
                    updateMarketplaceFilters();
                }
            } else if (typeof mapping === 'object' && mapping.department) {
                // New format - object with department and category
                if (config.categories && config.categories[mapping.department]) {
                    departmentSelect.value = mapping.department;
                    updateCategoryOptions();
                    
                    // Wait for category options to be populated before setting the category
                    setTimeout(() => {
                        if (mapping.category && categorySelect.querySelector(`option[value="${mapping.category}"]`)) {
                            categorySelect.value = mapping.category;
                        }
                        updateGeneratedUrl();
                    }, 50);
                    
                    updateMarketplaceFilters();
                }
            }
        }
    }


    // Replace departmentToProductType with marketplace-based handling
    function updateProductTypeFromDepartment() {
        const department = departmentSelect.value;
        const marketplace = marketplaceSelect.value;
        const config = marketplaceConfig[marketplace] || marketplaceConfig.com;
        
        // First try to use the product type mappings defined in the marketplace config
        if (config.productTypeMappings && department in config.productTypeMappings) {
            const suggestedProductType = config.productTypeMappings[department];
            if (productTypeSelect.querySelector(`option[value="${suggestedProductType}"]`)) {
                productTypeSelect.value = suggestedProductType;
                updateProductTypeSettings();
                updateGeneratedUrl();
                return;
            }
        }
        
        // Then try the marketplace-specific department to product type mapping
        if (config.departmentToProductType && config.departmentToProductType[department]) {
            const fallbackType = config.departmentToProductType[department];
            if (productTypeSelect.querySelector(`option[value="${fallbackType}"]`)) {
                productTypeSelect.value = fallbackType;
                updateProductTypeSettings();
                updateGeneratedUrl();
            }
        }
    }

    function setupClearSearchButton() {
        const searchInput = document.getElementById('searchInput');
        const clearSearchBtn = document.getElementById('clearSearchBtn');
        
        // Show/hide clear button based on input content
        searchInput.addEventListener('input', function() {
            if (this.value.length > 0) {
                clearSearchBtn.style.display = 'block';
            } else {
                clearSearchBtn.style.display = 'none';
            }
        });
                
        // Clear the input when X is clicked
        clearSearchBtn.addEventListener('click', function() {
            searchInput.value = '';
            this.style.display = 'none';
            searchInput.focus();
            updateGeneratedUrl(); // Update the generated URL after clearing
        });
    }   

    // Ensure the result URL container is visible
    resultUrlContainer.style.display = 'block';

    // Generate initial URL
    updateGeneratedUrl();

    // Initialize the UI
    init();

    function init() {
        // Populate departments first
        populateDepartments();

        // Populate Product Types
        populateProductTypes();

        // Update ZIP code display
        updateZipCode();

        // Update marketplace-specific filters
        updateMarketplaceFilters();

        // Update sort order options
        updateSortOrderOptions();

        // Update Presets Dropdown
        updatePresetsDropdown();

        // Set up event listeners
        setupEventListeners();

        // Search Form Clear Button
        setupClearSearchButton();

        // Set up department/category box visibility and state
        updateDepartmentCategoryState();

        // Set up price input constraints
        setupPriceInputs();

        // Generate and display the initial URL
        updateGeneratedUrl();

        // Make sure the URL container is visible by default
        resultUrlContainer.style.display = 'block';
    }
    
    // Function to update the generated URL display
    function updateGeneratedUrl() {
        const amazonUrl = generateAmazonUrl();
        generatedUrlEl.textContent = amazonUrl;
    }

    function setupEventListeners() {
        searchForm.addEventListener('submit', handleFormSubmit);
        searchForm.addEventListener('reset', function() {
        document.getElementById('clearSearchBtn').style.display = 'none';
        updateGeneratedUrl();
        });
        copyUrlBtn.addEventListener('click', handleCopyUrl);
        copyZipBtn.addEventListener('click', handleCopyZip);
        document.getElementById('searchInput').addEventListener('input', updateGeneratedUrl);
        document.getElementById('customHiddenKeywords').addEventListener('input', updateGeneratedUrl);
        document.getElementById('minPrice').addEventListener('input', updateGeneratedUrl);
        document.getElementById('maxPrice').addEventListener('input', updateGeneratedUrl);

        marketplaceSelect.addEventListener('change', function() {
            // console.log("[Marketplace Change] Changed to:", this.value);
            const presetsSelect = document.getElementById('presetsSelect');
            presetsSelect.value = ''; // Clear preset selection
            // console.log("[Marketplace Change] Preset selection cleared.");
            updateZipCode();
            populateProductTypes();
            populateDepartments();
            updatePresetsDropdown();
            // console.log("[Marketplace Change] Calling applyPreset() to establish default state for new marketplace.");
            applyPreset();
        });
        
        productTypeSelect.addEventListener('change', function() {
            const activePresetValue = document.getElementById('presetsSelect').value;
            if (activePresetValue) {
                const currentMarketplace = marketplaceSelect.value;
                const currentPresets = presetConfigs[currentMarketplace] || presetConfigs.com;
                const activePreset = currentPresets.find(p => p.value === activePresetValue);
                if (activePreset && activePreset.settings) {
                    applyPresetKeywordOverrides(activePreset.settings, this.value);
                }
            }
            updateProductTypeSettings(); 
            updateDepartmentFromProductType();
            updateDepartmentCategoryState();
            updateGeneratedUrl();
        });

        departmentSelect.addEventListener('change', function() {
            updateCategoryOptions();
            updateMarketplaceFilters(); 
            updateProductTypeFromDepartment();
            updateGeneratedUrl();
        });

        categorySelect.addEventListener('change', updateGeneratedUrl);
        document.getElementById('sortOrder').addEventListener('change', updateGeneratedUrl);
        
        const timeFilters = document.querySelectorAll('input[name="timeFilter"]');
        timeFilters.forEach(radio => {
            radio.addEventListener('click', updateGeneratedUrl);
        });

        function applyPreset() {
            const selectedPresetValue = document.getElementById('presetsSelect').value;
            // console.log("--- [applyPreset CALLED] --- Selected Preset Value:", selectedPresetValue);

            const marketplace = marketplaceSelect.value;
            const presets = presetConfigs[marketplace] || presetConfigs.com;
            const marketplaceSpecificConfig = marketplaceConfig[marketplace] || marketplaceConfig.com;
            const searchInputElem = document.getElementById('searchInput');
            const customHiddenInputElem = document.getElementById('customHiddenKeywords');
            const availableProductTypes = productTypeAvailability[marketplace] || productTypeAvailability.com;
            const sortOrderDropdown = document.getElementById('sortOrder');

            // 1. General Reset of all fields to absolute neutral/first values
            document.getElementById('timeFilterNone').checked = true;
            document.getElementById('sellerAmazon').checked = true;
            document.getElementById('reviewsFilter').checked = false;
            document.getElementById('filterExcludeBrands').checked = false;
            document.getElementById('minPrice').value = '';
            document.getElementById('maxPrice').value = '';
            // Initial sort order will be set by updateSortOrderOptions via department change during reset or preset application
            productTypeSelect.value = availableProductTypes.length > 0 ? availableProductTypes[0] : 'custom';
            departmentSelect.value = '';
            categorySelect.innerHTML = '<option value="">No Category Filter</option>';
            categorySelect.disabled = true;
            searchInputElem.value = '';
            customHiddenInputElem.value = '';
            searchInputElem.dispatchEvent(new Event('input'));

            // 2. Handle "No Preset" selection (apply marketplace-specific defaults)
            if (!selectedPresetValue) {
                // console.log("[applyPreset] 'No Preset' selected. Applying marketplace defaults.");
                const defaults = marketplaceSpecificConfig.noPresetDefaults || {
                    productType: availableProductTypes.length > 0 ? availableProductTypes[0] : 'custom',
                    department: '',
                    sortOrder: marketplaceSpecificConfig.sortOrders[0]?.value || 'custom',
                    category: ''
                };
                // console.log("[applyPreset] 'No Preset' - Using defaults:", defaults);

                if (availableProductTypes.includes(defaults.productType)) {
                    productTypeSelect.value = defaults.productType;
                } else {
                    productTypeSelect.value = availableProductTypes.length > 0 ? availableProductTypes[0] : 'custom';
                    // console.warn(`Default productType "${defaults.productType}" not in available types for ${marketplace}. Using first available.`);
                }
                // console.log("[applyPreset] 'No Preset' - ProductType set to:", productTypeSelect.value);

                departmentSelect.value = defaults.department;
                // console.log("[applyPreset] 'No Preset' - Setting Department to:", departmentSelect.value, "and dispatching change.");
                departmentSelect.dispatchEvent(new Event('change')); // Triggers category/sort updates via updateSortOrderOptions

                setTimeout(() => {
                    // console.log("[applyPreset] 'No Preset' - setTimeout after department change.");
                    if (defaults.category && categorySelect.querySelector(`option[value="${defaults.category}"]`)) {
                        categorySelect.value = defaults.category;
                        // console.log("[applyPreset] 'No Preset' - Category explicitly set to default:", defaults.category);
                    } else if (defaults.category) {
                        // console.warn(`[applyPreset] 'No Preset' - Default category "${defaults.category}" not found.`);
                        categorySelect.value = "";
                    } else {
                        categorySelect.value = "";
                    }
                    updateDepartmentCategoryState();

                    if (defaults.sortOrder && sortOrderDropdown.querySelector(`option[value="${defaults.sortOrder}"]`)) {
                        sortOrderDropdown.value = defaults.sortOrder;
                        // console.log("[applyPreset] 'No Preset' - Sort order explicitly set to default from noPresetDefaults:", defaults.sortOrder);
                    } else if (defaults.sortOrder) {
                        // console.warn(`[applyPreset] 'No Preset' - Default sortOrder "${defaults.sortOrder}" not found. Current: ${sortOrderDropdown.value}`);
                    } else {
                        // console.log(`[applyPreset] 'No Preset' - Sort order at default for department: ${sortOrderDropdown.value}`);
                    }
                    
                    // console.log("[applyPreset] 'No Preset' - Dispatching change on productTypeSelect.");
                    productTypeSelect.dispatchEvent(new Event('change'));
                    setTimeout(updateGeneratedUrl, 50);
                }, 200);
                return;
            }

            // 3. Find and apply the selected preset
            const preset = presets.find(p => p.value === selectedPresetValue);
            if (preset && preset.settings) {
                const settings = preset.settings;
                // console.log("[applyPreset] Applying preset:", selectedPresetValue, "with settings (raw):", settings); // Raw log

                if (settings.timeFilter) document.getElementById(settings.timeFilter).checked = true;
                document.getElementById('reviewsFilter').checked = !!settings.reviewsFilter;
                document.getElementById('filterExcludeBrands').checked = !!settings.excludeBrands;
                document.getElementById('minPrice').value = settings.minPrice || '';
                document.getElementById('maxPrice').value = settings.maxPrice || '';

                let presetProductType = productTypeSelect.value;
                if (settings.productType !== undefined && availableProductTypes.includes(settings.productType)) {
                    presetProductType = settings.productType;
                }
                productTypeSelect.value = presetProductType;
                // console.log("[applyPreset] Preset - ProductType value tentatively set to:", presetProductType);

                const presetDepartment = settings.department !== undefined ? settings.department : '';
                // console.log("[applyPreset] Preset - Setting Department to:", presetDepartment);
                departmentSelect.value = presetDepartment;
                departmentSelect.dispatchEvent(new Event('change'));

                setTimeout(() => {
                    // console.log("[applyPreset - setTimeout for preset] Applying category, and keywords. Sort should be set by dept. change.");

                    if (settings.category !== undefined) {
                        if (categorySelect.querySelector(`option[value="${settings.category}"]`)) {
                            categorySelect.value = settings.category;
                            // console.log("[applyPreset - setTimeout for preset] Category set to:", settings.category);
                        } else {
                            // console.warn("[applyPreset - setTimeout for preset] Category option not found:", settings.category);
                            categorySelect.value = "";
                        }
                    }
                    
                    // Log the intended sort order from preset vs actual, now that updateSortOrderOptions has run
                    if (settings.sortOrder !== undefined) {
                        // console.log("[applyPreset - setTimeout for preset] Preset *intended* sortOrder:", settings.sortOrder, ". Actual value in dropdown:", sortOrderDropdown.value);
                         // The value should already be settings.sortOrder IF it was valid for the department
                    }
                    updateDepartmentCategoryState();

                    // console.log("[applyPreset - setTimeout for preset] Calling applyPresetKeywordOverrides with ProductType:", productTypeSelect.value);
                    applyPresetKeywordOverrides(settings, productTypeSelect.value);

                    // console.log("[applyPreset - setTimeout for preset] Dispatching final change event on productTypeSelect.");
                    productTypeSelect.dispatchEvent(new Event('change'));

                    setTimeout(updateGeneratedUrl, 100);
                }, 200);

            } else {
                // console.warn("[applyPreset] Preset not found or has no settings:", selectedPresetValue);
                departmentSelect.dispatchEvent(new Event('change'));
                setTimeout(() => {
                    productTypeSelect.dispatchEvent(new Event('change'));
                    updateGeneratedUrl();
                }, 50);
            }
        }
        
        document.getElementById('presetsSelect').addEventListener('change', applyPreset);
        document.getElementById('sellerAmazon').addEventListener('click', updateGeneratedUrl);
        document.getElementById('reviewsFilter').addEventListener('click', updateGeneratedUrl);
        document.getElementById('filterExcludeBrands').addEventListener('click', updateGeneratedUrl);
    }

    function setupPriceInputs() {
        [minPriceInput, maxPriceInput].forEach(input => {
            // Only allow digits and limit to 2 characters
            input.addEventListener('input', function(e) {
                // Remove any non-digit characters
                this.value = this.value.replace(/\D/g, '');
                // Limit to 2 digits
                if (this.value.length > 6) {
                    this.value = this.value.slice(0, 6);
                }
            });
        });
    }

    function updateZipCode() {
        const marketplace = marketplaceSelect.value;
        const zipInfo = zipCodes[marketplace];
        const zipHelper = document.querySelector('.plz_helper');

        if (zipInfo) {
            zipHelper.innerHTML = `.${marketplace.toUpperCase()}: <span class="copy_me">${zipInfo.zip}</span> (${zipInfo.location})`;
        }
    }

    function handleCopyZip() {
        const zipCode = document.querySelector('.copy_me').textContent;
        navigator.clipboard.writeText(zipCode)
            .then(function() {
                copyMessage.style.display = 'inline';
                setTimeout(() => {
                    copyMessage.style.display = 'none';
                }, 2000);
            })
            .catch(function(err) {
                // console.error('Could not copy ZIP code: ', err);
                copyMessage.textContent = 'Copy failed';
                copyMessage.style.display = 'inline';
                setTimeout(() => {
                    copyMessage.textContent = 'Copied!';
                    copyMessage.style.display = 'none';
                }, 2000);
            });
    }

    // Form submit handler opens the URL in a new tab
    function handleFormSubmit(e) {
        e.preventDefault();
        // Generate the URL
        const amazonUrl = generateAmazonUrl();
        // Open the URL in a new tab
        window.open(amazonUrl, '_blank');
    }

    function handleCopyUrl() {
        const urlText = generatedUrlEl.textContent;
        navigator.clipboard.writeText(urlText)
            .then(function() {
                copyUrlBtn.classList.add('copy-success');
                setTimeout(function() {
                    copyUrlBtn.classList.remove('copy-success');
                }, 1500);
            })
            .catch(function(err) {
                // console.error('Could not copy text: ', err);
                copyUrlBtn.classList.add('copy-error');
                setTimeout(function() {
                    copyUrlBtn.classList.remove('copy-error');
                }, 1500);
            });
    }

    function updateUrlIfVisible() {
        // Always update the URL if the result container is visible
        if (resultUrlContainer.style.display !== 'none') {
            const amazonUrl = generateAmazonUrl();
            generatedUrlEl.textContent = amazonUrl;
        }
    }

    // Fix for Department & Category issue
    function updateDepartmentCategoryState() {
        const department = departmentSelect.value;
        const marketplace = marketplaceSelect.value;
        const config = marketplaceConfig[marketplace] || marketplaceConfig.com;
        
        if (!department) {
            categorySelect.disabled = true;
        } else {
            const categories = config.categories && config.categories[department] ? config.categories[department] : [];
            if (categories.length === 0) {
                categorySelect.disabled = true;
                categorySelect.value = "";
            } else {
                categorySelect.disabled = false;
            }
        }
    }

    // Ensure category properly updates URL
    function updateCategoryOptions() {
        const marketplace = marketplaceSelect.value;
        const department = departmentSelect.value;
        const config = marketplaceConfig[marketplace] || marketplaceConfig.com;
        categorySelect.innerHTML = '<option value="">No Category Filter</option>';
        
        if (!department) {
            categorySelect.disabled = true;
            return;
        }
        
        const categories = config.categories && config.categories[department] && config.categories[department].categories ? 
                           config.categories[department].categories : [];
        
        if (categories.length === 0) {
            categorySelect.disabled = true;
            categorySelect.value = "";
        } else {
            categorySelect.disabled = false;
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.value;
                option.textContent = category.text;

                // Store parameter type in dataset if specified NEW FUNCTION RELATED TO ADDITION OF RH BBN SELECTION
                if (category.catParamType) {
                    option.dataset.catParamType = category.catParamType;
                }
                
                categorySelect.appendChild(option);
            });
        }
        updateGeneratedUrl();
    }

    // Function to handle product type specific UI updates
    function updateProductTypeSettings() {
      const productType = productTypeSelect.value;
    }

    function generateAmazonUrl() {
        const marketplace = marketplaceSelect.value;
        let baseUrl = `https://www.amazon.${marketplace}`;
        const config = marketplaceConfig[marketplace] || marketplaceConfig['com'];
        const searchQuery = document.getElementById('searchInput').value.trim();
        let paramParts = [];

        if (searchQuery) {
            paramParts.push(`k=${encodeURIComponent(searchQuery)}`);
        }

        let rhParams = [];
        const timeFilter = document.querySelector('input[name="timeFilter"]:checked').value;
        if (timeFilter) {
            rhParams.push(timeFilter);
        }

        const sellerAmazonChecked = document.getElementById('sellerAmazon').checked;
        if (sellerAmazonChecked) {
            rhParams.push(document.getElementById('sellerAmazon').value);
        }

        const reviewsFilterChecked = document.getElementById('reviewsFilter').checked;
        if (reviewsFilterChecked) {
            rhParams.push(document.getElementById('reviewsFilter').value);
        }

        const minPrice = document.getElementById('minPrice').value;
        const maxPrice = document.getElementById('maxPrice').value;
        if (minPrice && maxPrice) {
            rhParams.push(`p_36%3A${minPrice}00-${maxPrice}00`);
        }

        const department = departmentSelect.value;
        if (department) {
            paramParts.push(`i=${department}`);
            const category = categorySelect.value;
            const categoryOption = categorySelect.options[categorySelect.selectedIndex];
            if (category) {
                const paramType = categoryOption.dataset.catParamType || 'rh';
                if (paramType === 'bbn') {
                    paramParts.push(`bbn=${category}`);
                } else {
                    rhParams.push(`n%3A${category}`);
                }
            }
        }

        let hiddenKeywordsArray = [];
        const customKeywordsFromInput = document.getElementById('customHiddenKeywords').value.trim();

        const activePresetValue = document.getElementById('presetsSelect').value;
        let shouldAddDefaultProductTypeKeywords = true; // Default to including them

        if (activePresetValue) {
            const presets = presetConfigs[marketplace] || presetConfigs.com;
            const activePreset = presets.find(p => p.value === activePresetValue);
            if (activePreset && activePreset.settings) {
                if (activePreset.settings.suppressDefaultProductTypeKeywords === true) {
                    shouldAddDefaultProductTypeKeywords = false;
                    // console.log("[generateAmazonUrl] Suppressing default product type keywords due to preset setting.");
                }
            }
        }

        if (customKeywordsFromInput) {
            const customKeywordsParts = customKeywordsFromInput.split(' ').filter(k => k.length > 0);
            const encodedCustomKeywords = customKeywordsParts.map(k => encodeURIComponent(k));
            if (encodedCustomKeywords.length > 0) {
                hiddenKeywordsArray.push(encodedCustomKeywords.join('+'));
            }
        }

        const productType = productTypeSelect.value;
        if (shouldAddDefaultProductTypeKeywords) {
            if (productType !== 'custom' && config.productTypeKeywords && config.productTypeKeywords[productType]) {
                hiddenKeywordsArray.push(config.productTypeKeywords[productType]);
                // console.log("[generateAmazonUrl] Adding default product type keywords for:", productType);
            }
        } else {
             // console.log("[generateAmazonUrl] SKIPPED adding default product type keywords for:", productType);
        }


        const filterExcludeBrandsChecked = document.getElementById('filterExcludeBrands').checked;
        if (filterExcludeBrandsChecked && config.excludeBrands) {
            hiddenKeywordsArray.push(config.excludeBrands);
        }

        if (hiddenKeywordsArray.length > 0) {
            paramParts.push(`hidden-keywords=${hiddenKeywordsArray.join('+')}`);
        }

        const sortOrder = document.getElementById('sortOrder').value;
        if (sortOrder && sortOrder !== 'custom') { // Ensure sortOrder has a value and is not 'custom'
            paramParts.push(`s=${sortOrder}`);
        }

        if (rhParams.length > 0) {
            paramParts.push(`rh=${rhParams.join('%2C')}`);
        }

        let url = `${baseUrl}/s`;
        if (paramParts.length > 0) {
            url += '?' + paramParts.join('&');
        }
        return url;
    }
});

// Suggestions Expander (jQuery section)
$(document).ready(function() {
    // --- Cache DOM elements ---
    const searchInput = $("#searchInput");
    const suggestionsContainer = $("#suggestionsContainer");
    const marketplaceSelect = $("#marketplaceSelect");
    const clearSearchBtn = $("#clearSearchBtn");
    const kwSuggestionsCheckbox = $("#kwsuggestions");
    const suggestionDepartmentSelect = $("#suggestionDepartmentSelect");
    const suggestionActionsContainer = $("#suggestionActions");
    const downloadCsvBtn = $("#downloadCsvBtn");
    const copySuggestionsBtn = $("#copySuggestionsBtn");

    // --- Configuration ---
    const MAX_KEYWORDS_IN_SEARCH = 1000; // Max Keywords, recommended 500
    const SUGGESTION_DEBOUNCE_MS = 300; // Delay after typing stops
    const RENDER_DELAY_MS = 500; // Small delay before rendering, recommended 500ms

    // --- State ---
    let currentMarketplace = getMarketplace();
    let suggestionTimeoutId;
    let currentDisplayedKeywords = [];
    let isDownloadingCsv = false;

    // --- Utility Functions ---
    function debugResponse(apiType, queryFirst, queryLast, response) {
        // console.groupCollapsed(`Suggestions Debug [${apiType}]: "${queryFirst}|${queryLast}"`);
        // console.log('Prefix:', queryFirst);
        // console.log('Suffix:', queryLast);
        // console.log('API Response:', response);
        // console.groupEnd();
        return response; // Pass through
    }

    function getMarketplace() {
        const selectedValue = marketplaceSelect.val() || "com"; // Default to com if null
        const domainConfig = {
            "com": { domain: "amazon.com", market: "ATVPDKIKX0DER" },
            "co.uk": { domain: "amazon.co.uk", market: "A1F83G8C2ARO7P" },
            "de": { domain: "amazon.de", market: "A1PA6795UKMFR9" },
            "fr": { domain: "amazon.fr", market: "A13V1IB3VIYZZH" },
            "it": { domain: "amazon.it", market: "APJ6JRA9NG5V4" },
            "es": { domain: "amazon.es", market: "A1RKKUPIHCS9HS" }
            //"co.jp": { domain: "amazon.co.jp", market: "A1VC38TJH7YXB5" } // Example if JP was added
        };
        return domainConfig[selectedValue];
    }

    function escapeHtml(unsafe) {
        if (typeof unsafe !== 'string') { return ''; }
        return unsafe
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
    }

    function updateActionButtonsState() {
        const hasKeywords = currentDisplayedKeywords.length > 0;
        downloadCsvBtn.prop('disabled', !hasKeywords);
        copySuggestionsBtn.prop('disabled', !hasKeywords);

        // Reset copy button feedback style if it was previously shown
        if (!hasKeywords && copySuggestionsBtn.hasClass('copy-success-feedback copy-error-feedback')) {
             copySuggestionsBtn.removeClass('copy-success-feedback copy-error-feedback').text('COPY');
        } else if (hasKeywords && copySuggestionsBtn.text() !== 'COPY') {
             // If buttons enabled but text is wrong (e.g. page reload state issue), reset it
             copySuggestionsBtn.removeClass('copy-success-feedback copy-error-feedback').text('COPY');
        }
    }

    // --- Core Suggestion Logic ---
    function getSuggestions(queryFirst, queryLast, marketplace, apiType = 'Generic') {
        let departmentQuery = suggestionDepartmentSelect.val();
        if (!departmentQuery || departmentQuery === "" || departmentQuery === "aps") {
            departmentQuery = 'aps';
        }

        const params = new URLSearchParams({
            'site-variant': 'desktop',
            'mid': marketplace.market,
            'alias': departmentQuery,
            'prefix': queryFirst || "",
            'suffix': queryLast || ""
        });

        // OLD NO CLOUDFLARE CORS const suggestUrl = `https://completion.${marketplace.domain}/api/2017/suggestions?${params.toString()}`;
        // Replace with your actual Cloudflare Worker URL
        const proxyWorker = "https://amx.awrdjmusic.workers.dev"; 
        const amazonUrl = `https://completion.${marketplace.domain}/api/2017/suggestions?${params.toString()}`;
        const suggestUrl = `${proxyWorker}?url=${encodeURIComponent(amazonUrl)}`;
        
        return fetch(suggestUrl)
            .then(response => {
                if (!response.ok) {
                    // console.error(`Network/Fetch Error for ${apiType} (${suggestUrl}):`, response.statusText);
                    return { suggestions: [] }; // Return empty on HTTP error
                }
                return response.json().catch(e => {
                    // console.error(`JSON Parse Error on OK response for ${apiType}:`, e, "URL:", suggestUrl);
                    return { suggestions: [] }; // Return empty on JSON parse error
                });
            })
            .then(jsonData => {
                if (typeof jsonData !== 'object' || jsonData === null) {
                     return debugResponse(apiType, queryFirst, queryLast, { suggestions: [] });
                }
                if (!Array.isArray(jsonData.suggestions)) {
                    jsonData.suggestions = [];
                }
                return debugResponse(apiType, queryFirst, queryLast, jsonData);
            })
            .catch(error => {
                // console.error(`Network/Fetch Error for ${apiType} (${suggestUrl}):`, error);
                return { suggestions: [] }; // Return empty on network error
            });
    }

    function parseResults(data) {
        let keywords = [];
        if (data && typeof data === 'object' && Array.isArray(data.suggestions)) {
            keywords = data.suggestions
                .filter(value => value.type === "KEYWORD")
                .map(value => {
                    if (value.highlightFragments && value.highlightFragments.length > 0) {
                        return value.highlightFragments.map(fragment => fragment.text).join('');
                    }
                    return value.value || '';
                })
                .filter(kw => typeof kw === 'string' && kw.trim() !== '');
        } else if (data && typeof data === 'object' && !Array.isArray(data.suggestions)) {
            // console.warn("parseResults received object without suggestions array:", data);
            return [];
        } else if (!data || typeof data !== 'object') {
            // console.warn("parseResults received invalid data:", data);
            return [];
        }
        return keywords;
    }

    // Modify addKeywordItem: No changes needed here specifically for CSV/Copy
    function addKeywordItem(keyword, search, groupClass) {
         const item = $('<div class="suggestion-item"></div>').addClass(groupClass);
         const matchIndex = keyword.toLowerCase().indexOf(search.toLowerCase()); // Case-insensitive match index
         let before = '', match = '', after = '';

         if (search.length > 0 && matchIndex > -1) {
             before = keyword.substring(0, matchIndex);
             match = keyword.substring(matchIndex, matchIndex + search.length); // Use original case for match
             after = keyword.substring(matchIndex + search.length);
         } else {
             before = keyword; // If no match, show whole keyword as 'before'
         }

         // Use original case keyword in the data attribute
         item.attr('data-keyword', keyword);

         // Use escaped parts for HTML rendering
         item.html(
             `<span class="s-heavy">${escapeHtml(before)}</span>${escapeHtml(match)}<span class="s-heavy">${escapeHtml(after)}</span>`
         );

         item.on('click', () => {
             searchInput.val(keyword);
             suggestionsContainer.empty().css('display', 'none');
             searchInput.focus();
             currentDisplayedKeywords = [];
             updateActionButtonsState();
         });

         suggestionsContainer.append(item);
     }


    // Modify renderCategorizedSuggestions to store keywords and update buttons
    function renderCategorizedSuggestions(search, results) {
        suggestionsContainer.empty();
        currentDisplayedKeywords = [];

        const mainKeywordsSet = new Set();
        const allDisplayedKeywordsSet = new Set();
        let keywordCount = 0;
        let otherTitleDisplayed = false;

        // Pre-populate mainKeywordsSet for de-duplication logic
        const initialMainKeywords = parseResults(results[0] || { suggestions: [] });
        initialMainKeywords.forEach(kw => mainKeywordsSet.add(kw));

        for (let i = 0; i < results.length; i++) {
            if (keywordCount >= MAX_KEYWORDS_IN_SEARCH) break;

            const currentResultData = results[i] || { suggestions: [] };
            const keywordsRaw = parseResults(currentResultData);
            let keywordsToAddInCategory = [];
            let suggestionType = "";
            let groupClass = "";

            if (i === 0) { // Main Suggestions (index 0)
                suggestionType = "Amazon Suggestions";
                groupClass = "group-main";
                keywordsRaw.forEach(kw => {
                    if (!allDisplayedKeywordsSet.has(kw) && keywordCount < MAX_KEYWORDS_IN_SEARCH) {
                        keywordsToAddInCategory.push(kw);
                        allDisplayedKeywordsSet.add(kw);
                    }
                });
            } else { // Other suggestion types (Before, After, Between, Other)
                keywordsRaw.forEach(kw => {
                    if (!mainKeywordsSet.has(kw) && !allDisplayedKeywordsSet.has(kw) && keywordCount < MAX_KEYWORDS_IN_SEARCH) {
                        keywordsToAddInCategory.push(kw);
                        allDisplayedKeywordsSet.add(kw);
                    }
                });

                switch (i) {
                    case 1: suggestionType = "Keywords Before"; groupClass = "group-before"; break;
                    case 2: suggestionType = "Keywords After"; groupClass = "group-after"; break;
                    case 3:
                        if (results[3] && results[3].suggestions && results[3].suggestions.length > 0 && keywordsToAddInCategory.length > 0) {
                             suggestionType = "Keywords Between"; groupClass = "group-between";
                        } else { suggestionType = ""; }
                        break;
                    default: suggestionType = "Other"; groupClass = "group-other"; break;
                }
            }

            if (keywordsToAddInCategory.length > 0 && suggestionType) {
                let shouldAddTitle = true;
                if (suggestionType === "Other") {
                    if (!otherTitleDisplayed) {
                        otherTitleDisplayed = true;
                    } else {
                        shouldAddTitle = false;
                    }
                }

                if (shouldAddTitle) {
                    suggestionsContainer.append($('<h3></h3>').text(suggestionType));
                }

                keywordsToAddInCategory.forEach(keyword => {
                    if (keywordCount < MAX_KEYWORDS_IN_SEARCH) {
                        addKeywordItem(keyword, search, groupClass);
                        currentDisplayedKeywords.push(keyword);
                        keywordCount++;
                    }
                });
            }
        }

        if (keywordCount > 0) {
            suggestionsContainer.css('display', 'flex');
        } else {
            suggestionsContainer.css('display', 'none');
            currentDisplayedKeywords = [];
        }
        updateActionButtonsState();
    }


    // Modify fetchAndDisplaySuggestions to handle clearing state
    function fetchAndDisplaySuggestions(search) {
        const trimmedSearch = search.trim();
        const rawSearch = searchInput.val();
        const words = trimmedSearch.split(" ").filter(w => w !== "");
        const marketplace = currentMarketplace;

        if (!trimmedSearch) {
            suggestionsContainer.empty().hide();
            clearSearchBtn.hide();
            currentDisplayedKeywords = [];
            updateActionButtonsState();
            return;
        }
        clearSearchBtn.show();

        let promises = [
            getSuggestions(rawSearch, "", marketplace, 'Main'),             // 0
            getSuggestions(" ", trimmedSearch, marketplace, 'Before'),      // 1
            getSuggestions(trimmedSearch + " ", "", marketplace, 'After'), // 2
            (words.length >= 2
                ? getSuggestions(words[0] + " ", " " + words.slice(1).join(" "), marketplace, 'Between')
                : Promise.resolve({ suggestions: [] }) // Empty if not applicable
            ),                                                              // 3
            getSuggestions(rawSearch + " for ", "", marketplace, 'Exp: for'), // 4
            getSuggestions(rawSearch + " and ", "", marketplace, 'Exp: and'), // 5
            getSuggestions(rawSearch + " with ", "", marketplace, 'Exp: with') // 6
        ];

        Promise.all(promises)
            .then((results) => {
                // Check if search input still matches the request after delay
                if (searchInput.val() === rawSearch) {
                     setTimeout(() => {
                        if (searchInput.val() === rawSearch) {
                            renderCategorizedSuggestions(trimmedSearch, results);
                        } else { // Input changed during the small render delay
                            suggestionsContainer.css('display', 'none');
                            currentDisplayedKeywords = [];
                            updateActionButtonsState();
                        }
                     }, RENDER_DELAY_MS);
                } else { // Input changed before suggestions even arrived
                    suggestionsContainer.css('display', 'none');
                    currentDisplayedKeywords = [];
                    updateActionButtonsState();
                }
            })
            .catch(error => {
                // console.error('Error fetching one or more suggestions:', error);
                suggestionsContainer.empty().hide();
                currentDisplayedKeywords = [];
                updateActionButtonsState();
            });
    }

    kwSuggestionsCheckbox.on('change', function() {
        const isChecked = $(this).is(':checked');
        suggestionDepartmentSelect.toggle(isChecked);
        suggestionActionsContainer.toggle(isChecked);

        if (!isChecked) {
            clearTimeout(suggestionTimeoutId);
            suggestionsContainer.empty().css('display', 'none');
            currentDisplayedKeywords = [];
        } else {
            // If checking the box, re-trigger suggestions if input has text
            const currentQuery = searchInput.val();
            if (currentQuery.trim()) {
                fetchAndDisplaySuggestions(currentQuery);
            }
        }
        updateActionButtonsState();
    });

    suggestionDepartmentSelect.on('change', function() {
        // Re-fetch suggestions only if the feature is enabled
        if (kwSuggestionsCheckbox.is(':checked')) {
            const currentQuery = searchInput.val();
            if (currentQuery.trim()) {
                clearTimeout(suggestionTimeoutId);
                fetchAndDisplaySuggestions(currentQuery);
            }
        }
    });

    searchInput.on('input', function() {
        const query = $(this).val();
        clearTimeout(suggestionTimeoutId); // Clear previous debounce timer

        if (query.trim()) {
            clearSearchBtn.show();
        } else {
            clearSearchBtn.hide();
        }

        // If suggestions disabled, just hide container and clear state
        if (!kwSuggestionsCheckbox.is(':checked')) {
            suggestionsContainer.empty().css('display', 'none');
            currentDisplayedKeywords = [];
            updateActionButtonsState();
            return;
        }

        // If suggestions enabled:
        if (query.trim()) {
            // Set timeout to fetch suggestions after debounce period
            suggestionTimeoutId = setTimeout(() => {
                fetchAndDisplaySuggestions(query);
            }, SUGGESTION_DEBOUNCE_MS);
        } else {
            // If input cleared, hide container and clear state immediately
            suggestionsContainer.empty().css('display', 'none');
            currentDisplayedKeywords = [];
            updateActionButtonsState();
        }
    });

    clearSearchBtn.on('click', function() {
        searchInput.val('');
        suggestionsContainer.empty().css('display', 'none');
        $(this).hide();
        searchInput.focus();
        currentDisplayedKeywords = [];
        updateActionButtonsState();
    });

    marketplaceSelect.on('change', function() {
        currentMarketplace = getMarketplace();
        const currentQuery = searchInput.val();
        // Only refetch if suggestions are enabled and input has value
        if (kwSuggestionsCheckbox.is(':checked') && currentQuery.trim()) {
            clearTimeout(suggestionTimeoutId);
            fetchAndDisplaySuggestions(currentQuery);
        } else {
            // If suggestions disabled or input empty, clear state and update buttons
            suggestionsContainer.empty().css('display', 'none'); // Ensure hidden
            currentDisplayedKeywords = [];
            updateActionButtonsState();
        }
    });

    $(document).on('click', (event) => {
        if (isDownloadingCsv) {
            // If check for the download flag is true, ignore this click event entirely
            return;
        }
        // Check if the click happened outside all relevant suggestion controls
        if (!$(event.target).closest(searchInput).length &&
            !$(event.target).closest(suggestionsContainer).length &&
            !$(event.target).closest(clearSearchBtn).length &&
            !$(event.target).closest(suggestionDepartmentSelect).length &&
            !$(event.target).closest(kwSuggestionsCheckbox).length &&
            !$(event.target).closest('label[for="kwsuggestions"]').length &&
            !$(event.target).closest(suggestionActionsContainer).length) // Ignore clicks on new buttons
        {
            // Hide suggestions container if it's currently visible
            // Doesn't clear the list or disable buttons, allows reopening on focus
             if (suggestionsContainer.is(':visible')) {
                 suggestionsContainer.css('display', 'none');
             }
        }
    });

    // Search Input Focus Handler
    searchInput.on('focus', function() {
        // Show suggestions on focus only if enabled, input has text, AND results exist
        if (kwSuggestionsCheckbox.is(':checked') && $(this).val().trim() && currentDisplayedKeywords.length > 0) {
            suggestionsContainer.css('display', 'flex');
        }
    });

    downloadCsvBtn.on('click', function() {
        if ($(this).prop('disabled') || currentDisplayedKeywords.length === 0) {
            return;
        }
        isDownloadingCsv = true;
        // Prepare CSV content (Header + Data rows)
        let csvContent = "Keyword Suggestions\n";
        currentDisplayedKeywords.forEach(keyword => {
            let escapedKeyword = keyword.replace(/"/g, '""');
            if (escapedKeyword.includes(',') || escapedKeyword.includes('"')) {
                escapedKeyword = `"${escapedKeyword}"`;
            }
            csvContent += escapedKeyword + "\n";
        });
        // Create Blob and trigger download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "merchscope_Suggestions.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setTimeout(() => {
            isDownloadingCsv = false;
        }, 0);
    });

    copySuggestionsBtn.on('click', function() {
        if ($(this).prop('disabled') || currentDisplayedKeywords.length === 0) {
            return;
        }
        const textToCopy = currentDisplayedKeywords.join("\n"); // Newline separated
        const button = $(this);
        const originalText = button.text();
        navigator.clipboard.writeText(textToCopy).then(() => {
            // Success feedback
            button.addClass('copy-success-feedback').text('COPIED!');
            setTimeout(() => {
                // Reset after timeout only if text is still 'COPIED!' (prevents race condition)
                 if(button.text() === 'COPIED!') {
                      button.removeClass('copy-success-feedback').text(originalText);
                 }
            }, 1500);
        }).catch(err => {
            // Error feedback
            // console.error('Failed to copy suggestions:', err);
            button.addClass('copy-error-feedback').text('FAIL!');
            setTimeout(() => {
                 // Reset after timeout only if text is still 'FAIL!'
                 if(button.text() === 'FAIL!') {
                      button.removeClass('copy-error-feedback').text(originalText);
                 }
            }, 1500);
        });
    });

    clearSearchBtn.hide(); // Initially hide clear button

    // Set initial visibility for suggestion controls based on checkbox state
    const initialCheckboxState = kwSuggestionsCheckbox.is(':checked');
    suggestionDepartmentSelect.toggle(initialCheckboxState);
    suggestionActionsContainer.toggle(initialCheckboxState);

    // Ensure buttons start in the correct enabled/disabled state (always disabled initially)
    updateActionButtonsState();

});
