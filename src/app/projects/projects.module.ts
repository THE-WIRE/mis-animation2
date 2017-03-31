import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AllProjects } from './allprojects.component'

export const routes = [
    { path: '', component: AllProjects, pathMatch: 'full' }
];

@NgModule({
    declarations: [
        AllProjects
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(routes),
    ]
})
export class ProjectsModule {
    static routes = routes;
}
