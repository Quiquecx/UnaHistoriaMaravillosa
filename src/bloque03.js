export function iniciarBloque3(onFinalizar, onSumarPuntos, playCorrecto, playError) {
    const dropZone = document.getElementById('drop-zone');
    const cardsContainer = document.getElementById('cards-container');
    const btnVerificar = document.getElementById('btn-verificar');
    
    // VARIABLE PARA CONTROLAR EL AUDIO ACTUAL (Evita que se encimen)
    let audioActual = null;

    const datosVidaJesus = [
        { id: 1, img: "imgs/bloque03/p.53-Jesús-crecía-(todo).png", audio: "sounds/bloque03/voz_b3_01.mp3" },
        { id: 2, img: "imgs/bloque03/Apóstoles-con-Jesús-en-camino.png", audio: "sounds/bloque03/voz_b3_02.mp3" },
        { id: 3, img: "imgs/bloque03/p.56-Milagros-obras-(todo).png", audio: "sounds/bloque03/voz_b3_03.mp3" },
        { id: 4, img: "imgs/bloque03/L9ILT7_JuegoA.png", audio: "sounds/bloque03/voz_b3_04.mp3" },
        { id: 5, img: "imgs/bloque03/L9ILT7_JuegoB.png", audio: "sounds/bloque03/voz_b3_05.mp3" },
        { id: 6, img: "imgs/bloque03/L9ILT7_JuegoC.png", audio: "sounds/bloque03/voz_b3_06.mp3" },
        { id: 7, img: "imgs/bloque03/Pentecostés.png", audio: "sounds/bloque03/voz_b3_07.mp3" },
        { id: 8, img: "imgs/bloque03/p.60 Nombres de Jesús(todo).png", audio: "sounds/bloque03/voz_b3_08.mp3" }
    ];

    // 1. Limpiar e Inicializar
    dropZone.innerHTML = "";
    cardsContainer.innerHTML = "";
    btnVerificar.classList.remove('hidden');
    btnVerificar.style.display = "block";

    // 2. Crear Slots (Pasos 1 al 8)
    datosVidaJesus.forEach(d => {
        const slot = document.createElement('div');
        slot.className = 'slot';
        slot.dataset.id = d.id;
        slot.innerHTML = `
            <span class="slot-number">Paso ${d.id}</span>
            <div class="slot-placeholder">?</div>
        `;
        dropZone.appendChild(slot);
    });

    // 3. Crear Cartas (Mezcladas y solo con imagen)
    [...datosVidaJesus].sort(() => Math.random() - 0.5).forEach(d => {
        const card = document.createElement('div');
        card.className = 'card-foto card-grande'; 
        card.draggable = false; // Bloqueado hasta escuchar audio
        card.dataset.id = d.id;
        
        card.innerHTML = `<img src="${d.img}" alt="Historia">`;
        
        // EVENTO DE CLIC PARA ESCUCHAR VOZ
        card.onclick = () => {
            // Detener cualquier audio que esté sonando
            if (audioActual) {
                audioActual.pause();
                audioActual.currentTime = 0;
            }

            // Reproducir nueva voz
            audioActual = new Audio(d.audio);
            audioActual.play().catch(e => console.warn("Error al reproducir audio:", e));
            
            // Habilitar el arrastre y dar feedback visual
            card.draggable = true;
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
        // Detener voz si el usuario verifica mientras suena
        if (audioActual) audioActual.pause();

        let aciertos = 0;
        const slotsParaValidar = document.querySelectorAll('.slot');
        
        slotsParaValidar.forEach(slot => {
            const card = slot.querySelector('.card-foto');
            if (card) {
                if (String(card.dataset.id) === String(slot.dataset.id)) {
                    aciertos++;
                    slot.style.border = "4px solid var(--verde-exito)";
                } else {
                    slot.style.border = "4px solid var(--rojo-primaria)";
                }
            }
        });

        if (aciertos === datosVidaJesus.length) {
            btnNuevo.style.pointerEvents = "none";
            playCorrecto(); // Sonido desde main.js
            onSumarPuntos(100);
            setTimeout(() => {
                btnNuevo.classList.add('hidden');
                onFinalizar(); 
            }, 600);
        } else {
            playError(); // Sonido desde main.js
            alert(`Llevas ${aciertos} de ${datosVidaJesus.length} correctas.`);
        }
    });
}