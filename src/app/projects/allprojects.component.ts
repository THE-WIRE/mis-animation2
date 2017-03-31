import { Router } from '@angular/router';
import { Component } from '@angular/core'
import { AngularFire } from 'angularfire2'
import { Project } from '../interfaces/project.model'
import { globalVars } from '../shared/global.service'

@Component({
    templateUrl: 'allprojects.template.html',
    styles: [`
    .hoverwell:hover {
        background-color: #485563;
        cursor: pointer;
    }
    
    .container {
        padding-top: 10px;
    }

    .bold { font-weight: bold; }
    .thumbnail {min-height: 210px; margin-right: 20px; margin-top: 20px;}
    .pad-left{margin-left: 10px;}
    .well div{color: #bbb;}
`]
})
export class AllProjects {

    projectMenu: any[]

    constructor(private af: AngularFire, private router: Router, public vars: globalVars) {
        this.af.auth.subscribe(user => {
            if (user) {
                this.af.database.object('Users/' + user.uid + '/projects').subscribe(data => {
                    this.projectMenu = []
                    for (let i in data) {
                        this.af.database.object('projects/' + i + '/').subscribe(project => {
                            project.key = i
                            this.projectMenu.push(project)
                        })
                    }
                })
            }
        })
    }

    setProject(project) {
        this.af.auth.subscribe(user => {
            if (user) {
                this.af.database.object('Users/' + user.uid + '/').update({ "selectedProject": project.key, "isProjectSelected": true })
                this.router.navigate(['app'])
            }
        })
    }

}