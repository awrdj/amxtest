// ==========================================
// EtsyScope Data Viewer - Main Script
// ==========================================

// EASY TO ADJUST: Configuration
const CONFIG = {
    cardsPerLoad: 200,  // Initial cards to load
    cardsPerPage: 100,  // Cards to add when "Load More" is clicked
    localStorageKey: 'etsyScopeData',
    settingsKey: 'etsyScopeSettings'
};

// EASY TO ADJUST: Brand/IP List (Add as many as you want)
const BRAND_LIST = [
    '007', '20th Century Studios', '2K', 'A24', 'ABC', 'ABC News', 'Absolut',
    'Acer', 'Activision', 'Acura', 'Adidas', 'Adult Swim', 'Adventure Time',
    'Air Jordan', 'Airbus', 'AirPods', 'Alibaba', 'AliExpress', 'Amazon',
    'AMD', 'Amex', 'American Express', 'American Red Cross', 'Android',
    'Animal Crossing', 'Apex Legends', 'Apple', 'Apple TV+', 'Aprilia',
    'Aragorn', 'Arc\'teryx', 'Asics', 'Assassin\'s Creed', 'Aston Martin',
    'ASUS', 'AT&T', 'Audi', 'Avatar', 'Avengers', 'Axe', 'Batman', 'Beats',
    'Bentley', 'BMW', 'Boeing', 'Burberry', 'Calvin Klein', 'Canon',
    'Cartier', 'Caterpillar', 'Chanel', 'Chevrolet', 'Coca-Cola', 'Converse',
    'DC Comics', 'Dell', 'Disney', 'Dodge', 'Dolce & Gabbana', 'Ducati',
    'eBay', 'Ferrari', 'FIFA', 'Ford', 'Fortnite', 'Game of Thrones',
    'Garfield', 'Google', 'Gucci', 'Harley-Davidson', 'Harry Potter',
    'HBO', 'Hello Kitty', 'Honda', 'HP', 'Hulu', 'Hyundai', 'IBM',
    'Intel', 'iPhone', 'James Bond', 'Jeep', 'Jordan', 'Jurassic Park',
    'KFC', 'Lamborghini', 'LEGO', 'Lenovo', 'Lexus', 'LinkedIn',
    'Louis Vuitton', 'Marvel', 'Maserati', 'Mastercard', 'Mazda',
    'McDonald\'s', 'McLaren', 'Mercedes-Benz', 'Meta', 'Microsoft',
    'MTV', 'NASA', 'NBA', 'Netflix', 'NFL', 'NHL', 'Nike', 'Nintendo',
    'Nokia', 'Nvidia', 'Olympics', 'Omega', 'Oracle', 'PayPal',
    'Pepsi', 'PlayStation', 'Pokemon', 'Porsche', 'Prada', 'Puma',
    'Red Bull', 'Reebok', 'Rolex', 'Samsung', 'Sega', 'Shell',
    'Simpsons', 'Sony', 'SpaceX', 'Spotify', 'Star Wars', 'Starbucks',
    'Superman', 'Supreme', 'Tesla', 'The Beatles', 'TikTok', 'Toyota',
    'Twitter', 'Under Armour', 'Universal Studios', 'Versace', 'Visa',
    'Volkswagen', 'Volvo', 'Warner Bros', 'WhatsApp', 'Windows',
    'Xbox', 'Yahoo', 'Yamaha', 'YouTube', 'Zara'
];

// Global State
let allListings = [];
let filteredListings = [];
let displayedCount = 0;
let uploadedFiles = [];

// DOM Elements
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

// ==========================================
// Initialization
// ==========================================

function init() {
    setupEventListeners();
    loadBrandCheckboxes();
    loadFromLocalStorage();
}

// ==========================================
// Event Listeners
// ==========================================

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

    // Price Range Sliders
