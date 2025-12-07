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
    
    // Get actual values from sliders
    const minValue = parseFloat(minSlider.value);
    const maxValue = parseFloat(maxSlider.value);
    
    // Get the slider's actual min/max attributes (these can be dynamic)
    const sliderMin = parseFloat(minSlider.getAttribute('min'));
    const sliderMax = parseFloat(minSlider.getAttribute('max'));
    
    // Calculate percentages based on actual range
    const minPercent = ((minValue - sliderMin) / (sliderMax - sliderMin)) * 100;
    const maxPercent = ((maxValue - sliderMin) / (sliderMax - sliderMin)) * 100;
    
    // Find or create fill element
    let fill = container.querySelector('.slider-range-fill');
    if (!fill) {
        fill = document.createElement('div');
        fill.className = 'slider-range-fill';
        container.appendChild(fill);
    }
    
    // Apply with safety clamps to prevent any overflow
    fill.style.left = Math.max(0, Math.min(100, minPercent)) + '%';
    fill.style.width = Math.max(0, Math.min(100, maxPercent - minPercent)) + '%';
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
        const listings = parseCSV(text);
        
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
    
    // Deduplicate
    allListings = deduplicateListings(allListings);
    
    // Save to localStorage
    saveToLocalStorage();
    
    // Update UI
    updateFilesDisplay();
    showViewer();
}

function parseCSV(text) {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    const listings = [];
    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        if (values.length !== headers.length) continue;
        
        const listing = {};
        headers.forEach((header, index) => {
            listing[header] = values[index].trim().replace(/"/g, '');
        });
        
        // Parse numeric values
        listing.Price = parseFloat(listing.Price?.replace('$', '') || 0);
        listing.Reviews = parseInt(listing.Reviews || 0);
        listing.Rating = parseFloat(listing.Rating || 0);
        
        // FIXED: Parse Is_Ad - check for "Yes" instead of "true"
        const isAdValue = listing.Is_Ad;
        if (typeof isAdValue === 'boolean') {
            listing.Is_Ad = isAdValue;
        } else if (typeof isAdValue === 'string') {
            // Check for "Yes", "YES", "yes", "True", "TRUE", "true"
            listing.Is_Ad = ['yes', 'true', '1'].includes(isAdValue.toLowerCase());
        } else {
            listing.Is_Ad = false;
        }
        
        console.log('Parsing:', listing.Title?.substring(0, 30), 'Is_Ad raw:', isAdValue, 'parsed:', listing.Is_Ad);
        
        // Parse badges
        const badges = listing.Badges?.split('|').filter(b => b) || [];
        listing.hasBestseller = badges.includes('Bestseller');
        listing.hasPopular = badges.includes('Popular Now');
        listing.hasEtsysPick = badges.includes("Etsy's Pick");
        
        listings.push(listing);
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
    const seen = new Map();
    
    // First pass: prefer non-ad listings
    listings.forEach(listing => {
        const url = listing.URL;
        if (!seen.has(url) || (seen.get(url).Is_Ad && !listing.Is_Ad)) {
            seen.set(url, listing);
        }
    });
    
    return Array.from(seen.values());
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
    
    elements.priceMinSlider.value = 0;
    elements.priceMaxSlider.value = 1000;
    elements.reviewMinSlider.value = 0;
    elements.reviewMaxSlider.value = 10000;
    elements.ratingMinSlider.value = 0;
    elements.ratingMaxSlider.value = 50;
    
    updateRangeDisplay('price');
    updateRangeDisplay('review');
    updateRangeDisplay('rating');
    
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
    
    // Debug log
    console.log('Creating card:', listing.Title, 'Is_Ad:', listing.Is_Ad);
    
    // Badges
    const badges = [];
    if (listing.Is_Ad) badges.push('<span class="badge badge-ad">SPONSORED</span>');
    if (listing.hasBestseller) badges.push('<span class="badge badge-bestseller">Bestseller</span>');
    if (listing.hasPopular) badges.push('<span class="badge badge-popular">Popular</span>');
    if (listing.hasEtsysPick) badges.push('<span class="badge badge-etsyspick">Etsy\'s Pick</span>');
    
    // File info
    const fileInfo = uploadedFiles[listing.fileIndex - 1];
    const fileName = fileInfo ? fileInfo.name : 'Unknown';
    
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
        </div>
        <div class="card-content">
            <div class="card-title">${listing.Title || 'No Title'}</div>
            <div class="card-details">
                <span class="card-price">$${listing.Price.toFixed(2)}</span>
                <span class="card-rating">
                    <i class="fas fa-star star-icon"></i>
                    ${listing.Rating.toFixed(1)}
                </span>
            </div>
            <div class="card-reviews">
                <i class="fas fa-comment-dots"></i>
                ${formatNumber(listing.Reviews)} reviews
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
    if (priceMin > 0 || priceMax < 1000) {
        filterSummary += `_price${priceMin}-${priceMax}`;
    }
    
    const reviewMin = parseInt(elements.reviewMinSlider.value);
    const reviewMax = parseInt(elements.reviewMaxSlider.value);
    if (reviewMin > 0 || reviewMax < 10000) {
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
    
    // Generate CSV
    const headers = ['Title', 'Price', 'Reviews', 'Rating', 'URL', 'Thumbnail', 'Shop_URL', 'Badges', 'Is_Ad', 'PageOrigin', 'SearchQuery'];
    const rows = filteredListings.map(listing => [
        escapeCSV(listing.Title || ''),
        listing.Price,
        listing.Reviews,
        listing.Rating,
        listing.URL || '',
        listing.Thumbnail || '',
        listing.Shop_URL || '',
        listing.Badges || '',
        listing.Is_Ad,
        listing.PageOrigin || '',
        listing.SearchQuery || ''
    ]);
    
    const csv = [headers, ...rows].map(row => row.map(v => `"${v}"`).join(',')).join('\n');
    
    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

// ==========================================
// UI Updates
// ==========================================

function showViewer() {
    elements.uploadSection.style.display = 'none';
    elements.viewerSection.style.display = 'block';
    
    elements.resultsCount.textContent = `${allListings.length} listings`;
    elements.lastUpdated.textContent = `Last updated: ${new Date().toLocaleString()}`;
    
    // Initialize price/review/rating ranges
    const maxPrice = Math.max(...allListings.map(l => l.Price), 1000);
    const maxReviews = Math.max(...allListings.map(l => l.Reviews), 10000);
    
    elements.priceMaxSlider.max = maxPrice;
    elements.priceMaxSlider.value = maxPrice;
    elements.reviewMaxSlider.max = maxReviews;
    elements.reviewMaxSlider.value = maxReviews;
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
        elements.priceMin.textContent = `$${min}`;
        elements.priceMax.textContent = max >= 1000 ? '$1K+' : `$${max}`;
    } else if (type === 'review') {
        const min = parseInt(elements.reviewMinSlider.value);
        const max = parseInt(elements.reviewMaxSlider.value);
        elements.reviewMin.textContent = formatNumber(min);
        elements.reviewMax.textContent = max >= 10000 ? '10K+' : formatNumber(max);
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

function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
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
