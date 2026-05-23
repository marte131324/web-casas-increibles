/**
 * ============================================================================
 * DOMAIN LOCK & ANTI-CLONE SYSTEM | TREZE LABS
 * ============================================================================
 * Previene el robo, clonación o uso no autorizado del código fuente en otros
 * dominios, entornos locales o mediante iframes maliciosos.
 */

(function() {
    const ALLOWED_DOMAINS = [
        "web-casas-increibles.vercel.app",
        "casasincreibles.com.mx",
        "www.casasincreibles.com.mx",
        "localhost",
        "127.0.0.1"
    ];
    
    const currentDomain = window.location.hostname;
    let isAuthorized = false;

    for (let i = 0; i < ALLOWED_DOMAINS.length; i++) {
        if (currentDomain === ALLOWED_DOMAINS[i] || currentDomain.endsWith("." + ALLOWED_DOMAINS[i])) {
            isAuthorized = true;
            break;
        }
    }

    if (!isAuthorized && currentDomain !== "") {
        document.body.innerHTML = `
            <div style="height: 100vh; width: 100vw; background: #060c1c; color: white; display: flex; flex-direction: column; justify-content: center; align-items: center; font-family: sans-serif; text-align: center; padding: 20px;">
                <h1 style="color: #ef4444; font-size: 2rem; margin-bottom: 10px;">⚠️ ALERTA DE SEGURIDAD</h1>
                <p style="font-size: 1rem; color: #a0a8b8; max-width: 500px;">
                    Este sistema digital es propiedad intelectual exclusiva protegida. El dominio actual (<strong>${currentDomain}</strong>) no está autorizado para ejecutar este código.
                </p>
                <br>
                <p style="font-size: 0.8rem; color: #6b7280;">Protected by Treze Labs - Anti-Clone Protocol</p>
            </div>
        `;
        document.head.innerHTML = "";
        throw new Error("UNAUTHORIZED_DOMAIN_EXECUTION");
    }

    if (window.top !== window.self) {
        window.top.location = window.self.location;
    }

    document.addEventListener('contextmenu', event => event.preventDefault());
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'F12' || e.keyCode === 123) e.preventDefault();
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.keyCode === 73)) e.preventDefault();
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'C' || e.key === 'c' || e.keyCode === 67)) e.preventDefault();
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'J' || e.key === 'j' || e.keyCode === 74)) e.preventDefault();
        if ((e.ctrlKey || e.metaKey) && (e.key === 'U' || e.key === 'u' || e.keyCode === 85)) e.preventDefault();
    });

    console.log("%c⚠️ ALTO AHI", "color: red; font-size: 40px; font-weight: bold; text-shadow: 1px 1px 0 black;");
    console.log("%cEste es un entorno asegurado por Treze Labs. Cualquier intento de clonación o manipulación del código fuente queda registrado.", "color: white; font-size: 14px;");

})();
