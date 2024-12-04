import { Component } from '@angular/core';
import { ProductoService } from '../../service/producto.service';
import { IProductoResponse } from '../../model/producto-response';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IProductoRequest } from '../../model/producto-request';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registrar-producto',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, ReactiveFormsModule],
  templateUrl: './registrar-producto.component.html',
  styleUrl: './registrar-producto.component.css'
})
export class RegistrarProductoComponent {
  title = 'Registrar Producto';
  productoArray: IProductoResponse[]=[];
  page:number=1;
  productoForm:FormGroup;
  productoRequest:IProductoRequest={} as IProductoRequest;

  constructor(private productoService:ProductoService){
    this.productoForm = new FormGroup({
      idProducto: new FormControl(''),
      descripcion: new FormControl('', [Validators.required,Validators.minLength(2)]),
      nombre: new FormControl('', [Validators.required,Validators.minLength(2)]),
      precioVenta: new FormControl('1',[Validators.required, Validators.min(1)]),
      precioCompra: new FormControl('1',[Validators.required, Validators.min(1)]),
      stock: new FormControl('1',[Validators.required, Validators.min(1)]),
      idCategoria: new FormControl('',[Validators.required,Validators.minLength(2)]),
      rucProveedor: new FormControl('', [Validators.required,Validators.minLength(2)]),
      imagen: new FormControl('', [Validators.required,Validators.minLength(2)]),
    });
  }
  
  ngOnInit():void{
    this.productoForm.reset();
    //se usaria this.productoForm.controls['idProducto'].setValue(1); en caso se active esa casilla con ese valor
    this.getProductos();
  }
  getProductos():void{
    this.productoService.getProductos().subscribe((result:any)=>{
      console.log('Result',result);
      this.productoArray=result;
      console.log(this.productoArray);
    });
  }
  setProducto():void{
    this.productoRequest.idProducto=this.productoForm.get('idProducto')?.value;
    this.productoRequest.descripcion=this.productoForm.get('descripcion')?.value;
    this.productoRequest.nombre=this.productoForm.get('nombre')?.value;
    this.productoRequest.precioVenta=this.productoForm.get('precioVenta')?.value;
    this.productoRequest.precioCompra=this.productoForm.get('precioCompra')?.value;
    this.productoRequest.stock=this.productoForm.get('stock')?.value;
    this.productoRequest.idCategoria=this.productoForm.get('idCategoria')?.value;
    this.productoRequest.rucProveedor=this.productoForm.get('rucProveedor')?.value;
    this.productoRequest.imagen=this.productoForm.get('imagen')?.value;

  }

  registrarProducto():void{
    console.log('registrando Producto');
    this.setProducto();
    this.productoService.registrarProducto(this.productoRequest).subscribe((result: any)=>{
      console.log('registrarProducto', result),
      this.ngOnInit();
      Swal.close();
      Swal.fire({
        icon:'success',
        title:'registrarProducto....',
        text:'Se registro existosamente el producto',
    });
    },(err:any)=>{
      Swal.close();
      Swal.fire({
        icon:'error',
        title:'Advertencia.....',
        text:'Ah ocurrido un error al registrar Producto',
    });
    }
  );
  }

  editarProducto(productoResponse: IProductoResponse):void{console.log('editando persona');}

  eliminarProducto(productoResponse: IProductoResponse):void{
    console.log('eliminando producto');
    this.productoRequest.idProducto=productoResponse.idProducto;

    Swal.fire({
      title: "Seguro que quiere eliminar este producto?",
      text: "Este proceso no es reversible",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar producto"
    }).then((result) => {
      if (result.isConfirmed) {
        // Realizar la eliminación solo si el usuario confirma
        this.productoService.eliminarProducto(this.productoRequest).subscribe(
          (result: any) => {
            console.log('eliminarProducto', result);
            this.ngOnInit(); // Actualizar la vista
            Swal.fire({
              title: "Eliminado",
              text: "Tu producto fue eliminado",
              icon: "success"
            });
          },
          (err: any) => {
            Swal.fire({
              icon: 'error',
              title: 'Advertencia.....',
              text: 'Ah ocurrido un error al eliminar Producto',
            });
          }
        );
      } else {
        // El usuario canceló la acción
        Swal.fire({
          title: "Cancelled",
          text: "El producto no se eliminó.",
          icon: "info"
        });
      }
    });
    
  }

  

}
