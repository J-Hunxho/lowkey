document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('.ghost-fade-in');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12 }
        );

        revealElements.forEach((el) => observer.observe(el));
    } else {
        revealElements.forEach((el) => el.classList.add('visible'));
    }

    const handledForms = document.querySelectorAll('form[action="/waitlist"], form[action="/contact"]');
    handledForms.forEach((form) => {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton) {
                const originalLabel = submitButton.textContent;
                submitButton.textContent = 'Sent';
                submitButton.setAttribute('disabled', 'true');
                setTimeout(() => {
                    submitButton.textContent = originalLabel || 'Submit';
                    submitButton.removeAttribute('disabled');
                }, 1600);
            }
            form.reset();
        });
    });
});
