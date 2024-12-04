import { Component } from '@angular/core';
import { ClienteService } from './../../service/cliente.service';
import { IClienteResponse } from '../../model/cliente-response';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-registrar-cliente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './registrar-cliente.component.html',
  styleUrl: './registrar-cliente.component.css'
})
export class RegistrarClienteComponent {
  clienteArray :IClienteResponse[]=[];
 constructor(private clienteService:ClienteService){}
 ngOnInit():void{
  // this.getcliente();
 
  // getcliente() : void{
  //  this.clienteService.getcliente().subscribe((result:any)=>{
    // console.log('Result',result);
    // this.clienteArray=result;
    // console.log(this.clienteArray);
  //  });
  }
}