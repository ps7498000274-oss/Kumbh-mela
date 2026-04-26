/* Header */
function toggleMenu() {
    const nav = document.getElementById('navMenu');
    nav.classList.toggle('active');
}

/* live widgets */
// 1. PAGE LOAD LOGIC
// Jab HTML pura load ho jaye, tabhi functions ko chalayein
document.addEventListener('DOMContentLoaded', () => {
    getLiveWeather();
    startCountdown();
    
    // Mobile Menu Toggle (Aapke pehle code ka hissa)
    const menuBtn = document.getElementById('menuBtn');
    const mainNav = document.getElementById('mainNav');
    if (menuBtn && mainNav) {
        menuBtn.addEventListener('click', () => {
            mainNav.classList.toggle('active');
        });
    }
});

// 2. WEATHER LOGIC (Working Version)
async function getLiveWeather() {
    const apiKey = "edd0aac747fe91fcaaa478fa292e5639"; 
    const city = "Nashik";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("API Not Ready");
        const data = await response.json();

        // HTML IDs ke saath data link karna
        if(document.getElementById("temp-value")) {
            document.getElementById("temp-value").innerText = Math.round(data.main.temp);
        }
        if(document.getElementById("weather-condition")) {
            document.getElementById("weather-condition").innerText = data.weather[0].description;
        }
        if(document.getElementById("humidity")) {
            document.getElementById("humidity").innerText = `Humidity: ${data.main.humidity}%`;
        }
        
        // Icon update karna
        const iconCode = data.weather[0].icon;
        const iconBox = document.getElementById("weather-icon");
        if(iconBox) {
            iconBox.innerHTML = `<img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" width="60">`;
        }
    } catch (error) {
        console.log("Using Demo Weather Data...");
        // Agar internet/API fail ho toh ye dikhega
        if(document.getElementById("temp-value")) document.getElementById("temp-value").innerText = "28"; 
        if(document.getElementById("weather-condition")) document.getElementById("weather-condition").innerText = "Clear Sky";
    }
}

// 3. COUNTDOWN TIMER (Working Version)
function startCountdown() {
    // Target date set karein
    const kumbhDate = new Date("October 31, 2026 00:00:00").getTime();
    
    const timer = setInterval(function() {
        const now = new Date().getTime();
        const distance = kumbhDate - now;

        // Agar countdown khatam ho jaye
        if (distance < 0) {
            clearInterval(timer);
            return;
        }

        // Calculation
        const d = Math.floor(distance / (1000 * 60 * 60 * 24));
        const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((distance % (1000 * 60)) / 1000);

        // HTML mein data update karna
        if(document.getElementById("days")) document.getElementById("days").innerHTML = d;
        if(document.getElementById("hours")) document.getElementById("hours").innerHTML = h;
        if(document.getElementById("minutes")) document.getElementById("minutes").innerHTML = m;
        if(document.getElementById("seconds")) document.getElementById("seconds").innerHTML = s;
        
    }, 1000);
}

/* Safety section */
function generateSmartCard() {
    const name = document.getElementById('userName').value;
    const phone = document.getElementById('userPhone').value;
    const blood = document.getElementById('userBlood').value;
    const photoInput = document.getElementById('userPhoto');

    if (!name || !phone) {
        alert("Pehle Name aur Phone number bhariye!");
        return;
    }

    // 1. Update Name on Card
    document.getElementById('displayName').innerText = name;

    // 2. Clear & Generate QR (As Canvas)
    document.getElementById("qrcode").innerHTML = "";
    const qrData = `Name: ${name} | Contact: ${phone} | Blood: ${blood}`;
    
    // QR generate karte waqt useCanvas: true zaroori hai download ke liye
    new QRCode(document.getElementById("qrcode"), {
        text: qrData,
        width: 100,
        height: 100,
        useSVG: false
    });

    // 3. Handle Photo Preview
    if (photoInput.files && photoInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('photoPreview').innerHTML = `<img src="${e.target.result}" id="yatriImg" style="width:100%; height:100%; object-fit:cover;">`;
        };
        reader.readAsDataURL(photoInput.files[0]);
    }

    // Show Download Button
    document.getElementById('downloadBtn').style.display = "inline-block";
}

