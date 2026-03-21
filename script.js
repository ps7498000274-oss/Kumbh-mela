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

// 3. CROWD STATUS LOGIC (Fixing function name mismatch)
window.updateCrowdStatus = function(level) {
    const card = document.getElementById('status-card');
    const title = document.getElementById('status-title');
    const msg = document.getElementById('status-msg');
    const parking = document.getElementById('parking-text');

    if (!card) return;

    card.classList.remove('status-low', 'status-med', 'status-high');

    if (level === 'low') {
        card.classList.add('status-low');
        title.innerText = "LOW CROWD";
        msg.innerText = "Shahar mein yaatayaat samanya hai. Private gaadiyan allowed hain.";
        parking.innerText = "All Parking Lots: OPEN";
    } else if (level === 'med') {
        card.classList.add('status-med');
        title.innerText = "MEDIUM CROWD";
        msg.innerText = "Bheed badh rahi hai. Kripya public transport ka upyog karein.";
        parking.innerText = "City Parking: 80% Full";
    } else if (level === 'high') {
        card.classList.add('status-high');
        title.innerText = "HIGH CROWD (ALERT)";
        msg.innerText = "SHAHI SNAN ALERT: Sirf paidal yaatra karein.";
        parking.innerText = "Outer Parking: FULL";
    }
};

// 4. COUNTDOWN TIMER
function startCountdown() {
    const kumbhDate = new Date("August 14, 2027 00:00:00").getTime();
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


function generateQR() {
    // 1. Inputs se data uthao
    const name = document.getElementById('qr-name').value;
    const blood = document.getElementById('qr-blood').value;
    const phone = document.getElementById('qr-phone').value;
    const qrContainer = document.getElementById('qrcode');

    // 2. Check karo ki inputs khali toh nahi hain
    if (name === '' || phone === '') {
        alert("Please enter Name and Phone number!");
        return;
    }

    // 3. Purana QR saaf karo (Important!)
    qrContainer.innerHTML = "";

    // 4. Display updates
    document.getElementById('display-name').innerText = name;
    document.getElementById('display-blood').innerText = blood;

    // 5. QR Code Data taiyar karo
    const qrData = `Emergency Contact: ${name}\nBlood Group: ${blood}\nPhone: ${phone}`;

    // 6. QR Generate karo
    new QRCode(qrContainer, {
        text: qrData,
        width: 128,
        height: 128,
        colorDark : "#ff6b00", // Saffron color for Kumbh theme
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });

    // 7. Download button dikhao
    document.querySelector('.btn-download').style.display = "inline-block";
}



/* Keep your generateQR() function as it is, but 
   make sure it calls the bigger ID card IDs: */
// document.getElementById('display-name').innerText = name;
// document.getElementById('display-blood').innerText = blood;

// THE NEW DOWNLOAD FUNCTION
function downloadIDCard() {
    const cardElement = document.getElementById('id-card-capture');
    
    // Check if the QR code is generated before downloading
    const qrImage = document.querySelector('#qrcode img');
    if (!qrImage) {
        alert("Please generate the card first!");
        return;
    }

    // Capture the HTML element as a canvas
    html2canvas(cardElement).then(function(canvas) {
        // Convert canvas to a data URL (image format)
        const imgData = canvas.toDataURL("image/png");
        
        // Create a temporary anchor element to trigger download
        const downloadLink = document.createElement('a');
        downloadLink.href = imgData;
        downloadLink.download = 'Kumbh-Safety-Card.png'; // File name
        
        // Trigger the click event
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    });
}