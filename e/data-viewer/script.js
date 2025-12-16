// ========================================
// EtsyScope Data Viewer - Main Script
// ========================================

// EASY TO ADJUST: Configuration
const CONFIG = {
    cardsPerLoad: 360,           // Initial cards to load
    cardsPerPage: 180,           // Cards to add when "Load More" is clicked
    localStorageKey: 'etsyScopeData',
    settingsKey: 'etsyScopeSettings'
};

// EASY TO ADJUST: Brand/IP List - Add as many as you want
const BRANDLIST = [
    "007", "20th Century Studios", "2K", "A24", "ABC News", "Acer", "Activision", "Acura", "Adidas", "Air Jordan",
    "Airbus", "Alibaba", "AliExpress", "AMD", "American Express", "American Red Cross", "Amex", "Android",
    "Animal Crossing", "Apex Legends", "Apple TV+", "Aprilia", "Aragorn", "Arc'teryx", "Asics", "ASOS",
    "Assassin's Creed", "Aston Martin", "ASUS", "AT&T", "Atari", "Attack on Titan", "Audemars Piguet", "Audi",
    "Avatar: The Last Airbender", "Avengers", "Baby Yoda", "Bacardi", "Back to the Future", "Balenciaga",
    "Bandai Namco", "BAPE", "Barbie", "Baskin-Robbins", "Batman", "BBC", "Ben & Jerry's", "Bentley", "Best Buy",
    "Bethesda", "Binance", "Birkenstock", "Bitcoin", "Black Ops", "Bloodborne", "Bloomberg", "BMW", "Boeing",
    "Bombardier", "Bose", "BTC", "Bud Light", "Budweiser", "Bugatti", "Buick", "Bulgari", "Bundesliga", "Burberry",
    "Burger King", "ByteDance", "Cadillac", "Call of Duty", "Calvin Klein", "Capcom", "Captain Kirk", "Care Bears",
    "Cartier", "Cartoon Network", "Cash App", "CBS", "CDC", "Celine", "Chanel", "Charizard", "Chevrolet", "Chevy",
    "Chick-fil-A", "Chipotle", "Chrysler", "CIA", "CNN", "Coca-Cola", "Coinbase", "Coke", "Columbia Pictures",
    "Coors", "Corsair", "Costco", "Counter-Strike", "Crayola", "Crocs", "Crunchyroll", "CS2", "CS:GO",
    "Cyberpunk 2077", "Dark Souls", "Darth Vader", "DC Comics", "Death Note", "Dell", "Demogorgon", "Demon Slayer",
    "Despicable Me", "Diablo", "Dior", "Disney", "DJI", "Dogecoin", "Dolce & Gabbana", "Domino's", "Donkey Kong",
    "Dota 2", "Dr Pepper", "Dr. Martens", "Dragon Ball", "Dragon Ball Super", "Dragon Ball Z", "DreamWorks",
    "Ducati", "Dumbledore", "Dunkin'", "E.T.", "EA", "eBay", "Elden Ring", "Electronic Arts", "Elgato", "Embraer",
    "Epic Games", "ESA", "ESPN", "ETH", "Ethereum", "Etsy", "F1", "Facebook", "Family Guy", "Fanta",
    "Fantastic Beasts", "FBI", "Fendi", "Ferrari", "FIFA", "Fila", "Fisher-Price", "Fitbit", "Five Guys", "Forbes",
    "Formula 1", "Fortnite", "Fox News", "Frodo", "Fujifilm", "Fullmetal Alchemist", "Funimation", "Funko",
    "Futurama", "G.I. Joe", "Game of Thrones", "Gandalf", "Garfield", "Garmin", "Gatorade", "GeForce",
    "Genshin Impact", "Ghostbusters", "Givenchy", "Gmail", "GMC", "Goku", "Google", "GoPro", "Grand Theft Auto",
    "Grogu", "Gryffindor", "GTA", "Gucci", "Guinness", "Gymshark", "H&M", "Harley-Davidson", "Harry Potter",
    "Hasbro", "HBO", "Heineken", "Hello Kitty", "Hermès", "Hogwarts", "Hoka", "Home Depot", "Honda",
    "Honkai: Star Rail", "Hot Wheels", "House of the Dragon", "House Stark", "How to Train Your Dragon", "HP",
    "Huawei", "Hufflepuff", "Hulu", "Hummer", "Hunter x Hunter", "Hyrule", "Hyundai", "IBM", "IKEA", "Illumination",
    "In-N-Out", "Indiana Jones", "IndyCar", "Infiniti", "Intel", "Jack Daniel's", "James Bond", "Jaws", "JAXA",
    "JBL", "Jedi", "Jeep", "John Wick", "Johnnie Walker", "Jordan", "Jujutsu Kaisen", "Jurassic Park",
    "Jurassic World", "Kawasaki", "KFC", "Kia", "KidKraft", "Kimetsu no Yaiba", "Kingston", "Kirby", "Konami",
    "Korra", "Kraken", "Krispy Kreme", "Krusty Krab", "Kung Fu Panda", "LaLiga", "Lamborghini", "Land Rover",
    "Lannister", "League of Legends", "Lego", "LEGO", "Legolas", "Lenovo", "Levi's", "Lexus", "Lightsaber",
    "Ligue 1", "Lincoln", "LinkedIn", "Lionsgate", "Logitech", "Longines", "Lord of the Rings", "Louis Vuitton",
    "Lowe's", "LPGA", "Lucasfilm", "Lucid", "Luigi", "Lululemon", "LV", "Marvel", "Maserati", "Mastercard",
    "Mattel", "Mazda", "McDonald's", "McLaren", "Melissa & Doug", "Mercedes-Benz", "Meta", "Metroid", "MGM",
    "Microsoft", "Middle-earth", "Miller", "Minecraft", "Mini Cooper", "Minions", "Mission: Impossible",
    "Mitsubishi", "MLB", "MLS", "Modern Warfare", "Mojang", "Moncler", "Monster Energy", "Monster Hunter",
    "Montblanc", "Mortal Kombat", "MotoGP", "Mountain Dew", "MSI", "MTV", "My Hero Academia", "My Little Pony",
    "Naruto", "NASA", "NASCAR", "National Aeronautics and Space Administration", "National Park Service", "NBA",
    "NBC", "NCAA", "Neon Genesis Evangelion", "Nerf", "Nespresso", "Netflix", "New Balance", "New York Times",
    "NFL", "NHL", "Nickelodeon", "Nike", "Nikon", "Nintendo", "Nissan", "NOAA", "Nokia", "NPS", "NVIDIA", "NWSL",
    "Oculus", "Off-White", "Olympics", "One Piece", "OnePlus", "Oppo", "Overwatch", "Panasonic", "Panera",
    "Patek Philippe", "Patrick Star", "Patrón", "PayPal", "Peacock", "Pepsi", "PGA", "Philips", "Pikachu",
    "Pirates of the Caribbean", "Pixar", "Pizza Hut", "Plankton", "Play-Doh", "PlayStation", "Pokeball", "Pokemon",
    "Poké Ball", "Pokémon", "Polestar", "Popeyes", "Porsche", "Power Rangers", "Powerade", "Prada", "Premier League",
    "Prime Video", "Princess Peach", "PUBG", "Qualcomm", "Radeon", "Ralph Lauren", "Rambo", "Range Rover",
    "Ravenclaw", "Razer", "Realme", "Red Bull", "Red Cross", "Red Dead Redemption", "Reebok", "Resident Evil",
    "Reuters", "Rick and Morty", "Riot Games", "Rivian", "Robinhood", "Roblox", "Rockstar Games", "Rolex",
    "Rolls-Royce", "Roscosmos", "RTX", "Rubik's Cube", "Saab", "Sailor Moon", "Saint Laurent", "Samsung", "SanDisk",
    "Sanrio", "Sasuke", "Sauron", "Seagate", "Searchlight", "Sega", "Sennheiser", "Serie A", "Shake Shack", "Shein",
    "Shonen Jump", "Shopify", "Showtime", "Shrek", "Simpsons", "Sith", "Skechers", "Skoda", "Slytherin", "Smirnoff",
    "Snapdragon", "Solana", "Sonic the Hedgehog", "Sonos", "Sony", "Sony Pictures", "South Park", "SpaceX",
    "Splatoon", "Spock", "SpongeBob", "SpongeBob SquarePants", "Spotify", "Sprite", "Square Enix", "Squidward",
    "Star Trek", "Star Wars", "Starbucks", "StarCraft", "Steam Deck", "Steven Universe", "Stormtrooper",
    "Stranger Things", "Street Fighter", "Stripe", "Studio Ghibli", "Studio Pierrot", "Stüssy", "Subaru",
    "Super Mario", "Superman", "Suzuki", "Taco Bell", "TAG Heuer", "Take-Two", "Targaryen", "Team USA",
    "Teenage Mutant Ninja Turtles", "Tekken", "Temu", "The Beatles", "The Godfather", "The Guardian", "The Hobbit",
    "The Legend of Zelda", "The Mandalorian", "The Matrix", "The North Face", "The Simpsons", "The Upside Down",
    "The Wall Street Journal", "The Witcher", "Tiffany & Co.", "Tim Hortons", "TMNT", "Toei Animation",
    "Tokyo Ghoul", "Tommy Hilfiger", "Toyota", "TriStar", "Twitter", "Ubisoft", "UEFA", "UFC", "Ugg",
    "Under Armour", "UNICEF", "Uniqlo", "United Nations", "United States Postal Service", "Universal Studios",
    "USPS", "Valorant", "Valyrian", "Vegeta", "Venmo", "Versace", "Vespa", "Viacom", "Victoria's Secret",
    "Voldemort", "Volkswagen", "Volvo", "VW", "Walmart", "Warcraft", "Warner Bros", "Warner Bros.", "Warzone",
    "Wayfair", "Wendy's", "Western Digital", "WhatsApp", "WHO", "Whole Foods", "Winter is Coming",
    "World Health Organization", "World of Warcraft", "WSJ", "WWE", "X Games", "Xbox", "Xiaomi", "Yahoo", "Yamaha",
    "Yeezy", "Yoshi", "YouTube", "YSL", "Zalando", "Zara", "Zelda",
    "KPop", "Demon Hunters", "HUNTRX", "Grinch", "Huntrix"
];

