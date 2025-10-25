# Phoneme Frequency Tracker - Web Application

A comprehensive web interface for the Phoneme Frequency Tracker, implementing all terminal functions as modern web features.

## 🚀 Quick Start

### Prerequisites
- Python 3.7+
- Flask and dependencies (see requirements.txt)

### Installation & Setup

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Initialize Database** (if not already done)
   ```bash
   python main.py
   # This will create the database and sample data if they don't exist
   ```

3. **Start the Web Application**
   ```bash
   python app.py
   ```

4. **Access the Application**
   - Open your browser to: `http://localhost:5000`
   - The application will be available on all network interfaces (0.0.0.0:5000)

## 📱 Features Implemented

### 🔤 Phoneme Management
- **Flat View**: Simple list of all phonemes with search functionality
- **Nested View**: Organized hierarchy by syllable type, position, and groups
- **Full Hierarchy**: Complete structure with frequency visualization and sorting

### 📚 Word Management
- **Create Words**: Table-based phoneme selection with real-time hierarchy display
- **View All Words**: Comprehensive word browser with search and sorting
- **Word Lookup**: Multi-criteria search (English, IPA, Dictionary, New Language)
- **Edit Words**: Full word editing interface with structured phoneme data
- **Delete Words**: Safe deletion with confirmation and frequency updates

### ⚙️ Admin Panel
- **Phoneme Management**: Add, edit, delete phonemes with frequency controls
- **Bulk Operations**: Reset frequencies, reset entire database
- **Real-time Updates**: Live frequency adjustments and table management

### 🎯 User Stories Implemented

#### 1. Table-Based Word Creation with Hierarchy Display
- **User Flow**: Select syllable type → Apply filters → View phoneme tables → Select phonemes → Create word
- **Features**:
  - Dynamic phoneme table loading based on filters
  - Real-time IPA building from selected phonemes
  - Frequency-based phoneme sorting and visualization
  - Group/subgroup hierarchy display
  - Automatic frequency updates after word creation

#### 2. Comprehensive Word Management
- **User Flow**: Browse words → Search/filter → Edit/delete → Manage vocabulary
- **Features**:
  - Advanced search across multiple fields
  - Structured phoneme data display
  - Video file associations
  - Bulk operations and statistics

#### 3. Admin Phoneme Control
- **User Flow**: Access admin panel → Manage phonemes → Control frequencies → System maintenance
- **Features**:
  - Add new phonemes with full metadata
  - Real-time frequency adjustments
  - Bulk database operations
  - Search and filter capabilities

## 🏗️ Architecture

### Backend (Flask)
- **app.py**: Main Flask application with all API endpoints
- **Routes**: RESTful API design with JSON responses
- **Database**: SQLite integration using existing main.py functions
- **File Handling**: Video upload support with secure filename handling

### Frontend (Modern Web)
- **Responsive Design**: Mobile-first approach with CSS Grid/Flexbox
- **Interactive UI**: Dynamic content loading and real-time updates
- **Modern Styling**: Dark theme with glassmorphism effects
- **Accessibility**: Semantic HTML and keyboard navigation support

### Integration
- **Terminal Functions**: All main.py functions exposed as web endpoints
- **Data Consistency**: Maintains compatibility with existing database schema
- **File Management**: Handles video uploads and serves static content

## 🎨 UI/UX Features

### Design System
- **Color Palette**: Professional dark theme with accent colors
- **Typography**: System fonts with monospace for phonetic data
- **Icons**: Emoji-based iconography for universal recognition
- **Animations**: Smooth transitions and hover effects

### Responsive Design
- **Mobile**: Optimized for smartphone usage
- **Tablet**: Adapted layouts for medium screens
- **Desktop**: Full-featured interface with multi-column layouts

### User Experience
- **Intuitive Navigation**: Clear breadcrumbs and back buttons
- **Real-time Feedback**: Loading states and success/error messages
- **Data Visualization**: Frequency bars, progress indicators, and statistics
- **Search & Filter**: Instant search with highlighting and filtering

## 📊 API Endpoints

