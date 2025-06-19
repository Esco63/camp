import './style.css';
import { submitRaumAnfrage } from './submitRaumAnfrage.js';

// Formular-Event-Listener
const form = document.getElementById('raum-form');
const submitButton = form?.querySelector('button[type="submit"]'); // Den Submit-Button abrufen
const formMessage = document.getElementById('form-message'); // Referenz auf das Nachrichtendiv

if (form && submitButton && formMessage) { // Sicherstellen, dass Formular, Button und Nachrichtenfeld existieren
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Button deaktivieren und Text ändern, um Mehrfachklicks zu verhindern
        submitButton.disabled = true;
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Sende Anfrage...';
        submitButton.classList.add('opacity-75', 'cursor-not-allowed'); // Visuelles Feedback für Deaktivierung

        // 2. Sofortige visuelle Bestätigung anzeigen
        // Zuerst alle potentiellen Status-Klassen entfernen
        formMessage.classList.remove('hidden', 'bg-green-100', 'text-green-800', 'bg-red-100', 'text-red-800'); 
        formMessage.classList.add('bg-blue-100', 'text-blue-800'); // Neutrale Farbe für "wird gesendet"
        formMessage.textContent = 'Ihre Anfrage wird gesendet... Bitte warten Sie einen Moment.';
        formMessage.style.display = 'block'; // Sicherstellen, dass es sichtbar ist

        const formData = {
            name: form.name.value,
            email: form.email.value,
            telefonnummer: form.telefonnummer.value,
            datum: new Date(form.datum.value).toISOString(),
            personenanzahl: parseInt(form.personenanzahl.value),
            typ: form.typ.value,
            nachricht: form.nachricht.value
        };

        // Überprüfen, ob mietauswahlFeld existiert und einen Wert hat, bevor es zu FormData hinzugefügt wird
        const mietauswahlFeld = document.getElementById('mietauswahlFeld');
        if (mietauswahlFeld && mietauswahlFeld.value) {
            formData.mietauswahl = mietauswahlFeld.value;
        }

        try {
            const success = await submitRaumAnfrage(formData);

            // Farbe für "wird gesendet" entfernen, bevor neue Farbe gesetzt wird
            formMessage.classList.remove('bg-blue-100', 'text-blue-800'); 

            if (success) {
                formMessage.classList.add('bg-green-100', 'text-green-800'); // Erfolgsfarbe
                formMessage.textContent = '✅ Ihre Buchungsanfrage wurde erfolgreich gesendet! Wir melden uns in Kürze bei Ihnen.';
                form.reset(); // Formular zurücksetzen
                localStorage.removeItem('mietauswahl'); // Auswahl nach erfolgreicher Buchung löschen
                // Verstecke die Auswahl-Box, falls sie sichtbar ist
                const box = document.getElementById('auswahlBuchung');
                if (box) {
                    box.style.display = 'none';
                }
            } else {
                formMessage.classList.add('bg-red-100', 'text-red-800'); // Fehlerfarbe
                formMessage.textContent = '❌ Es gab ein Problem beim Absenden Ihrer Anfrage. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt.';
            }
        } catch (error) {
            console.error("Fehler beim Senden der Anfrage:", error);
            formMessage.classList.remove('bg-blue-100', 'text-blue-800'); // Auch hier Farbe entfernen
            formMessage.classList.add('bg-red-100', 'text-red-800');
            formMessage.textContent = '❌ Es ist ein unerwarteter Fehler aufgetreten. Bitte versuchen Sie es später erneut.';
        } finally {
            // 3. Button wieder aktivieren und ursprünglichen Text wiederherstellen
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
            submitButton.classList.remove('opacity-75', 'cursor-not-allowed');

            // Optional: Nachricht nach einer Zeit ausblenden (z.B. nach 7 Sekunden)
            setTimeout(() => {
                formMessage.style.display = 'none'; // Versteckt das Element
                formMessage.classList.add('hidden'); // Fügt die Tailwind hidden Klasse hinzu
                formMessage.textContent = ''; // Text leeren
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
        alert('🗑️ Ihre Auswahl wurde gelöscht.'); // Freundlichere Meldung
    });
}


// Mobile Menü Toggle
const toggle = document.getElementById('menu-toggle');
const menu = document.getElementById('mobile-menu');
toggle?.addEventListener('click', () => {
    menu.classList.toggle('hidden');
});

// Mobile Submenu Toggle
const vermietungToggle = document.getElementById('vermietung-toggle');
const vermietungSubmenu = document.getElementById('vermietung-submenu');

vermietungToggle?.addEventListener('click', () => {
    vermietungSubmenu.classList.toggle('hidden');
});

// Scroll Effect für Navbar
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    const burger = document.getElementById('menu-toggle');
    const desktopNav = document.querySelector('.nav-links');
    const navLinks = desktopNav?.querySelectorAll('.nav-link') ?? [];

    if (window.scrollY > 50) {
        navbar.classList.add('bg-white', 'shadow-md');
        navbar.classList.remove('bg-transparent');
        burger.classList.remove('text-white');
        burger.classList.add('text-pink-500');
        navLinks.forEach(link => {
            link.classList.remove('text-white');
            link.classList.add('text-gray-900');
        });
    } else {
        navbar.classList.remove('bg-white', 'shadow-md');
        navbar.classList.add('bg-transparent');
        burger.classList.remove('text-pink-500');
        burger.classList.add('text-white');
        navLinks.forEach(link => {
            link.classList.remove('text-gray-900');
            link.classList.add('text-white');
        });
    }
});