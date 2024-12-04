import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductoService } from './producto.service';
import { IProductoResponse } from '../model/producto-response';
import { IProductoRequest } from '../model/producto-request';
import { BASE_URL } from '../utils/constants';

describe('ProductoService', () => {
  let service: ProductoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductoService]
    });
    service = TestBed.inject(ProductoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deberia ser creado', () => {
    expect(service).toBeTruthy();
  });

  it('deberia obtener productos', () => {
    const dummyProductos: IProductoResponse[] = [
      { idProducto: 1, descripcion: 'Producto 1', nombre: 'Nombre 1', precioVenta: 10, stock: 100, categoriaNombre: 'Categoria 1', categoriaDescripcion: 'Descripcion 1', nombreProveedor: 'Proveedor 1', imagen: 'imagen1.jpg' },
      { idProducto: 2, descripcion: 'Producto 2', nombre: 'Nombre 2', precioVenta: 20, stock: 200, categoriaNombre: 'Categoria 2', categoriaDescripcion: 'Descripcion 2', nombreProveedor: 'Proveedor 2', imagen: 'imagen2.jpg' }
    ];

    service.getProductos().subscribe(productos => {
      expect(productos.length).toBe(2);
      expect(productos).toEqual(dummyProductos);
    });

    const req = httpMock.expectOne(`${BASE_URL}/producto`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyProductos);
  });

  it('deberia registrar un producto', () => {
    const dummyProductoRequest: IProductoRequest = { idProducto: 1, descripcion: 'Producto 1', nombre: 'Nombre 1', precioVenta: 10, precioCompra: 5, stock: 100, idCategoria: 1, rucProveedor: 123456789, imagen: 'imagen1.jpg' };
    const dummyProductoResponse: IProductoResponse = { idProducto: 1, descripcion: 'Producto 1', nombre: 'Nombre 1', precioVenta: 10, stock: 100, categoriaNombre: 'Categoria 1', categoriaDescripcion: 'Descripcion 1', nombreProveedor: 'Proveedor 1', imagen: 'imagen1.jpg' };

    service.registrarProducto(dummyProductoRequest).subscribe(producto => {
      expect(producto).toEqual(dummyProductoResponse);
    });

    const req = httpMock.expectOne(`${BASE_URL}/producto/insert`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dummyProductoRequest);
    req.flush(dummyProductoResponse);
  });

  it('deberia eliminar un producto', () => {
    const dummyProductoRequest: IProductoRequest = { idProducto: 1, descripcion: 'Producto 1', nombre: 'Nombre 1', precioVenta: 10, precioCompra: 5, stock: 100, idCategoria: 1, rucProveedor: 123456789, imagen: 'imagen1.jpg' };
    const dummyProductoResponse: IProductoResponse = { idProducto: 1, descripcion: 'Producto 1', nombre: 'Nombre 1', precioVenta: 10, stock: 100, categoriaNombre: 'Categoria 1', categoriaDescripcion: 'Descripcion 1', nombreProveedor: 'Proveedor 1', imagen: 'imagen1.jpg' };

    service.eliminarProducto(dummyProductoRequest).subscribe(producto => {
      expect(producto).toEqual(dummyProductoResponse);
    });

    const req = httpMock.expectOne(`${BASE_URL}/producto/delete`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.body).toEqual(dummyProductoRequest);
    req.flush(dummyProductoResponse);
  });
});