elements.priceMinSlider.addEventListener('input', (e) => {
    let min = parseFloat(elements.priceMinSlider.value);
    let max = parseFloat(elements.priceMaxSlider.value);
    if (min >= max - 1) {
        elements.priceMinSlider.value = max - 1;
    }
    updateRangeDisplay('price');
    updateSliderFill('price');
});
elements.priceMaxSlider.addEventListener('input', (e) => {
    let min = parseFloat(elements.priceMinSlider.value);
    let max = parseFloat(elements.priceMaxSlider.value);
    if (max <= min + 1) {
        elements.priceMaxSlider.value = min + 1;
    }
    updateRangeDisplay('price');
    updateSliderFill('price');
});

// Apply filters with debounce on change (when user releases slider)
elements.priceMinSlider.addEventListener('change', () => applyFilters());
elements.priceMaxSlider.addEventListener('change', () => applyFilters());

// Review Range Sliders
elements.reviewMinSlider.addEventListener('input', (e) => {
    let min = parseInt(elements.reviewMinSlider.value);
    let max = parseInt(elements.reviewMaxSlider.value);
    if (min >= max - 10) {
        elements.reviewMinSlider.value = max - 10;
    }
    updateRangeDisplay('review');
    updateSliderFill('review');
});
elements.reviewMaxSlider.addEventListener('input', (e) => {
    let min = parseInt(elements.reviewMinSlider.value);
    let max = parseInt(elements.reviewMaxSlider.value);
    if (max <= min + 10) {
        elements.reviewMaxSlider.value = min + 10;
    }
    updateRangeDisplay('review');
    updateSliderFill('review');
});

elements.reviewMinSlider.addEventListener('change', () => applyFilters());
elements.reviewMaxSlider.addEventListener('change', () => applyFilters());

// Rating Range Sliders
elements.ratingMinSlider.addEventListener('input', (e) => {
    let min = parseInt(elements.ratingMinSlider.value);
    let max = parseInt(elements.ratingMaxSlider.value);
    if (min >= max - 1) {
        elements.ratingMinSlider.value = max - 1;
    }
    updateRangeDisplay('rating');
    updateSliderFill('rating');
});
elements.ratingMaxSlider.addEventListener('input', (e) => {
    let min = parseInt(elements.ratingMinSlider.value);
    let max = parseInt(elements.ratingMaxSlider.value);
    if (max <= min + 1) {
        elements.ratingMaxSlider.value = min + 1;
    }
    updateRangeDisplay('rating');
    updateSliderFill('rating');
});

elements.ratingMinSlider.addEventListener('change', () => applyFilters());
elements.ratingMaxSlider.addEventListener('change', () => applyFilters());
    
    // Brand Filter Collapsible
    elements.brandFilterToggle.addEventListener('click', toggleBrandFilter);
    elements.selectAllBrands.addEventListener('click', selectAllBrands);
    elements.clearAllBrands.addEventListener('click', clearAllBrands);
}

// ==========================================
// Slider Range Fill Update
// ==========================================

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
    
    // Get current values
    const minValue = parseFloat(minSlider.value);
    const maxValue = parseFloat(maxSlider.value);
    
    // Get range from attributes (dynamically set)
    const rangeMin = parseFloat(minSlider.getAttribute('min'));
    const rangeMax = parseFloat(minSlider.getAttribute('max'));
    
    // Prevent division by zero
    if (rangeMax === rangeMin) {
        return;
    }
    
    // Calculate percentages
    const minPercent = ((minValue - rangeMin) / (rangeMax - rangeMin)) * 100;
    const maxPercent = ((maxValue - rangeMin) / (rangeMax - rangeMin)) * 100;
    
    // Find or create fill element
    let fill = container.querySelector('.slider-range-fill');
    if (!fill) {
        fill = document.createElement('div');
        fill.className = 'slider-range-fill';
        container.appendChild(fill);
    }
    
    // Clamp values between 0-100 to prevent overflow
    const safeLeft = Math.max(0, Math.min(100, minPercent));
    const safeWidth = Math.max(0, Math.min(100 - safeLeft, maxPercent - minPercent));
    
    fill.style.left = safeLeft + '%';
    fill.style.width = safeWidth + '%';
    
    // Debug logging (remove after testing)
    if (type === 'review') {
        console.log(`Review Fill Debug:`, {
            minValue,
            maxValue,
            rangeMin,
            rangeMax,
            minPercent: minPercent.toFixed(2),
            maxPercent: maxPercent.toFixed(2),
            safeLeft: safeLeft.toFixed(2),
            safeWidth: safeWidth.toFixed(2)
        });
    }
}

