import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { AppService } from '../services/app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage = false;
  Array: [
    {
      'nombre': {
        'casa': ''
      }
    }
  ];

  constructor(private fb: FormBuilder, private loginService: LoginService, private appService: AppService, private router: Router) { }

  ngOnInit() {
    this.init();
  }

  init() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      application: [this.appService.idApplication, Validators.required]
    });

    let idUsuario: number = Number(localStorage.getItem('idUsuario'));
    if (idUsuario != undefined || idUsuario != null) {
      if (idUsuario != 0) {
        this.getUsuarioCentralizacion(idUsuario);
      }
    };
  }

  private getUsuarioCentralizacion(idUsuario) {
    const dataUser = {
      idUsuario: idUsuario
    };

    this.loginService.loginUserCentralizacion(dataUser).subscribe(data => {
      try {
        if (data.data.dataUsuario.length > 0) {
          let userData = JSON.parse(data.data.dataUsuario[0].KeyComplement);
          this.loginForm.patchValue({
            email: userData.email,
            password: userData.password
          });
          this.loginUser();
        }
      } catch (error) {
        console.log('error', error)
      }
    });
  };

  loginUser() {
    const loginRequest = {
      credentials: {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      },
      application: this.loginForm.value.application
    };
    this.loginService.loginUser(loginRequest).subscribe(data => {
      localStorage.setItem('app_token', JSON.stringify(data));
      this.loginForm.reset();
      this.router.navigate(['main/dashboard']);
    });
  }
}
