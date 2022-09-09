import { COMMA, ENTER } from '@angular/cdk/keycodes'
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core'
import { FormControl } from '@angular/forms'
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete'
import { MatChipInputEvent } from '@angular/material/chips'
import { Observable } from 'rxjs'
import { map, startWith } from 'rxjs/operators'

@Component({
    selector: 'app-chip-list-input',
    templateUrl: './chip-list-input.component.html',
    styleUrls: ['./chip-list-input.component.css']
})
export class ChipListInputComponent implements OnInit {
    readonly SEPARATOR_KEY_CODES = [ENTER, COMMA]

    control = new FormControl('')
    allValues: string[] = []
    filteredValues$: Observable<string[]>
    private allNormalizedValues: string[] = []
    private regex = new RegExp(/\p{Diacritic}/gu)

    @ViewChild('input')
    inputElement: ElementRef<HTMLInputElement>

    @ViewChild('autocomplete')
    autocomplete: MatAutocomplete

    @ViewChild('trigger')
    trigger: MatAutocompleteTrigger

    @Input()
    inputValues: string[] = []

    @Input()
    placeholder = ''

    @Input()
    disabled = false

    @Output()
    inputValuesChange = new EventEmitter<string[]>()

    constructor(private changeDetector: ChangeDetectorRef) { }

    ngOnInit() {
        this.changeDetector.detectChanges()
        
        if (this.disabled) {
            this.control.disable()
        }

        this.filteredValues$ = this.control.valueChanges.pipe(
            startWith(''),
            map(this.filter)
        )
    }

    @Input()
    set autocompleteValues(values: string[] | null) {
        if (values === null) {
            values = []
        }

        this.allValues = values
        this.allNormalizedValues = values.map(value =>
            value.toLocaleLowerCase()
                .normalize('NFD')
                .replace(this.regex, '')
        )
    }

    add(event: MatChipInputEvent) {
        // Whether event was triggered by the user or by autocompletion
        if (this.autocomplete.isOpen) { return }

        const value = (event.value || '').trim()

        if (value) {
            this.inputValues.push(value)
            this.inputValuesChange.next(this.inputValues)
        }

        event.input.value = ''
        this.control.setValue('')
    }

    remove(value: string) {
        const index = this.inputValues.indexOf(value)

        if (index >= 0) {
            this.inputValues.splice(index, 1)
            this.inputValuesChange.next(this.inputValues)
        }
    }

    selected(event: MatAutocompleteSelectedEvent) {
        this.inputValues.push(event.option.viewValue)
        this.inputValuesChange.next(this.inputValues)
        this.inputElement.nativeElement.value = ''
        this.control.setValue('')
    }

    onFocus() {
        // Workaround to open the autocomplete panel when
        // the input is focused
        this.trigger._onChange('')
        this.trigger.openPanel()
    }

    private filter = (value: string | null): string[] => {
        if (value === null) {
            return this.allValues.slice()
        }

        const normalizedValue = this.normalize(value)

        return this.allValues.filter((_, index) =>
            this.allNormalizedValues[index].includes(normalizedValue)
        )
    }

    private normalize(text: string): string {
        return text
            .toLocaleLowerCase()
            .normalize('NFD')
            .replace(this.regex, '')
    }
}