// ========================================
// Global State
// ========================================
let allListings = [];
let filteredListings = [];
let displayedCount = 0;
let uploadedFiles = [];
let customBrands = []; // NEW: Store custom user-added brands

// ========================================
// DOM Elements
// ========================================
const elements = {
    uploadSection: document.getElementById('uploadSection'),
    viewerSection: document.getElementById('viewerSection'),
    uploadZone: document.getElementById('uploadZone'),
    fileInput: document.getElementById('fileInput'),
    filesList: document.getElementById('filesList'),
    filesContainer: document.getElementById('filesContainer'),
    cardsContainer: document.getElementById('cardsContainer'),
    resultsCount: document.getElementById('resultsCount'),
    filteredCount: document.getElementById('filteredCount'),
    lastUpdated: document.getElementById('lastUpdated'),
    loadMoreContainer: document.getElementById('loadMoreContainer'),
    loadMoreBtn: document.getElementById('loadMoreBtn'),
    searchInput: document.getElementById('searchInput'),
    sortSelect: document.getElementById('sortSelect'),
    filterHideAds: document.getElementById('filterHideAds'),
    filterBestseller: document.getElementById('filterBestseller'),
    filterPopular: document.getElementById('filterPopular'),
    filterEtsysPick: document.getElementById('filterEtsysPick'),
    filterFreeShipping: document.getElementById('filterFreeShipping'),
    productTypeSelect: document.getElementById('productTypeSelect'),
    priceMinSlider: document.getElementById('priceMinSlider'),
    priceMaxSlider: document.getElementById('priceMaxSlider'),
    priceMin: document.getElementById('priceMin'),
    priceMax: document.getElementById('priceMax'),
    reviewMinSlider: document.getElementById('reviewMinSlider'),
    reviewMaxSlider: document.getElementById('reviewMaxSlider'),
    reviewMin: document.getElementById('reviewMin'),
    reviewMax: document.getElementById('reviewMax'),
    ratingMinSlider: document.getElementById('ratingMinSlider'),
    ratingMaxSlider: document.getElementById('ratingMaxSlider'),
    ratingMin: document.getElementById('ratingMin'),
    ratingMax: document.getElementById('ratingMax'),
    clearFiltersBtn: document.getElementById('clearFiltersBtn'),
    addMoreBtn: document.getElementById('addMoreBtn'),
    clearCacheBtn: document.getElementById('clearCacheBtn'),
    exportBtn: document.getElementById('exportBtn'),
    brandFilterToggle: document.getElementById('brandFilterToggle'),
    brandFilterContent: document.getElementById('brandFilterContent'),
    brandCheckboxGrid: document.getElementById('brandCheckboxGrid'),
    selectAllBrands: document.getElementById('selectAllBrands'),
    clearAllBrands: document.getElementById('clearAllBrands')
};

