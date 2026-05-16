import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { jsPDF } from 'jspdf'
import toast from 'react-hot-toast'

export default function ExportButton({ roadmap }) {
  const [exporting, setExporting] = useState(false)

  const handleExport = async () => {
    if (!roadmap) return
    setExporting(true)

    try {
      const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
      const pageW = doc.internal.pageSize.getWidth()
      const pageH = doc.internal.pageSize.getHeight()
      const margin = 15
      const contentW = pageW - margin * 2
      let y = margin

      const checkNewPage = (needed = 10) => {
        if (y + needed > pageH - margin) {
          doc.addPage()
          y = margin
        }
      }

      // Title section
      doc.setFillColor(79, 70, 229) // brand-600
      doc.roundedRect(margin, y, contentW, 28, 3, 3, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(20)
      doc.setFont('helvetica', 'bold')
      doc.text(roadmap.title || `${roadmap.skill} Learning Roadmap`, margin + 5, y + 10)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text(`${roadmap.level} · ${roadmap.durationDays} days · ${roadmap.dailyHours}h/day`, margin + 5, y + 18)
      doc.text(`Generated: ${new Date(roadmap.generatedAt).toLocaleDateString()}`, margin + 5, y + 24)
      y += 35

      // Weeks and days
      roadmap.weeks?.forEach(week => {
        checkNewPage(20)

        // Week header
        doc.setFillColor(238, 242, 255) // brand-50
        doc.roundedRect(margin, y, contentW, 14, 2, 2, 'F')
        doc.setTextColor(67, 56, 202) // brand-700
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.text(`Week ${week.week}: ${week.goal}`, margin + 4, y + 9)
        y += 18

        week.days?.forEach(day => {
          checkNewPage(24)

          // Day box
          doc.setDrawColor(226, 232, 240)
          doc.setFillColor(250, 250, 250)
          doc.roundedRect(margin + 2, y, contentW - 4, 22, 2, 2, 'FD')

          // Day number badge
          doc.setFillColor(99, 102, 241) // brand-500
          doc.roundedRect(margin + 4, y + 3, 12, 12, 2, 2, 'F')
          doc.setTextColor(255, 255, 255)
          doc.setFontSize(9)
          doc.setFont('helvetica', 'bold')
          doc.text(String(day.day), margin + 10, y + 11, { align: 'center' })

          // Topic
          doc.setTextColor(15, 23, 42) // slate-900
          doc.setFontSize(10)
          doc.setFont('helvetica', 'bold')
          doc.text(day.topic, margin + 20, y + 8)

          // Task
          doc.setTextColor(71, 85, 105) // slate-600
          doc.setFontSize(8)
          doc.setFont('helvetica', 'normal')
          const taskLines = doc.splitTextToSize(day.task, contentW - 28)
          doc.text(taskLines[0] || '', margin + 20, y + 14)

          // Resource
          if (day.resource) {
            doc.setTextColor(99, 102, 241)
            doc.setFontSize(7)
            doc.text(`Resource: ${day.resource.slice(0, 60)}`, margin + 20, y + 19)
          }

          y += 26
          checkNewPage(5)
        })

        y += 4
      })

      // Footer
      const pageCount = doc.internal.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(7)
        doc.setTextColor(148, 163, 184)
        doc.text(
          `PathGen AI – IIT Patna Capstone 2026 · Page ${i} of ${pageCount}`,
          pageW / 2, pageH - 6, { align: 'center' }
        )
      }

      doc.save(`${roadmap.skill.replace(/\s+/g, '-')}-roadmap.pdf`)
      toast.success('PDF downloaded!')
    } catch (err) {
      toast.error('Export failed: ' + err.message)
    } finally {
      setExporting(false)
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={exporting || !roadmap}
      className="btn-secondary flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {exporting
        ? <Loader2 className="w-4 h-4 animate-spin" />
        : <Download className="w-4 h-4" />
      }
      {exporting ? 'Exporting...' : 'Export PDF'}
    </button>
  )
}
