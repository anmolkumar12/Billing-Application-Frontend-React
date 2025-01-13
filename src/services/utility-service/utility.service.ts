import { ToasterService } from '../toaster-service/toaster-service'
import { FILE_TYPES } from '../../enums/file-types.enum'
import { HTTPService } from '../http-service/http-service'
import moment from 'moment'
import { CONSTANTS } from '../../constants/Constants'
import { BehaviorSubject } from 'rxjs'
import { APIURLS } from '../../constants/ApiUrls'

export class UtilityService {
  getFileBlobURL = (fileName: string, qValue: string, filetype?: string) => {
    if (fileName) {
      let type = ''
      let filepath: any = (fileName && fileName.split('_')) || []
      filepath.length && filepath.shift()
      filepath = filepath.join('_')
      const extension =
        filepath && filepath.split('.')[filepath.split('.').length - 1]
      const ext = extension && extension.toLowerCase()
      if (ext == 'pdf') {
        type = 'application/pdf'
      } else if (ext == 'jpg') {
        type = 'image/jpg'
      } else if (ext == 'jpeg') {
        type = 'image/jpeg'
      } else if (ext == 'png') {
        type = 'image/png'
      } else {
        type = 'application/pdf'
      }
      return new Promise((resolve, reject) => {
        HTTPService.getRequest(APIURLS.FILES, {
          params: { q: qValue, f: fileName },
          responseType: 'blob',
        }).then(
          (response: any) => {
            const data = new Blob([response.data], { type: type })
            const blobURL = window.URL.createObjectURL(data)
            resolve(blobURL)
          },
          (error: any) => {
            reject()
          }
        )
      })
    } else {
      ToasterService.show('File Name not found!', 'error')
    }
  }

  getBlob = (
    apiName: string,
    qValue: string,
    fileName: string,
    type: string
  ) => {
    return new Promise((resolve, reject) => {
      HTTPService.getRequest(apiName, {
        params: { q: qValue, f: fileName },
        responseType: 'blob',
      }).then(
        (response: any) => {
          const data = new Blob([response.data], { type: type })
          const blobURL = window.URL.createObjectURL(data)
          resolve(blobURL)
        },
        (error: any) => {
          reject()
        }
      )
    })
  }

  dateFormatter = (date: Date) => {
    return date
      ? moment(new Date(date)).clone().format('YYYY-MM-DD')
      : undefined
  }

  replaceLineBreaks = (stringData: string) => {
    const newline = String.fromCharCode(13, 10)
    return stringData && stringData.replace(/\\n/g, newline).replace(/\\r/g, '')
  }

  getRandomColor = (index: any) => {
    const colors = [
      '#3B4AA4',
      '#4ac5aa',
      '#93c76b',
      '#5EAAA8',
      '#5495a9b0',
      '#6c6aca',
    ]
    return colors[index % 6]
  }
   getYearRange = () => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 15;
    const endYear = currentYear + 15;
    const yearRange = [];
    
    for (let year = startYear; year <= endYear; year++) {
      yearRange.push(year.toString());
    }
    
    return yearRange;
  };
}
