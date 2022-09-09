import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {CommonModel} from './common-model';
import {Observable} from 'rxjs';
import {CommonResponse} from './common-response';
import {catchError, map} from 'rxjs/operators';
import {AppUtils} from '../../helpers/app-utils';
import {environment} from "../../../environments/environment";
import Swal from 'sweetalert2'

@Injectable({providedIn: 'root'})
export abstract class CommonService<T> {
  public static readonly BACKEND_URLBASE = environment.baseUrl;

  protected constructor(protected http: HttpClient) { }

  public abstract getServerPath(): string;

  protected save(bean: CommonModel): Observable<T> {
    const baseUrl = `${CommonService.BACKEND_URLBASE}/${this.getServerPath()}`;
    return this.http.post<CommonResponse>(baseUrl, bean).pipe(
      map((response: CommonResponse) => {
          if(response._id) {
            console.log('O item foi salvo com sucesso.', 'Tudo certo!');
            return response as any as T;
          }

          return null;
      }),
      catchError((response: HttpErrorResponse) => {
        return AppUtils.handlerHttpError(response);
      })
    )
  }

  protected saveAll(beans: Array<CommonModel>): Observable<Array<T>> {
    const baseUrl = `${CommonService.BACKEND_URLBASE}/${this.getServerPath()}/collection`;
    return this.http.post<CommonResponse>(baseUrl, beans).pipe(
      map((response: CommonResponse) => {
        if(response._id) { return response as any as Array<T>; }
        return null;
      }),
      catchError((response: HttpErrorResponse) => { return AppUtils.handlerHttpError(response); })
    );
  }

  protected update(id: string, bean: CommonModel): Observable<T> {
    const baseUrl = `${CommonService.BACKEND_URLBASE}/${this.getServerPath()}`;
    return this.http.put<CommonResponse>(baseUrl, bean).pipe(
      map((response: CommonResponse) => {
        if(response._id) {
          console.log('O item foi atualizado com sucesso.', 'Tudo certo!');
          return response as any as T;
        }
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Fatores e Constantes atualizados com sucesso!',
          showConfirmButton: false,
          timer: 2500
        })
        return null;
      }),
      catchError((response: HttpErrorResponse) => {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Ocorreu um erro ao tentar salvar as alteracoes, tente novamente...',
          showConfirmButton: false,
          timer: 2500
        })
        return AppUtils.handlerHttpError(response);
      })
    );
  }

  protected delete(id: string): Observable<any> {
    const baseUrl = `${CommonService.BACKEND_URLBASE}/${this.getServerPath()}/${id}`;
    return this.http.delete<CommonResponse>(baseUrl).pipe(
      map((response: CommonResponse) => {
        console.log('O item foi removido com sucesso.', 'Tudo certo!');
        return true;
      }),
      catchError((response: HttpErrorResponse) => {
        return AppUtils.handlerHttpError(response);
      })
    );
  }

  protected findAll(): Observable<Array<T>> {
    const baseUrl = `${CommonService.BACKEND_URLBASE}/${this.getServerPath()}`;
    return this.http.get<CommonResponse>(baseUrl).pipe(
      map((response: any) => {
        if(response) { return response as Array<T>; }
        return null;
      }),
      catchError((response: HttpErrorResponse) => {
        return AppUtils.handlerHttpError(response);
      })
    );
  }

  protected findOne(id: string): Observable<T> {
    const baseUrl = `${CommonService.BACKEND_URLBASE}/${this.getServerPath()}/${id}`;
    return this.http.get<CommonResponse>(baseUrl).pipe(
      map((response: CommonResponse) => {
        if(response) return response as any;
        return null;
      }),
      catchError((response: HttpErrorResponse) => {
        return AppUtils.handlerHttpError(response);
      })
    );
  }

  public async loadAll(): Promise<Array<T>> {
    return await this.findAll().toPromise();
  }

  public async loadById(id: string): Promise<T> {
    return await this.findOne(id).toPromise();
  }

  public async removeById(id: string): Promise<any> {
    return await this.delete(id).toPromise();
  }

  public async add(bean: CommonModel): Promise<T> {
    return await this.save(bean).toPromise();
  }

  public async addAll(beans: Array<CommonModel>): Promise<Array<T>> {
    return await this.saveAll(beans).toPromise();
  }

  public async refresh(id: string, bean: CommonModel): Promise<T> {
    return await this.update(id, bean).toPromise();
  }
}
