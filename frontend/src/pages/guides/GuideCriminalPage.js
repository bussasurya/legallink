import React from 'react';
import GuidePageLayout from './GuidePageLayout';

const GuideCriminalPage = () => {
    return (
        <GuidePageLayout title="Criminal Law and Procedure Guide ">
            <section>
                <h3>Overview</h3>
                <p>
                    Criminal law in India deals with offences against society, public order, and the state.  
                    It defines acts that are punishable by law, procedures for investigation and trial, and the rights of accused persons.
                    The key legislations governing criminal law are:
                </p>
                <ul>
                    <li><strong>Indian Penal Code (IPC), 1860</strong> — defines offences and punishments.</li>
                    <li><strong>Code of Criminal Procedure (CrPC), 1973</strong> — governs investigation, arrest, bail, and trial procedures.</li>
                    <li><strong>Indian Evidence Act, 1872</strong> — prescribes rules for admissibility and evaluation of evidence.</li>
                </ul>
            </section>

            <section>
                <h3>1. Classification of Offences</h3>
                <ul>
                    <li><strong>Cognizable Offences:</strong> Serious offences where police can arrest without a warrant (e.g., murder, rape, theft).</li>
                    <li><strong>Non-Cognizable Offences:</strong> Less serious offences where police need court permission to arrest (e.g., defamation, public nuisance).</li>
                    <li><strong>Bailable Offences:</strong> Offences where bail is a right (e.g., minor assault, public obstruction).</li>
                    <li><strong>Non-Bailable Offences:</strong> Bail is granted only by the court based on discretion (e.g., murder, kidnapping, rape).</li>
                    <li><strong>Compoundable Offences:</strong> Offences that can be settled out of court by mutual consent (e.g., adultery, assault).</li>
                    <li><strong>Non-Compoundable Offences:</strong> Serious offences that cannot be settled outside court (e.g., homicide, dowry death).</li>
                </ul>
            </section>

            <section>
                <h3>2. Stages of Criminal Procedure (CrPC, 1973)</h3>
                <h4>🔹 1. Registration of FIR (Section 154 CrPC)</h4>
                <p>
                    Any person can report a cognizable offence at a police station.  
                    The FIR (First Information Report) must be recorded in writing and a copy provided to the complainant.
                </p>

                <h4>🔹 2. Investigation</h4>
                <p>
                    The police collect evidence, examine witnesses, seize relevant items, and prepare a <strong>charge sheet</strong> or <strong>closure report</strong>.
                </p>

                <h4>🔹 3. Arrest and Remand</h4>
                <p>
                    An arrest can be made with or without a warrant depending on the offence.  
                    Within 24 hours, the accused must be presented before a magistrate.
                </p>

                <h4>🔹 4. Bail</h4>
                <p>
                    Bail allows temporary release of the accused during trial.  
                    Types of bail:
                </p>
                <ul>
                    <li><strong>Regular Bail:</strong> Granted after arrest (Sections 437–439 CrPC).</li>
                    <li><strong>Anticipatory Bail:</strong> Pre-arrest protection (Section 438 CrPC).</li>
                    <li><strong>Interim Bail:</strong> Temporary relief pending final bail hearing.</li>
                </ul>

                <h4>🔹 5. Filing of Charge Sheet</h4>
                <p>
                    Once investigation concludes, police file a charge sheet listing evidence, witnesses, and accused persons.
                </p>

                <h4>🔹 6. Trial and Judgment</h4>
                <p>
                    The accused is formally charged, evidence is presented, and witnesses are examined.  
                    After arguments, the judge delivers a verdict — conviction or acquittal.
                </p>

                <h4>🔹 7. Appeal and Revision</h4>
                <p>
                    A convicted person can appeal to a higher court — Sessions Court, High Court, or Supreme Court — depending on jurisdiction.
                </p>
            </section>

            <section>
                <h3>3. Major Crimes Under IPC (Indian Penal Code, 1860)</h3>
                <ul>
                    <li><strong>Murder (Section 302):</strong> Punishable with death or life imprisonment.</li>
                    <li><strong>Culpable Homicide (Section 299–304):</strong> Causing death without intent to murder.</li>
                    <li><strong>Rape (Section 375–376):</strong> Sexual intercourse without consent; punishable up to life imprisonment.</li>
                    <li><strong>Theft (Section 378–379):</strong> Dishonestly taking movable property; up to 3 years imprisonment.</li>
                    <li><strong>Robbery and Dacoity (Section 390–395):</strong> Violent theft by individuals or groups; severe punishments.</li>
                    <li><strong>Kidnapping (Section 359–369):</strong> Taking a person away unlawfully; up to 7 years imprisonment.</li>
                    <li><strong>Cheating and Fraud (Section 415–420):</strong> Deception to gain unlawful benefit; up to 7 years.</li>
                    <li><strong>Defamation (Section 499–500):</strong> Damaging a person’s reputation; up to 2 years imprisonment.</li>
                    <li><strong>Dowry Death (Section 304B):</strong> Death of a woman due to dowry harassment; minimum 7 years to life imprisonment.</li>
                    <li><strong>Domestic Violence (Section 498A):</strong> Cruelty by husband or relatives; up to 3 years imprisonment.</li>
                </ul>
            </section>

            <section>
                <h3>4. Rights of an Arrested Person</h3>
                <ul>
                    <li>Right to be informed of reasons for arrest (Article 22, Constitution of India).</li>
                    <li>Right to remain silent (Article 20(3)).</li>
                    <li>Right to consult a lawyer and be represented by counsel.</li>
                    <li>Right to be produced before a magistrate within 24 hours.</li>
                    <li>Right against self-incrimination.</li>
                    <li>Right to free legal aid under <strong>Section 304 CrPC</strong>.</li>
                </ul>
            </section>

            <section>
                <h3>5. Evidence and Trial Process</h3>
                <ul>
                    <li>Evidence must be relevant, admissible, and legally obtained as per the <strong>Indian Evidence Act, 1872</strong>.</li>
                    <li>Witness testimony, forensic reports, and documentary evidence play key roles.</li>
                    <li>The burden of proof lies on the prosecution — the accused is presumed innocent until proven guilty.</li>
                    <li>Trials can be:
                        <ul>
                            <li><strong>Sessions Trial:</strong> For serious offences like murder or rape.</li>
                            <li><strong>Warrant Trial:</strong> For offences punishable with imprisonment over two years.</li>
                            <li><strong>Summons Trial:</strong> For minor offences.</li>
                        </ul>
                    </li>
                </ul>
            </section>

            <section>
                <h3>6. Special Criminal Laws and Acts</h3>
                <ul>
                    <li><strong>Dowry Prohibition Act, 1961:</strong> Criminalizes giving or taking dowry.</li>
                    <li><strong>Prevention of Corruption Act, 1988:</strong> Penalizes bribery and abuse of power by public officials.</li>
                    <li><strong>NDPS Act, 1985:</strong> Regulates narcotic drugs and psychotropic substances.</li>
                    <li><strong>POCSO Act, 2012:</strong> Protects children from sexual abuse and exploitation.</li>
                    <li><strong>Domestic Violence Act, 2005:</strong> Protects women from domestic abuse.</li>
                    <li><strong>SC/ST (Prevention of Atrocities) Act, 1989:</strong> Prevents caste-based crimes.</li>
                    <li><strong>IT Act, 2000:</strong> Addresses cybercrimes and digital evidence.</li>
                    <li><strong>Juvenile Justice (Care and Protection) Act, 2015:</strong> Governs offences by minors.</li>
                </ul>
            </section>

            <section>
                <h3>7. Punishments Under IPC</h3>
                <p>
                    As per <strong>Section 53 of the Indian Penal Code</strong>, punishments include:
                </p>
                <ul>
                    <li>Death penalty (for rarest of rare crimes).</li>
                    <li>Life imprisonment.</li>
                    <li>Rigorous or simple imprisonment.</li>
                    <li>Forfeiture of property.</li>
                    <li>Fines or penalties.</li>
                </ul>
            </section>

            <section>
                <h3>8. Role of Police and Courts</h3>
                <ul>
                    <li><strong>Police:</strong> Investigate offences, collect evidence, maintain order, and file charge sheets.</li>
                    <li><strong>Magistrates:</strong> Handle minor offences, bail applications, and committal of serious cases to Sessions Courts.</li>
                    <li><strong>Sessions Courts:</strong> Conduct trials for major crimes like murder, rape, and robbery.</li>
                    <li><strong>High Courts & Supreme Court:</strong> Handle appeals and constitutional matters.</li>
                </ul>
            </section>

            <section>
                <h3>9. Rights of Victims</h3>
                <ul>
                    <li>Right to file an FIR and receive a copy.</li>
                    <li>Right to fair investigation and speedy trial.</li>
                    <li>Right to compensation under the <strong>Victim Compensation Scheme (Section 357A CrPC)</strong>.</li>
                    <li>Right to protection and anonymity (especially in sexual assault cases).</li>
                    <li>Right to appeal against acquittal of accused.</li>
                </ul>
            </section>

            <section>
                <h3>10. Legal Remedies and Assistance</h3>
                <ul>
                    <li>File an FIR or private complaint in the nearest police station or magistrate court.</li>
                    <li>Approach the <strong>District Legal Services Authority (DLSA)</strong> for free legal aid.</li>
                    <li>Seek anticipatory bail from the Sessions or High Court if wrongful arrest is anticipated.</li>
                    <li>File a writ petition in the High Court under <strong>Article 226</strong> or Supreme Court under <strong>Article 32</strong> for violation of fundamental rights.</li>
                </ul>
            </section>

            <section>
                <p>
                    <em>
                        Disclaimer: This guide is intended for general informational purposes only. 
                        It does not constitute legal advice. Consult a qualified criminal law advocate for case-specific assistance.
                    </em>
                </p>
            </section>
        </GuidePageLayout>
    );
};

export default GuideCriminalPage;
