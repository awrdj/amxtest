document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('searchForm');
    const copyUrlBtn = document.getElementById('copyUrlBtn');
    const visitUrlBtn = document.getElementById('visitUrlBtn');
    const generatedUrlEl = document.getElementById('generatedUrl');
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    const physicalItemsCheckbox = document.getElementById('physicalItems');
    const instantDownloadCheckbox = document.getElementById('instantDownload');
    const presetsSelect = document.getElementById('presetsSelect');
    
    let useMarketPage = false;

    // Toggle Additional Filters
    const toggleButton = document.getElementById('toggleAdditionalFilters');
    const additionalFilters = document.getElementById('additionalFilters');
    const toggleText = document.getElementById('toggleText');
    const toggleIcon = document.getElementById('toggleIcon');

    toggleButton.addEventListener('click', function() {
        const isHidden = additionalFilters.style.display === 'none';
        
        if (isHidden) {
            additionalFilters.style.display = 'grid';
            toggleText.textContent = 'Hide Additional Filters';
            toggleButton.classList.add('active');
        } else {
            additionalFilters.style.display = 'none';
            toggleText.textContent = 'Show Additional Filters';
            toggleButton.classList.remove('active');
        }
    }); 

    // Mutual exclusivity for Physical Items and Digital Downloads
    physicalItemsCheckbox.addEventListener('change', function() {
        if (this.checked) {
            instantDownloadCheckbox.checked = false;
        }
        generateEtsyUrl();
    });

    instantDownloadCheckbox.addEventListener('change', function() {
        if (this.checked) {
            physicalItemsCheckbox.checked = false;
        }
        generateEtsyUrl();
    });

    // Function to reset all filters to default
    function resetAllFilters() {
        // Reset shipping selects
        document.getElementById('shipToSelect').value = '';
        document.getElementById('locationQuerySelect').value = '';
        
        // Reset sort order
        document.getElementById('sortOrder').value = 'most_relevant';
        
        // Reset price range
        document.getElementById('minPrice').value = '';
        document.getElementById('maxPrice').value = '';
        
        // Uncheck all checkboxes
        document.getElementById('physicalItems').checked = false;
        document.getElementById('instantDownload').checked = false;
        document.getElementById('customizable').checked = false;
        document.getElementById('freeShipping').checked = false;
        document.getElementById('onSale').checked = false;
        document.getElementById('starSeller').checked = false;
        document.getElementById('bestSeller').checked = false;
        
        // Reset explicit filter to auto
        document.getElementById('explicitAuto').checked = true;
        
        // Reset market page flag
        useMarketPage = false;
    }

    // Presets functionality
    presetsSelect.addEventListener('change', function() {
        const preset = this.value;
        
        // First, reset all filters
        resetAllFilters();
        
        if (preset === 'market_page') {
            // Apply Market Page preset - just sets the flag
            useMarketPage = true;
        } else if (preset === 'newest_bestselling_physical') {
            // Apply Newest Best-selling (Physical) preset
            document.getElementById('bestSeller').checked = true;
            physicalItemsCheckbox.checked = true;
            document.getElementById('sortOrder').value = 'date_desc';
            document.getElementById('explicitAll').checked = true;
        } else if (preset === 'newest_bestselling_digital') {
            // Apply Newest Best-selling (Digital) preset
            document.getElementById('bestSeller').checked = true;
            instantDownloadCheckbox.checked = true;
            document.getElementById('sortOrder').value = 'date_desc';
            document.getElementById('explicitAll').checked = true;
        }
        
        generateEtsyUrl();
    });

    // Show/hide clear button and update URL as user types
    searchInput.addEventListener('input', function() {
        clearSearchBtn.style.display = this.value ? 'flex' : 'none';
        generateEtsyUrl();
    });

    clearSearchBtn.addEventListener('click', function() {
        searchInput.value = '';
        this.style.display = 'none';
        searchInput.focus();
        generateEtsyUrl();
    });

    // Generate URL on form submit (pressing Enter or clicking Search button)
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const url = generatedUrlEl.textContent;
        if (url && url.startsWith('http')) {
            window.open(url, '_blank');
        }
    });

    // Copy URL to clipboard
    copyUrlBtn.addEventListener('click', function() {
        const url = generatedUrlEl.textContent;
        navigator.clipboard.writeText(url).then(() => {
            const originalHTML = copyUrlBtn.innerHTML;
            copyUrlBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                copyUrlBtn.innerHTML = originalHTML;
            }, 2000);
        });
    });

    // Visit URL button
    visitUrlBtn.addEventListener('click', function() {
        const url = generatedUrlEl.textContent;
        if (url && url.startsWith('http')) {
            window.open(url, '_blank');
        }
    });

    function generateEtsyUrl() {
        let finalUrl;
        const query = searchInput.value.trim();
        
        // Market Page format
        if (useMarketPage) {
            const keyword = query ? encodeURIComponent(query.replace(/\s+/g, '_')) : 'specify_your_keyword';
            finalUrl = `https://www.etsy.com/market/${keyword}`;
        } else {
            // Standard search format
            const baseUrl = 'https://www.etsy.com/search';
            const params = [];

            // Search query
            if (query) {
                params.push(`q=${encodeURIComponent(query)}`);
            }

            // Explicit filter
            const explicitFilter = document.querySelector('input[name="explicitFilter"]:checked').value;
            if (explicitFilter !== 'auto') {
                params.push(`explicit=${explicitFilter}`);
            }

            // Ships to (ship_to)
            const shipTo = document.getElementById('shipToSelect').value;
            if (shipTo) {
                params.push(`ship_to=${shipTo}`);
            }

            // Ships from (locationQuery)
            const locationQuery = document.getElementById('locationQuerySelect').value;
            if (locationQuery) {
                params.push(`locationQuery=${locationQuery}`);
            }

            // Sort order without giving most relevant a value since it's default (KEEP THIS COMMENT)
            /*const sortOrder = document.getElementById('sortOrder').value;
            if (sortOrder && sortOrder !== 'most_relevant') {
                params.push(`order=${sortOrder}`);
            }*/

            // Sort order
            const sortOrder = document.getElementById('sortOrder').value;
            if (sortOrder) {
                params.push(`order=${sortOrder}`);
            }

            // Price range - Add custom_price=1 when prices are set
            const minPrice = document.getElementById('minPrice').value;
            const maxPrice = document.getElementById('maxPrice').value;
            if (minPrice || maxPrice) {
                params.push('custom_price=1');
                if (minPrice) {
                    params.push(`min=${minPrice}`);
                }
                if (maxPrice) {
                    params.push(`max=${maxPrice}`);
                }
            }

            // Free shipping
            if (document.getElementById('freeShipping').checked) {
                params.push('free_shipping=true');
            }

            // On sale (is_discounted)
            if (document.getElementById('onSale').checked) {
                params.push('is_discounted=true');
            }

            // Customizable
            if (document.getElementById('customizable').checked) {
                params.push('customizable=true');
            }

            // Physical Items (instant_download=false)
            if (physicalItemsCheckbox.checked) {
                params.push('instant_download=false');
            }

            // Instant download (digital)
            if (instantDownloadCheckbox.checked) {
                params.push('instant_download=true');
            }

            // Star Seller
            if (document.getElementById('starSeller').checked) {
                params.push('is_star_seller=true');
            }

            // Best Seller (hidden filter)
            if (document.getElementById('bestSeller').checked) {
                params.push('is_best_seller=true');
            }

            // Construct final URL
            finalUrl = params.length > 0 ? `${baseUrl}?${params.join('&')}` : baseUrl;
        }
        
        generatedUrlEl.textContent = finalUrl;
        document.getElementById('resultUrlContainer').style.display = 'block';
    }

    // Auto-generate URL on any filter change
    const filterElements = [
        'shipToSelect', 'locationQuerySelect', 'sortOrder', 'minPrice', 'maxPrice',
        'freeShipping', 'onSale', 'customizable', 'starSeller', 'bestSeller',
        'explicitAuto', 'explicitSafe', 'explicitAll'
    ];

    filterElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            if (element.type === 'checkbox' || element.type === 'radio') {
                element.addEventListener('change', generateEtsyUrl);
            } else {
                element.addEventListener('change', generateEtsyUrl);
                if (element.tagName === 'INPUT') {
                    element.addEventListener('input', generateEtsyUrl);
                }
            }
        }
    });

    // Initialize with empty URL
    generateEtsyUrl();
});
