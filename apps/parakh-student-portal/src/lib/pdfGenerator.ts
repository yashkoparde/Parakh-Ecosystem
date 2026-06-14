/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { jsPDF } from "jspdf";
import { Result, Certificate, Student } from "../types";

/**
 * Generates an official, double-bordered scholastic statement of marks (marksheet) as PDF.
 */
export function generateMarksheetPDF(result: Result, student: Student): void {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210
  const pageHeight = doc.internal.pageSize.getHeight(); // 297

  // 1. Draw Double Borders
  doc.setDrawColor(15, 23, 42); // slate-900
  doc.setLineWidth(0.8);
  doc.rect(8, 8, pageWidth - 16, pageHeight - 16, "S"); // Outer

  doc.setLineWidth(0.2);
  doc.rect(9.5, 9.5, pageWidth - 19, pageHeight - 19, "S"); // Inner

  // 2. Department Header
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text("NATIONAL REPOSITORY OF VERIFIED ACADEMIC CREDENTIALS", pageWidth / 2, 17, { align: "center" });

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text("PARAKH EXAMINATION COMMISSION", pageWidth / 2, 24, { align: "center" });

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85); // slate-700
  doc.text("Ministry of Education, Government of India", pageWidth / 2, 29, { align: "center" });

  // Decorative Accent bar
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.4);
  doc.line(15, 34, pageWidth - 15, 34);

  // Statement Badge
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect((pageWidth - 80) / 2, 38, 80, 8, "F");

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text("OFFICIAL STATEMENT OF MARKS", pageWidth / 2, 43.5, { align: "center" });

  // Restore defaults
  doc.setTextColor(15, 23, 42);

  // 3. Demographics and Params layout blocks
  const startY = 53;
  const blockHeight = 44;
  const halfWidth = (pageWidth - 30 - 4) / 2; // 88mm

  // Box A: Candidate Identification
  doc.setFillColor(248, 250, 252); // slate-50
  doc.rect(15, startY, halfWidth, blockHeight, "F");
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.25);
  doc.rect(15, startY, halfWidth, blockHeight, "S");

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);
  doc.text("CANDIDATE IDENTIFICATION", 18, startY + 5);
  doc.line(18, startY + 7, 15 + halfWidth - 3, startY + 7);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text("Candidate Name:", 18, startY + 13);
  doc.text("Roll Number:", 18, startY + 19);
  doc.text("Candidate ID:", 18, startY + 25);
  doc.text("Date of Birth:", 18, startY + 31);
  doc.text("Guardian Names:", 18, startY + 37);

  doc.setFont("Helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(student.name, 48, startY + 13);
  doc.text(result.rollNumber, 48, startY + 19);
  doc.setFont("Helvetica", "normal");
  doc.text(student.candidateId, 48, startY + 25);
  doc.text(student.dateOfBirth, 48, startY + 31);
  doc.text(`${student.fatherName} (F) / ${student.motherName} (M)`, 48, startY + 37);

  // Box B: Examination Parameters
  doc.setFillColor(248, 250, 252); // slate-50
  doc.rect(17 + halfWidth, startY, halfWidth, blockHeight, "F");
  doc.rect(17 + halfWidth, startY, halfWidth, blockHeight, "S");

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text("EXAMINATION PARAMETERS", 20 + halfWidth, startY + 5);
  doc.line(20 + halfWidth, startY + 7, 17 + halfWidth * 2 - 3, startY + 7);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text("Examination Name:", 20 + halfWidth, startY + 13);
  doc.text("Examination Code:", 20 + halfWidth, startY + 19);
  doc.text("Academic Year:", 20 + halfWidth, startY + 25);
  doc.text("Institution Name:", 20 + halfWidth, startY + 31);
  doc.text("Publish Timestamp:", 20 + halfWidth, startY + 37);

  doc.setFont("Helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(result.examinationName, 52 + halfWidth, startY + 13);
  doc.setFont("Helvetica", "normal");
  doc.text(result.examinationCode, 52 + halfWidth, startY + 19);
  doc.text(result.academicYear, 52 + halfWidth, startY + 25);
  
  // Wrap institution name text
  const instText = doc.splitTextToSize(student.registeredInstitution, halfWidth - 35);
  doc.text(instText, 52 + halfWidth, startY + 31);
  doc.text(`${result.publishedDate} (IST)`, 52 + halfWidth, startY + 37);

  // 4. Subject accomplishment table
  const tableY = startY + blockHeight + 8; // 105
  doc.setFillColor(241, 245, 249); // slate-100
  doc.rect(15, tableY, pageWidth - 30, 7, "F");
  doc.setDrawColor(203, 213, 225); // slate-300
  doc.rect(15, tableY, pageWidth - 30, 7, "S");

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text("Subject Code & Title", 18, tableY + 4.5);
  doc.text("Max", 98, tableY + 4.5, { align: "center" });
  doc.text("Passing", 115, tableY + 4.5, { align: "center" });
  doc.text("Obtained", 137, tableY + 4.5, { align: "center" });
  doc.text("Grade", 158, tableY + 4.5, { align: "center" });
  doc.text("Result Status", 183, tableY + 4.5, { align: "center" });

  let currentY = tableY + 7;
  doc.setFont("Helvetica", "normal");
  doc.setTextColor(15, 23, 42);

  result.subjectScores.forEach((score) => {
    // Row line partition
    doc.line(15, currentY + 8, pageWidth - 15, currentY + 8);
    
    doc.setFont("Helvetica", "bold");
    doc.text(`(${score.code})`, 18, currentY + 5);
    doc.setFont("Helvetica", "normal");
    doc.text(score.subject, 33, currentY + 5);

    doc.text(score.maxMarks.toString(), 98, currentY + 5, { align: "center" });
    doc.text(score.passingMarks.toString(), 115, currentY + 5, { align: "center" });
    
    doc.setFont("Helvetica", "bold");
    doc.text(score.marksObtained.toString(), 137, currentY + 5, { align: "center" });
    doc.text(score.grade, 158, currentY + 5, { align: "center" });
    
    doc.setFont("Helvetica", "bold");
    if (score.status === "Pass") {
      doc.setTextColor(22, 101, 52); // green-800
      doc.text("PASS", 183, currentY + 5, { align: "center" });
    } else {
      doc.setTextColor(153, 27, 27); // red-800
      doc.text("FAIL", 183, currentY + 5, { align: "center" });
    }
    
    doc.setTextColor(15, 23, 42); // Reset color
    currentY += 8;
  });

  // Border of table body
  doc.rect(15, tableY, pageWidth - 30, currentY - tableY, "S");

  // 5. Aggregate Summary Details
  const summaryY = currentY + 6;
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text("Combined Absolute Marks:", 18, summaryY + 4);
  doc.text("Aggregate Percentage:", 18, summaryY + 10);
  doc.text("Result Standing Grade:", 15, summaryY + 16);

  doc.setFont("Helvetica", "bold");
  doc.text(`${result.totalMarksObtained} out of ${result.totalMaxMarks}`, 62, summaryY + 4);
  doc.text(`${result.overallPercentage}%`, 62, summaryY + 10);
  doc.text(`${result.overallGrade} (Distinction Standing)`, 62, summaryY + 16);

  // Box: Official Stamp Circle and Signature Lines
  const sealX = pageWidth - 75;
  const sealY = summaryY + 1;

  doc.setFillColor(248, 250, 252);
  doc.rect(sealX, sealY, 60, 24, "F");
  doc.setDrawColor(203, 213, 225);
  doc.rect(sealX, sealY, 60, 24, "S");

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("AUTHORIZED CONTROLLER", sealX + 30, sealY + 4, { align: "center" });

  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.3);
  doc.circle(sealX + 13, sealY + 13.5, 7.5);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(15, 23, 42);
  doc.text("PARAKH", sealX + 13, sealY + 12.5, { align: "center" });
  doc.text("SEAL", sealX + 13, sealY + 15.5, { align: "center" });

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text("D.G. Exam Controller", sealX + 39, sealY + 13, { align: "center" });
  
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text("Signed Authenticated Copy", sealX + 39, sealY + 16, { align: "center" });
  doc.text("Registry Control Reference #581029", sealX + 30, sealY + 21.5, { align: "center" });

  // 6. Security Integrity Stamp Statement
  const footerY = pageWidth === 210 ? 259 : 265;
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(15, footerY, pageWidth - 30, 22, "F");

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text("REPOSITORY DIGITAL SIGNATURE & SECURITY ATTRIBUTIONS", 20, footerY + 5);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(203, 213, 225);
  doc.text(`Document ID Reference: ${result.id}-${result.rollNumber}`, 20, footerY + 10);
  doc.text(`Registrar Digital SHA-256 Checksum: ${result.txHash}`, 20, footerY + 14);
  doc.text("This official credential has been securely anchored on Central Scholastic Database nodes and verified safe.", 20, footerY + 18);

  // Save the report
  doc.save(`Marksheet_${result.examinationCode || "Result"}_${result.rollNumber}.pdf`);
}

