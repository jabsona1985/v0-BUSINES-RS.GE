import * as XLSX from 'xlsx'

// ─── TYPES ──────────────────────────────
export interface ImportResult {
  success: number
  errors: { row: number; field: string; message: string }[]
  data: ImportedProduct[]
}

export interface ImportedProduct {
  name: string
  sku?: string
  barcode?: string
  category?: string
  price: number
  costPrice?: number
  stock?: number
  minStock?: number
  unit?: string
}

// ─── EXPORT: Products ───────────────────
export function exportProductsToExcel(products: any[]): void {
  const rows = products.map(p => ({
    'სახელი':           p.name,
    'SKU':              p.sku || '',
    'ბარკოდი':          p.barcode || '',
    'კატეგორია':        p.category || '',
    'გასაყიდი ფასი':    p.price,
    'თვითღ. ფასი':      p.costPrice,
    'მარაგი':           p.stock,
    'მინ. მარაგი':      p.minStock,
    'ერთეული':          p.unit,
    'დღგ %':            (p.vatRate || 0.18) * 100,
    'სტატუსი':          p.isActive ? 'აქტიური' : 'არააქტიური',
  }))

  const ws = XLSX.utils.json_to_sheet(rows)
  ws['!cols'] = [
    {wch:25},{wch:12},{wch:16},{wch:16},{wch:14},
    {wch:14},{wch:10},{wch:12},{wch:10},{wch:8},{wch:12}
  ]
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'პროდუქტები')
  XLSX.writeFile(wb, `products_${formatDateFile()}.xlsx`)
}

// ─── EXPORT: Sales ───────────────────────
export function exportSalesToExcel(sales: any[], items: any[]): void {
  const salesRows = sales.map(s => ({
    'ჩეკის ნომ.':    s.receiptNumber,
    'თარიღი':        s.createdAt,
    'კლიენტი':       s.customerName || '',
    'გადახდა':       s.paymentMethod === 'cash' ? 'ნაღდი' : s.paymentMethod === 'card' ? 'ბარათი' : 'გადარიცხვა',
    'ქვეჯამი':       s.subtotal,
    'ფასდაკლება':    s.discount || 0,
    'დღგ':           s.vatAmount,
    'სულ':           s.total,
    'დაბრუნება':     s.isReturn ? 'კი' : '',
  }))

  const itemRows = items.map(i => ({
    'ჩეკი':          i.saleReceiptNumber || i.receiptNumber,
    'პროდუქტი':      i.productName,
    'რ-ბა':          i.quantity,
    'ფასი':          i.unitPrice,
    'ფასდ.':         i.discount || 0,
    'სულ':           i.total,
  }))

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(salesRows), 'გაყიდვები')
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(itemRows), 'დეტალები')
  XLSX.writeFile(wb, `sales_${formatDateFile()}.xlsx`)
}

// ─── EXPORT: Transactions ────────────────
export function exportTransactionsToExcel(transactions: any[]): void {
  const rows = transactions.map(t => ({
    'თარიღი':     t.createdAt,
    'ტიპი':       t.type === 'income' ? 'შემოსავალი' : 'ხარჯი',
    'კატეგ.':     t.category,
    'აღწერა':     t.description,
    'თანხა':      t.type === 'income' ? t.amount : -t.amount,
  }))
  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'ტრანზაქციები')
  XLSX.writeFile(wb, `accounting_${formatDateFile()}.xlsx`)
}

// ─── EXPORT: VAT Report ─────────────────
export function exportVATReportToExcel(
  salesVAT: any[],
  purchasesVAT: any[],
  period: string
): void {
  const wb = XLSX.utils.book_new()

  const salesTotal = salesVAT.reduce((s, r) => s + (r.vatAmount || 0), 0)
  const purchasesTotal = purchasesVAT.reduce((s, r) => s + (r.vatAmount || 0), 0)

  const summaryRows = [
    { 'ანგარიში': 'დღგ-ს ანგარიში - ' + period },
    {},
    { 'ანგარიში': 'გაყიდვებიდან დღგ:', 'თანხა': salesTotal },
    { 'ანგარიში': 'შეძენებიდან დღგ:', 'თანხა': -purchasesTotal },
    { 'ანგარიში': 'გადასახდელი:', 'თანხა': salesTotal - purchasesTotal },
  ]

  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(summaryRows), 'შეჯამება')

  const salesRows = salesVAT.map(r => ({
    'თარიღი': r.date, 'ჩეკი': r.receiptNumber,
    'ბაზა': r.base, 'დღგ 18%': r.vatAmount, 'ჯამი': r.total,
  }))
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(salesRows), 'გაყიდვ. დღგ')

  const purchRows = purchasesVAT.map(r => ({
    'თარიღი': r.date, 'PO ნომ.': r.orderNumber,
    'ბაზა': r.base, 'დღგ 18%': r.vatAmount, 'ჯამი': r.total,
  }))
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(purchRows), 'შეძ. დღგ')

  XLSX.writeFile(wb, `vat_report_${period.replace(/\s/g, '_')}.xlsx`)
}

// ─── IMPORT: Products ───────────────────
export async function parseProductsExcel(file: File): Promise<ImportResult> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const data = new Uint8Array(e.target!.result as ArrayBuffer)
      const wb = XLSX.read(data, { type: 'array' })
      const ws = wb.Sheets[wb.SheetNames[0]]
      const rows: any[] = XLSX.utils.sheet_to_json(ws)

      const result: ImportResult = { success: 0, errors: [], data: [] }

      rows.forEach((row, idx) => {
        const rowNum = idx + 2
        const name = row['სახელი'] || row['name'] || row['Name']
        const price = parseFloat(row['გასაყიდი ფასი'] || row['price'] || 0)

        if (!name) {
          result.errors.push({ row: rowNum, field: 'სახელი', message: 'სავალდებულო ველი' })
          return
        }
        if (isNaN(price) || price < 0) {
          result.errors.push({ row: rowNum, field: 'ფასი', message: 'არასწორი ფასი' })
          return
        }

        result.data.push({
          name:       String(name).trim(),
          sku:        row['SKU'] ? String(row['SKU']).trim() : undefined,
          barcode:    row['ბარკოდი'] ? String(row['ბარკოდი']).trim() : undefined,
          category:   row['კატეგორია'] ? String(row['კატეგორია']).trim() : undefined,
          price,
          costPrice:  parseFloat(row['თვითღ. ფასი'] || 0) || 0,
          stock:      parseFloat(row['მარაგი'] || 0) || 0,
          minStock:   parseFloat(row['მინ. მარაგი'] || 0) || 0,
          unit:       row['ერთეული'] || 'ც',
        })
        result.success++
      })

      resolve(result)
    }
    reader.readAsArrayBuffer(file)
  })
}

// ─── TEMPLATE ───────────────────────────
export function downloadProductTemplate(): void {
  const template = [{
    'სახელი': 'კოკა-კოლა 0.5ლ',
    'SKU': 'SKU-001',
    'ბარკოდი': '5449000000996',
    'კატეგორია': 'სასმელი',
    'გასაყიდი ფასი': 2.50,
    'თვითღ. ფასი': 1.80,
    'მარაგი': 100,
    'მინ. მარაგი': 20,
    'ერთეული': 'ც',
    'დღგ %': 18,
  }]
  const ws = XLSX.utils.json_to_sheet(template)
  ws['!cols'] = Array(10).fill({wch: 16})
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'პროდუქტები')
  XLSX.writeFile(wb, 'jabson_products_template.xlsx')
}

// ─── HELPER ─────────────────────────────
function formatDateFile(): string {
  return new Date().toISOString().split('T')[0]
}
