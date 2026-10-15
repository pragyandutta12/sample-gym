/**
 * APEX PERFORMANCE ARENA - MASTER APPLICATION LOGIC
 * Features:
 * 1. 1RM & Power Output Scientific Calculator
 * 2. Macronutrient & Caloric Expenditure Lab
 * 3. Dynamic Periodized Class Timetable Matrix
 * 4. Interactive Split-Screen Transformation Slider
 * 5. Monthly / Annual Membership Billing Switcher
 * 6. VIP 3-Day Pass Modal & Confetti Celebration Burst
 * 7. Web Audio API Ambient Atmosphere Synthesizer
 */

// -------------------------------------------------------------
// 1. CALCULATORS: 1-REP MAX & METABOLIC MACRO LAB
// -------------------------------------------------------------

// Tab Switching
const calcTabs = document.querySelectorAll('.calc-tab-btn');
const calcPanels = document.querySelectorAll('.calc-panel');

calcTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetId = tab.getAttribute('data-tab');
        calcTabs.forEach(t => t.classList.remove('active'));
        calcPanels.forEach(p => p.classList.remove('active'));

        tab.classList.add('active');
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) targetPanel.classList.add('active');
    });
});

// 1RM Elements
const weightInput = document.getElementById('weightInput');
const weightDisplay = document.getElementById('weightDisplay');
const repsInput = document.getElementById('repsInput');
const repsDisplay = document.getElementById('repsDisplay');
const oneRepMaxVal = document.getElementById('oneRepMaxVal');
const oneRepMaxLbs = document.getElementById('oneRepMaxLbs');
const gaugeFill = document.getElementById('gaugeFill');
const intensityZone = document.getElementById('intensityZone');

const load95 = document.getElementById('load95');
const load85 = document.getElementById('load85');
const load75 = document.getElementById('load75');
const load65 = document.getElementById('load65');

function update1RM() {
    if (!weightInput || !repsInput) return;
    const weight = parseFloat(weightInput.value);
    const reps = parseInt(repsInput.value);

    weightDisplay.textContent = `${weight} KG`;
    repsDisplay.textContent = `${reps} Rep${reps > 1 ? 's' : ''}`;

    // Brzycki Formula: 1RM = Weight * (36 / (37 - Reps))
    let calculated1RM = 0;
    if (reps === 1) {
        calculated1RM = weight;
    } else {
        calculated1RM = weight * (36 / (37 - reps));
    }
    const final1RM = Math.round(calculated1RM);
    const finalLbs = Math.round(final1RM * 2.20462);

    oneRepMaxVal.textContent = final1RM;
    oneRepMaxLbs.textContent = `≈ ${finalLbs} LBS Certified Power`;

    // Power gauge (0 to 250kg normalized scale)
    const gaugePct = Math.min(Math.max((final1RM / 250) * 100, 10), 100);
    if (gaugeFill) gaugeFill.style.width = `${gaugePct}%`;

    // Intensity zone tag
    if (reps <= 3) {
        intensityZone.textContent = "Neuromuscular Max Strength";
    } else if (reps <= 6) {
        intensityZone.textContent = "Heavy Strength & Density";
    } else if (reps <= 10) {
        intensityZone.textContent = "Hypertrophy Power Zone";
    } else {
        intensityZone.textContent = "Metabolic Endurance Load";
    }

    // Recommended working loads
    if (load95) load95.textContent = `${Math.round(final1RM * 0.95)} KG`;
    if (load85) load85.textContent = `${Math.round(final1RM * 0.85)} KG`;
    if (load75) load75.textContent = `${Math.round(final1RM * 0.75)} KG`;
    if (load65) load65.textContent = `${Math.round(final1RM * 0.65)} KG`;
}

if (weightInput && repsInput) {
    weightInput.addEventListener('input', update1RM);
    repsInput.addEventListener('input', update1RM);
    update1RM();
}

// MACRO & CALORIC LAB
const goalPills = document.querySelectorAll('.goal-pill');
const bodyweightInput = document.getElementById('bodyweightInput');
const bodyweightDisplay = document.getElementById('bodyweightDisplay');
const activitySelect = document.getElementById('activitySelect');

const calorieResult = document.getElementById('calorieResult');
const proteinVal = document.getElementById('proteinVal');
const carbsVal = document.getElementById('carbsVal');
const fatsVal = document.getElementById('fatsVal');

