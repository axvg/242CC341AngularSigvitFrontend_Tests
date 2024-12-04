import { IProductoResponse } from './../model/producto-response';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_URL } from '../utils/constants';
import { Observable, Observer } from 'rxjs';
import { IProductoRequest } from '../model/producto-request';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  constructor(private http: HttpClient) { }

  getProductos():Observable<IProductoResponse[]>{
    return this.http.get<IProductoResponse[]>(`${BASE_URL}/producto`)
  }
  registrarProducto(producto:IProductoRequest):Observable<IProductoResponse>{
    console.log(producto);
    return this.http.post<IProductoResponse>(`${BASE_URL}/producto/insert`,producto);
  }

  eliminarProducto(producto:IProductoRequest):Observable<IProductoResponse>{
    console.log(producto);
    return this.http.delete<IProductoResponse>(`${BASE_URL}/producto/delete`,{
      body:producto,
  });
  }
}
