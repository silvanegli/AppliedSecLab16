import { Component, OnInit } from '@angular/core';
import { Certificate } from './certificate.model';
import { CAApiService } from '../ca-api/ca-api.service';
import { CAApiError } from '../ca-api/error-handler.service';

@Component({
    selector: 'app-certificates',
    templateUrl: './certificates.component.html',
    styleUrls: ['./certificates.component.css']
})
export class CertificatesComponent implements OnInit {
    public certificates: Certificate[];
    public revokedCertificates: Certificate[];
    public newCertificate: Certificate;
    public error: string;
    public newCertificateName: string;
    public creatingCertificate: boolean = false;

    constructor(
        private apiService: CAApiService
    ) {
    }

    ngOnInit() {
        this.getCertificates();
        this.getRevokedCertificates()
    }

    public onCreateCertificate(name: string): void {
        this.apiService.createCertificate(name).subscribe(
            () => {
                this.getCertificates();
            },
            (error: CAApiError) => {
                this.error = error.statusText;
            }
        );
    }

    public onRevokeCertificate(id: number): void {
        this.apiService.revokeCertificate(id).subscribe(
            () => ( this.getCertificates(), this.getRevokedCertificates ),
            (error: CAApiError) => this.error = error.statusText
        );
    }

    private getCertificates(): void {
        this.apiService.getCertificates().subscribe(
            (certificates: Certificate[]) => this.certificates = certificates,
            (error: CAApiError) => this.error = error.statusText
        );
    }

    private getRevokedCertificates() {
        this.apiService.getRevokedCertificates().subscribe(
            (certificates: Certificate[]) => this.revokedCertificates = certificates,
            (error: CAApiError) => this.error = error.statusText
        );
    }

}
