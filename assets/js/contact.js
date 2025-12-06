document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        const whatsappMessage = `📩 NEW CONTACT MESSAGE
----------------------
Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
----------------------
Sent from Website Contact Form`;

        const encodedMessage = encodeURIComponent(whatsappMessage);
        const whatsappURL = `https://api.whatsapp.com/send?phone=6281322043500&text=${encodedMessage}`;

        window.open(whatsappURL, '_blank');
    });
});

