import { Injectable } from '@angular/core';
import {  HttpClient }from '@angular/common/http';
import { Observable } from 'rxjs';
import { IClienteResponse } from '../model/cliente-response';
import { BASE_URL } from '../utils/constants';
@Injectable({
  providedIn: 'root'
})
export class ClienteService {
   
  constructor(private http: HttpClient) { }

  getCliente(): Observable<IClienteResponse[]>{
   return this.http.get<IClienteResponse[]>('${BASSE_URL}/cliente');

  
  }
}
