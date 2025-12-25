// js/news.js
class NewsManager {
    constructor() {
        this.articles = [];
        this.currentCategory = 'all';
        this.init();
    }

    init() {
        this.loadArticles();
        this.setupEventListeners();
        this.renderArticles();
    }

    loadArticles() {
        this.articles = [
            {
                id: 1,
                title: "OpenAI Unveils GPT-5: The Most Advanced AI Model Yet",
                category: "ai",
                excerpt: "The new GPT-5 model demonstrates unprecedented capabilities in understanding and generating text, images, and code simultaneously.",
                author: "Sarah Johnson",
                source: "TechCrunch",
                views: "12.4K",
                comments: 342,
                time: "2 hours ago",
                image: "ai"
            },
            {
                id: 2,
                title: "Quantum Computing Breakthrough Achieves Error Correction Milestone",
                category: "quantum",
                excerpt: "Researchers have demonstrated a new error correction method that could make quantum computers more reliable and scalable.",
                author: "Michael Chen",
                source: "Nature",
                views: "8.7K",
                comments: 128,
                time: "5 hours ago",
                image: "quantum"
            },
            {
                id: 3,
                title: "Apple Announces AR Glasses for 2024 Release",
                category: "gadgets",
                excerpt: "The new AR glasses promise seamless integration with Apple ecosystem and revolutionary user experience.",
                author: "Alexandra Wang",
                source: "The Verge",
                views: "15.2K",
                comments: 456,
                time: "1 day ago",
                image: "ar"
            },
            {
                id: 4,
                title: "EU Passes Historic AI Regulation Act",
                category: "policy",
                excerpt: "The new regulations set strict guidelines for AI development and deployment across European Union.",
                author: "David Rodriguez",
                source: "Reuters",
                views: "9.3K",
                comments: 231,
                time: "2 days ago",
                image: "policy"
            },
            {
                id: 5,
                title: "SpaceX Launches Next-Gen Starlink Satellites",
                category: "space",
                excerpt: "The new satellites promise faster internet speeds and better coverage for remote areas.",
                author: "James Wilson",
                source: "Space News",
                views: "7.8K",
                comments: 189,
                time: "3 days ago",
                image: "space"
            },
            {
                id: 6,
                title: "Microsoft Integrates AI into Windows 12",
                category: "software",
                excerpt: "The new operating system features built-in AI assistants and smart automation tools.",
                author: "Emma Davis",
                source: "Windows Central",
                views: "11.5K",
                comments: 312,
                time: "4 days ago",
                image: "software"
            }
        ];
    }

    setupEventListeners() {
        // Category filter
        document.querySelectorAll('.category-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                document.querySelectorAll('.category-tag').forEach(t => t.classList.remove('active'));
                tag.classList.add('active');
                this.currentCategory = tag.textContent.toLowerCase();
                this.filterArticles();
            });
        });

        // Video play buttons
        document.querySelectorAll('.video-play').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const videoCard = e.target.closest('.video-card');
                const title = videoCard.querySelector('h4').textContent;
                window.TechVision.showNotification(`Playing: ${title}`, 'info');
            });
        });

        // Newsletter forms
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                window.TechVision.showNotification('Subscribed successfully!', 'success');
                form.reset();
            });
        });
    }

    filterArticles() {
        const filtered = this.currentCategory === 'all' 
            ? this.articles 
            : this.articles.filter(article => 
                article.category === this.currentCategory.toLowerCase().replace(' & ', '').split(' ')[0]
            );
        
        this.renderArticles(filtered);
    }

    renderArticles(filteredArticles = null) {
        const articlesGrid = document.getElementById('articlesGrid');
        if (!articlesGrid) return;

        const articlesToShow = filteredArticles || this.articles.slice(1); // Skip first (featured)
        
        articlesGrid.innerHTML = '';
        
        articlesToShow.forEach(article => {
            const articleEl = this.createArticleElement(article);
            articlesGrid.appendChild(articleEl);
        });
    }

    createArticleElement(article) {
        const div = document.createElement('div');
        div.className = 'article-small fade-in';
        div.innerHTML = `
            <div class="article-image">
                <div style="background: ${this.getImageGradient(article.image)}; height: 100%;"></div>
            </div>
            <div class="article-content">
                <h4>${article.title}</h4>
                <div class="article-meta">
                    <span><i class="far fa-clock"></i> ${article.time}</span>
                    <span><i class="far fa-user"></i> ${article.author}</span>
                    <span><i class="far fa-eye"></i> ${article.views}</span>
                </div>
                <p class="article-excerpt">${article.excerpt}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem;">
                    <span class="badge ${this.getCategoryBadgeClass(article.category)}">
                        ${this.getCategoryLabel(article.category)}
                    </span>
                    <a href="#" class="btn btn-secondary" style="padding: 0.5rem 1rem;">
                        Read More
                    </a>
                </div>
            </div>
        `;
        
        // Add click event
        div.addEventListener('click', (e) => {
            if (!e.target.closest('.btn')) {
                this.showArticleDetails(article.id);
            }
        });
        
        return div;
    }

    getImageGradient(type) {
        const gradients = {
            ai: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            quantum: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            ar: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            policy: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            space: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            software: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
        };
        return gradients[type] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }

    getCategoryLabel(category) {
        const labels = {
            ai: 'AI',
            quantum: 'Quantum',
            gadgets: 'Gadgets',
            policy: 'Policy',
            space: 'Space',
            software: 'Software'
        };
        return labels[category] || category;
    }

    getCategoryBadgeClass(category) {
        const classes = {
            ai: 'badge-primary',
            quantum: 'badge-success',
            gadgets: 'badge-warning',
            policy: 'badge-danger',
            space: 'badge-info',
            software: 'badge-secondary'
        };
        return classes[category] || 'badge-primary';
    }

    showArticleDetails(articleId) {
        const article = this.articles.find(a => a.id === articleId);
        if (!article) return;

        const modal = document.createElement('div');
        modal.className = 'tool-modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${article.title}</h3>
                    <button class="modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="card-body">
                    <div class="article-meta" style="margin-bottom: 2rem;">
                        <span><i class="far fa-user"></i> ${article.author}</span>
                        <span><i class="far fa-newspaper"></i> ${article.source}</span>
                        <span><i class="far fa-clock"></i> ${article.time}</span>
                        <span><i class="far fa-eye"></i> ${article.views} views</span>
                        <span><i class="far fa-comment"></i> ${article.comments} comments</span>
                    </div>
                    
                    <div style="background: ${this.getImageGradient(article.image)}; 
                         height: 300px; border-radius: var(--radius-lg); margin-bottom: 2rem;"></div>
                    
                    <div style="margin-bottom: 2rem;">
                        <h4>Article Summary</h4>
                        <p>${article.excerpt}</p>
                        <p style="margin-top: 1rem;">In this comprehensive analysis, we delve into the latest developments and their implications for the future of technology. The breakthrough represents a significant milestone in the field, with potential applications across various industries.</p>
                    </div>
                    
                    <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                        <button class="btn btn-primary">
                            <i class="fas fa-bookmark"></i> Save Article
                        </button>
                        <button class="btn btn-secondary">
                            <i class="fas fa-share-alt"></i> Share
                        </button>
                        <button class="btn btn-secondary">
                            <i class="fas fa-print"></i> Print
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close functionality
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.newsManager = new NewsManager();
});