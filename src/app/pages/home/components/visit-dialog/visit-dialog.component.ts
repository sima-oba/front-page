import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

import { Visit } from '../../models/visit.model';
import { VisitService } from '../../services/visit.service';

@Component({
    selector: 'app-visit-dialog',
    templateUrl: './visit-dialog.component.html',
    styleUrls: ['./visit-dialog.component.scss']
})
export class VisitDialogComponent {
    issueDate = new Date()
    visits$ = this.visitService.getVisitDetails(this.visit._id)

    @ViewChild('content')
    content: ElementRef

    constructor(
        @Inject(MAT_DIALOG_DATA) public visit: Visit,
        private visitService: VisitService
    ) { }

    async export() {
        const content = (this.content.nativeElement).cloneNode(true) as HTMLElement
        content.style.backgroundColor = 'transparent'
        content.style.width = '140mm';
        content.style.height = '125mm'

        const table = content
            .querySelector('.content-table')
            .cloneNode(true) as HTMLTableElement

        content.removeChild(content.querySelector('.content-table'))
        content.querySelectorAll('.content-date, .content-info').forEach(element =>
            (element as HTMLElement).style.fontSize = '10pt'
        )

        const doc = new jsPDF('portrait', 'pt', 'a4');
        await doc.html(content, { html2canvas: { width: 147, } })

        autoTable(doc, {
            html: table,
            startY: 280,
            headStyles: {
                halign: 'center',
                valign: 'middle',
                textColor: '#000',
                fillColor: '#a7a7a7'
             }
        })

        window.open(doc.output('bloburl').toString())
    }
}
