document.addEventListener('DOMContentLoaded', function() {
            const form = document.getElementById('formDocente');
            const successMessage = document.querySelector('.alert-success');
            
            // Si hay mensaje de éxito, limpiar el formulario
            if (successMessage) {
                form.reset();
            }
            
            // También limpiar después de enviar (por si acaso)
            form.addEventListener('submit', function() {
                setTimeout(function() {
                    form.reset();
                }, 100);
            });
        });