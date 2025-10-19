// User data storage
let userData = {
    subjects: [],
    settings: {
        theme: 'blue',
        trackGrades: false,
        trackTime: false,
        showAchievements: false
    },
    goals: {
        dailyGoal: ''
    }
};

// Load data from localStorage
function loadData() {
    const saved = localStorage.getItem('omnilearn-data');
    if (saved) {
        userData = JSON.parse(saved);
        applyTheme(userData.settings.theme);
        updateSettingsDisplay();
        renderSubjects();
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('omnilearn-data', JSON.stringify(userData));
}

// Navigation functions
function showStudySection() {
    document.querySelector('.hero').style.display = 'none';
    document.querySelector('.customize-section').style.display = 'none';
    document.querySelector('.study-section').style.display = 'block';
    document.querySelector('.features').style.display = 'block';
    window.scrollTo(0, 0);
}

function showCustomizeSection() {
    document.querySelector('.hero').style.display = 'none';
    document.querySelector('.study-section').style.display = 'none';
    document.querySelector('.customize-section').style.display = 'block';
    document.querySelector('.features').style.display = 'block';
    window.scrollTo(0, 0);
}

function showHome() {
    document.querySelector('.hero').style.display = 'flex';
    document.querySelector('.study-section').style.display = 'none';
    document.querySelector('.customize-section').style.display = 'none';
    document.querySelector('.features').style.display = 'block';
    window.scrollTo(0, 0);
}

// Subject management
function addSubject() {
    const subjectName = document.getElementById('subjectName').value.trim();
    if (subjectName) {
        const newSubject = {
            id: Date.now(),
            name: subjectName,
            chapters: []
        };
        userData.subjects.push(newSubject);
        document.getElementById('subjectName').value = '';
        saveData();
        renderSubjects();
    }
}

function addChapter(subjectId) {
    const chapterName = prompt('Enter chapter name:');
    if (chapterName && chapterName.trim()) {
        const subject = userData.subjects.find(s => s.id === subjectId);
        if (subject) {
            subject.chapters.push({
                id: Date.now(),
                name: chapterName.trim()
            });
            saveData();
            renderSubjects();
        }
    }
}

function deleteSubject(subjectId) {
    if (confirm('Are you sure you want to delete this subject?')) {
        userData.subjects = userData.subjects.filter(s => s.id !== subjectId);
        saveData();
        renderSubjects();
    }
}

function deleteChapter(subjectId, chapterId) {
    const subject = userData.subjects.find(s => s.id === subjectId);
    if (subject) {
        subject.chapters = subject.chapters.filter(c => c.id !== chapterId);
        saveData();
        renderSubjects();
    }
}

function renderSubjects() {
    const container = document.getElementById('subjectsContainer');
    if (userData.subjects.length === 0) {
        container.innerHTML = `
            <div class="empty-subjects">
                <div class="empty-icon">🎯</div>
                <h3>No subjects yet</h3>
                <p>Add your first subject to start organizing your studies!</p>
            </div>
        `;
    } else {
        container.innerHTML = userData.subjects.map(subject => `
            <div class="subject-card">
                <div class="subject-header">
                    <h3>${subject.name}</h3>
                    <div class="subject-actions">
                        <button class="action-btn" onclick="addChapter(${subject.id})" title="Add chapter">+</button>
                        <button class="action-btn" onclick="deleteSubject(${subject.id})" title="Delete subject">×</button>
                    </div>
                </div>
                
                <div class="chapters-list">
                    ${subject.chapters.length === 0 ? 
                        '<p style="color: #a0aec0; font-size: 0.9rem;">No chapters yet</p>' : 
                        subject.chapters.map(chapter => `
                            <div class="chapter-item">
                                <span class="chapter-name">${chapter.name}</span>
                                <button class="action-btn" onclick="deleteChapter(${subject.id}, ${chapter.id})" title="Delete chapter">×</button>
                            </div>
                        `).join('')
                    }
                </div>
            </div>
        `).join('');
    }
}

// Customization functions
function changeTheme(theme) {
    userData.settings.theme = theme;
    applyTheme(theme);
    saveData();
}

function applyTheme(theme) {
    document.body.className = theme;
}

function toggleSetting(setting) {
    const checkbox = document.getElementById(setting === 'grades' ? 'trackGrades' : 
                          setting === 'time' ? 'trackTime' : 'showAchievements');
    userData.settings[setting === 'grades' ? 'trackGrades' : 
                     setting === 'time' ? 'trackTime' : 'showAchievements'] = checkbox.checked;
    saveData();
}

function updateSettingsDisplay() {
    document.getElementById('trackGrades').checked = userData.settings.trackGrades;
    document.getElementById('trackTime').checked = userData.settings.trackTime;
    document.getElementById('showAchievements').checked = userData.settings.showAchievements;
}

function setGoal() {
    const goal = document.getElementById('dailyGoal').value.trim();
    if (goal) {
        userData.goals.dailyGoal = goal;
        saveData();
        alert(`Daily goal set to: ${goal}`);
        document.getElementById('dailyGoal').value = '';
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Enter key for adding subjects
    document.getElementById('subjectName')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addSubject();
        }
    });
});

// Simple loading animation
window.addEventListener('load', function() {
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.5s ease';