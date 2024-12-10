import _ from 'lodash'
import moment from 'moment'

export class InventoryModel {
  modifyVoucherList = (data: any) => {
    _.each(data, (element, index) => {
      element['sno'] = index + 1
      element['isActive'] = element['isActive'] ? 'Active' : 'Inactive'
      element['isRedeemed'] = element['isRedeemed'] ? 'Redeem' : 'Available'
      element['expiryDate'] = element['expiryDate']
        ? moment(element['expiryDate']).format('YYYY-MM-DD')
        : ''
      element['createdAt'] = element['createdAt']
        ? moment(element['createdAt']).format('YYYY-MM-DD HH:MM:SS')
        : ''
    })
    return data
  }
}
