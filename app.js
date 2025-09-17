class DiamondCutterApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupTelegramWebApp();
        this.setupNavigation();
        this.loadTestData();
        this.setupEventListeners();
        this.renderContent();
    }

    setupTelegramWebApp() {
        // Инициализация Telegram WebApp
        if (window.Telegram && window.Telegram.WebApp) {
            Telegram.WebApp.ready();
            Telegram.WebApp.expand();
            Telegram.WebApp.enableClosingConfirmation();
        }
    }

    setupNavigation() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.dataset.tab;
                
                // Обновляем активные кнопки
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Показываем соответствующий контент
                tabContents.forEach(content => content.classList.remove('active'));
                document.getElementById(tabId).classList.add('active');
            });
        });
    }

    loadTestData() {
        this.data = window.testData;
    }

    setupEventListeners() {
        // Обработка формы дневника
        const journalForm = document.getElementById('journal-form');
        if (journalForm) {
            journalForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveJournalEntry();
            });
        }

        // Кнопки реакции
        const reactionButtons = document.querySelectorAll('.reaction-btn');
        reactionButtons.forEach(button => {
            button.addEventListener('click', () => {
                reactionButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });

        // Кнопка выполнения задания
        const completeBtn = document.querySelector('.btn-complete');
        if (completeBtn) {
            completeBtn.addEventListener('click', () => {
                completeBtn.textContent = '✓ Выполнено сегодня';
                completeBtn.style.background = '#888';
                completeBtn.disabled = true;
            });
        }
    }

    renderContent() {
        this.renderDashboard();
        this.renderChapters();
        this.renderMeditations();
        this.renderGrowthMap();
        this.renderJournalHistory();
    }

    renderDashboard() {
        const stats = document.querySelector('.stats');
        if (stats && this.data.user) {
            stats.innerHTML = `
                <div class="stat-card">
                    <h3>Дней подряд</h3>
                    <span class="stat-number">${this.data.user.streak}</span>
                </div>
                <div class="stat-card">
                    <h3>Семян посеяно</h3>
                    <span class="stat-number">${this.data.user.seedsPlanted}</span>
                </div>
                <div class="stat-card">
                    <h3>Уроков пройдено</h3>
                    <span class="stat-number">${this.data.user.lessonsCompleted}</span>
                </div>
            `;
        }
    }

    renderChapters() {
        const chaptersList = document.querySelector('.chapters-list');
        if (chaptersList && this.data.chapters) {
            chaptersList.innerHTML = this.data.chapters.map(chapter => `
                <div class="chapter-card">
                    <h3>${chapter.title}</h3>
                    <p>${chapter.description}</p>
                    <div class="chapter-progress">
                        <div class="progress-bar" style="width: ${chapter.progress}%"></div>
                    </div>
                    <p>Прогресс: ${chapter.progress}%</p>
                    <div class="assignment">
                        <p>${chapter.assignment.replace(/\n/g, '<br>')}</p>
                    </div>
                    <button class="btn-start" onclick="app.startChapter(${chapter.id})">
                        ${chapter.progress === 100 ? 'Повторить' : 'Начать'}
                    </button>
                </div>
            `).join('');
        }
    }

    renderMeditations() {
        const meditationsList = document.querySelector('.meditations-list');
        if (meditationsList && this.data.meditations) {
            meditationsList.innerHTML = this.data.meditations.map(meditation => `
                <div class="meditation-card">
                    <h3>${meditation.title}</h3>
                    <p>Длительность: ${meditation.duration}</p>
                    <div class="meditation-guide">
                        <p>${meditation.guide.replace(/\n/g, '<br>')}</p>
                    </div>
                    <button class="btn-start" onclick="app.startMeditation(${meditation.id})">
                        Начать практику
                    </button>
                </div>
            `).join('');
        }
    }

    renderGrowthMap() {
        const mapSectors = document.querySelector('.map-sectors');
        if (mapSectors && this.data.growthMap) {
            mapSectors.innerHTML = `
                <div class="sector">
                    <h3>💼 Карьера и Финансы</h3>
                    ${this.renderSectorContent(this.data.growthMap.career)}
                </div>
                <div class="sector">
                    <h3>❤️ Здоровье</h3>
                    ${this.renderSectorContent(this.data.growthMap.health)}
                </div>
                <div class="sector">
                    <h3>👥 Отношения</h3>
                    ${this.renderSectorContent(this.data.growthMap.relationships)}
                </div>
                <div class="sector">
                    <h3>🌱 Личностный рост</h3>
                    <p>Добавьте свои цели для развития</p>
                </div>
            `;
        }
    }

    renderSectorContent(sector) {
        return `
            <div class="fragile-zones">
                <h4>Зоны Хрупкости:</h4>
                ${sector.fragileZones.map(zone => `
                    <div class="fragile-zone">${zone}</div>
                `).join('')}
            </div>
            <div class="diamonds">
                <h4>Проявленные Алмазы:</h4>
                ${sector.diamonds.map(diamond => `
                    <div class="diamond-zone">${diamond}</div>
                `).join('')}
            </div>
            <div class="plans">
                <h4>Планы Укрепления:</h4>
                ${sector.plans.map(plan => `
                    <div class="plan-item">${plan}</div>
                `).join('')}
            </div>
        `;
    }

    renderJournalHistory() {
        const journalEntries = document.getElementById('journal-entries');
        if (journalEntries && this.data.journalEntries) {
            journalEntries.innerHTML = this.data.journalEntries.map(entry => `
                <div class="journal-entry">
                    <p><strong>${entry.date}:</strong> ${entry.event}</p>
                    <p>Реакция: ${this.getReactionText(entry.reaction)}</p>
                    <p>Семя: ${entry.seed}</p>
                </div>
            `).join('');
        }
    }

    getReactionText(reaction) {
        const reactions = {
            '1': 'Хрупко 😔',
            '2': 'Прочно 😐',
            '3': 'Антихрупко 💪'
        };
        return reactions[reaction] || 'Не указано';
    }

    saveJournalEntry() {
        const event = document.getElementById('event').value;
        const reaction = document.querySelector('.reaction-btn.active')?.dataset.value || '2';
        const lesson = document.getElementById('lesson').value;
        const seed = document.getElementById('seed').value;
        const tomorrow = document.getElementById('tomorrow').value;

        if (!event) {
            alert('Пожалуйста, опишите событие дня');
            return;
        }

        const newEntry = {
            date: new Date().toLocaleDateString('ru-RU'),
            event,
            reaction,
            lesson,
            seed,
            tomorrow
        };

        // Добавляем в историю
        this.data.journalEntries.unshift(newEntry);
        
        // Обновляем отображение
        this.renderJournalHistory();
        
        // Очищаем форму
        document.getElementById('journal-form').reset();
        document.querySelectorAll('.reaction-btn').forEach(btn => btn.classList.remove('active'));
        
        alert('Дневник сохранен! 💎');
    }

    startChapter(chapterId) {
        const chapter = this.data.chapters.find(c => c.id === chapterId);
        if (chapter) {
            alert(`Начинаем работу с: ${chapter.title}`);
            // Здесь можно добавить логику открытия детальной страницы главы
        }
    }

    startMeditation(meditationId) {
        const meditation = this.data.meditations.find(m => m.id === meditationId);
        if (meditation) {
            alert(`Начинаем медитацию: ${meditation.title}`);
            // Здесь можно добавить таймер и руководство медитации
        }
    }
}

// Инициализация приложения
const app = new DiamondCutterApp();

// Для глобального доступа
window.app = app;
