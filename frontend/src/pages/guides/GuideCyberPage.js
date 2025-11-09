import React from 'react';
import GuidePageLayout from './GuidePageLayout';

const GuideCyberPage = () => {
  return (
    <GuidePageLayout title="Cyber Law and Data Protection Guide ">
      <section>
        <h3>Overview</h3>
        <p>
          Cyber law in India regulates the use of computers, digital communication, networks, and data.
          It aims to prevent cybercrimes, protect privacy, and ensure accountability for digital transactions.
          The primary legislation is the <strong>Information Technology Act, 2000</strong> (IT Act), updated through the
          <strong> Information Technology (Amendment) Act, 2008</strong> and supported by the <strong>Digital Personal Data Protection Act, 2023</strong> (DPDP Act).
        </p>
      </section>

      <section>
        <h3>1. Key Legislations</h3>
        <ul>
          <li><strong>Information Technology Act, 2000:</strong> Legal recognition for electronic records, digital signatures, and cyber offences.</li>
          <li><strong>IT (Amendment) Act, 2008:</strong> Introduced data privacy, cyber terrorism, and intermediary liability provisions.</li>
          <li><strong>Digital Personal Data Protection (DPDP) Act, 2023:</strong> Defines rules for data collection, storage, and consent.</li>
          <li><strong>Indian Penal Code (Sections 66C, 66D, etc.):</strong> Addresses fraud, identity theft, and related crimes in digital contexts.</li>
        </ul>
      </section>

      <section>
        <h3>2. Objectives of Cyber Law</h3>
        <ul>
          <li>Regulate digital communication and commerce.</li>
          <li>Prevent misuse of information technology and online fraud.</li>
          <li>Safeguard data privacy and digital identities.</li>
          <li>Enable electronic governance and e-signatures.</li>
          <li>Provide legal recourse to victims of cyber offences.</li>
        </ul>
      </section>

      <section>
        <h3>3. Major Cyber Offences (IT Act Sections)</h3>
        <ul>
          <li><strong>Section 43:</strong> Unauthorized access, damage, or disruption to computer systems or data.</li>
          <li><strong>Section 65:</strong> Tampering with computer source code; imprisonment up to 3 years.</li>
          <li><strong>Section 66:</strong> Hacking or identity theft causing loss or damage.</li>
          <li><strong>Section 66C:</strong> Identity theft using passwords or electronic signatures.</li>
          <li><strong>Section 66D:</strong> Cheating by impersonation through electronic means (e.g., phishing scams).</li>
          <li><strong>Section 66E:</strong> Violation of privacy by capturing or publishing private images without consent.</li>
          <li><strong>Section 67 & 67A:</strong> Publishing obscene or sexually explicit material online.</li>
          <li><strong>Section 70:</strong> Unauthorized access to protected government systems — cyber terrorism.</li>
          <li><strong>Section 72:</strong> Breach of confidentiality or privacy by service providers.</li>
          <li><strong>Section 75:</strong> Extra-territorial jurisdiction — offences committed outside India affecting Indian systems.</li>
        </ul>
      </section>

      <section>
        <h3>4. Cybercrimes Examples & Punishments</h3>
        <ul>
          <li><strong>Phishing & Online Fraud:</strong> Punishable under Sections 66C and 66D — up to 3 years imprisonment and fines.</li>
          <li><strong>Hacking & Ransomware:</strong> Illegal intrusion, data theft, or encryption for ransom; imprisonment up to 10 years under Sections 66 and 70.</li>
          <li><strong>Cyberstalking & Bullying:</strong> Penalized under Sections 66E and IPC 354D — imprisonment up to 3 years.</li>
          <li><strong>Identity Theft & Impersonation:</strong> Using others’ digital credentials — up to 3 years under Section 66C.</li>
          <li><strong>Publishing Child Pornography:</strong> Sections 67B & POCSO Act — imprisonment up to 7 years and fines.</li>
          <li><strong>Data Breach or Privacy Violation:</strong> Sections 43A and 72A — penalties for negligent handling of sensitive information.</li>
        </ul>
      </section>

      <section>
        <h3>5. Digital Personal Data Protection Act, 2023 (DPDP)</h3>
        <p>
          The DPDP Act establishes a comprehensive framework for the protection of personal data.
          It applies to both Indian and foreign entities handling data of Indian citizens.
        </p>
        <ul>
          <li><strong>Consent-Based Processing:</strong> Data can only be processed with clear and informed consent.</li>
          <li><strong>Rights of Individuals:</strong> Right to access, correct, erase, and withdraw consent for personal data.</li>
          <li><strong>Data Fiduciaries:</strong> Entities collecting or processing data must ensure purpose limitation and security.</li>
          <li><strong>Data Protection Board of India (DPBI):</strong> Regulates and enforces compliance with the DPDP Act.</li>
          <li><strong>Penalties:</strong> Fines up to ₹250 crore for serious breaches of data security or privacy.</li>
        </ul>
      </section>

      <section>
        <h3>6. Cybersecurity & Intermediary Liability</h3>
        <ul>
          <li>
            <strong>Intermediaries</strong> (social media platforms, ISPs, hosting providers) must follow <strong>IT (Intermediary Guidelines & Digital Media Ethics Code) Rules, 2021</strong>.
          </li>
          <li>They must remove unlawful content within 36 hours of notice.</li>
          <li>Maintain records and cooperate with government agencies for investigation.</li>
          <li>Appoint a <strong>Chief Compliance Officer</strong> and <strong>Grievance Officer</strong> in India.</li>
          <li>Failure to comply removes “safe harbour” protection under Section 79 IT Act.</li>
        </ul>
      </section>

      <section>
        <h3>7. Electronic Evidence & Admissibility</h3>
        <ul>
          <li>Electronic records are admissible under <strong>Section 65B of the Indian Evidence Act</strong>.</li>
          <li>A valid <strong>65B certificate</strong> must accompany the evidence confirming authenticity.</li>
          <li>Emails, chat logs, CCTV footage, metadata, and screenshots can be used in civil and criminal trials.</li>
          <li>Courts rely on digital forensic analysis to verify tampering or alteration.</li>
        </ul>
      </section>

      <section>
        <h3>8. Cybercrime Investigation and Reporting</h3>
        <ul>
          <li>Report cybercrimes through the official government portal: <a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer">cybercrime.gov.in</a></li>
          <li>Cyber Cells are operational in every district and metro city.</li>
          <li>Specialized units like CERT-In (Computer Emergency Response Team) monitor threats and security breaches nationwide.</li>
          <li>Complaints can be filed under both the IT Act and relevant IPC sections.</li>
        </ul>
      </section>

      <section>
        <h3>9. Common Preventive Measures</h3>
        <ul>
          <li>Use strong, unique passwords and enable two-factor authentication (2FA).</li>
          <li>Avoid sharing personal data on unsecured websites or over email.</li>
          <li>Install legitimate antivirus and keep systems updated.</li>
          <li>Regularly back up data to prevent ransomware loss.</li>
          <li>Be cautious of phishing links and social engineering scams.</li>
        </ul>
      </section>

      <section>
        <h3>10. Emerging Areas in Cyber Law</h3>
        <ul>
          <li><strong>AI and Deepfakes:</strong> Use of artificial intelligence in manipulation and misinformation.</li>
          <li><strong>Cryptocurrency Regulation:</strong> RBI and Ministry of Finance oversee legality of virtual currencies.</li>
          <li><strong>Cyber Forensics:</strong> Scientific methods for digital evidence preservation.</li>
          <li><strong>Data Localization:</strong> Rules requiring sensitive data to be stored in India.</li>
          <li><strong>Cyber Insurance:</strong> New financial instruments to protect businesses from data loss risks.</li>
        </ul>
      </section>

      <section>
        <h3>11. Enforcement Agencies and Authorities</h3>
        <ul>
          <li><strong>CERT-In:</strong> Nodal agency for cybersecurity response and coordination.</li>
          <li><strong>NCIIPC:</strong> National Critical Information Infrastructure Protection Centre — protects critical digital assets.</li>
          <li><strong>Cyber Crime Cells:</strong> Local investigation units under state police.</li>
          <li><strong>Data Protection Board of India (DPBI):</strong> Established under the DPDP Act.</li>
          <li><strong>Adjudicating Officers:</strong> Handle financial penalties and civil remedies for IT Act violations.</li>
        </ul>
      </section>

      <section>
        <h3>12. Legal Remedies for Victims</h3>
        <ul>
          <li>File a complaint at <a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer">cybercrime.gov.in</a> or nearest police station.</li>
          <li>File a case before the <strong>Adjudicating Officer</strong> under Section 46 IT Act for data or financial loss.</li>
          <li>Approach the <strong>High Court</strong> or <strong>Supreme Court</strong> for constitutional or fundamental rights violations (Article 21 — Right to Privacy).</li>
          <li>Seek damages for negligence or misuse of personal information under Section 43A.</li>
        </ul>
      </section>

      <section>
        <p>
          <em>
            Disclaimer: This guide is intended for general awareness and does not constitute legal advice.
            For cybercrime-related issues, consult a qualified cyber law expert or approach a government cyber cell.
          </em>
        </p>
      </section>
    </GuidePageLayout>
  );
};

export default GuideCyberPage;
