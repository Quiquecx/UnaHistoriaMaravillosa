export function iniciarBloque3(onFinalizar, onSumarPuntos) {
    const dropZone = document.getElementById('drop-zone');
    const cardsContainer = document.getElementById('cards-container');
    const btnVerificar = document.getElementById('btn-verificar');
    
    // DATOS CORREGIDOS SEGÚN EL DOCUMENTO Y TUS INDICACIONES
    const datosVidaJesus = [
        { id: 1, img: "imgs/bloque03/p.53-Jesús-crecía-(todo).png", desc: "Crecer en sabiduría y gracia significa aprender cada dia, hacer preguntas y acercarme más a Dios, siguiendo el ejemplo de Jesús." },
        { id: 2, img: "imgs/bloque03/Apóstoles-con-Jesús-en-camino.png", desc: "Jesús llama mirando lo bueno de cada persona." },
        { id: 3, img: "imgs/bloque03/p.56-Milagros-obras-(todo).png", desc: "Jesús realizo milagros para manifestar el amor de Dios y fortalecer la comunidad." },
        { id: 4, img: "imgs/bloque03/L9ILT7_JuegoA.png", desc: "En la ultima cena, Jesús se queda en el vino y el pan." },
        { id: 5, img: "imgs/bloque03/L9ILT7_JuegoB.png", desc: "Jesús murió en la Cruz oara darnos vida nueva." },
        { id: 6, img: "imgs/bloque03/L9ILT7_JuegoC.png", desc: "¡Jesús esta vivo! Su amor es más fuerte que la muerte y siempre está con nosotros." },
        { id: 7, img: "imgs/bloque03/Pentecostés.png", desc: "El Espíritu Santo nos une como una gran familia de fe y nos llena de alegría." },
        { id: 8, img: "imgs/bloque03/p.60 Nombres de Jesús(todo).png", desc: "Los nombres de jesús nos revela quién es El y cómo se relaciona con nosotros." }
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

    // 3. Crear Cartas (Mezcladas)
    [...datosVidaJesus].sort(() => Math.random() - 0.5).forEach(d => {
        const card = document.createElement('div');
        card.className = 'card-foto';
        card.draggable = true;
        card.dataset.id = d.id;
        card.innerHTML = `
            <img src="${d.img}" alt="Historia">
            <p>${d.desc}</p>
        `;
        
        card.addEventListener('dragstart', () => card.classList.add('dragging'));
        card.addEventListener('dragend', () => card.classList.remove('dragging'));
        cardsContainer.appendChild(card);
    });

    // 4. Lógica de Interacción (Mismo código funcional de tu captura)
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
        let aciertos = 0;
        const slotsParaValidar = document.querySelectorAll('.slot');
        
        slotsParaValidar.forEach(slot => {
            const card = slot.querySelector('.card-foto');
            if (card && String(card.dataset.id) === String(slot.dataset.id)) {
                aciertos++;
                slot.style.border = "4px solid var(--verde-exito)";
                slot.style.backgroundColor = "rgba(76, 175, 80, 0.1)";
            } else if (card) {
                slot.style.border = "4px solid var(--rojo-primaria)";
                slot.style.backgroundColor = "rgba(192, 57, 90, 0.1)";
            }
        });

        if (aciertos === datosVidaJesus.length) {
            btnNuevo.style.pointerEvents = "none";
            onSumarPuntos(100);
            setTimeout(() => {
                btnNuevo.classList.add('hidden');
                onFinalizar(); 
            }, 600);
        } else {
            alert(`Llevas ${aciertos} correctas de ${datosVidaJesus.length}. ¡Sigue intentando!`);
            btnNuevo.animate([
                { transform: 'translateX(0)' },
                { transform: 'translateX(-5px)' },
                { transform: 'translateX(5px)' },
                { transform: 'translateX(0)' }
            ], { duration: 300 });
        }
    });
}