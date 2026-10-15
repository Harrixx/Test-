// Legal pages transcribed from shepleyspring.co.uk (15 October 2026), with obvious typos
// corrected and British spellings. Included for completeness of the concept: the company's
// advisers should review them before launch (the privacy policy still refers to EU law and
// the CCPA rather than UK GDPR and the ICO).

export type LegalBlock = { type: "p" | "sub"; text: string };
export type LegalSection = { id: string; number: string | null; heading: string; blocks: LegalBlock[] };

export const privacy: LegalSection[] = [
  {
    "id": "about-this-policy",
    "number": "1",
    "heading": "About this policy",
    "blocks": [
      {
        "type": "p",
        "text": "Shepley Spring, together with other members of its group (we/us/our) are committed to safeguarding the privacy of our customers and users (you/your) who visit our websites (the Websites). This privacy policy (the Privacy Policy) sets out our personal information collection and sharing practices for our websites and is intended to inform you of the ways in which the Websites collect personal information, the uses of that personal information and the ways in which we will share any personal information you choose to provide to us."
      },
      {
        "type": "p",
        "text": "If you are an existing customer of ours, further details about how we use your personal information is set out in your customer contract with us. Further notices highlighting certain uses we wish to make of your personal information together with the ability to opt in or out of selected uses may also be provided when we collect personal information from you."
      },
      {
        "type": "p",
        "text": "Our websites may contain links to other third party websites. If you follow a link to any of those third-party websites, please note that they have their own privacy policies and that we do not accept any responsibility or liability for their policies or processing of your personal information. Please check these policies before you submit any personal information to such third-party websites."
      },
      {
        "type": "p",
        "text": "This Privacy Policy is intended to explain our privacy practices and covers the following areas:"
      }
    ]
  },
  {
    "id": "information-we-may-collect-about-you",
    "number": "2",
    "heading": "Information we may collect about you",
    "blocks": [
      {
        "type": "p",
        "text": "We will collect and process all or some of the following personal information about you:"
      },
      {
        "type": "p",
        "text": "(a) Information you provide to us"
      },
      {
        "type": "p",
        "text": "Personal information that you provide to us, such as when using the contact form on our websites, including your name, email address, and other contact details;"
      },
      {
        "type": "p",
        "text": "(b) Our correspondence"
      },
      {
        "type": "p",
        "text": "If you contact us, we will typically keep a record of that correspondence;"
      },
      {
        "type": "p",
        "text": "(c) Website and communication usage"
      },
      {
        "type": "p",
        "text": "Details of your visits to the websites and information collected through cookies and other tracking technologies including, but not limited to, your IP address and domain name, your browser version and operating system, traffic data, location data, web logs and other communication data, and the resources that you access."
      }
    ]
  },
  {
    "id": "uses-made-of-your-personal-information",
    "number": "3",
    "heading": "Uses made of your personal information",
    "blocks": [
      {
        "type": "p",
        "text": "In this section, we set out the purposes for which we use personal information that we collect via our websites and, in compliance with our obligations under European law, identify the “legal grounds” on which we rely to process the information."
      },
      {
        "type": "p",
        "text": "These “legal grounds” are set out in European Data Protection Law, which allows companies to process personal data only when the processing is permitted by the specific “legal grounds” set out in law."
      },
      {
        "type": "p",
        "text": "Please note that in addition to the disclosures we have identified below, we may disclose personal information for the purposes we explain in this notice to service providers, contractors, agents, advisors (e.g. legal, financial, business or other advisors) and affiliates of Shepley Spring that perform activities on our behalf."
      },
      {
        "type": "p",
        "text": "(a) To communicate effectively with you and conduct our business"
      },
      {
        "type": "p",
        "text": "To conduct our business, including to respond to your queries, to otherwise communicate with you, or to carry out our obligations arising from any agreements entered into between you and us;"
      },
      {
        "type": "p",
        "text": "Use justification:"
      },
      {
        "type": "p",
        "text": "(b) Contract performance, legitimate interest (to enable us to perform our obligations and provide our services to you)"
      },
      {
        "type": "p",
        "text": "To provide you with updates and offers, where you have chosen to receive these. We may also use your information for marketing our own and our selected business partners’ products and services to you by post, email, SMS, phone and fax and, where required by law, we will ask for your consent at the time we collect your data to conduct any of these types of marketing. We will provide an option to unsubscribe or opt-out of further communication on any electronic marketing communication sent to you or you may opt out by contacting us through the “GDPR Contacting Us” form."
      },
      {
        "type": "p",
        "text": "(c) For research and development purposes"
      },
      {
        "type": "p",
        "text": "To analyse your personal information in order to better understand your and our other clients’ services and marketing requirements, to better understand our business and develop our products and services;"
      },
      {
        "type": "p",
        "text": "(d) To monitor certain activities"
      },
      {
        "type": "p",
        "text": "To monitor queries and transactions to ensure service quality, compliance with procedures and to combat fraud;"
      },
      {
        "type": "p",
        "text": "(e) To inform you of changes"
      },
      {
        "type": "p",
        "text": "To notify you about changes to our services and products;"
      },
      {
        "type": "p",
        "text": "(f) To ensure website content is relevant"
      },
      {
        "type": "p",
        "text": "To ensure that content from our websites is presented in the most effective manner for you and for your device, which may include passing your data to business partners, suppliers and/or service providers;"
      },
      {
        "type": "p",
        "text": "(g) To reorganise or make changes to our business"
      },
      {
        "type": "p",
        "text": "In the event that we: (i) are subject to negotiations for the sale of our business or part thereof to a third party; (ii) are sold to a third party; or (iii) undergo a reorganisation, we may need to transfer some or all of your personal information to the relevant third party (or its advisors) as part of any due diligence process for the purpose of analyzing any proposed sale or reorganisation. We may also need to transfer your personal information to that re-organized entity or third party after the sale or reorganisation for them to use for the same purposes as set out in this policy."
      },
      {
        "type": "p",
        "text": "(h) In connection with legal or regulatory obligations"
      },
      {
        "type": "p",
        "text": "We may process your personal information to comply with our regulatory requirements or dialogue with regulators as applicable which may include disclosing your personal information to third parties, the court service and/or regulators or law enforcement agencies in connection with enquiries, proceedings or investigations by such parties anywhere in the world or where compelled to do so. Where permitted, we will direct any such request to you or notify you before responding unless to do so would prejudice the prevention or detection of a crime."
      }
    ]
  },
  {
    "id": "transmission-storage-and-security-of-your-personal-information",
    "number": "4",
    "heading": "Transmission, storage and security of your personal information",
    "blocks": [
      {
        "type": "sub",
        "text": "Security over the internet"
      },
      {
        "type": "p",
        "text": "No data transmission over the Internet or website can be guaranteed to be secure from intrusion. However, we maintain commercially reasonable physical, electronic and procedural safeguards to protect your personal information in accordance with data protection legislative requirements."
      },
      {
        "type": "p",
        "text": "All information you provide to us is stored on our or our subcontractors’ secure servers and accessed and used subject to our security policies and standards. Where we have given you (or where you have chosen) a password which enables you to access certain parts of our websites, you are responsible for keeping this password confidential and for complying with any other security procedures that we notify you of. We ask you not to share a password with anyone."
      },
      {
        "type": "sub",
        "text": "Export outside the EEA"
      },
      {
        "type": "p",
        "text": "Your personal information may be accessed by staff or suppliers in, transferred to, and/or stored at, a destination outside the country in which you are located, whose data protection laws may be of a lower standard than those in your country. We will, in all circumstances, safeguard personal information as set out in this Privacy Policy."
      },
      {
        "type": "p",
        "text": "Please contact us through the “GDPR Contacting Us” form below if you would like to see a copy of the specific safeguards applied to the export of your personal information."
      },
      {
        "type": "sub",
        "text": "Storage limits"
      },
      {
        "type": "p",
        "text": "Our retention periods for personal data are based on business needs and legal requirements. We retain personal data for as long as is necessary for the processing purpose(s) for which the information was collected, and any other permissible, related purpose. For example, we may retain certain transaction details and correspondence until the time limit for claims arising from the transaction has expired, or to comply with regulatory requirements regarding the retention of such data. When personal data is no longer needed, we either irreversibly anonymise the data (and we may further retain and use the anonymised information) or securely destroy the data."
      }
    ]
  },
  {
    "id": "your-rights-and-contacting-us",
    "number": "5",
    "heading": "Your rights & contacting us",
    "blocks": [
      {
        "type": "sub",
        "text": "Marketing"
      },
      {
        "type": "p",
        "text": "You have the right to ask us not to process your personal information for marketing purposes. From time to time, we will inform you if we intend to use your information for certain types of marketing activities, or if we intend to disclose your information to certain categories of third parties for such purposes. You can exercise your right to prevent such processing by not checking certain boxes on the forms we use to collect your personal information. You can also exercise the right at any time by contacting us as set out in the “GDPR Contacting Us” form below."
      },
      {
        "type": "sub",
        "text": "Updating information"
      },
      {
        "type": "p",
        "text": "We will use reasonable endeavours to ensure that your personal information is accurate. In order to assist us with this, you should notify us of any changes to the personal information that you have provided to us by contacting us as set out in the “GDPR Contacting Us” form below."
      },
      {
        "type": "sub",
        "text": "Your rights"
      },
      {
        "type": "p",
        "text": "If you have any questions in relation to our use of your personal information, you should first contact us as per the “GDPR Contacting Us” form below. Under certain conditions, you may have the right to require us to:"
      },
      {
        "type": "p",
        "text": "(a) provide you with further details on the use we make of your information;"
      },
      {
        "type": "p",
        "text": "(b) provide you with a copy of information that you have provided to us;"
      },
      {
        "type": "p",
        "text": "(c) update any inaccuracies in the personal information we hold (please see paragraph 5.2);"
      },
      {
        "type": "p",
        "text": "(d) delete any personal information that we no longer have a lawful ground to use;"
      },
      {
        "type": "p",
        "text": "(e) where processing is based on consent, to withdraw your consent so that we stop that particular processing (see paragraph 5.1 for marketing);"
      },
      {
        "type": "p",
        "text": "(f) object to any processing based on the legitimate interest ground unless our reasons for undertaking that processing outweigh any prejudice to your data protection rights; and"
      },
      {
        "type": "p",
        "text": "(g) restrict how we use your information whilst a complaint is being investigated."
      },
      {
        "type": "p",
        "text": "Your exercise of these rights is subject to certain exemptions to safeguard the public interest (e.g. the prevention or detection of crime) and our interests (e.g. the maintenance of legal privilege). If you exercise any of these rights, we will check your entitlement and respond in most cases within a month."
      },
      {
        "type": "p",
        "text": "If you are not satisfied with our use of your personal information or our response to any exercise of these rights you have the right to complain to: Contacting Us."
      },
      {
        "type": "sub",
        "text": "Contacting us"
      },
      {
        "type": "p",
        "text": "If you have any questions in relation to this policy, please contact us as per the “GDPR Contacting Us” form below."
      }
    ]
  },
  {
    "id": "cookies-policy",
    "number": "6",
    "heading": "Cookies policy",
    "blocks": [
      {
        "type": "p",
        "text": "We use cookies on the websites. To find out more about how we use cookies, please see our Cookies Policy."
      }
    ]
  },
  {
    "id": "changes-to-our-privacy-policy-and-or-cookies-policy",
    "number": "7",
    "heading": "Changes to our Privacy Policy and/or Cookies Policy",
    "blocks": [
      {
        "type": "p",
        "text": "We may change the content of our websites and how we use cookies and consequently our Privacy Policy and our Cookie Policy may change from time to time in the future. If we change this Privacy Policy or our Cookies Policy, we will update the date it was last changed below. If these changes are material, we will indicate this clearly on our Websites."
      }
    ]
  },
  {
    "id": "annex-legal-grounds",
    "number": null,
    "heading": "Annex: legal grounds",
    "blocks": [
      {
        "type": "p",
        "text": "Use of personal information under EU data protection laws must be justified under one of a number of legal “grounds” and we are required to set out the grounds in respect of each use in this policy. We note the grounds we use to justify each use of your information next to the use in the “Uses of your personal information” section of this policy."
      },
      {
        "type": "p",
        "text": "These are the principal legal grounds that justify our use of your information:"
      },
      {
        "type": "p",
        "text": "Consent: Where you have consented to our use of your information (you will have been presented with a consent form in relation to any such use and may withdraw your consent by contacting us as per the “GDPR Contacting Us” form below."
      },
      {
        "type": "p",
        "text": "Contract performance: Where your information is necessary to enter into or perform our contract with you."
      },
      {
        "type": "p",
        "text": "Legal obligation: Where we need to use your information to comply with our legal obligations."
      },
      {
        "type": "p",
        "text": "Legitimate interest: Where we use your information to achieve a legitimate interest and our reasons for using it outweigh any prejudice to your data protection rights."
      },
      {
        "type": "p",
        "text": "Legal claims: Where your information is necessary for us to defend, prosecute or make a claim against you, us or a third party."
      },
      {
        "type": "p",
        "text": "California Consumer Privacy Act (CCPA) On January 1, 2020 the state of California enacted the California Consumer Privacy Act (CCPA). This act further enhances existing consumer protection and privacy rights already covered by the California Online Privacy Protection Act (CalOPPA). As part of the CCPA you are in control of your data that we hold and you can exercise any of the following options in relation to this Personal Information (PI):"
      },
      {
        "type": "p",
        "text": "The Right to Disclose: You have the right to request we disclose to you the types and sources of information collected, the reason for sharing, and the type of third party with whom data was shared."
      },
      {
        "type": "p",
        "text": "The Right to Delete (or update):"
      },
      {
        "type": "p",
        "text": "You have the right to request that we delete (or update) personal information that we hold about you, subject to regulatory exceptions (such as auditing, accounting, etc.)."
      },
      {
        "type": "p",
        "text": "The Right to Access:"
      },
      {
        "type": "p",
        "text": "You have the right to access information about yourself that is collected, stored, and used by us or associated third parties."
      },
      {
        "type": "p",
        "text": "The Right to Opt-Out:"
      },
      {
        "type": "p",
        "text": "This is also known as the, “Do Not Sell My Personal Information” clause and gives you the right to opt out of your data being sold to third parties."
      },
      {
        "type": "p",
        "text": "Shepley Spring is providing a way for customers to enter CCPA related requests."
      }
    ]
  }
];

