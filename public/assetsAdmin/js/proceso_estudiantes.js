// Script para el progreso de estudiantes
document.addEventListener('DOMContentLoaded', function() {
    initializeProgressBars();
});

// Función para inicializar las barras de progreso
function initializeProgressBars() {
    const progressBars = document.querySelectorAll(".progress");
    
    if (progressBars.length === 0) {
        console.warn('No se encontraron barras de progreso');
        return;
    }
    
    // Datos de progreso de los estudiantes
    const progressData = [
        { width: "80%", student: "Juan Pérez", course: "HTML" },
        { width: "65%", student: "Ana Gómez", course: "Roblox" },
        { width: "50%", student: "Carlos Martínez", course: "Unity" }
    ];
    
    // Aplicar el progreso a cada barra con animación
    progressBars.forEach((bar, index) => {
        if (index < progressData.length) {
            // Inicializar con 0% para la animación
            bar.style.width = "0%";
            bar.style.transition = "width 1.5s ease-in-out";
            
            // Animar después de un pequeño delay
            setTimeout(() => {
                bar.style.width = progressData[index].width;
            }, index * 200); // Delay escalonado para efecto visual
        }
    });
}

// Función para actualizar el progreso de un estudiante específico
function updateStudentProgress(studentIndex, newProgress) {
    const progressBars = document.querySelectorAll(".progress");
    
    if (studentIndex >= 0 && studentIndex < progressBars.length) {
        const progressBar = progressBars[studentIndex];
        progressBar.style.width = newProgress + "%";
        
        // Actualizar también el texto del label si existe
        const labels = document.querySelectorAll(".label");
        if (labels[studentIndex]) {
            const currentText = labels[studentIndex].textContent;
            const newText = currentText.replace(/\d+%/, newProgress + "%");
            labels[studentIndex].textContent = newText;
        }
    }
}

// Función para obtener el progreso actual de un estudiante
function getStudentProgress(studentIndex) {
    const progressBars = document.querySelectorAll(".progress");
    
    if (studentIndex >= 0 && studentIndex < progressBars.length) {
        const width = progressBars[studentIndex].style.width;
        return parseInt(width) || 0;
    }
    
    return 0;
}


