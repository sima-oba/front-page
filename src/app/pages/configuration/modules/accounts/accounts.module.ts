import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { AccountsRoutingModule } from './accounts-routing.module';
import { AccountsComponent } from './accounts.component';
import { GroupDetailsComponent } from './components/group-details/group-details.component';
import { GroupListComponent } from './components/group-list/group-list.component';
import { GroupsComponent } from './components/groups/groups.component';
import { LoadingComponent } from './components/loading/loading.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UsersComponent } from './components/users/users.component';

@NgModule({
  declarations: [
    UsersComponent,
    GroupsComponent,
    AccountsComponent,
    UserListComponent,
    UserDetailsComponent,
    LoadingComponent,
    GroupListComponent,
    GroupDetailsComponent
  ],
  imports: [
    SharedModule,
    AccountsRoutingModule
  ]
})
export class AccountsModule { }
