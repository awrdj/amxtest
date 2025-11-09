document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('searchForm');
    const copyUrlBtn = document.getElementById('copyUrlBtn');
    const generatedUrlEl = document.getElementById('generatedUrl');
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    const suggestionsContainer = document.getElementById('suggestionsContainer');

    // Show/hide clear button
    searchInput.addEventListener('input', function() {
        clearSearchBtn.style.display = this.value ? 'flex' : 'none';
    });

    clearSearchBtn.addEventListener('click', function() {
        searchInput.value = '';
        this.style.display = 'none';
        suggestionsContainer.innerHTML = '';
        searchInput.focus();
    });

    // Generate URL on form submit
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        generateEtsyUrl();
    });

    // Copy URL to clipboard
    copyUrlBtn.addEventListener('click', function() {
        const url = generatedUrlEl.textContent;
        navigator.clipboard.writeText(url).then(() => {
            const originalHTML = copyUrlBtn.innerHTML;
            copyUrlBtn.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                copyUrlBtn.innerHTML = originalHTML;
            }, 2000);
        });
    });

    function generateEtsyUrl() {
        const baseUrl = 'https://www.etsy.com/search';
        const params = [];

        // Search query
        const query = document.getElementById('searchInput').value.trim();
        if (query) {
            params.push(`q=${encodeURIComponent(query)}`);
        }

        // Region filter
        const region = document.getElementById('regionSelect').value;
        if (region) {
            params.push(`ship_to=${region}`);
        }

        // Category filter
        const category = document.getElementById('categorySelect').value;
        if (category) {
            params.push(`category=${category}`);
        }

        // Sort order
        const sortOrder = document.getElementById('sortOrder').value;
        if (sortOrder && sortOrder !== 'relevancy') {
            params.push(`order=${sortOrder}`);
        }

        // Price range
        const minPrice = document.getElementById('minPrice').value;
        const maxPrice = document.getElementById('maxPrice').value;
        if (minPrice) {
            params.push(`min_price=${minPrice}`);
        }
        if (maxPrice) {
            params.push(`max_price=${maxPrice}`);
        }

        // Free shipping
        if (document.getElementById('freeShipping').checked) {
            params.push('free_shipping=true');
        }

        // On sale
        if (document.getElementById('onSale').checked) {
            params.push('on_sale=1');
        }

        // Customizable
        if (document.getElementById('customizable').checked) {
            params.push('is_customizable=true');
        }

        // Gift wrap
        if (document.getElementById('giftWrap').checked) {
            params.push('is_gift_wrappable=true');
        }

        // Accepts gift cards
        if (document.getElementById('acceptsGiftCards').checked) {
            params.push('accepts_gift_cards=true');
        }

        // Construct final URL
        const finalUrl = params.length > 0 ? `${baseUrl}?${params.join('&')}` : baseUrl;
        
        generatedUrlEl.textContent = finalUrl;
        document.getElementById('resultUrlContainer').style.display = 'block';
    }

    // Auto-generate URL on any filter change
    const filterElements = [
        'regionSelect', 'categorySelect', 'sortOrder', 'minPrice', 'maxPrice',
        'freeShipping', 'onSale', 'customizable', 'giftWrap', 'acceptsGiftCards'
    ];

    filterElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('change', generateEtsyUrl);
        }
    });

    // Initialize with empty URL
    generateEtsyUrl();
});
