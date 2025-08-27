# Naagrik - Community Issue Reporting Platform

A modern, responsive web application built with Next.js and Tailwind CSS that empowers communities to report, track, and resolve local civic issues.

## 🌟 Features

- **Interactive Map**: Report issues by clicking on an interactive map
- **Issue Management**: Create, view, and track the status of civic issues
- **User Authentication**: Secure login and registration system
- **Community Engagement**: Upvote issues and engage with your community
- **Responsive Design**: Beautiful UI that works on all devices
- **Real-time Updates**: Track issue progress from reporting to resolution

## 🚀 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom design system
- **Maps**: Leaflet.js for interactive mapping
- **Icons**: Lucide React for consistent iconography
- **TypeScript**: Full type safety throughout the application
- **Authentication**: JWT-based authentication system

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd next-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update the environment variables in `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=https://naagrik.onrender.com/api
   NEXT_PUBLIC_APP_NAME=Naagrik
   NEXT_PUBLIC_APP_VERSION=1.0.0
   NEXT_PUBLIC_MAP_CENTER_LAT=28.6139
   NEXT_PUBLIC_MAP_CENTER_LNG=77.2090
   NEXT_PUBLIC_MAP_ZOOM=13
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── about/             # About page
│   ├── authority/         # Authority contacts page
│   ├── emergency/         # Emergency contacts page
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── features/          # Feature-specific components
│   │   ├── add-issue-modal.tsx
│   │   ├── issue-list.tsx
│   │   └── map-component.tsx
│   ├── layout/            # Layout components
│   │   ├── footer.tsx
│   │   ├── layout.tsx
│   │   └── navbar.tsx
│   └── ui/                # UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── textarea.tsx
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
│   ├── api.ts             # API client
│   └── utils.ts           # Utility functions
└── types/                 # TypeScript type definitions
    └── index.ts
```

## 🎨 Design System

The application uses a carefully crafted design system with:

- **Color Palette**: Primary (Indigo), Secondary (Orange), and semantic colors
- **Typography**: Inter font family with consistent sizing
- **Components**: Modular, reusable components with consistent styling
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Accessibility**: ARIA labels and keyboard navigation support

## 📱 Pages

### Home Page (`/`)
- Interactive map showing reported issues
- Issue filtering and search functionality
- Statistics dashboard
- Quick issue reporting

### Authentication
- **Login** (`/login`): User authentication
- **Register** (`/register`): New user registration

### Information Pages
- **About** (`/about`): Platform information and team details
- **Emergency Contacts** (`/emergency`): Emergency service numbers
- **Authority Contacts** (`/authority`): Local authority contact information

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Quality

- **TypeScript**: Full type safety
- **ESLint**: Code linting with Next.js recommended rules
- **Prettier**: Code formatting (can be added)
- **Component Structure**: Modular, reusable components

## 🚀 Deployment

The application can be deployed on platforms like:

- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Digital Ocean**

### Build Command
```bash
npm run build
```

### Environment Variables
Ensure all required environment variables are set in your deployment platform.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Original HTML/CSS/JS version converted to Next.js
- Design inspired by modern civic engagement platforms
- Icons by Lucide React
- Maps powered by Leaflet.js

## 📞 Support

For questions or support, please contact:
- Email: info@naagrik.app
- GitHub Issues: Create an issue in this repository

---

Built with ❤️ for better communities
