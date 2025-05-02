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
    const basicTeesCheckbox = document.getElementById('filterBasicTees');
    const cottonCheckbox = document.getElementById('filterCotton');
    const hiddenKeywordsContainer = document.getElementById('hiddenKeywordsContainer');
    const filterBasicTeesContainer = document.getElementById('filterBasicTeesContainer');
    const filterCottonContainer = document.getElementById('filterCottonContainer');
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');

    //Search Clear
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    
    if (searchInput.value.length > 0) {
        clearSearchBtn.style.display = 'block';
    }

    // Define product type availability for each marketplace
const productTypeAvailability = {
    'com': [
        'tshirt', 'premtshirt', 'tanktop', 'longsleeve', 'raglan', 'sweatshirt', 
        'hoodie', 'ziphoodie', 'popsocket', 'case', 'totebag', 'throwpillow', 
        'tumbler', 'KDP', 'custom'
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
    ],
    'jp': [
        'tshirt', 'longsleeve', 'sweatshirt', 'hoodie', 'ziphoodie', 'case', 'KDP', 'custom'
    ]
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

    // ZIP codes for different marketplaces
    const zipCodes = {
        'com': {
            zip: '90210',
            location: 'Beverly Hills, CA'
        },
        'co.uk': {
            zip: 'E1 6AN',
            location: 'London'
        },
        'de': {
            zip: '10115',
            location: 'Berlin'
        },
        'fr': {
            zip: '75001',
            location: 'Paris'
        },
        'it': {
            zip: '00100',
            location: 'Rome'
        },
        'es': {
            zip: '28001',
            location: 'Madrid'
        },
        'jp': {
            zip: '100-0001',
            location: 'Tokyo'
        }
    };

    // Presets Config
    const presetConfigs = {
        'com': [
            { value: 'last30-fashion-com', text: 'Last 30 Days Fashion', 
              settings: { timeFilter: 'timeFilter30Days', sortOrder: 'custom', department: 'fashion', category: '7141123011', productType: 'custom'} },
            { value: 'last90-fashion-com', text: 'Last 90 Days Fashion', 
              settings: { timeFilter: 'timeFilter90Days', sortOrder: 'custom', department: 'fashion', category: '7141123011', productType: 'custom'} },
            { value: 'most-purchased-com', text: 'Most Purchased Fashion Novelty', 
              settings: { sortOrder: 'most-purchased-rank', department: 'fashion-novelty', productType: 'custom'} },
            { value: 'the-trends-com', text: 'Trends Fashion Novelty', 
              settings: { sortOrder: 'date-desc-rank', department: 'fashion-novelty', productType: 'custom'} },
            { value: 'archive-view-com', text: 'Archive Fashion Novelty', 
              settings: { sortOrder: 'date-desc-rank', department: 'fashion-novelty', productType: 'custom'} }
        ],
        'co.uk': [
            { value: 'last30-fashion-uk', text: 'Last 30 Days Fashion', 
              settings: { timeFilter: 'timeFilter30Days', sortOrder: 'custom', department: 'fashion', category: '1731104031' , productType: 'custom'} },
            { value: 'last90-fashion-uk', text: 'Last 90 Days Fashion', 
              settings: { timeFilter: 'timeFilter90Days', sortOrder: 'custom', department: 'fashion', category: '1731104031', productType: 'custom'} },
            { value: 'most-purchased-uk', text: 'Most Purchased Fashion Novelty', 
              settings: { sortOrder: 'most-purchased-rank', department: 'fashion', category: '1731104031', productType: 'tshirt'} },
            { value: 'the-trends-uk', text: 'Trends Fashion Novelty', 
              settings: { sortOrder: 'date-desc-rank', department: 'fashion', productType: 'tshirt'} },
            { value: 'archive-view-uk', text: 'Archive Fashion Novelty', 
              settings: { sortOrder: 'date-desc-rank', department: 'fashion', productType: 'tshirt'} }
        ],
        'de': [
            { value: 'last30-fashion-de', text: 'Last 30 Days Fashion', 
              settings: { timeFilter: 'timeFilter30Days', sortOrder: 'custom', department: 'fashion', category: '1981473031', productType: 'custom'} },
            { value: 'last90-fashion-de', text: 'Last 90 Days Fashion', 
              settings: { timeFilter: 'timeFilter90Days', sortOrder: 'custom', department: 'fashion', category: '1981473031', productType: 'custom'} },
            { value: 'most-purchased-de', text: 'Most Purchased Fashion Novelty', 
              settings: { sortOrder: 'most-purchased-rank', department: 'fashion', productType: 'tshirt'} },
            { value: 'the-trends-de', text: 'Trends Fashion Novelty', 
              settings: { sortOrder: 'date-desc-rank', department: 'fashion', productType: 'tshirt'} },
            { value: 'archive-view-de', text: 'Archive Fashion Novelty', 
              settings: { sortOrder: 'date-desc-rank', department: 'fashion', productType: 'tshirt'} }
        ],
        'fr': [
            { value: 'last90-review-fr', text: 'FR - Last 90 Days Review', 
              settings: { timeFilter: 'timeFilter90Days', sortOrder: 'review-rank', reviewsFilter: true } },
            { value: 'popular-basic-fr', text: 'FR - Popularité', 
              settings: { sortOrder: 'popularity-rank', excludeBrands: true } }
        ],
        'it': [
            { value: 'last90-review-it', text: 'IT - Last 90 Days Review', 
              settings: { timeFilter: 'timeFilter90Days', sortOrder: 'review-rank', reviewsFilter: true } },
            { value: 'popular-basic-it', text: 'IT - Più popolari', 
              settings: { sortOrder: 'popularity-rank', excludeBrands: true } }
        ],
        'es': [
            { value: 'last90-review-es', text: 'ES - Last 90 Days Review', 
              settings: { timeFilter: 'timeFilter90Days', sortOrder: 'review-rank', reviewsFilter: true } },
            { value: 'popular-basic-es', text: 'ES - Más populares', 
              settings: { sortOrder: 'popularity-rank', excludeBrands: true } }
        ],
        'jp': [
            { value: 'last90-review-jp', text: 'JP - Last 90 Days Review', 
              settings: { timeFilter: 'timeFilter90Days', sortOrder: 'review-rank', reviewsFilter: true } },
            { value: 'popular-basic-jp', text: 'JP - 人気順', 
              settings: { sortOrder: 'popularity-rank', excludeBrands: true } }
        ]
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

    // Define marketplace-specific parameters
    const marketplaceConfig = {
        'com': { // USA
            timeFilters: {
                '30days': 'p_n_date_first_available_absolute%3A15196852011',
                '90days': 'p_n_date_first_available_absolute%3A15196853011'
            },
            sellerFilter: 'p_6%3AATVPDKIKX0DER',
            reviewsFilter: 'p_72%3A2661618011',
            // Add product type keywords specific to USA
            productTypeKeywords: {
                'tshirt': 'Lightweight%2C+Classic+fit%2C+Double-needle+sleeve+and+bottom+hem+-Longsleeve+-Raglan+-Vneck+-Tanktop',
                'premtshirt': 'Fit%3A+Men’s+fit+runs+small%2C+size+up+for+a+looser+fit.+Women’s+fit+is+true+to+size%2C+order+usual+size.+is+made+of+lightweight+fine+jersey+fabric+-Longsleeve+-Raglan+-Vneck+-Tanktop',
                'tanktop': '"tank+top"+Lightweight%2C+Classic+fit%2C+Double-needle+sleeve+and+bottom+hem+-Longsleeve+-Raglan+-V-neck',
                'longsleeve': '"Long+sleeve"+"unisex-adult"+Classic+fit%2C+Double-needle+sleeve+and+bottom+hem+-premium+-Raglan+-Vneck+-sweatshirt+-tanktop',
                'raglan': '"raglan"+Lightweight%2C+Classic+fit%2C+Double-needle+sleeve+and+bottom+hem+-Longsleeve+-Vneck+-Tanktop',
                'sweatshirt': '"sweatshirt"+8.5+oz%2C+Classic+fit%2C+Twill-taped+neck+-Raglan+-Vneck+-Tanktop+-hoodie',
                'hoodie': '"pullover+hoodie"+8.5+oz%2C+Classic+fit%2C+Twill-taped+neck+-Raglan+-Vneck+-Tanktop+-zip',
                'ziphoodie': '"zip+hoodie"+8.5+oz%2C+Classic+fit%2C+Twill-taped+neck+-Raglan+-Vneck+-Tanktop',
                'popsocket': '"Popsocket"+Printed+top+is+swappable+with+other+compatible+PopGrip+models.+Just+press+flat%2C+turn+90+degrees+until+you+hear+a+click+and+remove+to+swap.',
                'case': '"case"+"Two-part+protective+case+made+from+a+premium+scratch-resistant+polycarbonate+shell+and+shock+absorbent+TPU+liner+protects+against+drops"',
                'totebag': '"Tote+Bag"+Made+of+a+lightweight%2C+spun+polyester+canvas-like+fabric.+All+seams+and+stress+points+are+double-stitched+for+durability%2C+and+the+reinforced+bottom+flattens+to+fit+more+items+and+hold+larger+objects.',
                'throwpillow': '"Throw+Pillow"+Filled+with+100%25+polyester+and+sewn+closed',
                'tumbler': '"Tumbler"+"Merch+on+Demand"',
                'KDP': '"independently+published"'
            },
            // Add supported sort orders for USA
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
                // 'stripbooks-intl-ship' MRB uses this
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
            excludeBrands: '-Officially+-Licensed+-LyricLyfe+-Disney+-Marvel+-StarWars+-Mademark+-HarryPotter+-Pixar+-SANRIO+-EliteAuthentics+-Barbie+-BATMAN+-JeffDunham+-CJGrips+-BreakingT+-SpongebobSquarePants+-BallparkMVP+-DCComics+-LooneyTunes+-SUPERMARIO+-Pokemon+-STARTREK+-StrangerThings+-Fallout+-MTV+-Beetlejuice+-SouthPark+-HelloKitty+-Jeep+-GypsyQueen+-TheRollingStones+-NEWLINECINEMA+-SagittariusGallery+-ScoobyDoo+-OfficialHighSchoolFanGear+-PinkFloyd+-Nickelodeon+-CareBears+-Popfunk+-FanPrint+-WarnerBros+-WWE+-DrSeuss+-NBC+-CuriousGeorge+-MeanGirls+-CartoonNetwork+-SesameStreet+-Hasbro+-CocaCola+-RickMorty+-Nintendo+-DespicableMe+-JurassicPark+-TMNT+-MyLittlePony+-AmericanKennelClub+-AnnoyingOrange+-BeerNuts+-BillNye+-Booba+-Buckedup+-CarlyMartina+-ComradeDetective+-Daria+-DippinDots+-DramaLlama+-Dunkin+-HannahHart+-IMOMSOHARD+-ImpracticalJokers+-JaneAusten+-JaneGoodall+-JennMcAllister+-JoJoSiwa+-Kabillion+-LoveIsland+-LyricVerse+-ModPodge+-NashGrier+-NeildeGrasseTyson+-RickyDillon+-ROBLOX+-ShibSibs+-SpongeBob+-TheDailyWire+-TheGrandTour+-Oddbods+-TheYoungTurks+-TheSoul+-TwinPeaks+-UglyDolls+-Mandalorian+-SpaceJam+-Aerosmith+-Bengals+-Rebelde+-BreakingBad+-FooFighters+-BlackSabbath+-SelenaQuintanilla+-CampusLab+-RobZombie+-Misfits+-Mattel+-Sheeran+-Zelda+-Dunham+-Masha',
            // Department Exclusive Settings (TimeFilters, Seller & Review Filters, sort Filters
            departmentSettings: {
              'stripbooks': {
                timeFilters: {
                  '30days': 'p_n_publication_date%3A1250226011',
                  '90days': 'p_n_publication_date%3A1250227011'
                },
                sellerFilter: '',
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
            'tumbler': 'garden'
            },
            departmentToProductType: {
                'stripbooks': 'KDP'
            },
            // Department to Product mappings
            productTypeMappings: {
                'stripbooks': 'KDP'
            }
        },
        'co.uk': // UK
            { timeFilters: {
                '30days': 'p_n_date_first_available_absolute%3A13827689031',
                '90days': 'p_n_date_first_available_absolute%3A13827690031'
            },
            sellerFilter: 'p_6%3AA3P5ROKL5A1OLE',
            reviewsFilter: 'p_72%3A184324031',
            // Add product type keywords specific to UK
            productTypeKeywords: {
                'tshirt': 'Lightweight%2C+Classic+fit%2C+Double-needle+sleeve+and+bottom+hem+-Longsleeve+-Raglan+-Vneck+-Tanktop',
                'tanktop': '"tank+top"+Lightweight%2C+Classic+fit%2C+Double-needle+sleeve+and+bottom+hem+-Longsleeve+-Raglan+-V-neck',
                'longsleeve': '"Long+sleeve"+"unisex-adult"+Classic+fit%2C+Double-needle+sleeve+and+bottom+hem+-premium+-Raglan+-Vneck+-sweatshirt+-tanktop',
                'raglan': '"raglan"+Lightweight%2C+Classic+fit%2C+Double-needle+sleeve+and+bottom+hem+-Longsleeve+-Vneck+-Tanktop',
                'sweatshirt': '"sweatshirt"+8.5+oz%2C+Classic+fit%2C+Twill-taped+neck+-Raglan+-Vneck+-Tanktop+-hoodie',
                'hoodie': '"pullover+hoodie"+8.5+oz%2C+Classic+fit%2C+Twill-taped+neck+-Raglan+-Vneck+-Tanktop+-zip',
                'ziphoodie': '"zip+hoodie"+8.5+oz%2C+Classic+fit%2C+Twill-taped+neck+-Raglan+-Vneck+-Tanktop',
                'popsocket': '"Popsocket"+Printed+top+is+swappable+with+other+compatible+PopGrip+models.+Just+press+flat%2C+turn+90+degrees+until+you+hear+a+click+and+remove+to+swap.',
                'case': '"case"+"Two-part+protective+case+made+from+a+premium+scratch-resistant+polycarbonate+shell+and+shock+absorbent+TPU+liner+protects+against+drops"',
                'KDP': '"independently+published"'
            },
            // Add supported sort orders for UK
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
                        {value: '1731104031', text: 'Novelty', catParamType: 'bbn'},
                        /*{value: '1730929031', text: 'Men\'s Clothing'},
                        {value: '1731296031', text: 'Women\'s Clothing'},
                        {value: '1730756031', text: 'Boys\' Clothing'},
                        {value: '1730841031', text: 'Girls\' Clothing'},*/
                        {value: '1731041031', text: 'Novelty & Special Use'}
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
                // 'stripbooks-intl-ship' MRB uses this UK
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
            excludeBrands: '-Officially+-Licensed+-LyricLyfe+-Disney+-Marvel+-StarWars+-Mademark+-HarryPotter+-Pixar+-SANRIO+-EliteAuthentics+-Barbie+-BATMAN+-JeffDunham+-CJGrips+-BreakingT+-SpongebobSquarePants+-BallparkMVP+-DCComics+-LooneyTunes+-SUPERMARIO+-Pokemon+-STARTREK+-StrangerThings+-Fallout+-MTV+-Beetlejuice+-SouthPark+-HelloKitty+-Jeep+-GypsyQueen+-TheRollingStones+-NEWLINECINEMA+-SagittariusGallery+-ScoobyDoo+-OfficialHighSchoolFanGear+-PinkFloyd+-Nickelodeon+-CareBears+-Popfunk+-FanPrint+-WarnerBros+-WWE+-DrSeuss+-NBC+-CuriousGeorge+-MeanGirls+-CartoonNetwork+-SesameStreet+-Hasbro+-CocaCola+-RickMorty+-Nintendo+-DespicableMe+-JurassicPark+-TMNT+-MyLittlePony+-AmericanKennelClub+-AnnoyingOrange+-BeerNuts+-BillNye+-Booba+-Buckedup+-CarlyMartina+-ComradeDetective+-Daria+-DippinDots+-DramaLlama+-Dunkin+-HannahHart+-IMOMSOHARD+-ImpracticalJokers+-JaneAusten+-JaneGoodall+-JennMcAllister+-JoJoSiwa+-Kabillion+-LoveIsland+-LyricVerse+-ModPodge+-NashGrier+-NeildeGrasseTyson+-RickyDillon+-ROBLOX+-ShibSibs+-SpongeBob+-TheDailyWire+-TheGrandTour+-Oddbods+-TheYoungTurks+-TheSoul+-TwinPeaks+-UglyDolls+-Mandalorian+-SpaceJam+-Aerosmith+-Bengals+-Rebelde+-BreakingBad+-FooFighters+-BlackSabbath+-SelenaQuintanilla+-CampusLab+-RobZombie+-Misfits+-Mattel+-Sheeran+-Zelda+-Dunham+-Masha',
            // Department Exclusive Settings (TimeFilters, Seller & Review Filters, sort Filters
            departmentSettings: {
              'stripbooks': {
                timeFilters: {
                  '30days': 'p_n_publication_date%3A182241031',
                  '90days': 'p_n_publication_date%3A182242031'
                },
                sellerFilter: '',
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
            },
            // Department to Product mappings
            productTypeMappings: {
                'stripbooks': 'KDP'
            }
        },
        'de': {
            timeFilters: {
                '30days': 'p_n_date_first_available_absolute%3A13827501031',
                '90days': 'p_n_date_first_available_absolute%3A13827502031'
            },
            sellerFilter: 'p_6%3AA3JWKAKR8XB7XF',
            reviewsFilter: 'p_72%3A419117031',
            // Add product type keywords specific to DE
            productTypeKeywords: {
                'tshirt': 'Classic+cut,+double+stitched+hem+-Longsleeve+-Raglan+-Vneck+-Tanktop',
                'tanktop': '"tank+top"+Lightweight,+classic+cut+tank+top,+double+stitched+sleeves+and+hem+-Longsleeve+-Raglan+-V-neck',
                'longsleeve': '"Long+sleeve"+Classic+cut,+double+stitched+hem+-Raglan+-Vneck+-sweatshirt+-tanktop',
                'raglan': '"raglan"+leichter, klassischer Schnitt, doppelt genähte Ärmel und Saumabschluss+-Longsleeve+-Vneck+-Tanktop',
                'sweatshirt': '"sweatshirt"+8.5 oz, classic cut+-Raglan+-Vneck+-Tanktop+-hoodie',
                'hoodie': '"pullover+hoodie"+8.5 oz, Klassisch geschnitten, doppelt genähter Saum+-Raglan+-Vneck+-Tanktop+-zip',
                'ziphoodie': '"Kapuzenjacke"+241gr leichter, klassischer Schnitt; verstärkter Nacken+-Raglan+-Vneck+-Tanktop',
                'popsocket': '"Popsocket"+Printed+top+is+swappable+with+other+compatible+PopGrip+models.+Just+press+flat%2C+turn+90+degrees+until+you+hear+a+click+and+remove+to+swap.',
                'case': '"case"+"The two-piece protective case made from a high quality scratch resistant polycarbonate shell and shock absorbing TPU liner protects against drops"+"Merch von Amazon"',
                'KDP': '"independently+published"'
            },
            // Add supported sort orders for DE
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
            // Brands to exclude for DE
            excludeBrands: '-Officially+-Licensed+-LyricLyfe+-Disney+-Marvel+-StarWars+-Mademark+-HarryPotter+-Pixar+-SANRIO+-EliteAuthentics+-Barbie+-BATMAN+-JeffDunham+-CJGrips+-BreakingT+-SpongebobSquarePants+-BallparkMVP+-DCComics+-LooneyTunes+-SUPERMARIO+-Pokemon+-STARTREK+-StrangerThings+-Fallout+-MTV+-Beetlejuice+-SouthPark+-HelloKitty+-Jeep+-GypsyQueen+-TheRollingStones+-NEWLINECINEMA+-SagittariusGallery+-ScoobyDoo+-OfficialHighSchoolFanGear+-PinkFloyd+-Nickelodeon+-CareBears+-Popfunk+-FanPrint+-WarnerBros+-WWE+-DrSeuss+-NBC+-CuriousGeorge+-MeanGirls+-CartoonNetwork+-SesameStreet+-Hasbro+-CocaCola+-RickMorty+-Nintendo+-DespicableMe+-JurassicPark+-TMNT+-MyLittlePony+-AmericanKennelClub+-AnnoyingOrange+-BeerNuts+-BillNye+-Booba+-Buckedup+-CarlyMartina+-ComradeDetective+-Daria+-DippinDots+-DramaLlama+-Dunkin+-HannahHart+-IMOMSOHARD+-ImpracticalJokers+-JaneAusten+-JaneGoodall+-JennMcAllister+-JoJoSiwa+-Kabillion+-LoveIsland+-LyricVerse+-ModPodge+-NashGrier+-NeildeGrasseTyson+-RickyDillon+-ROBLOX+-ShibSibs+-SpongeBob+-TheDailyWire+-TheGrandTour+-Oddbods+-TheYoungTurks+-TheSoul+-TwinPeaks+-UglyDolls+-Mandalorian+-SpaceJam+-Aerosmith+-Bengals+-Rebelde+-BreakingBad+-FooFighters+-BlackSabbath+-SelenaQuintanilla+-CampusLab+-RobZombie+-Misfits+-Mattel+-Sheeran+-Zelda+-Dunham+-Masha',
            // Department Exclusive Settings (TimeFilters, Seller & Review Filters, sort Filters
            departmentSettings: {
              'stripbooks': {
                timeFilters: {
                  '30days': 'p_n_publication_date%3A1778535031',
                  '90days': 'p_n_publication_date%3A1778536031'
                },
                sellerFilter: '',
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
            },
            // Department to Product mappings
            productTypeMappings: {
                'stripbooks': 'KDP'
            }
        },
        'it': {
            timeFilters: {
                '30days': 'p_n_date_first_available_absolute%3A15196852011',
                '90days': 'p_n_date_first_available_absolute%3A15196853011'
            },
            sellerFilter: 'p_6%3AATVPDKIKX0DER',
            reviewsFilter: 'p_72%3A2661618011',
            // Add product type keywords specific to IT
            productTypeKeywords: {
                'tshirt': 'Lightweight%2C+Classic+fit%2C+Double-needle+sleeve+and+bottom+hem+-Longsleeve+-Raglan+-Vneck+-Tanktop',
                'premtshirt': 'Fit%3A+Men’s+fit+runs+small%2C+size+up+for+a+looser+fit.+Women’s+fit+is+true+to+size%2C+order+usual+size.+is+made+of+lightweight+fine+jersey+fabric+-Longsleeve+-Raglan+-Vneck+-Tanktop',
                'tanktop': '"tank+top"+Lightweight%2C+Classic+fit%2C+Double-needle+sleeve+and+bottom+hem+-Longsleeve+-Raglan+-V-neck',
                'longsleeve': '"Long+sleeve"+"unisex-adult"+Classic+fit%2C+Double-needle+sleeve+and+bottom+hem+-premium+-Raglan+-Vneck+-sweatshirt+-tanktop',
                'raglan': '"raglan"+Lightweight%2C+Classic+fit%2C+Double-needle+sleeve+and+bottom+hem+-Longsleeve+-Vneck+-Tanktop',
                'sweatshirt': '"sweatshirt"+8.5+oz%2C+Classic+fit%2C+Twill-taped+neck+-Raglan+-Vneck+-Tanktop+-hoodie',
                'hoodie': '"pullover+hoodie"+8.5+oz%2C+Classic+fit%2C+Twill-taped+neck+-Raglan+-Vneck+-Tanktop+-zip',
                'ziphoodie': '"zip+hoodie"+8.5+oz%2C+Classic+fit%2C+Twill-taped+neck+-Raglan+-Vneck+-Tanktop',
                'popsocket': '"Popsocket"+Printed+top+is+swappable+with+other+compatible+PopGrip+models.+Just+press+flat%2C+turn+90+degrees+until+you+hear+a+click+and+remove+to+swap.',
                'case': '"case"+"Two-part+protective+case+made+from+a+premium+scratch-resistant+polycarbonate+shell+and+shock+absorbent+TPU+liner+protects+against+drops"',
                'totebag': '"Tote+Bag"+Made+of+a+lightweight%2C+spun+polyester+canvas-like+fabric.+All+seams+and+stress+points+are+double-stitched+for+durability%2C+and+the+reinforced+bottom+flattens+to+fit+more+items+and+hold+larger+objects.',
                'throwpillow': '"Throw+Pillow"+Filled+with+100%25+polyester+and+sewn+closed',
                'tumbler': '"Tumbler"+"Merch+on+Demand"',
                'KDP': '"independently+published"'
            },
            // Add supported sort orders for IT
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
            // Departments and categories for IT
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
                // 'stripbooks-intl-ship' MRB uses this
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
            // Brands to exclude for IT
            excludeBrands: '-Officially+-Licensed+-LyricLyfe+-Disney+-Marvel+-StarWars+-Mademark+-HarryPotter+-Pixar+-SANRIO+-EliteAuthentics+-Barbie+-BATMAN+-JeffDunham+-CJGrips+-BreakingT+-SpongebobSquarePants+-BallparkMVP+-DCComics+-LooneyTunes+-SUPERMARIO+-Pokemon+-STARTREK+-StrangerThings+-Fallout+-MTV+-Beetlejuice+-SouthPark+-HelloKitty+-Jeep+-GypsyQueen+-TheRollingStones+-NEWLINECINEMA+-SagittariusGallery+-ScoobyDoo+-OfficialHighSchoolFanGear+-PinkFloyd+-Nickelodeon+-CareBears+-Popfunk+-FanPrint+-WarnerBros+-WWE+-DrSeuss+-NBC+-CuriousGeorge+-MeanGirls+-CartoonNetwork+-SesameStreet+-Hasbro+-CocaCola+-RickMorty+-Nintendo+-DespicableMe+-JurassicPark+-TMNT+-MyLittlePony+-AmericanKennelClub+-AnnoyingOrange+-BeerNuts+-BillNye+-Booba+-Buckedup+-CarlyMartina+-ComradeDetective+-Daria+-DippinDots+-DramaLlama+-Dunkin+-HannahHart+-IMOMSOHARD+-ImpracticalJokers+-JaneAusten+-JaneGoodall+-JennMcAllister+-JoJoSiwa+-Kabillion+-LoveIsland+-LyricVerse+-ModPodge+-NashGrier+-NeildeGrasseTyson+-RickyDillon+-ROBLOX+-ShibSibs+-SpongeBob+-TheDailyWire+-TheGrandTour+-Oddbods+-TheYoungTurks+-TheSoul+-TwinPeaks+-UglyDolls+-Mandalorian+-SpaceJam+-Aerosmith+-Bengals+-Rebelde+-BreakingBad+-FooFighters+-BlackSabbath+-SelenaQuintanilla+-CampusLab+-RobZombie+-Misfits+-Mattel+-Sheeran+-Zelda+-Dunham+-Masha',
            // Department Exclusive Settings (TimeFilters, Seller & Review Filters, sort Filters
            departmentSettings: {
              'stripbooks': {
                timeFilters: {
                  '30days': 'p_n_publication_date%3A1250226011',
                  '90days': 'p_n_publication_date%3A1250227011'
                },
                sellerFilter: '',
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
            'tumbler': 'garden'
            },
            departmentToProductType: {
                'stripbooks': 'KDP'
            },
            // Department to Product mappings
            productTypeMappings: {
                'stripbooks': 'KDP'
            }
        },
        'es': {
            timeFilters: {
                '30days': 'p_n_date_first_available_absolute%3A15196852011',
                '90days': 'p_n_date_first_available_absolute%3A15196853011'
            },
            sellerFilter: 'p_6%3AATVPDKIKX0DER',
            reviewsFilter: 'p_72%3A2661618011',
            // Add product type keywords specific to ES
            productTypeKeywords: {
                'tshirt': 'Lightweight%2C+Classic+fit%2C+Double-needle+sleeve+and+bottom+hem+-Longsleeve+-Raglan+-Vneck+-Tanktop',
                'premtshirt': 'Fit%3A+Men’s+fit+runs+small%2C+size+up+for+a+looser+fit.+Women’s+fit+is+true+to+size%2C+order+usual+size.+is+made+of+lightweight+fine+jersey+fabric+-Longsleeve+-Raglan+-Vneck+-Tanktop',
                'tanktop': '"tank+top"+Lightweight%2C+Classic+fit%2C+Double-needle+sleeve+and+bottom+hem+-Longsleeve+-Raglan+-V-neck',
                'longsleeve': '"Long+sleeve"+"unisex-adult"+Classic+fit%2C+Double-needle+sleeve+and+bottom+hem+-premium+-Raglan+-Vneck+-sweatshirt+-tanktop',
                'raglan': '"raglan"+Lightweight%2C+Classic+fit%2C+Double-needle+sleeve+and+bottom+hem+-Longsleeve+-Vneck+-Tanktop',
                'sweatshirt': '"sweatshirt"+8.5+oz%2C+Classic+fit%2C+Twill-taped+neck+-Raglan+-Vneck+-Tanktop+-hoodie',
                'hoodie': '"pullover+hoodie"+8.5+oz%2C+Classic+fit%2C+Twill-taped+neck+-Raglan+-Vneck+-Tanktop+-zip',
                'ziphoodie': '"zip+hoodie"+8.5+oz%2C+Classic+fit%2C+Twill-taped+neck+-Raglan+-Vneck+-Tanktop',
                'popsocket': '"Popsocket"+Printed+top+is+swappable+with+other+compatible+PopGrip+models.+Just+press+flat%2C+turn+90+degrees+until+you+hear+a+click+and+remove+to+swap.',
                'case': '"case"+"Two-part+protective+case+made+from+a+premium+scratch-resistant+polycarbonate+shell+and+shock+absorbent+TPU+liner+protects+against+drops"',
                'totebag': '"Tote+Bag"+Made+of+a+lightweight%2C+spun+polyester+canvas-like+fabric.+All+seams+and+stress+points+are+double-stitched+for+durability%2C+and+the+reinforced+bottom+flattens+to+fit+more+items+and+hold+larger+objects.',
                'throwpillow': '"Throw+Pillow"+Filled+with+100%25+polyester+and+sewn+closed',
                'tumbler': '"Tumbler"+"Merch+on+Demand"',
                'KDP': '"independently+published"'
            },
            // Add supported sort orders for ES
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
                // 'stripbooks-intl-ship' MRB uses this
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
            // Brands to exclude for ES
            excludeBrands: '-Officially+-Licensed+-LyricLyfe+-Disney+-Marvel+-StarWars+-Mademark+-HarryPotter+-Pixar+-SANRIO+-EliteAuthentics+-Barbie+-BATMAN+-JeffDunham+-CJGrips+-BreakingT+-SpongebobSquarePants+-BallparkMVP+-DCComics+-LooneyTunes+-SUPERMARIO+-Pokemon+-STARTREK+-StrangerThings+-Fallout+-MTV+-Beetlejuice+-SouthPark+-HelloKitty+-Jeep+-GypsyQueen+-TheRollingStones+-NEWLINECINEMA+-SagittariusGallery+-ScoobyDoo+-OfficialHighSchoolFanGear+-PinkFloyd+-Nickelodeon+-CareBears+-Popfunk+-FanPrint+-WarnerBros+-WWE+-DrSeuss+-NBC+-CuriousGeorge+-MeanGirls+-CartoonNetwork+-SesameStreet+-Hasbro+-CocaCola+-RickMorty+-Nintendo+-DespicableMe+-JurassicPark+-TMNT+-MyLittlePony+-AmericanKennelClub+-AnnoyingOrange+-BeerNuts+-BillNye+-Booba+-Buckedup+-CarlyMartina+-ComradeDetective+-Daria+-DippinDots+-DramaLlama+-Dunkin+-HannahHart+-IMOMSOHARD+-ImpracticalJokers+-JaneAusten+-JaneGoodall+-JennMcAllister+-JoJoSiwa+-Kabillion+-LoveIsland+-LyricVerse+-ModPodge+-NashGrier+-NeildeGrasseTyson+-RickyDillon+-ROBLOX+-ShibSibs+-SpongeBob+-TheDailyWire+-TheGrandTour+-Oddbods+-TheYoungTurks+-TheSoul+-TwinPeaks+-UglyDolls+-Mandalorian+-SpaceJam+-Aerosmith+-Bengals+-Rebelde+-BreakingBad+-FooFighters+-BlackSabbath+-SelenaQuintanilla+-CampusLab+-RobZombie+-Misfits+-Mattel+-Sheeran+-Zelda+-Dunham+-Masha',
            // Department Exclusive Settings (TimeFilters, Seller & Review Filters, sort Filters
            departmentSettings: {
              'stripbooks': {
                timeFilters: {
                  '30days': 'p_n_publication_date%3A1250226011',
                  '90days': 'p_n_publication_date%3A1250227011'
                },
                sellerFilter: '',
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
            'tumbler': 'garden'
            },
            departmentToProductType: {
                'stripbooks': 'KDP'
            },
            // Department to Product mappings
            productTypeMappings: {
                'stripbooks': 'KDP'
            }
        },
        'jp': {
            timeFilters: {
                '30days': 'p_n_date_first_available_absolute%3A15196852011',
                '90days': 'p_n_date_first_available_absolute%3A15196853011'
            },
            sellerFilter: 'p_6%3AATVPDKIKX0DER',
            reviewsFilter: 'p_72%3A2661618011',
            // Add product type keywords specific to JP
            productTypeKeywords: {
                'tshirt': 'Lightweight%2C+Classic+fit%2C+Double-needle+sleeve+and+bottom+hem+-Longsleeve+-Raglan+-Vneck+-Tanktop',
                'premtshirt': 'Fit%3A+Men’s+fit+runs+small%2C+size+up+for+a+looser+fit.+Women’s+fit+is+true+to+size%2C+order+usual+size.+is+made+of+lightweight+fine+jersey+fabric+-Longsleeve+-Raglan+-Vneck+-Tanktop',
                'tanktop': '"tank+top"+Lightweight%2C+Classic+fit%2C+Double-needle+sleeve+and+bottom+hem+-Longsleeve+-Raglan+-V-neck',
                'longsleeve': '"Long+sleeve"+"unisex-adult"+Classic+fit%2C+Double-needle+sleeve+and+bottom+hem+-premium+-Raglan+-Vneck+-sweatshirt+-tanktop',
                'raglan': '"raglan"+Lightweight%2C+Classic+fit%2C+Double-needle+sleeve+and+bottom+hem+-Longsleeve+-Vneck+-Tanktop',
                'sweatshirt': '"sweatshirt"+8.5+oz%2C+Classic+fit%2C+Twill-taped+neck+-Raglan+-Vneck+-Tanktop+-hoodie',
                'hoodie': '"pullover+hoodie"+8.5+oz%2C+Classic+fit%2C+Twill-taped+neck+-Raglan+-Vneck+-Tanktop+-zip',
                'ziphoodie': '"zip+hoodie"+8.5+oz%2C+Classic+fit%2C+Twill-taped+neck+-Raglan+-Vneck+-Tanktop',
                'popsocket': '"Popsocket"+Printed+top+is+swappable+with+other+compatible+PopGrip+models.+Just+press+flat%2C+turn+90+degrees+until+you+hear+a+click+and+remove+to+swap.',
                'case': '"case"+"Two-part+protective+case+made+from+a+premium+scratch-resistant+polycarbonate+shell+and+shock+absorbent+TPU+liner+protects+against+drops"',
                'totebag': '"Tote+Bag"+Made+of+a+lightweight%2C+spun+polyester+canvas-like+fabric.+All+seams+and+stress+points+are+double-stitched+for+durability%2C+and+the+reinforced+bottom+flattens+to+fit+more+items+and+hold+larger+objects.',
                'throwpillow': '"Throw+Pillow"+Filled+with+100%25+polyester+and+sewn+closed',
                'tumbler': '"Tumbler"+"Merch+on+Demand"',
                'KDP': '"independently+published"'
            },
            // Add supported sort orders for JP
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
                // 'stripbooks-intl-ship' MRB uses this
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
            // Brands to exclude for JP
            excludeBrands: '-Officially+-Licensed+-LyricLyfe+-Disney+-Marvel+-StarWars+-Mademark+-HarryPotter+-Pixar+-SANRIO+-EliteAuthentics+-Barbie+-BATMAN+-JeffDunham+-CJGrips+-BreakingT+-SpongebobSquarePants+-BallparkMVP+-DCComics+-LooneyTunes+-SUPERMARIO+-Pokemon+-STARTREK+-StrangerThings+-Fallout+-MTV+-Beetlejuice+-SouthPark+-HelloKitty+-Jeep+-GypsyQueen+-TheRollingStones+-NEWLINECINEMA+-SagittariusGallery+-ScoobyDoo+-OfficialHighSchoolFanGear+-PinkFloyd+-Nickelodeon+-CareBears+-Popfunk+-FanPrint+-WarnerBros+-WWE+-DrSeuss+-NBC+-CuriousGeorge+-MeanGirls+-CartoonNetwork+-SesameStreet+-Hasbro+-CocaCola+-RickMorty+-Nintendo+-DespicableMe+-JurassicPark+-TMNT+-MyLittlePony+-AmericanKennelClub+-AnnoyingOrange+-BeerNuts+-BillNye+-Booba+-Buckedup+-CarlyMartina+-ComradeDetective+-Daria+-DippinDots+-DramaLlama+-Dunkin+-HannahHart+-IMOMSOHARD+-ImpracticalJokers+-JaneAusten+-JaneGoodall+-JennMcAllister+-JoJoSiwa+-Kabillion+-LoveIsland+-LyricVerse+-ModPodge+-NashGrier+-NeildeGrasseTyson+-RickyDillon+-ROBLOX+-ShibSibs+-SpongeBob+-TheDailyWire+-TheGrandTour+-Oddbods+-TheYoungTurks+-TheSoul+-TwinPeaks+-UglyDolls+-Mandalorian+-SpaceJam+-Aerosmith+-Bengals+-Rebelde+-BreakingBad+-FooFighters+-BlackSabbath+-SelenaQuintanilla+-CampusLab+-RobZombie+-Misfits+-Mattel+-Sheeran+-Zelda+-Dunham+-Masha',
            // Department Exclusive Settings (TimeFilters, Seller & Review Filters, sort Filters
            departmentSettings: {
              'stripbooks': {
                timeFilters: {
                  '30days': 'p_n_publication_date%3A1250226011',
                  '90days': 'p_n_publication_date%3A1250227011'
                },
                sellerFilter: '',
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
            'tumbler': 'garden'
            },
            departmentToProductType: {
                'stripbooks': 'KDP'
            },
            // Department to Product mappings
            productTypeMappings: {
                'stripbooks': 'KDP'
            }
        }
};

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

    // Modified updateSortOrderOptions
function updateSortOrderOptions() {
  const marketplace = marketplaceSelect.value;
  const department = departmentSelect.value;
  const config = marketplaceConfig[marketplace] || marketplaceConfig.com;
  
  // Get department-specific sort options if available
  const sortOptions = (department && config.departmentSettings?.[department]?.sortOrders)
    ? config.departmentSettings[department].sortOrders
    : config.sortOrders;

  const sortOrderSelect = document.getElementById('sortOrder');
  sortOrderSelect.innerHTML = '';
  
  sortOptions.forEach(option => {
    const optionEl = document.createElement('option');
    optionEl.value = option.value;
    optionEl.textContent = option.text;
    sortOrderSelect.appendChild(optionEl);
  });
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

    // Completely revised event listener setup
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
    updateZipCode();
    updateMarketplaceFilters();
    populateDepartments();
    populateProductTypes();
    updateSortOrderOptions();
    updatePresetsDropdown();
    updateGeneratedUrl();
  });

  productTypeSelect.addEventListener('change', function() {
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

  document.getElementById('presetsSelect').addEventListener('change', applyPreset);
    // this function to handle preset selection
    function applyPreset() {
    const selectedPreset = document.getElementById('presetsSelect').value;
    const marketplace = marketplaceSelect.value;
    const presets = presetConfigs[marketplace] || presetConfigs.com;
    const config = marketplaceConfig[marketplace] || marketplaceConfig.com;  // Add this line
    // if (!selectedPreset) return; // No preset selected OLD
    if (!selectedPreset) {
        // Reset to marketplace defaults
        const firstProductType = productTypeAvailability[marketplace][0];
        const firstDepartment = Object.keys(config.categories)[0];

        // Core reset operations
        productTypeSelect.value = firstProductType;
        departmentSelect.value = firstDepartment;
        categorySelect.value = '';
        document.getElementById('timeFilterNone').checked = true;
        document.getElementById('sellerAmazon').checked = true;
        document.getElementById('reviewsFilter').checked = false;
        document.getElementById('filterExcludeBrands').checked = config.excludeBrands ? true : false;
        document.getElementById('sortOrder').value = config.sortOrders[0].value;

        // MUST trigger these events IN ORDER
        productTypeSelect.dispatchEvent(new Event('change'));
        setTimeout(() => {
            departmentSelect.dispatchEvent(new Event('change'));
            updateMarketplaceFilters();
            updateGeneratedUrl();
        }, 100);
        return;// EXIT FUNCTION EARLY
    }
        
    // Reset filters to default first
    document.getElementById('timeFilterNone').checked = true;
    document.getElementById('sellerAmazon').checked = true;
    document.getElementById('reviewsFilter').checked = false;
    document.getElementById('filterExcludeBrands').checked = false;
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    document.getElementById('sortOrder').value = 'custom';
    productTypeSelect.value = 'custom'; // Reset product type to "None"
    departmentSelect.value = ''; // Reset department
    categorySelect.value = ''; // Reset category
        
    // Find the selected preset configuration
        
    const preset = presets.find(p => p.value === selectedPreset);
    if (preset) {
        const settings = preset.settings;

        // Apply product type - 'custom' or empty string for "None"
        if (settings.productType !== undefined) {
            productTypeSelect.value = settings.productType;
            // Trigger change event to update UI based on product type
            productTypeSelect.dispatchEvent(new Event('change'));
        }
        
        // Changed the order of operations - apply department FIRST
        // This is crucial because department changes will update the sort options
        if (settings.department !== undefined) {
            departmentSelect.value = settings.department;
            departmentSelect.dispatchEvent(new Event('change'));
            
            if (settings.category !== undefined) {
                setTimeout(() => {
                    categorySelect.value = settings.category;
                    categorySelect.dispatchEvent(new Event('change'));
                }, 50);
            }
        }
        
        // Then apply time filter and other settings as before
        if (settings.timeFilter) {
            document.getElementById(settings.timeFilter).checked = true;
        }
        
        // Add a small delay before setting sort order to ensure options are updated
        setTimeout(() => {
            if (settings.sortOrder !== undefined) {
                document.getElementById('sortOrder').value = settings.sortOrder;
                document.getElementById('sortOrder').dispatchEvent(new Event('change'));
            }
        }, 100);
        
        // Apply review filter
        if (settings.reviewsFilter !== undefined) {
            document.getElementById('reviewsFilter').checked = !!settings.reviewsFilter;
        }
        
        // Apply exclude brands
        if (settings.excludeBrands !== undefined) {
            document.getElementById('filterExcludeBrands').checked = !!settings.excludeBrands;
        }
        
        // Apply price range
        if (settings.minPrice !== undefined) {
            document.getElementById('minPrice').value = settings.minPrice;
        }
        if (settings.maxPrice !== undefined) {
            document.getElementById('maxPrice').value = settings.maxPrice;
        }
        
        // Update the generated URL with new settings
        updateGeneratedUrl();
    }
}
        

  document.getElementById('sellerAmazon').addEventListener('click', updateGeneratedUrl);
  document.getElementById('reviewsFilter').addEventListener('click', updateGeneratedUrl);
  document.getElementById('filterExcludeBrands').addEventListener('click', updateGeneratedUrl);
}

    function setupPriceInputs() {
        // Add input constraints for price fields
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
            console.error('Could not copy ZIP code: ', err);
            copyMessage.textContent = 'Copy failed';
            copyMessage.style.display = 'inline';
            setTimeout(() => {
                copyMessage.textContent = 'Copied!';
                copyMessage.style.display = 'none';
            }, 2000);
        });
}

    // Update the form submit handler to only open the URL
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
            // Visual feedback
            copyUrlBtn.classList.add('copy-success');
            setTimeout(function() {
                copyUrlBtn.classList.remove('copy-success');
            }, 1500);
        })
        .catch(function(err) {
            console.error('Could not copy text: ', err);
            // Visual feedback for error
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

    function updateProductTypeSettings() {
  // This function should handle product type specific UI updates
  // For now we can implement a basic version
  const productType = productTypeSelect.value;
  // Additional functionality can be added based on requirements
}

    function generateAmazonUrl() {
        // Get base marketplace
        const marketplace = marketplaceSelect.value;
        let baseUrl = `https://www.amazon.${marketplace}`;

        // Get marketplace config
        const config = marketplaceConfig[marketplace] || marketplaceConfig['com']; // Fallback to US

        // Get search query
        const searchQuery = document.getElementById('searchInput').value.trim();

        // Initialize parameters array to join with & later
        let paramParts = [];

        // Add search term if provided
        if (searchQuery) {
            paramParts.push(`k=${encodeURIComponent(searchQuery)}`);
        }

        // Collection for rh parameters
        let rhParams = [];

        // Add time filter
        const timeFilter = document.querySelector('input[name="timeFilter"]:checked').value;
        if (timeFilter) {
            rhParams.push(timeFilter);
        }

        // Add seller filter
        const sellerAmazon = document.getElementById('sellerAmazon').checked;
        if (sellerAmazon) {
            rhParams.push(document.getElementById('sellerAmazon').value);
        }

        // Add reviews filter
        const reviewsFilter = document.getElementById('reviewsFilter').checked;
        if (reviewsFilter) {
            rhParams.push(document.getElementById('reviewsFilter').value);
        }

        // Add price filter
        const minPrice = document.getElementById('minPrice').value;
        const maxPrice = document.getElementById('maxPrice').value;
        if (minPrice && maxPrice) {
            rhParams.push(`p_36%3A${minPrice}00-${maxPrice}00`);
        }

        // Always add department and category if selected (regardless of product type)
        const department = document.getElementById('department').value;
        if (department) {
            paramParts.push(`i=${department}`);

            // Add category filter if department and category are both selected - OLD ONE ALWAYS DOES RH
            /*const category = document.getElementById('category').value;
            if (category) {
                rhParams.push(`n%3A${category}`);
            }*/

            // Get selected category and its configuration NEW ONE
            const category = document.getElementById('category').value;
            const categoryOption = categorySelect.options[categorySelect.selectedIndex];
            
            if (category) {
                // Determine parameter type from category configuration or default to rh
                const paramType = categoryOption.dataset.catParamType || 'rh';
                
                if (paramType === 'bbn') {
                    paramParts.push(`bbn=${category}`);
                } else {
                    rhParams.push(`n%3A${category}`);
                }
            }
            
        }

/* Function to add category selection based on rh or bbn input FRONTEND SELECTION
    <select id="categoryParamType" class="form-control mt-2">
    <option value="rh">rh=n:</option>
    <option value="bbn">bbn=</option>
    </select>
    // Get category parameter type
    const categoryParamType = document.getElementById('categoryParamType').value;
    // Add category filter based on selected parameter type
    const category = document.getElementById('category').value;
    if (category) {
        if (categoryParamType === 'bbn') {
            paramParts.push(`bbn=${category}`);
        } else {
            rhParams.push(`n%3A${category}`);
        }
    }
*/

        let hiddenKeywords = [];
        const customKeywords = document.getElementById('customHiddenKeywords').value.trim();
    if (customKeywords) {
        // Split by spaces and encode each keyword individually
        const customKeywordsParts = customKeywords.split(' ').filter(k => k.length > 0);
        const encodedKeywords = customKeywordsParts.map(k => encodeURIComponent(k));
        if (encodedKeywords.length > 0) {
            hiddenKeywords.push(encodedKeywords.join('+'));
        }
    }
    
    const productType = productTypeSelect.value;
    if (productType !== 'custom' && config.productTypeKeywords && config.productTypeKeywords[productType]) {
        hiddenKeywords.push(config.productTypeKeywords[productType]);
    }

        // Add exclude brands filter - always add this at the end if selected
const filterExcludeBrands = document.getElementById('filterExcludeBrands').checked;
if (filterExcludeBrands && config.excludeBrands) {
  hiddenKeywords.push(config.excludeBrands);
}

        // Add hidden-keywords parameter if we have any
        if (hiddenKeywords.length > 0) {
            paramParts.push(`hidden-keywords=${hiddenKeywords.join('+')}`);
        }

        // Add sort order
        const sortOrder = document.getElementById('sortOrder').value;
        if (sortOrder !== 'custom') {
            paramParts.push(`s=${sortOrder}`);
        }

        // Combine all rh parameters with comma (%2C)
        if (rhParams.length > 0) {
            paramParts.push(`rh=${rhParams.join('%2C')}`);
        }

        // Add language parameter for non-US/UK marketplaces
        /*if (marketplace !== 'com' && marketplace !== 'co.uk') {
            // Map marketplace to language code
            const languageMap = {
                'de': 'de',
                'fr': 'fr',
                'it': 'it',
                'es': 'es',
                'jp': 'ja'
            };
            const langCode = languageMap[marketplace] || marketplace;
            paramParts.push(`language=${langCode}`);
        }*/

        // Build the final URL
        let url = baseUrl;

        // Always add /s for search
        url += '/s';

        // Add parameters if we have any
        if (paramParts.length > 0) {
            url += '?' + paramParts.join('&');
        }

        return url;
    }
});

// script.js
// script.js
// --- Configuration ---
const API_ENDPOINT = 'https://completion.amazon.com/search/complete';
// Market (mkt=1 is US). Change if needed for other regions.
const MARKET_ID = '1';
const CLIENT_INFO = 'amazon-search-ui'; // Mimic client
const SEARCH_ALIAS = 'aps'; // All departments

// Keywords used by the extension for the "Other" category
const OTHER_KEYWORDS = ["for", "with", "and", "vs", "without", "to", "under", "from", "in"];
const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split('');
const NUMBERS = "0123456789".split('');
const ALPHANUMERIC = [...ALPHABET, ...NUMBERS];

// Background colors for categories (adjust as needed)
const COLORS = {
    standard: '#FFFFFF', // White
    before: '#E6F7FF',   // Light Blue
    after: '#E6FFFA',    // Light Teal
    other: '#FFFBE6',    // Light Yellow
    // Add 'between' color if implementing
};

// --- DOM Elements ---
// Ensure these elements exist in your HTML file with these exact IDs
const searchInput = document.getElementById('searchInput');
const suggestionsContainer = document.getElementById('suggestionsContainer');
const loadingIndicator = document.getElementById('loadingIndicator');

// --- State ---
let displayedKeywords = new Set(); // Track displayed keywords to avoid duplicates
let debounceTimer;

// --- API Fetch Function ---
/**
 * Fetches suggestions from the Amazon completion API.
 * @param {string} query - The search query.
 * @returns {Promise<string[]|null>} A promise that resolves to an array of suggestions or null on error.
 */
async function fetchSuggestions(query) {
    const url = new URL(API_ENDPOINT);
    url.searchParams.append('q', query);
    url.searchParams.append('search-alias', SEARCH_ALIAS);
    url.searchParams.append('client', CLIENT_INFO);
    url.searchParams.append('mkt', MARKET_ID);

    console.log(`Fetching suggestions for query: "${query}" from URL: ${url.toString()}`); // DEBUG

    try {
        // Standard fetch. If you encounter CORS errors, a server-side proxy is the standard solution.
        const response = await fetch(url.toString());

        console.log(`Response status for query "${query}": ${response.status}`); // DEBUG

        if (!response.ok) {
            let errorBody = await response.text().catch(() => 'Could not read error body');
            console.error(`HTTP error for query "${query}"! Status: ${response.status}. Body: ${errorBody}`);
            return null; // Indicate fetch failure
        }

        // Check content type - Amazon might return non-JSON sometimes (e.g., JSONP)
         const contentType = response.headers.get("content-type");
         // Allow JSON and JavaScript (for JSONP) content types
         if (!contentType || !(contentType.includes("application/json") || contentType.includes("application/javascript"))) {
             let responseBody = await response.text();
             console.warn(`Received unexpected Content-Type for query "${query}". Content-Type: ${contentType}. Body: ${responseBody}`);
             // Attempt to parse JSONP-like response even with wrong content type
             try {
                 const jsonpMatch = responseBody.match(/^[^\(]*\((.*)\)[;\s]*$/);
                 if (jsonpMatch && jsonpMatch[1]) {
                     console.log(`Attempting to parse extracted JSONP content despite Content-Type for query "${query}"`);
                     const data = JSON.parse(jsonpMatch[1]);
                     console.log(`Successfully parsed JSONP data for query "${query}":`, data); // DEBUG
                     // Standard Amazon format: [query, [suggestions], metadat?, nodes?]
                     return data && Array.isArray(data) && data.length > 1 && Array.isArray(data[1]) ? data[1] : [];
                 } else {
                      console.warn(`Could not extract JSON from non-JSON/JS response for query "${query}".`);
                      return []; // Return empty array if no JSONP structure found
                 }
             } catch (parseError) {
                 console.error(`Error parsing potentially non-JSON/JS response for query "${query}":`, parseError, "Response body:", responseBody);
                 return []; // Return empty array on parsing error
             }
         }

        // If content type is correct (JSON or JavaScript), attempt parsing
        let responseBody = await response.text();
        try {
            let data;
            // Try standard JSON parse first
            if (contentType.includes("application/json")) {
                 data = JSON.parse(responseBody);
            } else { // Assume JSONP for application/javascript
                 const jsonpMatch = responseBody.match(/^[^\(]*\((.*)\)[;\s]*$/);
                 if (jsonpMatch && jsonpMatch[1]) {
                     data = JSON.parse(jsonpMatch[1]);
                 } else {
                     throw new Error("JavaScript content type received, but not in expected JSONP format.");
                 }
            }

            console.log(`Successfully parsed data for query "${query}":`, data); // DEBUG
            // Standard Amazon format: [query, [suggestions], metadat?, nodes?]
            return data && Array.isArray(data) && data.length > 1 && Array.isArray(data[1]) ? data[1] : [];

        } catch (parseError) {
             console.error(`Error parsing response for query "${query}":`, parseError, "Response body:", responseBody);
             return []; // Return empty array on parsing error
        }

    } catch (error) {
        console.error(`Network or other error fetching suggestions for query "${query}":`, error);
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
             // This specific TypeError often indicates a CORS issue or network problem
            console.error("This might be a CORS issue (if running in a browser without a proxy) or a network connectivity problem.");
        }
        return null; // Indicate fetch failure
    }
}

// --- Suggestion Processing and Rendering ---

/**
 * Adds a single suggestion item to the UI container.
 * @param {HTMLElement} container - The container element for the category.
 * @param {string} keyword - The suggestion keyword.
 * @param {string} backgroundColor - The background color for the item.
 * @param {Set<string>} displayedKeywordsSet - Set of already displayed keywords (lowercase).
 * @param {string|null} highlightedPart - The specific part of the keyword to highlight (prefix/suffix/other).
 */
function addSuggestionItem(container, keyword, backgroundColor, displayedKeywordsSet, highlightedPart = null) {
    const lowerCaseKeyword = keyword.toLowerCase();
    // Avoid adding duplicates
    if (displayedKeywordsSet.has(lowerCaseKeyword)) {
        // console.log(`Skipping duplicate: "${keyword}"`); // Optional DEBUG
        return false; // Indicate that item was not added
    }
    displayedKeywordsSet.add(lowerCaseKeyword);

    const item = document.createElement('div');
    // Add base class and any specific styling classes needed (assuming CSS handles .suggestion-item)
    item.className = 'suggestion-item'; // Use className for broader compatibility
    item.style.backgroundColor = backgroundColor;

    let highlightedHtml = keyword; // Default to the original keyword text

    // Apply highlighting if a part is specified and valid
    if (highlightedPart && typeof highlightedPart === 'string' && highlightedPart.length > 0) {
        // Find the first occurrence of the highlighted part (case-insensitive index)
        const index = lowerCaseKeyword.indexOf(highlightedPart.toLowerCase());

        if (index !== -1) {
             // Extract the substring with original casing from the keyword
             const originalCaseHighlight = keyword.substring(index, index + highlightedPart.length);
             // Reconstruct the string with the highlighted part wrapped in a span
             // Ensure HTML entities are handled correctly by setting textContent first, then manipulating innerHTML if needed,
             // or carefully constructing the HTML string. Using innerHTML directly is simpler here but be mindful of potential XSS if keyword source is untrusted.
             highlightedHtml = keyword.substring(0, index) +
                              `<span class="s-heavy">${originalCaseHighlight}</span>` + // Assuming .s-heavy class exists in CSS
                              keyword.substring(index + highlightedPart.length);
        } else {
            // Log if the part to highlight wasn't found (might indicate a logic issue or API variation)
            console.warn(`Could not find "${highlightedPart}" in "${keyword}" for highlighting.`);
            // Keep highlightedHtml as the original keyword if part not found
        }
    }

    item.innerHTML = highlightedHtml; // Use innerHTML to render the potential span
    item.title = `Click to search for: "${keyword}"`; // Tooltip for usability

    // Event listener for clicking a suggestion
    item.onclick = () => {
        searchInput.value = keyword; // Fill input on click
        suggestionsContainer.innerHTML = ''; // Clear suggestions display
        if (suggestionsContainer.classList) { // Check if classList is supported
             suggestionsContainer.classList.add('hidden'); // Hide container using class
        } else {
            suggestionsContainer.style.display = 'none'; // Fallback for older browsers
        }
        // Optionally trigger a new search immediately after click:
        // processAndRenderSuggestions(keyword);
    };

    container.appendChild(item);
    return true; // Indicate that item was added
}

/**
 * Creates a category container element with a title and appends it to the main suggestions container.
 * @param {string} title - The title for the category.
 * @returns {HTMLElement} - The created category container element (where items should be appended).
 */
function createCategoryContainer(title) {
    const categoryDiv = document.createElement('div'); // This will hold the title and items
    const titleDiv = document.createElement('div');
    // Add base class and any specific styling classes needed (assuming CSS handles .category-title)
    titleDiv.className = 'category-title'; // Use className
    titleDiv.textContent = title; // Safer than innerHTML for plain text
    categoryDiv.appendChild(titleDiv); // Add title to the category container

    // Check if suggestionsContainer exists before appending
    if (suggestionsContainer) {
        suggestionsContainer.appendChild(categoryDiv); // Add the whole category container to the main display
        console.log(`Created category: "${title}"`); // DEBUG
    } else {
        console.error("suggestionsContainer element not found in the DOM.");
    }
    return categoryDiv; // Return the category container so items can be added to it
}


/**
 * Fetches all suggestion types (standard, before, after, other),
 * processes them, filters relevant ones, and renders them in categorized sections.
 * @param {string} search - The search term entered by the user.
 */
async function processAndRenderSuggestions(search) {
    // Basic validation and DOM checks
    if (!searchInput || !suggestionsContainer || !loadingIndicator) {
        console.error("Required DOM elements (searchInput, suggestionsContainer, loadingIndicator) not found.");
        return;
    }
    if (!search || typeof search !== 'string' || search.trim().length < 1) {
        suggestionsContainer.innerHTML = '';
        suggestionsContainer.classList.add('hidden');
        return;
    }

    const searchTerm = search.trim(); // Use trimmed search term
    const lowerSearch = searchTerm.toLowerCase();

    console.log(`Starting suggestion processing for: "${searchTerm}"`); // DEBUG
    loadingIndicator.classList.remove('hidden'); // Show loading
    suggestionsContainer.innerHTML = ''; // Clear previous suggestions
    suggestionsContainer.classList.add('hidden'); // Hide until results are ready
    displayedKeywords.clear(); // Reset duplicate tracker for this new search

    const promises = [];

    // --- Create Promises for API Calls ---

    // 1. Standard Suggestions
    promises.push(fetchSuggestions(searchTerm).then(results => ({ type: 'standard', results })));

    // 2. Keywords Before (a-z, 0-9)
    ALPHANUMERIC.forEach(prefix => {
        const query = `${prefix} ${searchTerm}`;
        promises.push(fetchSuggestions(query).then(results => ({ type: 'before', prefix, results, originalQuery: query })));
    });

    // 3. Keywords After (a-z, 0-9)
    ALPHANUMERIC.forEach(suffix => {
        const query = `${searchTerm} ${suffix}`;
        promises.push(fetchSuggestions(query).then(results => ({ type: 'after', suffix, results, originalQuery: query })));
    });

    // 4. Other Keywords
    OTHER_KEYWORDS.forEach(otherWord => {
        const query = `${searchTerm} ${otherWord}`;
        promises.push(fetchSuggestions(query).then(results => ({ type: 'other', otherWord, results, originalQuery: query })));
    });

    console.log(`Waiting for ${promises.length} API calls to complete...`); // DEBUG

    // --- Wait for all API calls ---
    // Promise.allSettled is better as it waits for all promises, even if some fail
    const settledResults = await Promise.allSettled(promises);
    console.log("All API calls settled. Raw results:", settledResults); // DEBUG

    // Filter out failed promises and extract successful results' values
    // Ensure the value contains a 'results' array before including it
    const allResults = settledResults
        .filter(result => result.status === 'fulfilled' && result.value && Array.isArray(result.value.results))
        .map(result => result.value);

    // --- Process and Render Results ---
    loadingIndicator.classList.add('hidden'); // Hide loading indicator

    let standardContainer, beforeContainer, afterContainer, otherContainer;
    let suggestionsFound = false; // Flag to track if *any* suggestions are added

    allResults.forEach((resultData) => {
        const { type, results } = resultData;

        // Skip if results array is empty (already filtered above, but good practice)
        if (results.length === 0) {
            return;
        }

        let itemsAddedInCategory = 0; // Track items added per category

        switch (type) {
            case 'standard':
                console.log(`Processing ${results.length} standard suggestions.`); // DEBUG
                if (!standardContainer) standardContainer = createCategoryContainer('Standard Suggestions');
                results.forEach(keyword => {
                    if(addSuggestionItem(standardContainer, keyword, COLORS.standard, displayedKeywords)) {
                        itemsAddedInCategory++;
                    }
                });
                break;

            case 'before':
                const { prefix } = resultData;
                // Filter: suggestion must start with "prefix<space>searchTerm" (case insensitive)
                const relevantBefore = results.filter(k => k.toLowerCase().startsWith(prefix.toLowerCase() + ' ' + lowerSearch));
                if (relevantBefore.length > 0) {
                    console.log(`Processing ${relevantBefore.length} relevant 'before' suggestions for prefix "${prefix}".`); // DEBUG
                    if (!beforeContainer) beforeContainer = createCategoryContainer('Keywords Before');
                    // Highlight the prefix part (use the actual prefix from the keyword start)
                    relevantBefore.forEach(keyword => {
                         if(addSuggestionItem(beforeContainer, keyword, COLORS.before, displayedKeywords, keyword.substring(0, prefix.length))) {
                             itemsAddedInCategory++;
                         }
                    });
                }
                break;

            case 'after':
                 const { suffix } = resultData;
                 // Filter: suggestion must start with the original query "searchTerm<space>suffix" (case insensitive)
                 // This filter might be too strict if Amazon returns variations.
                 // A looser filter could be just checking if it starts with searchTerm.
                 const relevantAfter = results.filter(k => k.toLowerCase().startsWith(resultData.originalQuery.toLowerCase()));
                 // Alternative looser filter: const relevantAfter = results.filter(k => k.toLowerCase().startsWith(lowerSearch));

                 if (relevantAfter.length > 0) {
                     console.log(`Processing ${relevantAfter.length} relevant 'after' suggestions for suffix "${suffix}".`); // DEBUG
                    if (!afterContainer) afterContainer = createCategoryContainer('Keywords After');
                     relevantAfter.forEach(keyword => {
                         // Try to highlight the specific suffix character/word if it appears right after the search term + space
                         const expectedSuffixStart = searchTerm.length + 1;
                         if (keyword.length > expectedSuffixStart && keyword.toLowerCase().substring(expectedSuffixStart).startsWith(suffix.toLowerCase())) {
                             // Highlight the part matching the suffix length, starting after the space
                             const highlight = keyword.substring(expectedSuffixStart, expectedSuffixStart + suffix.length);
                              if(addSuggestionItem(afterContainer, keyword, COLORS.after, displayedKeywords, highlight)) {
                                  itemsAddedInCategory++;
                              }
                         } else {
                             // Fallback: Add without specific highlight or highlight the whole part after search term?
                             // Let's add without specific highlight for now if the exact suffix isn't found immediately after.
                              if(addSuggestionItem(afterContainer, keyword, COLORS.after, displayedKeywords, null)) {
                                  itemsAddedInCategory++;
                              }
                         }
                     });
                 }
                break;

            case 'other':
                const { otherWord } = resultData;
                // Filter: suggestion must start with the original query "searchTerm<space>otherWord" (case insensitive)
                const relevantOther = results.filter(k => k.toLowerCase().startsWith(resultData.originalQuery.toLowerCase()));
                 if (relevantOther.length > 0) {
                     console.log(`Processing ${relevantOther.length} relevant 'other' suggestions for word "${otherWord}".`); // DEBUG
                    if (!otherContainer) otherContainer = createCategoryContainer('Other Suggestions');
                    relevantOther.forEach(keyword => {
                        // Find the 'otherWord' right after the search term + space
                        const expectedOtherStart = searchTerm.length + 1;
                        // Use indexOf to find the word, ensuring it starts at the expected position
                        const indexOther = keyword.toLowerCase().indexOf(otherWord.toLowerCase(), expectedOtherStart);

                        if (indexOther === expectedOtherStart) {
                            // Highlight the found 'otherWord' with original casing
                            const highlightedPart = keyword.substring(indexOther, indexOther + otherWord.length);
                             if(addSuggestionItem(otherContainer, keyword, COLORS.other, displayedKeywords, highlightedPart)) {
                                 itemsAddedInCategory++;
                             }
                        } else {
                             // Add without highlight if the 'otherWord' isn't exactly where expected
                              if(addSuggestionItem(otherContainer, keyword, COLORS.other, displayedKeywords, null)) {
                                  itemsAddedInCategory++;
                              }
                        }
                    });
                 }
                break;
        }
         if (itemsAddedInCategory > 0) {
             suggestionsFound = true; // Mark true if any category added items
         }
    });

     // --- Final Display Handling ---
     if (suggestionsFound) {
         console.log("Finished processing. Suggestions should be visible."); // DEBUG
         suggestionsContainer.classList.remove('hidden'); // Show container only if suggestions were found
     } else {
         console.log("No suggestions were added to any category. Displaying 'No suggestions found'."); // DEBUG
         // Display "No suggestions found" message inside the container
         suggestionsContainer.innerHTML = '<div class="p-4 text-center text-gray-500">No suggestions found.</div>'; // Adjust classes as needed
         suggestionsContainer.classList.remove('hidden'); // Show the container to display the message
     }
}


// --- Event Listener Setup ---

// Ensure DOM is fully loaded before adding listeners
document.addEventListener('DOMContentLoaded', () => {
    // Check again if elements exist after DOM load
    const searchInputElem = document.getElementById('searchInput');
    const suggestionsContainerElem = document.getElementById('suggestionsContainer');

    if (!searchInputElem || !suggestionsContainerElem || !loadingIndicator) {
         console.error("DOM elements missing after DOMContentLoaded. Cannot attach event listeners.");
         return; // Stop if essential elements aren't there
    }


    // Input event listener with debouncing
    searchInputElem.addEventListener('input', (e) => {
        // Clear any existing timer
        clearTimeout(debounceTimer);

        const searchTerm = e.target.value; // Get value directly

        if (searchTerm && searchTerm.trim().length > 0) {
            // Show loading indicator immediately for better UX
            if (loadingIndicator) loadingIndicator.classList.remove('hidden');
            // Optionally hide suggestions container while loading
            // if (suggestionsContainerElem) suggestionsContainerElem.classList.add('hidden');
            // Optionally clear old results instantly
            // if (suggestionsContainerElem) suggestionsContainerElem.innerHTML = '';

            // Set a new timer
            debounceTimer = setTimeout(() => {
                processAndRenderSuggestions(searchTerm); // Pass the current search term
            }, 300); // Debounce time in milliseconds (e.g., 300ms)
        } else {
            // Clear suggestions and hide indicator if input is empty
            if (suggestionsContainerElem) {
                suggestionsContainerElem.innerHTML = '';
                suggestionsContainerElem.classList.add('hidden');
            }
            if (loadingIndicator) loadingIndicator.classList.add('hidden');
        }
    });

    // Optional: Click outside listener to hide suggestions
    document.addEventListener('click', (event) => {
        // Check if the click was outside the search input AND outside the suggestions container
        if (searchInputElem && suggestionsContainerElem &&
            !searchInputElem.contains(event.target) &&
            !suggestionsContainerElem.contains(event.target))
        {
            suggestionsContainerElem.classList.add('hidden');
            // Optionally clear the content as well:
            // suggestionsContainerElem.innerHTML = '';
        }
    });

     console.log("Suggestion tool script initialized."); // DEBUG
});