// ========================================
// Initialization
// ========================================
function init() {
    setupEventListeners();
    loadFromLocalStorage();
    loadBrandCheckboxes();
}

// ========================================
// Event Listeners
// ========================================
function setupEventListeners() {
    // Upload
    elements.uploadZone.addEventListener('click', () => elements.fileInput.click());
    elements.fileInput.addEventListener('change', handleFileSelect);

    // Drag & Drop
    elements.uploadZone.addEventListener('dragover', handleDragOver);
    elements.uploadZone.addEventListener('dragleave', handleDragLeave);
    elements.uploadZone.addEventListener('drop', handleDrop);

    // Buttons
    elements.addMoreBtn.addEventListener('click', () => {
        elements.viewerSection.style.display = 'none';
        elements.uploadSection.style.display = 'block';
    });
    elements.clearCacheBtn.addEventListener('click', clearCache);
    elements.exportBtn.addEventListener('click', exportRefinedResults);
    elements.loadMoreBtn.addEventListener('click', loadMoreCards);
    elements.clearFiltersBtn.addEventListener('click', clearAllFilters);

    // Filters
    elements.searchInput.addEventListener('input', debounce(applyFilters, 300));
    elements.sortSelect.addEventListener('change', applyFilters);
    elements.filterHideAds.addEventListener('change', applyFilters);
    elements.filterBestseller.addEventListener('change', applyFilters);
    elements.filterPopular.addEventListener('change', applyFilters);
    elements.filterEtsysPick.addEventListener('change', applyFilters);
    elements.filterFreeShipping.addEventListener('change', applyFilters);
    elements.productTypeSelect.addEventListener('change', applyFilters);

    // Price Range Sliders
    elements.priceMinSlider.addEventListener('input', () => {
        let min = parseFloat(elements.priceMinSlider.value);
        let max = parseFloat(elements.priceMaxSlider.value);
        if (min > max - 1) {
            elements.priceMinSlider.value = max - 1;
        }
        updateRangeDisplay('price');
        updateSliderFill('price');
    });
    elements.priceMaxSlider.addEventListener('input', () => {
        let min = parseFloat(elements.priceMinSlider.value);
        let max = parseFloat(elements.priceMaxSlider.value);
        if (max < min + 1) {
            elements.priceMaxSlider.value = min + 1;
        }
        updateRangeDisplay('price');
        updateSliderFill('price');
    });
    elements.priceMinSlider.addEventListener('change', applyFilters);
    elements.priceMaxSlider.addEventListener('change', applyFilters);

    // Review Range Sliders
    elements.reviewMinSlider.addEventListener('input', () => {
        let min = parseInt(elements.reviewMinSlider.value);
        let max = parseInt(elements.reviewMaxSlider.value);
        if (min > max - 10) {
            elements.reviewMinSlider.value = max - 10;
        }
        updateRangeDisplay('review');
        updateSliderFill('review');
    });
    elements.reviewMaxSlider.addEventListener('input', () => {
        let min = parseInt(elements.reviewMinSlider.value);
        let max = parseInt(elements.reviewMaxSlider.value);
        if (max < min + 10) {
            elements.reviewMaxSlider.value = min + 10;
        }
        updateRangeDisplay('review');
        updateSliderFill('review');
    });
    elements.reviewMinSlider.addEventListener('change', applyFilters);
    elements.reviewMaxSlider.addEventListener('change', applyFilters);

    // Rating Range Sliders
    elements.ratingMinSlider.addEventListener('input', () => {
        let min = parseInt(elements.ratingMinSlider.value);
        let max = parseInt(elements.ratingMaxSlider.value);
        if (min > max - 1) {
            elements.ratingMinSlider.value = max - 1;
        }
        updateRangeDisplay('rating');
        updateSliderFill('rating');
    });
    elements.ratingMaxSlider.addEventListener('input', () => {
        let min = parseInt(elements.ratingMinSlider.value);
        let max = parseInt(elements.ratingMaxSlider.value);
        if (max < min + 1) {
            elements.ratingMaxSlider.value = min + 1;
        }
        updateRangeDisplay('rating');
        updateSliderFill('rating');
    });
    elements.ratingMinSlider.addEventListener('change', applyFilters);
    elements.ratingMaxSlider.addEventListener('change', applyFilters);

    // Brand Filter Collapsible
    elements.brandFilterToggle.addEventListener('click', toggleBrandFilter);
    elements.selectAllBrands.addEventListener('click', selectAllBrands);
    elements.clearAllBrands.addEventListener('click', clearAllBrands);
}

// ========================================
// Slider Range Fill Update
// ========================================
function updateSliderFill(type) {
    let minSlider, maxSlider, container;

    if (type === 'price') {
        minSlider = elements.priceMinSlider;
        maxSlider = elements.priceMaxSlider;
        container = minSlider.parentElement;
    } else if (type === 'review') {
        minSlider = elements.reviewMinSlider;
        maxSlider = elements.reviewMaxSlider;
        container = minSlider.parentElement;
    } else if (type === 'rating') {
        minSlider = elements.ratingMinSlider;
        maxSlider = elements.ratingMaxSlider;
        container = minSlider.parentElement;
    }

    const minValue = parseFloat(minSlider.value);
    const maxValue = parseFloat(maxSlider.value);
    const rangeMin = parseFloat(minSlider.getAttribute('min'));
    const rangeMax = parseFloat(minSlider.getAttribute('max'));

    if (rangeMax === rangeMin) return;

    const minPercent = ((minValue - rangeMin) / (rangeMax - rangeMin)) * 100;
    const maxPercent = ((maxValue - rangeMin) / (rangeMax - rangeMin)) * 100;

    let fill = container.querySelector('.slider-range-fill');
    if (!fill) {
        fill = document.createElement('div');
        fill.className = 'slider-range-fill';
        container.appendChild(fill);
    }

    const safeLeft = Math.max(0, Math.min(100, minPercent));
    const safeWidth = Math.max(0, Math.min(100 - safeLeft, maxPercent - minPercent));

    fill.style.left = `${safeLeft}%`;
    fill.style.width = `${safeWidth}%`;
}

