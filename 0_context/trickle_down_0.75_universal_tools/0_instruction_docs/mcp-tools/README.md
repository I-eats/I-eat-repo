# MCP (Model Context Protocol) Tools - Universal Documentation

## Overview

This directory contains comprehensive documentation for MCP (Model Context Protocol) tools and servers used across all AI agents in the lang-trak-in-progress project. MCP provides a standardized way for AI agents to interact with external tools and services.

## 🎯 Purpose

MCP tools enable AI agents to:
- Access external APIs and services
- Interact with databases and file systems
- Perform web searches and browser automation
- Manage documentation and context
- Integrate with communication platforms

## 📁 Documentation Structure

### Core MCP System
- **MCP Management System**: Centralized configuration management
- **Environment Configurations**: Development, production, and testing setups
- **Deployment Scripts**: Automated deployment and management tools

### Individual MCP Servers
- **Context7**: Documentation and context management
- **Browser Automation**: Chrome DevTools, Playwright, Browser tools
- **Search & Research**: Web search, GitHub search, filesystem access
- **Communication**: Slack integration
- **Database**: PostgreSQL integration

## 🚀 Quick Start

### 1. Set Up MCP Management System
```bash
# Initialize the complete MCP system
python3 scripts/mcp-cli.py setup

# Deploy development environment
python3 scripts/mcp-cli.py deploy development

# Check system status
python3 scripts/mcp-cli.py status
```

### 2. Set Up Context7 (Documentation Tool)
```bash
# Set up Context7 MCP server
python3 scripts/context7-setup.py setup-local

# Check Context7 status
python3 scripts/context7-setup.py status
```

### 3. Integrate with Claude Code
```bash
# Add Context7 to Claude Code (local)
claude mcp add context7 -- npx -y @upstash/context7-mcp --api-key ctx7sk-d20b6dec-5980-4ee1-9beb-0e635d626f46

# Add Context7 to Claude Code (remote)
claude mcp add --transport http context7 https://mcp.context7.com/mcp --header "CONTEXT7_API_KEY: ctx7sk-d20b6dec-5980-4ee1-9beb-0e635d626f46"
```

## 📚 Available Documentation

### Context7 MCP Server
- **[Complete Setup Guide](CONTEXT7_CLAUDE_SETUP.md)**: Detailed setup instructions for Context7
- **[Quick Reference](CONTEXT7_QUICK_REFERENCE.md)**: Quick commands and troubleshooting

### MCP Management System
- **[MCP System Guide](../../../../MCP_SYSTEM_GUIDE.md)**: Complete MCP management system documentation
- **Configuration Files**: Located in `config/mcp/`
- **Management Scripts**: Located in `scripts/`

## 🔧 Available MCP Servers

### Browser Automation
- **chrome-devtools**: Chrome DevTools integration for debugging
- **playwright**: Cross-browser testing and automation
- **browser**: Simple browser automation

### Search & Research
- **web-search**: Tavily web search integration
- **github-search**: GitHub repository search
- **context7**: Documentation and context management
- **filesystem**: File system access and management

### Communication & Database
- **slack**: Slack integration for notifications
- **postgres**: PostgreSQL database integration

## 🌍 Environment Configurations

### Development Environment
- **Purpose**: Full debugging and development tools
- **Servers**: All browser automation, search, and development tools
- **Configuration**: `config/mcp/development.json`

### Production Environment
- **Purpose**: Essential tools for production use
- **Servers**: Web search, filesystem, communication, database tools
- **Configuration**: `config/mcp/production.json`

### Testing Environment
- **Purpose**: Automated testing and validation
- **Servers**: Browser automation and filesystem tools
- **Configuration**: `config/mcp/testing.json`

## 🛠️ Management Commands

### MCP System Management
```bash
# Deploy configuration
python3 scripts/mcp-cli.py deploy <environment>

# Check status
python3 scripts/mcp-cli.py status

# Run health check
python3 scripts/mcp-cli.py health

# Generate report
python3 scripts/mcp-cli.py report
```

### Context7 Management
```bash
# Set up local server
python3 scripts/context7-setup.py setup-local

# Set up remote server
python3 scripts/context7-setup.py setup-remote

# Set up both options
python3 scripts/context7-setup.py setup-hybrid

# Check status
python3 scripts/context7-setup.py status
```

## 📊 Configuration Files

### Main Configuration
- **`.mcp.json`**: Current active MCP configuration
- **`config/mcp/mcp-system.json`**: Main system configuration

### Environment Configurations
- **`config/mcp/development.json`**: Development environment
- **`config/mcp/production.json`**: Production environment
- **`config/mcp/testing.json`**: Testing environment

### Example Configurations
- **`config/mcp/examples/`**: Example configurations for all MCP servers

## 🔒 Security & API Keys

### API Key Configuration
- **Context7**: `your_context7_api_key_here`
- **Tavily**: `your_tavily_api_key_here`
- **GitHub**: `your_github_token_here`

### Security Notes
- API keys are stored in environment-specific configurations
- Production keys should be replaced with actual values
- Consider using environment variables for sensitive data
- Regular backup of configurations is recommended

## 🚨 Troubleshooting

### Common Issues
1. **Server Won't Start**: Check dependencies and configuration
2. **Missing Dependencies**: Run setup scripts to install required packages
3. **Configuration Errors**: Validate configuration with health checks
4. **API Key Issues**: Verify API keys are correct and active

### Debug Commands
```bash
# Check MCP system health
python3 scripts/mcp-cli.py health

# Check Context7 status
python3 scripts/context7-setup.py status

# Validate configuration
python3 scripts/mcp-cli.py validate development

# Check logs
tail -f backups/mcp/mcp.log
```

## 📈 Benefits

### For AI Agents
- **Consistent Tools**: Same tools available across all environments
- **Easy Management**: Simple commands to start/stop/configure
- **Reliability**: Health checks ensure servers are running
- **Flexibility**: Easy to add new MCP servers as needed

### For Development
- **Centralized Configuration**: All MCP configurations in one place
- **Environment Isolation**: Separate configs for different environments
- **Automated Deployment**: No manual configuration management
- **Comprehensive Documentation**: Complete setup and usage guides

## 🎯 Next Steps

1. **Review Documentation**: Read the complete setup guides
2. **Set Up MCP System**: Run the setup commands
3. **Configure Context7**: Set up documentation tools
4. **Integrate with Claude Code**: Add MCP servers to your AI agents
5. **Test and Validate**: Ensure everything is working correctly

## 📞 Support

- **Health Check**: `python3 scripts/mcp-cli.py health`
- **Context7 Status**: `python3 scripts/context7-setup.py status`
- **System Logs**: Check `backups/mcp/mcp.log`
- **Documentation**: Review the complete guides in this directory

---

**MCP tools provide a powerful foundation for AI agent capabilities. This documentation ensures consistent setup and usage across all environments and agents.**
