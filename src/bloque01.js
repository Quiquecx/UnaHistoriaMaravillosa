export function iniciarBloque1(onFinalizar, onSumarPuntos, playCorrecto, playError) {
    const dropZone = document.getElementById('drop-zone');
    const cardsContainer = document.getElementById('cards-container');
    const btnVerificar = document.getElementById('btn-verificar');
    
    // VARIABLE PARA CONTROLAR EL AUDIO ACTUAL
    let audioActual = null;

    const datosCreacion = [
        { día: 1, img: "imgs/bloque01/L4-p.9-creación.png", audio: "sounds/bloque01/voz_01.mp3" },
        { día: 2, img: "imgs/bloque01/p.12--Abraham-y-amigos-en-camino.png", audio: "sounds/bloque01/voz_02.mp3" },
        { día: 3, img: "imgs/bloque01/p.16-Moisés-con-tablas.png", audio: "sounds/bloque01/voz_03.mp3" },
        { día: 4, img: "imgs/bloque01/Isaias profetizando-anuncio.png", audio: "sounds/bloque01/voz_04.mp3" },
        { día: 5, img: "imgs/bloque01/p.24-Nacimiento.png", audio: "sounds/bloque01/voz_05.mp3" },
        { día: 6, img: "imgs/bloque01/Maria y Jesus.png", audio: "sounds/bloque01/voz_06.mp3" },
        { día: 7, img: "imgs/bloque01/p.30-Jesús-y-papa-Dios.png", audio: "sounds/bloque01/voz_07.mp3" }
    ];

    // 1. Limpiar e Inicializar
    dropZone.innerHTML = "";
    cardsContainer.innerHTML = "";
    btnVerificar.classList.remove('hidden');
    btnVerificar.style.display = "block";

    // 2. Crear Slots
    datosCreacion.forEach(d => {
        const slot = document.createElement('div');
        slot.className = 'slot';
        slot.dataset.day = d.día;
        slot.innerHTML = `
            <span class="slot-number">Paso ${d.día}</span>
            <div class="slot-placeholder">?</div>
        `;
        dropZone.appendChild(slot);
    });

    // 3. Crear Cartas
    [...datosCreacion].sort(() => Math.random() - 0.5).forEach(d => {
        const card = document.createElement('div');
        card.className = 'card-foto card-grande'; 
        card.draggable = false; 
        card.dataset.day = d.día;
        
        card.innerHTML = `<img src="${d.img}" alt="Imagen de la historia">`;
        
        // EVENTO DE CLIC ACTUALIZADO
        card.onclick = () => {
            // Si hay un audio sonando, lo pausamos y reseteamos
            if (audioActual) {
                audioActual.pause();
                audioActual.currentTime = 0;
            }

            // Creamos y reproducimos el nuevo audio
            audioActual = new Audio(d.audio);
            audioActual.play();
            
            // Habilitar interacción
            card.draggable = true;
            card.style.border = "3px solid var(--azul-titulo)";
            card.classList.add('activada');
        };

        card.addEventListener('dragstart', () => card.classList.add('dragging'));
        card.addEventListener('dragend', () => card.classList.remove('dragging'));
        cardsContainer.appendChild(card);
    });

    // 4. Lógica de Interacción (Drag & Drop)
    const manejarDrop = (e, target) => {
        e.preventDefault();
        const dragging = document.querySelector('.dragging');
        if (!dragging) return;

        if (target.classList.contains('slot')) {
            const placeholder = target.querySelector('.slot-placeholder');
            const existingCard = target.querySelector('.card-foto');
            if (existingCard) cardsContainer.appendChild(existingCard);
            placeholder.style.display = 'none';
            target.appendChild(dragging);
        } else if (target === cardsContainer) {
            const parent = dragging.parentElement;
            if (parent && parent.classList.contains('slot')) {
                parent.querySelector('.slot-placeholder').style.display = 'block';
            }
            cardsContainer.appendChild(dragging);
        }
    };

    document.querySelectorAll('.slot').forEach(s => {
        s.addEventListener('dragover', e => e.preventDefault());
        s.addEventListener('drop', e => manejarDrop(e, s));
    });
    cardsContainer.addEventListener('dragover', e => e.preventDefault());
    cardsContainer.addEventListener('drop', e => manejarDrop(e, cardsContainer));

    // 5. Verificación
    const btnNuevo = btnVerificar.cloneNode(true);
    btnVerificar.parentNode.replaceChild(btnNuevo, btnVerificar);

    btnNuevo.addEventListener('click', () => {
        // Detener voz si el niño da clic en verificar mientras suena algo
        if (audioActual) {
            audioActual.pause();
        }

        let aciertos = 0;
        const slotsParaValidar = document.querySelectorAll('.slot');
        
        slotsParaValidar.forEach(slot => {
            const card = slot.querySelector('.card-foto');
            if (card) {
                if (String(card.dataset.day) === String(slot.dataset.day)) {
                    aciertos++;
                    slot.style.border = "4px solid var(--verde-exito)";
                } else {
                    slot.style.border = "4px solid var(--rojo-primaria)";
                }
            }
        });

        if (aciertos === 7) {
            playCorrecto();
            onSumarPuntos(70);
            setTimeout(() => {
                btnNuevo.classList.add('hidden');
                onFinalizar(); 
            }, 600);
        } else {
            playError();
            alert("Sigue intentando, revisa el orden.");
        }
    });
}