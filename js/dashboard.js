// js/dashboard.js
class DashboardManager {
    constructor() {
        this.charts = {};
        this.userData = {
            name: "Alex Johnson",
            email: "alex@example.com",
            plan: "Pro",
            usage: {
                aiTools: 24,
                devices: 8,
                timeSaved: 42.5,
                productivity: 78
            },
            activity: [65, 59, 80, 81, 56, 55, 40],
            toolUsage: [30, 25, 20, 15, 10]
        };
        
        this.init();
    }

    init() {
        this.cacheDOM();
        this.bindEvents();
        this.loadDashboardData();
        this.initCharts();
        this.setupSectionSwitching();
    }

    cacheDOM() {
        this.navLinks = document.querySelectorAll('.nav-link-dash');
        this.dashboardSections = document.querySelectorAll('.dashboard-section');
        this.activityChartEl = document.getElementById('activityChart');
        this.usageChartEl = document.getElementById('usageChart');
        this.settingsForm = document.querySelector('#settings form');
        this.apiKeyButtons = document.querySelectorAll('.key-actions button');
        this.toggleSwitches = document.querySelectorAll('.toggle-switch input');
    }

    bindEvents() {
        // Settings form submission
        if (this.settingsForm) {
            this.settingsForm.addEventListener('submit', (e) => this.handleSettingsSubmit(e));
        }

        // API key buttons
        this.apiKeyButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleApiKeyAction(e));
        });

        // Toggle switches
        this.toggleSwitches.forEach(switchEl => {
            switchEl.addEventListener('change', (e) => this.handleToggleChange(e));
        });

        // Profile edit button
        const editProfileBtn = document.querySelector('.btn-secondary[href="#"]');
        if (editProfileBtn && editProfileBtn.innerHTML.includes('Edit Profile')) {
            editProfileBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showEditProfileModal();
            });
        }

        // Export report button
        const exportBtn = document.querySelector('.btn-primary .fa-download');
        if (exportBtn) {
            exportBtn.closest('.btn').addEventListener('click', () => this.exportReport());
        }
    }

    setupSectionSwitching() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionId = link.getAttribute('data-section');
                
                // Update active nav link
                this.navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // Show selected section
                this.showSection(sectionId);
            });
        });
    }

    showSection(sectionId) {
        // Hide all sections
        this.dashboardSections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Show selected section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Initialize charts if needed
            if (sectionId === 'overview' && !this.charts.activity) {
                this.initCharts();
            }
            
            // Load section-specific data
            this.loadSectionData(sectionId);
        }
    }

    loadDashboardData() {
        // Update user info
        const userName = document.querySelector('.user-name');
        const userEmail = document.querySelector('.user-email');
        
        if (userName) userName.textContent = this.userData.name;
        if (userEmail) userEmail.textContent = this.userData.email;
        
        // Update stats
        this.updateStats();
        
        // Load recent activity
        this.loadRecentActivity();
        
        // Load favorites
        this.loadFavorites();
    }

    updateStats() {
        const stats = this.userData.usage;
        
        // Update stat cards
        document.querySelectorAll('.stat-card-dash').forEach((card, index) => {
            const statValue = card.querySelector('.stat-value');
            const statChange = card.querySelector('.stat-change');
            
            switch(index) {
                case 0: // AI Tools
                    statValue.textContent = stats.aiTools;
                    break;
                case 1: // Devices
                    statValue.textContent = stats.devices;
                    break;
                case 2: // Time Saved
                    statValue.textContent = `${stats.timeSaved}h`;
                    break;
                case 3: // Productivity
                    statValue.textContent = `${stats.productivity}%`;
                    break;
            }
            
            // Add animation to stat values
            this.animateCounter(statValue, parseInt(statValue.textContent) || 0);
        });
    }

    animateCounter(element, target) {
        const duration = 1000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                if (element.classList.contains('stat-value')) {
                    element.textContent = target;
                }
                clearInterval(timer);
            } else {
                if (element.classList.contains('stat-value')) {
                    element.textContent = Math.floor(current);
                }
            }
        }, 16);
    }

    initCharts() {
        if (!this.activityChartEl || !this.usageChartEl) return;
        
        // Activity Chart
        this.charts.activity = new ApexCharts(this.activityChartEl, {
            series: [{
                name: 'Activity',
                data: this.userData.activity
            }],
            chart: {
                type: 'area',
                height: '100%',
                background: 'transparent',
                foreColor: '#94a3b8',
                toolbar: {
                    show: false
                },
                zoom: {
                    enabled: false
                }
            },
            colors: ['#0066FF'],
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'smooth',
                width: 3
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.7,
                    opacityTo: 0.2,
                    stops: [0, 90, 100]
                }
            },
            grid: {
                borderColor: 'rgba(255, 255, 255, 0.1)',
                strokeDashArray: 5,
                xaxis: {
                    lines: {
                        show: true
                    }
                },
                yaxis: {
                    lines: {
                        show: true
                    }
                }
            },
            xaxis: {
                categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                axisBorder: {
                    show: false
                },
                axisTicks: {
                    show: false
                }
            },
            yaxis: {
                labels: {
                    formatter: function(val) {
                        return val.toFixed(0);
                    }
                }
            },
            tooltip: {
                theme: 'dark',
                x: {
                    format: 'dd MMM'
                }
            }
        });
        
        // Tool Usage Chart
        this.charts.usage = new ApexCharts(this.usageChartEl, {
            series: this.userData.toolUsage,
            chart: {
                type: 'donut',
                height: '100%',
                background: 'transparent',
                foreColor: '#94a3b8'
            },
            colors: ['#0066FF', '#7B42F6', '#FF4081', '#00C853', '#FFAB00'],
            labels: ['Content AI', 'Image Tools', 'Code Assistants', 'Data Analysis', 'Other'],
            dataLabels: {
                enabled: false
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '65%',
                        labels: {
                            show: true,
                            total: {
                                show: true,
                                label: 'Total Usage',
                                formatter: function(w) {
                                    return w.globals.seriesTotals.reduce((a, b) => a + b, 0) + ' hrs';
                                }
                            }
                        }
                    }
                }
            },
            legend: {
                position: 'bottom',
                horizontalAlign: 'center'
            },
            tooltip: {
                theme: 'dark',
                y: {
                    formatter: function(val) {
                        return val + ' hours';
                    }
                }
            }
        });
        
        // Render charts
        this.charts.activity.render();
        this.charts.usage.render();
        
        // Update charts on window resize
        window.addEventListener('resize', () => {
            if (this.charts.activity) this.charts.activity.updateOptions({});
            if (this.charts.usage) this.charts.usage.updateOptions({});
        });
    }

    loadRecentActivity() {
        const activityList = document.querySelector('.activity-list');
        if (!activityList) return;
        
        // Sample activity data
        const activities = [
            {
                icon: 'fa-robot',
                action: 'Used GPT-5 Studio for content generation',
                time: '2 hours ago'
            },
            {
                icon: 'fa-home',
                action: 'Added new smart light to Living Room',
                time: '5 hours ago'
            },
            {
                icon: 'fa-bookmark',
                action: 'Saved article "Quantum Computing Breakthrough"',
                time: '1 day ago'
            },
            {
                icon: 'fa-cog',
                action: 'Updated profile settings',
                time: '2 days ago'
            }
        ];
        
        // Clear existing activities (keeping template)
        const template = activityList.querySelector('.activity-item');
        if (template) {
            activityList.innerHTML = '';
            activities.forEach(activity => {
                const item = template.cloneNode(true);
                item.querySelector('.activity-icon i').className = `fas ${activity.icon}`;
                item.querySelector('.activity-content div:first-child').textContent = activity.action;
                item.querySelector('.activity-time').textContent = activity.time;
                activityList.appendChild(item);
            });
        }
    }

    loadFavorites() {
        const favoritesGrid = document.querySelector('.favorites-grid');
        if (!favoritesGrid) return;
        
        // Sample favorites data
        const favorites = [
            {
                icon: 'fa-robot',
                name: 'GPT-5 Studio',
                category: 'AI Content Creation',
                description: 'Advanced AI content generation with multimodal capabilities.'
            },
            {
                icon: 'fa-palette',
                name: 'Midjourney Pro',
                category: 'AI Image Generation',
                description: 'Professional AI image generation and editing platform.'
            },
            {
                icon: 'fa-newspaper',
                name: 'Quantum Breakthrough',
                category: 'Tech Article',
                description: 'Latest developments in quantum computing research.'
            }
        ];
        
        // Clear and populate favorites
        favoritesGrid.innerHTML = '';
        favorites.forEach(fav => {
            const card = document.createElement('div');
            card.className = 'favorite-card fade-in';
            card.innerHTML = `
                <div class="favorite-header">
                    <div class="favorite-icon">
                        <i class="fas ${fav.icon}"></i>
                    </div>
                    <div>
                        <h3>${fav.name}</h3>
                        <p style="color: var(--gray-400); font-size: 0.9rem;">${fav.category}</p>
                    </div>
                </div>
                <p style="margin-bottom: 1.5rem;">${fav.description}</p>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn btn-primary" style="flex: 1;">
                        <i class="fas fa-external-link-alt"></i> Open
                    </button>
                    <button class="btn btn-secondary remove-favorite">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            
            // Add event listeners
            const openBtn = card.querySelector('.btn-primary');
            const removeBtn = card.querySelector('.remove-favorite');
            
            openBtn.addEventListener('click', () => {
                window.TechVision.showNotification(`Opening ${fav.name}`, 'info');
            });
            
            removeBtn.addEventListener('click', () => {
                card.style.opacity = '0';
                card.style.transform = 'translateX(100px)';
                setTimeout(() => {
                    card.remove();
                    window.TechVision.showNotification('Removed from favorites', 'info');
                }, 300);
            });
            
            favoritesGrid.appendChild(card);
        });
    }

    loadSectionData(sectionId) {
        switch(sectionId) {
            case 'activity':
                this.loadActivityAnalytics();
                break;
            case 'tools':
                this.loadAITools();
                break;
            case 'devices':
                this.loadDevices();
                break;
            case 'billing':
                this.loadBillingInfo();
                break;
        }
    }

    loadActivityAnalytics() {
        // Load detailed activity analytics
        console.log('Loading activity analytics...');
    }

    loadAITools() {
        // Load user's AI tools
        console.log('Loading AI tools...');
    }

    loadDevices() {
        // Load user's devices
        console.log('Loading devices...');
    }

    loadBillingInfo() {
        // Load billing information
        console.log('Loading billing info...');
    }

    handleSettingsSubmit(e) {
        e.preventDefault();
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            window.TechVision.showNotification('Profile updated successfully!', 'success');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);
    }

    handleApiKeyAction(e) {
        const btn = e.currentTarget;
        const action = btn.querySelector('i').className;
        
        if (action.includes('fa-copy')) {
            // Copy API key
            navigator.clipboard.writeText('sk_live_xxxxxxxxxxxxxxxx').then(() => {
                window.TechVision.showNotification('API key copied to clipboard!', 'success');
                btn.innerHTML = '<i class="fas fa-check"></i> Copied';
                setTimeout(() => {
                    btn.innerHTML = '<i class="fas fa-copy"></i> Copy';
                }, 2000);
            });
        } else if (action.includes('fa-trash')) {
            // Delete API key
            if (confirm('Are you sure you want to delete this API key?')) {
                const keyItem = btn.closest('.api-key-item');
                keyItem.style.opacity = '0';
                keyItem.style.transform = 'translateX(100px)';
                setTimeout(() => {
                    keyItem.remove();
                    window.TechVision.showNotification('API key deleted', 'info');
                }, 300);
            }
        }
    }

    handleToggleChange(e) {
        const toggle = e.target;
        const setting = toggle.closest('.setting-item').querySelector('div:first-child div:first-child').textContent;
        const enabled = toggle.checked;
        
        window.TechVision.showNotification(
            `${setting} ${enabled ? 'enabled' : 'disabled'}`,
            enabled ? 'success' : 'info'
        );
        
        // Save preference to localStorage
        localStorage.setItem(`setting_${setting.toLowerCase().replace(/\s+/g, '_')}`, enabled);
    }

    showEditProfileModal() {
        const modal = document.createElement('div');
        modal.className = 'tool-modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Edit Profile</h3>
                    <button class="modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="card-body">
                    <form id="editProfileForm">
                        <div class="form-group">
                            <label class="form-label">Profile Picture</label>
                            <div style="text-align: center; margin: 1rem 0;">
                                <div class="user-avatar" style="width: 120px; height: 120px; margin: 0 auto; cursor: pointer;" id="avatarUpload">
                                    <i class="fas fa-user"></i>
                                </div>
                                <input type="file" id="avatarFile" accept="image/*" style="display: none;">
                                <div style="margin-top: 0.5rem; color: var(--gray-400); font-size: 0.9rem;">
                                    Click to upload new photo
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Full Name</label>
                            <input type="text" class="form-control" value="${this.userData.name}" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Email Address</label>
                            <input type="email" class="form-control" value="${this.userData.email}" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Bio</label>
                            <textarea class="form-control" rows="3" placeholder="Tell us about yourself">AI enthusiast and tech innovator</textarea>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Location</label>
                            <input type="text" class="form-control" placeholder="City, Country">
                        </div>
                        
                        <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                            <button type="submit" class="btn btn-primary" style="flex: 1;">
                                <i class="fas fa-save"></i> Save Changes
                            </button>
                            <button type="button" class="btn btn-secondary" id="cancelEdit">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Avatar upload
        const avatarUpload = modal.querySelector('#avatarUpload');
        const avatarFile = modal.querySelector('#avatarFile');
        
        avatarUpload.addEventListener('click', () => avatarFile.click());
        avatarFile.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    avatarUpload.innerHTML = `<img src="${e.target.result}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
                };
                reader.readAsDataURL(file);
            }
        });
        
        // Form submission
        const form = modal.querySelector('#editProfileForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            window.TechVision.showNotification('Profile updated successfully!', 'success');
            modal.remove();
        });
        
        // Close buttons
        const closeBtn = modal.querySelector('.modal-close');
        const cancelBtn = modal.querySelector('#cancelEdit');
        
        closeBtn.addEventListener('click', () => modal.remove());
        cancelBtn.addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    exportReport() {
        // Create report data
        const report = {
            user: this.userData.name,
            date: new Date().toISOString().split('T')[0],
            stats: this.userData.usage,
            activity: this.userData.activity,
            toolUsage: this.userData.toolUsage
        };
        
        // Convert to JSON
        const reportJSON = JSON.stringify(report, null, 2);
        
        // Create download link
        const blob = new Blob([reportJSON], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `techvision-report-${report.date}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        window.TechVision.showNotification('Report exported successfully!', 'success');
    }

    updateCharts() {
        if (this.charts.activity) {
            // Simulate new data
            const newData = this.userData.activity.map(val => 
                Math.min(100, Math.max(0, val + (Math.random() * 20 - 10)))
            );
            
            this.charts.activity.updateSeries([{
                data: newData
            }]);
        }
        
        if (this.charts.usage) {
            // Simulate usage changes
            const newUsage = this.userData.toolUsage.map(val => 
                Math.max(5, val + (Math.random() * 10 - 5))
            );
            
            this.charts.usage.updateSeries(newUsage);
        }
    }

    // Simulate real-time updates
    startLiveUpdates() {
        setInterval(() => {
            // Update stats randomly
            Object.keys(this.userData.usage).forEach(key => {
                const change = (Math.random() * 2 - 1);
                this.userData.usage[key] = Math.max(0, this.userData.usage[key] + change);
            });
            
            // Update charts
            this.updateCharts();
            
            // Update displayed stats
            this.updateStats();
            
        }, 30000); // Update every 30 seconds
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboardManager = new DashboardManager();
    
    // Start live updates after a delay
    setTimeout(() => {
        window.dashboardManager.startLiveUpdates();
    }, 5000);
});