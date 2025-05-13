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
    const customHiddenInput = document.getElementById('customHiddenKeywords'); // Ensure this is cached
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
        // Presets config US
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
              settings: { sortOrder: 'date-desc-rank', department: 'fashion-novelty', productType: 'custom'} },
            { value: 'competition-view-com', text: 'T-Shirt Competition Checker', 
              settings: { sortOrder: 'custom', department: 'fashion-novelty', productType: 'tshirt', searchKeywords: 'funny graphic tee', customHiddenKeywords: '-vintage'} },
            {
            value: 'competition-checker-com', // Renamed example
            text: 'Competition Checker',      // Renamed example
            settings: {
                // Base Settings
                sortOrder: 'custom',
                department: 'fashion-novelty',
                productType: 'custom',              // Default product type for this preset
                searchKeywords: 'funny graphic',    // Base search keyword(s)
                customHiddenKeywords: '-vintage',   // Base custom hidden keyword(s)
        
                // --- NEW: Product Type Specific Overrides ---
                productTypeOverrides: {
                    'tshirt': { // Optional: Override even for the default type
                        searchKeywords: 'funny graphic tee', // More specific than base
                        // customHiddenKeywords not specified, would use base '-vintage'
                    }, 'hoodie': {
                        searchKeywords: 'funny graphic hoodie',
                        customHiddenKeywords: '-pullover -zip' // Override both
                    },
                    'sweatshirt': {
                        searchKeywords: 'funny graphic sweatshirt'
                        // customHiddenKeywords not specified, would use base '-vintage'
                    },
                    'longsleeve': {
                        // searchKeywords not specified, would use base 'funny graphic'
                        customHiddenKeywords: '-short -tank'
                    }
                }
        } 
        }
        ],
        // Presets config UK
        'co.uk': [
            { value: 'last30-fashion-uk', text: 'Last 30 Days Fashion - UK', 
              settings: { timeFilter: 'timeFilter30Days', sortOrder: 'custom', department: 'fashion', productType: 'custom'} },
            { value: 'last90-fashion-uk', text: 'Last 90 Days Fashion - UK', 
              settings: { timeFilter: 'timeFilter90Days', sortOrder: 'custom', department: 'fashion', productType: 'custom'} },
            { value: 'most-purchased-uk', text: 'Most Purchased Fashion Novelty - UK', 
              settings: { sortOrder: 'most-purchased-rank', department: 'fashion', category: '1731104031', productType: 'custom'} },
            { value: 'the-trends-uk', text: 'Trends Fashion - UK', 
              settings: { sortOrder: 'date-desc-rank', department: 'fashion', productType: 'custom'} },
            { value: 'archive-view-uk', text: 'Archive Fashion - UK', 
              settings: { sortOrder: 'date-desc-rank', department: 'fashion', productType: 'tshirt'} },
            { value: 'competition-view-uk', text: 'T-Shirt Competition Checker - UK', 
              settings: { sortOrder: 'custom', department: 'fashion', productType: 'tshirt'} }
        ],
        // Presets config DE
        'de': [
            { value: 'last30-fashion-de', text: 'Last 30 Days Fashion - DE', 
              settings: { timeFilter: 'timeFilter30Days', sortOrder: 'custom', department: 'fashion', productType: 'custom'} },
            { value: 'last90-fashion-de', text: 'Last 90 Days Fashion- DE', 
              settings: { timeFilter: 'timeFilter90Days', sortOrder: 'custom', department: 'fashion', productType: 'custom'} },
            { value: 'most-purchased-de', text: 'Most Purchased Fashion - DE', 
              settings: { sortOrder: 'most-purchased-rank', department: 'fashion', productType: 'custom'} },
            { value: 'the-trends-de', text: 'Trends Fashion - DE', 
              settings: { sortOrder: 'date-desc-rank', department: 'fashion', productType: 'tshirt'} },
            { value: 'archive-view-de', text: 'Archive Fashio - DEn', 
              settings: { sortOrder: 'date-desc-rank', department: 'fashion', productType: 'tshirt'} },
            { value: 'competition-view-de', text: 'T-Shirt Competition Checker - DE', 
              settings: { sortOrder: 'custom', department: 'fashion', productType: 'custom'} }
        ],
        // Presets config FR
        'fr': [
            { value: 'last30-fashion-fr', text: 'Last 30 Days Fashion Fantaisie - FR', 
              settings: { timeFilter: 'timeFilter30Days', sortOrder: 'custom', department: 'fashion', category: '465090031', productType: 'custom'} },
            { value: 'last90-fashion-fr', text: 'Last 90 Days Fashion Fantaisie - FR', 
              settings: { timeFilter: 'timeFilter90Days', sortOrder: 'custom', department: 'fashion', category: '465090031', productType: 'custom'} },
            { value: 'most-purchased-fr', text: 'Most Purchased Fashion Fantaisie - FR', 
              settings: { sortOrder: 'most-purchased-rank', department: 'fashion', category: '465090031', productType: 'custom'} },
            { value: 'the-trends-fr', text: 'Trends Fashion - FR', 
              settings: { sortOrder: 'date-desc-rank', department: 'fashion', productType: 'tshirt'} },
            { value: 'archive-view-fr', text: 'Archive Fashion - FR', 
              settings: { sortOrder: 'date-desc-rank', department: 'fashion', productType: 'tshirt'} },
            { value: 'competition-view-fr', text: 'T-Shirt Competition Checker - FR', 
              settings: { sortOrder: 'custom', department: 'fashion', category: '465090031', productType: 'tshirt'} }
        ],
        // Presets config IT
        'it': [
            { value: 'last30-fashion-fr', text: 'Last 30 Days Fashion Specific Clothing - IT', 
              settings: { timeFilter: 'timeFilter30Days', sortOrder: 'custom', department: 'fashion', category: '2892860031', productType: 'custom'} },
            { value: 'last90-fashion-fr', text: 'Last 90 Days Fashion Specific Clothing - IT', 
              settings: { timeFilter: 'timeFilter90Days', sortOrder: 'custom', department: 'fashion', category: '2892860031', productType: 'custom'} },
            { value: 'most-purchased-fr', text: 'Most Purchased Fashion - IT', 
              settings: { sortOrder: 'most-purchased-rank', department: 'fashion', productType: 'custom'} },
            { value: 'the-trends-fr', text: 'Trends Fashion - IT', 
              settings: { sortOrder: 'date-desc-rank', department: 'fashion', productType: 'tshirt'} },
            { value: 'archive-view-fr', text: 'Archive Fashion - IT', 
              settings: { sortOrder: 'date-desc-rank', department: 'fashion', productType: 'tshirt'} },
            { value: 'competition-view-fr', text: 'T-Shirt Competition Checker - IT', 
              settings: { sortOrder: 'custom', department: 'fashion', category: '2892860031', productType: 'tshirt'} }
        ],
        // Presets config ES
        'es': [
            { value: 'last30-fashion-es', text: 'Last 30 Days Fashion Specialized Clothing - ES', 
              settings: { timeFilter: 'timeFilter30Days', sortOrder: 'custom', department: 'fashion', category: '3074031031', productType: 'custom'} },
            { value: 'last90-fashion-es', text: 'Last 90 Days Fashion Specialized Clothing - ES', 
              settings: { timeFilter: 'timeFilter90Days', sortOrder: 'custom', department: 'fashion', category: '3074031031', productType: 'custom'} },
            { value: 'most-purchased-es', text: 'Most Purchased Fashion Specialized Clothing - ES', 
              settings: { sortOrder: 'most-purchased-rank', department: 'fashion', category: '3074031031', productType: 'custom'} },
            { value: 'the-trends-es', text: 'Trends Fashion - ES', 
              settings: { sortOrder: 'date-desc-rank', department: 'fashion', productType: 'tshirt'} },
            { value: 'archive-view-es', text: 'Archive Fashion - ES', 
              settings: { sortOrder: 'date-desc-rank', department: 'fashion', productType: 'tshirt'} },
            { value: 'competition-view-es', text: 'T-Shirt Competition Checker - ES', 
              settings: { sortOrder: 'custom', department: 'custom', productType: 'custom'} }
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
                excludeBrands: '-Officially+-Licensed+-LyricLyfe+-Disney+-Marvel+-StarWars+-Mademark+-HarryPotter+-Pixar+-SANRIO+-EliteAuthentics+-Barbie+-BATMAN+-JeffDunham+-CJGrips+-BreakingT+-SpongebobSquarePants+-BallparkMVP+-DCComics+-LooneyTunes+-SUPERMARIO+-Pokemon+-STARTREK+-StrangerThings+-Fallout+-MTV+-Beetlejuice+-SouthPark+-HelloKitty+-Jeep+-GypsyQueen+-TheRollingStones+-NEWLINECINEMA+-SagittariusGallery+-ScoobyDoo+-OfficialHighSchoolFanGear+-PinkFloyd+-Nickelodeon+-CareBears+-Popfunk+-FanPrint+-WarnerBros+-WWE+-DrSeuss+-NBC+-CuriousGeorge+-MeanGirls+-CartoonNetwork+-SesameStreet+-Hasbro+-CocaCola+-RickMorty+-Nintendo+-DespicableMe+-JurassicPark+-TMNT+-MyLittlePony+-AmericanKennelClub+-AnnoyingOrange+-BeerNuts+-BillNye+-Booba+-Buckedup+-CarlyMartina+-ComradeDetective+-Daria+-DippinDots+-DramaLlama+-Dunkin+-HannahHart+-IMOMSOHARD+-ImpracticalJokers+-JaneAusten+-JaneGoodall+-JennMcAllister+-JoJoSiwa+-Kabillion+-LoveIsland+-LyricVerse+-ModPodge+-NashGrier+-NeildeGrasseTyson+-RickyDillon+-ROBLOX+-ShibSibs+-SpongeBob+-TheDailyWire+-TheGrandTour+-Oddbods+-TheYoungTurks+-TheSoul+-TwinPeaks+-UglyDolls+-Mandalorian+-SpaceJam+-Aerosmith+-Bengals+-Rebelde+-BreakingBad+-FooFighters+-BlackSabbath+-SelenaQuintanilla+-CampusLab+-RobZombie+-Misfits+-Mattel+-Sheeran+-Zelda+-Dunham+-Masha+-DreamWorks+-UniversalStudios+-Paramount+-20thCenturyStudios+-SonyPictures+-Lionsgate+-HBO+-AMC+-BBC+-Netflix+-Hulu+-PlayStation+-Xbox+-Fortnite+-LeagueofLegends+-Overwatch+-CallofDuty+-Minecraft+-EldenRing+-WorldofWarcraft+-TheSims+-AmongUs+-Tetris+-SEGA+-Atari+-Capcom+-Konami+-TheBeatles+-LedZeppelin+-ACDC+-Metallica+-Nirvana+-TaylorSwift+-BTS+-BLACKPINK+-Drake+-GameofThrones+-SquidGame+-PeakyBlinders+-Lego+-Barney+-ThomasandFriends+-PeppaPig+-Bluey+-FisherPrice+-Tonka+-PowerRangers+-Ford+-Chevrolet+-Toyota+-Honda+-Tesla+-BMW+-MercedesBenz+-HarleyDavidson+-Nike+-Adidas+-Puma+-Gucci+-LouisVuitton+-Chanel+-Balenciaga+-Vans+-Fila+-Pepsi+-MountainDew+-Sprite+-DrPepper+-Nestle+-Oreo+-Reeses+-Snickers+-TacoBell+-McDonalds+-KFC+-Starbucks+-NFL+-NBA+-MLB+-NHL+-NCAA+-FIFA+-UFC+-Google+-Facebook+-Instagram+-Snapchat+-YouTube+-Twitter+-TikTok',
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
                'tumbler': 'garden'
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

    // --- THIS IS THE CORRECT SCOPE FOR THE HELPER ---
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
    // --- END HELPER FUNCTION ---

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
    /*function updateSortOrderOptions() {
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
    }*/
    function updateSortOrderOptions() {
        const marketplace = marketplaceSelect.value;
        const department = departmentSelect.value;
        const config = marketplaceConfig[marketplace] || marketplaceConfig.com;
        const sortOrderSelect = document.getElementById('sortOrder');

        console.log("[updateSortOrderOptions] Called. Dept:", department);

        // Determine the list of sort options to populate based on current marketplace and department
        const sortOptionsToShow = (department && config.departmentSettings?.[department]?.sortOrders)
            ? config.departmentSettings[department].sortOrders
            : config.sortOrders;

        if (!sortOptionsToShow || sortOptionsToShow.length === 0) {
            console.warn("[updateSortOrderOptions] No sort options found for current config.");
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
                console.log("[updateSortOrderOptions] Active preset wants sortOrder:", presetIntendedSortOrder);
            }
        }

        // Populate the dropdown
        const previousSortValue = sortOrderSelect.value; // Store before clearing
        sortOrderSelect.innerHTML = '';
        sortOptionsToShow.forEach(option => {
            const optionEl = document.createElement('option');
            optionEl.value = option.value;
            optionEl.textContent = option.text;
            sortOrderSelect.appendChild(optionEl);
        });
        console.log("[updateSortOrderOptions] Dropdown populated with:", sortOptionsToShow.map(o => o.value));

        // Now, set the selected value
        if (presetIntendedSortOrder !== null && sortOptionsToShow.some(opt => opt.value === presetIntendedSortOrder)) {
            // If a preset is active AND its intended sort order is valid in the current list, use it.
            sortOrderSelect.value = presetIntendedSortOrder;
            console.log("[updateSortOrderOptions] Setting sort to PRESET'S value:", presetIntendedSortOrder);
        } else if (!activePresetValue && sortOptionsToShow.some(opt => opt.value === previousSortValue)) {
            // NO preset active, try to preserve user's previous selection if still valid in the new list
            sortOrderSelect.value = previousSortValue;
            console.log("[updateSortOrderOptions] No preset. Preserving previous valid sort:", previousSortValue);
        } else {
            // Otherwise (no preset and previous invalid, OR preset's sort order invalid for current options), default to the first option.
            if (sortOptionsToShow.length > 0) {
                sortOrderSelect.value = sortOptionsToShow[0].value;
                console.log("[updateSortOrderOptions] Setting sort to DEFAULT (first option):", sortOptionsToShow[0].value);
            }
        }
        console.log("[updateSortOrderOptions] Final sortOrder value:", sortOrderSelect.value);
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
            const activePresetValue = document.getElementById('presetsSelect').value;
            if (activePresetValue) {
                const currentMarketplace = marketplaceSelect.value;
                const currentPresets = presetConfigs[currentMarketplace] || presetConfigs.com;
                const activePreset = currentPresets.find(p => p.value === activePresetValue);
                if (activePreset && activePreset.settings) {
                    // Apply the whole preset logic again for the new marketplace context
                    // This is a bit heavy, but ensures all settings are re-evaluated
                    // including product type dropdown being repopulated
                    applyPreset(); // This will re-apply the preset in the context of new marketplace
                    return; // applyPreset will handle the final updateGeneratedUrl
                }
            }
            updateGeneratedUrl();
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
            // Original logic:
            updateProductTypeSettings(); // (often empty)
            updateDepartmentFromProductType(); // This is important
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

        // this function to handle preset selection
        /* OOOLD ONE function applyPreset() {
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

       NEW ONE MAY 13 1:30 function applyPreset() {
            const selectedPreset = document.getElementById('presetsSelect').value;
            const marketplace = marketplaceSelect.value;
            const presets = presetConfigs[marketplace] || presetConfigs.com;
            const config = marketplaceConfig[marketplace] || marketplaceConfig.com;
            const searchInput = document.getElementById('searchInput'); // Get search input element
            const customHiddenInput = document.getElementById('customHiddenKeywords'); // Get custom hidden input

            // Reset filters to default first (including new keyword fields)
            document.getElementById('timeFilterNone').checked = true;
            document.getElementById('sellerAmazon').checked = true; // Default might vary based on config, but presets override
            document.getElementById('reviewsFilter').checked = false;
            document.getElementById('filterExcludeBrands').checked = false; // Presets can override this
            document.getElementById('minPrice').value = '';
            document.getElementById('maxPrice').value = '';
            document.getElementById('sortOrder').value = config.sortOrders[0]?.value || 'custom'; // Reset to first available sort or 'custom'
            productTypeSelect.value = productTypeAvailability[marketplace]?.[0] || 'custom'; // Reset to first available or 'custom'
            departmentSelect.value = ''; // Reset department
            categorySelect.value = ''; // Reset category
            searchInput.value = ''; // <-- Reset search input
            customHiddenInput.value = ''; // <-- Reset custom hidden keywords
            searchInput.dispatchEvent(new Event('input')); // <-- Trigger input event for UI update (like clear button)

            // Handle "No Preset" selection
            if (!selectedPreset) {
                // Reset necessary dependent UI elements after resetting fields
                productTypeSelect.dispatchEvent(new Event('change'));
                setTimeout(() => {
                    departmentSelect.dispatchEvent(new Event('change')); // Updates categories, filters
                    updateMarketplaceFilters(); // Re-apply marketplace defaults if needed
                    updateGeneratedUrl();
                }, 100);
                return; // EXIT FUNCTION EARLY for "No Preset"
            }

            // Find the selected preset configuration
            const preset = presets.find(p => p.value === selectedPreset);

            if (preset) {
                const settings = preset.settings;

                // --- Apply NEW keyword settings FIRST ---
                if (settings.searchKeywords !== undefined) {
                    searchInput.value = settings.searchKeywords;
                    // Trigger input event AFTER setting value for UI consistency (e.g., clear button)
                    // Ensure suggestions are triggered if enabled
                     setTimeout(() => searchInput.dispatchEvent(new Event('input')), 0);
                }
                if (settings.customHiddenKeywords !== undefined) {
                    customHiddenInput.value = settings.customHiddenKeywords;
                }
                // --- End Apply NEW keyword settings ---

                // Apply product type - affects department potentially
                if (settings.productType !== undefined) {
                    productTypeSelect.value = settings.productType;
                    productTypeSelect.dispatchEvent(new Event('change')); // Triggers department update if mapped
                }

                // Apply department AFTER product type (product type might change it)
                // Use a small delay to ensure product type change effects settle
                setTimeout(() => {
                    if (settings.department !== undefined) {
                        departmentSelect.value = settings.department;
                        departmentSelect.dispatchEvent(new Event('change')); // Triggers category options, filter updates

                        // Apply category only AFTER department is set and options are populated
                        if (settings.category !== undefined) {
                            // Further delay needed for category options to populate
                            setTimeout(() => {
                                categorySelect.value = settings.category;
                                categorySelect.dispatchEvent(new Event('change')); // Ensure URL updates if category changes
                            }, 50);
                        }
                    }

                     // Apply sort order AFTER department change (department might change sort options)
                    if (settings.sortOrder !== undefined) {
                         // Apply sort order after department/category potentially updated options
                         setTimeout(() => {
                            document.getElementById('sortOrder').value = settings.sortOrder;
                            document.getElementById('sortOrder').dispatchEvent(new Event('change')); // Ensure URL updates
                         }, 100); // Increased delay slightly
                    }

                    // Apply other filters
                    if (settings.timeFilter) {
                        document.getElementById(settings.timeFilter).checked = true;
                    } else {
                         document.getElementById('timeFilterNone').checked = true; // Ensure default if not specified
                    }

                    if (settings.reviewsFilter !== undefined) {
                        document.getElementById('reviewsFilter').checked = !!settings.reviewsFilter;
                    } else {
                         document.getElementById('reviewsFilter').checked = false; // Default if not specified
                    }

                    if (settings.excludeBrands !== undefined) {
                        document.getElementById('filterExcludeBrands').checked = !!settings.excludeBrands;
                    } else {
                        document.getElementById('filterExcludeBrands').checked = false; // Default if not specified
                    }
                     // Apply price range
                    document.getElementById('minPrice').value = settings.minPrice !== undefined ? settings.minPrice : '';
                    document.getElementById('maxPrice').value = settings.maxPrice !== undefined ? settings.maxPrice : '';


                    // Final URL update after all settings have had time to apply
                    setTimeout(updateGeneratedUrl, 200); // Delay final update

                }, 50); // Delay for department/sort/etc. application

            } else {
                 // Fallback if preset definition not found (shouldn't happen normally)
                 updateGeneratedUrl();
            }
        }*/

        // --- Replace your ENTIRE existing applyPreset function with this ---
        function applyPreset() {
            const selectedPresetValue = document.getElementById('presetsSelect').value;
            console.log("--- [applyPreset CALLED] --- Selected Preset Value:", selectedPresetValue);

            const marketplace = marketplaceSelect.value;
            const presets = presetConfigs[marketplace] || presetConfigs.com;
            const marketplaceSpecificConfig = marketplaceConfig[marketplace] || marketplaceConfig.com;
            const searchInputElem = document.getElementById('searchInput');
            const customHiddenInputElem = document.getElementById('customHiddenKeywords');
            const availableProductTypes = productTypeAvailability[marketplace] || productTypeAvailability.com;
            const sortOrderDropdown = document.getElementById('sortOrder'); // Cache for easier access

            // 1. Reset all filter fields to a baseline default
            document.getElementById('timeFilterNone').checked = true;
            document.getElementById('sellerAmazon').checked = true; // Default state
            document.getElementById('reviewsFilter').checked = false;
            document.getElementById('filterExcludeBrands').checked = false;
            document.getElementById('minPrice').value = '';
            document.getElementById('maxPrice').value = '';
            // sortOrderDropdown.value will be set by updateSortOrderOptions via department change
            productTypeSelect.value = availableProductTypes[0] || 'custom';
            departmentSelect.value = '';
            categorySelect.innerHTML = '<option value="">No Category Filter</option>';
            categorySelect.disabled = true;
            searchInputElem.value = '';
            customHiddenInputElem.value = '';
            searchInputElem.dispatchEvent(new Event('input')); // Update clear button UI

            // 2. Handle "No Preset" selection
            if (!selectedPresetValue) {
                console.log("[applyPreset] No Preset selected. Resetting and dispatching changes.");
                // Dispatch department change first, as it affects sort/category options
                departmentSelect.dispatchEvent(new Event('change'));
                setTimeout(() => {
                    // Then product type can update department if needed,
                    // and its own listener will handle keyword overrides if any were active.
                    productTypeSelect.dispatchEvent(new Event('change'));
                    // updateMarketplaceFilters(); // This is implicitly called by departmentSelect change
                    updateGeneratedUrl();
                }, 50); // Short delay for department change to process
                return;
            }

            // 3. Find and apply the selected preset
            const preset = presets.find(p => p.value === selectedPresetValue);
            if (preset && preset.settings) {
                const settings = preset.settings;
                console.log("[applyPreset] Applying preset:", selectedPresetValue, "with settings:", JSON.parse(JSON.stringify(settings)));

                // A. Apply core non-dependent preset settings first
                if (settings.timeFilter) document.getElementById(settings.timeFilter).checked = true;
                document.getElementById('reviewsFilter').checked = !!settings.reviewsFilter;
                document.getElementById('filterExcludeBrands').checked = !!settings.excludeBrands;
                document.getElementById('minPrice').value = settings.minPrice || '';
                document.getElementById('maxPrice').value = settings.maxPrice || '';

                // B. Set product type from preset (important for subsequent keyword overrides)
                let presetProductType = productTypeSelect.value; // Fallback to current (which is default after reset)
                if (settings.productType !== undefined && availableProductTypes.includes(settings.productType)) {
                    presetProductType = settings.productType;
                }
                productTypeSelect.value = presetProductType;
                console.log("[applyPreset] ProductType value tentatively set to:", presetProductType);
                // We will dispatch productTypeSelect's change event *later*, after department, category, sort and keywords are set.

                // C. Set department from preset.
                // Dispatching 'change' on department is crucial as it calls updateMarketplaceFilters,
                // which in turn calls the enhanced updateSortOrderOptions.
                // updateSortOrderOptions will then use the active preset (selectedPresetValue) to set the correct sort order.
                const presetDepartment = settings.department !== undefined ? settings.department : '';
                console.log("[applyPreset] Setting Department to:", presetDepartment);
                departmentSelect.value = presetDepartment;
                departmentSelect.dispatchEvent(new Event('change')); // This is key for sort order to be set by preset.

                // D. Use setTimeout to allow department change effects (like category/sort options populating)
                setTimeout(() => {
                    console.log("[applyPreset - setTimeout] Applying category and keywords. Sort should be set by dept. change.");

                    // Set Category (dropdown options should now be populated from department change)
                    if (settings.category !== undefined) {
                        if (categorySelect.querySelector(`option[value="${settings.category}"]`)) {
                            categorySelect.value = settings.category;
                            console.log("[applyPreset - setTimeout] Category set to:", settings.category);
                        } else {
                            console.warn("[applyPreset - setTimeout] Category option not found for preset:", settings.category);
                            categorySelect.value = ""; // Default to "No Category Filter"
                        }
                    }
                    // Note: Sort order value is now primarily set by updateSortOrderOptions,
                    // which was triggered by the departmentSelect.dispatchEvent(new Event('change')) above.
                    // We can log the intended sort for debugging.
                    if (settings.sortOrder !== undefined) {
                        console.log("[applyPreset - setTimeout] Preset *intended* sortOrder:", settings.sortOrder, ". Actual value is now:", sortOrderDropdown.value);
                         // If sortOrderDropdown.value is NOT settings.sortOrder, then the option wasn't available for the current department.
                        if (sortOrderDropdown.value !== settings.sortOrder && sortOrderDropdown.querySelector(`option[value="${settings.sortOrder}"]`)) {
                            // This is a fallback, in case updateSortOrderOptions didn't catch it due to timing.
                            // But ideally, updateSortOrderOptions handles this.
                            console.warn("[applyPreset - setTimeout] Forcing sort order from preset as a fallback:", settings.sortOrder);
                            sortOrderDropdown.value = settings.sortOrder;
                        }
                    }

                    // E. Apply keywords based on the preset's settings and the (preset-defined) productType
                    console.log("[applyPreset - setTimeout] Calling applyPresetKeywordOverrides with ProductType:", productTypeSelect.value);
                    applyPresetKeywordOverrides(settings, productTypeSelect.value);

                    // F. Finally, dispatch the product type change event.
                    // This ensures that if the productType maps to a different department than specified
                    // by the preset, updateDepartmentFromProductType() can adjust it.
                    // The productTypeSelect's change handler will also re-call applyPresetKeywordOverrides
                    // ensuring keywords are correct for the FINAL state.
                    console.log("[applyPreset - setTimeout] Dispatching final change event on productTypeSelect.");
                    productTypeSelect.dispatchEvent(new Event('change'));

                    // G. Final URL update after a short delay for all events to settle.
                    setTimeout(updateGeneratedUrl, 100);

                }, 200); // Increased delay to ensure department change fully processes before proceeding

            } else {
                console.warn("[applyPreset] Preset not found or has no settings:", selectedPresetValue);
                // If preset not found, make sure UI reflects the "No Preset" state by re-triggering changes
                departmentSelect.dispatchEvent(new Event('change'));
                setTimeout(() => {
                    productTypeSelect.dispatchEvent(new Event('change'));
                    updateGeneratedUrl();
                }, 50);
            }
        }
        // --- End of corrected applyPreset function ---
        
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
                console.error('Could not copy ZIP code: ', err);
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
                console.error('Could not copy text: ', err);
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

        // Function to add category selection based on rh or bbn input FRONTEND SELECTION
        /*    <select id="categoryParamType" class="form-control mt-2">
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
            } */

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

// Suggestions Expander (jQuery section)
$(document).ready(function() {
    // --- Cache DOM elements ---
    const searchInput = $("#searchInput");
    const suggestionsContainer = $("#suggestionsContainer");
    const marketplaceSelect = $("#marketplaceSelect");
    const clearSearchBtn = $("#clearSearchBtn");
    const kwSuggestionsCheckbox = $("#kwsuggestions");
    const suggestionDepartmentSelect = $("#suggestionDepartmentSelect");
    // --- Cache NEW elements ---
    const suggestionActionsContainer = $("#suggestionActions");
    const downloadCsvBtn = $("#downloadCsvBtn");
    const copySuggestionsBtn = $("#copySuggestionsBtn");
    // --- End Cache ---

    // --- Configuration ---
    const MAX_KEYWORDS_IN_SEARCH = 1000; // Max Keywords, recommended 500
    const SUGGESTION_DEBOUNCE_MS = 300; // Delay after typing stops
    const RENDER_DELAY_MS = 500; // Small delay before rendering, recommended 500ms

    // --- State ---
    let currentMarketplace = getMarketplace();
    let suggestionTimeoutId;
    let currentDisplayedKeywords = []; // Variable to hold the final list of displayed keywords

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

    // --- NEW Helper Function to Update Button States ---
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
    // --- End NEW Helper Function ---

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

        const suggestUrl = `https://completion.${marketplace.domain}/api/2017/suggestions?${params.toString()}`;

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
             searchInput.val(keyword); // Use original case keyword when clicked
             suggestionsContainer.empty().css('display', 'none');
             searchInput.focus();
             currentDisplayedKeywords = []; // Clear list as suggestion is chosen
             updateActionButtonsState(); // Update buttons
         });

         suggestionsContainer.append(item);
     }


    // Modify renderCategorizedSuggestions to store keywords and update buttons
    function renderCategorizedSuggestions(search, results) {
        suggestionsContainer.empty(); // Clear previous UI
        currentDisplayedKeywords = []; // Clear internal keyword list

        const mainKeywordsSet = new Set();
        const allDisplayedKeywordsSet = new Set();
        let keywordCount = 0;
        let otherTitleDisplayed = false;

        // Pre-populate mainKeywordsSet for de-duplication logic
        const initialMainKeywords = parseResults(results[0] || { suggestions: [] });
        initialMainKeywords.forEach(kw => mainKeywordsSet.add(kw));

        // --- Loop through API result categories (results[0] = Main, results[1] = Before, etc.) ---
        for (let i = 0; i < results.length; i++) {
            if (keywordCount >= MAX_KEYWORDS_IN_SEARCH) break; // Stop if max is reached

            const currentResultData = results[i] || { suggestions: [] };
            const keywordsRaw = parseResults(currentResultData);
            let keywordsToAddInCategory = [];
            let suggestionType = "";
            let groupClass = "";

            // --- Filter keywords based on category index and uniqueness ---
            if (i === 0) { // Main Suggestions (index 0)
                suggestionType = "Amazon Suggestions";
                groupClass = "group-main";
                keywordsRaw.forEach(kw => {
                    // Add if not already displayed anywhere and under the limit
                    if (!allDisplayedKeywordsSet.has(kw) && keywordCount < MAX_KEYWORDS_IN_SEARCH) {
                        keywordsToAddInCategory.push(kw);
                        allDisplayedKeywordsSet.add(kw); // Track all displayed keywords
                    }
                });
            } else { // Other suggestion types (Before, After, Between, Other)
                keywordsRaw.forEach(kw => {
                    // Add if NOT in main suggestions, NOT already displayed, and under the limit
                    if (!mainKeywordsSet.has(kw) && !allDisplayedKeywordsSet.has(kw) && keywordCount < MAX_KEYWORDS_IN_SEARCH) {
                        keywordsToAddInCategory.push(kw);
                        allDisplayedKeywordsSet.add(kw); // Track all displayed keywords
                    }
                });

                // Determine title and class based on index 'i'
                switch (i) {
                    case 1: suggestionType = "Keywords Before"; groupClass = "group-before"; break;
                    case 2: suggestionType = "Keywords After"; groupClass = "group-after"; break;
                    case 3: // Between (only show title if keywords exist for this specific type)
                        if (results[3] && results[3].suggestions && results[3].suggestions.length > 0 && keywordsToAddInCategory.length > 0) {
                             suggestionType = "Keywords Between"; groupClass = "group-between";
                        } else { suggestionType = ""; } // No title if no specific 'between' keywords
                        break;
                    default: suggestionType = "Other"; groupClass = "group-other"; break; // Indices 4, 5, 6+ fall here
                }
            }

            // --- Append Title and Items if keywords exist for this category ---
            if (keywordsToAddInCategory.length > 0 && suggestionType) {
                let shouldAddTitle = true;
                // Special handling for "Other" title - only show it once
                if (suggestionType === "Other") {
                    if (!otherTitleDisplayed) {
                        otherTitleDisplayed = true; // Mark as displayed
                    } else {
                        shouldAddTitle = false; // Don't add "Other" title again
                    }
                }

                // Append the title directly to the main container if needed
                if (shouldAddTitle) {
                    suggestionsContainer.append($('<h3></h3>').text(suggestionType));
                }

                // Append each item and STORE the keyword internally
                keywordsToAddInCategory.forEach(keyword => {
                    if (keywordCount < MAX_KEYWORDS_IN_SEARCH) {
                        addKeywordItem(keyword, search, groupClass); // Add item to UI
                        currentDisplayedKeywords.push(keyword);    // Store the added keyword
                        keywordCount++;
                    }
                });
            }
        } // --- End Loop ---

        // --- Final Show/Hide and Button Update ---
        if (keywordCount > 0) {
            suggestionsContainer.css('display', 'flex'); // Show container if keywords were added
        } else {
            suggestionsContainer.css('display', 'none'); // Hide if empty
            currentDisplayedKeywords = []; // Ensure list is empty if nothing is shown
        }
        updateActionButtonsState(); // Update CSV/Copy button state
    }


    // Modify fetchAndDisplaySuggestions to handle clearing state
    function fetchAndDisplaySuggestions(search) {
        const trimmedSearch = search.trim();
        const rawSearch = searchInput.val(); // Use raw value for API calls consistency
        const words = trimmedSearch.split(" ").filter(w => w !== "");
        const marketplace = currentMarketplace;

        if (!trimmedSearch) {
            suggestionsContainer.empty().hide();
            clearSearchBtn.hide();
            currentDisplayedKeywords = []; // Clear list
            updateActionButtonsState(); // Update buttons
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
                            currentDisplayedKeywords = []; // Clear list
                            updateActionButtonsState(); // Update buttons
                        }
                     }, RENDER_DELAY_MS);
                } else { // Input changed before suggestions even arrived
                    suggestionsContainer.css('display', 'none');
                    currentDisplayedKeywords = []; // Clear list
                    updateActionButtonsState(); // Update buttons
                }
            })
            .catch(error => {
                console.error('Error fetching one or more suggestions:', error);
                suggestionsContainer.empty().hide(); // Hide on error
                currentDisplayedKeywords = []; // Clear list
                updateActionButtonsState(); // Update buttons
            });
    }

    // --- Event Handlers ---

    // Checkbox Handler (Modified for Action Buttons)
    kwSuggestionsCheckbox.on('change', function() {
        const isChecked = $(this).is(':checked');
        suggestionDepartmentSelect.toggle(isChecked);
        suggestionActionsContainer.toggle(isChecked); // Toggle action buttons visibility

        if (!isChecked) {
            clearTimeout(suggestionTimeoutId);
            suggestionsContainer.empty().css('display', 'none');
            currentDisplayedKeywords = []; // Clear keyword list
        } else {
            // If checking the box, re-trigger suggestions if input has text
            const currentQuery = searchInput.val();
            if (currentQuery.trim()) {
                fetchAndDisplaySuggestions(currentQuery);
            }
        }
        // Always update button state after toggling visibility or potentially clearing list
        updateActionButtonsState();
    });

    // Department Select Handler
    suggestionDepartmentSelect.on('change', function() {
        // Re-fetch suggestions only if the feature is enabled
        if (kwSuggestionsCheckbox.is(':checked')) {
            const currentQuery = searchInput.val();
            if (currentQuery.trim()) {
                clearTimeout(suggestionTimeoutId); // Clear pending fetch from typing
                fetchAndDisplaySuggestions(currentQuery); // Fetch immediately
            }
        }
    });

    // Search Input Handler (Modified for Action Buttons state)
    searchInput.on('input', function() {
        const query = $(this).val();
        clearTimeout(suggestionTimeoutId); // Clear previous debounce timer

        // Always manage clear button visibility
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
            return; // Exit
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

    // Clear Button Handler (Modified for Action Buttons state)
    clearSearchBtn.on('click', function() {
        searchInput.val('');
        suggestionsContainer.empty().css('display', 'none');
        $(this).hide();
        searchInput.focus();
        currentDisplayedKeywords = []; // Clear list
        updateActionButtonsState(); // Update buttons
    });

    // Marketplace Select Handler (Modified for Action Buttons state)
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

    // Document Click Handler (Modified to ignore Action Buttons)
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

    // --- Add Handlers for New CSV/Copy Buttons ---
    downloadCsvBtn.on('click', function() {
        if ($(this).prop('disabled') || currentDisplayedKeywords.length === 0) {
            return;
        }

        isDownloadingCsv = true; // <-- Set the flag before starting download

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
        link.click(); // Simulate click
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        // --- Reset the flag shortly after the click simulation ---
        // Use setTimeout to ensure it runs after the click event finishes processing
        setTimeout(() => {
            isDownloadingCsv = false;
        }, 0);
        // --- End Reset flag ---
    });

    copySuggestionsBtn.on('click', function() {
        if ($(this).prop('disabled') || currentDisplayedKeywords.length === 0) {
            return; // Extra safety check
        }

        const textToCopy = currentDisplayedKeywords.join("\n"); // Newline separated
        const button = $(this);
        const originalText = button.text(); // Store original text ("COPY")

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
            console.error('Failed to copy suggestions:', err);
            button.addClass('copy-error-feedback').text('FAIL!');
            setTimeout(() => {
                 // Reset after timeout only if text is still 'FAIL!'
                 if(button.text() === 'FAIL!') {
                      button.removeClass('copy-error-feedback').text(originalText);
                 }
            }, 1500);
        });
    });
    // --- End Add Handlers ---

    // --- Initial Setup ---
    clearSearchBtn.hide(); // Initially hide clear button

    // Set initial visibility for suggestion controls based on checkbox state
    const initialCheckboxState = kwSuggestionsCheckbox.is(':checked');
    suggestionDepartmentSelect.toggle(initialCheckboxState);
    suggestionActionsContainer.toggle(initialCheckboxState);

    // Ensure buttons start in the correct enabled/disabled state (always disabled initially)
    updateActionButtonsState();

}); // --- End $(document).ready ---

