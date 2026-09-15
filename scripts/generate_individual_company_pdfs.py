import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

# Output directory for individual document PDFs
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "sample-documents", "individual-docs")
os.makedirs(OUTPUT_DIR, exist_ok=True)

COMPANIES = [
    {
        "name": "Pragati Micro Control Systems Proprietorship",
        "short": "Pragati_Micro_Control",
        "pan": "WKMCP4023I",
        "gstin": "07WKMCP4023I9ZY",
        "udyam": "UDYAM-DL-03-0019482",
        "turnover": "INR 9.74 Crore",
        "dcr": "68.00%",
        "oem": "Waaree Energies Ltd",
        "debarment": "NOT DEBARRED",
    },
    {
        "name": "Tata Power Renewable Energy Limited",
        "short": "Tata_Power_Renewable",
        "pan": "AAACT2949K",
        "gstin": "27AAACT2949K1ZY",
        "udyam": "UDYAM-MH-18-0091823",
        "turnover": "INR 412.84 Crore",
        "dcr": "72.00%",
        "oem": "Tata Power Solar Systems",
        "debarment": "NOT DEBARRED",
    },
    {
        "name": "Waaree Energies Limited",
        "short": "Waaree_Energies",
        "pan": "AAACW8821B",
        "gstin": "27AAACW8821B1Z2",
        "udyam": "UDYAM-GJ-01-0028194",
        "turnover": "INR 285.50 Crore",
        "dcr": "80.00%",
        "oem": "Waaree In-House Solar Cells",
        "debarment": "NOT DEBARRED",
    },
    {
        "name": "Adani Green Energy Infrastructure Ltd",
        "short": "Adani_Green_Energy",
        "pan": "AAACA1092M",
        "gstin": "24AAACA1092M1ZX",
        "udyam": "UDYAM-GJ-04-0012903",
        "turnover": "INR 520.10 Crore",
        "dcr": "75.00%",
        "oem": "Mundra Solar PV Ltd",
        "debarment": "NOT DEBARRED",
    },
    {
        "name": "Sterling and Wilson Renewable Ltd",
        "short": "Sterling_and_Wilson",
        "pan": "AAACS4920L",
        "gstin": "27AAACS4920L1ZA",
        "udyam": "UDYAM-MH-19-0048102",
        "turnover": "INR 185.20 Crore",
        "dcr": "64.00%",
        "oem": "LONGi Solar Technologies",
        "debarment": "NOT DEBARRED",
    },
    {
        "name": "Vikram Solar Limited",
        "short": "Vikram_Solar",
        "pan": "AAACV1290K",
        "gstin": "19AAACV1290K1Z8",
        "udyam": "UDYAM-WB-10-0039102",
        "turnover": "INR 142.80 Crore",
        "dcr": "65.00%",
        "oem": "Vikram Solar PERC Tech",
        "debarment": "NOT DEBARRED",
    },
    {
        "name": "ReNew Power Private Limited",
        "short": "ReNew_Power",
        "pan": "AAACR4410P",
        "gstin": "07AAACR4410P1Z6",
        "udyam": "UDYAM-DL-05-0071928",
        "turnover": "INR 390.60 Crore",
        "dcr": "70.00%",
        "oem": "ReNew Solar Manufacturing",
        "debarment": "NOT DEBARRED",
    },
    {
        "name": "Azure Power India Private Limited",
        "short": "Azure_Power",
        "pan": "AAACA9928J",
        "gstin": "07AAACA9928J1ZB",
        "udyam": "UDYAM-DL-02-0041829",
        "turnover": "INR 210.40 Crore",
        "dcr": "66.00%",
        "oem": "First Solar Malaysia / India",
        "debarment": "NOT DEBARRED",
    },
    {
        "name": "Goldi Solar Private Limited",
        "short": "Goldi_Solar",
        "pan": "AAACG5512N",
        "gstin": "24AAACG5512N1ZY",
        "udyam": "UDYAM-GJ-06-0018293",
        "turnover": "INR 95.30 Crore",
        "dcr": "62.00%",
        "oem": "Goldi HELOC Pro Modules",
        "debarment": "NOT DEBARRED",
    },
    {
        "name": "Premier Energies Limited",
        "short": "Premier_Energies",
        "pan": "AAACP8849F",
        "gstin": "36AAACP8849F1Z3",
        "udyam": "UDYAM-TS-09-0028194",
        "turnover": "INR 115.70 Crore",
        "dcr": "67.00%",
        "oem": "Premier Energies Cell Line",
        "debarment": "NOT DEBARRED",
    },
]

