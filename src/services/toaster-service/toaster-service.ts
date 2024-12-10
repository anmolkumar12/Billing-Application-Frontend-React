import { Subject } from 'rxjs'
import { Content } from '../../components/ui/toast/Toast'

const subject = new Subject()

export const ToasterService = {
  show: (message: string, type?: string, title?: string, toastLife?: number) =>
    subject.next({
      severity: type || 'success',
      detail: message,
      life: toastLife || 3000,
      content: Content(message, type || 'success'),
    }),
  getMessage: () => subject.asObservable(),
}
