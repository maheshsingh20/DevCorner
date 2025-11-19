// Smooth scrolling for navigation links
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Appointment form submission
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.appointment-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Appointment request submitted successfully! Our team will contact you soon.');
            form.reset();
        });
    }

    // Add scroll event listeners to nav links
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
});

// Health tip of the day
window.addEventListener('load', function() {
    const tips = [
        'Drink at least 8 glasses of water daily',
        'Exercise regularly for at least 30 minutes',
        'Get 7-9 hours of sleep each night',
        'Eat a balanced diet rich in fruits and vegetables',
        'Visit your doctor for regular checkups'
    ];
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    console.log('Health Tip: ' + randomTip);
});
