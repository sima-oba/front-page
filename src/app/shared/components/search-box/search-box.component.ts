import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, tap } from 'rxjs/operators';

import { normalizeString } from 'src/app/core/utils/format';

@UntilDestroy()
@Component({
    selector: 'app-search-box',
    templateUrl: './search-box.component.html',
    styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent implements OnInit {
    control = new FormControl('')
    showDeleteButton = false

    @Input()
    text = ''

    @Input()
    placeholder = ''

    @Input()
    normalize = false

    @Input()
    debounce = 0

    @Output()
    textChanges = new EventEmitter<string>()

    @Output()
    deleteClick = new EventEmitter()

    ngOnInit() {
        this.control.valueChanges
            .pipe(
                untilDestroyed(this),
                tap(this.shouldShowDeleteButton),
                debounceTime(this.debounce)
            )
            .subscribe(this.onTextChanges)

        this.control.setValue(this.text)
    }

    private shouldShowDeleteButton = (text: string) => {
        this.showDeleteButton = text.length > 0
    }

    private onTextChanges = (text: string) => {
        text = this.normalize ? normalizeString(text) : text        
        this.textChanges.next(text)
    }

    clear() {
        this.control.setValue('')
        this.deleteClick.next()
    }

}
