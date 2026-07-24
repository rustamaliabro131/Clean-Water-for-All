/* ============================================
   App Controller — Navigation, State, Donations
   ============================================ */

const App = (() => {
    // === State ===
    const STORAGE_KEY = 'cleanwater_state';

    const defaultState = {
        points: 0,
        totalEarned: 0,
        totalDonated: 0,
        litersProvided: 0,
        familiesHelped: 0,
        highScore: 0,
        donations: [],
        language: 'en'
    };

    let state = loadState();

    // === DOM Refs ===
    const headerPointsText = document.getElementById('headerPointsText');
    const langToggle = document.getElementById('langToggle');
    const langLabel = document.getElementById('langLabel');
    const btnGiveNow = document.getElementById('btnGiveNow');
    const btnSeeImpact = document.getElementById('btnSeeImpact');
    const desktopNav = document.getElementById('desktopNav');
    const bottomNav = document.getElementById('bottomNav');
    const mobileFab = document.getElementById('mobileFab');
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toastText');
    const donateSlider = document.getElementById('donateSlider');
    const donatePointsDisplay = document.getElementById('donatePointsDisplay');
    const donateLitersDisplay = document.getElementById('donateLitersDisplay');
    const btnConfirmDonation = document.getElementById('btnConfirmDonation');
    const confirmDonationText = document.getElementById('confirmDonationText');
    const btnShareImpact = document.getElementById('btnShareImpact');

    // Urdu translations
    const translations = {
        en: {
            heroTitle: 'Clean Water For All',
            heroBadge: 'Making a Global Impact, One Drop at a Time',
            heroSubtitle: '<strong class="text-primary">#CleanWaterForAll</strong> &bull; <strong class="text-secondary">#DoIt</strong> &mdash; Play to earn clean water points and make a real-world virtual impact. Every liter you win in-game is a liter we deliver to those in need.',
            giveNow: 'Give Now',
            seeImpact: 'See Your Impact',
            langLabel: 'UR'
        },
        ur: {
            heroTitle: '\u0635\u0627\u0641 \u0648\u0627\u0637\u0631 \u0633\u0628 \u0643\u0648\u0627\u0646 \u0644\u064a\u06c1',
            heroBadge: '\u0627\u06cc\u06a9 \u0642\u062a\u0628\u0647 \u0645\u06cc\u06ba \u0628\u0646\u0627\u0626\u06cc\u0646\u0647 \u06a9\u0631\u06cc\u0646 \u06c1\u0631 \u0642\u0637\u0631\u06c7 \u062f\u0631 \u0627\u06cc\u06a9 \u0648\u0642\u062a',
            heroSubtitle: '<strong class="text-primary">#صاف_واطر_سب_کے_لیے</strong> &bull; <strong class="text-secondary">#کرو</strong> &mdash; کھیل کر صاف پانی کے پوائنٹس کمائیں اور واقعی دنیا میں تبدیلی لائیں۔',
            giveNow: '\u0627\u0628\u0646\u0627\u0626\u06cc\u0646 \u062f\u06cc\u0646',
            seeImpact: '\u0627\u067e\u0646\u0627 \u0627\u0635\u0644 \u062f\u06cc\u0643\u06d0\u06cc\u0639\u0647 \u062f\u06cc\u0643\u06d0\u06cc\u0639\u06c1 \u062f\u06cc\u0642\u06d0\u06cc\u0639\u06c1',
            langLabel: 'EN'
        }
    };

    // === Initialization ===
    function init() {
        updatePointsDisplay();
        setupNavigation();
        setupHomeActions();
        setupDonateSection();
        setupGameCallback();
        setupLanguageToggle();
        setupMobileFab();
        WaterSnakeGame.init();
        WaterSnakeGame.setHighScore(state.highScore);
    }

    // === Persistence ===
    function loadState() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                return { ...defaultState, ...JSON.parse(saved) };
            }
        } catch (e) { /* ignore */ }
        return { ...defaultState };
    }

    function saveState() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) { /* ignore */ }
    }

    // === Navigation ===
    function setupNavigation() {
        // Desktop nav links
        desktopNav.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                navigateTo(link.dataset.screen);
            });
        });

        // Bottom nav links
        bottomNav.querySelectorAll('.bottom-nav-item').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                navigateTo(link.dataset.screen);
            });
        });
    }

    function navigateTo(screenId) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));

        // Show target
        const target = document.getElementById(screenId);
        if (target) target.classList.add('active');

        // Update nav active states
        desktopNav.querySelectorAll('.nav-link').forEach(l => {
            l.classList.toggle('active', l.dataset.screen === screenId);
        });

        bottomNav.querySelectorAll('.bottom-nav-item').forEach(l => {
            l.classList.toggle('active', l.dataset.screen === screenId);
        });

        // Show/hide footer based on screen
        const footer = document.getElementById('appFooter');
        footer.style.display = screenId === 'screen-play' ? 'none' : 'block';

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Update impact dashboard when navigating to it
        if (screenId === 'screen-impact') {
            updateImpactDashboard();
        }

        // Update donate screen
        if (screenId === 'screen-donate') {
            updateDonateUI();
        }
    }

    // === Home Actions ===
    function setupHomeActions() {
        btnGiveNow.addEventListener('click', () => {
            if (state.points === 0) {
                navigateTo('screen-play');
                showToast('Play the game to earn points first!');
            } else {
                navigateTo('screen-donate');
            }
        });

        btnSeeImpact.addEventListener('click', () => {
            navigateTo('screen-impact');
        });
    }

    // === Points ===
    function addPoints(amount) {
        state.points += amount;
        state.totalEarned += amount;
        state.highScore = Math.max(state.highScore, amount);
        saveState();
        updatePointsDisplay();
        WaterSnakeGame.setHighScore(state.highScore);
    }

    function deductPoints(amount) {
        state.points = Math.max(0, state.points - amount);
        saveState();
        updatePointsDisplay();
    }

    function updatePointsDisplay() {
        const liters = (state.points / 10).toFixed(1);
        headerPointsText.textContent = `${state.points} Points / ${liters} L`;
    }

    // === Game Callback ===
    function setupGameCallback() {
        WaterSnakeGame.setOnGameEnd((score) => {
            addPoints(score);
            showToast(`Added ${score} points to your wallet!`);
        });
    }

    // === Language Toggle ===
    function setupLanguageToggle() {
        langToggle.addEventListener('click', () => {
            const newLang = state.language === 'en' ? 'ur' : 'en';
            state.language = newLang;
            saveState();
            applyLanguage(newLang);
        });
    }

    function applyLanguage(lang) {
        const t = translations[lang];
        document.getElementById('heroTitle').textContent = t.heroTitle;
        document.getElementById('heroBadgeText').textContent = t.heroBadge;
        document.getElementById('heroSubtitle').innerHTML = t.heroSubtitle;
        document.getElementById('giveNowText').textContent = t.giveNow;
        document.getElementById('seeImpactText').textContent = t.seeImpact;
        langLabel.textContent = t.langLabel;

        // Update page direction for Urdu
        if (lang === 'ur') {
            document.documentElement.setAttribute('dir', 'rtl');
        } else {
            document.documentElement.removeAttribute('dir');
        }
    }

    // === Donate Section ===
    function setupDonateSection() {
        donateSlider.addEventListener('input', updateDonateUI);
        btnConfirmDonation.addEventListener('click', confirmDonation);
    }

    function updateDonateUI() {
        const hasPoints = state.points > 0;

        // Set slider range based on available points
        donateSlider.max = hasPoints ? Math.max(10, state.points) : 10;
        donateSlider.min = 10;

        // Cap slider value to available points
        if (hasPoints) {
            const currentVal = parseInt(donateSlider.value, 10);
            if (currentVal > state.points) {
                donateSlider.value = state.points;
            }
        } else {
            donateSlider.value = 10;
        }

        const displayVal = parseInt(donateSlider.value, 10);
        const liters = (displayVal / 10).toFixed(1);

        donatePointsDisplay.textContent = hasPoints ? `${displayVal} Points` : '0 Points';
        donateLitersDisplay.textContent = hasPoints ? `${liters} Liters of Clean Water` : 'Play the game to earn points!';
        confirmDonationText.textContent = hasPoints ? 'Confirm Donation' : 'No Points Available';

        // Disable if no points
        btnConfirmDonation.disabled = !hasPoints;
        btnConfirmDonation.style.opacity = hasPoints ? 1 : 0.5;
    }

    function confirmDonation() {
        const amount = parseInt(donateSlider.value, 10);
        if (amount <= 0 || amount > state.points) return;

        // Deduct points
        deductPoints(amount);

        // Update impact stats
        const liters = amount / 10;
        state.totalDonated += amount;
        state.litersProvided += liters;
        state.familiesHelped = Math.floor(state.litersProvided / 68);

        // Record donation
        state.donations.push({
            amount,
            liters,
            date: new Date().toISOString()
        });

        saveState();
        updateDonateUI();
        showToast(`Donated ${liters} Liters of Clean Water!`);
    }

    // === Impact Dashboard ===
    function updateImpactDashboard() {
        document.getElementById('impactTotalEarned').textContent = state.totalEarned.toLocaleString();
        document.getElementById('impactTotalDonated').textContent = state.totalDonated.toLocaleString();

        // Progress bar (out of 500L goal)
        const progressPct = Math.min(100, (state.totalDonated / 500) * 100);
        document.getElementById('impactDonatedBar').style.width = progressPct + '%';

        // Families text
        const familiesText = state.familiesHelped > 0
            ? `you have helped provide clean water to ${state.familiesHelped} ${state.familiesHelped === 1 ? 'family' : 'families'}`
            : 'play the game and donate to start helping families';
        document.getElementById('impactFamiliesText').textContent = familiesText;

        // Real liters text
        document.getElementById('impactRealLitersText').textContent = `${state.litersProvided.toFixed(1)} liters`;
    }

    // === Toast ===
    function showToast(message) {
        toastText.textContent = message;
        toast.classList.remove('hidden');
        clearTimeout(showToast._timer);
        showToast._timer = setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    }

    // === Mobile FAB ===
    function setupMobileFab() {
        mobileFab.addEventListener('click', () => {
            navigateTo('screen-donate');
        });
    }

    // === Start ===
    document.addEventListener('DOMContentLoaded', init);

    return { navigateTo, showToast, addPoints, state };
})();
