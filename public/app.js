
// Application State
const state = {
    posts: [],
    categoryCounts: { all: 0 },
    selectedCategory: "all",
    selectedPost: null,
    isDarkMode: false,
    isMobileMenuOpen: false,
    currentSort: 'recent'   // default is recent
};

// state management
const API_BASE = '';  // empty = same origin (recommended)
// If testing on different port → 'http://localhost:3000' (but use '' in production)

async function apiGet(endpoint) {
    try {
        const res = await fetch(API_BASE + endpoint);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
    } catch (err) {
        console.error("API error:", err);
        alert("Could not load data from server. Check console.");
        return null;
    }
}

async function apiPost(endpoint, data) {
    try {
        const res = await fetch(API_BASE + endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
    } catch (err) {
        console.error("API post error:", err);
        alert("Failed to save. Check console.");
        return null;
    }
}

const categories = [
    { id: "all", name: "All Topics", icon: "users" },
    { id: "academics", name: "Academics", icon: "book",},
    { id: "programming", name: "Programming", icon: "code"},
    { id: "projects", name: "Projects", icon: "lightbulb"},
    { id: "career", name: "Career", icon: "briefcase"},
    { id: "general", name: "General", icon: "coffee"}
];




const mockReplies = []

// ICON
const icons = {
    users: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
    book: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>',
    code: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>',
    lightbulb: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>',
    briefcase: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>',
    coffee: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>',
    eye: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>',
    thumbsUp: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>',
    messageCircle: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>',
    share: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>'
};

// DOM Elements
const darkModeBtn = document.getElementById('darkModeBtn');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileOverlay = document.getElementById('mobileOverlay');
const sidebar = document.getElementById('sidebar');
const categoriesNav = document.getElementById('categoriesNav');
const postsList = document.getElementById('postsList');
const categoryTitle = document.getElementById('categoryTitle');
const postCount = document.getElementById('postCount');
const newPostBtn = document.getElementById('newPostBtn');
const newPostModal = document.getElementById('newPostModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelPostBtn = document.getElementById('cancelPostBtn');
const newPostForm = document.getElementById('newPostForm');
const postListView = document.getElementById('postListView');
const postDetailView = document.getElementById('postDetailView');



// Event Listeners
function attachEventListeners() {
    darkModeBtn.addEventListener('click', toggleDarkMode);
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    mobileOverlay.addEventListener('click', closeMobileMenu);
    newPostBtn.addEventListener('click', openNewPostModal);
    closeModalBtn.addEventListener('click', closeNewPostModal);
    cancelPostBtn.addEventListener('click', closeNewPostModal);
    newPostModal.addEventListener('click', (e) => {
        if (e.target === newPostModal) closeNewPostModal();
    });
    newPostForm.addEventListener('submit', handleNewPost);
}

// Dark Mode
function toggleDarkMode() {
    state.isDarkMode = !state.isDarkMode;
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', state.isDarkMode);
}

// Mobile Menu
function toggleMobileMenu() {
    state.isMobileMenuOpen = !state.isMobileMenuOpen;
    sidebar.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
}

function closeMobileMenu() {
    state.isMobileMenuOpen = false;
    sidebar.classList.remove('active');
    mobileOverlay.classList.remove('active');
}

function updateCategoryCountsFromPosts() {
  const counts = { all: state.posts.length };
  
  state.posts.forEach(post => {
    const cat = post.category;
    counts[cat] = (counts[cat] || 0) + 1;
  });
  
  state.categoryCounts = counts;
}


// Render Categories on sidebar :)
function renderCategories() {
    categoriesNav.innerHTML = categories.map(category => {
        // Use dynamic count, fallback to 0 if category doesn't exist yet
        const count = state.categoryCounts[category.id] ?? 0;
        
        return `
            <button class="category-btn ${state.selectedCategory === category.id ? 'active' : ''}" 
                    onclick="selectCategory('${category.id}')">
                <div class="category-left">
                    <div class="category-icon">${icons[category.icon]}</div>
                    <span>${category.name}</span>
                </div>
                <span class="category-count">${count}</span>
            </button>
        `;
    }).join('');
}

// Select Category
function selectCategory(categoryId) {
    state.selectedCategory = categoryId;
    closeMobileMenu();
    renderCategories();
    renderPosts();
}

// Render Posts
function renderPosts() {
    const filteredPosts = state.selectedCategory === 'all' 
        ? state.posts 
        : state.posts.filter(post => post.category === state.selectedCategory);
    
    // Update header
    const categoryName = categories.find(c => c.id === state.selectedCategory)?.name || 'All Topics';
    categoryTitle.textContent = `${categoryName}${state.selectedCategory !== 'all' ? ' Discussions' : ''}`;
    postCount.textContent = `${filteredPosts.length} posts`;
    
    // Render posts
    postsList.innerHTML = filteredPosts.map(post => `
        <div class="post-card" onclick="showPostDetail('${post.id}')">
            <div class="post-header">
                <div class="avatar">${post.author.initials}</div>
                <div class="post-body">
                    <h3 class="post-title">${post.title}</h3>
                    <p class="post-content">${post.content}</p>
                    <div class="post-tags">
                        ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <div class="post-meta">
                        <div class="post-author-info">
                            <span>${post.author.name}</span>
                            <span>•</span>
                            <span>${post.timestamp}</span>
                        </div>
                        <div class="post-stats">
                            <div class="stat">
                                ${icons.eye}
                                <span>${post.views}</span>
                            </div>
                            <div class="stat">
                                ${icons.thumbsUp}
                                <span>${post.likes}</span>
                            </div>
                            <div class="stat">
                                ${icons.messageCircle}
                                <span>${post.replies}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Show Post Detail
async function showPostDetail(postId) {
    const question = await apiGet(`/questions/${postId}`);
    if (!question) return;

    state.selectedPost = {
        id: question.id.toString(),
        title: question.title,
        content: question.content || "(content not available in list view)", // backend missing!
        author: {
            name: question.username || "Anonymous",
            initials: (question.username || "A")[0].toUpperCase()
        },
        category: question.category,
        timestamp: formatTimestamp(question.created_at),
        likes: question.votes,
        replies: question.answers?.length || 0,
        // tags: ...
    };

    postListView.style.display = 'none';
    postDetailView.style.display = 'block';

    postDetailView.innerHTML = `
        <div class="post-detail">
            <button class="back-btn" onclick="backToForum()">Back to Forum</button>
            
            <div class="detail-card">
                <!-- same header, title, content as before -->
                <div class="detail-header">...</div>
                <h1 class="detail-title">${state.selectedPost.title}</h1>
                <p class="detail-content">${state.selectedPost.content}</p>
                <!-- tags, actions -->
            </div>
            
            <div class="detail-card replies-section">
                <h3>${state.selectedPost.replies} Replies</h3>
                <div class="replies-list">
                    ${(question.answers || []).map(ans => `
                        <div class="reply">
                            <div class="avatar purple">${ans.answer_author?.[0]?.toUpperCase() || "?"}</div>
                            <div class="reply-body">
                                <div class="reply-header">
                                    <span class="reply-author">${ans.answer_author || "Anonymous"}</span>
                                    <span>•</span>
                                    <span class="reply-time">${formatTimestamp(ans.created_at)}</span>
                                </div>
                                <p class="reply-content">${ans.text}</p>
                                <!-- like button etc -->
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="detail-card reply-form-section">
                <h3>Add a Reply</h3>
                <form class="reply-form" onsubmit="handleReply(event, ${postId})">
                    <textarea class="form-textarea" placeholder="Share your thoughts..." required></textarea>
                    <button type="submit" class="btn btn-primary">Post Reply</button>
                </form>
            </div>
        </div>
    `;
}

// Back to Forum
function backToForum() {
    state.selectedPost = null;
    postListView.style.display = 'block';
    postDetailView.style.display = 'none';
    window.scrollTo(0, 0);
}

// Handle Reply
async function handleReply(e, questionId) {
    e.preventDefault();
    const textarea = e.target.querySelector('textarea');
    const text = textarea.value.trim();
    if (!text) return;

    const newAnswer = {
        question_id: questionId,
        author_id: 1,           // ← HARDCODE for now! Later use logged-in user ID
        text
    };

    const result = await apiPost('/answers', newAnswer);
    if (result && result.id) {
        textarea.value = '';
        // Reload detail view
        showPostDetail(questionId);
    }
}

// Modal Functions
function openNewPostModal() {
    newPostModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeNewPostModal() {
    newPostModal.classList.remove('active');
    document.body.style.overflow = '';
    newPostForm.reset();
}

// Handle New Post
async function handleNewPost(e) {
    e.preventDefault();
    
    const title    = document.getElementById('postTitle').value;
    const category = document.getElementById('postCategory').value;
    const content  = document.getElementById('postContent').value;
    const tags     = document.getElementById('postTags').value
        .split(',').map(t => t.trim()).filter(Boolean);

    if (!title || !category) return alert("Title and category required");

    const newQuestion = {
        title,
        category,
        author_id: 1,           // ← HARDCODE for now! Replace with real user ID later
        // content is missing in your backend table — add column if needed
    };

    const result = await apiPost('/questions', newQuestion);
    if (result && result.id) {
        closeNewPostModal();
        await loadQuestions();     // refresh list
        renderPosts();
    }
}

// Make functions globally available
window.selectCategory = selectCategory;
window.showPostDetail = showPostDetail;
window.backToForum = backToForum;
window.handleReply = handleReply;


function formatTimestamp(isoString) {
    if (!isoString) return "recent";

    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "invalid date";

    const now = new Date();
    const diffMs = now - date;
    const diffMin = Math.floor(diffMs / 60000);

    if (diffMin < 1)    return "just now";
    if (diffMin < 60)   return `${diffMin} min ago`;
    if (diffMin < 1440) return `${Math.floor(diffMin / 60)} h ago`;

    // older than 1 day → show date
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined
    });
}

// 1. Add click handlers (you can put this in init() or at the bottom)
function setupSortButtons() {
    const recentBtn = document.getElementById('sortRecentBtn');
    const hotBtn    = document.getElementById('sortHotBtn');

    if (!recentBtn || !hotBtn) return;

    recentBtn.addEventListener('click', () => setSort('recent'));
    hotBtn.addEventListener('click', () => setSort('likes'));     // or 'hot'
}

// Helper to change sort + refresh
async function setSort(newSort) {
    if (state.currentSort === newSort) return; // no change

    state.currentSort = newSort;

    // Update active button style
    document.querySelectorAll('.sort-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.sort === newSort);
    });

    // Reload data with new sort
    await loadQuestions();
    renderPosts();
}

// 2. Update your loadQuestions to use the current sort
async function loadQuestions() {
    const endpoint = `/questions?sort=${state.currentSort}`;
    const questions = await apiGet(endpoint);
    
    if (!questions) {
        console.warn("No questions returned");
        return;
    }

    state.posts = questions.map(q => ({
        id: q.id.toString(),
        title: q.title,
        content: q.content,
        author: {
            name: q.username || "User " + q.author_id,
            initials: (q.username || "U")[0].toUpperCase()
        },
        category: q.category.toLowerCase(),
        timestamp: formatTimestamp(q.created_at),
        replies: q.answer_count || 0,
        likes: q.votes || 0,
        views: 0,
        tags: [q.category.toLowerCase()],
        raw: q
    }));

    console.log(`Loaded ${state.posts.length} questions sorted by ${state.cutherrentSort}`);
    
    updateCategoryCountsFromPosts();
    renderCategories();
}

// Initialize App
async function init() {
    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    if (savedDarkMode) {
        state.isDarkMode = true;
        document.body.classList.add('dark-mode');
    }
    
    await loadQuestions(); 
    
    renderCategories();
    renderPosts();
    attachEventListeners();
    setupSortButtons();
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