export const cookies: LegalSection[] = [
  {
    "id": "introduction",
    "number": null,
    "heading": "Introduction",
    "blocks": [
      {
        "type": "p",
        "text": "We sometimes place small data files called cookies on your device. Most big websites do this too."
      }
    ]
  },
  {
    "id": "what-is-a-cookie",
    "number": null,
    "heading": "What is a cookie?",
    "blocks": [
      {
        "type": "p",
        "text": "A cookie is a text file containing a small amount of data which is downloaded to your computer when you visit our website. The vast majority of websites use cookies and tracking technologies. Cookies are useful because they help us arrange the content and layout of our website and recognise those computers that have been to our website before. They allow us to remember your preference settings and play an important role in helping us to enhance the usability and performance of our website and your experience using it. Some cookies are also essential to enable you to move around our website and use its features. They also help us to identify which of our webpages are the most popular and the types of journey visitors have to our website."
      }
    ]
  },
  {
    "id": "how-do-we-use-cookies",
    "number": null,
    "heading": "How do we use cookies?",
    "blocks": [
      {
        "type": "p",
        "text": "When you access our website, you will receive a message advising you that we have placed some cookies on your computer. If you continue to use our website, further cookies may be placed on your computer to optimise your experience on our website and to help us understand how we can improve them."
      },
      {
        "type": "p",
        "text": "If you don’t want us to place cookies on your computer then there are a number of ways you can opt out – setting your browser either to reject all cookies, to only allow “trusted” sites to set them, to accept only those cookies from those websites which you are currently on."
      },
      {
        "type": "p",
        "text": "The cookies on our site are broken down into three categories – Essential, Advertising and Analytics. Essential cookies are needed for our site to function, and can therefore not be turned off. All other cookies can be turned off, if desired. Please remember – if you do delete all your cookies, some features of our website will not work and your experience on our website may be affected."
      },
      {
        "type": "p",
        "text": "We like the website www.aboutcookies.org which is run by the law firm Pinsent Masons. Not only does it have the recipe for ‘the world’s finest cookies’, it also gives you detailed step by step guidance on how to control and delete cookies depending on your browser type. You can then adjust your browser settings to your preferred level of protection."
      }
    ]
  },
  {
    "id": "our-classification-of-cookies",
    "number": null,
    "heading": "Our classification of cookies",
    "blocks": [
      {
        "type": "p",
        "text": "We have reviewed all the cookies we use and have divided them into three categories:"
      },
      {
        "type": "sub",
        "text": "Essential"
      },
      {
        "type": "sub",
        "text": "Advertising"
      },
      {
        "type": "sub",
        "text": "Analytics"
      }
    ]
  },
  {
    "id": "essential",
    "number": null,
    "heading": "Essential",
    "blocks": [
      {
        "type": "p",
        "text": "These cookies are essential to enable you to move around our website and use its features. Without these cookies, our website won’t work properly."
      }
    ]
  },
  {
    "id": "advertising",
    "number": null,
    "heading": "Advertising",
    "blocks": [
      {
        "type": "p",
        "text": "We do not accept advertising from any other organisation on our website."
      },
      {
        "type": "p",
        "text": "Cookies also help us to identify which of our blog posts are the most popular and the types of journey visitors have to our website."
      }
    ]
  },
  {
    "id": "analytics",
    "number": null,
    "heading": "Analytics",
    "blocks": [
      {
        "type": "p",
        "text": "Our analytics cookies collect anonymous and aggregated information about how visitors use our website and help us improve how our website works."
      }
    ]
  },
  {
    "id": "how-to-control-cookies",
    "number": null,
    "heading": "How to control cookies",
    "blocks": [
      {
        "type": "p",
        "text": "You can control and/or delete these cookies as you wish – for details, we advise you go to aboutcookies.org as we mentioned before. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed. If you do this, however, you may have to manually adjust some preferences every time you visit a site and some services and functionalities may not work. In accordance with the General Data Protection Regulation, we will not store your cookies for any longer than we believe is necessary."
      }
    ]
  }
];

