// js/community.js
class CommunityManager {
    constructor() {
        this.discussions = [];
        this.currentCategory = 'ai';
        this.init();
    }

    init() {
        this.loadDiscussions();
        this.setupEventListeners();
    }

    loadDiscussions() {
        // Discussions are already in HTML
        // In a real app, this would load from an API
    }

    setupEventListeners() {
        // Category selection
        document.querySelectorAll('.category-item').forEach(item => {
            item.addEventListener('click', () => {
                document.querySelectorAll('.category-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                this.currentCategory = item.querySelector('span').textContent.toLowerCase();
                this.filterDiscussions();
            });
        });

        // Discussion interaction
        document.querySelectorAll('.discussion-card .btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (btn.innerHTML.includes('Reply')) {
                    this.showReplyForm(btn.closest('.discussion-card'));
                }
            });
        });

        // User card clicks
        document.querySelectorAll('.user-card').forEach(card => {
            card.addEventListener('click', () => {
                const userName = card.querySelector('h4').textContent;
                window.TechVision.showNotification(`Viewing ${userName}'s profile`, 'info');
            });
        });

        // Event registration
        document.querySelectorAll('.event-card .btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const eventName = btn.closest('.event-card').querySelector('h3').textContent;
                window.TechVision.showNotification(`Registered for: ${eventName}`, 'success');
                btn.innerHTML = '<i class="fas fa-check"></i> Registered';
                btn.disabled = true;
            });
        });

        // New discussion form
        const newDiscussionForm = document.querySelector('.new-discussion form');
        if (newDiscussionForm) {
            newDiscussionForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.createNewDiscussion(newDiscussionForm);
            });
        }

        // Search functionality
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchDiscussions(e.target.value);
            });
        }
    }

    filterDiscussions() {
        // In a real app, this would filter discussions by category
        console.log(`Filtering by category: ${this.currentCategory}`);
    }

    showReplyForm(discussionCard) {
        const replyForm = document.createElement('div');
        replyForm.className = 'reply-form';
        replyForm.innerHTML = `
            <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid rgba(255, 255, 255, 0.05);">
                <h4 style="margin-bottom: 1rem;">Add Your Reply</h4>
                <textarea class="form-control" rows="3" placeholder="Write your reply..." style="margin-bottom: 1rem;"></textarea>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn btn-primary submit-reply">
                        <i class="fas fa-paper-plane"></i> Post Reply
                    </button>
                    <button class="btn btn-secondary cancel-reply">
                        Cancel
                    </button>
                </div>
            </div>
        `;

        // Check if reply form already exists
        const existingForm = discussionCard.querySelector('.reply-form');
        if (existingForm) {
            existingForm.remove();
        }

        discussionCard.appendChild(replyForm);

        // Add event listeners to new buttons
        const submitBtn = replyForm.querySelector('.submit-reply');
        const cancelBtn = replyForm.querySelector('.cancel-reply');

        submitBtn.addEventListener('click', () => {
            const textarea = replyForm.querySelector('textarea');
            if (textarea.value.trim()) {
                window.TechVision.showNotification('Reply posted successfully!', 'success');
                replyForm.remove();
            } else {
                window.TechVision.showNotification('Please write a reply', 'warning');
            }
        });

        cancelBtn.addEventListener('click', () => {
            replyForm.remove();
        });
    }

    createNewDiscussion(form) {
        const formData = new FormData(form);
        const title = formData.get('title') || 'New Discussion';
        
        // Create new discussion card
        const newDiscussion = {
            title: title,
            author: 'You',
            time: 'Just now',
            tags: ['New'],
            views: 0,
            replies: 0,
            likes: 0
        };

        this.addDiscussionToDOM(newDiscussion);
        
        // Reset form
        form.reset();
        
        window.TechVision.showNotification('Discussion created successfully!', 'success');
        
        // Scroll to new discussion
        const newCard = document.querySelector('.discussion-card:first-child');
        if (newCard) {
            newCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    addDiscussionToDOM(discussion) {
        const discussionList = document.querySelector('.discussion-list');
        if (!discussionList) return;

        const discussionCard = document.createElement('div');
        discussionCard.className = 'discussion-card fade-in';
        discussionCard.innerHTML = `
            <div class="discussion-header">
                <div class="discussion-title">
                    <h3>${discussion.title}</h3>
                    <div class="discussion-tags">
                        ${discussion.tags.map(tag => `<span class="discussion-tag">${tag}</span>`).join('')}
                    </div>
                </div>
                <div class="discussion-stats">
                    <div class="stat-item">
                        <i class="far fa-eye"></i>
                        <span>${discussion.views} views</span>
                    </div>
                    <div class="stat-item">
                        <i class="far fa-comment"></i>
                        <span>${discussion.replies} replies</span>
                    </div>
                    <div class="stat-item">
                        <i class="far fa-heart"></i>
                        <span>${discussion.likes} likes</span>
                    </div>
                </div>
            </div>
            
            <p>Start the conversation by sharing your thoughts and questions.</p>
            
            <div class="discussion-author">
                <div class="author-avatar">Y</div>
                <div class="author-info">
                    <div class="author-name">${discussion.author}</div>
                    <div class="post-time">Posted ${discussion.time}</div>
                </div>
                <button class="btn btn-primary">
                    <i class="far fa-comment"></i> Reply
                </button>
            </div>
        `;

        // Add to top of list
        discussionList.insertBefore(discussionCard, discussionList.firstChild);

        // Add event listener to reply button
        const replyBtn = discussionCard.querySelector('.btn-primary');
        replyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showReplyForm(discussionCard);
        });

        // Add click event to view discussion
        discussionCard.addEventListener('click', (e) => {
            if (!e.target.closest('.btn')) {
                this.viewDiscussion(discussion);
            }
        });
    }

    viewDiscussion(discussion) {
        const modal = document.createElement('div');
        modal.className = 'tool-modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${discussion.title}</h3>
                    <button class="modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="card-body">
                    <div class="discussion-author" style="margin-bottom: 2rem;">
                        <div class="author-avatar">Y</div>
                        <div class="author-info">
                            <div class="author-name">${discussion.author}</div>
                            <div class="post-time">Posted ${discussion.time}</div>
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 2rem;">
                        <p>This is a detailed view of the discussion. In a real application, this would show the full discussion thread with all replies and interactions.</p>
                        <p style="margin-top: 1rem;">Community members can share their insights, ask questions, and collaborate on solving problems together.</p>
                    </div>
                    
                    <div style="background: rgba(255, 255, 255, 0.03); padding: 1.5rem; border-radius: var(--radius-lg);">
                        <h4 style="margin-bottom: 1rem;">Add Your Comment</h4>
                        <textarea class="form-control" rows="3" placeholder="Join the discussion..."></textarea>
                        <button class="btn btn-primary" style="margin-top: 1rem;">
                            <i class="fas fa-paper-plane"></i> Post Comment
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

        // Comment submission
        const commentBtn = modal.querySelector('.btn-primary');
        commentBtn.addEventListener('click', () => {
            const textarea = modal.querySelector('textarea');
            if (textarea.value.trim()) {
                window.TechVision.showNotification('Comment added!', 'success');
                textarea.value = '';
            }
        });
    }

    searchDiscussions(query) {
        if (!query.trim()) {
            // Show all discussions if query is empty
            document.querySelectorAll('.discussion-card').forEach(card => {
                card.style.display = 'block';
            });
            return;
        }

        const searchTerm = query.toLowerCase();
        document.querySelectorAll('.discussion-card').forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const content = card.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || content.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Simulate live updates
    simulateLiveActivity() {
        setInterval(() => {
            // Randomly update discussion stats
            const discussions = document.querySelectorAll('.discussion-card');
            if (discussions.length > 0) {
                const randomIndex = Math.floor(Math.random() * discussions.length);
                const discussion = discussions[randomIndex];
                
                // Randomly increment views
                const viewsElement = discussion.querySelector('.stat-item:nth-child(1) span');
                if (viewsElement) {
                    const currentViews = parseInt(viewsElement.textContent) || 0;
                    viewsElement.textContent = `${currentViews + 1} views`;
                }
            }
        }, 30000); // Every 30 seconds
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.communityManager = new CommunityManager();
    
    // Start live updates after a delay
    setTimeout(() => {
        window.communityManager.simulateLiveActivity();
    }, 10000);
});