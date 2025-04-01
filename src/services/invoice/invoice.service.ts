import { APIURLS } from '../../constants/ApiUrls';
import { HTTPService } from '../http-service/http-service';

export class InvoiceService {
  // Fetch all invoices
  getInvoicesData = async () => {
    try {
      const response = await HTTPService.postRequest(APIURLS.GET_INVOICES);
      return response?.data;
    } catch (err) {
      console.error('Error fetching invoices:', err);
      return {};
    }
  };

  // Create a new invoice
  createInvoice = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        formData?.id ? APIURLS.UPDATE_INVOICE : APIURLS.CREATE_INVOICE,
        formData
      );
      return response?.data;
    } catch (error) {
      console.error('Error creating invoice:', error);
      return error;
    }
  };

  // Update an existing invoice
  updateInvoice = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.UPDATE_INVOICE,
        formData
      );
      return response?.data;
    } catch (error) {
      console.error('Error updating invoice:', error);
      return error;
    }
  };

  // Activate/Deactivate an invoice
  activateDeactivateInvoice = async (data: any) => {
    try {
      const body = {
        id: data.id, // Assuming `id` represents the Invoice ID
        isActive: data.isActive,
        updatedBy: data?.loggedInUserId,
      };

      const response = await HTTPService.postRequest(
        APIURLS.TOGGLE_INVOICE_STATUS,
        body
      );
      return response?.data;
    } catch (err) {
      console.error('Error activating/deactivating invoice:', err);
      return {};
    }
  };

  UpdateInvoicePDF = async (invoiceNumber: any) => {
    try {
        const response = await HTTPService.postRequest(
            APIURLS.POST_GENERATE_INVOICE_PDF,  
            { invoice_number: invoiceNumber } 
        );

        return response?.data;
    } catch (err) {
        return {};
    }
};

GetInvoiceDownloadPDF = async () => {
    try {
        const response = await HTTPService.getRequest(APIURLS.GET_GENERATE_INVOICE_PDF)
        return response?.data
    } catch (err) {
        return {}
    }
}

}


