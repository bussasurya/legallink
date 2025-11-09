// frontend/src/pages/guides/GuideCivilPage.js
import React from 'react';
import GuidePageLayout from './GuidePageLayout';

const GuideCivilPage = () => {
  return (
    <GuidePageLayout title="Civil Law & Procedure Guide ">
      <section>
        <h3>Overview</h3>
        <p>
          Civil law resolves private disputes between individuals, organizations, and the State (in non-criminal matters).
          It covers contracts, property, torts (civil wrongs), family rights, commercial disputes, and enforcement of civil rights.
          Core statutes include the <strong>Code of Civil Procedure, 1908 (CPC)</strong>, <strong>Indian Contract Act, 1872</strong>,
          <strong>Specific Relief Act, 1963</strong>, <strong>Limitation Act, 1963</strong>, <strong>Transfer of Property Act, 1882</strong>,
          <strong>Evidence Act, 1872</strong>, and sectoral laws (e.g., <em>Arbitration &amp; Conciliation Act, 1996</em>, <em>RERA</em>, etc.).
        </p>
      </section>

      <section>
        <h3>1) What disputes are “civil”?</h3>
        <ul>
          <li><strong>Contract &amp; commercial:</strong> breach of contract, supply disputes, money recovery, specific performance.</li>
          <li><strong>Property:</strong> title, possession, partition, easements, tenancy/eviction (as per state rent laws).</li>
          <li><strong>Torts (civil wrongs):</strong> negligence, nuisance, defamation (civil damages), trespass.</li>
          <li><strong>Family (civil aspects):</strong> maintenance, guardianship, succession, matrimonial property (separate from criminal provisions).</li>
          <li><strong>Company/partnership/LLP civil issues:</strong> shareholder oppression/mismanagement (often before NCLT), partner disputes.</li>
          <li><strong>Consumer &amp; housing:</strong> consumer deficiency (CPA 2019 forums), real-estate delays (RERA authorities/adjudicating officers).</li>
        </ul>
      </section>

      <section>
        <h3>2) Civil Court Structure &amp; Jurisdiction</h3>
        <ul>
          <li><strong>Subject-matter:</strong> Suits must be filed in courts/tribunals competent for that category (e.g., RERA/NCLT/Consumer Forum).</li>
          <li><strong>Pecuniary:</strong> Based on claim value; thresholds differ by State notifications.</li>
          <li><strong>Territorial:</strong> Where defendant resides/carries on business or where cause of action arose (CPC Sections 15–20).</li>
          <li><strong>Commercial Courts:</strong> For “commercial disputes” above prescribed value (Commercial Courts Act, 2015) with stricter timelines.</li>
        </ul>
      </section>

      <section>
        <h3>3) Lifecycle of a Civil Suit (CPC)</h3>
        <ol>
          <li><strong>Pre-suit notice:</strong> Mandatory in some cases (e.g., <em>Section 80 CPC</em> for suits against Government/public officers).</li>
          <li><strong>Plaint filing:</strong> Facts, cause of action, reliefs, valuation, court-fee, limitation compliance (Order VII CPC).</li>
          <li><strong>Admission &amp; Issue of Summons:</strong> Court scrutinizes plaint; summons served to defendant (Order V).</li>
          <li><strong>Written Statement (WS):</strong> Defendant’s reply/defenses with documents; set-off/counterclaim possible (Order VIII).</li>
          <li><strong>Framing of Issues:</strong> Court identifies disputed questions of fact/law (Order XIV).</li>
          <li><strong>Discovery &amp; Inspection:</strong> Interrogatories, document disclosure (Order XI), affidavits (Order XIX).</li>
          <li><strong>Evidence:</strong> Affidavit-in-evidence, cross-examination, exhibits (as per Evidence Act and CPC Orders).</li>
          <li><strong>Arguments &amp; Judgment:</strong> Final judgment followed by a <strong>Decree</strong> (formal adjudication of rights).</li>
          <li><strong>Execution:</strong> Decree enforced via attachment, sale, injunction, arrest in execution (Order XXI).</li>
        </ol>
      </section>

      <section>
        <h3>4) Common Interim Remedies</h3>
        <ul>
          <li><strong>Temporary Injunction (Order XXXIX):</strong> To preserve status quo; requires prima facie case, balance of convenience, irreparable harm.</li>
          <li><strong>Appointment of Receiver (Order XL):</strong> Custody/management of property during the suit.</li>
          <li><strong>Attachment before Judgment (Order XXXVIII):</strong> Prevents alienation to defeat decree.</li>
          <li><strong>Commission (Order XXVI):</strong> Local inspection, witness examination, accounts.</li>
        </ul>
      </section>

      <section>
        <h3>5) Key Specialized Procedures</h3>
        <ul>
          <li><strong>Summary Suits (Order XXXVII):</strong> Fast-track for negotiable instruments or written contracts (limited defenses without leave to defend).</li>
          <li><strong>Rejection of Plaint (Order VII Rule 11):</strong> For bar by law, lack of cause of action, undervaluation, insufficient stamp/court-fee.</li>
          <li><strong>Ex-parte Proceedings (Order IX):</strong> If defendant fails to appear; restoration possible on sufficient cause.</li>
          <li><strong>Representative Suits (Order I Rule 8):</strong> One sues/defends on behalf of numerous persons with same interest.</li>
          <li><strong>Pauper/Indigent Suits (Order XXXIII):</strong> Suits by indigent persons without paying court-fee upfront.</li>
        </ul>
      </section>

      <section>
        <h3>6) Contract Law Essentials (Indian Contract Act, 1872)</h3>
        <ul>
          <li><strong>Valid contract:</strong> Offer, acceptance, lawful consideration, capacity, free consent, lawful object, certainty, possibility of performance.</li>
          <li><strong>Void/Voidable:</strong> Agreements without consideration (subject to exceptions), restraint of trade/marriage, mistake, coercion, fraud, misrepresentation, undue influence.</li>
          <li><strong>Breach &amp; Remedies:</strong> Damages (compensatory, nominal, liquidated), rescission, restitution; <em>Specific Relief Act</em> for <strong>specific performance</strong> and <strong>injunctions</strong>.</li>
          <li><strong>Indemnity &amp; Guarantee, Bailment &amp; Pledge, Agency:</strong> Rights/liabilities of parties.</li>
        </ul>
      </section>

      <section>
        <h3>7) Property &amp; Transfer (TPA, 1882) — Quick Guide</h3>
        <ul>
          <li><strong>Transfers:</strong> Sale, mortgage, lease, exchange, gift; must satisfy competency, transferable interest, and mode of transfer.</li>
          <li><strong>Registration Act, 1908:</strong> Compulsory registration for most immovable transfers; unregistered documents may be inadmissible.</li>
          <li><strong>Easements &amp; Licenses:</strong> Use rights vs. mere permissions; revocability and remedies differ.</li>
          <li><strong>Co-ownership &amp; Partition:</strong> Civil suits for declaration/partition/possession/mesne profits.</li>
        </ul>
      </section>

      <section>
        <h3>8) Limitation (Limitation Act, 1963)</h3>
        <p>
          Filing within limitation is critical; delay usually bars the remedy (though not the right). Some common periods:
        </p>
        <ul>
          <li><strong>Money recovery on written contract:</strong> 3 years from breach.</li>
          <li><strong>Specific performance:</strong> 3 years from when performance is refused/ought to have been performed.</li>
          <li><strong>Possession based on title:</strong> 12 years against private parties (longer for Government).</li>
          <li><strong>Injunctions/Declarations:</strong> Generally 3 years (fact-sensitive).</li>
          <li><strong>Execution of decree:</strong> 12 years from decree becoming enforceable.</li>
        </ul>
      </section>

      <section>
        <h3>9) Evidence Basics (Evidence Act, 1872)</h3>
        <ul>
          <li><strong>Burden of proof:</strong> Lies on party asserting a fact; civil standard is preponderance of probabilities.</li>
          <li><strong>Documentary vs. oral evidence:</strong> Primary evidence preferred; secondary subject to conditions.</li>
          <li><strong>Electronic records:</strong> Admissibility with Section 65B certificate (IT Act interplay).</li>
          <li><strong>Estoppel, presumptions, admissions:</strong> Frequently decisive in civil trials.</li>
        </ul>
      </section>

      <section>
        <h3>10) ADR &amp; Pre-litigation Options</h3>
        <ul>
          <li><strong>Arbitration &amp; Conciliation Act, 1996:</strong> Party autonomy; limited court intervention; award enforceable as decree.</li>
          <li><strong>Mediation/Conciliation:</strong> Settlement with neutral facilitation; now widely encouraged by courts and statutes.</li>
          <li><strong>Lok Adalat:</strong> Speedy compromise; award is final and executable.</li>
          <li><strong>Commercial Courts Act:</strong> Mandates pre-institution mediation for many commercial suits.</li>
        </ul>
      </section>

      <section>
        <h3>11) Decrees, Orders &amp; Post-Judgment Remedies</h3>
        <ul>
          <li><strong>Decree vs. Order:</strong> Decree conclusively determines rights; orders are directions during proceedings.</li>
          <li><strong>Appeals:</strong> First/second appeals as per CPC; <em>Regular First Appeal</em> on facts/law; second appeal on substantial question of law.</li>
          <li><strong>Revision (Section 115 CPC):</strong> High Court oversight on jurisdictional errors.</li>
          <li><strong>Review:</strong> For apparent error on the face of record.</li>
          <li><strong>Execution (Order XXI):</strong> Attachment, sale, delivery of possession, arrest in execution (in limited categories).</li>
        </ul>
      </section>

      <section>
        <h3>12) Common Civil Pleadings &amp; Reliefs</h3>
        <ul>
          <li><strong>Suit for Recovery of Money</strong> (contract/invoice/NI Act basis).</li>
          <li><strong>Suit for Declaration</strong> (title/status) with consequential relief.</li>
          <li><strong>Suit for Permanent/Temporary Injunction</strong> (trespass, construction, IP violations).</li>
          <li><strong>Specific Performance</strong> of agreements to sell/unique goods/services.</li>
          <li><strong>Partition &amp; Possession</strong> with mesne profits and accounts.</li>
        </ul>
      </section>

      <section>
        <h3>13) Practical Tips</h3>
        <ul>
          <li>Preserve <strong>documents &amp; communications</strong>; maintain a clear chronology.</li>
          <li>Check <strong>jurisdiction, valuation, court-fee</strong>, and <strong>limitation</strong> before filing.</li>
          <li>Seek <strong>interim protection</strong> early where needed (injunction/receiver/attachment).</li>
          <li>Prefer <strong>ADR</strong> for speed and confidentiality in commercial matters.</li>
          <li>Comply with <strong>disclosure and discovery</strong> obligations to avoid adverse inferences/costs.</li>
        </ul>
      </section>

      <section>
        <p>
          <em>
            Disclaimer: This guide is for general information only and does not constitute legal advice.
            For case-specific strategy and drafting, consult a qualified civil law advocate.
          </em>
        </p>
      </section>
    </GuidePageLayout>
  );
};

export default GuideCivilPage;
