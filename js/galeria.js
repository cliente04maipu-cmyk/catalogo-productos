// Configuración - ¡NO necesita API!
const RUTA_IMAGENES = 'images/general/';
const RUTA_DETALLES = 'images/detalles/';

// Lista de fotos - DEBES MANTENER ESTA LISTA ACTUALIZADA
const FOTOS_GENERALES = [
    'ga_moneda50c.jpg',
    'ga_moneda50s.jpg'
];

// Mapeo de fotos con sus detalles
const FOTOS_DETALLES = {
 'ga_moneda50c': ['DSC00104_1981_C.JPG','DSC00105_1982_C.JPG','DSC00106_1987_C.JPG','DSC00107_1989_C.JPG','DSC00109_1991_C.JPG','DSC00110_1992_C.JPG','DSC00111_1993_C.JPG','DSC00112_1994_C.JPG','DSC00116_1995_C.JPG',
'DSC00117_1996_C.JPG','DSC00118_1997_C.JPG','DSC00119_1998_C.JPG','DSC00120_1999_C.JPG'],
 'ga_moneda50s': ['DSC00104_1981_S.JPG','DSC00105_1982_S.JPG','DSC00106_1987_S.JPG','DSC00107_1989_S.JPG','DSC00109_1991_S.JPG','DSC00110_1992_S.JPG','DSC00111_1993_S.JPG','DSC00112_1994_S.JPG','DSC00116_1995_S.JPG',
'DSC00117_1996_S.JPG','DSC00118_1997_S.JPG','DSC00119_1998_S.JPG','DSC00120_1999_S.JPG']
};




// Función para obtener el nombre de la foto desde la URL
function getFotoNombreFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('foto');
}

// Cargar la galería principal
function cargarGaleria() {
    const contenedor = document.getElementById('galeria');
    if (!contenedor) return;

    if (FOTOS_GENERALES.length === 0) {
        contenedor.innerHTML = `
            <div class="col-12 text-center">
                <p class="text-muted">No hay fotos disponibles. Agrega imágenes a la carpeta images/general/</p>
            </div>
        `;
        return;
    }

    // Generar las tarjetas de fotos
    const html = FOTOS_GENERALES.map(nombre => {
        const nombreSinExt = nombre.replace(/\.[^/.]+$/, '');
        return `
            <div class="col-6 col-md-4 col-lg-3">
                <div class="card foto-card h-100">
                    <img src="${RUTA_IMAGENES}${nombre}" 
                         class="card-img-top" 
                         alt="${nombre}"
                         loading="lazy"
                         onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23ddd%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22 font-size=%2216%22%3EImagen no encontrada%3C/text%3E%3C/svg%3E'">
                    <div class="card-body text-center">
                        <button class="btn btn-primary btn-sm ver-detalles" 
                                data-foto="${nombre}">
                            Ver detalles (${FOTOS_DETALLES[nombreSinExt]?.length || 0})
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    contenedor.innerHTML = html;

    // Agregar eventos a los botones
    document.querySelectorAll('.ver-detalles').forEach(btn => {
        btn.addEventListener('click', function() {
            const nombreFoto = this.dataset.foto;
            window.location.href = `detalle.html?foto=${encodeURIComponent(nombreFoto)}`;
        });
    });

    // También hacer clic en la imagen
    document.querySelectorAll('.foto-card img').forEach(img => {
        img.addEventListener('click', function() {
            const card = this.closest('.foto-card');
            const btn = card.querySelector('.ver-detalles');
            btn.click();
        });
    });
}

// Cargar los detalles de una foto específica
function cargarDetalles() {
    const contenedor = document.getElementById('detallesGrid');
    const titulo = document.getElementById('tituloFoto');
    if (!contenedor || !titulo) return;

    const nombreFoto = getFotoNombreFromURL();
    
    if (!nombreFoto) {
        contenedor.innerHTML = `
            <div class="col-12 text-center">
                <p class="text-danger">No se especificó ninguna foto</p>
                <a href="index.html" class="btn btn-primary">Volver a la galería</a>
            </div>
        `;
        return;
    }

    // Obtener el nombre sin extensión
    const nombreSinExt = nombreFoto.replace(/\.[^/.]+$/, '');
    titulo.textContent = `📷 Fotos relacionadas con: ${nombreSinExt}`;

    // Obtener los detalles de la foto
    const detalles = FOTOS_DETALLES[nombreSinExt] || [];

    if (detalles.length === 0) {
        contenedor.innerHTML = `
            <div class="col-12 text-center">
                <p class="text-muted">No hay fotos detalle para "${nombreSinExt}"</p>
                <p class="text-muted small">Agrega imágenes en la carpeta images/detalles/${nombreSinExt}/</p>
                <a href="index.html" class="btn btn-primary mt-3">← Volver a la galería</a>
            </div>
        `;
        return;
    }

    // Mostrar las fotos de detalle
    const html = detalles.map(nombre => `
        <div class="col-6 col-md-4 col-lg-3">
            <div class="card foto-detalle-card h-100">
                <img src="${RUTA_DETALLES}${nombreSinExt}/${nombre}" 
                     class="card-img-top" 
                     alt="${nombre}"
                     loading="lazy"
                     onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23ddd%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22 font-size=%2216%22%3EImagen no encontrada%3C/text%3E%3C/svg%3E'">
                <div class="card-body text-center">
                    <p class="card-text small text-muted">${nombre.replace(/\.[^/.]+$/, '')}</p>
                </div>
            </div>
        </div>
    `).join('');

    contenedor.innerHTML = `
        <div class="col-12 text-center mb-4">
            <a href="index.html" class="btn btn-secondary">← Volver a la galería</a>
        </div>
        ${html}
    `;
}

// CSS adicional
const style = document.createElement('style');
style.textContent = `
    .foto-card, .foto-detalle-card {
        cursor: pointer;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        border: none;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        border-radius: 12px;
        overflow: hidden;
    }
    
    .foto-card:hover, .foto-detalle-card:hover {
        transform: scale(1.03);
        box-shadow: 0 4px 16px rgba(0,0,0,0.2);
        z-index: 1;
    }
    
    .foto-card img, .foto-detalle-card img {
        height: 200px;
        object-fit: cover;
        border-radius: 12px 12px 0 0;
    }
    
    .foto-card .card-body, .foto-detalle-card .card-body {
        padding: 10px;
        background: white;
    }
    
    @media (max-width: 576px) {
        .foto-card img, .foto-detalle-card img {
            height: 150px;
        }
    }
`;
document.head.appendChild(style);

// Ejecutar según la página actual
if (document.getElementById('galeria')) {
    cargarGaleria();
}

if (document.getElementById('detallesGrid')) {
    cargarDetalles();
}
