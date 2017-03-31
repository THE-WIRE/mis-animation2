import { Component } from '@angular/core';
import { AngularFire, AuthMethods, AuthProviders } from 'angularfire2/index';
import { Router } from '@angular/router'

@Component({
  selector: 'login',
  styleUrls: ['./login.style.scss'],
  templateUrl: './login.template.html',
  host: {
    class: 'login-page app'
  }
})
export class Login {

  private showMessage: boolean = false

  constructor(private af: AngularFire, public router: Router) {
    this.af.auth.subscribe(user => {
      if (user) {
        this.showMessage = true
        this.router.navigate(['app'])
      }
    })
  }

  login(formValues) {
    this.af.auth.login({
      email: formValues.email,
      password: formValues.password
    });
  }
}
