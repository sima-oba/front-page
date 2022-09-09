import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthorizationService } from 'src/app/configurations/security/authorization.service';

import { AuthenticationService } from "../../../configurations/authentication/authentication.service";
import { SessionStorageService } from "../../../configurations/security/storages/session-storage.service";
import { DrawerService, DrawerType } from "../../../pages/home/services/drawer.service";
import { ToolsService } from "../../../shared/tools/tools.service";
import { User } from '../../models/user.model';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    usuario: User;

    constructor(
        private drawerService: DrawerService,
        public auth: AuthorizationService,
        public authenticationService: AuthenticationService,
        private storage: SessionStorageService,
        public router: Router,
        public tools: ToolsService
    ) { }

    ngOnInit(): void {
        const timer = 1;
        
        setInterval(() => {
            this.usuario = this.storage.usuarioLogado;
        }, 1000);
    }

    getUsuario(): any {
        return this.usuario;
    }

    openDrawer(type: DrawerType) {
        this.drawerService.openDrawer(type)
    }

    doLogoff(): any {
        this.tools.storageService.refresh();
        const nav = this.router.navigate(['/login/sign-in']);

        /*  this.authenticationService.doLogoff({username: login, password: this.storage.usuarioLogado.username} as AuthenticationRequest).then((result) => {
              this.storage.refresh();
          });
      }*/

    }

}
