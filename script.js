// ====== 1. PAGE ROUTING SYSTEM ======
function showPage(pageId, element) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }

    document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
    if (element) {
        element.classList.add('active');
    }
}

// ====== 2. MOBILE HAMBURGER MENU ======
function toggleMenu() {
    document.getElementById("mobileNav").classList.toggle("show");
    document.getElementById("hamburger").classList.toggle("active");
}

function closeMenu() {
    document.getElementById("mobileNav").classList.remove("show");
    document.getElementById("hamburger").classList.remove("active");
}

// ====== 3. MODAL VIEWERS (CV & QUALIFICATIONS) ======

// Mobile Detection & Google Docs Viewer Helper
function getPdfUrl(pdfPath) {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // Resolve path to full absolute URL required by Google Viewer
        const absoluteUrl = new URL(pdfPath, window.location.href).href;
        return `https://docs.google.com/viewer?url=${encodeURIComponent(absoluteUrl)}&embedded=true`;
    }
    
    // Standard desktop iframe loading
    return pdfPath + "#toolbar=0&navpanes=0";
}

// --- CV Modal ---
function openCvModal(pdfPath = 'Tanya_McNamara_CV.pdf') {
    const cvModal = document.getElementById("cvModal");
    const cvFrame = document.getElementById("cvFrame");
    const mobileLink = document.getElementById('cvMobileLink');

    // Handle string fallback if event object is passed
    if (typeof pdfPath !== 'string') {
        pdfPath = 'Tanya_McNamara_CV.pdf';
    }

    if (cvModal && cvFrame) {
        cvFrame.src = getPdfUrl(pdfPath);

        if (mobileLink) {
            mobileLink.href = pdfPath;
        }

        cvModal.classList.add("active");
    }
}

function closeCV() {
    const cvModal = document.getElementById("cvModal");
    const cvFrame = document.getElementById("cvFrame");

    if (cvModal) {
        cvModal.classList.remove("active");
        if (cvFrame) {
            cvFrame.src = ""; // Clears PDF memory
        }
    }
}

// --- Qualifications Modal ---
function openQualModal(pdfPath) {
    const modal = document.getElementById('qualModal');
    const iframe = document.getElementById('qualFrame');
    const mobileLink = document.getElementById('qualMobileLink');
    
    if (modal && iframe) {
        iframe.src = getPdfUrl(pdfPath);
        
        // Dynamically update the direct link URL for mobile users
        if (mobileLink) {
            mobileLink.href = pdfPath;
        }
        
        modal.classList.add('active');
    }
}

function closeQualModal() {
    const modal = document.getElementById('qualModal');
    const iframe = document.getElementById('qualFrame');
    
    if (modal && iframe) {
        modal.classList.remove('active');
        iframe.src = ""; // Clear source to drop background memory load
    }
}

// Global listener to close modals when clicking outside the window containers
window.addEventListener('click', function(event) {
    const cvModal = document.getElementById("cvModal");
    const qualModal = document.getElementById('qualModal');
    
    if (event.target === cvModal) {
        closeCV();
    }
    if (event.target === qualModal) {
        closeQualModal();
    }
});

// ====== 4. THEME TOGGLER (DARK / LIGHT) ======
const toggleBtn = document.getElementById("themeToggle");
if (toggleBtn) {
    const icon = toggleBtn.querySelector("i");

    if (localStorage.getItem("theme") === "light") {
        document.body.classList.add("light");
        if (icon) icon.classList.replace("fa-moon", "fa-sun");
    }

    toggleBtn.addEventListener("click", () => {
        document.body.classList.toggle("light");
        const isLight = document.body.classList.contains("light");
        
        if (icon) {
            icon.classList.toggle("fa-moon", !isLight);
            icon.classList.toggle("fa-sun", isLight);
        }
        
        localStorage.setItem("theme", isLight ? "light" : "dark");
    });
}

// ====== 5. SUPABASE INITIALIZATION ======
const SUPABASE_URL = "https://pfmikcrcudbxxmzxtclo.supabase.co";
const SUPABASE_ANON_KEY ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmbWlrY3JjdWRieHhtenh0Y2xvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzNjU4MDYsImV4cCI6MjA5OTk0MTgwNn0.MvnXh0-s6W7S7ziqP714fnCgYIBJmAYzmb1FAp8OhqQ";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ====== 6. FORM SUBMISSION EVENT LISTENER ======
const contactForm = document.getElementById("contactForm");
if (contactForm) {
    contactForm.addEventListener("submit", async function(e) {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const message = document.getElementById("message").value;

        const { data, error } = await supabaseClient
            .from('contacts')
            .insert([
                { 
                    name: name, 
                    email: email, 
                    message: message,
                    created_at: new Date().toISOString() 
                }
            ]);

        if (error) {
            alert("Error sending message");
            console.error("Supabase Error:", error.message);
        } else {
            alert("Message sent successfully!");
            contactForm.reset();
        }
    });
}