import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrarProductoComponent } from './registrar-producto.component';
import { ProductoService } from '../../service/producto.service';
import { IProductoResponse } from '../../model/producto-response';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';

describe('RegistrarProductoComponent', () => {
  let component: RegistrarProductoComponent;
  let fixture: ComponentFixture<RegistrarProductoComponent>;
  let mockProductoService: jasmine.SpyObj<ProductoService>;

  const mockProductos: IProductoResponse[] = [
    {
      idProducto: 1,
      descripcion: 'test descripcion',
      nombre: 'test nombre',
      precioVenta: 100,
      stock: 50,
      categoriaNombre: 'test categoria',
      categoriaDescripcion: 'test descripcion',
      nombreProveedor: 'test proveedor',
      imagen: 'test.jpg'
    }
  ];

  beforeEach(async () => {
    // Create a mock service
    mockProductoService = jasmine.createSpyObj('ProductoService', [
      'getProductos', 
      'registrarProducto', 
      'eliminarProducto'
    ]);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule, 
        RegistrarProductoComponent
      ],
      providers: [
        { provide: ProductoService, useValue: mockProductoService }
      ]
    }).compileComponents();

    mockProductoService.getProductos.and.returnValue(of(mockProductos));

    fixture = TestBed.createComponent(RegistrarProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Validacion del Formulario', () => {
    it('deberia crear un formulario con 8 controles', () => {
      expect(Object.keys(component.productoForm.controls).length).toBe(9);
    });

    it('deberia marcar el formulario como invalido cuando esta vacio', () => {
      component.productoForm.reset();
      expect(component.productoForm.valid).toBeFalsy();
    });

    it('deberia validar los campos requeridos', () => {
      const requiredFields = [
        'descripcion', 'nombre', 'precioVenta', 
        'precioCompra', 'stock', 'idCategoria', 
        'rucProveedor', 'imagen'
      ];

      requiredFields.forEach(field => {
        const control = component.productoForm.get(field);
        control?.setValue('');
        expect(control?.valid).toBeFalsy();
      });
    });

    it('deberia validar la longitud minima de los campos de texto', () => {
      const textFields = ['descripcion', 'nombre', 'idCategoria', 'rucProveedor', 'imagen'];
      
      textFields.forEach(field => {
        const control = component.productoForm.get(field);
        control?.setValue('a'); // demasiado corto
        expect(control?.valid).toBeFalsy();
        
        control?.setValue('valor valido'); // longitud valida
        expect(control?.valid).toBeTruthy();
      });
    });

    it('deberia validar los valores minimos para los campos numericos', () => {
      const numericFields = ['precioVenta', 'precioCompra', 'stock'];
      
      numericFields.forEach(field => {
        const control = component.productoForm.get(field);
        control?.setValue(0); // invalido
        expect(control?.valid).toBeFalsy();
        
        control?.setValue(1); // valido
        expect(control?.valid).toBeTruthy();
      });
    });
  });

  describe('get Productos', () => {
    it('deberia obtener productos al inicializar', () => {
      component.ngOnInit();
      expect(mockProductoService.getProductos).toHaveBeenCalled();
      expect(component.productoArray).toEqual(mockProductos);
    });
  });

  describe('Registro de Productos', () => {
    it('deberia llamar a setProducto antes de registrar', () => {
      spyOn(component, 'setProducto').and.callThrough();
      
      // Llenar el formulario con datos validos
      component.productoForm.setValue({
        idProducto: '1',
        descripcion: 'Producto de Prueba',
        nombre: 'Nombre de Prueba',
        precioVenta: 100,
        precioCompra: 80,
        stock: 50,
        idCategoria: 'CAT1',
        rucProveedor: '12345678901',
        imagen: 'test-image.jpg'
      });

      // Mock de registro exitoso
      mockProductoService.registrarProducto.and.returnValue(of(mockProductos[0]));

      // Spy en Swal
      spyOn(Swal, 'fire');

      component.registrarProducto();

      expect(component.setProducto).toHaveBeenCalled();
      expect(mockProductoService.registrarProducto).toHaveBeenCalled();
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: 'success',
        title: 'registrarProducto....',
        text: 'Se registro existosamente el producto'
      } as any);
    });

    it('deberia manejar el error de registro', () => {
      // Mock de respuesta de error
      mockProductoService.registrarProducto.and.returnValue(
        throwError(() => new Error('Fallo el registro'))
      );

      // Spy en Swal
      spyOn(Swal, 'fire');

      component.productoForm.setValue({
        idProducto: '1',
        descripcion: 'Producto de Prueba',
        nombre: 'Nombre de Prueba',
        precioVenta: 100,
        precioCompra: 80,
        stock: 50,
        idCategoria: 'CAT1',
        rucProveedor: '12345678901',
        imagen: 'test-image.jpg'
      });

      component.registrarProducto();

      expect(Swal.fire).toHaveBeenCalledWith({
        icon: 'error',
        title: 'Advertencia.....',
        text: 'Ah ocurrido un error al registrar Producto'
      } as  any);
    });
  });

  // describe('Eliminacion de Productos', () => {
  //   it('deberia manejar la confirmacion de eliminacion de producto', () => {
  //     // Mock de eliminacion exitosa
  //     mockProductoService.eliminarProducto.and.returnValue(of(mockProductos[0]));

  //     // Spy en Swal
  //     spyOn(Swal, 'fire').and.callThrough();

  //     // Simular la eliminacion de un producto
  //     component.eliminarProducto(mockProductos[0]);

  //     // Simular la confirmacion del usuario (esto es complicado con Swal, asi que mockearemos el comportamiento)
  //     const confirmSpy = spyOn(Swal, 'fire').and.callFake((config: any) => {
  //       if (config.title.includes('Seguro que quiere eliminar')) {
  //         return Promise.resolve({ isConfirmed: true }) as any;
  //       }
  //       return Promise.resolve({}) as any;
  //     });

  //     // Activar la confirmacion
  //     confirmSpy.calls.mostRecent().returnValue.then(() => {
  //       expect(mockProductoService.eliminarProducto).toHaveBeenCalled();
  //       expect(Swal.fire).toHaveBeenCalledWith({
  //         title: 'Eliminado',
  //         text: 'Tu producto fue eliminado',
  //         icon: 'success'
  //       } as any);
  //     });
  //   });

  //   it('deberia manejar la cancelacion de eliminacion de producto', () => {
  //     // Spy en Swal
  //     spyOn(Swal, 'fire').and.callFake((config: any) => {
  //       if (config.title.includes('Seguro que quiere eliminar')) {
  //         return Promise.resolve({ isConfirmed: false }) as any;
  //       }
  //       return Promise.resolve({}) as any;
  //     });

  //     // Simular la eliminacion de un producto
  //     component.eliminarProducto(mockProductos[0]);

  //     // Activar la confirmacion
  //     Swal.fire.calls.mostRecent().returnValue.then(() => {
  //       expect(Swal.fire).toHaveBeenCalledWith({
  //         title: 'Cancelled',
  //         text: 'El producto no se elimino.',
  //         icon: 'info'
  //       } as any);
  //     });
  //   });
  // });
});