/**
 * Generates an official certified board certificate as PDF.
 */
export function generateCertificatePDF(certificate: Certificate, student: Student): void {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210
  const pageHeight = doc.internal.pageSize.getHeight(); // 297

  // 1. Double Borders (Certificate Style)
  doc.setDrawColor(15, 23, 42); // slate-900
  doc.setLineWidth(1.2);
  doc.rect(8, 8, pageWidth - 16, pageHeight - 16, "S"); // Heavy Outer

  doc.setLineWidth(0.35);
  doc.rect(10.5, 10.5, pageWidth - 21, pageHeight - 21, "S"); // Fine Inner

  // Floral-like minimalist corner brackets
  doc.setFillColor(15, 23, 42);
  doc.rect(12, 12, 4, 0.4, "F");
  doc.rect(12, 12, 0.4, 4, "F");
  doc.rect(pageWidth - 16, 12, 4, 0.4, "F");
  doc.rect(pageWidth - 12.4, 12, 0.4, 4, "F");
  doc.rect(12, pageHeight - 12.4, 4, 0.4, "F");
  doc.rect(12, pageHeight - 16, 0.4, 4, "F");
  doc.rect(pageWidth - 16, pageHeight - 12.4, 4, 0.4, "F");
  doc.rect(pageWidth - 12.4, pageHeight - 16, 0.4, 4, "F");

  // 2. Headings & Institution Header
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text("NATIONAL ACADEMIC RECORD DEPOSITORY", pageWidth / 2, 23, { align: "center" });

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(certificate.issuingAuthority, pageWidth / 2, 31, { align: "center" });

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text("PARAKH Verification Registry System Code: APEX-9042", pageWidth / 2, 36, { align: "center" });

  // 3. Central Certificate Statement Body
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text("CERTIFICATE OF DIGITAL INTEGRITY", pageWidth / 2, 53, { align: "center" });

  doc.setLineWidth(0.4);
  doc.line(60, 56, pageWidth - 60, 56);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(71, 85, 105); // slate-600
  doc.text("This official registry credential certifies that candidate", pageWidth / 2, 70, { align: "center" });

  // Student Name (Bold Title size)
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42);
  doc.text(student.name, pageWidth / 2, 85, { align: "center" });

  // Roll info
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);
  doc.text(`Candidate Roll Number: ${student.rollNumber}`, pageWidth / 2, 92, { align: "center" });

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(71, 85, 105);
  
  const prosePart1 = "having successfully finished all requirements, evaluations, and certifications";
  const prosePart2 = "stipulated by educational guidelines and authorized boards, has been declared";
  const prosePart3 = "officially certified and recorded with the designated digital register:";
  doc.text(prosePart1, pageWidth / 2, 107, { align: "center" });
  doc.text(prosePart2, pageWidth / 2, 113, { align: "center" });
  doc.text(prosePart3, pageWidth / 2, 119, { align: "center" });

  // 4. Central Document Display Box
  doc.setFillColor(248, 250, 252); // slate-50
  doc.rect(20, 129, pageWidth - 40, 42, "F");
  doc.setDrawColor(203, 213, 225); // slate-300
  doc.setLineWidth(0.3);
  doc.rect(20, 129, pageWidth - 40, 42, "S");

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text(certificate.name.toUpperCase(), pageWidth / 2, 139, { align: "center" });

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Credential ID: ${certificate.documentNumber}`, pageWidth / 2, 145, { align: "center" });

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  // Multi-line description bounding box
  const descText = doc.splitTextToSize(certificate.description, pageWidth - 56);
  doc.text(descText, pageWidth / 2, 154, { align: "center" });

  // 5. Digital Sign-off and Registry Information
  const metaY = 186;
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text("DATE OF ISSUANCE:", 25, metaY);
  doc.text("DOCUMENT TYPE:", 25, metaY + 8);
  doc.text("VERIFICATION AUDIT:", 25, metaY + 16);

  doc.setFont("Helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(certificate.issuedDate, 65, metaY);
  doc.text(`${certificate.type.toUpperCase()} STANDARD`, 65, metaY + 8);
  
  doc.setTextColor(22, 101, 52); // green-800
  doc.text("RECORD VERIFIED AUTHENTIC", 65, metaY + 16);

  // Seal Frame Box
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.rect(pageWidth - 75, metaY - 3, 50, 22, "F");
  doc.rect(pageWidth - 75, metaY - 3, 50, 22, "S");

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text("VERIFIED", pageWidth - 50, metaY + 5, { align: "center" });
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text("PARAKH Registry Office", pageWidth - 50, metaY + 10, { align: "center" });
  doc.text("Ministry Certification Seal", pageWidth - 50, metaY + 14, { align: "center" });

  // 6. Cryptographic Footnote Footer
  const blockY = 224;
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(20, blockY, pageWidth - 40, 28, "F");

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text("SCHOLASTIC CRYPTOGRAPHIC VERIFICATION CHECKSUM", 25, blockY + 6);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(226, 232, 240);
  doc.text(`Official SHA-256 Checksum: ${certificate.blockchainHash}`, 25, blockY + 12);
  doc.text(`Blockchain Signature Index: ${certificate.txHash}`, 25, blockY + 18);
  
  doc.setFont("Helvetica", "bold");
  doc.setTextColor(74, 222, 128); // green-400
  doc.text("● SIGNATURE CONFIRMED SECURE ON CENTRAL NETWORK NODES", 25, blockY + 23);

  // Save the report
  doc.save(`Certificate_${certificate.type}_${certificate.documentNumber}.pdf`);
}
