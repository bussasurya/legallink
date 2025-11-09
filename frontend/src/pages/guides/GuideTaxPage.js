import React from 'react';
import GuidePageLayout from './GuidePageLayout';

const GuideTaxPage = () => {
  return (
    <GuidePageLayout title="Taxation Law Guide ">
      <section>
        <h3>Overview</h3>
        <p>
          Taxation law in India governs how the government collects revenue from individuals and businesses.
          It is divided into <strong>Direct Taxes</strong> (paid directly by taxpayers) and <strong>Indirect Taxes</strong> (collected through goods and services).
          The framework is primarily defined under the <strong>Income Tax Act, 1961</strong> and the <strong>Goods and Services Tax (GST) Acts, 2017</strong>.
        </p>
      </section>

      <section>
        <h3>1. Types of Taxes in India</h3>
        <h4>🔹 Direct Taxes</h4>
        <ul>
          <li><strong>Income Tax:</strong> Levied on the income of individuals, firms, and companies under the Income Tax Act, 1961.</li>
          <li><strong>Corporate Tax:</strong> Paid by companies on their profits.</li>
          <li><strong>Capital Gains Tax:</strong> On profit from sale of capital assets (property, shares, etc.).</li>
          <li><strong>Dividend Tax:</strong> Tax on dividends distributed by companies (now taxed in shareholder’s hands).</li>
          <li><strong>Wealth Tax (abolished):</strong> Replaced by surcharge on high-value assets.</li>
        </ul>

        <h4>🔹 Indirect Taxes</h4>
        <ul>
          <li><strong>Goods and Services Tax (GST):</strong> A unified tax on the supply of goods and services across India.</li>
          <li><strong>Customs Duty:</strong> Levied on imports and exports under the Customs Act, 1962.</li>
          <li><strong>Excise Duty:</strong> On manufacture of certain goods (still applicable for some items like petroleum and liquor).</li>
          <li><strong>Stamp Duty:</strong> On registration of legal documents like property sale deeds.</li>
        </ul>
      </section>

      <section>
        <h3>2. Income Tax Structure (Direct Tax)</h3>
        <p>
          The <strong>Income Tax Department</strong> under the Ministry of Finance administers income tax collection.  
          Taxpayers are categorized based on income and residential status.
        </p>

        <h4>Taxpayers Categories:</h4>
        <ul>
          <li>Individuals (Residents/Non-residents)</li>
          <li>Hindu Undivided Families (HUFs)</li>
          <li>Partnership Firms and LLPs</li>
          <li>Companies (Domestic & Foreign)</li>
          <li>Trusts, Associations, and Societies</li>
        </ul>

        <h4>Basic Exemption Limits (FY 2024–25):</h4>
        <ul>
          <li>Up to ₹3,00,000 – No tax (New Regime)</li>
          <li>5% for income between ₹3,00,001 – ₹6,00,000</li>
          <li>10% for ₹6,00,001 – ₹9,00,000</li>
          <li>15% for ₹9,00,001 – ₹12,00,000</li>
          <li>20% for ₹12,00,001 – ₹15,00,000</li>
          <li>30% above ₹15,00,000</li>
        </ul>

        <p>
          *Note: Tax slabs differ for senior citizens and under the old regime.*
        </p>
      </section>

      <section>
        <h3>3. Important Heads of Income</h3>
        <ul>
          <li><strong>Income from Salary:</strong> Includes wages, pension, and allowances.</li>
          <li><strong>Income from House Property:</strong> Rental income minus deductions for repairs and interest.</li>
          <li><strong>Profits and Gains of Business or Profession:</strong> Income from business or professional services.</li>
          <li><strong>Capital Gains:</strong> Income from sale of assets — Short Term and Long Term based on holding period.</li>
          <li><strong>Income from Other Sources:</strong> Dividends, lotteries, interest income, etc.</li>
        </ul>
      </section>

      <section>
        <h3>4. Deductions and Exemptions (Key Sections)</h3>
        <ul>
          <li><strong>Section 80C:</strong> Deductions up to ₹1.5 lakh (PF, ELSS, LIC, etc.).</li>
          <li><strong>Section 80D:</strong> Health insurance premium deduction.</li>
          <li><strong>Section 24(b):</strong> Interest on housing loan.</li>
          <li><strong>Section 10(14):</strong> House Rent Allowance (HRA) exemption.</li>
          <li><strong>Section 80G:</strong> Donations to approved charities.</li>
          <li><strong>Section 80E:</strong> Interest on education loan.</li>
          <li><strong>Section 54:</strong> Capital gains exemption on reinvestment in property.</li>
        </ul>
      </section>

      <section>
        <h3>5. Goods and Services Tax (GST)</h3>
        <p>
          GST is a comprehensive indirect tax introduced in 2017, replacing multiple taxes like VAT, excise, and service tax.
          It is levied on the supply of goods and services based on destination and value addition.
        </p>

        <h4>Types of GST:</h4>
        <ul>
          <li><strong>CGST:</strong> Central Goods and Services Tax (collected by the Centre).</li>
          <li><strong>SGST:</strong> State Goods and Services Tax (collected by the State).</li>
          <li><strong>IGST:</strong> Integrated Goods and Services Tax (for interstate supply).</li>
          <li><strong>UTGST:</strong> Union Territory GST.</li>
        </ul>

        <h4>GST Tax Slabs:</h4>
        <ul>
          <li>5% – Essential goods and services</li>
          <li>12% – Standard goods</li>
          <li>18% – Most products and services</li>
          <li>28% – Luxury and sin goods</li>
        </ul>

        <h4>GST Registration:</h4>
        <ul>
          <li>Mandatory for businesses with turnover exceeding ₹40 lakh (₹20 lakh for services).</li>
          <li>Voluntary registration allowed for input tax credit benefits.</li>
          <li>GSTIN (GST Identification Number) must be displayed at business premises.</li>
        </ul>
      </section>

      <section>
        <h3>6. Tax Filing & Compliance</h3>
        <ul>
          <li>Individuals and businesses must file annual Income Tax Returns (ITR) by <strong>31 July</strong> each year.</li>
          <li>Tax Deducted at Source (TDS) and Tax Collected at Source (TCS) must be deposited within due dates.</li>
          <li>Advance Tax applies if total liability exceeds ₹10,000 per year.</li>
          <li>GST returns (GSTR-1, GSTR-3B, etc.) must be filed monthly or quarterly.</li>
          <li>Maintain records for at least 6 years for audits and assessments.</li>
        </ul>
      </section>

      <section>
        <h3>7. Penalties and Prosecution</h3>
        <ul>
          <li><strong>Late Filing:</strong> Penalty under Section 234F (₹1,000 to ₹5,000).</li>
          <li><strong>Tax Evasion:</strong> Prosecution with imprisonment (3 months to 7 years).</li>
          <li><strong>Non-payment of GST:</strong> Penalty of 10% or ₹10,000 (whichever is higher).</li>
          <li><strong>Fraudulent ITC Claims:</strong> Subject to arrest and prosecution under GST Act.</li>
        </ul>
      </section>

      <section>
        <h3>8. Appeals and Dispute Resolution</h3>
        <ul>
          <li><strong>Commissioner (Appeals):</strong> First appeal against assessment orders.</li>
          <li><strong>Income Tax Appellate Tribunal (ITAT):</strong> Second appeal on factual and legal issues.</li>
          <li><strong>High Court:</strong> Appeals on substantial questions of law.</li>
          <li><strong>Supreme Court:</strong> Final appellate authority.</li>
          <li><strong>GST Appellate Tribunal:</strong> For GST-related disputes (under constitution by Govt.).</li>
        </ul>
      </section>

      <section>
        <h3>9. Key Tax Authorities and Bodies</h3>
        <ul>
          <li><strong>CBDT:</strong> Central Board of Direct Taxes – administers Income Tax.</li>
          <li><strong>CBIC:</strong> Central Board of Indirect Taxes & Customs – administers GST and Customs.</li>
          <li><strong>GST Council:</strong> Constitutional body chaired by the Finance Minister; decides GST rates and policies.</li>
          <li><strong>Tax Tribunals:</strong> ITAT and GSTAT handle appellate matters.</li>
        </ul>
      </section>

      <section>
        <h3>10. Important Tax Reforms & Digital Initiatives</h3>
        <ul>
          <li><strong>Faceless Assessment Scheme:</strong> Transparent and paperless tax processing.</li>
          <li><strong>e-Filing Portal (incometax.gov.in):</strong> Online return submission and refund tracking.</li>
          <li><strong>GSTN Portal (gst.gov.in):</strong> GST registration, filing, and payments.</li>
          <li><strong>PAN–Aadhaar Linking:</strong> Mandatory for return filing.</li>
          <li><strong>Form 26AS & AIS:</strong> Annual tax credit and transaction summary for taxpayers.</li>
        </ul>
      </section>

      <section>
        <h3>11. International Taxation (Overview)</h3>
        <ul>
          <li>Non-residents taxed on income accrued or received in India.</li>
          <li>Double Taxation Avoidance Agreements (DTAA) prevent same income being taxed twice.</li>
          <li>Transfer Pricing Regulations apply to multinational companies with cross-border transactions.</li>
          <li>Equalization Levy on digital transactions from foreign companies.</li>
        </ul>
      </section>

      <section>
        <p>
          <em>
            Disclaimer: This guide is for general informational purposes and not professional tax advice.
            Consult a Chartered Accountant or tax lawyer for specific compliance and planning guidance.
          </em>
        </p>
      </section>
    </GuidePageLayout>
  );
};

export default GuideTaxPage;