let currentGoal = 'shred';

goalPills.forEach(pill => {
    pill.addEventListener('click', () => {
        goalPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentGoal = pill.getAttribute('data-goal');
        calculateMacros();
    });
});

function calculateMacros() {
    if (!bodyweightInput || !activitySelect) return;
    const bw = parseFloat(bodyweightInput.value);
    const activityMult = parseFloat(activitySelect.value);

    bodyweightDisplay.textContent = `${bw} KG`;

    // Base BMR approximation (Katch-McArdle simplified)
    const bmr = 370 + (21.6 * (bw * 0.85));
    const tdee = bmr * activityMult;

    let targetCalories = tdee;
    let proteinPerKg = 2.2;
    let fatRatio = 0.25;

    if (currentGoal === 'shred') {
        targetCalories = tdee - 500;
        proteinPerKg = 2.4; // Higher protein in a deficit
        fatRatio = 0.22;
    } else if (currentGoal === 'recomp') {
        targetCalories = tdee - 100;
        proteinPerKg = 2.2;
        fatRatio = 0.25;
    } else if (currentGoal === 'hypertrophy') {
        targetCalories = tdee + 400;
        proteinPerKg = 2.0;
        fatRatio = 0.26;
    }

    const totalProteinGrams = Math.round(bw * proteinPerKg);
    const proteinCalories = totalProteinGrams * 4;

    const fatCalories = targetCalories * fatRatio;
    const totalFatGrams = Math.round(fatCalories / 9);

    const remainingCalories = targetCalories - (proteinCalories + fatCalories);
    const totalCarbGrams = Math.max(Math.round(remainingCalories / 4), 50);

    if (calorieResult) calorieResult.textContent = Math.round(targetCalories).toLocaleString();
    if (proteinVal) proteinVal.textContent = `${totalProteinGrams}g`;
    if (carbsVal) carbsVal.textContent = `${totalCarbGrams}g`;
    if (fatsVal) fatsVal.textContent = `${totalFatGrams}g`;
}

if (bodyweightInput && activitySelect) {
    bodyweightInput.addEventListener('input', calculateMacros);
    activitySelect.addEventListener('change', calculateMacros);
    calculateMacros();
}

// -------------------------------------------------------------
// 2. CLASS TIMETABLE & PROGRAMMING MATRIX
// -------------------------------------------------------------

