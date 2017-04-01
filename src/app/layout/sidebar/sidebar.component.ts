import { Project } from '../../interfaces/project.model';
import { Observable } from 'rxjs/Rx';
import { globalVars } from '../../shared/global.service';
import { Component, ElementRef, Input, SimpleChange } from '@angular/core';
import { Renderer } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { Dashboard } from '../../dashboard/dashboard.component'
import {Router, Event as RouterEvent } from "@angular/router";

declare let jQuery: any;

@Component({
  selector: '[sidebar]',
  templateUrl: './sidebar.template.html',
  styles: [`
      .hide{ 
          
          opacity: 0;
          
       }
       .show{
          color: #FFFFFF;
      
          -webkit-transition: opacity 4s ease-in-out;
          -moz-transition: opacity 4s ease-in-out;
          -ms-transition: opacity 4s ease-in-out;
          -o-transition: opacity 4s ease-in-out;
           opacity: 1;
       }
  `]
})
export class Sidebar {
  sidebarHeight: number = 0;
  sidebarMenu: any = 0;

  @Input() menu: any
  @Input() varsx: Project;


  private isHidden: boolean = false

  constructor(private renderer: Renderer, private el: ElementRef, private af: AngularFire, public vars: globalVars, public router:Router) {

    // this.af.auth.subscribe(user => {
    //   if (user) {
    //     this.af.database.object('Users/' + user.uid + '/selectedProject').subscribe(data => {
    //       console.log(data)
    //       if (data.$value) {
    //         this.af.database.object('Users/' + user.uid + '/projects/' + data.$value).subscribe(project => {
    //           console.log('project', project)
    //           this.getMenu(project.role)
    //         })
    //       }
    //       else {
    //         this.getMenu('guest')
    //       }
    //     })
    //   }
    // })

    router.events.subscribe((event: RouterEvent) => {
      if(this.varsx != undefined){
        this.getMenu(this.varsx.role)
      }
    })

    console.log("sidebar", this.varsx);

    vars.getVars().subscribe(data => {
      console.log("New data", data)
    })

    this.getMenu(vars.role)
  }

  getMenu(role: string) {
    if (!role) {
      role = 'guest'
    }
    this.af.database.list('Menus/' + role).subscribe(res => {
      console.log(role, res);
      this.menu = res;
      this.isHidden = true;
    })
  }

  ngAfterViewInit() {
    this.sidebarMenu = this.el.nativeElement.querySelector('#side-nav');
    if (window.innerWidth > 768) {
      setTimeout(() => {
        jQuery(this.sidebarMenu).find('.accordion-group.active .accordion-body').collapse('show');
      });
    }
  }

  setSidebarHeight(event) {
    if (window.innerWidth < 768) {
      let sidebarMarginTop = parseInt(
        window.getComputedStyle(this.sidebarMenu).marginTop, 10
      );
      let sidebarMarginBottom = parseInt(
        window.getComputedStyle(this.sidebarMenu).marginBottom, 10
      );
      this.sidebarHeight = this.sidebarMenu.offsetHeight + sidebarMarginTop + sidebarMarginBottom;
      let closestAccordionGroup = event.target.closest('.accordion-group');
      let submenuHeight = 0;
      let submenuItems = closestAccordionGroup.querySelectorAll('ul > li');
      submenuItems.forEach(() => {
        submenuHeight += 26;
      });
      let expandedMenu = closestAccordionGroup
        .querySelector('.accordion-body')
        .getAttribute('aria-expanded');
      if (expandedMenu === 'false') {
        this.sidebarHeight += submenuHeight;
      } else {
        this.sidebarHeight -= submenuHeight;
      }
    }
  }

  collapseSubMenu(event) {
    let currentMenu = event.target
      .closest('.accordion-group')
      .querySelector('.accordion-body');
    let collapsingMenu = this.sidebarMenu
      .querySelector('.accordion-group .accordion-body.collapse.show');
    jQuery(collapsingMenu).collapse('hide');
    if (collapsingMenu && currentMenu !== collapsingMenu && window.innerWidth < 768) {
      let submenuHeight = 0;
      let submenuItems = collapsingMenu.querySelectorAll('li');
      submenuItems.forEach(() => {
        submenuHeight += 26;
      });
      this.sidebarHeight -= submenuHeight;
    }
  }

  sidebarBehavior(event) {
    this.setSidebarHeight(event);
    this.collapseSubMenu(event);
    this.renderer.setElementStyle(document
      .querySelector('.content'), 'margin-top', this.sidebarHeight + 'px');
  }
}