// 100% Working Download Function
function downloadIDCard() {
    const name = document.getElementById('userName').value;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Canvas size set karein (ID Card Ratio)
    canvas.width = 400;
    canvas.height = 250;

    // 1. Draw Background (White)
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Draw Header (Orange)
    ctx.fillStyle = "#ff6b00";
    ctx.fillRect(0, 0, canvas.width, 60);

    // 3. Draw Header Text
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px Arial";
    ctx.fillText("NASHIK KUMBH 2027", 20, 38);

    // 4. Draw Yatri Name
    ctx.fillStyle = "#333333";
    ctx.font = "bold 22px Arial";
    ctx.fillText(name.toUpperCase(), 150, 110);

    // 5. Draw QR Code (Get from generated canvas)
    const qrCanvas = document.querySelector('#qrcode canvas');
    if (qrCanvas) {
        ctx.drawImage(qrCanvas, 150, 130, 80, 80);
    }

    // 6. Draw User Photo
    const userImg = document.querySelector('#yatriImg');
    if (userImg) {
        ctx.drawImage(userImg, 20, 80, 100, 130);
    } else {
        ctx.fillStyle = "#f0f0f0";
        ctx.fillRect(20, 80, 100, 130);
        ctx.fillStyle = "#888";
        ctx.font = "12px Arial";
        ctx.fillText("No Photo", 45, 150);
    }

    // 7. Draw Footer
    ctx.fillStyle = "#222222";
    ctx.fillRect(0, 225, canvas.width, 25);
    ctx.fillStyle = "#ffffff";
    ctx.font = "12px Arial";
    ctx.fillText("EMERGENCY SMART ID CARD", 120, 242);

    // 8. Trigger Download
    const link = document.createElement('a');
    link.download = `Kumbh-Safety-Card-${name}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
}

/*heritage section */
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
});

const hiddenElements = document.querySelectorAll('.animate-on-scroll');
hiddenElements.forEach((el) => observer.observe(el));

/* Gallery Section */
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-box');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 1. Remove active class from all buttons and add to clicked one
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            galleryItems.forEach(item => {
                // Initial hide animation
                item.style.opacity = '0';
                item.style.transform = 'scale(0.9)';

                setTimeout(() => {
                    if (filterValue === 'all' || item.classList.contains(filterValue)) {
                        item.style.display = 'block';
                        // Show animation
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        item.style.display = 'none';
                    }
                }, 400); // Time matches CSS transition
            });
        });
    });
});


/* FAQ Section */
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const faqItem = button.parentElement;

        // Close other open items (Optional: remove this if you want multiple open)
        document.querySelectorAll('.faq-item').forEach(item => {
            if (item !== faqItem) item.classList.remove('active');
        });

        // Toggle current item
        faqItem.classList.toggle('active');
    });
});     

/*idea section */
document.getElementById('suggestionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Yahan aap logic likh sakte hain ki data kahan jayega
    // Filhal hum sirf animation dikhayenge
    const btn = document.querySelector('.submit-btn');
    btn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
    
    setTimeout(() => {
        alert('Thank you! Your suggestion has been sent to the admin.');
        btn.innerHTML = 'Sent! <i class="fas fa-check"></i>';
        this.reset();
    }, 2000);
});

// Test karne ke liye ki Formspree se pehle buttons select ho rahe hain
document.querySelectorAll('input[name="msg-type"]').forEach(radio => {
    radio.addEventListener('change', function() {
        console.log("Selected Type: " + this.value);
    });
});

/* language section */
// 1. Language Menu Toggle
function toggleLangMenu() {
    const menu = document.getElementById('langMenu');
    if (menu.style.display === 'block') {
        menu.style.display = 'none';
    } else {
        menu.style.display = 'block';
    }
}

// 2. Change Language Function
function changeLang(langCode) {
    const select = document.querySelector('.goog-te-combo');
    if (select) {
        select.value = langCode;
        select.dispatchEvent(new Event('change'));
        toggleLangMenu();
    } else {
        // Fallback: URL Hash method agar dropdown load na ho
        window.location.hash = `#googtrans(en|${langCode})`;
        location.reload();
    }
}