// ==========================================
// File Upload & Parsing
// ==========================================

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
        
        console.log(`\n📁 Processing file: ${file.name}`);
        const rawLineCount = text.trim().split('\n').length - 1; // -1 for header
        console.log(`   Raw lines in file: ${rawLineCount}`);
        
        const listings = parseCSV(text);
        
        console.log(`   ✅ Successfully parsed: ${listings.length} listings`);
        console.log(`   ❌ Skipped/Invalid: ${rawLineCount - listings.length} rows`);
        
        uploadedFiles.push({
            name: file.name,
            count: listings.length,
            index: uploadedFiles.length + 1
        });
        
        allListings.push(...listings.map(listing => ({
            ...listing,
            fileIndex: uploadedFiles.length
        })));
    }
    
    const totalBeforeDedup = allListings.length;
    console.log(`\n📊 Total listings before deduplication: ${totalBeforeDedup}`);
    
    // Deduplicate
    allListings = deduplicateListings(allListings);
    
    const duplicatesRemoved = totalBeforeDedup - allListings.length;
    console.log(`🔄 Duplicates removed: ${duplicatesRemoved}`);
    console.log(`✅ Final unique listings: ${allListings.length}\n`);
    
    // Save to localStorage
    saveToLocalStorage();
    
    // Update UI
    updateFilesDisplay();
    showViewer();
}

function parseCSV(text) {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    console.log(`   📋 CSV Headers (${headers.length}):`, headers.join(', '));
    
    const listings = [];
    let skippedRows = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        
        // IMPORTANT: Log rows with mismatched column counts
        if (values.length !== headers.length) {
            skippedRows.push({
                line: i + 1,
                expected: headers.length,
                got: values.length,
                preview: lines[i].substring(0, 100)
            });
            continue;
        }
        
        const listing = {};
        headers.forEach((header, index) => {
            listing[header] = values[index].trim().replace(/"/g, '');
        });
        
        // Parse numeric values
        listing.Price = parseFloat(listing.Price?.replace('$', '') || 0);
        listing.Reviews = parseInt(listing.Reviews || 0);
        listing.Rating = parseFloat(listing.Rating || 0);
        
        // Parse Is_Ad
        const isAdValue = listing.Is_Ad;
        if (typeof isAdValue === 'boolean') {
            listing.Is_Ad = isAdValue;
        } else if (typeof isAdValue === 'string') {
            listing.Is_Ad = ['yes', 'true', '1'].includes(isAdValue.toLowerCase());
        } else {
            listing.Is_Ad = false;
        }
        
        // Parse badges
        const badges = listing.Badges?.split('|').filter(b => b) || [];
        listing.hasBestseller = badges.includes('Bestseller');
        listing.hasPopular = badges.includes('Popular Now');
        listing.hasEtsysPick = badges.includes("Etsy's Pick");
        
        listings.push(listing);
    }
    
    // Log skipped rows details
    if (skippedRows.length > 0) {
        console.warn(`   ⚠️ Skipped ${skippedRows.length} malformed rows:`);
        skippedRows.slice(0, 5).forEach(row => {
            console.warn(`      Line ${row.line}: Expected ${row.expected} columns, got ${row.got}`);
            console.warn(`      Preview: "${row.preview}..."`);
        });
        if (skippedRows.length > 5) {
            console.warn(`      ... and ${skippedRows.length - 5} more`);
        }
    }
    
    return listings;
}

function parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            values.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    values.push(current);
    
    return values;
}