const timetableData = {
    Mon: [
        { time: "06:00 - 07:15", title: "Heavy Barbell Velocity", category: "strength", coach: "Marcus Vance", spots: 3, badge: "CNS MAX" },
        { time: "09:00 - 10:00", title: "Hyrox Aerobic Engine 101", category: "hyrox", coach: "Elena Rostova", spots: 6, badge: "HIGH VOLUME" },
        { time: "12:30 - 13:30", title: "Olympic Snatch & Jerk Lab", category: "strength", coach: "Marcus Vance", spots: 2, badge: "TECHNICAL" },
        { time: "17:30 - 18:30", title: "Metabolic Threshold Sprint", category: "hiit", coach: "Elena Rostova", spots: 4, badge: "VO2 PEAK" },
        { time: "19:00 - 20:00", title: "Deadlift Overload & Grip", category: "strength", coach: "Marcus Vance", spots: 1, badge: "PLATFORMS ONLY" },
        { time: "20:15 - 21:00", title: "Spine & Fascial Restoration", category: "mobility", coach: "Elena Rostova", spots: 8, badge: "RECOVERY" }
    ],
    Tue: [
        { time: "06:30 - 07:30", title: "Engine Chamber Intervals", category: "hiit", coach: "Elena Rostova", spots: 5, badge: "HR 165+" },
        { time: "09:30 - 10:45", title: "Squat Volume & Depth Focus", category: "strength", coach: "Marcus Vance", spots: 4, badge: "IPF RULES" },
        { time: "12:00 - 13:00", title: "Hyrox Sled & SkiErg Mastery", category: "hyrox", coach: "Elena Rostova", spots: 3, badge: "ENDURANCE" },
        { time: "17:00 - 18:15", title: "Upper Body Hypertrophy", category: "strength", coach: "Marcus Vance", spots: 2, badge: "HIGH PUMP" },
        { time: "18:45 - 19:45", title: "Rowing & AirBike Lactate Flush", category: "hiit", coach: "Elena Rostova", spots: 5, badge: "ANAEROBIC" },
        { time: "20:00 - 21:00", title: "Hip Opening & Ankle Mobility", category: "mobility", coach: "Elena Rostova", spots: 10, badge: "MOBILITY" }
    ],
    Wed: [
        { time: "06:00 - 07:15", title: "Clean & Jerk Biomechanics", category: "strength", coach: "Marcus Vance", spots: 3, badge: "IWF STANDARD" },
        { time: "09:00 - 10:00", title: "Cardio Engine Build", category: "hyrox", coach: "Elena Rostova", spots: 6, badge: "ZONE 2 BASE" },
        { time: "12:30 - 13:30", title: "Bench Press Arch & Leg Drive", category: "strength", coach: "Marcus Vance", spots: 4, badge: "POWERLIFTING" },
        { time: "17:30 - 18:30", title: "Vision Sprint & Agility Matrix", category: "hiit", coach: "Elena Rostova", spots: 2, badge: "TURF TRACK" },
        { time: "19:00 - 20:00", title: "Strongman Carries & Yoke", category: "strength", coach: "Marcus Vance", spots: 4, badge: "HEAVY GRIT" }
    ],
    Thu: [
        { time: "06:30 - 07:30", title: "Metabolic Lactate Threshold", category: "hiit", coach: "Elena Rostova", spots: 4, badge: "BURNOUT" },
        { time: "09:30 - 10:45", title: "Deadlift Tension & Lockout", category: "strength", coach: "Marcus Vance", spots: 2, badge: "CHAINS & BANDS" },
        { time: "12:00 - 13:00", title: "Hyrox Functional Simulation", category: "hyrox", coach: "Elena Rostova", spots: 5, badge: "SIMULATION" },
        { time: "17:30 - 18:30", title: "Shoulder Overhead Mechanics", category: "strength", coach: "Marcus Vance", spots: 6, badge: "OVERHEAD" },
        { time: "19:30 - 20:30", title: "Contrast Plunge & Breathwork", category: "mobility", coach: "Elena Rostova", spots: 8, badge: "RECOVERY" }
    ],
    Fri: [
        { time: "06:00 - 07:15", title: "Squat Depth & Speed Waves", category: "strength", coach: "Marcus Vance", spots: 3, badge: "DYNAMIC EFFORT" },
        { time: "09:00 - 10:00", title: "Engine Lactate Intervals", category: "hiit", coach: "Elena Rostova", spots: 5, badge: "PULSE 170" },
        { time: "12:30 - 13:30", title: "Arms & Delts High Volume", category: "strength", coach: "Marcus Vance", spots: 4, badge: "HYPERTROPHY" },
        { time: "17:00 - 18:30", title: "Friday Night PR Arena Clash", category: "strength", coach: "Marcus Vance", spots: 1, badge: "PR NIGHT 🏆" }
    ],
    Sat: [
        { time: "08:00 - 09:30", title: "Saturday Morning Hyrox Battery", category: "hyrox", coach: "Elena Rostova", spots: 4, badge: "90-MIN ENGINE" },
        { time: "10:00 - 11:30", title: "Open Platform Heavy Barbell Club", category: "strength", coach: "Marcus Vance", spots: 2, badge: "CHALK & AMBIENCE" },
        { time: "12:00 - 13:00", title: "High-Intensity Turf Battle", category: "hiit", coach: "Elena Rostova", spots: 6, badge: "TURF WARS" },
        { time: "14:00 - 15:00", title: "Athletic Decompression & Sauna", category: "mobility", coach: "Elena Rostova", spots: 12, badge: "INFRARED SAUNA" }
    ],
    Sun: [
        { time: "09:00 - 10:30", title: "Sunday Aerobic Recovery Run/Row", category: "hyrox", coach: "Elena Rostova", spots: 8, badge: "REPAIR" },
        { time: "11:00 - 12:30", title: "Powerlifting Accessory Clinic", category: "strength", coach: "Marcus Vance", spots: 5, badge: "PREHAB" },
        { time: "13:30 - 14:30", title: "Full Body Joint Longevity", category: "mobility", coach: "Elena Rostova", spots: 10, badge: "YOGA FOR LIFTERS" }
    ]
};

let currentDay = 'Mon';
let currentCategory = 'all';

const dayButtons = document.querySelectorAll('.day-btn');
const filterPills = document.querySelectorAll('.filter-pill');
const scheduleGrid = document.getElementById('scheduleGrid');

dayButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        dayButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentDay = btn.getAttribute('data-day');
        renderSchedule();
    });
});

filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentCategory = pill.getAttribute('data-filter');
        renderSchedule();
    });
});

function renderSchedule() {
    if (!scheduleGrid) return;
    const dayClasses = timetableData[currentDay] || [];
    const filtered = dayClasses.filter(c => {
        if (currentCategory === 'all') return true;
        return c.category === currentCategory;
    });

    if (filtered.length === 0) {
        scheduleGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; background: var(--bg-card); border-radius: var(--radius-md);">
                <p style="color: var(--text-muted); font-size: 1.1rem;">No classes matching this discipline on ${currentDay}. Select another discipline or day.</p>
            </div>
        `;
        return;
    }

    scheduleGrid.innerHTML = filtered.map((item, idx) => `
        <div class="session-card reveal-item revealed" style="animation-delay: ${idx * 0.08}s">
            <span class="session-badge">${item.badge}</span>
            <div>
                <div class="session-time">${item.time}</div>
                <h4 class="session-title">${item.title}</h4>
                <div class="session-meta-row">
                    <span>📍 Arena Platform Zone</span>
                    <span>⏱️ 60-75 Min</span>
                </div>
                <div class="session-coach">
                    <div class="coach-avatar">${item.coach.includes('Marcus') ? '🏋️' : '⚡'}</div>
                    <div>
                        <span class="coach-name">${item.coach}</span>
                        <span class="coach-title">Master Coach</span>
                    </div>
                </div>
            </div>
            <div class="session-card-bottom">
                <span class="session-spots ${item.spots <= 2 ? 'spots-low' : ''}">
                    ${item.spots <= 2 ? '🔥 Only ' + item.spots + ' Spots Left' : item.spots + ' Available Platforms'}
                </span>
                <button class="btn btn-outline btn-sm magnetic-target" onclick="openVipModal('${item.title} on ${currentDay}')">
                    Book Spot
                </button>
            </div>
        </div>
    `).join('');
}

// Initial render
renderSchedule();

// -------------------------------------------------------------
// 3. INTERACTIVE BEFORE / AFTER TRANSFORMATION SLIDER
// -------------------------------------------------------------
const splitSlider = document.getElementById('splitSlider');
const splitAfterLayer = document.getElementById('splitAfterLayer');
const splitHandle = document.getElementById('splitHandle');

if (splitSlider && splitAfterLayer && splitHandle) {
    let isDragging = false;

    function setSliderPosition(x) {
        const rect = splitSlider.getBoundingClientRect();
        let offsetX = x - rect.left;
        let percentage = (offsetX / rect.width) * 100;

        if (percentage < 5) percentage = 5;
        if (percentage > 95) percentage = 95;

        splitAfterLayer.style.width = `${percentage}%`;
        splitHandle.style.left = `${percentage}%`;
    }

    // Mouse events
    splitSlider.addEventListener('mousedown', (e) => {
        isDragging = true;
        setSliderPosition(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        setSliderPosition(e.clientX);
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Touch events for mobile
    splitSlider.addEventListener('touchstart', (e) => {
        isDragging = true;
        setSliderPosition(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        setSliderPosition(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchend', () => {
        isDragging = false;
    });
}

// -------------------------------------------------------------
// 4. MEMBERSHIP MONTHLY / ANNUAL BILLING SWITCHER
// -------------------------------------------------------------
const billingToggle = document.getElementById('billingToggle');
const priceValues = document.querySelectorAll('.price-val');

if (billingToggle) {
    billingToggle.addEventListener('change', () => {
        const isAnnual = billingToggle.checked;
        priceValues.forEach(price => {
            const monthlyVal = price.getAttribute('data-monthly');
            const annualVal = price.getAttribute('data-annual');
            price.textContent = isAnnual ? annualVal : monthlyVal;
        });
    });
}

// -------------------------------------------------------------
// 5. VIP 3-DAY PASS MODAL & CONFETTI CELEBRATION
// -------------------------------------------------------------
const vipModal = document.getElementById('vipModal');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const passContext = document.getElementById('passContext');
const modalFormContainer = document.getElementById('modalFormContainer');
const modalSuccessState = document.getElementById('modalSuccessState');

window.openVipModal = function (context = 'General VIP Trial') {
    if (passContext) passContext.value = context;
    if (vipModal) vipModal.classList.add('active');
    if (modalFormContainer) modalFormContainer.style.display = 'block';
    if (modalSuccessState) modalSuccessState.style.display = 'none';
};

window.closeVipModal = function () {
    if (vipModal) vipModal.classList.remove('active');
};

if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeVipModal);
}

// Close on backdrop click
if (vipModal) {
    vipModal.addEventListener('click', (e) => {
        if (e.target === vipModal) closeVipModal();
    });
}

// Close on Escape key
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && vipModal && vipModal.classList.contains('active')) {
        closeVipModal();
    }
});

const headerCtaBtn = document.getElementById('headerCtaBtn');
if (headerCtaBtn) {
    headerCtaBtn.addEventListener('click', () => openVipModal('Header CTA'));
}

const memberLoginBtn = document.getElementById('memberLoginBtn');
if (memberLoginBtn) {
    memberLoginBtn.addEventListener('click', () => openVipModal('Athlete Portal Login'));
}

// VIP Form Submit Handler
window.handleVipSubmit = function (e) {
    e.preventDefault();
    const nameInput = document.getElementById('vipName');
    const goalInput = document.getElementById('vipGoal');
    const timeInput = document.getElementById('vipTime');
    const submitBtn = document.getElementById('submitPassBtn');

    if (submitBtn) {
        submitBtn.innerHTML = `<span>SECURING BIOMETRIC ALLOCATION...</span>`;
        submitBtn.disabled = true;
    }

    setTimeout(() => {
        if (modalFormContainer) modalFormContainer.style.display = 'none';
        if (modalSuccessState) modalSuccessState.style.display = 'block';

        const confirmedName = document.getElementById('confirmedName');
        const confirmedGoal = document.getElementById('confirmedGoal');
        const confirmedTime = document.getElementById('confirmedTime');
        const passCode = document.getElementById('passCode');

        if (confirmedName && nameInput) confirmedName.textContent = nameInput.value;
        if (confirmedGoal && goalInput) confirmedGoal.textContent = goalInput.value;
        if (confirmedTime && timeInput) confirmedTime.textContent = timeInput.value;
        if (passCode) passCode.textContent = `#APX-${Math.floor(1000 + Math.random() * 9000)}`;

        if (submitBtn) {
            submitBtn.innerHTML = `<span>Generate My VIP Arena Pass</span><span class="btn-arrow">⚡</span>`;
            submitBtn.disabled = false;
        }

        // Trigger celebratory confetti
        launchConfetti();
    }, 850);
};

