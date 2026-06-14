# TrendMerch AI — Fashion Merchandising Co-Pilot

TrendMerch AI is an AI-powered merchandising intelligence platform for fashion brands. It helps teams understand product performance, inventory risk, customer segments, regional demand, returns, and trend signals so they can make better merchandising decisions.

The project was built as a functional MVP for a Generative AI capstone project.

---

## Live Project

https://trendmerch-ai.vercel.app

## GitHub Repository

https://github.com/Gouravgiteshacharya/trendmerch-ai-

---

## Problem Statement

Fashion brands deal with fast-changing customer demand. A product may sell well in one region but not in another. Some sizes may go out of stock quickly, while other variants remain unsold. Returns can increase due to wrong sizing, poor product-market fit, or unclear customer preferences.

Many small and mid-sized fashion brands do not have a dedicated analytics team. They often depend on spreadsheets, manual checking, or guesswork to answer questions like:

* Which products should we restock?
* Which SKUs are at risk of going out of stock?
* Which products are slow-moving?
* Which customer segments are buying the most?
* Which regions are performing better?
* Which items have high return rates?
* What actions should we take this week or month?

TrendMerch AI solves this by combining retail analytics with AI-generated recommendations in one simple dashboard.

---

## Solution Overview

TrendMerch AI works as a merchandising co-pilot. It analyzes fashion retail data and business context to generate insights for inventory, products, regions, customer segments, trends, and reports.

The platform helps users move from high-level metrics to SKU-level details. For example, if the dashboard shows stockout risk, users can click the metric and directly view the related product variants in the Products section.

The goal is to make merchandising decisions faster, clearer, and more data-backed.

---

## Target Users

TrendMerch AI is designed for:

* D2C fashion brands
* Boutique fashion stores
* Marketplace sellers
* Instagram fashion stores
* Retail merchandisers
* Brand managers
* Fashion operations teams
* Small teams that need quick business insights without complex BI tools

---

## Key Features

### 1. Landing Page

A professional fashion-tech landing page introduces the product, explains the problem, and guides users toward onboarding, dashboard exploration, or business setup.

### 2. Onboarding Workspace

Users can create a lightweight workspace by entering their company, brand, organisation, or personal name. This information is used to personalize the dashboard and business context.

### 3. Business Setup

The Business Setup section allows users to provide business details through three modes:

* CSV Upload
* Manual Setup
* Guided Demo Dropdowns

Important business fields are mandatory to improve the accuracy of AI-generated reports and recommendations.

### 4. Dashboard Analytics

The dashboard shows key merchandising metrics such as:

* Total Revenue
* Units Sold
* Stockout Risk
* Return Rate

Each metric card works as a drill-down entry point. Clicking a card redirects users to the Products section with the relevant sorting, filtering, and highlighted table column.

### 5. Product / SKU Intelligence

The Products section provides SKU-level analysis with details such as:

* SKU
* Product Name
* Category
* Size
* Color
* Revenue
* Units Sold
* Stock Available
* Returns
* Return Rate
* Risk Label

This helps users identify top-performing products, low-stock variants, slow-moving items, and high-return SKUs.

### 6. Regional Demand

The Regional Demand section shows how product demand varies across different states and regions. This helps brands understand where demand is stronger and where they may need to adjust inventory or marketing focus.

### 7. Clientele Segments

The Clientele Segments section analyzes customer behavior by age group, gender, and buying segment. This helps brands understand who their main customers are and which segments are driving revenue.

### 8. Trend Intelligence

Trend Intelligence identifies products and categories that are gaining momentum. The MVP uses internal retail signals such as sales velocity, stock movement, customer demand, regional performance, and return behavior to estimate trend strength.

### 9. AI Assistant

The AI Assistant answers merchandising questions in natural language. Users can ask questions such as:

* What should we restock this month?
* Which products need attention?
* Which SKUs have high return risk?
* Which region should we focus on?
* What should be our next merchandising action?

The assistant uses business context and analytics data to generate practical recommendations.

### 10. Supporting Data and Explainability

AI-generated answers include supporting data where relevant, so users can understand why a recommendation was made. This makes the assistant more transparent and useful for decision-making.