function deduplicateListings(listings) {
    const urlGroups = new Map();
    
    // Group all listings by URL
    listings.forEach(listing => {
        const url = listing.URL;
        if (!url || url.trim() === '') return;
        
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
        
        totalDuplicates += (group.length - 1);
        
        // Separate ads and non-ads
        const ads = group.filter(l => l.Is_Ad);
        const nonAds = group.filter(l => !l.Is_Ad);
        
        // Keep the non-ad with smallest Page_Origin
        if (nonAds.length > 0) {
            const bestNonAd = nonAds.reduce((best, current) => {
                const bestPage = parseInt(best.Page_Origin) || 999999;
                const currentPage = parseInt(current.Page_Origin) || 999999;
                return currentPage < bestPage ? current : best;
            });
            deduplicated.push(bestNonAd);
        }
        
        // Keep the ad with smallest Page_Origin
        if (ads.length > 0) {
            const bestAd = ads.reduce((best, current) => {
                const bestPage = parseInt(best.Page_Origin) || 999999;
                const currentPage = parseInt(current.Page_Origin) || 999999;
                return currentPage < bestPage ? current : best;
            });
            deduplicated.push(bestAd);
        }
        
        // Track when we kept both versions
        if (ads.length > 0 && nonAds.length > 0) {
            keptBothVersions++;
        }
    });
    
    console.log(`   🔗 Total duplicate URLs: ${urlGroups.size - deduplicated.length + totalDuplicates}`);
    console.log(`   📊 Kept both ad & non-ad versions: ${keptBothVersions}`);
    console.log(`   ✅ Final deduplicated count: ${deduplicated.length}`);
    
    return deduplicated;
}

// ==========================================
// Brand Filter
// ==========================================

function loadBrandCheckboxes() {
    elements.brandCheckboxGrid.innerHTML = BRAND_LIST.map(brand => `
        <label class="brand-checkbox-item">
            <input type="checkbox" value="${brand}" class="brand-checkbox">
            <span>${brand}</span>
        </label>
    `).join('');
    
    // Add event listeners
    document.querySelectorAll('.brand-checkbox').forEach(cb => {
        cb.addEventListener('change', applyFilters);
    });
}

function toggleBrandFilter() {
    elements.brandFilterToggle.classList.toggle('active');
    elements.brandFilterContent.classList.toggle('active');
}

function selectAllBrands() {
    document.querySelectorAll('.brand-checkbox').forEach(cb => cb.checked = true);
    applyFilters();
}

function clearAllBrands() {
    document.querySelectorAll('.brand-checkbox').forEach(cb => cb.checked = false);
    applyFilters();
}

function getExcludedBrands() {
    return Array.from(document.querySelectorAll('.brand-checkbox:checked'))
        .map(cb => cb.value.toLowerCase());
}

// ==========================================
// Filtering & Sorting
// ==========================================

function applyFilters() {
    const searchTerm = elements.searchInput.value.toLowerCase();
    const hideAds = elements.filterHideAds.checked;
    const showBestseller = elements.filterBestseller.checked;
    const showPopular = elements.filterPopular.checked;
    const showEtsysPick = elements.filterEtsysPick.checked;
    
    const priceMin = parseFloat(elements.priceMinSlider.value);
    const priceMax = parseFloat(elements.priceMaxSlider.value);
    const reviewMin = parseInt(elements.reviewMinSlider.value);
    const reviewMax = parseInt(elements.reviewMaxSlider.value);
    const ratingMin = parseFloat(elements.ratingMinSlider.value) / 10;
    const ratingMax = parseFloat(elements.ratingMaxSlider.value) / 10;
    
    const excludedBrands = getExcludedBrands();
    
    filteredListings = allListings.filter(listing => {
        // Search
        if (searchTerm && !listing.Title?.toLowerCase().includes(searchTerm)) {
            return false;
        }
        
        // Hide Ads
        if (hideAds && listing.Is_Ad) {
            return false;
        }
        
        // Badge Filters
        if (showBestseller && !listing.hasBestseller) return false;
        if (showPopular && !listing.hasPopular) return false;
        if (showEtsysPick && !listing.hasEtsysPick) return false;
        
        // Price Range
        if (listing.Price < priceMin || listing.Price > priceMax) {
            return false;
        }
        
        // Review Range
        if (listing.Reviews < reviewMin || listing.Reviews > reviewMax) {
            return false;
        }
        
        // Rating Range
        if (listing.Rating < ratingMin || listing.Rating > ratingMax) {
            return false;
        }
        
        // Brand Filter
        if (excludedBrands.length > 0) {
            const title = listing.Title?.toLowerCase() || '';
            if (excludedBrands.some(brand => title.includes(brand))) {
                return false;
            }
        }
        
        return true;
    });
    
    // Apply Sorting
    applySorting();
    
    // Reset display
    displayedCount = 0;
    elements.cardsContainer.innerHTML = '';
    loadMoreCards();
    
    // Update count
    updateFilteredCount();
}

