// js/tools-enhanced.js
class AIToolsEnhanced {
    constructor() {
        this.tools = [];
        this.filteredTools = [];
        this.currentPage = 1;
        this.itemsPerPage = 9;
        this.totalPages = 1;
        this.filters = {
            category: 'all',
            price: 'all',
            rating: 'all',
            level: 'all'
        };
        this.sortBy = 'popular';
        this.searchQuery = '';
        this.comparedTools = new Set();
        this.featuredSwiper = null;
        
        this.init();
    }

    async init() {
        await this.loadTools();
        this.initSwiper();
        this.setupEventListeners();
        this.renderTools();
        this.updateToolCount();
        this.setupSearch();
    }

    async loadTools() {
        // Simulate API call with realistic AI tools data
        this.tools = [
            {
                id: 1,
                name: "GPT-5 Studio Pro",
                category: "content",
                description: "Advanced multimodal AI for content creation, coding, and creative tasks with enterprise-grade security.",
                rating: 4.9,
                reviews: 2450,
                price: "Premium",
                priceValue: 89,
                level: "expert",
                features: ["Text Generation", "Code Writing", "Image Analysis", "API Access", "Multilingual"],
                website: "https://example.com/gpt5",
                icon: "fas fa-robot",
                tags: ["AI", "Content", "Enterprise"],
                popularity: 98,
                updated: "2024-01-15",
                freeTrial: true,
                integrations: ["Slack", "Google Docs", "Notion"],
                pricingModel: "subscription"
            },
            {
                id: 2,
                name: "Midjourney Pro",
                category: "image",
                description: "Professional AI image generation platform with 4K resolution and advanced style control.",
                rating: 4.8,
                reviews: 1890,
                price: "Subscription",
                priceValue: 49,
                level: "intermediate",
                features: ["4K Resolution", "Style Transfer", "Batch Processing", "Commercial Use", "API"],
                website: "https://example.com/midjourney",
                icon: "fas fa-palette",
                tags: ["Design", "Images", "Creative"],
                popularity: 95,
                updated: "2024-02-01",
                freeTrial: true,
                integrations: ["Photoshop", "Figma", "Canva"],
                pricingModel: "subscription"
            },
            {
                id: 3,
                name: "GitHub Copilot X",
                category: "code",
                description: "AI-powered coding assistant with chat interface, bug detection, and multi-language support.",
                rating: 4.7,
                reviews: 3250,
                price: "Freemium",
                priceValue: 10,
                level: "beginner",
                features: ["Code Completion", "Bug Detection", "Documentation", "Multi-language", "VS Code"],
                website: "https://example.com/copilot",
                icon: "fas fa-code",
                tags: ["Development", "Coding", "Productivity"],
                popularity: 96,
                updated: "2024-01-20",
                freeTrial: true,
                integrations: ["VS Code", "JetBrains", "GitHub"],
                pricingModel: "freemium"
            },
            {
                id: 4,
                name: "Tableau AI",
                category: "data",
                description: "Intelligent data visualization and analysis with predictive analytics and auto-insights.",
                rating: 4.6,
                reviews: 870,
                price: "Enterprise",
                priceValue: 199,
                level: "expert",
                features: ["Auto Insights", "Predictive Analytics", "Real-time Data", "Dashboards", "Collaboration"],
                website: "https://example.com/tableau-ai",
                icon: "fas fa-chart-line",
                tags: ["Data", "Analytics", "Business"],
                popularity: 88,
                updated: "2024-01-10",
                freeTrial: false,
                integrations: ["Salesforce", "Google Sheets", "SQL"],
                pricingModel: "enterprise"
            },
            {
                id: 5,
                name: "Jasper AI",
                category: "content",
                description: "Enterprise-grade content creation platform with brand voice consistency and SEO optimization.",
                rating: 4.5,
                reviews: 1560,
                price: "Subscription",
                priceValue: 59,
                level: "intermediate",
                features: ["Brand Voice", "SEO Optimization", "Collaboration", "Templates", "Plagiarism Check"],
                website: "https://example.com/jasper",
                icon: "fas fa-pen-fancy",
                tags: ["Marketing", "Content", "SEO"],
                popularity: 92,
                updated: "2024-01-25",
                freeTrial: true,
                integrations: ["WordPress", "Shopify", "HubSpot"],
                pricingModel: "subscription"
            },
            {
                id: 6,
                name: "DALL-E 3 Pro",
                category: "image",
                description: "Advanced image generation from text with photorealistic results and editing tools.",
                rating: 4.8,
                reviews: 1340,
                price: "Credits",
                priceValue: 15,
                level: "beginner",
                features: ["Photorealistic", "Art Styles", "Editing Tools", "Commercial Use", "Batch Generate"],
                website: "https://example.com/dalle3",
                icon: "fas fa-image",
                tags: ["Art", "Design", "Images"],
                popularity: 90,
                updated: "2024-02-05",
                freeTrial: true,
                integrations: ["Discord", "Slack", "API"],
                pricingModel: "credits"
            },
            {
                id: 7,
                name: "Descript Pro",
                category: "video",
                description: "AI video editing platform with text-based editing, voice cloning, and screen recording.",
                rating: 4.4,
                reviews: 760,
                price: "Subscription",
                priceValue: 39,
                level: "intermediate",
                features: ["Text-based Editing", "Voice Cloning", "Screen Recording", "Templates", "Collaboration"],
                website: "https://example.com/descript",
                icon: "fas fa-video",
                tags: ["Video", "Editing", "Audio"],
                popularity: 85,
                updated: "2024-01-30",
                freeTrial: true,
                integrations: ["YouTube", "Premiere Pro", "Dropbox"],
                pricingModel: "subscription"
            },
            {
                id: 8,
                name: "Murf AI Studio",
                category: "audio",
                description: "Professional AI voice generator with natural-sounding voices in 20+ languages.",
                rating: 4.3,
                reviews: 540,
                price: "Freemium",
                priceValue: 29,
                level: "beginner",
                features: ["Natural Voices", "20+ Languages", "Voice Cloning", "Audio Editing", "Commercial"],
                website: "https://example.com/murf",
                icon: "fas fa-microphone",
                tags: ["Audio", "Voice", "Podcasting"],
                popularity: 82,
                updated: "2024-01-18",
                freeTrial: true,
                integrations: ["Audacity", "Premiere Pro", "Canva"],
                pricingModel: "freemium"
            },
            {
                id: 9,
                name: "Consensus AI",
                category: "research",
                description: "AI research assistant that finds, summarizes, and analyzes scientific papers.",
                rating: 4.7,
                reviews: 420,
                price: "Subscription",
                priceValue: 19,
                level: "expert",
                features: ["Paper Search", "Summarization", "Citation Analysis", "Research Trends", "Export"],
                website: "https://example.com/consensus",
                icon: "fas fa-flask",
                tags: ["Research", "Academic", "Science"],
                popularity: 87,
                updated: "2024-02-02",
                freeTrial: true,
                integrations: ["Zotero", "Google Scholar", "Notion"],
                pricingModel: "subscription"
            },
            {
                id: 10,
                name: "Runway ML",
                category: "video",
                description: "Creative AI tool suite for video generation, editing, and special effects.",
                rating: 4.6,
                reviews: 980,
                price: "Freemium",
                priceValue: 35,
                level: "intermediate",
                features: ["Video Generation", "Style Transfer", "Object Removal", "Collaboration", "API"],
                website: "https://example.com/runway",
                icon: "fas fa-film",
                tags: ["Video", "Creative", "Design"],
                popularity: 89,
                updated: "2024-01-22",
                freeTrial: true,
                integrations: ["After Effects", "Premiere Pro", "Figma"],
                pricingModel: "freemium"
            },
            {
                id: 11,
                name: "Notion AI",
                category: "content",
                description: "AI-powered workspace assistant for writing, summarizing, and organizing content.",
                rating: 4.4,
                reviews: 2150,
                price: "Freemium",
                priceValue: 8,
                level: "beginner",
                features: ["Writing Assistant", "Summarization", "Task Management", "Templates", "Integration"],
                website: "https://example.com/notion-ai",
                icon: "fas fa-sticky-note",
                tags: ["Productivity", "Writing", "Organization"],
                popularity: 94,
                updated: "2024-01-28",
                freeTrial: true,
                integrations: ["Notion", "Slack", "Google Drive"],
                pricingModel: "freemium"
            },
            {
                id: 12,
                name: "Canva AI",
                category: "image",
                description: "AI-powered design platform with automatic layout, image generation, and content creation.",
                rating: 4.5,
                reviews: 3780,
                price: "Freemium",
                priceValue: 12,
                level: "beginner",
                features: ["Auto Layout", "Image Generation", "Design Templates", "Brand Kit", "Collaboration"],
                website: "https://example.com/canva-ai",
                icon: "fas fa-paint-brush",
                tags: ["Design", "Marketing", "Social Media"],
                popularity: 97,
                updated: "2024-02-08",
                freeTrial: true,
                integrations: ["Social Media", "Google Drive", "Dropbox"],
                pricingModel: "freemium"
            }
        ];
        
        this.filteredTools = [...this.tools];
        this.totalPages = Math.ceil(this.filteredTools.length / this.itemsPerPage);
    }

