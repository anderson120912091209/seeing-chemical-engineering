# Seeing Science: Chemical Engineering Edition 🧪

<div align="center">

![Seeing Science Banner](https://via.placeholder.com/800x200/1a1a1a/81a8e7?text=Seeing+Science)

**An interactive visualization platform inspired by 3Blue1Brown, designed to make complex chemical engineering and statistical concepts intuitive and accessible.**

[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![D3.js](https://img.shields.io/badge/D3.js-7.0+-orange?style=flat-square&logo=d3.js)](https://d3js.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0+-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

[🚀 Live Demo](#) • [📖 Documentation](#documentation) • [🤝 Contributing](#contributing)

</div>

## 🌟 Project Origin

這個專案源於我在醫療注射器製造公司實習時遇到的真實問題。作為製造業，統計品質控制至關重要，但我發現團隊中大部分工程師對統計概念只有表面理解。

This project was born from a real-world problem I encountered during my internship at a medical syringe manufacturing company. As a manufacturing industry, statistical quality control is crucial, but I noticed that most engineers on our team only had surface-level understanding of statistical concepts.

這導致經常出現統計方法的誤用 - 工程師會使用「聽起來合理」但根本上錯誤的方法。例如，**自由度 (degrees of freedom)** 這個概念是大多數人每天都在使用，但卻不真正理解其背後原理的概念。

This led to frequent misapplications of statistical methods - engineers would use approaches that "sounded right" but were fundamentally incorrect. For example, the concept of **degrees of freedom** is something most people use daily without truly understanding the underlying principles.

在實習過程中，我花了大量時間製作各種 PowerPoint 簡報和視覺化圖表，幫助沒有深厚統計背景的工程師理解這些基本概念。這個專案將那段經驗轉化為一個可持續、可重複使用的教育平台。

During my internship, I spent considerable time creating PowerPoint presentations and visualizations to help engineers without strong statistical backgrounds understand these fundamental concepts. This project transforms that experience into a sustainable, reusable educational platform.

> *"If you can't explain it simply, you don't understand it well enough."* - Albert Einstein

## 🎯 Mission

**讓複雜的工程概念像 3Blue1Brown 讓數學一樣直觀易懂。**

**Making complex engineering concepts as intuitive as 3Blue1Brown makes mathematics.**

我們相信視覺化學習可以彌合理論知識與實際應用之間的差距，特別是在統計素養對品質控制和決策制定至關重要的工程領域。

We believe that visual learning can bridge the gap between theoretical knowledge and practical application, especially in engineering fields where statistical literacy is crucial for quality control and decision-making.

## ✨ Features

### 📊 Interactive ANOVA Visualization
- **逐步變異數計算** 配合動畫數學公式
- **真實案例研究** 使用 36 名學生教學方法比較範例
- **互動式控制** 探索分析的不同階段
- **LaTeX 渲染方程式** 確保數學精確性

### 🎨 Modern User Experience
- **響應式設計** 適用於所有設備
- **深色/淺色主題切換** 舒適的觀看體驗
- **流暢動畫** 由 Framer Motion 驅動
- **可調整面板** 客製化學習體驗
- **自訂滾動條** 精緻的介面

### 🔧 Developer-Friendly Architecture
- **組件化設計** 易於擴展
- **全面 TypeScript** 類型安全
- **模組化動畫系統** 便於添加新的視覺化
- **清晰的關注點分離** UI 與邏輯分離

## 🛠️ Tech Stack

### Frontend Framework
- **[Next.js 15.3.3](https://nextjs.org/)** - React 框架配合 App Router
- **[React 18+](https://reactjs.org/)** - UI 函式庫配合 hooks 和現代模式
- **[TypeScript](https://www.typescriptlang.org/)** - 類型安全的 JavaScript

### Styling & UI
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS 框架
- **[Framer Motion](https://www.framer.com/motion/)** - 動畫函式庫
- **[PrimeReact](https://primereact.org/)** - UI 組件函式庫（分割面板）

### Data Visualization
- **[D3.js](https://d3js.org/)** - 數據驅動的文檔操作
- **[KaTeX](https://katex.org/)** - 快速數學排版 LaTeX 方程式
- **[React-KaTeX](https://github.com/MatejBransky/react-katex)** - KaTeX 的 React 包裝器

### Development Tools
- **[Turbopack](https://turbo.build/pack)** - 快速開發打包工具
- **[ESLint](https://eslint.org/)** - 程式碼檢查
- **自訂 hooks** - 主題管理和動畫的可重用邏輯

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm 或 yarn 套件管理器

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/seeing-chemical-engineering.git

# Navigate to project directory
cd seeing-chemical-engineering

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Project Structure
