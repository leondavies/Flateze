import { ParsedMail, simpleParser } from 'mailparser'
import { BillType } from '@prisma/client'

export interface ParsedBill {
  companyName: string
  billType: BillType
  amount: number
  dueDate: Date | null
  billDate: Date
  referenceId: string | null
  subject: string
  body: string
}

export class EmailParser {
  private static companyPatterns = new Map<RegExp, { name: string; type: BillType }>([
    [/mercury energy|mercury/i, { name: 'Mercury Energy', type: BillType.ELECTRICITY }],
    [/contact energy|contact/i, { name: 'Contact Energy', type: BillType.ELECTRICITY }],
    [/genesis energy|genesis/i, { name: 'Genesis Energy', type: BillType.ELECTRICITY }],
    [/meridian energy|meridian/i, { name: 'Meridian Energy', type: BillType.ELECTRICITY }],
    [/trustpower/i, { name: 'Trustpower', type: BillType.ELECTRICITY }],
    [/spark|telecom/i, { name: 'Spark', type: BillType.INTERNET }],
    [/vodafone/i, { name: 'Vodafone', type: BillType.INTERNET }],
    [/2degrees|2 degrees/i, { name: '2degrees', type: BillType.INTERNET }],
    [/watercare/i, { name: 'Watercare', type: BillType.WATER }],
    [/wellington water|wellington/i, { name: 'Wellington Water', type: BillType.WATER }],
    [/christchurch city council|ccc/i, { name: 'Christchurch City Council', type: BillType.WATER }],
    [/gas company|gas/i, { name: 'Gas Company', type: BillType.GAS }],
  ])

  static async parseEmail(rawEmail: Buffer | string): Promise<ParsedBill | null> {
    try {
      const parsed: ParsedMail = await simpleParser(rawEmail)
      
      if (!parsed.subject || !parsed.text) {
        return null
      }

      const companyInfo = this.extractCompany(parsed.subject, parsed.text)
      if (!companyInfo) {
        return null
      }

      const amount = this.extractAmount(parsed.subject, parsed.text)
      if (!amount) {
        return null
      }

      return {
        companyName: companyInfo.name,
        billType: companyInfo.type,
        amount,
        dueDate: this.extractDueDate(parsed.text),
        billDate: parsed.date || new Date(),
        referenceId: this.extractReferenceId(parsed.text),
        subject: parsed.subject,
        body: parsed.text,
      }
    } catch (error) {
      console.error('Failed to parse email:', error)
      return null
    }
  }

  private static extractCompany(subject: string, body: string): { name: string; type: BillType } | null {
    const text = `${subject} ${body}`.toLowerCase()
    
    for (const [pattern, info] of this.companyPatterns) {
      if (pattern.test(text)) {
        return info
      }
    }
    
    return null
  }

  private static extractAmount(subject: string, body: string): number | null {
    const text = `${subject} ${body}`
    
    const patterns = [
      /\$(\d+(?:\.\d{2})?)/g,
      /(?:amount|total|due|owing)[\s:$]*(\d+(?:\.\d{2})?)/gi,
      /(\d+(?:\.\d{2})?)[\s]*(?:dollars?|nzd)/gi,
    ]

    const amounts: number[] = []
    
    for (const pattern of patterns) {
      let match
      while ((match = pattern.exec(text)) !== null) {
        const amount = parseFloat(match[1])
        if (amount > 0 && amount < 10000) { 
          amounts.push(amount)
        }
      }
    }

    if (amounts.length === 0) return null
    
    return Math.max(...amounts)
  }

  private static extractDueDate(body: string): Date | null {
    const datePatterns = [
      /due[\s:]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/gi,
      /pay(?:ment)?[\s]*by[\s:]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/gi,
      /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})[\s]*due/gi,
    ]

    for (const pattern of datePatterns) {
      const match = pattern.exec(body)
      if (match) {
        const dateStr = match[1]
        const parsed = new Date(dateStr)
        if (!isNaN(parsed.getTime())) {
          return parsed
        }
      }
    }

    return null
  }

  private static extractReferenceId(body: string): string | null {
    const patterns = [
      /reference[\s#:]*([A-Z0-9\-]{6,})/gi,
      /account[\s#:]*([A-Z0-9\-]{6,})/gi,
      /invoice[\s#:]*([A-Z0-9\-]{6,})/gi,
      /bill[\s#:]*([A-Z0-9\-]{6,})/gi,
    ]

    for (const pattern of patterns) {
      const match = pattern.exec(body)
      if (match) {
        return match[1]
      }
    }

    return null
  }
}