function applySorting() {
    const sortMode = elements.sortSelect.value;
    
    switch(sortMode) {
        case 'price-asc':
            filteredListings.sort((a, b) => a.Price - b.Price);
            break;
        case 'price-desc':
            filteredListings.sort((a, b) => b.Price - a.Price);
            break;
        case 'reviews-desc':
            filteredListings.sort((a, b) => b.Reviews - a.Reviews);
            break;
        case 'reviews-asc':
            filteredListings.sort((a, b) => a.Reviews - b.Reviews);
            break;
        case 'rating-desc':
            filteredListings.sort((a, b) => b.Rating - a.Rating);
            break;
        case 'rating-asc':
            filteredListings.sort((a, b) => a.Rating - b.Rating);
            break;
        default:
            // Keep default order
            break;
    }
}

function clearAllFilters() {
    elements.searchInput.value = '';
    elements.sortSelect.value = 'default';
    elements.filterHideAds.checked = false;
    elements.filterBestseller.checked = false;
    elements.filterPopular.checked = false;
    elements.filterEtsysPick.checked = false;
    
    // Get the actual max values from the sliders
    const maxPrice = parseFloat(elements.priceMaxSlider.getAttribute('max'));
    const maxReviews = parseFloat(elements.reviewMaxSlider.getAttribute('max'));
    
    // Reset Price sliders
    elements.priceMinSlider.value = 0;
    elements.priceMaxSlider.value = maxPrice;
    
    // Reset Review sliders
    elements.reviewMinSlider.value = 0;
    elements.reviewMaxSlider.value = maxReviews;
    
    // Reset Rating sliders
    elements.ratingMinSlider.value = 0;
    elements.ratingMaxSlider.value = 50;
    
    // Update displays
    updateRangeDisplay('price');
    updateRangeDisplay('review');
    updateRangeDisplay('rating');
    
    // FIXED: Update visual fills
    updateSliderFill('price');
    updateSliderFill('review');
    updateSliderFill('rating');
    
    clearAllBrands();
    
    applyFilters();
}

// ==========================================
// Card Rendering
// ==========================================

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
    card.onclick = () => window.open(listing.URL, '_blank');
    
    // Badges
    const badges = [];
    if (listing.Is_Ad) badges.push('<span class="badge badge-ad">AD</span>');
    if (listing.hasBestseller) badges.push('<span class="badge badge-bestseller">Bestseller</span>');
    if (listing.hasPopular) badges.push('<span class="badge badge-popular">Popular</span>');
    if (listing.hasEtsysPick) badges.push('<span class="badge badge-etsyspick">Etsy\'s Pick</span>');
    
    // File info
    const fileInfo = uploadedFiles[listing.fileIndex - 1];
    const fileName = fileInfo ? fileInfo.name : 'Unknown';
    
// Page origin badge (only show if exists)
const pageOrigin = listing.Page_Origin;
const pageOriginHTML = pageOrigin ? `<div class="page-origin-badge">p. ${pageOrigin}</div>` : '';

// Ad border indicator
const adBorderHTML = listing.Is_Ad ? '<div class="card-ad-indicator"></div>' : '';

card.innerHTML = `
    ${adBorderHTML}
    <div class="card-image-wrapper">
        <img src="${listing.Thumbnail || 'placeholder.jpg'}" alt="${listing.Title}" class="card-image" loading="lazy">
        <div class="card-badges">${badges.join('')}</div>
        <div class="file-info-icon">
            <i class="fas fa-info"></i>
            <div class="file-info-tooltip">${fileName}</div>
        </div>
        ${pageOriginHTML}
    </div>
        <div class="card-content">
            <div class="card-title">${listing.Title || 'No Title'}</div>
            <div class="card-details">
                <span class="card-price">$${listing.Price.toFixed(2)}</span>
                <span class="card-rating">
                    <i class="fas fa-star star-icon"></i>
                    ${listing.Rating.toFixed(1)} <span class="review-count">(${formatNumber(listing.Reviews)})</span>
                </span>
            </div>
        </div>
    `;
    
    return card;
}