def make_pdf(filepath, title_text, table_data):
    doc = SimpleDocTemplate(filepath, pagesize=letter, leftMargin=36, rightMargin=36, topMargin=36, bottomMargin=36)
    styles = getSampleStyleSheet()

    h_style = ParagraphStyle('DocH', fontName='Helvetica-Bold', fontSize=15, leading=19, textColor=colors.HexColor('#0b5f96'), spaceAfter=8)
    sub_style = ParagraphStyle('SubH', fontName='Helvetica', fontSize=10, leading=14, textColor=colors.HexColor('#4a5568'), spaceAfter=12)
    b_style = ParagraphStyle('BodyCustom', fontName='Helvetica', fontSize=9.5, leading=13.5, textColor=colors.HexColor('#2d3748'))
    b_bold = ParagraphStyle('BodyBold', fontName='Helvetica-Bold', fontSize=9.5, leading=13.5, textColor=colors.HexColor('#0f2942'))

    story = [
        Paragraph(title_text, h_style),
        Paragraph("Statutory Procurement Verification Document — GeM Compliance Engine", sub_style),
        Spacer(1, 6)
    ]

    formatted_rows = []
    for r in table_data:
        formatted_rows.append([Paragraph(f"<b>{r[0]}</b>", b_bold), Paragraph(str(r[1]), b_style)])

    t = Table(formatted_rows, colWidths=[180, 360])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#cbd7e0')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2eaf0')),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t)
    doc.build(story)