// Suggestions Expander
/*$(document).ready(function() {
    const searchInput = $("#searchInput");
    const suggestionsContainer = $("#suggestionsContainer");
    const marketplaceSelect = $("#marketplaceSelect");
    const clearSearchBtn = $("#clearSearchBtn");

    // --- Configuration ---
    const MAX_KEYWORDS_IN_SEARCH = 1000; // Max Keywords, recommended 500
    const SUGGESTION_DEBOUNCE_MS = 300; // Delay after typing stops
    const RENDER_DELAY_MS = 500; // Small delay before rendering, recommended 500ms

    const kwSuggestionsCheckbox = $("#kwsuggestions");
    const suggestionDepartmentSelect = $("#suggestionDepartmentSelect");

    // --- State ---
    let currentMarketplace = getMarketplace();
    let suggestionTimeoutId;

    // --- Utility Functions ---
    // Debug helper (optional)
    function debugResponse(apiType, queryFirst, queryLast, response) {
        // console.groupCollapsed(`Suggestions Debug [${apiType}]: "${queryFirst}|${queryLast}"`);
        // console.log('Prefix:', queryFirst);
        // console.log('Suffix:', queryLast);
        // console.log('API Response:', response);
        // console.groupEnd();
        return response; // Pass through
    }

    // Get marketplace details from dropdown
    function getMarketplace() {
        const selectedValue = marketplaceSelect.val() || "com"; // Default to com if null
        const domainConfig = {
             "com": { domain: "amazon.com", market: "ATVPDKIKX0DER" },
             // "ca": { domain: "amazon.ca", market: "A2EUQ1WTGCTBG2" },
             "co.uk": { domain: "amazon.co.uk", market: "A1F83G8C2ARO7P" },
             "de": { domain: "amazon.de", market: "A1PA6795UKMFR9" },
             "fr": { domain: "amazon.fr", market: "A13V1IB3VIYZZH" },
             "it": { domain: "amazon.it", market: "APJ6JRA9NG5V4" },
             "es": { domain: "amazon.es", market: "A1RKKUPIHCS9HS" }
             //"com.mx": { domain: "amazon.com.mx", market: "A1AM78C64UM0Y8" },
             //"com.au": { domain: "amazon.com.au", market: "A39IBJ37TRP1C6" },
             //"co.jp": { domain: "amazon.co.jp", market: "A1VC38TJH7YXB5" }
        };
        return domainConfig[selectedValue];
    }

    // --- Core Suggestion Logic ---
    // Fetch suggestions from Amazon API
    function getSuggestions(queryFirst, queryLast, marketplace, apiType = 'Generic') {
        // Get the selected department alias from the new dropdown
        let departmentQuery = suggestionDepartmentSelect.val();
        // Default to 'aps' if the selection is somehow empty/invalid or specifically 'aps'
        if (!departmentQuery || departmentQuery === "" || departmentQuery === "aps") {
            departmentQuery = 'aps';
        }
        
        const params = new URLSearchParams({
            //'session-id': '131-6229116-2226265', // random ones 'customer-id': 'A1CNYR04B8CZOZ', // random ones 'request-id': '35R5TZN3EY6RCFVHSMYT', // random ones 'page-type': 'Gateway',// random ones 'lop': 'en_US', // random ones 'b2b': '1', // random ones seems to be value "1" if you are logged in with a bussines account and "0" with non business. 'fresh': '0', // random ones 'ks': '69', // random ones 'client-info': 'search-ui', // random ones
            'site-variant': 'desktop',
            'mid': marketplace.market,
            'alias': departmentQuery,
            'prefix': queryFirst || "",
            'suffix': queryLast || ""
        });

        const suggestUrl = `https://completion.${marketplace.domain}/api/2017/suggestions?${params.toString()}`;
        // console.log(`Requesting [${apiType} / ${departmentQuery}]: ${suggestUrl}`); // Log the URL being requested

        return fetch(suggestUrl)
            .then(response => {
                if (!response.ok) {
                    // console.error(`Network/Fetch Error for ${apiType} (${departmentQuery} / ${suggestUrl}):`, error); // updated log
                    // Return empty structure on error to match Promise.all expectations
                    return { suggestions: [] };
                }
                // Return the parsed JSON directly if OK
                return response.json().catch(e => {
                    // Handle potential JSON parse errors even on OK responses (though rare)
                     // console.error(`JSON Parse Error on OK response for ${apiType}:`, e, "URL:", suggestUrl);
                     return { suggestions: [] };
                });
            })
            .then(jsonData => {
                 // Ensure jsonData is an object with at least suggestions array
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
                 // Return empty structure on fetch error
                 return { suggestions: [] };
            });
    }

    // Parse keywords from API response object (Matches recommended logic)
    function parseResults(data) {
        let keywords = [];
        // Check if data is valid object and has suggestions array
        if (data && typeof data === 'object' && Array.isArray(data.suggestions)) {
            keywords = data.suggestions
                .filter(value => value.type === "KEYWORD")
                .map(value => {
                    // Prefer concatenated highlightFragments if available (like recommended)
                    if (value.highlightFragments && value.highlightFragments.length > 0) {
                        return value.highlightFragments.map(fragment => fragment.text).join('');
                    }
                    return value.value || ''; // Fallback to value, ensure string
                })
                .filter(kw => typeof kw === 'string' && kw.trim() !== ''); // Ensure non-empty strings
        } else if (data && typeof data === 'object' && !Array.isArray(data.suggestions)) {
            // console.warn("parseResults received object without suggestions array:", data);
             return []; // Return empty array if suggestions isn't an array
        } else if (!data || typeof data !== 'object') {
            // console.warn("parseResults received invalid data:", data);
            return []; // Return empty array if data is not a valid object
        }
        // console.debug("Parsed Keywords:", keywords);
        return keywords;
    }

// Ensure escapeHtml function exists before this one
function escapeHtml(unsafe) {
    if (typeof unsafe !== 'string') { return ''; }
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

function addKeywordItem(keyword, search, groupClass) {
    const item = $('<div class="suggestion-item"></div>').addClass(groupClass);

    const matchIndex = keyword.indexOf(search);
    let before = '', match = '', after = '';

    if (search.length > 0 && matchIndex > -1) {
        before = keyword.substring(0, matchIndex);
        match = keyword.substring(matchIndex, matchIndex + search.length);
        after = keyword.substring(matchIndex + search.length);
    } else {
        before = keyword;
        match = '';
        after = '';
    }

    // --- This is the corrected HTML creation line using BACKTICKS ` ` ---
    item.html(
        `<span class="s-heavy">${escapeHtml(before)}</span>${escapeHtml(match)}<span class="s-heavy">${escapeHtml(after)}</span>`
    );
    // --- End Corrected HTML ---

    item.attr('data-keyword', keyword);

    item.on('click', () => {
        searchInput.val(keyword);
        suggestionsContainer.empty().css('display', 'none');
        searchInput.focus();
    });

    // Append item directly to the main suggestionsContainer
    // (This matches the logic in your current renderCategorizedSuggestions)
    suggestionsContainer.append(item);
}
// END PASTE

// Renders titles and items directly into the container
function renderCategorizedSuggestions(search, results) {
    
        // *** To Debug Inputs ***
        // console.log("--- Rendering Suggestions ---");
        // console.log("Search Term:", search);
        // console.log("Raw Results Array Length:", results.length);
        // Log the parsed content of the first few results arrays
        // if(results[0]) console.log("Parsed results[0] (Main):", parseResults(results[0]));
        // if(results[1]) console.log("Parsed results[1] (Before):", parseResults(results[1])); // <<<--- LOOK AT THIS ONE
        // if(results[2]) console.log("Parsed results[2] (After):", parseResults(results[2]));
    
    suggestionsContainer.empty(); // Clear previous

    const mainKeywordsSet = new Set();
    const allDisplayedKeywordsSet = new Set();
    let keywordCount = 0; // Total keywords added
    const MAX_KEYWORDS_IN_SEARCH = 500;
    let otherTitleDisplayed = false;

    // --- Pre-populate mainKeywordsSet ---
    const initialMainKeywords = parseResults(results[0] || { suggestions: [] });
    initialMainKeywords.forEach(kw => mainKeywordsSet.add(kw));

    // --- Loop through results (categories) ---
    for (let i = 0; i < results.length; i++) {
        if (keywordCount >= MAX_KEYWORDS_IN_SEARCH) break;

        const currentResultData = results[i] || { suggestions: [] };
        const keywordsRaw = parseResults(currentResultData);
        // Use 'i' if your loop is a for loop, 'index' if it's forEach with index
// console.log(`[DEBUG] parseResults[${i}] returned:`, JSON.stringify(keywordsRaw)); // Changed index to i
        let keywordsToAddInCategory = []; // Keywords to add for *this* category
        let suggestionType = "";
        let groupClass = "";

        // --- Filter keywords for uniqueness ---
        if (i === 0) { // Main Suggestions
            suggestionType = "Amazon Suggestions";
            groupClass = "group-main";
            keywordsRaw.forEach(kw => {
                if (!allDisplayedKeywordsSet.has(kw) && keywordCount < MAX_KEYWORDS_IN_SEARCH) {
                    keywordsToAddInCategory.push(kw);
                    allDisplayedKeywordsSet.add(kw);
                }
            });
        } else { // Other categories
            keywordsRaw.forEach(kw => {
                if (!mainKeywordsSet.has(kw) && !allDisplayedKeywordsSet.has(kw) && keywordCount < MAX_KEYWORDS_IN_SEARCH) {
                    keywordsToAddInCategory.push(kw);
                    allDisplayedKeywordsSet.add(kw);
                }
            });
            // Determine type/class
            switch(i) { // ... same switch logic as before ... 
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

        // --- Append Title and Items directly to container if keywords exist ---
        if (keywordsToAddInCategory.length > 0 && suggestionType) {
            let shouldAddTitle = true;
            if (suggestionType === "Other") {
                if (!otherTitleDisplayed) {
                    otherTitleDisplayed = true;
                } else {
                    shouldAddTitle = false; // Only add "Other" title once
                }
            }

            // Append the title directly to the main container
            if (shouldAddTitle) {
                suggestionsContainer.append($('<h3></h3>').text(suggestionType));
            }

            // Append each item for this category directly to the main container
            keywordsToAddInCategory.forEach(keyword => {
                 if (keywordCount < MAX_KEYWORDS_IN_SEARCH) {
                     addKeywordItem(keyword, search, groupClass); // Call modified function
                     keywordCount++;
                 }
            });
        }
    }
    // End loop

    // --- Final Show/Hide ---
    if (keywordCount > 0) {
        suggestionsContainer.css('display', 'flex');
    } else {
        suggestionsContainer.css('display', 'none');
    }
}


    // Fetches all suggestion types and triggers rendering
    function fetchAndDisplaySuggestions(search) {
        const trimmedSearch = search.trim(); // Use trimmed for logic/highlighting
        if (!trimmedSearch) {
            suggestionsContainer.empty().hide();
            clearSearchBtn.hide();
            return;
        }
        clearSearchBtn.show();

        // Use the potentially un-trimmed search for API calls where the recommended did
        const rawSearch = searchInput.val(); // Get the exact current value for accuracy
        const words = trimmedSearch.split(" ").filter(w => w !== ""); // Clean empty words from trimmed version
        const marketplace = currentMarketplace; // Use the currently selected marketplace

        // console.log(`Workspaceing suggestions for: "${rawSearch}" (trimmed: "${trimmedSearch}")`); // Debug log

        // Define all API calls as per recommended logic (indices 0-6)
        let promises = [
            // 0. Main/Default (uses raw search like recommended)
            getSuggestions(rawSearch, "", marketplace, 'Main'),
            // 1. Before (uses space prefix, trimmed search suffix like recommended)
            getSuggestions(" ", trimmedSearch, marketplace, 'Before'),
            // 2. After (uses trimmed search + space prefix like recommended)
            getSuggestions(trimmedSearch + " ", "", marketplace, 'After'),
            // 3. Between (uses split words like recommended, conditional)
            (words.length >= 2
                ? getSuggestions(words[0] + " ", " " + words.slice(1).join(" "), marketplace, 'Between')
                : Promise.resolve({ suggestions: [] }) // Resolve empty if not applicable
            ),
            // 4. Expansion: for (uses raw search like recommended)
            getSuggestions(rawSearch + " for ", "", marketplace, 'Exp: for'),
            // 5. Expansion: and (uses raw search like recommended)
            getSuggestions(rawSearch + " and ", "", marketplace, 'Exp: and'),
            // 6. Expansion: with (uses raw search like recommended)
            getSuggestions(rawSearch + " with ", "", marketplace, 'Exp: with')
        ];

        Promise.all(promises)
            .then((results) => {
                // Check if the search input value hasn't changed while waiting
                if (searchInput.val() === rawSearch) {
    setTimeout(() => {
        if (searchInput.val() === rawSearch) {
             renderCategorizedSuggestions(trimmedSearch, results);
        } else {
             // console.log("Search input changed during render delay. Ignoring old results.");
             suggestionsContainer.css('display', 'none'); // CHANGE HERE
        }
    }, RENDER_DELAY_MS);
} else {
    // console.log("Search input changed before suggestions arrived. Ignoring old results.");
    suggestionsContainer.css('display', 'none'); // CHANGE HERE
}
            })
            .catch(error => {
                // console.error('Error fetching one or more suggestions:', error);
                suggestionsContainer.empty().hide(); // Hide on error
            });
    }


    // --- Event Handlers ---

        // --- Add a new event handler for the checkbox itself ---
kwSuggestionsCheckbox.on('change', function() {
        if (!$(this).is(':checked')) {
            // If UNCHECKED:
            clearTimeout(suggestionTimeoutId);
            suggestionsContainer.empty().css('display', 'none');
            suggestionDepartmentSelect.hide(); // <-- HIDE the dropdown
        } else {
            // If CHECKED:
            suggestionDepartmentSelect.show(); // <-- SHOW the dropdown
            // Optional: Re-trigger suggestions if needed
            const currentQuery = searchInput.val();
            if (currentQuery.trim()) {
                fetchAndDisplaySuggestions(currentQuery);
            }
        }
    });
    
    suggestionDepartmentSelect.on('change', function() {
        // When the department changes, refresh suggestions if enabled and input has text
        if (kwSuggestionsCheckbox.is(':checked')) {
            const currentQuery = searchInput.val();
            if (currentQuery.trim()) {
                clearTimeout(suggestionTimeoutId); // Clear any pending fetch from typing
                fetchAndDisplaySuggestions(currentQuery); // Fetch immediately with new department
            }
        }
    });

    // Handle input changes with debounce
    searchInput.on('input', function() {
        const query = $(this).val(); // Get raw value
        clearTimeout(suggestionTimeoutId); // Clear previous timer
        
    // ***** START MODIFICATION *****
    // If KW suggestions are disabled, just manage the clear button and hide suggestions
    if (!kwSuggestionsCheckbox.is(':checked')) {
        if (query.trim()) {
            clearSearchBtn.show();
        } else {
            clearSearchBtn.hide();
        }
        suggestionsContainer.empty().css('display', 'none'); // Ensure suggestions are hidden
        return; // Exit early, don't fetch suggestions
    }
    // ***** END MODIFICATION *****

    // Original logic (runs only if checkbox is checked)
    if (query.trim()) { // Check trimmed value for showing button/triggering fetch
        clearSearchBtn.show();
        suggestionTimeoutId = setTimeout(() => {
            fetchAndDisplaySuggestions(query); // Pass the raw query
        }, SUGGESTION_DEBOUNCE_MS);
    } else {
        suggestionsContainer.empty().css('display', 'none'); // Hide immediately if effectively empty
        clearSearchBtn.hide();
    }
    });

    // Handle clear button click
     clearSearchBtn.on('click', function() {
         searchInput.val(''); // Clear the input
         suggestionsContainer.empty().css('display', 'none'); // Hide suggestions
         $(this).hide(); // Hide the clear button itself
         searchInput.focus(); // Focus the input
     });

    // Update marketplace and potentially trigger new suggestions if input has value
    marketplaceSelect.on('change', function() {
        currentMarketplace = getMarketplace();
        const currentQuery = searchInput.val(); // Get raw value
        if (currentQuery.trim()) {
            // Immediately refresh suggestions for the new marketplace
             clearTimeout(suggestionTimeoutId); // Clear any pending suggestion fetch
             fetchAndDisplaySuggestions(currentQuery); // Use raw query
            // console.log(`Refetching suggestions for "${currentQuery}" in ${currentMarketplace.domain}`);
        }
    });

    // OLD CODE
    // Hide suggestions when clicking outside
    // $(document).on('click', (event) => {
        // Check if the click target is NOT the input or suggestion areas or clear button
    //    if (!$(event.target).closest(searchInput).length &&
    //        !$(event.target).closest(suggestionsContainer).length &&
    //        !$(event.target).closest(clearSearchBtn).length)
    //    {
    //        suggestionsContainer.css('display', 'none'); // Hide without clearing, allows reopening
    //    }
    // });
    // Hide suggestions when clicking outside ONLY IF the checkbox is unchecked
    $(document).on('click', (event) => {
        // Check if the click happened outside of all relevant suggestion controls:
        // - Search Input
        // - Suggestions Container
        // - Clear Button
        // - Suggestion Department Dropdown
        // - KW Suggestions Checkbox
        // - KW Suggestions Label
        if (!$(event.target).closest(searchInput).length &&
                !$(event.target).closest(suggestionsContainer).length &&
                !$(event.target).closest(clearSearchBtn).length &&
                !$(event.target).closest(suggestionDepartmentSelect).length && // Added dropdown check
                !$(event.target).closest(kwSuggestionsCheckbox).length &&      // Added checkbox check
                !$(event.target).closest('label[for="kwsuggestions"]').length) // Added label check
            {
                // --- MODIFICATION START ---
                // Only hide the suggestions via outside click if the feature is actually disabled
                if (!kwSuggestionsCheckbox.is(':checked')) {
                     suggestionsContainer.css('display', 'none');
                }
                // If kwSuggestionsCheckbox IS checked, do nothing on outside click.
                // The visibility will be handled by other events (clearing input, unchecking box).
                // --- MODIFICATION END ---
            }
        });
    
     // Show suggestions when input is focused and has text + results exist
    searchInput.on('focus', function() {
        // ***** START MODIFICATION *****
        // Only show on focus if checkbox is checked AND other conditions met
        if (kwSuggestionsCheckbox.is(':checked') && $(this).val().trim() && suggestionsContainer.children().length > 0) {
            suggestionsContainer.css('display', 'flex');
        }
        // ***** END MODIFICATION *****
    });

    // --- Initial Setup ---
     clearSearchBtn.hide(); // Initially hide clear button

    // Set initial visibility for the dropdown based on the checkbox state
    if (!kwSuggestionsCheckbox.is(':checked')) {
        suggestionsContainer.css('display', 'none'); // Hide suggestions container too
        suggestionDepartmentSelect.hide(); // Hide dropdown if checkbox starts unchecked
    } else {
        suggestionDepartmentSelect.show(); // Ensure dropdown is visible if checkbox starts checked
    }
});
*/
