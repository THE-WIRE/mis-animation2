export interface Project {
    exists: boolean
    key: string,
    name: string,
    createdate: Date,
    startdate: Date,
    enddate: Date,
    status: string,
    role: string,
    isSelected: boolean
}