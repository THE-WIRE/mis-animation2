import { Observable, Subject } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Project } from '../interfaces/project.model';
import { AngularFire } from 'angularfire2'
import { Router } from '@angular/router'

@Injectable()
export class globalVars implements Project {

    key: string
    name: string
    startdate: Date
    enddate: Date
    createdate: Date
    status: string
    role: string
    isSelected: boolean = false
    exists: boolean = false

    constructor(private af: AngularFire, private router: Router) {
        this.af.auth.subscribe(user => {
            if (user) {
                this.af.database.object('Users/' + user.uid).subscribe(data => {
                    this.exists = data.isprojectSelected
                    this.isSelected = data.isprojectSelected
                    if (data.isProjectSelected == true) {
                        this.key = data.selectedProject

                        this.af.database.object('Users/' + user.uid + '/projects/' + this.key + '/role').subscribe(role => {
                            this.role = role.$value
                        })

                        this.af.database.object('projects/' + this.key + '/').subscribe(project => {
                            this.name = project.long.name
                            this.createdate = project.date.crDate
                            this.status = project.status
                            this.exists = true
                            this.isSelected = true
                        })
                    }
                })
            }
        })
    }

    getVars(): Observable<Project> {

        let subject = new Subject<Project>();
        setTimeout(() => { subject.next(this); subject.complete(); }, 1);
        return subject;
    }

}