import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.scss'
})
export class SignIn {

  registro = {
    nombre:'',
    apellido:'',
    tipoDocumento:'',
    documento:'',
    email:'',
    telefono:'',
    password:'',
    cursoId:0,
    cursoNombre:'',
    precio:0
  };

  async onSubmit(){

    try{

      const res = await fetch('https://codiplayconest.onrender.com/registro/guardar',{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body: JSON.stringify({
          ...this.registro,
          estadoPago:'pendiente'
        })
      });

      const data = await res.json();

      const params = new URLSearchParams({
        registroId:data.id,
        cursoNombre:this.registro.cursoNombre,
        precio:this.registro.precio.toString(),
        nombre:this.registro.nombre,
        email:this.registro.email,
        telefono:this.registro.telefono
      });

      window.location.href='/pago?'+params.toString();

    }catch(error){
      console.error(error);
    }

  }

}