// -------------------------------------------------------------
// 6. CONFETTI CELEBRATION CANNON
// -------------------------------------------------------------
function launchConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#ccff00', '#00f2fe', '#ffffff', '#ffb800', '#ff3e3e'];
    const particles = [];

    for (let i = 0; i < 90; i++) {
        particles.push({
            x: canvas.width / 2,
            y: canvas.height / 2,
            r: Math.random() * 6 + 3,
            color: colors[Math.floor(Math.random() * colors.length)],
            vx: (Math.random() - 0.5) * 16,
            vy: (Math.random() - 0.7) * 18,
            gravity: 0.35,
            opacity: 1,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10
        });
    }

    let animationFrame;
    function renderConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let activeParticles = 0;

        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.opacity -= 0.012;
            p.rotation += p.rotationSpeed;

            if (p.opacity > 0) {
                activeParticles++;
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.globalAlpha = Math.max(p.opacity, 0);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 1.5);
                ctx.restore();
            }
        });

        if (activeParticles > 0) {
            animationFrame = requestAnimationFrame(renderConfetti);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            cancelAnimationFrame(animationFrame);
        }
    }

    renderConfetti();
}

// -------------------------------------------------------------
// 7. WEB AUDIO API ATHLETIC AMBIENT SYNTHESIZER
// -------------------------------------------------------------
const audioToggleBtn = document.getElementById('audioToggleBtn');
const audioLabel = document.getElementById('audioLabel');

let audioCtx = null;
let isAudioActive = false;
let ambientInterval = null;

function initAudioEngine() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playSubtlePulse() {
    if (!audioCtx || !isAudioActive) return;
    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        // Sub-bass thump (55Hz -> 42Hz)
        osc.frequency.setValueAtTime(60, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.15);

        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
    } catch (e) {
        // Audio policy ignore
    }
}

