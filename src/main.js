import './style.css';
import { submitRaumAnfrage } from './submitRaumAnfrage.js';

// --- Start: Allgemeine Skripte für alle Seiten (Navbar, Mobile Menü, etc.) ---

// Mobile Menü Toggle
const toggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu'); // Umbenannt, um Konflikt zu vermeiden

if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

// Mobile Submenu Toggle (falls du es noch brauchst, aber nicht im HTML sichtbar)
// In deinem aktuellen HTML gibt es kein Element mit ID 'vermietung-toggle' oder 'vermietung-submenu'
// Wenn du diese Funktionalität entfernen möchtest, kannst du diesen Block löschen.
const vermietungToggle = document.getElementById('vermietung-toggle');
const vermietungSubmenu = document.getElementById('vermietung-submenu');

if (vermietungToggle && vermietungSubmenu) {
    vermietungToggle.addEventListener('click', () => {
        vermietungSubmenu.classList.toggle('hidden');
    });
}


// Scroll Effect für Navbar
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    const burger = document.getElementById('menu-toggle');
    // Wichtig: querySelectorAll gibt eine NodeList zurück, die wir in ein Array umwandeln
    // um forEach nutzen zu können, falls es keine Elemente gibt, wird es ein leeres Array
    const navLinks = document.querySelectorAll('.nav-links li a.nav-link') ?? []; 
    
    // Logo Text Element
    const logoText = document.querySelector('.glow-text'); 


    if (navbar && burger && logoText) { // Sicherstellen, dass die Elemente existieren
        if (window.scrollY > 50) {
            navbar.classList.add('bg-white', 'shadow-md');
            navbar.classList.remove('bg-transparent');
            burger.classList.remove('text-white');
            burger.classList.add('text-pink-500');
            logoText.classList.remove('text-white'); // Logo-Text anpassen
            logoText.classList.add('text-gray-900');
            navLinks.forEach(link => {
                link.classList.remove('text-white');
                link.classList.add('text-gray-900');
            });
        } else {
            navbar.classList.remove('bg-white', 'shadow-md');
            navbar.classList.add('bg-transparent');
            burger.classList.remove('text-pink-500');
            burger.classList.add('text-white');
            logoText.classList.remove('text-gray-900'); // Logo-Text zurücksetzen
            logoText.classList.add('text-white');
            navLinks.forEach(link => {
                link.classList.remove('text-gray-900');
                link.classList.add('text-white');
            });
        }
    }
});

// --- Ende: Allgemeine Skripte für alle Seiten ---


// --- Start: Skripte spezifisch für das Buchungsformular ---
const form = document.getElementById('raum-form');
const submitButton = form?.querySelector('button[type="submit"]');
const formMessage = document.getElementById('form-message');

if (form && submitButton && formMessage) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Button deaktivieren und Text ändern, um Mehrfachklicks zu verhindern
        submitButton.disabled = true;
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Sende Anfrage...';
        submitButton.classList.add('opacity-75', 'cursor-not-allowed');

        // 2. Sofortige visuelle Bestätigung anzeigen
        formMessage.classList.remove('hidden', 'bg-green-100', 'text-green-800', 'bg-red-100', 'text-red-800');
        formMessage.classList.add('bg-blue-100', 'text-blue-800');
        formMessage.textContent = 'Ihre Anfrage wird gesendet... Bitte warten Sie einen Moment.';
        formMessage.style.display = 'block';

        const formData = {
            name: form.name.value,
            email: form.email.value,
            telefonnummer: form.telefonnummer.value,
            datum: new Date(form.datum.value).toISOString(),
            personenanzahl: parseInt(form.personenanzahl.value),
            typ: form.typ.value,
            nachricht: form.nachricht.value
        };

        const mietauswahlFeld = document.getElementById('mietauswahlFeld');
        if (mietauswahlFeld && mietauswahlFeld.value) {
            formData.mietauswahl = mietauswahlFeld.value;
        }

        try {
            const success = await submitRaumAnfrage(formData);

            formMessage.classList.remove('bg-blue-100', 'text-blue-800');

            if (success) {
                formMessage.classList.add('bg-green-100', 'text-green-800');
                formMessage.textContent = '✅ Ihre Buchungsanfrage wurde erfolgreich gesendet! Wir melden uns in Kürze bei Ihnen.';
                form.reset();
                localStorage.removeItem('mietauswahl');
                const box = document.getElementById('auswahlBuchung');
                if (box) {
                    box.style.display = 'none';
                }
            } else {
                formMessage.classList.add('bg-red-100', 'text-red-800');
                formMessage.textContent = '❌ Es gab ein Problem beim Absenden Ihrer Anfrage. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt.';
            }
        } catch (error) {
            console.error("Fehler beim Senden der Anfrage:", error);
            formMessage.classList.remove('bg-blue-100', 'text-blue-800');
            formMessage.classList.add('bg-red-100', 'text-red-800');
            formMessage.textContent = '❌ Es ist ein unerwarteter Fehler aufgetreten. Bitte versuchen Sie es später erneut.';
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
            submitButton.classList.remove('opacity-75', 'cursor-not-allowed');

            setTimeout(() => {
                formMessage.style.display = 'none';
                formMessage.classList.add('hidden');
                formMessage.textContent = '';
            }, 7000);
        }
    });

    // Code für die Mietauswahl anzeigen und löschen
    const gespeicherteAuswahl = JSON.parse(localStorage.getItem('mietauswahl') || '[]');
    const liste = document.getElementById('buchungAuswahlListe');
    const gesamtEl = document.getElementById('buchungGesamt');
    const hiddenInput = document.getElementById('mietauswahlFeld');
    const box = document.getElementById('auswahlBuchung');
    const resetBtn = document.getElementById('resetAuswahl');

    const gefiltert = gespeicherteAuswahl.filter(item => item?.titel && typeof item.preis === 'number');

    if (gefiltert.length > 0) {
        let summe = 0;
        liste.innerHTML = '';
        gefiltert.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `• ${item.titel} (${item.preis.toFixed(2)} €)`;
            liste.appendChild(li);
            summe += item.preis;
        });
        gesamtEl.textContent = summe.toFixed(2);
        hiddenInput.value = gefiltert.map(i => `${i.titel} (${i.preis.toFixed(2)} €)`).join(', ');
        box.style.display = 'block';
    } else {
        box.style.display = 'none';
    }

    resetBtn?.addEventListener('click', () => {
        localStorage.removeItem('mietauswahl');
        box.style.display = 'none';
        alert('🗑️ Ihre Auswahl wurde gelöscht.');
    });
}
// --- Ende: Skripte spezifisch für das Buchungsformular ---