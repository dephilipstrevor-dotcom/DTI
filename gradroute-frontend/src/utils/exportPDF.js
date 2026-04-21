import jsPDF from 'jspdf'
import 'jspdf-autotable'

export const exportRouteToPDF = (route) => {
  const doc = new jsPDF()
  doc.setFontSize(20)
  doc.setTextColor('#E05D36')
  doc.text('GradRoute Report', 14, 20)
  doc.setFontSize(14)
  doc.setTextColor('#FFFFFF')
  doc.text(route.university, 14, 35)
  doc.setFontSize(10)
  doc.setTextColor('#94A3B8')
  doc.text(`${route.program} | ${route.country}`, 14, 45)

  doc.autoTable({
    startY: 55,
    head: [['Metric', 'Value']],
    body: [
      ['Feasibility Score', `${route.feasibility}%`],
      ['Tier', route.tier.toUpperCase()],
      ['Total Cost', `₹${(route.total_cost/100000).toFixed(1)} Lakhs`],
      ['PR Timeline', `${route.pr_timeline} months`],
      ['ROI Vector', route.roi_vector],
      ['Market Demand', route.market_demand],
    ],
    theme: 'plain',
    headStyles: { fillColor: '#E05D36', textColor: '#FFFFFF' },
    bodyStyles: { textColor: '#FFFFFF', fillColor: '#0F172A' },
    alternateRowStyles: { fillColor: '#1E293B' },
  })

  doc.text('Financial Overview', 14, doc.lastAutoTable.finalY + 15)
  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 20,
    head: [['Item', 'Amount (₹)']],
    body: [
      ['Tuition Fees', `₹${(route.total_cost * 0.4).toFixed(0)}`],
      ['Living Costs', `₹${(route.total_cost * 0.6).toFixed(0)}`],
      ['Total', `₹${route.total_cost}`],
    ],
    theme: 'plain',
    headStyles: { fillColor: '#E05D36' },
    bodyStyles: { textColor: '#FFFFFF', fillColor: '#0F172A' },
  })

  doc.save(`GradRoute_${route.university.replace(/\s/g, '_')}.pdf`)
}