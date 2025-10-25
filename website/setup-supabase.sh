#!/bin/bash

echo "🚀 Setting up Supabase for I-Eat project..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env.local file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOF
# Supabase Configuration
# Get these values from your Supabase project dashboard: https://supabase.com/dashboard
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Example:
# VITE_SUPABASE_URL=https://your-project-id.supabase.co
# VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
EOF
    echo "✅ Created .env.local file"
else
    echo "ℹ️  .env.local already exists"
fi

echo ""
echo "🎉 Setup complete! Next steps:"
echo "1. Go to https://supabase.com/dashboard"
echo "2. Create a new project (or use existing one)"
echo "3. Copy your project URL and anon key"
echo "4. Update .env.local with your actual credentials"
echo "5. Run 'npm run dev' to start the development server"
echo ""
echo "📚 For detailed instructions, see README.md"
