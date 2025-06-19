import './style.css';
import { submitRaumAnfrage } from './submitRaumAnfrage.js';

// Formular-Event-Listener
const form = document.getElementById('raum-form');
const submitButton = form?.querySelector('button[type="submit"]'); // Den Submit-Button abrufen

if (form && submitButton) { // Sicherstellen, dass Formular und Button existieren
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Button deaktivieren und Text ändern, um Mehrfachklicks zu verhindern
        submitButton.disabled = true;
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Sende Anfrage...';
        submitButton.classList.add('opacity-75', 'cursor-not-allowed'); // Visuelles Feedback für Deaktivierung

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

            if (success) {
                alert('✅ Buchungsanfrage erfolgreich gesendet! Wir melden uns in Kürze bei Ihnen.');
                form.reset();
                localStorage.removeItem('mietauswahl'); // Auswahl nach erfolgreicher Buchung löschen
                // Verstecke die Auswahl-Box, falls sie sichtbar ist
                const box = document.getElementById('auswahlBuchung');
                if (box) {
                    box.style.display = 'none';
                }
            } else {
                alert('❌ Es gab ein Problem beim Absenden Ihrer Anfrage. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt.');
            }
        } catch (error) {
            console.error("Fehler beim Senden der Anfrage:", error);
            alert('❌ Es ist ein unerwarteter Fehler aufgetreten. Bitte versuchen Sie es später erneut.');
        } finally {
            // 3. Button wieder aktivieren und ursprünglichen Text wiederherstellen
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
            submitButton.classList.remove('opacity-75', 'cursor-not-allowed');
        }
    });

    // Code für die Mietauswahl anzeigen und löschen (wie zuvor)
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

    // Mobile Menü Toggle (wie zuvor)
    const toggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('mobile-menu');
    toggle?.addEventListener('click', () => {
        menu.classList.toggle('hidden');
    });

    // Mobile Submenu Toggle (wie zuvor)
    const vermietungToggle = document.getElementById('vermietung-toggle');
    const vermietungSubmenu = document.getElementById('vermietung-submenu');

    vermietungToggle?.addEventListener('click', () => {
        vermietungSubmenu.classList.toggle('hidden');
    });

    // Scroll Effect für Navbar (wie zuvor)
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
}