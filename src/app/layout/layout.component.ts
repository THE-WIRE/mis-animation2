import { Dashboard } from '../dashboard/dashboard.component';
import { Component, Directive, ElementRef, NgZone, Renderer, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  Router,
  Event as RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from '@angular/router';
import { AngularFire } from 'angularfire2';
import { globalVars } from '../shared/global.service'
import { Project } from '../interfaces/project.model'


@Component({
  selector: 'layout',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './layout.template.html'
})
export class Layout {
  sidebarState: boolean = true;
  @ViewChild('spinnerElement') spinnerElement: ElementRef;
  @ViewChild('routerComponent') routerComponent: ElementRef;

  constructor(
    private el: ElementRef,
    private renderer: Renderer,
    private router: Router,
    private ngZone: NgZone,
    private af: AngularFire,
    public vars: globalVars) {
    router.events.subscribe((event: RouterEvent) => {
      setTimeout(() => {
        this._navigationInterceptor(event);
      });
      console.log("layout2", this.vars);

    });

    this.vars.getVars().subscribe(data => {
      console.log("layout", data);
    })

    this.af.auth.subscribe(user => {
      if (!user) {
        this.router.navigate(['login'])
      }
      else {
        this.af.database.object('Users/' + user.uid + '/isProjectSelected').subscribe(data => {
          console.log(data.$value)
          if (data.$value) {
            console.log("Logged In User", user, vars)
          }
          else {
            console.log("exists", data)
            this.router.navigate(['app/allprojects'])
              .catch(error => console.log(error))
              .then(data => { console.log("data", data) })
          }
        })

      }
    })



  }

  sidebarPosition(position): void {
    let pos = position === 'Right' ? true : false;
    this.renderer.setElementClass(this.el.nativeElement, 'sidebar-on-right', pos);
  }

  sidebarDisplay(display): void {
    let _display = display === 'Hide' ? true : false;
    this.renderer.setElementClass(this.el.nativeElement, 'sidebar-hidden', _display);
  }

  openSidebar(): void {
    let sidebar = document.getElementById('side-nav');
    let sidebarMarginTop = parseInt(window.getComputedStyle(sidebar).marginTop, 10);
    let sidebarMarginBottom = parseInt(window.getComputedStyle(sidebar).marginBottom, 10);
    let sidebarHeight = sidebar.offsetHeight + sidebarMarginTop + sidebarMarginBottom;

    if (this.sidebarState) {
      this.renderer.setElementStyle(this.el.nativeElement
        .querySelector('.content'), 'margin-top', sidebarHeight + 'px');
    } else {
      this.renderer.setElementStyle(this.el.nativeElement
        .querySelector('.content'), 'margin-top', '0px');
    }

    this.sidebarState = !this.sidebarState;
  }

  private _navigationInterceptor(event: RouterEvent): void {

    if (event instanceof NavigationStart) {
      // We wanna run this function outside of Angular's zone to
      // bypass change detection
      this.ngZone.runOutsideAngular(() => {

        // For simplicity we are going to turn opacity on / off
        // you could add/remove a class for more advanced styling
        // and enter/leave animation of the spinner
        this.renderer.setElementStyle(
          this.spinnerElement.nativeElement,
          'display',
          'block'
        );
        this.renderer.setElementStyle(
          this.routerComponent.nativeElement,
          'display',
          'none'
        );
      });
    }
    if (event instanceof NavigationEnd) {
      this._hideSpinner();
    }

    // Set loading state to false in both of the below events to
    // hide the spinner in case a request fails
    if (event instanceof NavigationCancel) {
      this._hideSpinner();
    }
    if (event instanceof NavigationError) {
      this._hideSpinner();
    }
  }

  private _hideSpinner(): void {
    // We wanna run this function outside of Angular's zone to
    // bypass change detection,
    this.ngZone.runOutsideAngular(() => {

      // For simplicity we are going to turn opacity on / off
      // you could add/remove a class for more advanced styling
      // and enter/leave animation of the spinner
      this.renderer.setElementStyle(
        this.spinnerElement.nativeElement,
        'display',
        'none'
      );
      this.renderer.setElementStyle(
        this.routerComponent.nativeElement,
        'display',
        'block'
      );
    });
  }
}
