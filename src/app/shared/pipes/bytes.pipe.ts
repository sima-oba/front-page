import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'bytes'
})
export class BytesPipe implements PipeTransform {

    transform(bytes: number, unit: 'KB' | 'MB' | 'GB' = 'MB'): number {
        switch (unit) {
            case 'KB':
                return bytes / 1024

            case 'MB':
                return bytes / Math.pow(1024, 2)

            case 'GB':
                return bytes / Math.pow(1024, 3)
        }
    }
}