if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
        initAudioEngine();
        isAudioActive = !isAudioActive;

        if (isAudioActive) {
            if (audioCtx.state === 'suspended') audioCtx.resume();
            audioToggleBtn.classList.add('active');
            if (audioLabel) audioLabel.textContent = "AUDIO ON";
            playSubtlePulse();
            ambientInterval = setInterval(playSubtlePulse, 1600);
        } else {
            audioToggleBtn.classList.remove('active');
            if (audioLabel) audioLabel.textContent = "AUDIO OFF";
            if (ambientInterval) clearInterval(ambientInterval);
        }
    });
}

// -------------------------------------------------------------
// 8. MOBILE MENU DRAWER
// -------------------------------------------------------------
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileDrawer = document.getElementById('mobileDrawer');
const drawerClose = document.getElementById('drawerClose');
const drawerLinks = document.querySelectorAll('.drawer-link');

if (mobileMenuToggle && mobileDrawer) {
    mobileMenuToggle.addEventListener('click', () => {
        mobileDrawer.classList.add('active');
    });
}

if (drawerClose && mobileDrawer) {
    drawerClose.addEventListener('click', () => {
        mobileDrawer.classList.remove('active');
    });
}

drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (mobileDrawer) mobileDrawer.classList.remove('active');
    });
});

