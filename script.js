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
    const mobileNav = document.getElementById("mobileNav");
    const hamburger = document.getElementById("hamburger");
    
    if (mobileNav) mobileNav.classList.toggle("show");
    if (hamburger) hamburger.classList.toggle("active");
}

function closeMenu() {
    const mobileNav = document.getElementById("mobileNav");
    const hamburger = document.getElementById("hamburger");
    
    if (mobileNav) mobileNav.classList.remove("show");
    if (hamburger) hamburger.classList.remove("active");
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

// Global listener to close modals when clicking outside container windows
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
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmbWlrY3JjdWRieHhtenh0Y2xvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzNjU4MDYsImV4cCI6MjA5OTk0MTgwNn0.MvnXh0-s6W7S7ziqP714fnCgYIBJmAYzmb1FAp8OhqQ";

let supabaseClient = null;

if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
    console.error("Supabase SDK not detected. Ensure the Supabase CDN script tag is included in your HTML.");
}

// ====== HELPER: CUSTOM TOAST NOTIFICATION ======
let toastTimer = null;

function showToast(title, message, isError = false) {
    const toast = document.getElementById("toast");
    const toastTitle = document.getElementById("toastTitle");
    const toastBody = document.getElementById("toastBody");
    const toastIcon = document.getElementById("toastIcon");

    if (!toast) return;

    // Set Text Content
    if (toastTitle) toastTitle.textContent = title;
    if (toastBody) toastBody.textContent = message;

    // Toggle Error / Success Styling
    if (isError) {
        toast.classList.add("error");
        if (toastIcon) toastIcon.innerHTML = `<i class="fas fa-exclamation-circle"></i>`;
    } else {
        toast.classList.remove("error");
        if (toastIcon) toastIcon.innerHTML = `<i class="fas fa-check-circle"></i>`;
    }

    // Display Toast
    toast.classList.add("show");

    // Clear any active dismiss timer
    if (toastTimer) clearTimeout(toastTimer);

    // Auto-hide after 4 seconds
    toastTimer = setTimeout(() => {
        closeToast();
    }, 4000);
}

function closeToast() {
    const toast = document.getElementById("toast");
    if (toast) toast.classList.remove("show");
}


// ====== 6. FORM SUBMISSION EVENT LISTENER ======
const contactForm = document.getElementById("contactForm");
if (contactForm) {
    contactForm.addEventListener("submit", async function(e) {
        e.preventDefault();

        if (!supabaseClient) {
            showToast("Service Unavailable", "Database connection is currently offline.", true);
            return;
        }

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn ? submitBtn.textContent : "Send";

        // Collect Form Fields
        const nameInput = document.getElementById("name");
        const emailInput = document.getElementById("email");
        const messageInput = document.getElementById("message");

        const name = nameInput ? nameInput.value : "";
        const email = emailInput ? emailInput.value : "";
        const message = messageInput ? messageInput.value : "";

        
        if (submitBtn) {
            submitBtn.textContent = "Sending...";
            submitBtn.disabled = true;
        }

        try {
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
                showToast("Submission Failed", "Error sending message. Please try again.", true);
                console.error("Supabase Error:", error.message);
            } else {
                showToast("Message Sent!", "Thank you for reaching out. I'll get back to you soon.");
                contactForm.reset();
            }
        } catch (err) {
            console.error("Submission Error:", err);
            showToast("Unexpected Error", "An error occurred. Please try again later.", true);
        } finally {
            // Restore button state
            if (submitBtn) {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        }
    });
}