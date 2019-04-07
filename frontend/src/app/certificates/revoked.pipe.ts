import { Pipe, PipeTransform } from '@angular/core';
import { Certificate } from './certificate.model';

@Pipe({
    name: 'state',
    pure: false
})
export class RevokedPipe implements PipeTransform {

    transform(certs: Certificate[], state: string): any {
        if (state == 'revoked') {
            return certs.filter(cert => cert.revoked);
        } else {
            return certs.filter(cert => !cert.revoked);
        }
    }

}
