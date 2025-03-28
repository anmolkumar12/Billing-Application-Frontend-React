
import "./tax-invoice.css"

export default function TaxInvoice(props: any) {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="mainContainer" onClick={() => props?.setDownloadPDF(false)}>
      <div className="print-button-container" onClick={(event) => event.stopPropagation()}>
          <button onClick={handlePrint} className="print-button">
            {/* <Printer size={16} /> */}
            Print Invoice
          </button>
        </div>
      <div className="invoice-container" onClick={(event) => event.stopPropagation()}>
        {/* Print Button - hidden when printing */}
        <img className="company-img" src="./Polestar Logo.svg" alt="Polestar" />
        <h1 className="invoice-title "  >Tax Invoice</h1>
        <div className="pdfContainer">
          {/* Header */}
          <div className="companyInvoice">
            <div className="invoice-header">
              <div className="company-details">
                <span className="company-name">Polestar Solutions And Services India Pvt. Ltd.</span>
                <br />
                <span>4th Floor, Tower-B, Logix Cyber Park,</span>
                <br />
                <span>Plot no. C28 and 29, Sector-62</span>
                <br />
                <span>Noida -201309</span>
                <br />
                <span>Uttar Pradesh, India</span>
                <br />
                <span>Website - <a href="https://www.polestarllp.com" target="_blank" rel="noopener noreferrer">https://www.polestarllp.com</a></span>
                <br />
                <span>CIN No. - U72900UP2017PTC092242</span>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="invoice-details">
              <div className="detail-row">
                <span className="detail-label underline">Invoice No:</span>
                <span>PSSL/24-25/00004</span>
              </div>
              <div className="detail-row">
                <span className="detail-label underline">Invoice Date:</span>
                <span>2024-04-16</span>
              </div>
              <div className="detail-row">
                <span className="detail-label underline">Due Date:</span>
                <span>2024-04-26</span>
              </div>
              <div className="detail-row">
                <span className="detail-label underline">Terms of Payment:</span>
                <span>10 Days</span>
              </div>
              <div className="detail-row">
                <span className="detail-label underline">PO Number:</span>
                <span>48</span>
              </div>
              <div className="detail-row">
                <span className="detail-label underline">PAN:</span>
                <span>AAJCP1487E</span>
              </div>
              <div className="detail-row">
                <span className="detail-label underline">GSTN:</span>
                <span>09AAJCP1487E1Z7</span>
              </div>
              <div className="detail-row">
                <span className="detail-label underline"></span>
                <span></span>
              </div>
            </div>

          </div>

          {/* Client Details */}
          <div className="client-details">
            <span className="section-title ">Client's Details</span>
            <div className="address-container">
              <div className="address-column">
                <span className="address-title underline">Delivery Address:</span>
                <br />
                <span>P</span>
                <br />
                <span>Global Business Park, Tower-A,</span>
                <br />
                <span>1st Floor, M.G.Road,</span>
                <br />
                <span>122002</span>
                <br />
                <span>Haryana, State Code - 06, India</span>
                <br />
                <span>GSTN – 06AAACP2626A2Z2</span>
                <br />
                <span>Place of Supply – Gurgaon</span>
              </div>
              <div className="address-column">
                <span className="address-title underline">Billing Address:</span>
                <br />
                <span>P</span>
                <br />
                <span>Global Business Park, Tower-A,</span>
                <br />
                <span>1st Floor, M.G.Road,</span>
                <br />
                <span>Gurgaon</span>
                <br />
                <span>Haryana, State Code - 06, India</span>
                <br />
                <span>GSTN – 06AAACP2626A2Z2</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="description-section">
            <div className="attention-text">
              <div className="bold">Kind Attention : Mr. Amit Yadav</div>
            </div>
            <div className="table-container">
              <table className="tax-invoice-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>SAC Code</th>
                    <th className="amount-column">Amount (INR)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      Professional Fees for Milestone - Requirement Finalization under Project - Travel Expense Management
                    </td>
                    <td>998313</td>
                    <td className="amount-column">375,000.00</td>
                  </tr>
                  <tr>
                    <td colSpan={2} className="total-label">
                      Total
                    </td>
                    <td className="amount-column">375,000.00</td>
                  </tr>
                  <tr>
                    <td colSpan={2} className="total-label">
                      IGST @ 18.00%
                    </td>
                    <td className="amount-column">67,500.00</td>
                  </tr>
                  <tr>
                    <td colSpan={2} className="grand-total-label">
                      Total Amount After Tax
                    </td>
                    <td className="amount-column grand-total">442,500.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="amount-in-words">
              <span className="bold">In Words: INR Four Hundred Forty-Two Thousand Five Hundred Only </span>
            </div>
          </div>

          {/* Signature */}
          <div className="signature-section">
            <div className="signature-container">
              <div className="signature-space"></div>
              <div className="signature-text">Authorised Signatory</div>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="terms-section">
            <div className="terms-title">Terms & Conditions:</div>
            <ol className="terms-list">
              <li>
                This bill is payable on receipt by Cheque/Wire transfer in favor of Polestar Solutions & Services India Pvt.
                Ltd. In case payment is made by electronic fund transfer, please send details to <a href="ajay@polestarllp.com" target="_blank" rel="noopener noreferrer">ajay@polestarllp.com</a>.
              </li>
              <li>TDS certificate, if applicable is to be sent to the above address.</li>
              <li>Whether GST is payable on Reverse Charge basis? - No</li>
            </ol>
          </div>

          {/* Bank Details */}
          <div className="bank-details">
            <div className="bank-title underline">Bank Details : </div>
            <div className="bank-grid">
              <div className="bank-column">
                <div className="bank-row">
                  <span className="bank-label">Beneficiary Name : </span>
                  <span>Polestar Solutions And Services India Pvt. Ltd.</span>
                </div>
                <div className="bank-row">
                  <span className="bank-label">Bank Name : </span>
                  <span>Kotak Mahindra Bank</span>
                </div>
                <div className="bank-row">
                  <span className="bank-label">Bank Address : </span>
                  <span>Aditya Mall, Vaibhav Khand, Ghaziabad - 201014</span>
                </div>
                <div className="bank-row">
                  <span className="bank-label">Account No. : </span>
                  <span>1412387291</span>
                </div>
              </div>

              <div className="bank-column">
                <div className="bank-row">
                  <span className="bank-label">IFSC Code : </span>
                  <span>KKBK0005289</span>
                </div>
                <div className="bank-row">
                  <span className="bank-label">MICR Code : </span>
                  <span>110485082</span>
                </div>
                <div className="bank-row">
                  <span className="bank-label">Routing No. / Swift Code : </span>
                  <span>KKBKINBBCPC</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}



