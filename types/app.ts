export interface Record {
  id: number
  name: string
  type: string
  length: string
  listItems?: string[]
}

export interface AppData {
  id: string;
  appName: string
  appCode: string
  appType: string
  approvalFlow: string
  exportOptions: string[]
  expose: string[]
  appdescription: string
  records: Record[]
  logo?: string
}

