export function iniciarBloque2(onFinalizar, onSumarPuntos) {
    const contenedor = document.getElementById('cards-container'); // Reutilizamos tu contenedor
    const dropZone = document.getElementById('drop-zone');
    const btnVerificar = document.getElementById('btn-verificar');

    // Ocultamos elementos del Bloque 1 que no ocupamos
    dropZone.style.display = "none";
    btnVerificar.classList.add('hidden');

    let nivelActual = 1;
    let cartasVolteadas = [];
    let paresEncontrados = 0;

    const todosLosDatos = [
        // Nivel 1
        { id: 1, img: "imgs/bloque02/Isaias profetizando-anuncio.png", nivel: 1 },
        { id: 2, img: "imgs/bloque02/Maria y Jesus.png", nivel: 1 }, // Asegura tener esta ruta
        { id: 3, img: "imgs/bloque02/p.26-Pesebre-vacío.png", nivel: 1 },
        // Nivel 2
        { id: 4, img: "imgs/bloque02/p.26-Pesebre-con-Jesús-y-pesebre-vacío.png", nivel: 2 },
        { id: 5, img: "imgs/bloque02/Reyes_magos.png", nivel: 2 },
        { id: 6, img: "imgs/bloque02/Pastores.jpg", nivel: 2 },
        // Nivel 3
        { id: 7, img: "imgs/bloque02/B1T6_Jesus Maria Jose.jpg", nivel: 3 },
        { id: 8, img: "imgs/bloque02/Jesus nino.jpg", nivel: 3 },
        { id: 9, img: "imgs/bloque02/Buen_pastor.png", nivel: 3 },
        { id: 10, img: "imgs/bloque02/Sagrado_corazon.png", nivel: 3 }
    ];

    function cargarNivel(nivel) {
        contenedor.innerHTML = "";
        paresEncontrados = 0;
        
        // Filtrar imágenes según el nivel (Nivel 3 incluye 1 y 2) 
        const imagenesNivel = todosLosDatos.filter(d => d.nivel <= nivel);
        const mazo = [...imagenesNivel, ...imagenesNivel] // Duplicamos para pares
            .sort(() => Math.random() - 0.5);

        // Ajustar grid según cantidad de cartas
        contenedor.style.display = "grid";
        contenedor.style.gridTemplateColumns = nivel === 1 ? "repeat(3, 1fr)" : "repeat(4, 1fr)";

        mazo.forEach((data, index) => {
            const card = document.createElement('div');
            card.className = 'card-memorama';
            card.dataset.id = data.id;
            card.innerHTML = `
                <div class="card-inner">
                    <div class="card-front">?</div>
                    <div class="card-back"><img src="${data.img}"></div>
                </div>
            `;
            card.onclick = () => voltearCarta(card);
            contenedor.appendChild(card);
        });
    }

    function voltearCarta(card) {
        if (cartasVolteadas.length < 2 && !card.classList.contains('flipped')) {
            card.classList.add('flipped');
            cartasVolteadas.push(card);

            if (cartasVolteadas.length === 2) {
                verificarPar();
            }
        }
    }

    function verificarPar() {
        const [c1, c2] = cartasVolteadas;
        if (c1.dataset.id === c2.dataset.id) {
            paresEncontrados++;
            onSumarPuntos(10);
            cartasVolteadas = [];
            
            // ¿Completó el nivel?
            const totalParesNivel = todosLosDatos.filter(d => d.nivel <= nivelActual).length;
            if (paresEncontrados === totalParesNivel) {
                setTimeout(siguientePaso, 1000);
            }
        } else {
            setTimeout(() => {
                c1.classList.remove('flipped');
                c2.classList.remove('flipped');
                cartasVolteadas = [];
            }, 1000);
        }
    }

    function siguientePaso() {
        if (nivelActual < 3) {
            alert(`¡Nivel ${nivelActual} superado!`);
            nivelActual++;
            cargarNivel(nivelActual);
        } else {
            // Finalización total del bloque 
            dropZone.style.display = "flex"; // Restauramos para el siguiente bloque
            onFinalizar(); 
        }
    }

    cargarNivel(nivelActual);
}