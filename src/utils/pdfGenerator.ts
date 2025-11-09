import jsPDF from 'jspdf';

interface Service {
  id: number;
  name: string;
  price: string;
  description: string;
  category?: string;
}

interface CustomService extends Service {
  endDate?: string;
  status?: 'pending' | 'in-progress' | 'completed';
  createdAt?: string;
}

export const generateServiceReport = (
  services: Service[],
  totalCost: string,
  endDate?: string
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Title
  doc.setFontSize(20);
  doc.text('Service Booking Report', pageWidth / 2, 20, { align: 'center' });

  // Date
  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35);
  if (endDate) {
    doc.text(`Desired completion date: ${new Date(endDate).toLocaleDateString()}`, 20, 45);
  }

  // Services Table
  doc.setFontSize(14);
  doc.text('Selected Services:', 20, 60);
  
  let yPos = 70;
  doc.setFontSize(12);
  
  // Headers
  doc.setFont('times', 'bold');
  doc.text('Service', 20, yPos);
  doc.text('Category', 100, yPos);
  doc.text('Price', 160, yPos);
  
  doc.setFont('times', 'normal');
  yPos += 10;

  services.forEach((service) => {
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }

    doc.text(service.name, 20, yPos);
    if (service.category) {
      doc.text(service.category, 100, yPos);
    }
    doc.text(service.price, 160, yPos);
    yPos += 10;
  });

  yPos += 10;
  doc.setFont('times', 'bold');
  doc.text(`Total Cost: Rs ${totalCost}`, 160, yPos);

  // Footer
  const footerText = 'Thank you for choosing our services!';
  doc.setFont('times', 'normal');
  doc.setFontSize(10);
  doc.text(footerText, pageWidth / 2, 280, { align: 'center' });

  doc.save('service-booking-report.pdf');
};

export const generateProjectReport = (
  project: CustomService
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Title
  doc.setFontSize(20);
  doc.text('Custom Project Report', pageWidth / 2, 20, { align: 'center' });

  // Date
  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35);

  // Project Details
  doc.setFontSize(14);
  doc.text('Project Details:', 20, 50);
  
  doc.setFontSize(12);
  let yPos = 65;

  // Project Name
  doc.setFont('times', 'bold');
  doc.text('Name:', 20, yPos);
  doc.setFont('times', 'normal');
  doc.text(project.name, 60, yPos);
  yPos += 10;

  // Price
  doc.setFont('times', 'bold');
  doc.text('Price:', 20, yPos);
  doc.setFont('times', 'normal');
  doc.text(project.price, 60, yPos);
  yPos += 10;

  // Description
  doc.setFont('times', 'bold');
  doc.text('Description:', 20, yPos);
  doc.setFont('times', 'normal');
  
  // Handle long descriptions with word wrap
  const splitDescription = doc.splitTextToSize(project.description, 150);
  doc.text(splitDescription, 60, yPos);
  yPos += 10 * splitDescription.length;

  // Status
  if (project.status) {
    yPos += 10;
    doc.setFont('times', 'bold');
    doc.text('Status:', 20, yPos);
    doc.setFont('times', 'normal');
    doc.text(project.status.toUpperCase(), 60, yPos);
  }

  // End Date
  if (project.endDate) {
    yPos += 10;
    doc.setFont('times', 'bold');
    doc.text('Desired Completion:', 20, yPos);
    doc.setFont('times', 'normal');
    doc.text(new Date(project.endDate).toLocaleDateString(), 60, yPos);
  }

  // Created Date
  if (project.createdAt) {
    yPos += 10;
    doc.setFont('times', 'bold');
    doc.text('Created On:', 20, yPos);
    doc.setFont('times', 'normal');
    doc.text(new Date(project.createdAt).toLocaleDateString(), 60, yPos);
  }

  // Footer
  const footerText = 'Thank you for choosing our services!';
  doc.setFontSize(10);
  doc.text(footerText, pageWidth / 2, 280, { align: 'center' });

  doc.save('custom-project-report.pdf');
};