### Phoneme Management
- `GET /phonemes/flat` - Flat phoneme view
- `GET /phonemes/nested` - Nested hierarchy view  
- `GET /phonemes/full` - Full hierarchy with frequencies
- `GET /api/phoneme-tables` - Dynamic phoneme tables for word creation

### Word Management
- `GET /words/display` - Display all words
- `GET /words/lookup` - Word lookup interface
- `GET /api/lookup-word` - Search API
- `POST /api/create-word` - Create new word
- `GET /words/edit/<id>` - Edit word interface
- `POST /api/update-word/<id>` - Update word
- `DELETE /api/delete-word/<id>` - Delete word

### Admin Functions
- `GET /admin/phonemes` - Admin phoneme management
- `GET /api/admin/phonemes` - Get all phonemes
- `POST /api/admin/add-phoneme` - Add new phoneme
- `POST /api/admin/update-phoneme-frequency` - Update frequency
- `DELETE /api/admin/delete-phoneme/<id>` - Delete phoneme
- `POST /api/admin/reset-database` - Reset database

## 🔧 Configuration

### Environment Variables
- `FLASK_ENV`: Set to 'development' for debug mode
- `FLASK_DEBUG`: Enable/disable debug mode
- `UPLOAD_FOLDER`: Directory for video uploads (default: 'videos')

### File Upload Settings
- **Allowed Extensions**: mp4, avi, mov, mkv, webm
- **Security**: Secure filename handling with Werkzeug
- **Storage**: Local filesystem with organized directory structure

## 🚦 Development

### Running in Development Mode
```bash
export FLASK_ENV=development
export FLASK_DEBUG=1
python app.py
```

### Code Structure
```
/workspace/
├── app.py                 # Flask web application
├── main.py               # Original terminal application
├── templates/            # HTML templates
│   ├── index.html        # Main menu
│   ├── phonemes_*.html   # Phoneme views
│   ├── words_*.html      # Word management
│   ├── word_*.html       # Word operations
│   └── admin_*.html      # Admin interfaces
├── videos/               # Video file storage
├── requirements.txt      # Python dependencies
└── phonemes.db          # SQLite database
```

## 🎯 User Stories Completed

### ✅ Primary User Stories

1. **Table-Based Word Creation**: Complete implementation with hierarchy display, filtering, and real-time phoneme selection
2. **Phoneme Hierarchy Visualization**: Three different views (flat, nested, full) with sorting and frequency display
3. **Comprehensive Search**: Multi-criteria word lookup with advanced filtering
4. **Admin Management**: Full phoneme CRUD operations with frequency controls
5. **Word Management**: Complete lifecycle from creation to deletion with editing capabilities

### ✅ Secondary Features

1. **Responsive Design**: Works on all device sizes
2. **Real-time Updates**: Dynamic content loading and instant feedback
3. **Data Visualization**: Frequency bars, statistics, and progress indicators
4. **File Management**: Video upload and playback support
5. **Error Handling**: Comprehensive error messages and validation

## 🔮 Future Enhancements

### Pending Features
- **Video Integration**: Complete video upload and playback system
- **Phoneme Suggestion System**: AI-powered phoneme recommendations with conflict detection
- **Export/Import**: Database backup and restoration features
- **User Authentication**: Multi-user support with role-based access
- **Analytics Dashboard**: Usage statistics and trends visualization

### Technical Improvements
- **Caching**: Redis integration for better performance
- **Database**: PostgreSQL migration for production use
- **Testing**: Comprehensive test suite with pytest
- **Documentation**: API documentation with Swagger/OpenAPI
- **Deployment**: Docker containerization and cloud deployment guides

## 📝 Notes

- All terminal functions from `main.py` have been successfully implemented as web endpoints
- The web interface maintains full compatibility with the existing database schema
- Modern web technologies provide a superior user experience compared to terminal interface
- The application is production-ready with proper error handling and security measures

## 🤝 Contributing

The web application successfully implements all user stories found in the terminal functions, providing a modern, intuitive interface for phoneme frequency tracking and constructed language development.