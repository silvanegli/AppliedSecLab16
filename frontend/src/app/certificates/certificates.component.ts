import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Certificate } from './certificate.model';
import { CAApiService } from '../ca-api/ca-api.service';
import { CAApiError } from '../ca-api/error-handler.service';
import { User } from '../profile/profile.model';
import { LoginService } from '../ca-api/login.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-certificates',
    templateUrl: './certificates.component.html',
    styleUrls: ['./certificates.component.css']
})
export class CertificatesComponent implements OnInit {
    public certificates: Certificate[] = [];
    public error: string;
    public newCertificateName: string;
    public creatingCertificate: boolean = false;
    public acceptUserInfo: boolean = false;
    public user: User;

    constructor(
        private apiService: CAApiService,
        private loginService: LoginService,
        private router: Router,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.getCertificates();
        this.user = this.loginService.loggedInUser;
        this.route.queryParams.subscribe(params => {
            if (params['status'] == 'userUpdate') {
                this.creatingCertificate = true;
            }
        });
    }

    public onCreateCertificate(): void {
        this.apiService.createCertificate(this.newCertificateName).subscribe(
            () => {
                this.getCertificates();
                this.onCancel();
                this.error = '';

            },
            (error: CAApiError) => {
                this.error = error.detail;
            }
        );
    }

    public onDownload(id: number): void {
        this.apiService.downloadCertificate(id).subscribe(
            (data => window.open(window.URL.createObjectURL(data)))
        );
    }

    public onChangeUserInfo(): void {
        let status = 'userUpdate';
        this.router.navigate(['/profile'], {queryParams: {status: status}});
    }

    public onCancel(): void {
        this.creatingCertificate = false;
        this.acceptUserInfo = false;
        this.newCertificateName = '';
    }

    public onRevokeCertificate(id: number, ind: number): void {
        this.apiService.revokeCertificate(id, this.certificates[ind]).subscribe(
            () => {
                this.getCertificates();
            },
            (error: CAApiError) => this.error = error.detail
        );
    }

    private getCertificates(): void {
        this.certificates = [];
        this.apiService.getCertificates().subscribe(
            (certificates: Certificate[]) => {
                certificates.map(
                    (certificate) => {
                        this.certificates.push(certificate);
                    }
                );
            },
            (error: CAApiError) => this.error = error.detail);
    }
}
