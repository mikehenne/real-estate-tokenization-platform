// Binaryx Clone - Multi-page Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    
    // Current page state
    let currentPage = 'home';
    
    // Initialize the application
    initializeApp();
    
    function initializeApp() {
        // Set up navigation
        setupNavigation();
        
        // Load home page by default
        loadPage('home');
        
        // Set up other interactive features
        setupLanguageSelector();
        setupSignInButton();
        setupMobileMenu();
        
        console.log('Binaryx multi-page clone initialized successfully!');
    }
    
    // Navigation Setup
    function setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                
                const page = this.getAttribute('data-page');
                if (page) {
                    loadPage(page);
                    
                    // Update active nav item
                    navItems.forEach(nav => nav.classList.remove('active'));
                    this.classList.add('active');
                }
            });
        });
    }
    
    // Page Loading System
    function loadPage(pageName) {
        currentPage = pageName;
        const mainContent = document.getElementById('main-content');
        const template = document.getElementById(`${pageName}-template`);
        
        if (template) {
            mainContent.innerHTML = template.innerHTML;
            
            // Load page-specific content
            switch(pageName) {
                case 'home':
                    loadHomePage();
                    break;
                case 'portfolio':
                    loadPortfolioPage();
                    break;
                case 'construction':
                    loadConstructionPage();
                    break;
                case 'rental':
                    loadRentalPage();
                    break;
                case 'p2p-market':
                    loadP2PMarketPage();
                    break;
                case 'partners':
                    loadPartnersPage();
                    break;
            }
            
            // Set up page-specific interactions
            setupPageInteractions(pageName);
            
        } else {
            mainContent.innerHTML = `<div class="error">Page "${pageName}" not found</div>`;
        }
        
        // Update URL without page reload
        updateURL(pageName);
    }
    
    // Home Page
    function loadHomePage() {
        loadPropertiesGrid('rental-properties', propertyData.rental.slice(0, 4));
        loadPropertiesGrid('construction-properties', propertyData.construction.slice(0, 2));
        setupFilters();
    }
    
    // Portfolio Page
    function loadPortfolioPage() {
        setupPortfolioTabs();
    }
    
    // Construction Page
    function loadConstructionPage() {
        loadPropertiesGrid('construction-investments', propertyData.construction);
    }
    
    // Rental Page
    function loadRentalPage() {
        loadPropertiesGrid('rental-investments', propertyData.rental);
    }
    
    // P2P Market Page
    function loadP2PMarketPage() {
        loadP2PProperties();
    }
    
    // Partners Page
    function loadPartnersPage() {
        loadPartners();
    }
    
    // Property Grid Loader
    function loadPropertiesGrid(containerId, properties) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = '';
        
        properties.forEach(property => {
            const propertyCard = createPropertyCard(property);
            container.appendChild(propertyCard);
        });
    }
    
    // Create Property Card
    function createPropertyCard(property) {
        const card = document.createElement('div');
        card.className = 'property-card';
        card.setAttribute('data-property-id', property.id);
        
        let statusBadges = '';
        if (property.status === 'upcoming') {
            statusBadges += '<div class="status-badge upcoming">UPCOMING</div>';
        } else if (property.status === 'hot-deal') {
            statusBadges += '<div class="status-badge hot-deal">🔥 HOT DEAL</div>';
        }
        
        if (property.fundingType) {
            statusBadges += `<div class="status-badge construction">🏗️ ${property.fundingType}</div>`;
        }
        
        let unitsSection = '';
        if (property.units) {
            unitsSection = `
                <div class="units-info">
                    ${property.units.map(unit => `<div class="unit">${unit}</div>`).join('')}
                </div>
            `;
        }
        
        let priceSection = '';
        if (property.price) {
            priceSection = `<div class="property-price">${property.price}</div>`;
        }
        
        // Handle different card types
        if (property.category === 'construction') {
            card.innerHTML = `
                <div class="property-image">
                    <img src="${property.image}" alt="${property.title}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMjUgNzVIMTc1VjEyNUgxMjVWNzVaIiBmaWxsPSIjOUI5QkEwIi8+PC9zdmc+'" />
                    <div class="investors-badge">👥 ${property.investors} Investors</div>
                    ${statusBadges}
                </div>
                <div class="property-info">
                    <div class="property-type">${property.type}</div>
                    <div class="property-location">${property.location}</div>
                    <h3 class="property-title">${property.title}</h3>
                    <div class="construction-details">
                        <div class="detail-row">
                            <span>Profit Distr.</span>
                            <span>${property.profitDistr}</span>
                        </div>
                        <div class="detail-row">
                            <span>ROI</span>
                            <span>${property.roi}</span>
                        </div>
                        <div class="detail-row">
                            <span>APR</span>
                            <div class="apr-badge">${property.apr}</div>
                        </div>
                    </div>
                    <div class="progress-section">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${property.progress}%"></div>
                        </div>
                        <div class="funds-collected">
                            <span>Funds collected:</span>
                            <span>${property.progress}%</span>
                        </div>
                    </div>
                    <button class="invest-btn">Invest</button>
                </div>
            `;
        } else {
            card.innerHTML = `
                <div class="property-image">
                    <img src="${property.image}" alt="${property.title}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMjUgNzVIMTc1VjEyNUgxMjVWNzVaIiBmaWxsPSIjOUI5QkEwIi8+PC9zdmc+'" />
                    <div class="investors-badge">👥 ${property.investors} Investors</div>
                    ${statusBadges}
                </div>
                <div class="property-info">
                    <div class="property-type">${property.type}</div>
                    <div class="property-location">${property.location}</div>
                    <h3 class="property-title">${property.title}</h3>
                    ${priceSection}
                    <div class="property-details">
                        <div class="price-info">
                            <span class="currency">$</span>
                            <div class="price-details">
                                <div class="label">Token Price</div>
                                <div class="value">${property.tokenPrice}</div>
                            </div>
                            <div class="apr-info">
                                <div class="label">APR</div>
                                <div class="apr-value">${property.apr}</div>
                            </div>
                        </div>
                        ${unitsSection}
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${property.progress}%"></div>
                        </div>
                        <div class="progress-text">${property.progress}%</div>
                    </div>
                </div>
            `;
        }
        
        // Add click event
        card.addEventListener('click', () => showPropertyModal(property));
        
        return card;
    }
    
    // Create P2P Property Card
    function createP2PPropertyCard(property) {
        const card = document.createElement('div');
        card.className = 'p2p-property-card';
        
        let aprSection = '';
        if (property.apr !== '--') {
            aprSection = `
                <div class="apr-section">
                    <div class="label">APR</div>
                    <div class="apr-value">${property.apr}</div>
                    ${property.aprChange ? `<div class="apr-change">(${property.aprChange})</div>` : ''}
                </div>
            `;
        }
        
        card.innerHTML = `
            <div class="property-image">
                <img src="${property.image}" alt="${property.title}" />
            </div>
            <div class="property-info">
                <div class="property-location">${property.location}</div>
                <h3 class="property-title">${property.title}</h3>
                <div class="property-price">Property price: ${property.propertyPrice}</div>
                <div class="token-details">
                    <div class="token-price">
                        <div class="label">Token price</div>
                        <div class="current-price">${property.tokenPrice}</div>
                        <div class="original-price">${property.originalPrice}</div>
                    </div>
                    ${aprSection}
                </div>
                <div class="availability">Available to buy: ${property.availableTokens} Tokens</div>
                <div class="action-buttons">
                    <button class="buy-btn">Buy</button>
                    <button class="sell-btn">Sell</button>
                </div>
            </div>
        `;
        
        return card;
    }
    
    // Load P2P Properties
    function loadP2PProperties() {
        const container = document.getElementById('p2p-properties');
        if (!container) return;
        
        container.innerHTML = '';
        
        propertyData.p2pMarket.forEach(property => {
            const propertyCard = createP2PPropertyCard(property);
            container.appendChild(propertyCard);
        });
    }
    
    // Load Partners
    function loadPartners() {
        const container = document.getElementById('partners-list');
        if (!container) return;
        
        container.innerHTML = '';
        
        propertyData.partners.forEach(partner => {
            const partnerCard = createPartnerCard(partner);
            container.appendChild(partnerCard);
        });
    }
    
    // Create Partner Card
    function createPartnerCard(partner) {
        const card = document.createElement('div');
        card.className = 'partner-card';
        
        card.innerHTML = `
            <div class="partner-status">
                <span class="status-indicator ${partner.status.toLowerCase()}"></span>
                <span>${partner.status}</span>
            </div>
            <div class="partner-content">
                <div class="partner-logo">
                    <img src="${partner.logo}" alt="${partner.name}" />
                </div>
                <div class="partner-info">
                    <h3>${partner.name}</h3>
                    <p>${partner.description}</p>
                    <div class="partner-details">
                        <div class="detail">
                            <span>Type</span>
                            <span>${partner.type}</span>
                        </div>
                        <div class="detail">
                            <span>Linked To</span>
                            <span>${partner.linkedAssets} Assets</span>
                        </div>
                        <div class="detail">
                            <span>Created</span>
                            <span>${partner.created}</span>
                        </div>
                    </div>
                    <button class="see-details-btn">See Details</button>
                </div>
            </div>
        `;
        
        return card;
    }
    
    // Setup Page Interactions
    function setupPageInteractions(pageName) {
        if (pageName === 'home') {
            setupFilters();
        } else if (pageName === 'portfolio') {
            setupPortfolioTabs();
        }
    }
    
    // Setup Filters
    function setupFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                const filterText = this.textContent.trim();
                
                // Filter properties based on selection
                filterProperties(filterText);
                
                // Show notification
                showNotification(`Filtered by: ${filterText}`);
            });
        });
    }
    
    // Filter Properties
    function filterProperties(filter) {
        const propertyCards = document.querySelectorAll('.property-card');
        
        propertyCards.forEach(card => {
            const location = card.querySelector('.property-location').textContent;
            
            if (filter === '🌍 All') {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s ease-out';
            } else if (filter === '🇹🇷 Turkey' && location.includes('Turkey')) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s ease-out';
            } else if (filter === '🇮🇩 Indonesia' && location.includes('Indonesia')) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s ease-out';
            } else if (filter === '🇲🇪 Montenegro' && location.includes('Montenegro')) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s ease-out';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    // Setup Portfolio Tabs
    function setupPortfolioTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                tabButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                const tab = this.getAttribute('data-tab');
                showNotification(`Switched to ${tab} tab`);
            });
        });
        
        // Setup wallet connect button
        const connectBtn = document.querySelector('.connect-wallet-btn');
        if (connectBtn) {
            connectBtn.addEventListener('click', () => showAuthModal());
        }
    }
    
    // Language Selector
    function setupLanguageSelector() {
        const languageSelector = document.querySelector('.language-selector');
        const languageOptions = ['EN - English', 'UK - Українська', 'RU - Русский'];
        let currentLanguageIndex = 0;

        if (languageSelector) {
            languageSelector.addEventListener('click', function() {
                currentLanguageIndex = (currentLanguageIndex + 1) % languageOptions.length;
                const selectedLanguage = languageOptions[currentLanguageIndex];
                const langCode = selectedLanguage.split(' - ')[0];
                languageSelector.querySelector('span:nth-child(2)').textContent = langCode;
                
                showNotification(`Language changed to ${selectedLanguage}`);
            });
        }
    }
    
    // Sign In Button
    function setupSignInButton() {
        const signInBtn = document.querySelector('.sign-in-btn');
        if (signInBtn) {
            signInBtn.addEventListener('click', function() {
                showAuthModal();
            });
        }
    }
    
    // Mobile Menu
    function setupMobileMenu() {
        const menuBtn = document.querySelector('.menu-btn');
        const navMenu = document.querySelector('.nav-menu');
        
        if (menuBtn && navMenu) {
            menuBtn.addEventListener('click', function() {
                navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
                navMenu.style.position = 'absolute';
                navMenu.style.top = '100%';
                navMenu.style.left = '0';
                navMenu.style.right = '0';
                navMenu.style.background = 'white';
                navMenu.style.flexDirection = 'column';
                navMenu.style.padding = '20px';
                navMenu.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                navMenu.style.zIndex = '1000';
            });
        }
    }
    
    // Show Property Modal
    function showPropertyModal(property) {
        const existingModal = document.querySelector('.property-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.className = 'property-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>${property.title}</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <p><strong>Token Price:</strong> ${property.tokenPrice}</p>
                        <p><strong>APR:</strong> ${property.apr}</p>
                        <p><strong>Location:</strong> ${property.location}</p>
                        <p><strong>Investors:</strong> ${property.investors}</p>
                        <p><strong>Status:</strong> Available for investment</p>
                        <div class="modal-actions">
                            <button class="btn-primary">Invest Now</button>
                            <button class="btn-secondary">Learn More</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 10000;
            animation: fadeIn 0.3s ease-out;
        `;

        document.body.appendChild(modal);

        const closeBtn = modal.querySelector('.modal-close');
        const overlay = modal.querySelector('.modal-overlay');
        
        closeBtn.addEventListener('click', () => modal.remove());
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) modal.remove();
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') modal.remove();
        });
    }
    
    // Show Auth Modal
    function showAuthModal() {
        const existingModal = document.querySelector('.auth-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.className = 'auth-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Sign In to access all platform features</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form class="auth-form">
                            <div class="form-group">
                                <label for="email">Email</label>
                                <input type="email" id="email" required>
                            </div>
                            <div class="form-group">
                                <label for="password">Password</label>
                                <input type="password" id="password" required>
                            </div>
                            <button type="submit" class="btn-primary">Sign In</button>
                        </form>
                        <div class="auth-footer">
                            <p>Want to know more? <a href="https://guide.binaryx.com/" target="_blank">How to invest</a></p>
                            <p>Live Chat Support: <span class="status online">Online</span></p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 10000;
            animation: fadeIn 0.3s ease-out;
        `;

        document.body.appendChild(modal);

        const closeBtn = modal.querySelector('.modal-close');
        const overlay = modal.querySelector('.modal-overlay');
        const form = modal.querySelector('.auth-form');
        
        closeBtn.addEventListener('click', () => modal.remove());
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) modal.remove();
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('Sign in functionality would be implemented here');
            modal.remove();
        });
    }
    
    // Show Notification
    function showNotification(message) {
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #06b6d4;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // Update URL
    function updateURL(page) {
        const newURL = page === 'home' ? '/' : `/${page}`;
        window.history.pushState({ page }, '', newURL);
    }
    
    // Handle browser back/forward
    window.addEventListener('popstate', function(e) {
        const page = e.state?.page || 'home';
        loadPage(page);
        
        // Update active nav item
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(nav => nav.classList.remove('active'));
        const activeNav = document.querySelector(`[data-page="${page}"]`);
        if (activeNav) activeNav.classList.add('active');
    });
    
    // Add CSS for new components
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }

        .modal-overlay {
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            padding: 20px;
        }

        .modal-content {
            background: white;
            border-radius: 12px;
            max-width: 500px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
        }

        .modal-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 20px;
            border-bottom: 1px solid #e5e7eb;
        }

        .modal-header h3 {
            margin: 0;
            color: #1f2937;
        }

        .modal-close {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #6b7280;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .modal-close:hover {
            color: #1f2937;
        }

        .modal-body {
            padding: 20px;
        }

        .modal-actions {
            display: flex;
            gap: 12px;
            margin-top: 20px;
        }

        .btn-primary {
            background: #06b6d4;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            font-weight: 500;
            cursor: pointer;
            flex: 1;
        }

        .btn-primary:hover {
            background: #0891b2;
        }

        .btn-secondary {
            background: #f3f4f6;
            color: #1f2937;
            border: 1px solid #e5e7eb;
            padding: 10px 20px;
            border-radius: 6px;
            font-weight: 500;
            cursor: pointer;
            flex: 1;
        }

        .btn-secondary:hover {
            background: #e5e7eb;
        }

        .auth-form {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .form-group {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .form-group label {
            font-weight: 500;
            color: #1f2937;
            font-size: 14px;
        }

        .form-group input {
            padding: 10px 12px;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            font-size: 14px;
        }

        .form-group input:focus {
            outline: none;
            border-color: #06b6d4;
            box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
        }

        .auth-footer {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 14px;
        }

        .auth-footer p {
            margin: 8px 0;
        }

        .auth-footer a {
            color: #06b6d4;
            text-decoration: none;
        }

        .auth-footer a:hover {
            text-decoration: underline;
        }
    `;
    document.head.appendChild(style);
});
