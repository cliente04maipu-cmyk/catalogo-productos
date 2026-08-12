// Configuración
const RUTA_IMAGENES = 'images/general/';
const RUTA_DETALLES = 'images/detalles/';

// Lista de fotos - DEBES MANTENER ESTA LISTA ACTUALIZADA
const FOTOS_GENERALES = [
    'playa.jpg',
    'montaña.jpg',
    'ciudad.jpg'
];

// Mapeo de fotos con sus detalles
const FOTOS_DETALLES = {
    'playa': ['DSC00133_1999_S.JPG', 'DSC00132_1998_S.JPG', 'DSC00131_1997_S.JPG'],
    'montaña': ['DSC00130_1996_S.JPG', 'DSC00129_1995_S.JPG'],
    'ciudad': ['DSC00128_1994_S.JPG']
};

// ============ NUEVA FUNCIÓN DE ZOOM ============
function abrirZoom(src, titulo = '') {
    const modal = new bootstrap.Modal(document.getElementById('zoomModal'));
    const imagen = document.getElementById('imagenZoom');
    const info = document.getElementById('infoZoom');
    
    imagen.src = src;
    info.textContent = titulo;
    
    // Manejar error de carga
    imagen.onerror = function() {
        this.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22500%22 height=%22500%22%3E%3Crect fill=%22%23333%22 width=%22500%22 height=%22500%22/%3E%3Ctext x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22 font-size=%2220%22%3EImagen no disponible%3C/text%3E%3C/svg%3E';
        info.textContent = 'Imagen no disponible';
    };
    
    modal.show();
}

// Cerrar modal con tecla ESC (ya funciona por defecto con Bootstrap)

// ============ FUNCIONES EXISTENTES MODIFICADAS ============

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
                        <button class="btn btn-primary btn-sm ver-detalles" data-foto="${nombre}">
                            Ver detalles (${FOTOS_DETALLES[nombreSinExt]?.length || 0})
                        </button>
                        <button class="btn btn-outline-secondary btn-sm ms-1 ver-zoom" 
                                data-src="${RUTA_IMAGENES}${nombre}"
                                data-titulo="${nombre}">
                            🔍
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    contenedor.innerHTML = html;

    // Eventos para ver detalles
    document.querySelectorAll('.ver-detalles').forEach(btn => {
        btn.addEventListener('click', function() {
            const nombreFoto = this.dataset.foto;
            window.location.href = `detalle.html?foto=${encodeURIComponent(nombreFoto)}`;
        });
    });

    // NUEVO: Eventos para zoom en la galería principal
    document.querySelectorAll('.ver-zoom').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const src = this.dataset.src;
            const titulo = this.dataset.titulo;
            abrirZoom(src, titulo);
        });
    });

    // Click en la imagen también abre zoom
    document.querySelectorAll('.foto-card img').forEach(img => {
        img.addEventListener('click', function() {
            const card = this.closest('.foto-card');
            const zoomBtn = card.querySelector('.ver-zoom');
            zoomBtn.click();
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

    const nombreSinExt = nombreFoto.replace(/\.[^/.]+$/, '');
    titulo.textContent = `📷 Fotos relacionadas con: ${nombreSinExt}`;

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

    const html = detalles.map(nombre => {
        const rutaCompleta = `${RUTA_DETALLES}${nombreSinExt}/${nombre}`;
        return `
            <div class="col-6 col-md-4 col-lg-3">
                <div class="card foto-detalle-card h-100">
                    <img src="${rutaCompleta}" 
                         class="card-img-top" 
                         alt="${nombre}"
                         loading="lazy"
                         onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23ddd%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22 font-size=%2216%22%3EImagen no encontrada%3C/text%3E%3C/svg%3E'">
                    <div class="card-body text-center">
                        <p class="card-text small text-muted">${nombre.replace(/\.[^/.]+$/, '')}</p>
                        <button class="btn btn-primary btn-sm ver-zoom-detalle" 
                                data-src="${rutaCompleta}"
                                data-titulo="${nombre}">
                            🔍 Ampliar
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    contenedor.innerHTML = `
        <div class="col-12 text-center mb-4">
            <a href="index.html" class="btn btn-secondary">← Volver a la galería</a>
        </div>
        ${html}
    `;

    // NUEVO: Eventos para zoom en los detalles
    document.querySelectorAll('.ver-zoom-detalle').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const src = this.dataset.src;
            const titulo = this.dataset.titulo;
            abrirZoom(src, titulo);
        });
    });

    // Click en la imagen de detalle también abre zoom
    document.querySelectorAll('.foto-detalle-card img').forEach(img => {
        img.addEventListener('click', function() {
            const card = this.closest('.foto-detalle-card');
            const zoomBtn = card.querySelector('.ver-zoom-detalle');
            zoomBtn.click();
        });
    });
}

// Función para obtener el nombre de la foto desde la URL
function getFotoNombreFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('foto');
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
    
    /* Estilo para el modal de zoom */
    .modal-content {
        background: transparent;
    }
    
    .modal-body {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 80vh;
    }
    
    .btn-close-white {
        background-color: rgba(0,0,0,0.5);
        border-radius: 50%;
        padding: 12px;
        opacity: 0.8;
        transition: all 0.3s ease;
    }
    
    .btn-close-white:hover {
        opacity: 1;
        transform: scale(1.1);
        background-color: rgba(0,0,0,0.7);
    }
    
    .modal-backdrop {
        background-color: rgba(0,0,0,0.9);
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