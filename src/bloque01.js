export function iniciarBloque1(onFinalizar, onSumarPuntos) {
    const dropZone = document.getElementById('drop-zone');
    const cardsContainer = document.getElementById('cards-container');
    const btnVerificar = document.getElementById('btn-verificar');
    
    // Mapeo de datos con las rutas de tus archivos locales
    const datosCreacion = [
        { día: 1, img: "imgs/bloque01/B1T2_dia y noche.png", desc: "Día y Noche" },
        { día: 2, img: "imgs/bloque01/B1T2_Cielo.png", desc: "El Cielo" },
        { día: 3, img: "imgs/bloque01/B1T2_plantas.png", desc: "Tierra y Plantas" },
        { día: 4, img: "imgs/bloque01/4B1T2_Astros.png", desc: "Los Astros" },
        { día: 5, img: "imgs/bloque01/DIA6.png", desc: "Peces y Aves" }, // Nota: Ajustado según tu captura de archivos
        { día: 6, img: "imgs/bloque01/Animales 2.png", desc: "Animales y Hombre" },
        { día: 7, img: "imgs/bloque01/B1T2_Papa Dios.png", desc: "Dios Descansó" }
    ];

    // Limpiar e inicializar
    dropZone.innerHTML = "";
    cardsContainer.innerHTML = "";

    // Crear Slots (Espacios para colocar las fotos)
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

    // Crear Cartas / Fotografías (Mezcladas)
    [...datosCreacion].sort(() => Math.random() - 0.5).forEach(d => {
        const card = document.createElement('div');
        card.className = 'card-foto'; // Clase nueva para estilo de fotografía
        card.draggable = true;
        card.dataset.day = d.día;
        card.innerHTML = `
            <div class="img-wrapper">
                <img src="${d.img}" alt="${d.desc}">
            </div>
            <p>${d.desc}</p>
        `;
        
        card.ondragstart = () => card.classList.add('dragging');
        card.ondragend = () => card.classList.remove('dragging');
        cardsContainer.appendChild(card);
    });

    // Lógica Drag & Drop
    document.querySelectorAll('.slot').forEach(slot => {
        slot.ondragover = (e) => e.preventDefault();
        slot.ondrop = (e) => {
            const dragging = document.querySelector('.dragging');
            
            // Si ya hay una carta en el slot, devolverla al contenedor inferior
            const existingCard = slot.querySelector('.card-foto');
            if (existingCard) {
                cardsContainer.appendChild(existingCard);
            }
            
            // Ocultar el signo de pregunta al soltar la imagen
            slot.querySelector('.slot-placeholder').style.display = 'none';
            slot.appendChild(dragging);
        };
    });

    btnVerificar.onclick = () => {
        let aciertos = 0;
        const slots = document.querySelectorAll('.slot');
        
        slots.forEach(slot => {
            const card = slot.querySelector('.card-foto');
            if (card && parseInt(card.dataset.day) === parseInt(slot.dataset.day)) {
                aciertos++;
                slot.classList.add('success');
                slot.classList.remove('error');
            } else {
                slot.classList.add('error');
                slot.classList.remove('success');
            }
        });

        if (aciertos === 7) {
            onSumarPuntos(70);
            onFinalizar();
        } else {
            // Animación o mensaje discreto en lugar de alert pesado
            console.log(`Aciertos: ${aciertos}/7`);
        }
    };
}