import { createTransport } from 'nodemailer'
import Imap from 'imap'
import { EmailParser } from './email-parser'
import { prisma } from './prisma'

interface EmailConfig {
  smtp: {
    host: string
    port: number
    user: string
    pass: string
  }
  imap: {
    host: string
    port: number
    user: string
    pass: string
    tls: boolean
  }
}

export class EmailService {
  private config: EmailConfig

  constructor(config: EmailConfig) {
    this.config = config
  }

  async sendInviteEmail(to: string, flatName: string, inviteLink: string) {
    const transporter = createTransport({
      host: this.config.smtp.host,
      port: this.config.smtp.port,
      secure: false,
      auth: {
        user: this.config.smtp.user,
        pass: this.config.smtp.pass,
      },
    })

    const mailOptions = {
      from: this.config.smtp.user,
      to,
      subject: `Invitation to join ${flatName} on Flateze`,
      html: `
        <h2>You've been invited to join ${flatName}!</h2>
        <p>Click the link below to join your flatmates on Flateze:</p>
        <a href="${inviteLink}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Join Flat
        </a>
        <p>Flateze helps manage bills transparently without needing a head tenant.</p>
      `,
    }

    await transporter.sendMail(mailOptions)
  }

  async processBillEmails(flatId: string) {
    return new Promise<void>((resolve, reject) => {
      const imap = new Imap({
        user: this.config.imap.user,
        password: this.config.imap.pass,
        host: this.config.imap.host,
        port: this.config.imap.port,
        tls: this.config.imap.tls,
        tlsOptions: { rejectUnauthorized: false }
      })

      imap.once('ready', () => {
        imap.openBox('INBOX', false, (err) => {
          if (err) {
            reject(err)
            return
          }

          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)

          imap.search([['SINCE', yesterday]], async (err, results) => {
            if (err) {
              reject(err)
              return
            }

            if (!results || results.length === 0) {
              imap.end()
              resolve()
              return
            }

            const fetch = imap.fetch(results, { bodies: '', markSeen: false })
            const processedEmails: string[] = []

            fetch.on('message', (msg) => {
              let buffer = ''
              
              msg.on('body', (stream) => {
                stream.on('data', (chunk) => {
                  buffer += chunk.toString()
                })
              })

              msg.once('end', async () => {
                try {
                  const parsedBill = await EmailParser.parseEmail(buffer)
                  if (parsedBill) {
                    await this.createBillFromEmail(flatId, parsedBill)
                    processedEmails.push(parsedBill.subject)
                  }
                } catch (error) {
                  console.error('Error processing email:', error)
                }
              })
            })

            fetch.once('error', reject)
            fetch.once('end', () => {
              imap.end()
              console.log(`Processed ${processedEmails.length} bill emails`)
              resolve()
            })
          })
        })
      })

      imap.once('error', reject)
      imap.connect()
    })
  }

  private async createBillFromEmail(flatId: string, parsedBill: any): Promise<any> {
    try {
      const existingBill = await prisma.bill.findFirst({
        where: {
          flatId,
          companyName: parsedBill.companyName,
          amount: parsedBill.amount,
          billDate: parsedBill.billDate,
        },
      })

      if (existingBill) {
        console.log('Bill already exists, skipping...')
        return
      }

      const bill = await prisma.bill.create({
        data: {
          flatId,
          companyName: parsedBill.companyName,
          billType: parsedBill.billType,
          amount: parsedBill.amount,
          dueDate: parsedBill.dueDate,
          billDate: parsedBill.billDate,
          referenceId: parsedBill.referenceId,
          emailSubject: parsedBill.subject,
          emailBody: parsedBill.body,
        },
      })

      console.log(`Created bill: ${bill.id} for ${parsedBill.companyName}`)
      return bill
    } catch (error) {
      console.error('Error creating bill from email:', error)
      throw error
    }
  }
}

export const createEmailService = () => {
  const config: EmailConfig = {
    smtp: {
      host: process.env.SMTP_HOST || '',
      port: parseInt(process.env.SMTP_PORT || '587'),
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
    imap: {
      host: process.env.IMAP_HOST || '',
      port: parseInt(process.env.IMAP_PORT || '993'),
      user: process.env.IMAP_USER || '',
      pass: process.env.IMAP_PASS || '',
      tls: true,
    },
  }

  return new EmailService(config)
}