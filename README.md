# Seeing Science: Chemical Engineering Edition

A visual learning platform for complex engineering concepts, inspired by 3Blue1Brown's approach to mathematical education.

## 📚 Course Syllabus (To be discussed & confirmed with other contributors) 

### 📊 Advanced Statistics
**Engineering Statistics Concepts**
- Statistical Tests
- Bayesian Statistics

### 🌊 Mass Transfer & Diffusion *(Planned)*
- Fick's Laws of Diffusion
- Concentration Gradients
- Mass Transfer Coefficients
- Boundary Layer Theories 

### 🔥 Thermodynamics *(Planned)*
- First & Second Laws of Thermodynamics
- Enthalpy & Entropy Calculations
- Phase Diagrams
- Heat Transfer Mechanisms

## 🛠️ Tech Stack

### Core Framework
- **[Next.js 15.3.3](https://nextjs.org/)** - React framework with App Router & Turbopack
- **[React 19](https://reactjs.org/)** - UI library with latest concurrent features
- **[TypeScript 5+](https://www.typescriptlang.org/)** - Type-safe development

### Visualization & Animation
- **[D3.js 7.9.0](https://d3js.org/)** - Data-driven animations and interactive charts
- **[Framer Motion 12.18.1](https://www.framer.com/motion/)** - Smooth UI animations and transitions

### Mathematical Rendering
- **[KaTeX 0.16.22](https://katex.org/)** - Fast LaTeX math rendering
- **[React-KaTeX 3.1.0](https://github.com/MatejBransky/react-katex)** - React integration for mathematical equations

### UI & Styling
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[PrimeReact 10.9.6](https://primereact.org/)** - Resizable panels and UI components
- **[Lucide React](https://lucide.dev/)** - Icon library
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives

### Development Tools
- **[Turbopack](https://turbo.build/pack)** - Fast bundler for development
- **[ESLint 9](https://eslint.org/)** - Code linting and formatting


## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm/yarn/pnpm

### Installation
```bash
git clone https://github.com/yourusername/seeing-chemical-engineering.git
cd seeing-chemical-engineering
npm install
npm run dev
```

Visit `http://localhost:3000` to start learning.

## 🎯 Key Features

### Interactive Learning
- **Step-by-step progression** through complex concepts
- **Real-time mathematical calculations** with LaTeX rendering
- **Interactive data visualization** using D3.js
- **Responsive design** for desktop and mobile learning

### Educational Tools
- **Progress tracking** with visual indicators
- **Resizable panels** for customized learning experience
- **Dark/light themes** for comfortable studying
- **Mathematical notation** rendered with KaTeX

### Developer Experience
- **TypeScript throughout** for type safety
- **Component-based architecture** for easy extension
- **Hot reload** with Turbopack for fast development
- **ESLint configuration** for code quality

## 🤝 Contributing

We welcome contributions from:
- **Chemical Engineers** - Domain expertise and curriculum development
- **Frontend Developers** - UI/UX improvements and new features
- **Educators** - Pedagogical insights and content review
- **Students** - Feedback on learning effectiveness

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-animation`
3. Install dependencies: `npm install`
4. Start development server: `npm run dev`
5. Make your changes and test thoroughly
6. Submit a pull request

### Adding New Animations
1. Create component in `app/components/animations/[MODULE]/`
2. Use D3.js for data visualization
3. Integrate KaTeX for mathematical equations
4. Add navigation stages in the component
5. Update the course syllabus

## 📋 Roadmap

- [ ] Complete ANOVA module with regression analysis
- [ ] Implement mass diffusion visualizations
- [ ] Add thermodynamics phase diagrams
- [ ] Mobile optimization
- [ ] Multi-language support
- [ ] User progress persistence
- [ ] Interactive problem sets

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- **3Blue1Brown** - Visual mathematics education inspiration
- **Seeing Theory** - Interactive statistics education
- **Chemical Engineering Community** - Real-world problem validation
