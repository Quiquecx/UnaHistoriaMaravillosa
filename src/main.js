import { iniciarBloque1 } from './bloque01.js';
import { iniciarBloque2 } from './bloque02.js';
import { iniciarBloque3 } from './bloque03.js';

let puntajeTotal = 0;

document.addEventListener('DOMContentLoaded', () => {
    // 1. REFERENCIAS
    const pantallaInicio = document.getElementById('pantalla-inicio');
    const pantallaSelector = document.getElementById('pantalla-selector');
    const escenarioJuego = document.getElementById('escenario-juego');
    
    const btnJugarIntro = document.getElementById('btn-jugar');
    const btnInstrucciones = document.getElementById('btn-instrucciones');
    const btnVolverInicio = document.getElementById('btn-volver-inicio');
    const btnCerrarModal = document.getElementById('btn-cerrar-modal');

    // 2. NAVEGACIÓN BÁSICA (Prueba esto primero)
    btnJugarIntro.onclick = () => {
        console.log("Botón Jugar presionado"); // Revisa la consola (F12)
        pantallaInicio.classList.add('hidden');
        pantallaSelector.classList.remove('hidden');
    };

    btnInstrucciones.onclick = () => {
        mostrarMensajeGlobal(
            "¿Cómo jugar?", 
            "Elige un capítulo en el libro. Dentro de cada nivel, arrastra las imágenes a su lugar correcto y presiona 'Revisar' para ganar puntos."
        );
        // Configuramos el botón del modal para que solo cierre
        btnCerrarModal.onclick = ocultarModal;
    };

    btnVolverInicio.onclick = () => {
        pantallaSelector.classList.add('hidden');
        pantallaInicio.classList.remove('hidden');
    };

    // 3. SELECCIÓN DE BLOQUES
    document.getElementById('selector-b1').onclick = () => cargarBloque(1);
    document.getElementById('selector-b2').onclick = () => cargarBloque(2);
    document.getElementById('selector-b3').onclick = () => cargarBloque(3);

    function cargarBloque(numero) {
        pantallaSelector.classList.add('hidden');
        escenarioJuego.classList.remove('hidden');
        crearMarcadorPuntos();

        if (numero === 1) {
            iniciarFlujoBloque(1, "✨ CAPÍTULO I: LA CREACIÓN ✨", iniciarBloque1);
        } else if (numero === 2) {
            iniciarFlujoBloque(2, "📖 CAPÍTULO II: LA INFANCIA 📖", iniciarBloque2);
        } else if (numero === 3) {
            iniciarFlujoBloque(3, "🌟 CAPÍTULO III: VIDA Y OBRA 🌟", iniciarBloque3);
        }
    }

    function iniciarFlujoBloque(id, titulo, funcionIniciar) {
        mostrarMensajeGlobal(titulo, "Prepárate para comenzar este capítulo maravilloso.");
        
        btnCerrarModal.onclick = () => {
            ocultarModal();
            // Ejecutamos la función que importamos
            funcionIniciar(finalizarBloqueGeneral, sumarPuntos);
        };
    }

    // En main.js
    function finalizarBloqueGeneral() {
        // Este mensaje solo se dispara cuando el bloque llama a onFinalizar()
        mostrarMensajeGlobal("¡Increíble! ✅", "Has ordenado correctamente los días de la Creación. ¡Eres un experto!");
        
        btnCerrarModal.onclick = () => {
            ocultarModal();
            escenarioJuego.classList.add('hidden');
            pantallaSelector.classList.remove('hidden');
            // Aquí podrías desbloquear el siguiente nivel visualmente en el libro
        };
    }

    // --- FUNCIONES DE APOYO ---
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
            // Cambiado a absolute para que se quede dentro del contenedor-mision
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

    // Ajuste de escala
    function ajustarEscala() {
        const baseW = 1024; const baseH = 768;
        const escala = Math.min(window.innerWidth / baseW, window.innerHeight / baseH);
        document.documentElement.style.setProperty('--escala-juego', escala < 1 ? escala * 0.98 : 1);
    }
    window.addEventListener('resize', ajustarEscala);
    ajustarEscala();
});