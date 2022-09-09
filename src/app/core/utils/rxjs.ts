import { MonoTypeOperatorFunction } from "rxjs"
import { filter } from 'rxjs/operators'

export function filterNotNull<T>(): MonoTypeOperatorFunction<T> {
    return filter(value => Boolean(value))
}