export const modernSlavery: LegalSection[] = [
  {
    "id": "introduction",
    "number": null,
    "heading": "Introduction",
    "blocks": [
      {
        "type": "p",
        "text": "This Modern Slavery and Human Trafficking Statement is a response to Section 54(1), Part 6 of the Modern Slavery Act 2015 and relates to any actions and activities involving any employee of Shepley Spring Ltd."
      },
      {
        "type": "p",
        "text": "Modern slavery is a crime and a violation of fundamental human rights. It takes many forms including slavery, servitude, forced and compulsory labour and human trafficking, all of which involve the deprivation of a person’s liberty by another in order to exploit them for personal or commercial gain."
      },
      {
        "type": "p",
        "text": "Shepley Spring Ltd takes a zero-tolerance approach to modern slavery, and we are committed to acting ethically and with integrity in all our business dealings and relationships, as well as implementing and enforcing effective systems and controls to ensure modern slavery does not exist anywhere in our own business or our supply chains."
      },
      {
        "type": "p",
        "text": "We are also committed to ensuring transparency in our own operations and in our approach to combating modern slavery throughout our supply chains, in accordance with our disclosure obligations under the Modern Slavery Act."
      },
      {
        "type": "p",
        "text": "We expect the same high standards from all our contractors, suppliers, and other business partners, we will continue to include specific prohibitions against the use of forced, compulsory, or trafficked labour, as well as anyone held in slavery or servitude, whether adults or children, in our contracting processes, and we expect our suppliers to hold their own suppliers to the same high standards."
      },
      {
        "type": "p",
        "text": "This policy applies to all individuals who work for us or on behalf in any capacity, including employees at all levels, directors, officers, agency workers, seconded workers, volunteers, interns, agents, contractors, external consultants, third-party representatives, and business partners."
      },
      {
        "type": "p",
        "text": "This policy is not part of any employee’s employment contract, and we reserve the right to change it at any time."
      }
    ]
  },
  {
    "id": "policy-responsibilities",
    "number": null,
    "heading": "Policy Responsibilities",
    "blocks": [
      {
        "type": "p",
        "text": "Shepley Spring Ltd is ultimately responsible for ensuring that this policy conforms with our legal and ethical commitments, as well as that all people under our control abide by it."
      },
      {
        "type": "p",
        "text": "Shepley Spring Ltd is in charge of implementing this policy on daily basis, monitoring its usage and effectiveness, dealing with any questions about it, and reviewing internal control systems and processes to ensure they are successful in combating modern slavery."
      },
      {
        "type": "p",
        "text": "Management at all levels is responsible for ensuring that people reporting to them understand and comply with this policy, as well as ensuring receipt of regular and ongoing training on the subject of modern slavery in supply chains."
      }
    ]
  }
];