// ========================================
// File Upload & Parsing
// ========================================
function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    processFiles(files);
    e.target.value = ''; // Reset input
}

function handleDragOver(e) {
    e.preventDefault();
    elements.uploadZone.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    elements.uploadZone.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    elements.uploadZone.classList.remove('dragover');
    const files = Array.from(e.dataTransfer.files).filter(f => f.name.endsWith('.csv'));
    processFiles(files);
}

async function processFiles(files) {
    for (const file of files) {
        const text = await file.text();
        console.log(`Processing file: ${file.name}`);

        const rawLineCount = text.trim().split('\n').length - 1; // -1 for header
        console.log(`Raw lines in file: ${rawLineCount}`);

        const listings = parseCSV(text, file.name);
        console.log(`Successfully parsed ${listings.length} listings`);
        console.log(`Skipped/Invalid: ${rawLineCount - listings.length} rows`);

        uploadedFiles.push({
            name: file.name,
            count: listings.length,
            index: uploadedFiles.length + 1
        });

        allListings.push(...listings.map(listing => ({ ...listing, fileIndex: uploadedFiles.length })));

        const totalBeforeDedup = allListings.length;
        console.log(`Total listings before deduplication: ${totalBeforeDedup}`);

        // Deduplicate
        allListings = deduplicateListings(allListings);

        const duplicatesRemoved = totalBeforeDedup - allListings.length;
        console.log(`Duplicates removed: ${duplicatesRemoved}`);
        console.log(`Final unique listings: ${allListings.length}`);
    }

    // Save to localStorage
    saveToLocalStorage();

    // Update UI
    updateFilesDisplay();
    showViewer();
}

// ========================================
// CSV Parsing
// ========================================
function parseCSV(text, filename) {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const listings = [];

    // Detect CSV format (old vs new)
    const hasShopName = headers.includes('Shop Name');
    const hasProductType = headers.includes('Product Type');
    const hasOriginalPrice = headers.includes('Original Price');

    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        if (values.length !== headers.length) continue;

        const listing = {};
        headers.forEach((header, index) => {
            listing[header] = values[index];
        });

        // Normalize data
        const title = listing['Title'];
        const currentPrice = parseFloat((listing['Current Price'] || listing['Price'] || '0').replace(/,/g, ''));
        const originalPrice = parseFloat((listing['Original Price'] || '0').replace(/,/g, ''));
        const reviews = parseInt(listing['Reviews'] || '0');
        const rating = parseFloat(listing['Rating'] || '0');
        const url = listing['URL'];
        const thumbnail = listing['Thumbnail'] || listing['Image'];
        const isAd = (listing['Is Ad'] || 'No').toLowerCase() === 'yes';
        const pageOrigin = listing['Page Origin'];
        const searchQuery = listing['Search Query'];
        const badges = listing['Badges'] || '';

        // NEW FIELDS
        const shopName = listing['Shop Name'] || '';
        const productType = listing['Product Type'] || 'Unknown';
        const freeShipping = (listing['Free Shipping'] || 'No').toLowerCase() === 'yes';
        const organicListingsCount = parseInt(listing['Organic Listings Count'] || '0');

        if (!title || !url) continue;

        listings.push({
            title,
            currentPrice,
            originalPrice: originalPrice > 0 ? originalPrice : currentPrice,
            reviews,
            rating,
            url,
            thumbnail,
            isAd,
            pageOrigin,
            searchQuery,
            badges,
            shopName,
            productType,
            freeShipping,
            organicListingsCount,
            fileName: filename,
            fileIndex: uploadedFiles.length
        });
    }

    return listings;
}

function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current.trim());
    return result.map(v => v.replace(/^"|"$/g, ''));
}

// ========================================
// FIXED: Deduplication Function
// ========================================
function deduplicateListings(listings) {
    const urlGroups = new Map();

    // Group all listings by URL
    listings.forEach(listing => {
        const url = listing.url; // FIXED: lowercase url
        if (!url || !url.trim()) return;

        if (!urlGroups.has(url)) {
            urlGroups.set(url, []);
        }
        urlGroups.get(url).push(listing);
    });

    const deduplicated = [];
    let totalDuplicates = 0;
    let keptBothVersions = 0;

    // Process each URL group
    urlGroups.forEach((group, url) => {
        if (group.length === 1) {
            // No duplicates for this URL
            deduplicated.push(group[0]);
            return;
        }

        totalDuplicates += group.length - 1;

        // Separate ads and non-ads - FIXED: lowercase isAd
        const ads = group.filter(l => l.isAd);
        const nonAds = group.filter(l => !l.isAd);

        // Keep the non-ad with smallest PageOrigin
        if (nonAds.length > 0) {
            const bestNonAd = nonAds.reduce((best, current) => {
                const bestPage = parseInt(best.pageOrigin) || 999999;
                const currentPage = parseInt(current.pageOrigin) || 999999;
                return currentPage < bestPage ? current : best;
            });
            deduplicated.push(bestNonAd);
        }

        // Keep the ad with smallest PageOrigin
        if (ads.length > 0) {
            const bestAd = ads.reduce((best, current) => {
                const bestPage = parseInt(best.pageOrigin) || 999999;
                const currentPage = parseInt(current.pageOrigin) || 999999;
                return currentPage < bestPage ? current : best;
            });
            deduplicated.push(bestAd);
        }

        // Track when we kept both versions
        if (ads.length > 0 && nonAds.length > 0) {
            keptBothVersions++;
        }
    });

    console.log(`Total duplicate URLs: ${urlGroups.size - deduplicated.length} (${totalDuplicates} items)`);
    console.log(`Kept both ad & non-ad versions: ${keptBothVersions}`);
    console.log(`Final deduplicated count: ${deduplicated.length}`);

    return deduplicated;
}

