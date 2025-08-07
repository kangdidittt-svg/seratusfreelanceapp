# Freelance Project Tracker

A modern, minimalistic, and futuristic dashboard-style web application for tracking freelance projects, built with Next.js, MongoDB, and Docker.

## Features

### 🎨 Modern UI/UX
- **Soft, rounded card-based layout** with purple/blue/pink color scheme
- **Animated background elements** with floating gradients and blob motion
- **Glass morphism effects** with backdrop blur and subtle shadows
- **Smooth page transitions** using Framer Motion
- **Responsive design** that works on all devices

### 📊 Dashboard Features
- **Overview section** with interactive charts showing monthly earnings and project activity
- **Key metrics cards** displaying total projects, income, and unpaid amounts
- **Project summary cards** with progress bars and status indicators
- **Client management** with avatar display and project status
- **Live map section** for visual balance

### 🛠️ Project Management
- **Add new projects** with detailed form including budget, deadline, and priority
- **Project list view** with filtering and sorting capabilities
- **Progress tracking** with visual progress bars
- **Status management** (Pending, In Progress, Completed)
- **Client information** and project categorization

### 📈 Analytics & Reporting
- **Monthly reports** with earnings trends and performance metrics
- **Interactive charts** using Recharts library
- **Client performance analysis** with growth indicators
- **Project category breakdown** with pie charts
- **Export functionality** for reports

### ⚙️ Settings & Customization
- **Profile management** with photo upload and personal information
- **Notification preferences** for emails, push notifications, and updates
- **Privacy settings** for profile visibility and data sharing
- **Appearance customization** with theme and color scheme options

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom animations
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **Database**: MongoDB with Mongoose
- **Containerization**: Docker & Docker Compose

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- Docker (optional, for containerized deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd freelance-project-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Docker Deployment

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

2. **Access the application**
   - Main app: [http://localhost:3000](http://localhost:3000)
   - MongoDB Express: [http://localhost:8081](http://localhost:8081)

## Project Structure

```
freelance-project-tracker/
├── app/
│   ├── components/
│   │   ├── Dashboard.tsx      # Main dashboard with charts and metrics
│   │   ├── Sidebar.tsx        # Navigation sidebar with icons
│   │   ├── TopBar.tsx         # Top navigation with search and user info
│   │   ├── ProjectList.tsx    # Project management and filtering
│   │   ├── AddProject.tsx     # New project creation form
│   │   ├── MonthlyReport.tsx  # Analytics and reporting
│   │   └── Settings.tsx       # User preferences and configuration
│   ├── globals.css           # Global styles and animations
│   ├── layout.tsx            # Root layout with animated background
│   └── page.tsx              # Main page with tab navigation
├── public/                   # Static assets
├── docker-compose.yml        # Docker services configuration
├── Dockerfile               # Container build instructions
├── next.config.js           # Next.js configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies and scripts
```

## Key Components

### Dashboard
- Interactive earnings chart with monthly data
- Key performance metrics cards
- Project category progress tracking
- Client list with status indicators

### Project Management
- Comprehensive project creation form
- Advanced filtering and sorting
- Progress visualization
- Status management workflow

### Analytics
- Monthly performance reports
- Client growth analysis
- Category distribution charts
- Export capabilities

### Settings
- Profile customization
- Notification preferences
- Privacy controls
- Theme selection

## Customization

### Colors
The color scheme can be customized in `tailwind.config.js`:
- Primary: Purple/Blue gradient
- Secondary: Pink/Red gradient
- Accent: Cyan/Green gradient

### Animations
Custom animations are defined in `globals.css`:
- Blob animations for background elements
- Card hover effects
- Smooth transitions
- Loading animations

### Components
All components are modular and can be easily customized:
- Modify props and state management
- Adjust styling with Tailwind classes
- Add new features and functionality

## Future Enhancements

- [ ] Real-time notifications
- [ ] Advanced project templates
- [ ] Time tracking integration
- [ ] Invoice generation
- [ ] Client portal access
- [ ] Mobile app development
- [ ] API integrations
- [ ] Advanced analytics

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the repository or contact the development team.

---

**Built with ❤️ for freelancers who want to track their projects in style!**