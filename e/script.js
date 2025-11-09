document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('searchForm');
    const copyUrlBtn = document.getElementById('copyUrlBtn');
    const visitUrlBtn = document.getElementById('visitUrlBtn');
    const generatedUrlEl = document.getElementById('generatedUrl');
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearchBtn');

    // Show/hide clear button and update URL as user types
    searchInput.addEventListener('input', function() {
        clearSearchBtn.style.display = this.value ? 'flex' : 'none';
        generateEtsyUrl(); // Update URL in real-time
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
        const baseUrl = 'https://www.etsy.com/search';
        const params = [];

        // Search query
        const query = searchInput.value.trim();
        if (query) {
            params.push(`q=${encodeURIComponent(query)}`);
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

        // Sort order
        const sortOrder = document.getElementById('sortOrder').value;
        if (sortOrder && sortOrder !== 'most_relevant') {
            params.push(`order=${sortOrder}`);
        }

        // Price range - Add explicit=1 only if prices are set
        const minPrice = document.getElementById('minPrice').value;
        const maxPrice = document.getElementById('maxPrice').value;
        if (minPrice || maxPrice) {
            params.push('explicit=1');
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

        // Instant download (digital)
        if (document.getElementById('instantDownload').checked) {
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
        const finalUrl = params.length > 0 ? `${baseUrl}?${params.join('&')}` : baseUrl;
        
        generatedUrlEl.textContent = finalUrl;
        document.getElementById('resultUrlContainer').style.display = 'block';
    }

    // Auto-generate URL on any filter change
    const filterElements = [
        'shipToSelect', 'locationQuerySelect', 'sortOrder', 'minPrice', 'maxPrice',
        'freeShipping', 'onSale', 'customizable', 'instantDownload', 'starSeller', 'bestSeller'
    ];

    filterElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            if (element.type === 'checkbox') {
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