// ========================================
// NEW: Brand Filter with Custom Brands
// ========================================
function loadBrandCheckboxes() {
    const allBrands = [...BRANDLIST, ...customBrands];
    
    elements.brandCheckboxGrid.innerHTML = allBrands.map((brand, index) => {
        const isCustom = customBrands.includes(brand);
        const customClass = isCustom ? ' custom-brand-item' : '';
        const deleteBtn = isCustom ? `<i class="fas fa-times delete-brand-icon" data-brand="${brand}"></i>` : '';
        
        return `
            <label class="brand-checkbox-item${customClass}">
                <input type="checkbox" value="${brand}" class="brand-checkbox">
                <span>${brand}</span>
                ${deleteBtn}
            </label>
        `;
    }).join('');

    // Add custom brand input field at the bottom
    const inputHTML = `
        <div class="custom-brand-input-container">
            <input type="text" 
                   id="customBrandInput" 
                   class="custom-brand-input" 
                   placeholder="Add custom brand/IP (comma separated)" 
                   maxlength="500">
            <button class="btn-add-brand" id="addCustomBrandBtn">
                <i class="fas fa-plus"></i> Add
            </button>
        </div>
    `;
    elements.brandCheckboxGrid.insertAdjacentHTML('beforeend', inputHTML);

    // Add event listeners
    document.querySelectorAll('.brand-checkbox').forEach(cb => {
        cb.addEventListener('change', applyFilters);
    });

    // Delete brand icons
    document.querySelectorAll('.delete-brand-icon').forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.stopPropagation();
            const brand = e.target.getAttribute('data-brand');
            removeCustomBrand(brand);
        });
    });

    // Add brand button
    const addBtn = document.getElementById('addCustomBrandBtn');
    const input = document.getElementById('customBrandInput');
    
    if (addBtn && input) {
        addBtn.addEventListener('click', () => addCustomBrands());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addCustomBrands();
            }
        });
    }

    // Update button visibility
    updateBrandFilterButtons();
}

// NEW: Add custom brands from input
function addCustomBrands() {
    const input = document.getElementById('customBrandInput');
    if (!input) return;

    const value = input.value.trim();
    if (!value) return;

    // Split by comma and process each brand
    const newBrands = value.split(',')
        .map(b => b.trim())
        .filter(b => b.length > 0 && b.length <= 75); // Max 75 chars

    // Get all existing brands (case-insensitive)
    const existingBrandsLower = [...BRANDLIST, ...customBrands].map(b => b.toLowerCase());

    // Add only unique brands (case-insensitive check)
    let addedCount = 0;
    newBrands.forEach(brand => {
        if (!existingBrandsLower.includes(brand.toLowerCase())) {
            customBrands.push(brand);
            existingBrandsLower.push(brand.toLowerCase());
            addedCount++;
        }
    });

    if (addedCount > 0) {
        input.value = ''; // Clear input
        saveToLocalStorage();
        loadBrandCheckboxes();
        
        // Auto-check newly added brands
        setTimeout(() => {
            newBrands.forEach(brand => {
                const checkbox = document.querySelector(`.brand-checkbox[value="${brand}"]`);
                if (checkbox) checkbox.checked = true;
            });
            applyFilters();
        }, 50);
    }
}

// NEW: Remove custom brand
function removeCustomBrand(brand) {
    customBrands = customBrands.filter(b => b !== brand);
    saveToLocalStorage();
    loadBrandCheckboxes();
    applyFilters();
}

// NEW: Update brand filter button visibility
function updateBrandFilterButtons() {
    const hasCustomBrands = customBrands.length > 0;
    
    // Remove existing custom buttons
    const existingCustomButtons = document.querySelectorAll('.btn-brand-filter-custom');
    existingCustomButtons.forEach(btn => btn.remove());

    if (hasCustomBrands) {
        // Add new buttons after "Clear" button
        const clearBtn = elements.clearAllBrands;
        const buttonHTML = `
            <button class="btn-text btn-brand-filter-custom" id="selectDefaultBrands">Default only</button>
            <button class="btn-text btn-brand-filter-custom" id="selectCustomBrands">Custom only</button>
        `;
        clearBtn.insertAdjacentHTML('afterend', buttonHTML);

        // Add event listeners
        document.getElementById('selectDefaultBrands')?.addEventListener('click', selectDefaultBrandsOnly);
        document.getElementById('selectCustomBrands')?.addEventListener('click', selectCustomBrandsOnly);
    }
}

// NEW: Select only default brands
function selectDefaultBrandsOnly() {
    document.querySelectorAll('.brand-checkbox').forEach(cb => {
        const isCustom = customBrands.includes(cb.value);
        cb.checked = !isCustom;
    });
    applyFilters();
}

// NEW: Select only custom brands
function selectCustomBrandsOnly() {
    document.querySelectorAll('.brand-checkbox').forEach(cb => {
        const isCustom = customBrands.includes(cb.value);
        cb.checked = isCustom;
    });
    applyFilters();
}

function toggleBrandFilter() {
    elements.brandFilterToggle.classList.toggle('active');
    elements.brandFilterContent.classList.toggle('active');
}

function selectAllBrands() {
    document.querySelectorAll('.brand-checkbox').forEach(cb => {
        cb.checked = true;
    });
    applyFilters();
}

function clearAllBrands() {
    document.querySelectorAll('.brand-checkbox').forEach(cb => {
        cb.checked = false;
    });
    applyFilters();
}

function getExcludedBrands() {
    return Array.from(document.querySelectorAll('.brand-checkbox:checked'))
        .map(cb => cb.value.toLowerCase());
}

