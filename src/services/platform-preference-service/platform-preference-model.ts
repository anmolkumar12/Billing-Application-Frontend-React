import moment from 'moment'

export class PlatformPreferenceModel {
  modifyActivatedClientList = (data: any) => {
    data.forEach((element: any) => {
      element.createdAt = moment(element?.createdAt).format('YYYY-MM-DD')
      element.updatedAt = moment(element?.updatedAt).format('YYYY-MM-DD')
      element.isActive == 1 ? 'Activated' : 'Deactivated'
    })
    return data
  }

  modifyDeactivateClient = (data: any) => {
    data.forEach((element: any, index: number) => {
      element.label = `${element.clientName}(${element?.walletName})`
      element.value = index + 1
    })
    return data
  }
}
