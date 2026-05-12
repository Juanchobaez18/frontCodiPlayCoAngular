// Script para el formulario de crear curso
document.addEventListener('DOMContentLoaded', function() {
    const courseForm = document.getElementById('courseForm');
    
    if (courseForm) {
        // Inicializar el sistema de estrellas
        initializeStarRating();
        
        courseForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const courseData = {
                nombre: formData.get('nombreCurso'),
                cupos: formData.get('cupos'),
                docente: formData.get('docente'),
                descripcion: formData.get('descripcion'),
                dificultad: formData.get('dificultad')
            };
            
            // Validar que todos los campos estén completos
            if (validateForm(courseData)) {
                // Aquí se podría enviar los datos al servidor
                showSuccessMessage(courseData);
                
                // Limpiar formulario
                this.reset();
                resetStarRating();
            }
        });
    }
	
	document.addEventListener('DOMContentLoaded', function() {
	    const stars = document.querySelectorAll('.star');
	    const dificultadInput = document.getElementById('dificultad');
	    const difficultyLabel = document.getElementById('difficultyLabel');
	    
	    const difficultyText = {
	        1: 'Muy fácil',
	        2: 'Fácil', 
	        3: 'Intermedio',
	        4: 'Difícil',
	        5: 'Muy difícil'
	    };
	    
	    stars.forEach(star => {
	        star.addEventListener('click', function() {
	            const rating = parseInt(this.getAttribute('data-rating'));
	            dificultadInput.value = rating;
	            difficultyLabel.textContent = difficultyText[rating];
	            
	            stars.forEach(s => {
	                s.style.opacity = parseInt(s.getAttribute('data-rating')) <= rating ? '1' : '0.3';
	            });
	        });
	    });
	    
	    // Establecer valor por defecto
	    dificultadInput.value = 1;
	    difficultyLabel.textContent = difficultyText[1];
	});
});

// Función para inicializar el sistema de estrellas
function initializeStarRating() {
    const stars = document.querySelectorAll('.star');
    const difficultyInput = document.getElementById('dificultad');
    const difficultyLabel = document.getElementById('difficultyLabel');
    
    stars.forEach((star, index) => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            setStarRating(rating);
        });
        
        star.addEventListener('mouseenter', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            highlightStars(rating);
        });
    });
    
    // Limpiar estrellas cuando el mouse salga del contenedor
    const starRating = document.getElementById('starRating');
    starRating.addEventListener('mouseleave', function() {
        const currentRating = parseInt(difficultyInput.value) || 0;
        highlightStars(currentRating);
    });
}

// Función para establecer la calificación de estrellas
function setStarRating(rating) {
    const difficultyInput = document.getElementById('dificultad');
    const difficultyLabel = document.getElementById('difficultyLabel');
    
    difficultyInput.value = rating;
    highlightStars(rating);
    updateDifficultyLabel(rating);
}

