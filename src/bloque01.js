export function iniciarBloque1(onFinalizar, onSumarPuntos) {
    const dropZone = document.getElementById('drop-zone');
    const cardsContainer = document.getElementById('cards-container');
    const btnVerificar = document.getElementById('btn-verificar');
    
    const datosCreacion = [
        { día: 1, img: "imgs/bloque01/B1T2_dia y noche.png", desc: "Día y Noche" },
        { día: 2, img: "imgs/bloque01/B1T2_Cielo.png", desc: "Cielo" },
        { día: 3, img: "imgs/bloque01/B1T2_plantas.png", desc: "Tierra, Plantas y Mar" },
        { día: 4, img: "imgs/bloque01/4B1T2_Astros.png", desc: "Los Astros" },
        { día: 5, img: "imgs/bloque01/DIA6.png", desc: "Animales del Mar y Aves" },
        { día: 6, img: "imgs/bloque01/Animales 2.png", desc: "Animales, Reptiles y Hombre" },
        { día: 7, img: "imgs/bloque01/B1T2_Papa Dios.png", desc: "Dios Descansó" }
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
            <span class="slot-number">Día ${d.día}</span>
            <div class="slot-placeholder">?</div>
        `;
        dropZone.appendChild(slot);
    });

    // 3. Crear Cartas (Mezcladas)
    [...datosCreacion].sort(() => Math.random() - 0.5).forEach(d => {
        const card = document.createElement('div');
        card.className = 'card-foto';
        card.draggable = true;
        card.dataset.day = d.día;
        card.innerHTML = `
            <img src="${d.img}" alt="${d.desc}">
            <p>${d.desc}</p>
        `;
        
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
            target.style.border = "2px solid #eee";
            target.style.background = "#fdfdfd";
            const placeholder = target.querySelector('.slot-placeholder');
            const existingCard = target.querySelector('.card-foto');
            if (existingCard) cardsContainer.appendChild(existingCard);
            placeholder.style.display = 'none';
            target.appendChild(dragging);
        } else if (target === cardsContainer) {
            const parent = dragging.parentElement;
            if (parent && parent.classList.contains('slot')) {
                parent.querySelector('.slot-placeholder').style.display = 'block';
                parent.style.border = "2px solid #eee";
                parent.style.background = "#fdfdfd";
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

    // 5. Verificación con Conteo Detallado
    const btnNuevo = btnVerificar.cloneNode(true);
    btnVerificar.parentNode.replaceChild(btnNuevo, btnVerificar);

    btnNuevo.addEventListener('click', () => {
        let aciertos = 0;
        let errores = 0;
        let vacios = 0;
        const slotsParaValidar = document.querySelectorAll('.slot');
        
        slotsParaValidar.forEach(slot => {
            const card = slot.querySelector('.card-foto');
            
            if (card) {
                if (String(card.dataset.day) === String(slot.dataset.day)) {
                    aciertos++;
                    slot.style.setProperty('border', '4px solid var(--verde-exito)', 'important');
                    slot.style.backgroundColor = "rgba(76, 175, 80, 0.1)";
                } else {
                    errores++;
                    slot.style.setProperty('border', '4px solid var(--rojo-primaria)', 'important');
                    slot.style.backgroundColor = "rgba(192, 57, 90, 0.1)";
                }
            } else {
                vacios++;
                slot.style.setProperty('border', '2px dashed #ccc', 'important');
            }
        });

        if (aciertos === 7) {
            btnNuevo.style.pointerEvents = "none";
            onSumarPuntos(70);
            // El mensaje de "Nivel completado" lo maneja el onFinalizar en el main.js
            setTimeout(() => {
                btnNuevo.classList.add('hidden');
                onFinalizar(); 
            }, 600);
        } else {
            // Feedback de progreso
            let mensaje = `Llevas ${aciertos} bien de 7.`;
            if (errores > 0) mensaje += `\nHay ${errores} en el lugar equivocado.`;
            if (vacios > 0) mensaje += `\nTe faltan ${vacios} imágenes por colocar.`;
            
            alert(mensaje); // Puedes cambiar esto por un modal personalizado
            
            btnNuevo.animate([
                { transform: 'translateX(0)' },
                { transform: 'translateX(-5px)' },
                { transform: 'translateX(5px)' },
                { transform: 'translateX(0)' }
            ], { duration: 300 });
        }
    });
}