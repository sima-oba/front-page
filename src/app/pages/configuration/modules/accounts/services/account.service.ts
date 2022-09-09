import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { Group } from '../models/group.model';
import { User } from '../../../../../core/models/user.model';


const PATH = '/auth'

@Injectable({
    providedIn: 'root'
})
export class AccountService {
    private refreshUsers$ = new BehaviorSubject(true)
    users$ = this.refreshUsers$.pipe(
        switchMap(() => this.getUsers())
    )

    private refreshGroups$ = new BehaviorSubject(true)
    groups$ = this.refreshGroups$.pipe(
        switchMap(() => this.getGroups())
    )

    constructor(private client: HttpClient) { }

    getUsers(): Observable<User[]> {
        return this.client.get<User[]>(`${PATH}/users`)
    }

    getUserDetails(userId: string): Observable<User> {
        return this.client.get<User>(`${PATH}/users/${userId}`)
    }

    getAvailableUserGroups(userId: string): Observable<string[]> {
        return this.client.get<string[]>(`${PATH}/users/${userId}/available_groups`)
    }

    getAvailableUserRoles(userId: string): Observable<string[]> {
        return this.client.get<string[]>(`${PATH}/users/${userId}/available_roles`)
    }

    saveUser(user: User): Observable<any> {
        return this.client
            .put(`${PATH}/users/${user?.id}`, user)
            .pipe(this.refreshUsers())
    }

    removeUser(userId: string): Observable<any> {
        return this.client
            .delete(`${PATH}/users/${userId}`)
            .pipe(this.refreshUsers())
    }

    getGroups(): Observable<Group[]> {
        return this.client.get<Group[]>(`${PATH}/groups`)
    }

    getGroupDetails(id: string): Observable<Group> {
        return this.client.get<Group>(`${PATH}/groups/${id}`)
    }

    getAvailableGroupRoles(groupId: string): Observable<string[]> {
        return this.client.get<string[]>(`${PATH}/groups/${groupId}/available_roles`)
    }

    saveGroup(group: Group): Observable<any> {
        let request$: Observable<any>

        if (group.id) {
            request$ = this.client.put(`${PATH}/groups/${group.id}`, group)
        } else {
            request$ = this.client.post(`${PATH}/groups`, group)
        }

        return request$.pipe(this.refreshGroups())
    }

    removeGroup(groupId: string): Observable<any> {
        return this.client
            .delete(`${PATH}/groups/${groupId}`)
            .pipe(this.refreshGroups())
    }

    private refreshUsers = () => {
        return tap(() => this.refreshUsers$.next(true))
    }

    private refreshGroups = () => {
        return tap(() => this.refreshGroups$.next(true))
    }
}
