import { APIURLS } from '../../constants/ApiUrls';
import { HTTPService } from '../http-service/http-service';

export class CreditNoteService {
  // Fetch all invoices
  getCreditNoteData = async () => {
    try {
      const response = await HTTPService.postRequest(APIURLS.GET_CREDIT_NOTE);
      return response?.data;
    } catch (err) {
      console.error('Error fetching credit note:', err);
      return {};
    }
  };

  // Create a new invoice
  createCreditNote = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        formData?.id ? APIURLS.UPDATE_CREDIT_NOTE : APIURLS.CREATE_CREDIT_NOTE,
        formData
      );
      return response?.data;
    } catch (error) {
      console.error('Error creating credit note:', error);
      return error;
    }
  };

  // Update an existing invoice
  updateCreditNote = async (formData: any) => {
    try {
      const response = await HTTPService.postRequest(
        APIURLS.UPDATE_CREDIT_NOTE,
        formData
      );
      return response?.data;
    } catch (error) {
      console.error('Error updating credit note:', error);
      return error;
    }
  };

  // Activate/Deactivate an invoice
  activateDeactivateCreditNote = async (data: any) => {
    try {
      const body = {
        id: data.id, // Assuming `id` represents the Invoice ID
        isActive: data.isActive,
        updatedBy: data?.loggedInUserId,
      };

      const response = await HTTPService.postRequest(
        APIURLS.TOGGLE_CREDIT_NOTE_STATUS,
        body
      );
      return response?.data;
    } catch (err) {
      console.error('Error activating/deactivating credit note:', err);
      return {};
    }
  };

  UpdatePDFCreditNote = async (invoiceNumber: any) => {
    try {
        const response = await HTTPService.postRequest(
            APIURLS.POST_GENERATE_CREDIT_NOTE_PDF,  
            { invoice_number: invoiceNumber } 
        );

        return response?.data;
    } catch (err) {
        return {};
    }
};

}


