import { iniciarBloque1 } from './bloque01.js';
import { iniciarBloque2 } from './bloque02.js';
import { iniciarBloque3 } from './bloque03.js';

let puntajeTotal = 0;

// 1. PRECARGA DE SONIDOS
const sonidoIntro = new Audio('sounds/intro.mp3');
const sonidoBuena = new Audio('sounds/buena.mp3');
const sonidoMala = new Audio('sounds/mala.mp3');

// Configuración de Volumen (0.0 a 1.0)
sonidoIntro.volume = 0.05; // Volumen bajo para la intro
sonidoBuena.volume = 0.6;
sonidoMala.volume = 0.5;

document.addEventListener('DOMContentLoaded', () => {
    // 2. REFERENCIAS
    const pantallaInicio = document.getElementById('pantalla-inicio');
    const pantallaSelector = document.getElementById('pantalla-selector');
    const escenarioJuego = document.getElementById('escenario-juego');
    
    const btnJugarIntro = document.getElementById('btn-jugar');
    const btnInstrucciones = document.getElementById('btn-instrucciones');
    const btnVolverInicio = document.getElementById('btn-volver-inicio');
    const btnCerrarModal = document.getElementById('btn-cerrar-modal');

    // 3. NAVEGACIÓN BÁSICA
    btnJugarIntro.onclick = () => {
        reproducirIntro(); 
        pantallaInicio.classList.add('hidden');
        pantallaSelector.classList.remove('hidden');
    };

    btnInstrucciones.onclick = () => {
        mostrarMensajeGlobal(
            "¿Cómo jugar?", 
            "Elige un capítulo en el libro. Dentro de cada nivel, arrastra las imágenes a su lugar correcto y presiona 'Revisar' para ganar puntos."
        );
        btnCerrarModal.onclick = ocultarModal;
    };

    btnVolverInicio.onclick = () => {
        detenerIntro(); // Detenemos si vuelve al inicio o si prefieres que siga, quita esta línea
        pantallaSelector.classList.add('hidden');
        pantallaInicio.classList.remove('hidden');
    };

    // 4. SELECCIÓN DE BLOQUES
    document.getElementById('selector-b1').onclick = () => cargarBloque(1);
    document.getElementById('selector-b2').onclick = () => cargarBloque(2);
    document.getElementById('selector-b3').onclick = () => cargarBloque(3);

    function cargarBloque(numero) {
        detenerIntro(); // <--- AQUÍ: Detenemos la música al entrar a cualquier bloque
        
        pantallaSelector.classList.add('hidden');
        escenarioJuego.classList.remove('hidden');
        crearMarcadorPuntos();

        if (numero === 1) {
            iniciarFlujoBloque(1, "✨ Te cuento que... ✨", iniciarBloque1);
        } else if (numero === 2) {
            iniciarFlujoBloque(2, "📖 La historia continúa... 📖", iniciarBloque2);
        } else if (numero === 3) {
            iniciarFlujoBloque(3, "🌟 Y Sigue la historia 🌟", iniciarBloque3);
        }
    }

    function iniciarFlujoBloque(id, titulo, funcionIniciar) {
        mostrarMensajeGlobal(titulo, "Prepárate para comenzar este capítulo maravilloso.");
        
        btnCerrarModal.onclick = () => {
            ocultarModal();
            funcionIniciar(finalizarBloqueGeneral, sumarPuntos, reproducirAcierto, reproducirError);
        };
    }

    function finalizarBloqueGeneral() {
        reproducirAcierto(); 
        mostrarMensajeGlobal("¡Increíble! ✅", "Has completado este desafío con éxito. ¡Sigue así!");
        
        btnCerrarModal.onclick = () => {
            ocultarModal();
            escenarioJuego.classList.add('hidden');
            pantallaSelector.classList.remove('hidden');
        };
    }

    // --- FUNCIONES DE APOYO Y SONIDOS ---
    
    function reproducirIntro() {
        sonidoIntro.currentTime = 0;
        sonidoIntro.loop = true; // Para que no se corte en la pantalla de selección
        sonidoIntro.play().catch(e => console.log("Interacción requerida para audio."));
    }

    function detenerIntro() {
        sonidoIntro.pause();
        sonidoIntro.currentTime = 0; // Reiniciamos el track
    }

    function reproducirAcierto() {
        sonidoBuena.currentTime = 0;
        sonidoBuena.play();
    }

    function reproducirError() {
        sonidoMala.currentTime = 0;
        sonidoMala.play();
    }

    function sumarPuntos(puntos) {
        puntajeTotal += puntos;
        const val = document.getElementById('puntos-val');
        if (val) val.innerText = puntajeTotal;
    }

    function crearMarcadorPuntos() {
        let marcador = document.getElementById('marcador-puntos');
        if (!marcador) {
            marcador = document.createElement('div');
            marcador.id = 'marcador-puntos';
            marcador.style.cssText = "position:absolute; top:20px; right:20px; background:white; padding:10px 20px; border-radius:30px; font-weight:bold; border:3px solid var(--azul-titulo); z-index:100; box-shadow: 0 4px 10px rgba(0,0,0,0.1);";
            marcador.innerHTML = `Puntos: <span id="puntos-val">0</span>`;
            document.getElementById('contenedor-mision').appendChild(marcador);
        }
    }

    function mostrarMensajeGlobal(titulo, texto, final = false) {
        document.getElementById('modal-titulo').innerText = titulo;
        const mTexto = document.getElementById('modal-texto');
        mTexto.innerHTML = final ? `${texto} <br> <b>Total: ${puntajeTotal}</b>` : texto;
        document.getElementById('modal-mensaje').classList.remove('hidden');
    }

    function ocultarModal() {
        document.getElementById('modal-mensaje').classList.add('hidden');
    }

    function ajustarEscala() {
        const baseW = 1024; const baseH = 768;
        const escala = Math.min(window.innerWidth / baseW, window.innerHeight / baseH);
        document.documentElement.style.setProperty('--escala-juego', escala < 1 ? escala * 0.98 : 1);
    }
    window.addEventListener('resize', ajustarEscala);
    ajustarEscala();
});