// Función para resaltar las estrellas
function highlightStars(rating) {
    const stars = document.querySelectorAll('.star');
    
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

// Función para actualizar la etiqueta de dificultad
function updateDifficultyLabel(rating) {
    const difficultyLabel = document.getElementById('difficultyLabel');
    const difficultyTexts = {
        1: '⭐ Principiante',
        2: '⭐⭐ Básico',
        3: '⭐⭐⭐ Intermedio',
        4: '⭐⭐⭐⭐ Avanzado',
        5: '⭐⭐⭐⭐⭐ Experto'
    };
    
    difficultyLabel.textContent = difficultyTexts[rating] || 'Selecciona la dificultad';
}

// Función para resetear las estrellas
function resetStarRating() {
    const difficultyInput = document.getElementById('dificultad');
    const difficultyLabel = document.getElementById('difficultyLabel');
    
    difficultyInput.value = '';
    highlightStars(0);
    difficultyLabel.textContent = 'Selecciona la dificultad';
}

// Función para validar el formulario
function validateForm(data) {
    const requiredFields = ['nombre', 'cupos', 'docente', 'descripcion', 'dificultad'];
    
    for (let field of requiredFields) {
        if (!data[field] || data[field].trim() === '') {
            alert('Por favor, complete todos los campos requeridos.');
            return false;
        }
    }
    
    // Validar que los cupos sean un número válido
    if (isNaN(data.cupos) || data.cupos < 1 || data.cupos > 50) {
        alert('Los cupos deben ser un número entre 1 y 50.');
        return false;
    }
    
    return true;
}

// Función para mostrar mensaje de éxito
function showSuccessMessage(courseData) {
    const difficultyTexts = {
        1: '⭐ Principiante',
        2: '⭐⭐ Básico',
        3: '⭐⭐⭐ Intermedio',
        4: '⭐⭐⭐⭐ Avanzado',
        5: '⭐⭐⭐⭐⭐ Experto'
    };
    
    const message = `Curso creado exitosamente:
    
Nombre: ${courseData.nombre}
Cupos: ${courseData.cupos}
Docente: ${getDocenteName(courseData.docente)}
Dificultad: ${difficultyTexts[courseData.dificultad] || courseData.dificultad}`;

    alert(message);
}

// Función para obtener el nombre del docente
function getDocenteName(docenteValue) {
    const docentes = {
        'camila-rios': 'Camila Ríos',
        'luis-ortega': 'Luis Ortega',
        'daniela-torres': 'Daniela Torres',
        'carlos-mendez': 'Carlos Méndez'
    };
    
    return docentes[docenteValue] || docenteValue;
}

document.addEventListener('DOMContentLoaded', function() {
    const stars = document.querySelectorAll('.star');
    const dificultadInput = document.getElementById('dificultad');
    const difficultyLabel = document.getElementById('difficultyLabel');
    
    const difficultyText = {
        1: 'Muy fácil',
        2: 'Fácil', 
        3: 'Intermedio',
        4: 'Difícil',
        5: 'Muy difícil'
    };
    
    // Inicializar estrellas
    function initializeStars() {
        stars.forEach(star => {
            star.style.cursor = 'pointer';
            star.style.opacity = '0.3';
        });
        
        // Establecer valor por defecto (1 estrella)
        if (dificultadInput.value === '' || dificultadInput.value === '0') {
            dificultadInput.value = 1;
            difficultyLabel.textContent = difficultyText[1];
            stars[0].style.opacity = '1';
        } else {
            // Si ya hay un valor, mostrar las estrellas correspondientes
            const currentRating = parseInt(dificultadInput.value);
            stars.forEach(star => {
                const starRating = parseInt(star.getAttribute('data-rating'));
                star.style.opacity = starRating <= currentRating ? '1' : '0.3';
            });
            difficultyLabel.textContent = difficultyText[currentRating] || 'Selecciona la dificultad';
        }
    }
    
    // Event listeners para las estrellas
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            dificultadInput.value = rating;
            difficultyLabel.textContent = difficultyText[rating];
            
            // Actualizar apariencia de las estrellas
            stars.forEach(s => {
                const starRating = parseInt(s.getAttribute('data-rating'));
                s.style.opacity = starRating <= rating ? '1' : '0.3';
            });
        });
        
        // Efecto hover opcional
        star.addEventListener('mouseover', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            stars.forEach(s => {
                const starRating = parseInt(s.getAttribute('data-rating'));
                s.style.opacity = starRating <= rating ? '0.7' : '0.3';
            });
        });
        
        star.addEventListener('mouseout', function() {
            const currentRating = parseInt(dificultadInput.value);
            stars.forEach(s => {
                const starRating = parseInt(s.getAttribute('data-rating'));
                s.style.opacity = starRating <= currentRating ? '1' : '0.3';
            });
        });
    });
    
    // Inicializar al cargar la página
    initializeStars();
	document.addEventListener('DOMContentLoaded', function() {
	    const stars = document.querySelectorAll('.star');
	    const dificultadInput = document.getElementById('dificultad');
	    const difficultyLabel = document.getElementById('difficultyLabel');
	    
	    const difficultyText = {
	        1: 'Muy fácil',
	        2: 'Fácil', 
	        3: 'Intermedio',
	        4: 'Difícil',
	        5: 'Muy difícil'
	    };
	    
	    // Inicializar estrellas
	    function initializeStars() {
	        stars.forEach(star => {
	            star.style.cursor = 'pointer';
	            star.addEventListener('click', function() {
	                const rating = parseInt(this.getAttribute('data-rating'));
	                dificultadInput.value = rating;
	                difficultyLabel.textContent = difficultyText[rating];
	                
	                // Actualizar apariencia de las estrellas
	                stars.forEach(s => {
	                    const starRating = parseInt(s.getAttribute('data-rating'));
	                    s.style.opacity = starRating <= rating ? '1' : '0.3';
	                });
	            });
	        });
	        
	        // Establecer valor actual si existe
	        if (dificultadInput.value) {
	            const currentRating = parseInt(dificultadInput.value);
	            difficultyLabel.textContent = difficultyText[currentRating] || 'Selecciona la dificultad';
	        } else {
	            // Valor por defecto para crear curso
	            dificultadInput.value = 1;
	            difficultyLabel.textContent = difficultyText[1];
	            stars[0].style.opacity = '1';
	        }
	    }
	    
	    initializeStars();
	});
});