def generate_for_company(comp):
    c_dir = os.path.join(OUTPUT_DIR, comp['short'])
    os.makedirs(c_dir, exist_ok=True)

    # 1. PAN Card
    make_pdf(
        os.path.join(c_dir, "01_PAN_Card.pdf"),
        f"PERMANENT ACCOUNT NUMBER (PAN) CARD — {comp['name']}",
        [
            ["Permanent Account Number (PAN):", comp['pan']],
            ["Legal Entity Name:", comp['name']],
            ["Taxpayer Category:", "Company / Registered Firm"],
            ["Issuance Date:", "12/08/2015"],
            ["Income Tax Portal Status:", "VALID & ACTIVE"],
        ]
    )

    # 2. GST Certificate
    make_pdf(
        os.path.join(c_dir, "02_GST_Certificate.pdf"),
        f"FORM GST REG-06 CERTIFICATE — {comp['name']}",
        [
            ["GSTIN Registration Number:", comp['gstin']],
            ["Legal Name of Business:", comp['name']],
            ["Trade Name:", comp['name']],
            ["Taxpayer Type:", "Regular Taxpayer"],
            ["GSTN Portal Status:", "ACTIVE / OPERATIVE"],
            ["Registration Date:", "01/07/2017"],
        ]
    )

    # 3. CA Turnover Certificate
    make_pdf(
        os.path.join(c_dir, "03_CA_Turnover_Certificate.pdf"),
        f"AUDITED FINANCIAL TURNOVER CERTIFICATE — {comp['name']}",
        [
            ["Legal Entity Name:", comp['name']],
            ["Permanent Account Number (PAN):", comp['pan']],
            ["Average Audited Annual Turnover:", comp['turnover']],
            ["CA UDIN Reference Number:", f"259810234AKLWO{comp['short'][:4].upper()}"],
            ["Chartered Accountant Firm:", "Mehta & Singhal Chartered Accountants (FRN: 018492N)"],
            ["Financial Audit Years:", "FY 2022-23, FY 2023-24, FY 2024-25"],
        ]
    )

    # 4. Technical Datasheet
    make_pdf(
        os.path.join(c_dir, "04_Technical_Datasheet.pdf"),
        f"MONO-PERC SOLAR MODULE TECHNICAL DATASHEET — {comp['name']}",
        [
            ["Manufacturer Name:", comp['name']],
            ["Module Technology:", "Mono-PERC Half-Cut Cell Series 550Wp"],
            ["Measured Module Efficiency:", "21.80% (STC)"],
            ["Power Output Tolerance:", "+3% Positive Power Tolerance"],
            ["Certifications:", "IEC 61215:2021, IEC 61730-1 & 2, BIS Registered"],
        ]
    )

    # 5. OEM Authorization Letter
    make_pdf(
        os.path.join(c_dir, "05_OEM_Authorization_Letter.pdf"),
        f"MANUFACTURER AUTHORIZATION FORM (MAF) — {comp['oem']}",
        [
            ["Authorized Bidder Name:", comp['name']],
            ["Original Equipment Manufacturer:", comp['oem']],
            ["Authorization Purpose:", "Submission for Government GeM Tender TND-2026-MNRE-0842"],
            ["Warranty Backing:", "5-Year Comprehensive Operation & Spare Parts Guarantee"],
            ["OEM Seal & Verification:", "VALID AUTHORIZATION"],
        ]
    )

    # 6. MSME Udyam Certificate
    make_pdf(
        os.path.join(c_dir, "06_MSME_Udyam_Certificate.pdf"),
        f"MSME UDYAM REGISTRATION CERTIFICATE — {comp['name']}",
        [
            ["Udyam Registration Number:", comp['udyam']],
            ["Name of Enterprise:", comp['name']],
            ["Category:", "Micro / Small / Medium Enterprise"],
            ["Activity:", "Manufacturing Solar Equipment & EPC Services"],
            ["Registration Date:", "14/09/2020"],
        ]
    )

    # 7. Make in India Declaration
    make_pdf(
        os.path.join(c_dir, "07_Make_In_India_Declaration.pdf"),
        f"MAKE IN INDIA & DCR LOCAL CONTENT DECLARATION — {comp['name']}",
        [
            ["Enterprise Name:", comp['name']],
            ["Declared Local Content Percentage:", comp['dcr']],
            ["DCR Requirement Standard:", "Minimum >= 60.00% Local Content"],
            ["Supplier Category:", "Class-I Local Supplier"],
            ["Solar Cell Origin:", "Indigenously Manufactured Solar Cells (India)"],
        ]
    )

    # 8. Non-Blacklisting Affidavit
    make_pdf(
        os.path.join(c_dir, "08_Non_Blacklisting_Affidavit.pdf"),
        f"SWORN NON-BLACKLISTING AFFIDAVIT — {comp['name']}",
        [
            ["Deponent Entity Name:", comp['name']],
            ["Permanent Account Number (PAN):", comp['pan']],
            ["CPPP Debarment Registry Status:", comp['debarment']],
            ["Affidavit Execution Date:", "01/09/2026"],
            ["Notary Verification:", "EXECUTED ON INR 100 STAMP PAPER"],
        ]
    )

    # 9. ISO Quality Certificate
    make_pdf(
        os.path.join(c_dir, "09_ISO_Quality_Certificate.pdf"),
        f"ISO 9001:2015 QUALITY MANAGEMENT CERTIFICATE — {comp['name']}",
        [
            ["Certificate Holder:", comp['name']],
            ["Certificate Number:", f"ISO-9001-QMS-{comp['short'][:6].upper()}-2025"],
            ["Quality Standard:", "ISO 9001:2015"],
            ["Validity Period:", "15/01/2024 to 14/01/2027"],
        ]
    )

    # 10. EPFO / ESIC Challan
    make_pdf(
        os.path.join(c_dir, "10_EPFO_ESIC_Challan.pdf"),
        f"EMPLOYEES' PROVIDENT FUND ECR CHALLAN — {comp['name']}",
        [
            ["Establishment Code:", "DLCPM0039281000"],
            ["Employer Legal Name:", comp['name']],
            ["Wage Return Period:", "August 2026"],
            ["Contributing Employees:", "428 Active Workers"],
            ["Statutory Remittance Amount:", "INR 14,82,910/-"],
        ]
    )
    print(f"[OK] Generated 10 individual PDFs for company: {comp['name']}")

def main():
    print(f"Generating 100 Individual Standalone Document PDFs for 10 Companies in: {OUTPUT_DIR}")
    for comp in COMPANIES:
        generate_for_company(comp)
    print("\nAll 100 Individual Standalone Document PDFs generated successfully!")

if __name__ == "__main__":
    main()