// ========================================
// Filtering & Sorting
// ========================================
function applyFilters() {
    const searchTerm = elements.searchInput.value.toLowerCase().trim();
    const sortBy = elements.sortSelect.value;
    const hideAds = elements.filterHideAds.checked;
    const bestseller = elements.filterBestseller.checked;
    const popular = elements.filterPopular.checked;
    const etsysPick = elements.filterEtsysPick.checked;
    const freeShipping = elements.filterFreeShipping.checked;
    const productType = elements.productTypeSelect.value;

    const priceMin = parseFloat(elements.priceMinSlider.value);
    const priceMax = parseFloat(elements.priceMaxSlider.value);
    const reviewMin = parseInt(elements.reviewMinSlider.value);
    const reviewMax = parseInt(elements.reviewMaxSlider.value);
    const ratingMin = parseFloat(elements.ratingMinSlider.value) / 10;
    const ratingMax = parseFloat(elements.ratingMaxSlider.value) / 10;

    const excludedBrands = getExcludedBrands();

    // NEW: Parse negative terms (words and quoted phrases)
    const negativeTerms = [];
    let cleanedSearchTerm = searchTerm;

    // Extract quoted negative phrases: -"phrase here"
    const quotedNegativeMatches = searchTerm.matchAll(/-"([^"]+)"/g);
    for (const match of quotedNegativeMatches) {
        negativeTerms.push(match[1].toLowerCase().trim());
        cleanedSearchTerm = cleanedSearchTerm.replace(match[0], '').trim();
    }

    // Extract single negative words: -word
    const wordNegativeMatches = cleanedSearchTerm.matchAll(/-(\S+)/g);
    for (const match of wordNegativeMatches) {
        negativeTerms.push(match[1].toLowerCase().trim());
        cleanedSearchTerm = cleanedSearchTerm.replace(match[0], '').trim();
    }

    // Parse search term for shop filter
    let shopFilter = '';
    let titleSearchTerm = cleanedSearchTerm;

    if (cleanedSearchTerm.includes('shop:')) {
        const shopMatch = cleanedSearchTerm.match(/shop:(\S+)/i);
        if (shopMatch) {
            shopFilter = shopMatch[1].toLowerCase();
            titleSearchTerm = cleanedSearchTerm.replace(/shop:\S+/gi, '').trim();
        }
    }

    filteredListings = allListings.filter(listing => {
        const titleLower = listing.title.toLowerCase();

        // NEW: Negative term filter (exclude if ANY negative term is found)
        if (negativeTerms.length > 0) {
            if (negativeTerms.some(term => titleLower.includes(term))) {
                return false;
            }
        }

        // Search filter (title + shop)
        if (titleSearchTerm && !titleLower.includes(titleSearchTerm)) return false;

        // Shop filter
        if (shopFilter && !listing.shopName.toLowerCase().includes(shopFilter)) return false;

        // Quick filters
        if (hideAds && listing.isAd) return false;
        if (bestseller && !listing.badges.toLowerCase().includes('bestseller')) return false;
        if (popular && !listing.badges.toLowerCase().includes('popular')) return false;
        if (etsysPick && !listing.badges.toLowerCase().includes('etsy\'s pick')) return false;
        if (freeShipping && !listing.freeShipping) return false;

        // Product Type filter
        if (productType !== 'all') {
            const isPhysical = listing.productType.toLowerCase().includes('physical');
            const isDigital = listing.productType.toLowerCase().includes('digital');
            if (productType === 'physical' && !isPhysical) return false;
            if (productType === 'digital' && !isDigital) return false;
        }

        // Price range
        if (listing.currentPrice < priceMin || listing.currentPrice > priceMax) return false;

        // Review range
        if (listing.reviews < reviewMin || listing.reviews > reviewMax) return false;

        // Rating range
        if (listing.rating < ratingMin || listing.rating > ratingMax) return false;

        // Brand exclusion (CASE-INSENSITIVE)
        if (excludedBrands.length > 0) {
            const titleLower = listing.title.toLowerCase();
            if (excludedBrands.some(brand => titleLower.includes(brand))) {
                return false;
            }
        }

        return true;
    });

    // Sorting
    if (sortBy !== 'default') {
        filteredListings.sort((a, b) => {
            switch (sortBy) {
                case 'price-asc': return a.currentPrice - b.currentPrice;
                case 'price-desc': return b.currentPrice - a.currentPrice;
                case 'reviews-asc': return a.reviews - b.reviews;
                case 'reviews-desc': return b.reviews - a.reviews;
                case 'rating-asc': return a.rating - b.rating;
                case 'rating-desc': return b.rating - a.rating;
                default: return 0;
            }
        });
    }

    displayedCount = 0;
    renderCards();
    updateFilteredCount();
}

function clearAllFilters() {
    elements.searchInput.value = '';
    elements.sortSelect.value = 'default';
    elements.filterHideAds.checked = false;
    elements.filterBestseller.checked = false;
    elements.filterPopular.checked = false;
    elements.filterEtsysPick.checked = false;
    elements.filterFreeShipping.checked = false;
    elements.productTypeSelect.value = 'all';

    const maxPrice = parseFloat(elements.priceMaxSlider.getAttribute('max'));
    const maxReviews = parseFloat(elements.reviewMaxSlider.getAttribute('max'));

    elements.priceMinSlider.value = 0;
    elements.priceMaxSlider.value = maxPrice;
    elements.reviewMinSlider.value = 0;
    elements.reviewMaxSlider.value = maxReviews;
    elements.ratingMinSlider.value = 0;
    elements.ratingMaxSlider.value = 50;

    updateRangeDisplay('price');
    updateRangeDisplay('review');
    updateRangeDisplay('rating');
    updateSliderFill('price');
    updateSliderFill('review');
    updateSliderFill('rating');

    clearAllBrands();
    applyFilters();
}

// ========================================
// NEW: Card Rendering Functions
// ========================================
function renderCards() {
    elements.cardsContainer.innerHTML = ''; // Clear existing cards

    const fragment = document.createDocumentFragment();
    const cardsToShow = filteredListings.slice(0, CONFIG.cardsPerLoad);

    cardsToShow.forEach(listing => {
        const card = createListingCard(listing);
        fragment.appendChild(card);
    });

    elements.cardsContainer.appendChild(fragment);
    displayedCount = cardsToShow.length;

    // Update results count
    elements.resultsCount.textContent = `${allListings.length.toLocaleString()} listings`;

    // Show/hide Load More button
    if (displayedCount < filteredListings.length) {
        elements.loadMoreContainer.style.display = 'block';
    } else {
        elements.loadMoreContainer.style.display = 'none';
    }
}

function loadMoreCards() {
    const startIndex = displayedCount;
    const endIndex = Math.min(startIndex + CONFIG.cardsPerPage, filteredListings.length);

    const fragment = document.createDocumentFragment();
    for (let i = startIndex; i < endIndex; i++) {
        const card = createListingCard(filteredListings[i]);
        fragment.appendChild(card);
    }

    elements.cardsContainer.appendChild(fragment);
    displayedCount = endIndex;

    // Show/hide Load More button
    if (displayedCount < filteredListings.length) {
        elements.loadMoreContainer.style.display = 'block';
    } else {
        elements.loadMoreContainer.style.display = 'none';
    }
}

