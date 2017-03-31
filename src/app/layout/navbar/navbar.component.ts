import { globalVars } from '../../shared/global.service';
import { Router } from '@angular/router';
import { Component, Output, EventEmitter, Renderer, ElementRef } from '@angular/core';
import { AngularFire } from 'angularfire2'

@Component({
  selector: '[navbar]',
  templateUrl: './navbar.template.html'
})
export class Navbar {
  @Output() changeSidebarPosition = new EventEmitter();
  @Output() changeSidebarDisplay = new EventEmitter();
  @Output() openSidebar = new EventEmitter();

  display: string = 'Left';
  radioModel: string = 'Left';
  searchFormState: boolean = true;
  settings: any = {
    isOpen: false
  };

  project: any = {
    isSelected: false,
    name: null,
    key: null
  }

  projectMenu: any[]

  constructor(
    private renderer: Renderer,
    private el: ElementRef,
    private af: AngularFire,
    private router: Router,
    public vars: globalVars) {

  }

  logout() {
    this.af.auth.logout()
      .then(success => {
        this.router.navigate(['login']);
      })
      .catch(error => {
        console.log("Error", error)
      })

  }

  sidebarPosition(position): void {
    this.changeSidebarPosition.emit(position);
  }

  sidebarDisplay(position): void {
    this.changeSidebarDisplay.emit(position);
  }

  sidebarOpen(): void {
    this.openSidebar.emit();
  }

  searchFormOpen(): void {
    if (this.searchFormState) {
      this.changeStyleElement('#search-form', 'height', '40px');
      this.changeStyleElement('.notifications ', 'top', '86px');
    } else {
      this.changeStyleElement('#search-form', 'height', '0px');
      this.changeStyleElement('.notifications ', 'top', '46px');
    }
    this.searchFormState = !this.searchFormState;
  }

  private changeStyleElement(selector, styleName, styleValue): void {
    this.renderer.setElementStyle(this.el.nativeElement
      .querySelector(selector), styleName, styleValue);
  }
}
