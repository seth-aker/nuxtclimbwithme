# ClimbWithMe - Climbing Social Network

A modern social networking application built with Nuxt 3 that connects climbing enthusiasts, helping them find climbing partners, join communities, and discover new climbing opportunities.

## 🧗‍♀️ Features

### Core Functionality
- **User Profiles**: Comprehensive climbing profiles with experience levels, disciplines, and availability
- **Social Connections**: Send and receive connection requests, build your climbing network
- **Location-Based Matching**: Find climbers near you using geolocation services
- **Climbing Disciplines**: Support for Bouldering, Sport, Top Rope, Trad, Aid, Ice, and Alpine climbing
- **Availability Scheduling**: Set your weekly availability for climbing sessions
- **Communities**: Join and create climbing communities
- **Messaging**: Direct messaging system for coordinating climbs
- **Meetups**: Organize and join climbing meetups
- **Gym Integration**: Connect with local climbing gyms

### Technical Features
- **Authentication**: Secure Auth0 integration with OIDC
- **Real-time Updates**: Live messaging and notifications
- **Mobile Responsive**: Optimized for mobile and desktop
- **Dark/Light Mode**: User preference-based theming
- **File Uploads**: Profile pictures and media sharing via AWS S3
- **Geolocation**: Location-based features with MongoDB geospatial queries

## 🛠️ Tech Stack

### Frontend
- **Nuxt 3** - Vue.js framework with SSR/SSG capabilities
- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Modern UI component library
- **Pinia** - State management
- **VeeValidate + Zod** - Form validation
- **Lucide Icons** - Beautiful icon library

### Backend
- **Nuxt Server API** - Full-stack capabilities
- **MongoDB** - NoSQL database with Mongoose ODM
- **Auth0** - Authentication and authorization
- **AWS S3** - File storage and media management

### Development Tools
- **ESLint** - Code linting and formatting
- **Vitest** - Unit testing framework
- **TypeScript** - Static type checking
- **Auto-animate** - Smooth animations

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended package manager)
- MongoDB database
- Auth0 account
- AWS S3 bucket (for file uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nuxtclimbwithme
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Setup**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   
   Configure the following environment variables:

   **Authentication (Auth0)**
   ```env
   NUXT_OIDC_TOKEN_KEY=<Base64EncodedKey>
   NUXT_OIDC_SESSION_SECRET=<SESSION_SECRET>
   NUXT_OIDC_AUTH_SESSION_SECRET=<AUTH_SESSION_SECRET>
   NUXT_OIDC_PROVIDERS_AUTH0_CLIENT_SECRET=<AUTH0_CLIENT_SECRET>
   NUXT_OIDC_PROVIDERS_AUTH0_CLIENT_ID=<AUTH0_CLIENT_ID>
   NUXT_OIDC_PROVIDERS_AUTH0_AUDIENCE=<AUTH0_AUDIENCE>
   NUXT_OIDC_PROVIDERS_AUTH0_BASE_URL=<AUTH0_DOMAIN>
   NUXT_OIDC_PROVIDERS_AUTH0_REDIRECT_URI=<REDIRECT_URI>
   ```

   **Database (MongoDB)**
   ```env
   NUXT_MONGODB_URI=<MONGODB_CONNECTION_STRING>
   NUXT_DB_NAME=<DATABASE_NAME>
   ```

   **File Storage (AWS S3)**
   ```env
   NUXT_S3_ACCESS_KEY_ID=<S3_ACCESS_KEY>
   NUXT_S3_SECRET_ACCESS_KEY=<S3_SECRET_KEY>
   NUXT_S3_BUCKET=<S3_BUCKET_NAME>
   NUXT_S3_REGION=<S3_REGION>
   ```

4. **Start the development server**
   ```bash
   pnpm dev
   ```

   The application will be available at `http://localhost:3000`

## 📱 Application Structure

### Pages
- **Home** (`/`) - Dashboard with location and nearby climbers
- **Profile** (`/profile`) - User profile management
- **Search** (`/search`) - Find climbers and communities
- **Friends** (`/friends`) - Manage connections and requests
- **Messaging** (`/messaging`) - Direct messaging interface
- **Registration** (`/register/*`) - Multi-step user onboarding

### Key Components
- **Navigation** - Mobile-responsive navigation system
- **Forms** - Reusable form components with validation
- **UI Components** - Comprehensive Shadcn/ui component library
- **Profile Components** - User profile and settings management

### Server API
- **Users** - User management and profile operations
- **Communities** - Community creation and management
- **Meetups** - Event organization and participation
- **Messages** - Real-time messaging system
- **Connections** - Friend request and connection handling
- **Gyms** - Climbing gym integration

## 🧪 Testing

Run the test suite:
```bash
# Run tests
pnpm test

# Run tests with UI
pnpm test:ui
```

## 🏗️ Building for Production

1. **Build the application**
   ```bash
   pnpm build
   ```

2. **Preview the production build**
   ```bash
   pnpm preview
   ```

## 📊 Database Models

### User Model
- Personal information and authentication
- Climbing experience and disciplines
- Location and availability
- Social connections and preferences
- Community memberships

### Community Model
- Community information and location
- Member management
- Event coordination

### Meetup Model
- Event details and scheduling
- Participant management
- Location and requirements

### Message Models
- Direct messaging
- Group conversations
- Real-time updates

## 🔧 Configuration

### Nuxt Configuration
The application uses several Nuxt modules:
- `@nuxt/eslint` - Code linting
- `@nuxt/fonts` - Font optimization
- `@nuxt/image` - Image optimization
- `@nuxt/icon` - Icon management
- `@nuxtjs/tailwindcss` - Styling
- `shadcn-nuxt` - UI components
- `nuxt-oidc-auth` - Authentication
- `@pinia/nuxt` - State management
- `@nuxtjs/color-mode` - Theme switching

### Tailwind CSS
Custom styling with Tailwind CSS v4, including:
- Custom animations and transitions
- Responsive design utilities
- Dark/light mode support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 🆘 Support

For support and questions, please contact the development team.

---

**Happy Climbing! 🧗‍♀️🧗‍♂️**
