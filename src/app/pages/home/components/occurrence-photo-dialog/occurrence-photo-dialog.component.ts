import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-occurrence-photo-dialog',
    templateUrl: './occurrence-photo-dialog.component.html',
    styleUrls: ['./occurrence-photo-dialog.component.scss']
})
export class OccurrencePhotoDialogComponent {

    constructor(@Inject(MAT_DIALOG_DATA) public photoUrl: string) {
        if (!photoUrl) {
            throw Error('Missing photoUrl argument')
        }
    }
}