function createListingCard(listing) {
    const card = document.createElement('div');
    card.className = 'listing-card';
    card.onclick = () => window.open(listing.url, '_blank');

    // Calculate discount
    const hasDiscount = listing.originalPrice > listing.currentPrice;
    const discountPercent = hasDiscount ? Math.round(((listing.originalPrice - listing.currentPrice) / listing.originalPrice) * 100) : 0;

    // FIXED: Badge order - AD first, then bestseller/popular/etsy's pick, then discount/shipping last
    const badgesArray = listing.badges.split(',').map(b => b.trim()).filter(b => b);
    let badgesHTML = '';

    // 1. AD badge first
    if (listing.isAd) {
        badgesHTML += `<span class="badge badge-ad">AD</span>`;
    }

    // 2. Etsy badges (middle)
    if (badgesArray.includes('Bestseller')) {
        badgesHTML += `<span class="badge badge-bestseller">Bestseller</span>`;
    }
    if (badgesArray.includes('Popular Now')) {
        badgesHTML += `<span class="badge badge-popular">Popular</span>`;
    }
    if (badgesArray.some(b => b.toLowerCase().includes('etsy\'s pick'))) {
        badgesHTML += `<span class="badge badge-etsyspick">Etsy's Pick</span>`;
    }

    // 3. Discount and shipping badges (last)
    if (hasDiscount) {
        badgesHTML += `<span class="badge badge-discount">-${discountPercent}%</span>`;
    }
    if (listing.freeShipping) {
        badgesHTML += `<span class="badge badge-shipping">Free Ship</span>`;
    }

    // Shop URL
    const shopUrl = listing.shopName ? `https://www.etsy.com/shop/${listing.shopName}` : '#';

    // Format organic listings count
    const organicCount = listing.organicListingsCount > 0
        ? listing.organicListingsCount > 1000000
            ? `${(listing.organicListingsCount / 1000000).toFixed(1)}M`
            : listing.organicListingsCount > 1000
            ? `${(listing.organicListingsCount / 1000).toFixed(1)}K`
            : listing.organicListingsCount.toLocaleString()
        : '';

    // FIXED: Simplified product type (remove "Product" word)
    const simplifiedProductType = listing.productType
        .replace('Product', '')
        .replace('Physical', 'Physical')
        .replace('Digital', 'Digital')
        .trim();

    // FIXED: Format reviews for inline display
    const reviewsFormatted = listing.reviews > 1000000
        ? `${(listing.reviews / 1000000).toFixed(1)}M`
        : listing.reviews > 1000
        ? `${(listing.reviews / 1000).toFixed(1)}K`
        : listing.reviews.toLocaleString();

    card.innerHTML = `
        ${listing.isAd ? `<div class="card-ad-indicator"></div>` : ''}
        <div class="card-image-wrapper">
            <img src="${listing.thumbnail}" alt="${listing.title}" class="card-image" loading="lazy">
            <div class="card-badges">${badgesHTML}</div>
            ${listing.pageOrigin || listing.searchQuery ? `
                <div class="page-origin-badge">
                    ${listing.pageOrigin ? `<span class="badge-line">p. ${listing.pageOrigin}</span>` : ''}
                    ${listing.searchQuery ? `<span class="badge-line">${listing.searchQuery}${organicCount ? ` • ${organicCount}` : ''}</span>` : ''}
                </div>
            ` : ''}
        </div>
        <div class="card-content">
            <div class="card-title">${listing.title}</div>
            ${listing.shopName || simplifiedProductType ? `
                <div class="card-shop-type">
                    ${listing.shopName ? `
                        <div class="shop-info">
                            <i class="fas fa-store"></i>
                            <a href="${shopUrl}" class="shop-link" onclick="event.stopPropagation()" target="_blank">
                                ${listing.shopName}
                            </a>
                        </div>
                    ` : ''}
                    ${simplifiedProductType && simplifiedProductType !== 'Unknown' ? `
                        <div class="product-type-info">
                            <i class="fas fa-tag"></i>
                            <span>${simplifiedProductType}</span>
                        </div>
                    ` : ''}
                </div>
            ` : ''}
            <div class="card-details">
                <div class="card-price-section">
                    <span class="card-price">$${listing.currentPrice.toFixed(2)}</span>
                    ${hasDiscount ? `<span class="card-price-original">$${listing.originalPrice.toFixed(2)}</span>` : ''}
                </div>
                <div class="card-rating">
                    ${listing.rating > 0 ? `
                        <i class="fas fa-star star-icon"></i>
                        <span class="rating-text">${listing.rating.toFixed(1)}</span>
                        ${listing.reviews > 0 ? `<span class="reviews-inline">(${reviewsFormatted})</span>` : ''}
                    ` : listing.reviews > 0 ? `
                        <span class="no-rating-with-reviews">(${reviewsFormatted} reviews)</span>
                    ` : `
                        <span class="no-rating">No reviews</span>
                    `}
                </div>
            </div>
        </div>
    `;

    return card;
}

// ========================================
// Export
// ========================================
function exportRefinedResults() {
    if (filteredListings.length === 0) {
        alert('No listings to export!');
        return;
    }

    // Get all column headers dynamically from the first listing
    if (filteredListings.length === 0) return;

    const allKeys = Object.keys(filteredListings[0]);

    // Generate CSV with all columns
    const headers = allKeys;
    const rows = filteredListings.map(listing => {
        return headers.map(header => {
            const value = listing[header];
            if (value === null || value === undefined) return '';
            if (typeof value === 'boolean') return value ? 'Yes' : 'No';
            if (typeof value === 'string') return escapeCSV(value);
            return value;
        });
    });

    const csv = [headers, ...rows.map(row => row.map(v => `"${v}"`).join(','))].join('\n');

    // Generate filename
    const timestamp = new Date().toISOString().replace(/:/g, '-').slice(0, -5);
    const filename = `etsyrefined_${timestamp}.csv`;

    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    console.log(`Exported ${filteredListings.length} listings with ${headers.length} columns`);
}

