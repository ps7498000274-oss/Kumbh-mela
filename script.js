// 1. NAVIGATION LOGIC (Mobile Menu)
document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menuBtn');
    const mainNav = document.getElementById('mainNav');
    const navLinks = document.querySelectorAll('#mainNav a');

    if (menuBtn && mainNav) {
        menuBtn.addEventListener('click', () => {
            mainNav.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
            });
        });
    }

    // Initial Weather & Countdown call
    getLiveWeather();
    startCountdown();
});

// 2. WEATHER LOGIC (Nashik Live)
async function getLiveWeather() {
    const apiKey = "edd0aac747fe91fcaaa478fa292e5639"; 
    const city = "Nashik";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("API Not Ready");
        const data = await response.json();

        document.getElementById("temp-value").innerText = Math.round(data.main.temp);
        document.getElementById("weather-condition").innerText = data.weather[0].description;
        document.getElementById("humidity").innerText = `Humidity: ${data.main.humidity}%`;
        
        const iconCode = data.weather[0].icon;
        document.getElementById("weather-icon").innerHTML = `<img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" width="50">`;
    } catch (error) {
        console.log("Using Demo Weather Data...");
        document.getElementById("temp-value").innerText = "28"; 
        document.getElementById("weather-condition").innerText = "Clear Sky";
        document.getElementById("weather-icon").innerHTML = "☀️";
    }
}

// 4. COUNTDOWN TIMER
function startCountdown() {
    const kumbhDate = new Date("October  31, 2026 00:00:00").getTime();
    setInterval(function() {
        const now = new Date().getTime();
        const distance = kumbhDate - now;

        if (distance < 0) return;

        document.getElementById("days").innerHTML = Math.floor(distance / (1000 * 60 * 60 * 24));
        document.getElementById("hours").innerHTML = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        document.getElementById("minutes").innerHTML = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        document.getElementById("seconds").innerHTML = Math.floor((distance % (1000 * 60)) / 1000);
    }, 1000);
}

// 5. LANGUAGE & GOOGLE TRANSLATE
// 1. Google Translate Init
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,hi,mr,bn,te,ta,gu,kn,pa,ml',
        autoDisplay: false
    }, 'google_translate_element');
}

// 2. Language Change Function
window.changeLanguage = function(langCode) {
    const googleCombo = document.querySelector('.goog-te-combo');
    if (googleCombo) {
        googleCombo.value = langCode;
        googleCombo.dispatchEvent(new Event('change'));
        
        // Card band karne ke liye
        const langCard = document.getElementById('langCard');
        if(langCard) langCard.classList.remove('active');
    } else {
        alert("Translator is loading... Please try again in a second.");
    }
};


window.toggleLangCard = function() {
    const card = document.getElementById('langCard');
    if (card) {
        card.classList.toggle('active');
    } else {
        console.error("langCard nahi mila!");
    }
};







document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menuBtn');
    const mainNav = document.getElementById('mainNav');

    if (menuBtn && mainNav) {
        // Button click hone par menu toggle hoga
        menuBtn.onclick = function(e) {
            e.stopPropagation(); // Event ko bahar jane se rokne ke liye
            mainNav.classList.toggle('active');
            console.log("Menu button clicked!");
        };

        // Screen par kahin bhi click karne par menu band ho jaye
        document.onclick = function() {
            mainNav.classList.remove('active');
        };
    }
});



function shareMyLocation() {
    if (navigator.geolocation) {
        // User ko batane ke liye ki kaam ho raha hai
        const btn = document.querySelector('.fab-location');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Getting Location...';

        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            // Google Maps link banana
            const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
            
            // WhatsApp par bhejne ke liye text
            const text = encodeURIComponent(`नमस्ते, मैं नाशिक कुंभ मेला में यहाँ हूँ: ${mapsUrl}`);
            const whatsappUrl = `https://wa.me/?text=${text}`;
            
            // Nayi window mein WhatsApp kholna
            window.open(whatsappUrl, '_blank');
            
            // Button wapas normal karna
            btn.innerHTML = originalText;
        }, function(error) {
            alert("Location access denied. Please enable GPS.");
            btn.innerHTML = originalText;
        });
    } else {
        alert("Your browser does not support Geolocation.");
    }
}


function makeMyCard() {
    const name = document.getElementById('qr-name').value;
    const phone = document.getElementById('qr-phone').value;
    const blood = document.getElementById('qr-blood').value || "N/A";
    const address = document.getElementById('qr-address').value || "N/A";
    const medical = document.getElementById('qr-medical').value || "None";

    if (!name || !phone) {
        alert("Pahile Naav ani Number taka!"); // Marathi/Hindi mix touch
        return;
    }

    // Display updates
    document.getElementById('out-name').innerText = name.toUpperCase();
    document.getElementById('out-blood').innerText = blood;
    document.getElementById('out-address').innerText = address;
    document.getElementById('out-medical').innerText = medical;

    // QR Data Formatting
    const qrData = `KUMBH SAFETY ID\nName: ${name}\nSOS: ${phone}\nBlood: ${blood}\nCity: ${address}\nMedical: ${medical}`;

    const qrBox = document.getElementById('qrcode-box');
    qrBox.innerHTML = ""; 

    new QRCode(qrBox, {
        text: qrData,
        width: 128,
        height: 128,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.M
    });

    document.getElementById('download-btn').style.display = "block";
}

function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en', // मूल कोड इंग्लिश में है
        includedLanguages: 'hi,en,mr,gu', // जो भाषाएँ आप देना चाहते हैं
    }, 'google_translate_element');

    // पेज लोड होते ही हिन्दी पर स्विच करने के लिए
    setTimeout(function() {
        var selectElement = document.querySelector('select.goog-te-combo');
        if (selectElement) {
            selectElement.value = 'hi'; // यहाँ 'hi' मतलब हिन्दी
            selectElement.dispatchEvent(new Event('change'));
        }
    }, 1000); // 1 सेकंड का इंतज़ार ताकि Google स्क्रिप्ट लोड हो जाए
}