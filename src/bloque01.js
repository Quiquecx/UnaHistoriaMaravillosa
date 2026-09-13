export function iniciarBloque1(onFinalizar, onSumarPuntos, playCorrecto, playError) {
    const dropZone = document.getElementById('drop-zone');
    const cardsContainer = document.getElementById('cards-container');
    const btnVerificar = document.getElementById('btn-verificar');
    
    // CONTROL DE AUDIO ACTUAL
    let audioActual = null;

    // 0. Reproducir audio de indicaciones al iniciar el nivel
    audioActual = new Audio("sounds/bloque01/indicaciones_nivel_01.mp3");
    audioActual.play().catch(() => {});

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
            <div class="slot-placeholder">?</div>
            <div class="slot-feedback"></div>
            <span class="slot-number-footer">${d.día}</span>
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
        
        card.onclick = () => {
            if (audioActual) {
                audioActual.pause();
                audioActual.currentTime = 0;
            }

            audioActual = new Audio(d.audio);
            audioActual.play();
            
            card.draggable = true;
            card.style.border = "3px solid var(--azul-titulo)";
            card.classList.add('activada');
        };

        card.addEventListener('dragstart', () => card.classList.add('dragging'));
        card.addEventListener('dragend', () => card.classList.remove('dragging'));
        cardsContainer.appendChild(card);
    });

    // 4. Lógica Drag & Drop con VALIDACIÓN E INCORPORACIÓN DE AUDIO EN TIEMPO REAL
    const manejarDrop = (e, target) => {
        e.preventDefault();
        const dragging = document.querySelector('.dragging');
        if (!dragging) return;

        if (target.classList.contains('slot')) {
            const placeholder = target.querySelector('.slot-placeholder');
            const feedback = target.querySelector('.slot-feedback');
            const existingCard = target.querySelector('.card-foto');

            if (existingCard) cardsContainer.appendChild(existingCard);
            
            placeholder.style.display = 'none';
            target.appendChild(dragging);

            // Validar de inmediato al colocar la carta
            const esCorrecto = String(dragging.dataset.day) === String(target.dataset.day);

            if (esCorrecto) {
                target.classList.remove('slot-incorrecto');
                target.classList.add('slot-correcto');
                feedback.innerHTML = "✔";
                playCorrecto(); // Audio de éxito inmediato
            } else {
                target.classList.remove('slot-correcto');
                target.classList.add('slot-incorrecto');
                feedback.innerHTML = "✖";
                playError(); // Audio de error inmediato
            }

        } else if (target === cardsContainer) {
            const parent = dragging.parentElement;
            if (parent && parent.classList.contains('slot')) {
                parent.querySelector('.slot-placeholder').style.display = 'block';
                parent.querySelector('.slot-feedback').innerHTML = "";
                parent.classList.remove('slot-correcto', 'slot-incorrecto');
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

    // 5. Botón Verificar (Comprueba si completó los 7 slots correctamente)
    const btnNuevo = btnVerificar.cloneNode(true);
    btnVerificar.parentNode.replaceChild(btnNuevo, btnVerificar);

    btnNuevo.addEventListener('click', () => {
        if (audioActual) {
            audioActual.pause();
        }

        let aciertos = 0;
        const slots = document.querySelectorAll('.slot');
        
        slots.forEach(slot => {
            const card = slot.querySelector('.card-foto');
            if (card && String(card.dataset.day) === String(slot.dataset.day)) {
                aciertos++;
            }
        });

        if (aciertos === 7) {
            playCorrecto();
            onSumarPuntos(70);
            setTimeout(() => {
                btnNuevo.classList.add('hidden');
                onFinalizar(); 
            }, 800);
        } else {
            playError();
            alert("Aún hay espacios vacíos o imágenes en el orden equivocado.");
        }
    });
}