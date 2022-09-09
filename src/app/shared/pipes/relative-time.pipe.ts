import { Pipe, PipeTransform } from '@angular/core';

const ONE_MINUTE = 60
const ONE_HOUR = 3600
const ONE_DAY = 86400
const MANY_DAYS = 1296000

@Pipe({
    name: 'relativeTime'
})
export class RelativeTimePipe implements PipeTransform {

    transform(value: Date | string): string {
        if (typeof value === 'string') {
            value = new Date(value)
        }

        const diff = (new Date().getTime() - value.getTime()) / 1000

        if (diff < ONE_MINUTE) { return 'Agora mesmo' }
        if (diff < ONE_HOUR) { return `${Math.floor(diff / ONE_MINUTE)} minuto(s) atrás` }
        if (diff < ONE_DAY) { return `${Math.floor(diff / ONE_HOUR)} hora(s) atrás` }
        if (diff < MANY_DAYS) { return `${Math.floor(diff / ONE_DAY)} dia(s) atrás` }

        return '15+ dias atrás'
    }
}
