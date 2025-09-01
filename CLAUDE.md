# Flateze - Transparent Bill Management System

## Project Overview

Flateze is a modern web application designed to eliminate the need for a "head tenant" in flat sharing situations by providing transparent bill management. The app automatically processes utility bills received via email and splits costs transparently among all flatmates.

## 🏗️ Architecture & Tech Stack

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling with glassmorphism effects
- **Modern UI Components** with hover animations and gradients

### Backend
- **Next.js API Routes** for server-side functionality
- **Prisma ORM** with PostgreSQL database
- **NextAuth.js** for authentication (currently disabled for demo)

### Email Processing
- **Nodemailer** for sending emails
- **IMAP** for receiving and processing bills
- **Mailparser** for parsing email content
- **Custom Email Parser** for extracting bill data

## 📊 Database Schema

### Core Models

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  image     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Flat {
  id          String   @id @default(cuid())
  name        String
  address     String?
  emailAlias  String   @unique  // Unique email for bill forwarding
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Bill {
  id            String     @id @default(cuid())
  flatId        String
  companyName   String
  billType      BillType   // ELECTRICITY, WATER, GAS, INTERNET, etc.
  amount        Decimal    @db.Decimal(10, 2)
  dueDate       DateTime?
  billDate      DateTime
  status        BillStatus @default(PENDING)
  referenceId   String?
  emailSubject  String?
  emailBody     String?   @db.Text
  createdAt     DateTime  @default(now())
}

model Payment {
  id        String        @id @default(cuid())
  billId    String
  userId    String
  amount    Decimal       @db.Decimal(10, 2)
  paidAt    DateTime      @default(now())
  method    PaymentMethod @default(OTHER)
  notes     String?
}
```

### Relationships
- Users can be members of multiple flats
- Flats have multiple members with different roles (ADMIN/MEMBER)
- Bills belong to flats and can have multiple payments
- Payments are linked to users and bills

## 🎨 UI Design Features

### Design System
- **Color Palette**: Slate, Blue, Indigo gradients
- **Typography**: Inter font with gradient text effects
- **Glassmorphism**: Semi-transparent elements with backdrop blur
- **Shadows**: Multi-layered shadows for depth
- **Animations**: Smooth 300ms transitions with hover effects

### Key UI Components

#### Navigation
```tsx
// Sticky navigation with glassmorphism
<nav className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
  // Gradient logo and brand identity
  // User profile with demo mode badge
</nav>
```

#### Dashboard Cards
```tsx
// Stats cards with hover animations
<div className="bg-white/70 backdrop-blur-sm overflow-hidden shadow-xl rounded-2xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
  // Gradient icons with contextual emojis
  // Large numbers with descriptive labels
</div>
```

#### Bill Cards
```tsx
// Interactive bill cards with rich information
<div className="group bg-gradient-to-r from-white to-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-slate-300 transition-all duration-300">
  // Company name with bill type icons
  // Status indicators with color coding
  // Due dates and reference numbers
</div>
```

## 🔧 Core Features

### 1. Email-Based Bill Processing
- Each flat gets a unique email address (e.g., `wellington-flat-123@flateze.com`)
- Users forward utility bills to this address
- Automatic parsing of common NZ utility companies:
  - **Electricity**: Mercury Energy, Contact Energy, Genesis, Meridian
  - **Internet**: Spark, Vodafone, 2degrees
  - **Water**: Watercare, Wellington Water
  - **Gas**: Various gas providers

### 2. Intelligent Bill Parsing
```typescript
class EmailParser {
  // Extracts company name, bill amount, due dates
  // Handles multiple currency formats
  // Identifies bill types automatically
  // Extracts reference numbers
}
```

### 3. Transparent Dashboard
- **Real-time Stats**: Outstanding balance, pending bills, flatmate count
- **Bill Timeline**: Chronological view of all bills
- **Status Tracking**: Pending, Partially Paid, Paid, Overdue
- **Payment History**: Individual payment tracking

### 4. Flatmate Management
- **Equal Access**: No single person controls bills
- **Visual Profiles**: Avatar display with hover tooltips
- **Role-Based Access**: Admin and Member permissions
- **Invitation System**: Email-based flat joining

## 🚀 Getting Started

### Prerequisites
```bash
Node.js 18+
PostgreSQL database
Email server (SMTP/IMAP)
```

### Installation
```bash
# Clone and install dependencies
git clone <repository>
cd flateze
npm install

# Set up environment variables
cp .env.example .env
# Configure DATABASE_URL, email settings

# Generate Prisma client and run migrations
npx prisma generate
npx prisma migrate dev

# Start development server
npm run dev
```

### Environment Variables
```env
DATABASE_URL="postgresql://username:password@localhost:5432/flateze"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Email Configuration
SMTP_HOST="your-smtp-host"
SMTP_PORT="587"
SMTP_USER="your-email"
SMTP_PASS="your-password"

# IMAP for receiving bills
IMAP_HOST="your-imap-host"
IMAP_PORT="993"
IMAP_USER="bills@flateze.com"
IMAP_PASS="imap-password"
```

## 📱 Current Demo Features

The app currently runs in demo mode with mock data:

### Sample Data
- **Flat**: Wellington Flat at 123 Cuba Street
- **Members**: John Smith, Sarah Jones, Mike Chen
- **Bills**:
  - Mercury Energy (Electricity) - $145.50 - PENDING
  - Spark (Internet) - $89.99 - PARTIALLY PAID
  - Watercare (Water) - $67.30 - PAID

### Dashboard Features
- **Live Statistics**: Calculated from mock bill data
- **Interactive Elements**: Hover effects, tooltips
- **Responsive Design**: Works on desktop and mobile
- **Email Instructions**: Shows flat's forwarding email

## 🎯 Key Benefits

### For Flatmates
- **No Head Tenant**: Everyone has equal access to bill information
- **Full Transparency**: All bills and payments visible to everyone
- **Automatic Processing**: No manual data entry required
- **Payment Tracking**: Clear record of who owes what
- **Historical Data**: Complete bill and payment history

### For Property Management
- **Reduced Disputes**: Transparent cost splitting
- **Automated Workflow**: Bills processed automatically
- **Clear Audit Trail**: All transactions recorded
- **Multiple Payment Methods**: Flexible payment options

## 🔮 Future Enhancements

### Planned Features
1. **Bill Splitting Logic**: Automatic cost division among flatmates
2. **Payment Integration**: Stripe/PayPal payment processing
3. **Notification System**: Email/SMS alerts for new bills
4. **Mobile App**: React Native companion app
5. **Receipt Storage**: Photo upload and OCR processing
6. **Budgeting Tools**: Monthly spend tracking and predictions
7. **Integration APIs**: Connect with banking apps
8. **Advanced Analytics**: Spending patterns and insights

### Technical Improvements
- **Real-time Updates**: WebSocket connections for live data
- **Offline Support**: Service worker implementation
- **Performance**: Query optimization and caching
- **Security**: Enhanced authentication and authorization
- **Testing**: Comprehensive test suite
- **Monitoring**: Error tracking and performance monitoring

## 🛠️ Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npx prisma studio    # Open Prisma Studio
npx prisma migrate   # Run database migrations
npx prisma generate  # Generate Prisma client

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript checking
```

## 📄 Project Structure

```
flateze/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API routes
│   │   ├── dashboard/      # Main dashboard
│   │   └── layout.tsx      # Root layout
│   ├── components/         # Reusable components
│   ├── lib/               # Utility libraries
│   │   ├── auth.ts        # Authentication config
│   │   ├── prisma.ts      # Database client
│   │   ├── email-parser.ts # Email processing
│   │   └── email-service.ts # Email sending
│   └── types/             # TypeScript definitions
├── prisma/
│   └── schema.prisma      # Database schema
├── public/               # Static assets
└── package.json         # Dependencies and scripts
```

## 🤝 Contributing

This project welcomes contributions! Key areas for improvement:
- Email parsing for more utility companies
- UI/UX enhancements
- Payment integration
- Mobile responsiveness
- Performance optimizations

## 📞 Support

For questions or support:
- Check existing GitHub issues
- Create new issue with detailed description
- Include browser/environment information
- Provide steps to reproduce any bugs

---

*Built with ❤️ for transparent flat living*