// ==========================================
// Export
// ==========================================

function exportRefinedResults() {
    if (filteredListings.length === 0) {
        alert('No listings to export!');
        return;
    }
    
    // Generate filter summary for filename
    let filterSummary = '';
    
    if (elements.searchInput.value) {
        filterSummary += `_search-${sanitizeFilename(elements.searchInput.value)}`;
    }
    
    if (elements.filterHideAds.checked) filterSummary += '_no-ads';
    if (elements.filterBestseller.checked) filterSummary += '_bestseller';
    if (elements.filterPopular.checked) filterSummary += '_popular';
    
    const priceMin = parseFloat(elements.priceMinSlider.value);
    const priceMax = parseFloat(elements.priceMaxSlider.value);
    const sliderMaxPrice = parseFloat(elements.priceMaxSlider.getAttribute('max'));
    if (priceMin > 0 || priceMax < sliderMaxPrice) {
        filterSummary += `_price${priceMin}-${priceMax}`;
    }
    
    const reviewMin = parseInt(elements.reviewMinSlider.value);
    const reviewMax = parseInt(elements.reviewMaxSlider.value);
    const sliderMaxReview = parseInt(elements.reviewMaxSlider.getAttribute('max'));
    if (reviewMin > 0 || reviewMax < sliderMaxReview) {
        filterSummary += `_reviews${reviewMin}-${reviewMax}`;
    }
    
    const ratingMin = (parseFloat(elements.ratingMinSlider.value) / 10).toFixed(1);
    const ratingMax = (parseFloat(elements.ratingMaxSlider.value) / 10).toFixed(1);
    if (ratingMin > 0 || ratingMax < 5.0) {
        filterSummary += `_rating${ratingMin}-${ratingMax}`;
    }
    
    // Truncate to reasonable length
    if (filterSummary.length > 50) {
        filterSummary = filterSummary.substring(0, 50);
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `etsy_refined${filterSummary}_${timestamp}.csv`;
    
    // FIXED: Get all column headers dynamically from the first listing
    if (filteredListings.length === 0) return;
    
    const allKeys = Object.keys(filteredListings[0]);
    
    // Exclude internal/computed properties
    const headers = allKeys.filter(key => 
        !['hasBestseller', 'hasPopular', 'hasEtsysPick', 'fileIndex'].includes(key)
    );
    
    // Generate CSV rows with all columns
    const rows = filteredListings.map(listing => 
        headers.map(header => {
            const value = listing[header];
            // Handle different types
            if (value === null || value === undefined) return '';
            if (typeof value === 'boolean') return value ? 'Yes' : 'No';
            if (typeof value === 'string') return escapeCSV(value);
            return value;
        })
    );
    
    const csv = [headers, ...rows].map(row => row.map(v => `"${v}"`).join(',')).join('\n');
    
    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    
    console.log(`📥 Exported ${filteredListings.length} listings with ${headers.length} columns`);
}

// ==========================================
// UI Updates
// ==========================================

function showViewer() {
    elements.uploadSection.style.display = 'none';
    elements.viewerSection.style.display = 'block';
    
    elements.resultsCount.textContent = `${allListings.length} listings`;
    elements.lastUpdated.textContent = `Last updated: ${new Date().toLocaleString()}`;
    
    // Get actual max values from data
    const prices = allListings.map(l => l.Price).filter(p => p > 0);
    const reviews = allListings.map(l => l.Reviews).filter(r => r > 0);
    
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 100;
    const maxReviews = reviews.length > 0 ? Math.max(...reviews) : 1000;
    
    // FIXED: Round up to nearest step value
    const roundedMaxPrice = Math.ceil(maxPrice);
    const roundedMaxReviews = Math.ceil(maxReviews / 10) * 10; // Round up to nearest 10
    
    console.log(`📊 Data Range - Price: $0-$${roundedMaxPrice}, Reviews: 0-${roundedMaxReviews}`);
    
    // Set Price Range sliders
    elements.priceMinSlider.setAttribute('min', '0');
    elements.priceMinSlider.setAttribute('max', roundedMaxPrice);
    elements.priceMinSlider.value = 0;
    
    elements.priceMaxSlider.setAttribute('min', '0');
    elements.priceMaxSlider.setAttribute('max', roundedMaxPrice);
    elements.priceMaxSlider.value = roundedMaxPrice;
    
    // Set Review Range sliders
    elements.reviewMinSlider.setAttribute('min', '0');
    elements.reviewMinSlider.setAttribute('max', roundedMaxReviews);
    elements.reviewMinSlider.value = 0;
    
    elements.reviewMaxSlider.setAttribute('min', '0');
    elements.reviewMaxSlider.setAttribute('max', roundedMaxReviews);
    elements.reviewMaxSlider.value = roundedMaxReviews;
    
    // Set Rating Range sliders (always 0-5.0)
    elements.ratingMinSlider.setAttribute('min', '0');
    elements.ratingMinSlider.setAttribute('max', '50');
    elements.ratingMinSlider.value = 0;
    
    elements.ratingMaxSlider.setAttribute('min', '0');
    elements.ratingMaxSlider.setAttribute('max', '50');
    elements.ratingMaxSlider.value = 50;
    
    updateRangeDisplay('price');
    updateRangeDisplay('review');
    updateRangeDisplay('rating');
    
    // Initialize slider fills
    setTimeout(() => {
        updateSliderFill('price');
        updateSliderFill('review');
        updateSliderFill('rating');
    }, 100);
    
    applyFilters();
    
    // Debug: Count ads
    const adCount = allListings.filter(l => l.Is_Ad).length;
    console.log(`🎯 AD DEBUG: ${adCount} ads out of ${allListings.length} total listings`);
    if (adCount > 0) {
        console.log('Sample ad:', allListings.find(l => l.Is_Ad));
    }
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
                <span class="file-count">(${file.count} items)</span>
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
        
        // Format min value
        elements.priceMin.textContent = min === 0 ? '$0' : `$${formatPrice(min)}`;
        
        // Format max value - show actual max if at the end
        if (max >= sliderMax) {
            elements.priceMax.textContent = `$${formatPrice(sliderMax)}`;
        } else {
            elements.priceMax.textContent = `$${formatPrice(max)}`;
        }
        
    } else if (type === 'review') {
        const min = parseInt(elements.reviewMinSlider.value);
        const max = parseInt(elements.reviewMaxSlider.value);
        const sliderMax = parseInt(elements.reviewMaxSlider.getAttribute('max'));
        
        // Format min value
        elements.reviewMin.textContent = min === 0 ? '0' : formatNumber(min);
        
        // Format max value - show actual max if at the end
        if (max >= sliderMax) {
            elements.reviewMax.textContent = formatNumber(sliderMax);
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

// ==========================================
// LocalStorage
// ==========================================

function saveToLocalStorage() {
    try {
        localStorage.setItem(CONFIG.localStorageKey, JSON.stringify({
            listings: allListings,
            files: uploadedFiles,
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
        displayedCount = 0;
        
        elements.viewerSection.style.display = 'none';
        elements.uploadSection.style.display = 'block';
        elements.filesList.style.display = 'none';
    }
}

// ==========================================
// Utility Functions
// ==========================================

// ==========================================
// Utility Functions
// ==========================================

function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// NEW: Format price with K suffix for thousands
function formatPrice(price) {
    if (price >= 1000) {
        return (price / 1000).toFixed(1) + 'K';
    }
    return price.toFixed(0);
}

function escapeCSV(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/"/g, '""');
}

function sanitizeFilename(str) {
    return str.replace(/[^a-z0-9]/gi, '-').substring(0, 20);
}

// ==========================================
// Start Application
// ==========================================

document.addEventListener('DOMContentLoaded', init);
