
# ShodhSrija Foundation Website

A comprehensive web application for ShodhSrija Foundation, a youth-driven research and innovation NGO focused on addressing societal challenges through research, innovation, and community engagement.

## 🚀 Features

### Frontend (React)
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Theme System**: Morning, Evening, and Night themes
- **Interactive Components**: Animations with Framer Motion
- **Payment Integration**: Razorpay for memberships and donations
- **Maps Integration**: Interactive maps with Leaflet
- **Form Validation**: Comprehensive form handling
- **SEO Optimized**: Meta tags and structured data

### Backend (Django)
- **REST API**: Complete API endpoints
- **Admin Dashboard**: Comprehensive content management
- **Payment Processing**: Secure Razorpay integration
- **Email Automation**: Gmail SMTP integration
- **File Storage**: Cloudinary integration
- **Multi-app Architecture**: Modular Django apps

## 📁 Project Structure

```
ShodhSrija-Website/
├── backend/          # Django backend
└── frontend/         # React frontend
```

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.11+
- Node.js 16+
- PostgreSQL
- Git

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic
python manage.py runserver
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## 🌐 Deployment

### Backend (Render)
1. Connect GitHub repository
2. Set environment variables
3. Deploy with automatic builds

### Frontend (Hostinger)
1. Build: `npm run build`
2. Upload build files to hosting
3. Configure domain and SSL

## 📝 Environment Variables

### Backend (.env)
```
SECRET_KEY=your-secret-key
DATABASE_URL=your-database-url
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
RAZORPAY_KEY_ID=your-razorpay-key
EMAIL_HOST_USER=your-email
```

### Frontend (.env)
```
REACT_APP_API_BASE_URL=your-backend-url
REACT_APP_RAZORPAY_KEY_ID=your-razorpay-key
```

## 🎯 Key Pages

- **Home**: Hero section, statistics, focus areas
- **About**: Team showcase, mission, vision
- **Departments**: Organizational structure
- **Research**: Publications and knowledge center
- **Membership**: Multi-tier membership system
- **Donations**: Secure donation processing
- **Report Issue**: Community issue reporting
- **Contact**: Contact forms and information

## 🔧 Technologies Used

### Frontend
- React 18
- Tailwind CSS
- Framer Motion
- React Query
- React Hook Form
- Leaflet Maps
- React Helmet (SEO)

### Backend
- Django 5.1
- Django REST Framework
- PostgreSQL
- Cloudinary
- Razorpay
- Celery (Background tasks)

## 📞 Support

For technical support or questions, contact the development team.

## 📄 License

This project is proprietary software developed for ShodhSrija Foundation.
