# Contributing to Building Planner

Thank you for your interest in contributing to Building Planner! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Issues
- Use the GitHub issue tracker to report bugs
- Include detailed steps to reproduce the issue
- Provide browser/OS information
- Include screenshots if applicable

### Suggesting Features
- Open an issue with the "feature request" label
- Describe the feature and its use case
- Explain why it would be valuable to users
- Consider implementation complexity

### Code Contributions
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## 🛠️ Development Setup

### Prerequisites
- Node.js 16+ and npm 8+
- Git for version control
- Code editor (VS Code recommended)

### Local Development
```bash
# Clone the repository
git clone https://github.com/yourusername/building-planner.git
cd building-planner

# Install all dependencies
npm run install:all

# Start development servers
npm run dev
```

### Project Structure
```
building-planner/
├── building-planner-backend/    # Express.js API server
├── building-planner-frontend/   # React application
├── docs/                       # Documentation files
└── scripts/                    # Build and deployment scripts
```

## 📝 Coding Standards

### JavaScript/React
- Use ES6+ features and modern JavaScript
- Follow React hooks patterns
- Use functional components over class components
- Implement proper error boundaries

### Code Style
- Use ESLint configuration provided
- Follow Prettier formatting rules
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

### Git Commit Messages
Follow the conventional commit format:
```
type(scope): description

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Examples:
- `feat(canvas): add polygon drawing tool`
- `fix(api): resolve drawing save error`
- `docs(readme): update installation instructions`

## 🧪 Testing Guidelines

### Writing Tests
- Add tests for all new features
- Maintain minimum 80% code coverage
- Use descriptive test names
- Test both happy path and error cases

### Running Tests
```bash
# Frontend tests
cd building-planner-frontend
npm test

# Backend tests (when available)
cd building-planner-backend
npm test

# All tests
npm run test
```

### Test Types
1. **Unit Tests**: Individual component/function testing
2. **Integration Tests**: API and component interaction testing
3. **E2E Tests**: Full user workflow testing (future)

## 🎨 UI/UX Guidelines

### Design Principles
- **Simplicity**: Keep the interface clean and minimal
- **Consistency**: Use consistent patterns and components
- **Accessibility**: Ensure keyboard navigation and screen reader support
- **Performance**: Optimize for smooth interactions

### Component Guidelines
- Create reusable components
- Use proper prop validation
- Implement loading and error states
- Follow responsive design principles

## 📚 Documentation

### Code Documentation
- Add JSDoc comments for public APIs
- Document complex algorithms and business logic
- Include usage examples for components
- Keep README files up to date

### API Documentation
- Document all endpoints with examples
- Include request/response schemas
- Explain error codes and handling
- Provide authentication details

## 🚀 Release Process

### Version Numbering
Follow Semantic Versioning (SemVer):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist
1. Update version numbers
2. Update CHANGELOG.md
3. Run full test suite
4. Build production version
5. Create git tag
6. Deploy to staging
7. Deploy to production
8. Create GitHub release

## 🔍 Code Review Process

### For Contributors
- Keep pull requests focused and small
- Write clear descriptions of changes
- Respond to feedback promptly
- Update documentation as needed

### For Reviewers
- Review code for functionality and style
- Test changes locally when possible
- Provide constructive feedback
- Approve when ready for merge

## 🐛 Bug Reports

### Before Reporting
- Check existing issues for duplicates
- Try to reproduce the bug consistently
- Test in multiple browsers if applicable

### Bug Report Template
```markdown
**Bug Description**
A clear description of the bug.

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment**
- OS: [e.g. Windows 10]
- Browser: [e.g. Chrome 90]
- Version: [e.g. 1.0.0]
```

## 💡 Feature Requests

### Feature Request Template
```markdown
**Feature Description**
A clear description of the feature.

**Use Case**
Why would this feature be useful?

**Proposed Solution**
How do you envision this working?

**Alternatives**
Any alternative solutions considered?

**Additional Context**
Any other context or screenshots.
```

## 🏆 Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md file
- GitHub contributors list
- Release notes for significant contributions

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and general discussion
- **Email**: For security issues or private matters

## 📋 Contributor License Agreement

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

## 🎯 Areas for Contribution

### High Priority
- Performance optimizations
- Mobile responsiveness improvements
- Accessibility enhancements
- Test coverage improvements

### Medium Priority
- New drawing tools
- Export functionality
- UI/UX improvements
- Documentation updates

### Future Features
- Real-time collaboration
- Template system
- Layer management
- Undo/redo functionality

Thank you for contributing to Building Planner! 🏗️
