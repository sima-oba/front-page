import { Injectable } from '@angular/core';
import { SessionStorageService } from './storages/session-storage.service';


export enum Role {
    ADMIN = 'admin',
    MANAGE_NOTIFICATION = 'manage-notifications',
    MANAGE_OCCURRENCES = 'manage-occurrences',
    MANAGE_USERS = 'manage-users',
    READ_HYDROGRAPHY = 'read-hydrography',
    READ_NOTIFICATIONS = 'read-notifications',
    READ_ORDINANCES = 'read-ordinances',
    READ_PROPERTIES = 'read-properties',
    MANAGE_PROPERTIES = 'manage-properties',
    READ_PROTOCOLS = 'read-protocols',
    READ_RISK = 'read-risk',
    READ_VISITS = 'read-visits',
    READ_WEATHER = 'read-weather',
    READ_OCCURRENCES = 'report-occurrences',
    WRITE_PROPERTIES = 'write-properties',
    WRITE_PROTOCOLS = 'write-protocols',
    WRITE_SICAR = 'write-sicar'
}


@Injectable({providedIn: 'root'})
export class AuthorizationService {
    readonly roles = Role

    constructor(private storage: SessionStorageService) { }

    hasRole(role: Role) {
        const roles = this.storage.usuarioLogado?.effective_roles
        return roles?.includes('admin') || roles?.includes(role)
    }

}