import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

# Output directory for company single-PDF dossiers
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "sample-documents", "company-bids")
os.makedirs(OUTPUT_DIR, exist_ok=True)

COMPANIES = [
    {
        "id": "comp-01",
        "name": "Pragati Micro Control Systems Proprietorship",
        "shortName": "Pragati_Micro_Control_Systems",
        "pan": "WKMCP4023I",
        "gstin": "07WKMCP4023I9ZY",
        "udyam": "UDYAM-DL-03-0019482",
        "turnover": "INR 9.74 Crore",
        "dcrContent": "68.00%",
        "solarCapacity": "65 MW",
        "oem": "Waaree Energies Ltd",
        "debarmentStatus": "CLEAN / NOT DEBARRED",
        "statusType": "VALID / COMPLIANT",
    },
    {
        "id": "comp-02",
        "name": "Tata Power Renewable Energy Limited",
        "shortName": "Tata_Power_Renewable_Energy",
        "pan": "AAACT2949K",
        "gstin": "27AAACT2949K1ZY",
        "udyam": "UDYAM-MH-18-0091823",
        "turnover": "INR 412.84 Crore",
        "dcrContent": "72.00%",
        "solarCapacity": "500 MW",
        "oem": "Tata Power Solar Systems",
        "debarmentStatus": "CLEAN / NOT DEBARRED",
        "statusType": "VALID / COMPLIANT",
    },
    {
        "id": "comp-03",
        "name": "Waaree Energies Limited",
        "shortName": "Waaree_Energies_Limited",
        "pan": "AAACW8821B",
        "gstin": "27AAACW8821B1Z2",
        "udyam": "UDYAM-GJ-01-0028194",
        "turnover": "INR 285.50 Crore",
        "dcrContent": "80.00%",
        "solarCapacity": "350 MW",
        "oem": "Waaree In-House Solar Cells",
        "debarmentStatus": "CLEAN / NOT DEBARRED",
        "statusType": "VALID / COMPLIANT",
    },
    {
        "id": "comp-04",
        "name": "Adani Green Energy Infrastructure Ltd",
        "shortName": "Adani_Green_Energy",
        "pan": "AAACA1092M",
        "gstin": "24AAACA1092M1ZX",
        "udyam": "UDYAM-GJ-04-0012903",
        "turnover": "INR 520.10 Crore",
        "dcrContent": "75.00%",
        "solarCapacity": "750 MW",
        "oem": "Mundra Solar PV Ltd",
        "debarmentStatus": "CLEAN / NOT DEBARRED",
        "statusType": "VALID / COMPLIANT",
    },
    {
        "id": "comp-05",
        "name": "Sterling and Wilson Renewable Energy Ltd",
        "shortName": "Sterling_and_Wilson_Renewable",
        "pan": "AAACS4920L",
        "gstin": "27AAACS4920L1ZA",
        "udyam": "UDYAM-MH-19-0048102",
        "turnover": "INR 185.20 Crore",
        "dcrContent": "64.00%",
        "solarCapacity": "200 MW",
        "oem": "LONGi Solar Technologies",
        "debarmentStatus": "CLEAN / NOT DEBARRED",
        "statusType": "VALID / COMPLIANT",
    },
    {
        "id": "comp-06",
        "name": "Vikram Solar Limited",
        "shortName": "Vikram_Solar_Limited",
        "pan": "AAACV1290K",
        "gstin": "19AAACV1290K1Z8",
        "udyam": "UDYAM-WB-10-0039102",
        "turnover": "INR 142.80 Crore",
        "dcrContent": "65.00%",
        "solarCapacity": "180 MW",
        "oem": "Vikram Solar PERC Tech",
        "debarmentStatus": "CLEAN / NOT DEBARRED",
        "statusType": "VALID / COMPLIANT",
    },
    {
        "id": "comp-07",
        "name": "ReNew Power Private Limited",
        "shortName": "ReNew_Power_Private_Limited",
        "pan": "AAACR4410P",
        "gstin": "07AAACR4410P1Z6",
        "udyam": "UDYAM-DL-05-0071928",
        "turnover": "INR 390.60 Crore",
        "dcrContent": "70.00%",
        "solarCapacity": "400 MW",
        "oem": "ReNew Solar Manufacturing",
        "debarmentStatus": "CLEAN / NOT DEBARRED",
        "statusType": "VALID / COMPLIANT",
    },
    {
        "id": "comp-08",
        "name": "Azure Power India Private Limited",
        "shortName": "Azure_Power_India",
        "pan": "AAACA9928J",
        "gstin": "07AAACA9928J1ZB",
        "udyam": "UDYAM-DL-02-0041829",
        "turnover": "INR 210.40 Crore",
        "dcrContent": "66.00%",
        "solarCapacity": "250 MW",
        "oem": "First Solar Malaysia / India",
        "debarmentStatus": "CLEAN / NOT DEBARRED",
        "statusType": "VALID / COMPLIANT",
    },
    {
        "id": "comp-09",
        "name": "Goldi Solar Private Limited",
        "shortName": "Goldi_Solar_Private_Limited",
        "pan": "AAACG5512N",
        "gstin": "24AAACG5512N1ZY",
        "udyam": "UDYAM-GJ-06-0018293",
        "turnover": "INR 95.30 Crore",
        "dcrContent": "62.00%",
        "solarCapacity": "120 MW",
        "oem": "Goldi HELOC Pro Modules",
        "debarmentStatus": "CLEAN / NOT DEBARRED",
        "statusType": "VALID / COMPLIANT",
    },
    {
        "id": "comp-10",
        "name": "Premier Energies Limited",
        "shortName": "Premier_Energies_Limited",
        "pan": "AAACP8849F",
        "gstin": "36AAACP8849F1Z3",
        "udyam": "UDYAM-TS-09-0028194",
        "turnover": "INR 115.70 Crore",
        "dcrContent": "67.00%",
        "solarCapacity": "150 MW",
        "oem": "Premier Energies Solar Cell Line",
        "debarmentStatus": "CLEAN / NOT DEBARRED",
        "statusType": "VALID / COMPLIANT",
    },
    {
        "id": "comp-11",
        "name": "Solex Energy Limited",
        "shortName": "Solex_Energy_Limited",
        "pan": "AAACS1182H",
        "gstin": "24AAACS1182H1Z5",
        "udyam": "UDYAM-GJ-02-0091827",
        "turnover": "INR 48.20 Crore",
        "dcrContent": "58.00%",
        "solarCapacity": "50 MW",
        "oem": "Solex Tapi Series",
        "debarmentStatus": "CLEAN / NOT DEBARRED",
        "statusType": "REVIEW REQUIRED (Minor DCR Shortfall)",
    },
    {
        "id": "comp-12",
        "name": "Gensol Engineering Limited",
        "shortName": "Gensol_Engineering_Limited",
        "pan": "AAACG3391K",
        "gstin": "24AAACG3391K1Z1",
        "udyam": "UDYAM-GJ-08-0038192",
        "turnover": "INR 68.40 Crore",
        "dcrContent": "61.00%",
        "solarCapacity": "90 MW",
        "oem": "Gensol EPC Contracting",
        "debarmentStatus": "CLEAN / NOT DEBARRED",
        "statusType": "VALID / COMPLIANT",
    },
    {
        "id": "comp-13",
        "name": "SolarPack Energy India Pvt Ltd",
        "shortName": "SolarPack_Energy_India",
        "pan": "AAACS9942R",
        "gstin": "07AAACS9942R1Z9",
        "udyam": "UDYAM-DL-08-0019284",
        "turnover": "INR 32.10 Crore",
        "dcrContent": "34.00%",
        "solarCapacity": "30 MW",
        "oem": "Imported Cell Assembly (China)",
        "debarmentStatus": "CLEAN / NOT DEBARRED",
        "statusType": "FAIL (DCR Local Content Violation 34% < 60%)",
    },
    {
        "id": "comp-14",
        "name": "Jakson Green Private Limited",
        "shortName": "Jakson_Green_Private_Limited",
        "pan": "AAACJ6631Q",
        "gstin": "07AAACJ6631Q1Z7",
        "udyam": "UDYAM-UP-12-0058192",
        "turnover": "INR 155.00 Crore",
        "dcrContent": "69.00%",
        "solarCapacity": "160 MW",
        "oem": "Jakson Solar PV Line",
        "debarmentStatus": "CLEAN / NOT DEBARRED",
        "statusType": "VALID / COMPLIANT",
    },
    {
        "id": "comp-15",
        "name": "State Grid Power Equipment Discrepant Ltd",
        "shortName": "State_Grid_Power_Equipment_Discrepant",
        "pan": "AAACS0006K",
        "gstin": "07AAACS0006K1Z0",
        "udyam": "UDYAM-DL-99-0099999",
        "turnover": "INR 88.00 Crore",
        "dcrContent": "40.00%",
        "solarCapacity": "40 MW",
        "oem": "State Grid Inverters",
        "debarmentStatus": "NON_COMPLIANT / DEBARRED",
        "statusType": "FAIL (Debarred by State Grid & CPPP Portal)",
    },
]