// -------------------------------------------------------------
// 9. LIVE STUDIO CAMERA SWITCHER
// -------------------------------------------------------------
function switchHeroCam(btn, imgSrc) {
    const heroImg = document.getElementById('heroStudioImg');
    const heroSection = document.getElementById('hero');
    if (!heroImg) return;
    
    // Update active button state
    document.querySelectorAll('.cam-switch-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    
    // Smooth fade transition
    heroImg.style.transition = 'opacity 0.25s ease';
    heroImg.style.opacity = '0.35';
    
    setTimeout(() => {
        heroImg.src = imgSrc;
        if (heroSection) {
            heroSection.style.backgroundImage = `url('${imgSrc}')`;
        }
        heroImg.onload = () => {
            heroImg.style.opacity = '1';
        };
        // Fallback in case image is already cached
        setTimeout(() => {
            heroImg.style.opacity = '1';
        }, 100);
    }, 200);
}
window.switchHeroCam = switchHeroCam;

// -------------------------------------------------------------
// 10. INTERACTIVE STUDIO CINEMA EXPLORER
// -------------------------------------------------------------
const studioZonesData = [
    {
        id: "01",
        name: "Olympic Vault",
        tag: "ZONE 01 // ARCHITECTURAL HEXAGONS",
        title: "Olympic Lifting & Hexagonal Strength Vault",
        desc: "Competition-grade Olympic barbell stations, calibrated bumper plates, heavy plate-loaded leg press, and chest press bays illuminated by ambient architectural hexagonal lighting.",
        img: "assets/images/goal-1.png",
        specs: [
            "⚡ Eleiko Barbell Stations",
            "⚡ Plate-Loaded Leg Press",
            "⚡ Acoustic Drop Turf"
        ],
        tourText: "Hello VISION GYM, I would like to book a private tour of the Olympic Vault"
    },
    {
        id: "02",
        name: "Cardio Fleet",
        tag: "ZONE 02 // HIGH-PERFORMANCE CARDIO",
        title: "Commercial Treadmill & HIIT Sprint Deck",
        desc: "High-incline curved and motorized commercial treadmills with panoramic floor-to-ceiling daylight illumination, calibrated for intense 45-minute metabolic intervals.",
        img: "assets/images/goal-6.png",
        specs: [
            "⚡ 24% Max Incline Decks",
            "⚡ Wireless Polar Telemetry",
            "⚡ Low-Impact Shock Absorbers"
        ],
        tourText: "Hello VISION GYM, I would like to book a tour of the Cardio Fleet"
    },
    {
        id: "03",
        name: "Machine Suite",
        tag: "ZONE 03 // SELECTORIZED POWER",
        title: "Precision Selectorized Machine & Plyo Arena",
        desc: "Full biometric cable towers, isolated chest and back selectorized pin-loaded stations, and non-slip high-density plyometric jump platforms designed for rapid circuit transitions.",
        img: "assets/images/goal-4.png",
        specs: [
            "⚡ Dual Adjustable Pulleys",
            "⚡ Camber Precision Cams",
            "⚡ Anti-Slip Plyo Boxes"
        ],
        tourText: "Hello VISION GYM, I would like to check out the Machine Suite"
    },
    {
        id: "04",
        name: "4D Recovery Lounge",
        tag: "ZONE 04 // RECOVERY & THERAPY",
        title: "Zero-Gravity Recovery & Acupressure Loungers",
        desc: "Autonomous full-body zero-gravity 4D massage loungers featuring customized compression, heat therapy, and spinal decompression for rapid post-workout recovery.",
        img: "assets/images/goal-5.png",
        specs: [
            "⚡ Zero-G Recline Vector",
            "⚡ Infrared Heat Therapy",
            "⚡ Deep Calf Compression"
        ],
        tourText: "Hello VISION GYM, I want to book a session in the 4D Recovery Lounge"
    },
    {
        id: "05",
        name: "Hybrid Spin Bay",
        tag: "ZONE 05 // CARDIO ENGINE",
        title: "Magnetic Resistance Spin Deck & Cadence Hub",
        desc: "Club-grade magnetic resistance spin cycle studio with heavy flywheels, SPD-compatible cleats, and real-time resistance consoles for high-output HIIT training.",
        img: "assets/images/goal-2.png",
        specs: [
            "⚡ Magnetic Eddy-Current Braking",
            "⚡ Live RPM & Watts Matrix",
            "⚡ Ergonomic Dual-Pedal Cleats"
        ],
        tourText: "Hello VISION GYM, tell me about the Spin & HIIT Deck"
    },
    {
        id: "06",
        name: "Dumbbell Arena",
        tag: "ZONE 06 // FREE WEIGHTS",
        title: "Dumbbell & Hypertrophy Free-Weight Bay",
        desc: "Heavy-duty urethane dumbbell racks scaling from 2.5kg to 50kg, paired with commercial multi-angle incline benches and full-length alignment mirrors.",
        img: "assets/images/goal-3.png",
        specs: [
            "⚡ 2.5KG - 50KG Urethane Dumbbells",
            "⚡ Commercial Incline Benches",
            "⚡ Distortion-Free Alignment Mirrors"
        ],
        tourText: "Hello VISION GYM, I would like to visit the Free Weight Arena"
    },
    {
        id: "07",
        name: "Linear Track Bay",
        tag: "ZONE 07 // FUNCTIONAL TURF",
        title: "Overhead Linear Light Sled & Agility Track",
        desc: "Sprint sprint lanes, push sled tracks, battle ropes, and kettlebell stations framed under architectural linear overhead glow lights for dynamic conditioning.",
        img: "assets/images/client-photo-3.jpg",
        specs: [
            "⚡ 25M Heavy Friction Sled Turf",
            "⚡ Braided Manila Battle Ropes",
            "⚡ Cast Iron Kettlebell Matrix"
        ],
        tourText: "Hello VISION GYM, I would like to see the Linear Sled Track"
    }
];

let currentStudioZoneIdx = 0;

function selectStudioZone(idx) {
    if (idx < 0 || idx >= studioZonesData.length) return;
    currentStudioZoneIdx = idx;
    const data = studioZonesData[idx];

    // Update Main Image with smooth transition
    const mainImg = document.getElementById('cinemaMainImg');
    if (mainImg) {
        mainImg.style.transition = 'opacity 0.2s ease, transform 0.3s ease';
        mainImg.style.opacity = '0.3';
        mainImg.style.transform = 'scale(0.98)';
        setTimeout(() => {
            mainImg.src = data.img;
            mainImg.onload = () => {
                mainImg.style.opacity = '1';
                mainImg.style.transform = 'scale(1)';
            };
            setTimeout(() => {
                mainImg.style.opacity = '1';
                mainImg.style.transform = 'scale(1)';
            }, 100);
        }, 150);
    }

    // Update Text & HUD elements
    const tagEl = document.getElementById('cinemaZoneTag');
    const titleEl = document.getElementById('cinemaZoneTitle');
    const descEl = document.getElementById('cinemaZoneDesc');
    const specsEl = document.getElementById('cinemaZoneSpecs');
    const counterEl = document.getElementById('cinemaCurrentIndex');

    if (tagEl) tagEl.textContent = data.tag;
    if (titleEl) titleEl.textContent = data.title;
    if (descEl) descEl.textContent = data.desc;
    if (counterEl) counterEl.textContent = data.id;

    if (specsEl && data.specs) {
        specsEl.innerHTML = data.specs.map(spec => `<span class="hud-spec-pill"><span>⚡</span> ${spec.replace(/^⚡\s*/, '')}</span>`).join('');
    }

    // Update Pills
    const pills = document.querySelectorAll('.cinema-zone-pills .zone-pill');
    pills.forEach((p, i) => {
        if (i === idx) p.classList.add('active');
        else p.classList.remove('active');
    });

    // Update Filmstrip
    const filmItems = document.querySelectorAll('.cinema-filmstrip .filmstrip-item');
    filmItems.forEach((f, i) => {
        if (i === idx) f.classList.add('active');
        else f.classList.remove('active');
    });
}

function prevStudioZone() {
    let nextIdx = currentStudioZoneIdx - 1;
    if (nextIdx < 0) nextIdx = studioZonesData.length - 1;
    selectStudioZone(nextIdx);
}

function nextStudioZone() {
    let nextIdx = currentStudioZoneIdx + 1;
    if (nextIdx >= studioZonesData.length) nextIdx = 0;
    selectStudioZone(nextIdx);
}

window.selectStudioZone = selectStudioZone;
window.prevStudioZone = prevStudioZone;
window.nextStudioZone = nextStudioZone;

// -------------------------------------------------------------
// 11. SAMPLE DEMO MODE NOTIFICATION TOAST & ACTION INTERCEPTOR
// -------------------------------------------------------------
let sampleToastTimeout = null;

function showSampleToast(actionType = 'general') {
    const toast = document.getElementById('sampleNoticeToast');
    const toastTitle = document.getElementById('sampleToastTitle');
    if (!toast) return;

    if (toastTitle) {
        if (actionType === 'call') {
            toastTitle.textContent = "Calling Disabled (Sample)";
        } else if (actionType === 'whatsapp') {
            toastTitle.textContent = "WhatsApp Disabled (Sample)";
        } else {
            toastTitle.textContent = "Action Disabled (Sample)";
        }
    }

    toast.classList.add('active');

    // Trigger subtle haptic on mobile if supported
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try { navigator.vibrate(40); } catch(e) {}
    }

    if (sampleToastTimeout) clearTimeout(sampleToastTimeout);
    sampleToastTimeout = setTimeout(() => {
        hideSampleToast();
    }, 3800);
}

