export interface ParsedRow {
  [key: string]: string | number | Date
}

export interface ParsedData {
  headers: string[]
  rows: ParsedRow[]
  headerMapping: Record<string, string>
  warnings: string[]
}

const normalizeHeader = (header: string): string => {
  return header.trim().toLowerCase().replace(/\s+/g, " ")
}

const findBestMatch = (target: string, available: string[]): string | null => {
  const normalized = normalizeHeader(target)

  // Exact match
  const exact = available.find((h) => normalizeHeader(h) === normalized)
  if (exact) return exact

  // Partial match
  const partial = available.find(
    (h) => normalizeHeader(h).includes(normalized) || normalized.includes(normalizeHeader(h)),
  )
  if (partial) return partial

  return null
}

const parseTimestamp = (value: string): Date | string => {
  if (!value) return "N/A"

  try {
    // Try DD/MM/YYYY, HH:MM:SS format
    const ddmmyyyyMatch = value.match(/(\d{1,2})\/(\d{1,2})\/(\d{4}),?\s*(\d{1,2}):(\d{2}):(\d{2})/)
    if (ddmmyyyyMatch) {
      const [, day, month, year, hours, minutes, seconds] = ddmmyyyyMatch
      return new Date(
        Number.parseInt(year),
        Number.parseInt(month) - 1,
        Number.parseInt(day),
        Number.parseInt(hours),
        Number.parseInt(minutes),
        Number.parseInt(seconds),
      )
    }

    // Try ISO format
    const date = new Date(value)
    if (!isNaN(date.getTime())) {
      return date
    }
  } catch (e) {
    console.warn("[v0] Failed to parse timestamp:", value)
  }

  return value
}

const parseCSVData = (csvText: string): ParsedData => {
  const warnings: string[] = []

  // Simple CSV parser - split by newlines and commas
  const lines = csvText.trim().split("\n")
  if (lines.length < 1) {
    throw new Error("CSV file is empty")
  }

  // Parse headers
  const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""))

  // Parse rows
  const rows: ParsedRow[] = []
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    // Handle CSV with quoted fields
    const cells: string[] = []
    let current = ""
    let inQuotes = false

    for (let j = 0; j < line.length; j++) {
      const char = line[j]
      const nextChar = line[j + 1]

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"'
          j++
        } else {
          inQuotes = !inQuotes
        }
      } else if (char === "," && !inQuotes) {
        cells.push(current.trim().replace(/^"|"$/g, ""))
        current = ""
      } else {
        current += char
      }
    }
    cells.push(current.trim().replace(/^"|"$/g, ""))

    if (cells.some((cell) => cell)) {
      const row: ParsedRow = {}
      headers.forEach((header, index) => {
        const value = cells[index] || ""

        // Special handling for Timestamp
        if (normalizeHeader(header).includes("timestamp")) {
          row[header] = parseTimestamp(value)
        } else {
          row[header] = value
        }
      })
      rows.push(row)
    }
  }

  // Build header mapping
  const headerMapping: Record<string, string> = {}
  const expectedFields = ["Name", "Email", "Profession", "Q4", "Q5", "Q6", "Q7", "Q8", "Q9", "Q10", "Q11", "Timestamp"]

  expectedFields.forEach((field) => {
    const match = findBestMatch(field, headers)
    if (match) {
      headerMapping[field] = match
    } else {
      warnings.push(`Missing expected field: ${field}`)
    }
  })

  console.log("[v0] CSV Detected headers:", headers)
  console.log("[v0] CSV Header mapping:", headerMapping)
  console.log("[v0] CSV Parsed rows:", rows.length)

  return { headers, rows, headerMapping, warnings }
}

const parseHTMLTable = (html: string): ParsedData => {
  const warnings: string[] = []

  // Parse HTML table
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, "text/html")
  const table = doc.querySelector("table")

  if (!table) {
    throw new Error("No table found in sheet")
  }

  // Extract headers
  const headerRow = table.querySelector("tr")
  if (!headerRow) {
    throw new Error("No header row found")
  }

  const headers = Array.from(headerRow.querySelectorAll("th, td"))
    .map((cell) => (cell as HTMLElement).textContent?.trim() || "")
    .filter((h) => h)

  // Extract rows
  const rows: ParsedRow[] = []
  const bodyRows = table.querySelectorAll("tr")

  for (let i = 1; i < bodyRows.length; i++) {
    const cells = Array.from(bodyRows[i].querySelectorAll("td")).map(
      (cell) => (cell as HTMLElement).textContent?.trim() || "",
    )

    if (cells.some((cell) => cell)) {
      const row: ParsedRow = {}
      headers.forEach((header, index) => {
        const value = cells[index] || ""

        // Special handling for Timestamp
        if (normalizeHeader(header).includes("timestamp")) {
          row[header] = parseTimestamp(value)
        } else {
          row[header] = value
        }
      })
      rows.push(row)
    }
  }

  // Build header mapping
  const headerMapping: Record<string, string> = {}
  const expectedFields = ["Name", "Email", "Profession", "Q4", "Q5", "Q6", "Q7", "Q8", "Q9", "Q10", "Q11", "Timestamp"]

  expectedFields.forEach((field) => {
    const match = findBestMatch(field, headers)
    if (match) {
      headerMapping[field] = match
    } else {
      warnings.push(`Missing expected field: ${field}`)
    }
  })

  console.log("[v0] HTML Detected headers:", headers)
  console.log("[v0] HTML Header mapping:", headerMapping)
  console.log("[v0] HTML Parsed rows:", rows.length)

  return { headers, rows, headerMapping, warnings }
}

export const parseSheetData = async (url: string): Promise<ParsedData> => {
  try {
    const response = await fetch(url)
    const content = await response.text()

    // Detect if it's CSV or HTML
    if (url.toLowerCase().endsWith(".csv") || !content.includes("<table")) {
      // Parse as CSV
      return parseCSVData(content)
    } else {
      // Parse as HTML table
      return parseHTMLTable(content)
    }
  } catch (error) {
    console.error("[v0] Error parsing sheet:", error)
    throw error
  }
}