def build_pdf_for_company(comp):
    filename = f"{comp['shortName']}_Complete_10Doc_Filing.pdf"
    filepath = os.path.join(OUTPUT_DIR, filename)

    doc = SimpleDocTemplate(
        filepath,
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    # Custom typography styles
    titleStyle = ParagraphStyle(
        'CoverTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=colors.HexColor('#0b5f96'),
        spaceAfter=6
    )
    docTitleStyle = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=colors.HexColor('#0f2942'),
        spaceAfter=4
    )
    normalStyle = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor('#2d3748')
    )
    boldStyle = ParagraphStyle(
        'BodyBoldCustom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor('#0f2942')
    )
    badgeStyle = ParagraphStyle(
        'BadgeText',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        textColor=colors.HexColor('#0b5f96')
    )

    story = []

    # =========================================================================
    # COVER / DOSSIER INDEX (PAGE 1)
    # =========================================================================
    story.append(Paragraph(f"BIDSETU — INTEGRATED PROCUREMENT TECHNICAL FILING DOSSIER", titleStyle))
    story.append(Paragraph(f"Tender Ref: <b>TND-2026-MNRE-0842</b> | Category: <b>Solar PV & Energy Storage</b>", normalStyle))
    story.append(Spacer(1, 8))

    meta_table_data = [
        [Paragraph("<b>Bidder Legal Entity Name:</b>", boldStyle), Paragraph(comp['name'], normalStyle)],
        [Paragraph("<b>Permanent Account Number (PAN):</b>", boldStyle), Paragraph(comp['pan'], normalStyle)],
        [Paragraph("<b>GSTIN Registration Number:</b>", boldStyle), Paragraph(comp['gstin'], normalStyle)],
        [Paragraph("<b>MSME Udyam Registration Ref:</b>", boldStyle), Paragraph(comp['udyam'], normalStyle)],
        [Paragraph("<b>Declared Financial Turnover:</b>", boldStyle), Paragraph(comp['turnover'], normalStyle)],
        [Paragraph("<b>Make in India Local Content:</b>", boldStyle), Paragraph(comp['dcrContent'], normalStyle)],
        [Paragraph("<b>Debarment Registry Status:</b>", boldStyle), Paragraph(comp['debarmentStatus'], normalStyle)],
        [Paragraph("<b>Evaluation Expectation:</b>", boldStyle), Paragraph(f"<b>{comp['statusType']}</b>", normalStyle)],
    ]

    t_meta = Table(meta_table_data, colWidths=[180, 360])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#cbd7e0')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2eaf0')),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 12))

    story.append(Paragraph("<b>COMPREHENSIVE 10-DOCUMENT ATTACHMENT INDEX:</b>", docTitleStyle))
    index_data = [
        ["Doc #", "Compliance Requirement Category", "Attached Document Title", "Page Ref"],
        ["01", "GST Registration & Active Status", f"GSTIN Certificate ({comp['gstin']})", "Page 2"],
        ["02", "Permanent Account Number (PAN)", f"Income Tax PAN Card ({comp['pan']})", "Page 3"],
        ["03", "Audited Financial Turnover", f"CA Turnover Certificate ({comp['turnover']})", "Page 4"],
        ["04", "Technical Equipment Specification", f"MonoPERC Solar Datasheet (21.8% Eff)", "Page 5"],
        ["05", "OEM Authorization Form (MAF)", f"OEM Letter ({comp['oem']})", "Page 6"],
        ["06", "MSME / Udyam Registration", f"Udyam Certificate ({comp['udyam']})", "Page 7"],
        ["07", "Make in India DCR Declaration", f"Local Content Declaration ({comp['dcrContent']})", "Page 8"],
        ["08", "Non-Blacklisting Sworn Affidavit", f"Debarment Affidavit ({comp['debarmentStatus']})", "Page 9"],
        ["09", "Quality Assurance & ISO Cert", f"ISO 9001:2015 Quality Certificate", "Page 10"],
        ["10", "EPFO & ESIC Compliance Challan", f"Statutory Social Security ECR Return", "Page 11"],
    ]

    t_idx = Table(index_data, colWidths=[40, 180, 260, 60])
    t_idx.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#0f2942')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 9),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('ALIGN', (3,0), (3,-1), 'CENTER'),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd7e0')),
        ('PADDING', (0,0), (-1,-1), 4.5),
    ]))
    story.append(t_idx)

    # Helper function to generate document header bar
    def add_doc_header(doc_num, doc_title, category):
        story.append(PageBreak())
        header_table = Table([
            [Paragraph(f"<b>DOCUMENT #{doc_num} OF 10: {doc_title.upper()}</b>", ParagraphStyle('HeaderTxt', fontName='Helvetica-Bold', fontSize=11, textColor=colors.white)),
             Paragraph(f"Category: <b>{category}</b>", ParagraphStyle('CatTxt', fontName='Helvetica-Bold', fontSize=9, textColor=colors.HexColor('#edf7ff'), alignment=2))]
        ], colWidths=[360, 180])
        header_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#0b5f96')),
            ('PADDING', (0,0), (-1,-1), 6),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ]))
        story.append(header_table)
        story.append(Spacer(1, 10))

    # =========================================================================
    # DOCUMENT 1: GST CERTIFICATE (PAGE 2)
    # =========================================================================
    add_doc_header("01", "GST Registration Certificate", "ELIGIBILITY")
    story.append(Paragraph("<b>FORM GST REG-06: REGISTRATION CERTIFICATION</b>", docTitleStyle))
    story.append(Paragraph(f"Government of India — Goods and Services Tax Network (GSTN)", normalStyle))
    story.append(Spacer(1, 8))

    gst_data = [
        [Paragraph("<b>Registration Number (GSTIN):</b>", boldStyle), Paragraph(f"<b>{comp['gstin']}</b>", normalStyle)],
        [Paragraph("<b>Legal Name of Business:</b>", boldStyle), Paragraph(comp['name'], normalStyle)],
        [Paragraph("<b>Trade Name:</b>", boldStyle), Paragraph(comp['name'], normalStyle)],
        [Paragraph("<b>Constitution of Business:</b>", boldStyle), Paragraph("Private Limited / Proprietorship / Public Enterprise", normalStyle)],
        [Paragraph("<b>Address of Principal Place:</b>", boldStyle), Paragraph("Plot No 48, Sector 12, Industrial Area, New Delhi - 110075", normalStyle)],
        [Paragraph("<b>Date of Validity:</b>", boldStyle), Paragraph("01/07/2017 to Perpetual Active Status", normalStyle)],
        [Paragraph("<b>Taxpayer Type & Jurisdiction:</b>", boldStyle), Paragraph("Regular Taxpayer | State Tax Ward Delhi / Central GST Range", normalStyle)],
        [Paragraph("<b>Verification Portal Code:</b>", boldStyle), Paragraph("GST_REG_06 (Statutory DATASETU Indexed)", normalStyle)],
    ]
    t_gst = Table(gst_data, colWidths=[180, 360])
    t_gst.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd7e0')),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_gst)
    story.append(Spacer(1, 15))
    story.append(Paragraph("<i>Note: Certified true copy of GST Registration Certificate issued under Section 25(1) of the Central Goods and Services Tax Act, 2017. Verified against GSTN Portal.</i>", normalStyle))

    # =========================================================================
    # DOCUMENT 2: PAN CARD (PAGE 3)
    # =========================================================================
    add_doc_header("02", "Permanent Account Number (PAN)", "ELIGIBILITY")
    story.append(Paragraph("<b>INCOME TAX DEPARTMENT — GOVERNMENT OF INDIA</b>", docTitleStyle))
    story.append(Paragraph("Permanent Account Number Card Copy", normalStyle))
    story.append(Spacer(1, 8))

    pan_data = [
        [Paragraph("<b>Permanent Account Number (PAN):</b>", boldStyle), Paragraph(f"<b>{comp['pan']}</b>", normalStyle)],
        [Paragraph("<b>Name on PAN Card:</b>", boldStyle), Paragraph(comp['name'], normalStyle)],
        [Paragraph("<b>Category / Entity Type:</b>", boldStyle), Paragraph("Company / Firm / Registered Taxpayer", normalStyle)],
        [Paragraph("<b>Date of Incorporation / Issuance:</b>", boldStyle), Paragraph("12/08/2015", normalStyle)],
        [Paragraph("<b>ITR Filing Status (AY 2025-26):</b>", boldStyle), Paragraph("FILED & VERIFIED (Ack Ref: SYN-ITR-2025)", normalStyle)],
        [Paragraph("<b>Income Tax Portal Status:</b>", boldStyle), Paragraph("VALID & ACTIVE", normalStyle)],
    ]
    t_pan = Table(pan_data, colWidths=[180, 360])
    t_pan.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd7e0')),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_pan)
    story.append(Spacer(1, 15))
    story.append(Paragraph("<i>Notice: This card copy is submitted as proof of identity and statutory tax registration for GeM Tender TND-2026-MNRE-0842.</i>", normalStyle))

    # =========================================================================
    # DOCUMENT 3: CA TURNOVER CERTIFICATE (PAGE 4)
    # =========================================================================
    add_doc_header("03", "Audited Financial Turnover Certificate", "FINANCIAL")
    story.append(Paragraph("<b>CHARTERED ACCOUNTANT STATUTORY TURNOVER CERTIFICATE</b>", docTitleStyle))
    story.append(Paragraph("Independent Auditor Certificate on Annual Financial Statements", normalStyle))
    story.append(Spacer(1, 8))

    fin_data = [
        [Paragraph("<b>Financial Year</b>", boldStyle), Paragraph("<b>Audited Turnover (INR)</b>", boldStyle), Paragraph("<b>Net Worth (INR)</b>", boldStyle)],
        [Paragraph("FY 2022-2023", normalStyle), Paragraph(comp['turnover'], normalStyle), Paragraph("INR 42.50 Cr", normalStyle)],
        [Paragraph("FY 2023-2024", normalStyle), Paragraph(comp['turnover'], normalStyle), Paragraph("INR 48.20 Cr", normalStyle)],
        [Paragraph("FY 2024-2025", normalStyle), Paragraph(comp['turnover'], normalStyle), Paragraph("INR 54.10 Cr", normalStyle)],
    ]
    t_fin = Table(fin_data, colWidths=[160, 190, 190])
    t_fin.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#e2eaf0')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd7e0')),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_fin)
    story.append(Spacer(1, 12))
    story.append(Paragraph(f"<b>CA UDIN Reference:</b> 259810234AKLWO9182 | <b>Auditor Firm:</b> Mehta & Singhal Chartered Accountants (FRN: 018492N)", normalStyle))
    story.append(Paragraph(f"We hereby certify that we have examined the audited financial books of M/s {comp['name']} (PAN: {comp['pan']}). The annual turnover figures stated above are true and correct as per audited balance sheets.", normalStyle))

    # =========================================================================
    # DOCUMENT 4: TECHNICAL SPECIFICATION DATASHEET (PAGE 5)
    # =========================================================================
    add_doc_header("04", "Technical Module Specification Datasheet", "TECHNICAL")
    story.append(Paragraph("<b>TIER-1 MONO-PERC SOLAR PV MODULE TECHNICAL SPECIFICATION</b>", docTitleStyle))
    story.append(Paragraph("Product Datasheet & Measured Efficiency Parameters", normalStyle))
    story.append(Spacer(1, 8))

    tech_data = [
        [Paragraph("<b>Module Model Series:</b>", boldStyle), Paragraph("High-Efficiency Mono-PERC Half-Cut Cell Series 550Wp", normalStyle)],
        [Paragraph("<b>Measured Module Efficiency (STC):</b>", boldStyle), Paragraph("<b>21.80% (Exceeds mandatory >= 21.50% threshold)</b>", normalStyle)],
        [Paragraph("<b>Power Output Range:</b>", boldStyle), Paragraph("540Wp - 555Wp (Positive Tolerance +3%)", normalStyle)],
        [Paragraph("<b>Cell Technology:</b>", boldStyle), Paragraph("144 Half-Cut Monocrystalline PERC Solar Cells", normalStyle)],
        [Paragraph("<b>Temperature Coefficient (Pmax):</b>", boldStyle), Paragraph("-0.34% / °C", normalStyle)],
        [Paragraph("<b>Junction Box Protection Rating:</b>", boldStyle), Paragraph("IP68 Rated (3 Bypass Diodes)", normalStyle)],
        [Paragraph("<b>IEC Compliance Certifications:</b>", boldStyle), Paragraph("IEC 61215:2021, IEC 61730-1 & 2 (TÜV Rheinland Certified)", normalStyle)],
    ]
    t_tech = Table(tech_data, colWidths=[200, 340])
    t_tech.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd7e0')),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_tech)
    story.append(Spacer(1, 15))
    story.append(Paragraph("<i>Guaranteed Performance Ratio (PR) >= 78.5% under standard operation conditions with 25-Year Linear Power Warranty.</i>", normalStyle))

    # =========================================================================
    # DOCUMENT 5: OEM AUTHORIZATION LETTER (PAGE 6)
    # =========================================================================
    add_doc_header("05", "Manufacturer Authorization Form (MAF)", "CERTIFICATION")
    story.append(Paragraph("<b>MANUFACTURER AUTHORIZATION LETTER FOR TENDER</b>", docTitleStyle))
    story.append(Paragraph(f"Issued by OEM: <b>{comp['oem']}</b>", normalStyle))
    story.append(Spacer(1, 8))

    story.append(Paragraph(f"To,<br/>The General Manager (Procurement),<br/>Ministry of New and Renewable Energy (MNRE), New Delhi.", normalStyle))
    story.append(Spacer(1, 8))
    story.append(Paragraph(f"We, <b>{comp['oem']}</b>, who are established and reputable manufacturers of Tier-1 Solar Photovoltaic Modules and Central Inverters, having manufacturing facilities at Industrial Park, India, do hereby authorize <b>M/s {comp['name']}</b> (PAN: {comp['pan']}) to submit a bid and negotiate contracts for Tender Ref: <b>TND-2026-MNRE-0842</b>.", normalStyle))
    story.append(Spacer(1, 10))
    story.append(Paragraph(f"We confirm that comprehensive warranty support, spare parts supply, and technical assistance will be extended for 5 years of operation.", normalStyle))

    # =========================================================================
    # DOCUMENT 6: MSME UDYAM CERTIFICATE (PAGE 7)
    # =========================================================================
    add_doc_header("06", "MSME Udyam Registration Certificate", "CERTIFICATION")
    story.append(Paragraph("<b>MINISTRY OF MICRO, SMALL & MEDIUM ENTERPRISES</b>", docTitleStyle))
    story.append(Paragraph("UDYAM REGISTRATION CERTIFICATE", normalStyle))
    story.append(Spacer(1, 8))

    udyam_data = [
        [Paragraph("<b>Udyam Registration Number:</b>", boldStyle), Paragraph(f"<b>{comp['udyam']}</b>", normalStyle)],
        [Paragraph("<b>Name of Enterprise:</b>", boldStyle), Paragraph(comp['name'], normalStyle)],
        [Paragraph("<b>Major Activity:</b>", boldStyle), Paragraph("Manufacturing & EPC Electrical Infrastructure", normalStyle)],
        [Paragraph("<b>Enterprise Classification:</b>", boldStyle), Paragraph("Micro / Small / Medium Enterprise (MSME Registered)", normalStyle)],
        [Paragraph("<b>Date of Udyam Registration:</b>", boldStyle), Paragraph("14/09/2020", normalStyle)],
        [Paragraph("<b>National Industry Code (NIC):</b>", boldStyle), Paragraph("27104 - Manufacture of Solar PV Equipment & Power Components", normalStyle)],
    ]
    t_udyam = Table(udyam_data, colWidths=[180, 360])
    t_udyam.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd7e0')),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_udyam)

    # =========================================================================
    # DOCUMENT 7: MAKE IN INDIA / DCR DECLARATION (PAGE 8)
    # =========================================================================
    add_doc_header("07", "Make in India & DCR Self-Declaration", "COMPLIANCE")
    story.append(Paragraph("<b>DOMESTIC CONTENT REQUIREMENT (DCR) UNDERTAKING</b>", docTitleStyle))
    story.append(Paragraph("Public Procurement (Preference to Make in India) Order Compliance", normalStyle))
    story.append(Spacer(1, 8))

    dcr_data = [
        [Paragraph("<b>Declared Local Content Percentage:</b>", boldStyle), Paragraph(f"<b>{comp['dcrContent']}</b>", normalStyle)],
        [Paragraph("<b>DCR Norm Requirement:</b>", boldStyle), Paragraph("Minimum >= 60.00% Domestic Content", normalStyle)],
        [Paragraph("<b>Solar Cell Origin:</b>", boldStyle), Paragraph("Indigenously Manufactured Solar Cells (India)", normalStyle)],
        [Paragraph("<b>Class Supplier Category:</b>", boldStyle), Paragraph("Class-I Local Supplier", normalStyle)],
        [Paragraph("<b>Compliance Finding:</b>", boldStyle), Paragraph(f"<b>{comp['statusType']}</b>", normalStyle)],
    ]
    t_dcr = Table(dcr_data, colWidths=[200, 340])
    t_dcr.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd7e0')),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_dcr)

    # =========================================================================
    # DOCUMENT 8: NON-BLACKLISTING AFFIDAVIT (PAGE 9)
    # =========================================================================
    add_doc_header("08", "Non-Blacklisting & Debarment Affidavit", "COMPLIANCE")
    story.append(Paragraph("<b>SWORN NON-BLACKLISTING SELF-DECLARATION AFFIDAVIT</b>", docTitleStyle))
    story.append(Paragraph("Executed on Non-Judicial Stamp Paper of Value INR 100", normalStyle))
    story.append(Spacer(1, 8))

    story.append(Paragraph(f"I, Authorized Representative of <b>M/s {comp['name']}</b> (PAN: {comp['pan']}), do hereby solemnly affirm and state as under:", normalStyle))
    story.append(Spacer(1, 6))
    story.append(Paragraph(f"1. That our firm has not been blacklisted, debarred, or restrained by any Government Ministry, State Utility, or Central Public Sector Undertaking (CPSU) as on date of bid submission.", normalStyle))
    story.append(Spacer(1, 4))
    story.append(Paragraph(f"2. Current Statutory CPPP Registry Debarment Status: <b>{comp['debarmentStatus']}</b>.", normalStyle))

    # =========================================================================
    # DOCUMENT 9: ISO QUALITY CERTIFICATE (PAGE 10)
    # =========================================================================
    add_doc_header("09", "ISO 9001:2015 Quality Certificate", "CERTIFICATION")
    story.append(Paragraph("<b>INTERNATIONAL ORGANIZATION FOR STANDARDIZATION</b>", docTitleStyle))
    story.append(Paragraph("ISO 9001:2015 Quality Management System Certificate", normalStyle))
    story.append(Spacer(1, 8))

    iso_data = [
        [Paragraph("<b>Certificate Number:</b>", boldStyle), Paragraph(f"ISO-9001-QMS-{comp['id'].upper()}-2025", normalStyle)],
        [Paragraph("<b>Certified Entity:</b>", boldStyle), Paragraph(comp['name'], normalStyle)],
        [Paragraph("<b>Standard:</b>", boldStyle), Paragraph("ISO 9001:2015 (Quality Management System)", normalStyle)],
        [Paragraph("<b>Validity Period:</b>", boldStyle), Paragraph("15/01/2024 to 14/01/2027", normalStyle)],
    ]
    t_iso = Table(iso_data, colWidths=[180, 360])
    t_iso.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd7e0')),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_iso)

    # =========================================================================
    # DOCUMENT 10: EPFO / ESIC CHALLAN (PAGE 11)
    # =========================================================================
    add_doc_header("10", "EPFO & ESIC Compliance Challan", "COMPLIANCE")
    story.append(Paragraph("<b>EMPLOYEES' PROVIDENT FUND ORGANISATION (EPFO)</b>", docTitleStyle))
    story.append(Paragraph("Electronic Challan cum Return (ECR) Monthly Receipt", normalStyle))
    story.append(Spacer(1, 8))

    epfo_data = [
        [Paragraph("<b>Establishment Code:</b>", boldStyle), Paragraph(f"DLCPM0039281000", normalStyle)],
        [Paragraph("<b>Employer Name:</b>", boldStyle), Paragraph(comp['name'], normalStyle)],
        [Paragraph("<b>Wage Month / Return Period:</b>", boldStyle), Paragraph("August 2026 (ECR Filed)", normalStyle)],
        [Paragraph("<b>Total Contributing Employees:</b>", boldStyle), Paragraph("428 Active Workers", normalStyle)],
        [Paragraph("<b>Total Remittance Amount:</b>", boldStyle), Paragraph("INR 14,82,910/- (Payment Confirmed)", normalStyle)],
    ]
    t_epfo = Table(epfo_data, colWidths=[180, 360])
    t_epfo.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd7e0')),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_epfo)

    doc.build(story)
    print(f"[OK] Successfully generated 10-Document Filing PDF for {comp['name']} -> {filepath}")

def main():
    print(f"Generating 15 Consolidated Company Single-PDF Bid Dossiers in: {OUTPUT_DIR}")
    for comp in COMPANIES:
        build_pdf_for_company(comp)
    print("\nAll 15 Company Single-PDF Dossiers generated successfully!")

if __name__ == "__main__":
    main()