// 3. Google Translate Initialization
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,hi,mr,bn,te,ta,gu,kn,pa,ml',
        autoDisplay: false
    }, 'google_translate_element');

    // AUTO-HINDI LOGIC: Pehli baar visit par Hindi set karega
    setTimeout(() => {
        if (!document.cookie.includes('googtrans')) {
            changeLang('hi');
        }
    }, 1500); // 1.5 second wait for Google to load
}

// Menu band karne ke liye agar user bahar click kare
window.onclick = function(event) {
    if (!event.target.matches('.lang-fab') && !event.target.closest('.lang-menu')) {
        document.getElementById('langMenu').style.display = 'none';
    }
}

// 1. Menu Toggle Logic
const fab = document.getElementById('fab-btn');
const menu = document.getElementById('langMenu');

fab.addEventListener('click', () => {
    menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
});

// 2. Google Translate Initialization
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,hi,mr,bn,te,ta,gu,kn,pa,ml',
        autoDisplay: false
    }, 'google_translate_element');
}

// 3. Robust Language Changer
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('lang-opt')) {
        const lang = e.target.getAttribute('data-lang');
        const googleCombo = document.querySelector('.goog-te-combo');

        if (googleCombo) {
            googleCombo.value = lang;
            googleCombo.dispatchEvent(new Event('change'));
            menu.style.display = 'none';
        } else {
            // If Google fails, use Hash Fallback
            window.location.hash = `#googtrans(en|${lang})`;
            location.reload();
        }
    }
});

// 4. Auto-Hindi Logic (Fires only once)
window.addEventListener('load', () => {
    setTimeout(() => {
        if (!document.cookie.includes('googtrans')) {
            const googleCombo = document.querySelector('.goog-te-combo');
            if (googleCombo) {
                googleCombo.value = 'hi';
                googleCombo.dispatchEvent(new Event('change'));
            }
        }
    }, 2000); // Wait 2 seconds for Google to stabilize
});


/* Auto hindi */
// --- 1. FORCE SET HINDI COOKIE (Pehle hi run ho jayega) ---
function setHindiForce() {
    document.cookie = "googtrans=/en/hi; path=/";
    document.cookie = "googtrans=/en/hi; domain=" + document.domain + "; path=/";
    if (!window.location.hash.includes('#googtrans(en|hi)')) {
        window.location.hash = '#googtrans(en|hi)';
    }
}
setHindiForce(); // Immediate execution

// --- 2. GOOGLE TRANSLATE INIT ---
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,hi,mr,bn,te,ta,gu,kn,pa,ml',
        autoDisplay: false
    }, 'google_translate_element');

    // Auto-Hindi Loop: Jab tak dropdown na mil jaye check karte raho
    var autoTranslateInterval = setInterval(function() {
        var combo = document.querySelector('.goog-te-combo');
        if (combo) {
            combo.value = 'hi';
            combo.dispatchEvent(new Event('change'));
            clearInterval(autoTranslateInterval); // Milne ke baad stop kar do
        }
    }, 500); // Har aadhe second mein check karega
}

// --- 3. MENU & BUTTON CONTROLS ---
document.addEventListener('DOMContentLoaded', () => {
    const fab = document.getElementById('fab-btn');
    const menu = document.getElementById('langMenu');

    fab.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
    });

    document.querySelectorAll('.lang-opt').forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            const combo = document.querySelector('.goog-te-combo');
            if (combo) {
                combo.value = lang;
                combo.dispatchEvent(new Event('change'));
            }
            window.location.hash = `#googtrans(en|${lang})`;
            location.reload();
        });
    });
});