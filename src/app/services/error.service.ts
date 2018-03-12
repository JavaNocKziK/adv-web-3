import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class ErrorService {
    private errorsSource: BehaviorSubject<string[]> = new BehaviorSubject([]);
    public errors = this.errorsSource.asObservable();
    constructor() {}
    public add(message: string) {
        let errors: string[] = this.errorsSource.getValue();
        errors.push(message);
        this.errorsSource.next(errors);
    }
    public clear() {
        this.errorsSource.next([]);
    }
}