### 11. Merchandising Report

The Merchandising Report generates a structured business report for the selected timeframe. It includes:

* Executive summary
* Revenue highlights
* Product performance
* Inventory risks
* Regional demand insights
* Customer segment insights
* Trend intelligence
* Recommended actions

### 12. Timeframe Filter

The app supports multiple timeframe options:

* Last 24 Hours
* Last 7 Days
* Last 15 Days
* Last 30 Days
* Last 6 Months
* Last 1 Year
* All Time

This allows users to analyze short-term and long-term merchandising performance.

---

## AI Implementation

TrendMerch AI uses the OpenAI API through secure server-side API routes.

AI is used for:

* Generating merchandising recommendations
* Answering business questions
* Creating structured merchandising reports
* Explaining product, inventory, regional, and customer insights in simple language

The app also includes a fallback insight engine. If the OpenAI API is unavailable or the API quota is exceeded, the product can still generate basic rule-based insights instead of breaking.

---

## Data Input Methods

TrendMerch AI supports three data input approaches:

### 1. CSV Upload

Users can upload structured retail data such as sales, inventory, returns, product, customer, and regional information.

Expected fields include:

* Date
* Product Name
* Category
* Size
* Color
* Price
* Quantity Sold
* Revenue
* Stock Available
* Returns
* State
* City
* Customer Age
* Customer Gender

### 2. Manual Setup

Users can manually enter their business profile, target customer, major regions, return rate range, inventory problem, and business goal.

### 3. Guided Demo Setup

Users can select predefined dropdown values to quickly simulate a fashion business and explore the product without preparing a CSV file.

---

## Analytics Layer

The analytics layer calculates and supports:

* Total revenue
* Total units sold
* Return rate
* Stockout risk SKUs
* Product performance
* SKU-level sales
* Regional demand
* Customer segment demand
* Size-wise demand
* High-return products
* Slow-moving products
* Trend scoring
* Timeframe-based filtering

---

## Tech Stack

* Next.js
* TypeScript
* Tailwind CSS
* OpenAI API
* Recharts
* PapaParse
* Vercel
* GitHub

---

## Product Flow

1. User opens the landing page.
2. User starts onboarding and creates a workspace.
3. User enters business details through CSV upload, manual setup, or guided dropdowns.
4. User views the dashboard for high-level merchandising metrics.
5. User clicks dashboard cards to inspect SKU-level details.
6. User explores product, regional, customer, and trend insights.
7. User asks questions to the AI Assistant.
8. User generates a Merchandising Report for the selected timeframe.

---

## Design Approach

The UI was designed to balance two needs: it should feel relevant to fashion brands, but it should also work as a serious business dashboard. For this reason, the product uses a clean layout, soft neutral colors, readable data cards, and clear navigation.

The design focuses on usability first. Users can quickly understand business metrics, move into detailed tables, and review AI-generated recommendations without needing technical knowledge.

---

## Current Limitations

TrendMerch AI is an MVP and has some limitations:

* It does not currently connect to real Shopify, WooCommerce, ERP, or POS systems.
* It does not include database-backed user authentication.
* Trend Intelligence is based mainly on internal/demo retail signals.
* External trend sources such as Google Trends, social media, and marketplace reviews are not yet integrated.
* The current version is designed for capstone demonstration and MVP validation.

---

## Future Scope

Future improvements can include:

* Shopify and WooCommerce integration
* Marketplace seller dashboard integration
* Real-time inventory sync
* POS and ERP data connection
* External trend signal analysis
* Google Trends and social media trend integration
* Competitor catalog monitoring
* Advanced demand forecasting
* Automated markdown planning
* Size-wise replenishment recommendations
* Multi-brand workspace support
* User accounts and role-based access

---

## Conclusion

TrendMerch AI demonstrates how Generative AI can support real business decision-making beyond a basic chatbot. It combines analytics, business context, AI recommendations, and report generation into a practical merchandising co-pilot for fashion brands.

The MVP helps users understand what is selling, where demand is coming from, which SKUs need attention, which customer segments matter most, and what actions should be taken next.