function hideSampleToast() {
    const toast = document.getElementById('sampleNoticeToast');
    if (toast) toast.classList.remove('active');
    if (sampleToastTimeout) clearTimeout(sampleToastTimeout);
}

window.showSampleToast = showSampleToast;
window.hideSampleToast = hideSampleToast;

// Intercept all sample action buttons, tel: links, and whatsapp links
document.addEventListener('click', (e) => {
    const targetLink = e.target.closest('a, button');
    if (!targetLink) return;

    const href = targetLink.getAttribute('href') || '';
    const isSampleClass = targetLink.classList.contains('sample-action-btn') || 
                          targetLink.classList.contains('btn-whatsapp') || 
                          targetLink.classList.contains('btn-call') ||
                          targetLink.classList.contains('concierge-whatsapp') ||
                          targetLink.classList.contains('concierge-phone');

    const isTel = href.startsWith('tel:') || targetLink.classList.contains('btn-call') || targetLink.classList.contains('concierge-phone');
    const isWa = href.includes('wa.me') || targetLink.classList.contains('btn-whatsapp') || targetLink.classList.contains('concierge-whatsapp');

    if (isSampleClass || isTel || isWa) {
        e.preventDefault();
        e.stopPropagation();
        showSampleToast(isTel ? 'call' : 'whatsapp');
    }
}, true); // Use capture to ensure full interception

// -------------------------------------------------------------
// 12. MOBILE TOUCH SWIPE GESTURES FOR STUDIO CINEMA EXPLORER
// -------------------------------------------------------------
const cinemaStage = document.querySelector('.cinema-media-wrap');
if (cinemaStage) {
    let touchStartX = 0;
    let touchEndX = 0;
    const minSwipeDistance = 45;

    cinemaStage.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    cinemaStage.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchEndX - touchStartX;
        if (Math.abs(diff) > minSwipeDistance) {
            if (diff < 0) {
                // Swiped Left -> Next Zone
                nextStudioZone();
            } else {
                // Swiped Right -> Previous Zone
                prevStudioZone();
            }
        }
    }, { passive: true });
}



