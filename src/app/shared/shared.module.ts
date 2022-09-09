import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, MatRippleModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { NgChartsModule } from 'ng2-charts';

import { ChipListInputComponent } from './components/chip-list-input/chip-list-input.component';
import { ConfirmationDialog } from './components/confirmation/confirmation.component';
import { LocationPickerComponent } from './components/location-picker/location-picker.component';
import { MultiSelectComponent } from './components/multi-select/multi-select.component';
import { PageTitleComponent } from './components/page-title/page-title.component';
import { SearchBoxComponent } from './components/search-box/search-box.component';
import { WeatherBarComponent } from './components/weather-bar/weather-bar.component';
import { BytesPipe } from './pipes/bytes.pipe';
import { LoadingPipe } from './pipes/loading.pipe';
import { RelativeTimePipe } from './pipes/relative-time.pipe';

const declarations = [
    WeatherBarComponent,
    PageTitleComponent,
    ConfirmationDialog,
    ChipListInputComponent,
    LocationPickerComponent,
    SearchBoxComponent,
    MultiSelectComponent,
    BytesPipe,
    RelativeTimePipe,
    LoadingPipe
]

const imports = [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatExpansionModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatRadioModule,
    MatSelectModule,
    MatStepperModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatDividerModule,
    MatAutocompleteModule,
    MatListModule,
    MatCardModule,
    MatTabsModule,
    MatSlideToggleModule,
    DragDropModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatTreeModule,
    MatTableModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatMenuModule,
    MatRippleModule,
    NgChartsModule,
    MatSortModule,
    NgxMatFileInputModule
]

@NgModule({
    declarations,
    imports,
    exports: [...declarations, ...imports],
    providers: [
        {
            provide: MAT_DATE_LOCALE,
            useValue: 'pt-BR'
        }
    ]
})
export class SharedModule { }