// ========================================
// UI Updates
// ========================================
function showViewer() {
    elements.uploadSection.style.display = 'none';
    elements.viewerSection.style.display = 'block';
    elements.resultsCount.textContent = `${allListings.length} listings`;
    elements.lastUpdated.textContent = `Last updated: ${new Date().toLocaleString()}`;

    // Get actual max values from data
    const prices = allListings.map(l => l.currentPrice).filter(p => p > 0);
    const reviews = allListings.map(l => l.reviews).filter(r => r >= 0);

    const maxPrice = prices.length > 0 ? Math.max(...prices) : 100;
    const maxReviews = reviews.length > 0 ? Math.max(...reviews) : 1000;
    const reviewStep = maxReviews > 500 ? 10 : 1;

    const roundedMaxPrice = Math.ceil(maxPrice);
    const roundedMaxReviews = reviewStep > 1 ? Math.ceil(maxReviews / 10) * 10 : Math.ceil(maxReviews);

    console.log(`Data Range - Price: $0-$${roundedMaxPrice}, Reviews: 0-${roundedMaxReviews} (step: ${reviewStep})`);

    // Set Price Range sliders
    elements.priceMinSlider.setAttribute('min', '0');
    elements.priceMinSlider.setAttribute('max', roundedMaxPrice);
    elements.priceMinSlider.setAttribute('step', '1');
    elements.priceMinSlider.value = 0;

    elements.priceMaxSlider.setAttribute('min', '0');
    elements.priceMaxSlider.setAttribute('max', roundedMaxPrice);
    elements.priceMaxSlider.setAttribute('step', '1');
    elements.priceMaxSlider.value = roundedMaxPrice;

    // Set Review Range sliders
    elements.reviewMinSlider.setAttribute('min', '0');
    elements.reviewMinSlider.setAttribute('max', roundedMaxReviews);
    elements.reviewMinSlider.setAttribute('step', reviewStep);
    elements.reviewMinSlider.value = 0;

    elements.reviewMaxSlider.setAttribute('min', '0');
    elements.reviewMaxSlider.setAttribute('max', roundedMaxReviews);
    elements.reviewMaxSlider.setAttribute('step', reviewStep);
    elements.reviewMaxSlider.value = roundedMaxReviews;

    // Set Rating Range sliders
    elements.ratingMinSlider.setAttribute('min', '0');
    elements.ratingMinSlider.setAttribute('max', '50');
    elements.ratingMinSlider.setAttribute('step', '1');
    elements.ratingMinSlider.value = 0;

    elements.ratingMaxSlider.setAttribute('min', '0');
    elements.ratingMaxSlider.setAttribute('max', '50');
    elements.ratingMaxSlider.setAttribute('step', '1');
    elements.ratingMaxSlider.value = 50;

    updateRangeDisplay('price');
    updateRangeDisplay('review');
    updateRangeDisplay('rating');

    setTimeout(() => {
        updateSliderFill('price');
        updateSliderFill('review');
        updateSliderFill('rating');
    }, 100);

    applyFilters();
}

function updateFilesDisplay() {
    if (uploadedFiles.length === 0) {
        elements.filesList.style.display = 'none';
        return;
    }

    elements.filesList.style.display = 'block';
    elements.filesContainer.innerHTML = uploadedFiles.map((file, index) => `
        <div class="file-item">
            <div class="file-info">
                <span class="file-badge">File ${file.index}</span>
                <span class="file-name">${file.name}</span>
                <span class="file-count">${file.count} items</span>
            </div>
            <button class="btn-remove" onclick="removeFile(${index})">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

function removeFile(index) {
    const fileIndex = uploadedFiles[index].index;
    allListings = allListings.filter(l => l.fileIndex !== fileIndex);
    uploadedFiles.splice(index, 1);

    // Re-index remaining files
    uploadedFiles.forEach((file, i) => {
        file.index = i + 1;
    });

    saveToLocalStorage();
    updateFilesDisplay();

    if (uploadedFiles.length === 0) {
        clearCache();
    } else {
        applyFilters();
    }
}

function updateRangeDisplay(type) {
    if (type === 'price') {
        const min = parseFloat(elements.priceMinSlider.value);
        const max = parseFloat(elements.priceMaxSlider.value);
        const sliderMax = parseFloat(elements.priceMaxSlider.getAttribute('max'));

        elements.priceMin.textContent = min === 0 ? '$0' : formatPrice(min);
        if (max >= sliderMax) {
            elements.priceMax.textContent = `$${formatPrice(sliderMax)}+`;
        } else {
            elements.priceMax.textContent = formatPrice(max);
        }
    } else if (type === 'review') {
        const min = parseInt(elements.reviewMinSlider.value);
        const max = parseInt(elements.reviewMaxSlider.value);
        const sliderMax = parseInt(elements.reviewMaxSlider.getAttribute('max'));

        elements.reviewMin.textContent = min === 0 ? '0' : formatNumber(min);
        if (max >= sliderMax) {
            elements.reviewMax.textContent = `${formatNumber(sliderMax)}+`;
        } else {
            elements.reviewMax.textContent = formatNumber(max);
        }
    } else if (type === 'rating') {
        const min = (parseFloat(elements.ratingMinSlider.value) / 10).toFixed(1);
        const max = (parseFloat(elements.ratingMaxSlider.value) / 10).toFixed(1);

        elements.ratingMin.textContent = min;
        elements.ratingMax.textContent = max;
    }
}

function updateFilteredCount() {
    const total = allListings.length;
    const filtered = filteredListings.length;

    if (filtered === total) {
        elements.filteredCount.textContent = '';
    } else {
        elements.filteredCount.textContent = `${filtered} found`;
    }

    elements.resultsCount.textContent = `${filtered} of ${total} listings`;
}

// ========================================
// LocalStorage (UPDATED with customBrands)
// ========================================
function saveToLocalStorage() {
    try {
        localStorage.setItem(CONFIG.localStorageKey, JSON.stringify({
            listings: allListings,
            files: uploadedFiles,
            customBrands: customBrands, // NEW: Save custom brands
            timestamp: Date.now()
        }));
    } catch (e) {
        console.error('Failed to save to localStorage:', e);
    }
}

function loadFromLocalStorage() {
    try {
        const data = localStorage.getItem(CONFIG.localStorageKey);
        if (!data) return;

        const parsed = JSON.parse(data);
        allListings = parsed.listings || [];
        uploadedFiles = parsed.files || [];
        customBrands = parsed.customBrands || []; // NEW: Load custom brands

        if (allListings.length > 0) {
            updateFilesDisplay();
            showViewer();
        }
    } catch (e) {
        console.error('Failed to load from localStorage:', e);
    }
}

function clearCache() {
    if (confirm('This will clear all loaded data. Continue?')) {
        localStorage.removeItem(CONFIG.localStorageKey);
        allListings = [];
        filteredListings = [];
        uploadedFiles = [];
        customBrands = []; // NEW: Clear custom brands
        displayedCount = 0;

        elements.viewerSection.style.display = 'none';
        elements.uploadSection.style.display = 'block';
        elements.filesList.style.display = 'none';
    }
}

// ========================================
// Utility Functions
// ========================================
function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

function formatNumber(num) {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
}

function formatPrice(price) {
    if (price >= 1000) return `$${(price / 1000).toFixed(1)}K`;
    return `$${price.toFixed(0)}`;
}

function escapeCSV(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/"/g, '""');
}

// ========================================
// Start Application
// ========================================
document.addEventListener('DOMContentLoaded', init);