    initSwiper() {
        this.featuredSwiper = new Swiper('#featuredSwiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                640: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                },
            },
        });
        
        this.renderFeaturedTools();
    }

    renderFeaturedTools() {
        const swiperWrapper = document.querySelector('.swiper-wrapper');
        if (!swiperWrapper) return;
        
        // Get top 6 tools by popularity
        const featuredTools = [...this.tools]
            .sort((a, b) => b.popularity - a.popularity)
            .slice(0, 6);
        
        swiperWrapper.innerHTML = '';
        
        featuredTools.forEach(tool => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.innerHTML = this.createFeaturedToolHTML(tool);
            swiperWrapper.appendChild(slide);
        });
        
        // Update swiper
        if (this.featuredSwiper) {
            this.featuredSwiper.update();
        }
    }

    createFeaturedToolHTML(tool) {
        return `
            <div class="featured-tool-card">
                <span class="featured-tool-badge">Featured</span>
                <div class="featured-tool-image"></div>
                <div class="featured-tool-content">
                    <div class="featured-tool-header">
                        <div class="featured-tool-icon">
                            <i class="${tool.icon}"></i>
                        </div>
                        <div>
                            <h3>${tool.name}</h3>
                            <div style="color: var(--gray-400); font-size: 0.9rem;">
                                ${this.getCategoryLabel(tool.category)}
                            </div>
                        </div>
                    </div>
                    
                    <p style="color: var(--gray-300); margin-bottom: 1rem; flex: 1;">
                        ${tool.description.substring(0, 100)}...
                    </p>
                    
                    <div class="featured-tool-meta">
                        <div class="featured-tool-rating">
                            <i class="fas fa-star"></i>
                            <span>${tool.rating}</span>
                            <span style="color: var(--gray-400);">(${tool.reviews})</span>
                        </div>
                        <span class="featured-tool-price">${tool.price}</span>
                    </div>
                    
                    <div style="display: flex; gap: 0.75rem; margin-top: 1.5rem;">
                        <button class="btn btn-primary" style="flex: 1;" data-tool-id="${tool.id}">
                            <i class="fas fa-eye"></i> View Details
                        </button>
                        <button class="btn btn-secondary" data-tool-id="${tool.id}" data-action="quick-view">
                            <i class="fas fa-bolt"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Filter toggle
        const filterToggle = document.getElementById('filterToggle');
        const filtersGrid = document.getElementById('filtersGrid');
        
        if (filterToggle && filtersGrid) {
            filterToggle.addEventListener('click', () => {
                filtersGrid.classList.toggle('active');
                const icon = filterToggle.querySelector('i');
                const text = filterToggle.querySelector('span');
                
                if (filtersGrid.classList.contains('active')) {
                    icon.className = 'fas fa-times';
                    text.textContent = 'Hide Filters';
                } else {
                    icon.className = 'fas fa-sliders-h';
                    text.textContent = 'Show Filters';
                }
            });
        }

        // Filter options
        document.querySelectorAll('.filter-option').forEach(option => {
            option.addEventListener('click', () => {
                const filterType = option.dataset.filter;
                const value = option.dataset.value;
                
                // For "all" options, deactivate others in same group
                if (value === 'all') {
                    document.querySelectorAll(`[data-filter="${filterType}"]`).forEach(opt => {
                        opt.classList.remove('active');
                    });
                } else {
                    // Deactivate "all" option in same group
                    const allOption = document.querySelector(`[data-filter="${filterType}"][data-value="all"]`);
                    if (allOption) allOption.classList.remove('active');
                    
                    // Deactivate other options in same group
                    document.querySelectorAll(`[data-filter="${filterType}"]:not([data-value="all"])`).forEach(opt => {
                        opt.classList.remove('active');
                    });
                }
                
                option.classList.add('active');
                this.filters[filterType] = value;
                this.currentPage = 1;
                this.applyFilters();
            });
        });

        // Sort select
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortBy = e.target.value;
                this.applySorting();
                this.renderTools();
                this.updatePagination();
            });
        }

        // Search input
        const searchInput = document.getElementById('aiSearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase();
                this.currentPage = 1;
                this.applyFilters();
            });
        }

        // Search suggestions
        document.querySelectorAll('.search-suggestion').forEach(suggestion => {
            suggestion.addEventListener('click', (e) => {
                const query = e.target.textContent;
                searchInput.value = query;
                this.searchQuery = query.toLowerCase();
                this.currentPage = 1;
                this.applyFilters();
            });
        });

        // Pagination
        document.addEventListener('click', (e) => {
            if (e.target.closest('.page-btn')) {
                const btn = e.target.closest('.page-btn');
                if (btn.classList.contains('active')) return;
                
                if (btn.textContent === '«') {
                    this.currentPage = Math.max(1, this.currentPage - 1);
                } else if (btn.textContent === '»') {
                    this.currentPage = Math.min(this.totalPages, this.currentPage + 1);
                } else {
                    this.currentPage = parseInt(btn.textContent);
                }
                
                this.renderTools();
                this.updatePagination();
                window.scrollTo({ top: document.getElementById('toolsGrid').offsetTop - 100, behavior: 'smooth' });
            }
        });

        // Tool card interactions
        document.addEventListener('click', (e) => {
            const toolBtn = e.target.closest('button[data-tool-id]');
            if (toolBtn) {
                const toolId = parseInt(toolBtn.dataset.toolId);
                const action = toolBtn.dataset.action;
                
                if (action === 'quick-view') {
                    this.showQuickView(toolId);
                } else if (action === 'compare') {
                    this.toggleCompare(toolId, toolBtn);
                } else if (action === 'save') {
                    this.toggleSaveTool(toolId, toolBtn);
                } else {
                    this.showToolDetails(toolId);
                }
            }
            
            // View details from featured cards
            if (e.target.closest('.featured-tool-card .btn-primary')) {
                const toolId = parseInt(e.target.closest('.btn-primary').dataset.toolId);
                this.showToolDetails(toolId);
            }
        });

        // Clear compare
        const clearCompareBtn = document.getElementById('clearCompare');
        if (clearCompareBtn) {
            clearCompareBtn.addEventListener('click', () => {
                this.comparedTools.clear();
                this.updateCompareSection();
                window.TechVision.showNotification('Comparison cleared', 'info');
            });
        }

        // Compare button
        const compareButton = document.getElementById('compareButton');
        if (compareButton) {
            compareButton.addEventListener('click', () => {
                this.showCompareModal();
            });
        }

        // Quick view modal close
        const quickViewModal = document.getElementById('quickViewModal');
        if (quickViewModal) {
            quickViewModal.addEventListener('click', (e) => {
                if (e.target === quickViewModal || e.target.closest('.quick-view-close')) {
                    quickViewModal.classList.remove('active');
                }
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                quickViewModal.classList.remove('active');
            }
        });
    }

    setupSearch() {
        const searchInput = document.getElementById('aiSearchInput');
        if (!searchInput) return;

        // Add debounced search
        let debounceTimer;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                this.searchQuery = e.target.value.toLowerCase();
                this.currentPage = 1;
                this.applyFilters();
            }, 300);
        });

        // Search on enter
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchQuery = e.target.value.toLowerCase();
                this.currentPage = 1;
                this.applyFilters();
            }
        });
    }

    applyFilters() {
        this.filteredTools = this.tools.filter(tool => {
            // Search filter
            if (this.searchQuery && 
                !tool.name.toLowerCase().includes(this.searchQuery) && 
                !tool.description.toLowerCase().includes(this.searchQuery) &&
                !tool.tags.some(tag => tag.toLowerCase().includes(this.searchQuery))) {
                return false;
            }

            // Category filter
            if (this.filters.category !== 'all' && tool.category !== this.filters.category) {
                return false;
            }

            // Price filter
            if (this.filters.price !== 'all') {
                if (this.filters.price === 'free' && tool.priceValue > 0) return false;
                if (this.filters.price === 'freemium' && tool.pricingModel !== 'freemium') return false;
                if (this.filters.price === 'paid' && tool.priceValue === 0) return false;
            }

            // Rating filter
            if (this.filters.rating !== 'all') {
                const minRating = parseFloat(this.filters.rating);
                if (tool.rating < minRating) return false;
            }

            // Level filter
            if (this.filters.level !== 'all' && tool.level !== this.filters.level) {
                return false;
            }

            return true;
        });

        this.applySorting();
        this.totalPages = Math.ceil(this.filteredTools.length / this.itemsPerPage);
        this.renderTools();
        this.updatePagination();
        this.updateToolCount();
    }

    applySorting() {
        switch (this.sortBy) {
            case 'rating':
                this.filteredTools.sort((a, b) => b.rating - a.rating);
                break;
            case 'newest':
                this.filteredTools.sort((a, b) => new Date(b.updated) - new Date(a.updated));
                break;
            case 'name':
                this.filteredTools.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'price_low':
                this.filteredTools.sort((a, b) => a.priceValue - b.priceValue);
                break;
            case 'price_high':
                this.filteredTools.sort((a, b) => b.priceValue - a.priceValue);
                break;
            case 'popular':
            default:
                this.filteredTools.sort((a, b) => b.popularity - a.popularity);
                break;
        }
    }

    renderTools() {
        const toolsGrid = document.getElementById('toolsGrid');
        if (!toolsGrid) return;

        // Calculate pagination
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const currentTools = this.filteredTools.slice(startIndex, endIndex);

        // Show loading or no results
        if (this.filteredTools.length === 0) {
            toolsGrid.innerHTML = `
                <div class="no-results">
                    <div class="no-results-icon">
                        <i class="fas fa-search"></i>
                    </div>
                    <h3>No AI Tools Found</h3>
                    <p style="color: var(--gray-400); margin: 1rem 0 2rem; max-width: 400px; margin: 0 auto;">
                        Try adjusting your filters or search terms to find what you're looking for.
                    </p>
                    <button class="btn btn-primary" id="resetFilters">
                        <i class="fas fa-redo"></i> Reset All Filters
                    </button>
                </div>
            `;

            // Add reset filters event
            const resetBtn = document.getElementById('resetFilters');
            if (resetBtn) {
                resetBtn.addEventListener('click', () => this.resetFilters());
            }

            return;
        }

        // Render tools grid
        toolsGrid.innerHTML = '';
        
        currentTools.forEach(tool => {
            const toolElement = this.createToolElement(tool);
            toolsGrid.appendChild(toolElement);
        });

        // Initialize tool card animations
        this.initToolCardAnimations();
    }

    createToolElement(tool) {
        const div = document.createElement('div');
        div.className = 'tool-card-enhanced fade-in';
        div.innerHTML = this.createToolCardHTML(tool);
        return div;
    }

    createToolCardHTML(tool) {
        const isCompared = this.comparedTools.has(tool.id);
        const isSaved = this.isToolSaved(tool.id);
        
        return `
            <div class="tool-card-header">
                <span class="tool-card-badge">${this.getCategoryBadge(tool.category)}</span>
                <div class="tool-card-icon">
                    <i class="${tool.icon}"></i>
                </div>
                <div class="tool-card-title">
                    <h3>${tool.name}</h3>
                    <div class="tool-card-category">
                        <i class="fas fa-tag"></i>
                        ${this.getCategoryLabel(tool.category)}
                    </div>
                </div>
            </div>
            
            <div class="tool-card-body">
                <p class="tool-card-description">${tool.description}</p>
                
                <div class="tool-card-features">
                    ${tool.features.slice(0, 4).map(feature => 
                        `<span class="tool-feature-tag">${feature}</span>`
                    ).join('')}
                    ${tool.features.length > 4 ? 
                        `<span class="tool-feature-tag">+${tool.features.length - 4} more</span>` : ''
                    }
                </div>
                
                <div style="margin-top: auto; padding-top: 1.5rem; border-top: 1px solid rgba(255, 255, 255, 0.05);">
                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <i class="fas fa-sync-alt" style="color: var(--gray-400);"></i>
                            <span style="color: var(--gray-400); font-size: 0.9rem;">Updated ${this.formatDate(tool.updated)}</span>
                        </div>
                        ${tool.freeTrial ? 
                            `<span style="background: rgba(0, 200, 83, 0.1); color: var(--success); padding: 0.25rem 0.75rem; border-radius: var(--radius-full); font-size: 0.85rem; font-weight: 600;">
                                <i class="fas fa-check-circle"></i> Free Trial
                            </span>` : ''
                        }
                    </div>
                </div>
            </div>
            
            <div class="tool-card-footer">
                <div class="tool-card-meta">
                    <div class="tool-rating-stars">
                        ${this.generateStars(tool.rating)}
                        <span style="margin-left: 0.5rem; font-weight: 600;">${tool.rating}</span>
                    </div>
                    <span class="tool-review-count">(${tool.reviews.toLocaleString()} reviews)</span>
                    <span style="background: ${this.getPriceColor(tool.price)}; color: white; padding: 0.25rem 0.75rem; border-radius: var(--radius-full); font-size: 0.85rem; font-weight: 600;">
                        ${tool.price}
                    </span>
                </div>
                
                <div class="tool-card-actions">
                    <button class="tool-action-btn" data-tool-id="${tool.id}" data-action="quick-view" title="Quick View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="tool-action-btn ${isSaved ? 'active' : ''}" data-tool-id="${tool.id}" data-action="save" title="${isSaved ? 'Remove from Saved' : 'Save Tool'}">
                        <i class="${isSaved ? 'fas' : 'far'} fa-bookmark"></i>
                    </button>
                    <button class="tool-action-btn ${isCompared ? 'active' : ''}" data-tool-id="${tool.id}" data-action="compare" title="${isCompared ? 'Remove from Compare' : 'Add to Compare'}">
                        <i class="fas fa-balance-scale"></i>
                    </button>
                </div>
            </div>
        `;
    }

    generateStars(rating) {
        let stars = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }
        
        return stars;
    }

    initToolCardAnimations() {
        const toolCards = document.querySelectorAll('.tool-card-enhanced');
        toolCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            
            // Add hover effect
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
    }

    updateToolCount() {
        const toolsCount = document.getElementById('toolsCount');
        if (toolsCount) {
            toolsCount.textContent = `Showing ${this.filteredTools.length} AI tools`;
        }
    }

    updatePagination() {
        const pagination = document.getElementById('pagination');
        if (!pagination) return;
        
        if (this.totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }
        
        let paginationHTML = '';
        
        // Previous button
        paginationHTML += `
            <button class="page-btn page-btn-nav" ${this.currentPage === 1 ? 'disabled' : ''}>
                «
            </button>
        `;
        
        // Page numbers
        const maxVisible = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(this.totalPages, startPage + maxVisible - 1);
        
        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <button class="page-btn ${i === this.currentPage ? 'active' : ''}">
                    ${i}
                </button>
            `;
        }
        
        // Next button
        paginationHTML += `
            <button class="page-btn page-btn-nav" ${this.currentPage === this.totalPages ? 'disabled' : ''}>
                »
            </button>
        `;
        
        pagination.innerHTML = paginationHTML;
    }

    getCategoryLabel(category) {
        const labels = {
            content: "Content Creation",
            image: "Image Generation",
            code: "Coding Assistant",
            data: "Data Analysis",
            video: "Video Creation",
            audio: "Audio Processing",
            research: "Research Tools"
        };
        return labels[category] || category;
    }

    getCategoryBadge(category) {
        const badges = {
            content: "📝 Content",
            image: "🎨 Design",
            code: "💻 Code",
            data: "📊 Data",
            video: "🎬 Video",
            audio: "🎵 Audio",
            research: "🔬 Research"
        };
        return badges[category] || "AI Tool";
    }

    getPriceColor(price) {
        const colors = {
            "Free": "var(--success)",
            "Freemium": "var(--primary)",
            "Subscription": "var(--warning)",
            "Premium": "var(--accent)",
            "Enterprise": "var(--danger)",
            "Credits": "var(--secondary)"
        };
        return colors[price] || "var(--primary)";
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return "today";
        if (diffDays === 1) return "yesterday";
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        return `${Math.floor(diffDays / 365)} years ago`;
    }

    async showQuickView(toolId) {
        const tool = this.tools.find(t => t.id === toolId);
        if (!tool) return;
        
        const modal = document.getElementById('quickViewModal');
        const content = document.getElementById('quickViewContent');
        
        if (!modal || !content) return;
        
        // Show loading
        content.innerHTML = `
            <div style="padding: 4rem; text-align: center;">
                <div class="loading-spinner"></div>
                <p style="margin-top: 1rem;">Loading tool details...</p>
            </div>
        `;
        
        modal.classList.add('active');
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Render tool details
        content.innerHTML = this.createQuickViewHTML(tool);
        
        // Add event listeners to quick view buttons
        const quickViewSave = content.querySelector('.quick-view-save');
        const quickViewCompare = content.querySelector('.quick-view-compare');
        
        if (quickViewSave) {
            quickViewSave.addEventListener('click', () => this.toggleSaveTool(toolId, quickViewSave));
        }
        
        if (quickViewCompare) {
            quickViewCompare.addEventListener('click', () => this.toggleCompare(toolId, quickViewCompare));
        }
    }

    createQuickViewHTML(tool) {
        const isSaved = this.isToolSaved(tool.id);
        const isCompared = this.comparedTools.has(tool.id);
        
        return `
            <button class="quick-view-close">
                <i class="fas fa-times"></i>
            </button>
            
            <div style="padding: 3rem;">
                <div style="display: flex; align-items: flex-start; gap: 2rem; margin-bottom: 3rem;">
                    <div class="tool-card-icon" style="width: 80px; height: 80px; font-size: 2rem;">
                        <i class="${tool.icon}"></i>
                    </div>
                    <div style="flex: 1;">
                        <h2 style="margin-bottom: 0.5rem;">${tool.name}</h2>
                        <div style="display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap; margin-bottom: 1.5rem;">
                            <span style="background: ${this.getPriceColor(tool.price)}; color: white; padding: 0.5rem 1.25rem; border-radius: var(--radius-full); font-weight: 600;">
                                ${tool.price}
                            </span>
                            <div class="tool-rating-stars">
                                ${this.generateStars(tool.rating)}
                                <span style="margin-left: 0.5rem; font-weight: 600;">${tool.rating}</span>
                                <span style="color: var(--gray-400); margin-left: 0.5rem;">(${tool.reviews.toLocaleString()} reviews)</span>
                            </div>
                            <span style="color: var(--gray-400);">
                                <i class="fas fa-users"></i> ${tool.popularity}% popularity
                            </span>
                        </div>
                        <p style="color: var(--gray-300); line-height: 1.6;">${tool.description}</p>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-bottom: 3rem;">
                    <div>
                        <h4 style="margin-bottom: 1rem;">Key Features</h4>
                        <ul style="list-style: none; padding: 0;">
                            ${tool.features.map(feature => `
                                <li style="padding: 0.75rem 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05); display: flex; align-items: center; gap: 0.75rem;">
                                    <i class="fas fa-check" style="color: var(--success);"></i>
                                    ${feature}
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                    
                    <div>
                        <h4 style="margin-bottom: 1rem;">Tool Details</h4>
                        <div style="background: rgba(255, 255, 255, 0.03); border-radius: var(--radius-lg); padding: 1.5rem;">
                            <div style="display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                                <span style="color: var(--gray-400);">Category</span>
                                <span style="font-weight: 600;">${this.getCategoryLabel(tool.category)}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                                <span style="color: var(--gray-400);">Skill Level</span>
                                <span style="font-weight: 600; text-transform: capitalize;">${tool.level}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                                <span style="color: var(--gray-400);">Last Updated</span>
                                <span style="font-weight: 600;">${new Date(tool.updated).toLocaleDateString()}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; padding: 0.75rem 0;">
                                <span style="color: var(--gray-400);">Free Trial</span>
                                <span style="font-weight: 600; color: ${tool.freeTrial ? 'var(--success)' : 'var(--danger)'};">${tool.freeTrial ? 'Available' : 'Not Available'}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div style="display: flex; gap: 1rem; justify-content: center; padding-top: 2rem; border-top: 1px solid rgba(255, 255, 255, 0.05);">
                    <a href="${tool.website}" target="_blank" class="btn btn-primary" style="flex: 1;">
                        <i class="fas fa-external-link-alt"></i> Visit Website
                    </a>
                    <button class="btn btn-secondary quick-view-save" style="flex: 1;">
                        <i class="${isSaved ? 'fas' : 'far'} fa-bookmark"></i>
                        ${isSaved ? 'Saved' : 'Save Tool'}
                    </button>
                    <button class="btn btn-secondary quick-view-compare" style="flex: 1;">
                        <i class="fas fa-balance-scale"></i>
                        ${isCompared ? 'Comparing' : 'Compare Tool'}
                    </button>
                </div>
            </div>
        `;
    }

    showToolDetails(toolId) {
        const tool = this.tools.find(t => t.id === toolId);
        if (!tool) return;
        
        // Create detailed modal
        const modal = document.createElement('div');
        modal.className = 'tool-modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${tool.name} - Complete Details</h3>
                    <button class="modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="card-body">
                    <!-- Detailed view would go here -->
                    <p>Full details, reviews, tutorials, and more for ${tool.name}</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add close functionality
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    toggleCompare(toolId, button) {
        if (this.comparedTools.has(toolId)) {
            this.comparedTools.delete(toolId);
            window.TechVision.showNotification('Removed from comparison', 'info');
        } else {
            if (this.comparedTools.size >= 3) {
                window.TechVision.showNotification('Maximum 3 tools can be compared', 'warning');
                return;
            }
            this.comparedTools.add(toolId);
            window.TechVision.showNotification('Added to comparison', 'success');
        }
        
        // Update button state
        if (button) {
            button.classList.toggle('active');
            button.title = this.comparedTools.has(toolId) ? 'Remove from Compare' : 'Add to Compare';
        }
        
        this.updateCompareSection();
    }

    updateCompareSection() {
        const compareSection = document.getElementById('compareSection');
        const compareTools = document.getElementById('compareTools');
        const compareButton = document.getElementById('compareButton');
        
        if (!compareSection || !compareTools || !compareButton) return;
        
        if (this.comparedTools.size === 0) {
            compareSection.style.display = 'none';
            compareButton.style.display = 'none';
            return;
        }
        
        compareSection.style.display = 'block';
        compareTools.innerHTML = '';
        
        this.comparedTools.forEach(toolId => {
            const tool = this.tools.find(t => t.id === toolId);
            if (tool) {
                const toolCard = document.createElement('div');
                toolCard.className = 'compare-tool-card';
                toolCard.innerHTML = `
                    <button class="compare-tool-remove" data-tool-id="${toolId}">
                        <i class="fas fa-times"></i>
                    </button>
                    <div class="tool-card-icon" style="width: 60px; height: 60px; margin: 0 auto 1rem;">
                        <i class="${tool.icon}"></i>
                    </div>
                    <h4 style="margin-bottom: 0.5rem;">${tool.name}</h4>
                    <div style="color: var(--gray-400); font-size: 0.9rem; margin-bottom: 1rem;">${this.getCategoryLabel(tool.category)}</div>
                    <div class="tool-rating-stars" style="justify-content: center; margin-bottom: 1rem;">
                        ${this.generateStars(tool.rating)}
                    </div>
                    <div style="background: ${this.getPriceColor(tool.price)}; color: white; padding: 0.5rem 1rem; border-radius: var(--radius-full); font-weight: 600; display: inline-block;">
                        ${tool.price}
                    </div>
                `;
                compareTools.appendChild(toolCard);
                
                // Add remove event
                const removeBtn = toolCard.querySelector('.compare-tool-remove');
                removeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleCompare(toolId);
                });
            }
        });
        
        compareButton.style.display = this.comparedTools.size > 1 ? 'block' : 'none';
    }

    showCompareModal() {
        if (this.comparedTools.size < 2) return;
        
        const comparedToolsArray = Array.from(this.comparedTools).map(id => 
            this.tools.find(t => t.id === id)
        );
        
        // Create comparison table
        const modal = document.createElement('div');
        modal.className = 'tool-modal active';
        
        let tableHTML = `
            <div class="modal-content" style="max-width: 1200px;">
                <div class="modal-header">
                    <h3>Compare AI Tools</h3>
                    <button class="modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="card-body" style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr>
                                <th style="padding: 1rem; text-align: left; border-bottom: 2px solid rgba(255, 255, 255, 0.1);">Feature</th>
                                ${comparedToolsArray.map(tool => 
                                    `<th style="padding: 1rem; text-align: center; border-bottom: 2px solid rgba(255, 255, 255, 0.1);">
                                        <div style="text-align: center;">
                                            <div class="tool-card-icon" style="width: 50px; height: 50px; margin: 0 auto 0.5rem;">
                                                <i class="${tool.icon}"></i>
                                            </div>
                                            <strong>${tool.name}</strong>
                                        </div>
                                    </th>`
                                ).join('')}
                            </tr>
                        </thead>
                        <tbody>
        `;
        
        // Add rows for each comparison metric
        const metrics = [
            { label: 'Rating', getValue: tool => `${tool.rating} ⭐` },
            { label: 'Price', getValue: tool => tool.price },
            { label: 'Free Trial', getValue: tool => tool.freeTrial ? '✓' : '✗' },
            { label: 'Skill Level', getValue: tool => tool.level },
            { label: 'Reviews', getValue: tool => tool.reviews.toLocaleString() },
            { label: 'Popularity', getValue: tool => `${tool.popularity}%` },
        ];
        
        metrics.forEach(metric => {
            tableHTML += `
                <tr>
                    <td style="padding: 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); font-weight: 600;">
                        ${metric.label}
                    </td>
                    ${comparedToolsArray.map(tool => `
                        <td style="padding: 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); text-align: center;">
                            ${metric.getValue(tool)}
                        </td>
                    `).join('')}
                </tr>
            `;
        });
        
        tableHTML += `
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        modal.innerHTML = tableHTML;
        document.body.appendChild(modal);
        
        // Add close functionality
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    toggleSaveTool(toolId, button) {
        const savedTools = JSON.parse(localStorage.getItem('savedAITools') || '[]');
        const isSaved = savedTools.includes(toolId);
        
        if (isSaved) {
            const index = savedTools.indexOf(toolId);
            savedTools.splice(index, 1);
            window.TechVision.showNotification('Removed from saved tools', 'info');
        } else {
            savedTools.push(toolId);
            window.TechVision.showNotification('Tool saved successfully!', 'success');
        }
        
        localStorage.setItem('savedAITools', JSON.stringify(savedTools));
        
        // Update button state
        if (button) {
            const icon = button.querySelector('i');
            if (icon) {
                icon.className = isSaved ? 'far fa-bookmark' : 'fas fa-bookmark';
            }
            
            if (button.classList.contains('quick-view-save')) {
                button.innerHTML = `
                    <i class="${isSaved ? 'far' : 'fas'} fa-bookmark"></i>
                    ${isSaved ? 'Save Tool' : 'Saved'}
                `;
            }
        }
    }

    isToolSaved(toolId) {
        const savedTools = JSON.parse(localStorage.getItem('savedAITools') || '[]');
        return savedTools.includes(toolId);
    }

    resetFilters() {
        // Reset all filters
        this.filters = {
            category: 'all',
            price: 'all',
            rating: 'all',
            level: 'all'
        };
        this.searchQuery = '';
        this.currentPage = 1;
        this.sortBy = 'popular';
        
        // Reset UI
        document.querySelectorAll('.filter-option').forEach(opt => {
            opt.classList.remove('active');
            if (opt.dataset.value === 'all') {
                opt.classList.add('active');
            }
        });
        
        const searchInput = document.getElementById('aiSearchInput');
        if (searchInput) searchInput.value = '';
        
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) sortSelect.value = 'popular';
        
        // Apply reset
        this.applyFilters();
        
        window.TechVision.showNotification('All filters reset', 'success');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.aiToolsEnhanced = new AIToolsEnhanced();
    
    // Add CSS for active states
    const style = document.createElement('style');
    style.textContent = `
        .tool-action-btn.active {
            background: var(--gradient-primary) !important;
            border-color: transparent !important;
        }
        
        .tool-card-enhanced {
            animation: fadeInUp 0.6s ease forwards;
            opacity: 0;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .swiper-slide {
            opacity: 0.7;
            transition: opacity 0.3s ease;
        }
        
        .swiper-slide-active {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
});