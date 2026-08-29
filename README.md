# 🤖 AI Price Scout

AI Price Scout is an AI-powered product research and price analysis application that searches the web for products, collects relevant pages, analyzes product information, and performs sentiment analysis using AI agents.

The application uses **Next.js, Inngest, AI agents, Serper Search, MongoDB, and React Query** to create an automated product research workflow.

---


![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)
![NextAuth.js](https://img.shields.io/badge/NextAuth.js-Secure-green?logo=nextdotjs)
![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white)


## 📸 Screenshot


> Add your project screenshot here.

Replace the image below with your own screenshot:

```md
<!-- ![AI Price Scout Screenshot](../product-ai-agents/scen.png) -->
```

### Example

Create a folder:

```text
screenshots/
└── ai-price-scout.png
```

Then put your screenshot inside that folder.

---

## ✨ Features

* 🔍 Search for products
* 🤖 AI-powered product research
* 🌐 Web search using Serper API
* 📄 Automatic webpage scraping
* 💰 Product price research
* 😊 Sentiment analysis
* ⭐ Rating and review analysis
* 🔗 Collect product links
* ⚡ Background processing with Inngest
* 📊 Real-time progress tracking
* 💾 MongoDB result storage
* 🔄 Automatic result polling with React Query
* 🛡️ Error handling and workflow retries
* 📱 Responsive web interface

---

## 🧠 How It Works

The application follows an AI-agent workflow:

```text
User
 │
 │ Search "iPhone 15"
 ▼
Next.js Frontend
 │
 ▼
/api/run-agents
 │
 ▼
MongoDB
 │
 │ Create runId
 ▼
Inngest
 │
 │ ai.agents/run-agents
 ▼
Price Analysis Workflow
 │
 ▼
Supervisor Agent
 │
 ├── Price Scout
 │      │
 │      └── Serper Search
 │
 ├── Webpage Scraper
 │
 └── Sentiment Analyzer
 │
 ▼
MongoDB
 │
 ▼
/api/results/[runId]
 │
 ▼
React Query
 │
 ▼
Frontend Results
```

---

## 🛠️ Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* TanStack React Query

### Backend

* Next.js API Routes
* Inngest
* MongoDB

### AI & Data

* AI Agents
* Serper API
* Web Scraping
* Sentiment Analysis

---

## 📂 Project Structure



---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

```bash
cd ai-price-scout
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file:

```env
MONGODB_URI=your_mongodb_connection_string

SERPER_API_KEY=your_serper_api_key

INNGEST_DEV=1
```

> Never commit your `.env.local` file or expose your API keys publicly.

---

## ▶️ Run the Development Server

Start the Next.js application:

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:3000
```

---

## ⚡ Run Inngest Dev Server

For local Inngest development, start the Inngest Dev Server according to your installed Inngest setup.

Your application endpoint is:

```text
/api/inngest
```

The workflow is triggered by:

```text
ai.agents/run-agents
```

---

## 🔍 Example

Enter a product into the search box:

```text
iPhone 15
```

Then click:

```text
Run
```

The application creates a unique `runId` and starts the AI workflow.

Example:

```text
Search
   ↓
iPhone 15
   ↓
Price Scout
   ↓
Web Search
   ↓
Scraping
   ↓
Sentiment Analysis
   ↓
Results
```

---

## 📊 Results

The application can display:

### Search Results

```text
Apple iPhone 15
Verizon iPhone 15
Amazon iPhone 15
Best Buy iPhone 15
Back Market iPhone 15
```

### Scraped Pages

The system extracts useful information from discovered webpages.

### Sentiment

Example:

```text
Positive    0.90
Positive    0.75
Neutral     0.50
Positive    0.80
```

---

## 🔄 Background Workflow

Inngest handles the long-running AI workflow in the background.

The workflow:

```text
ai.agents/run-agents
        ↓
price-analysis-workflow
        ↓
Supervisor
        ↓
price-scout
        ↓
Search
        ↓
Scraping
        ↓
Sentiment
        ↓
Save Results
```

This allows the frontend to start a job and then monitor its progress using the generated `runId`.

---

## 🧪 Development

Check your terminal for workflow logs such as:

```text
🤖 [Inngest] Starting agents in background

🔍 [Supervisor] Current state

Supervisor: Routing to agent: price-scout

SEARCH: iPhone 15 price
```

---

## 🔐 Environment Variables

| Variable         | Description                       |
| ---------------- | --------------------------------- |
| `MONGODB_URI`    | MongoDB connection string         |
| `SERPER_API_KEY` | Serper search API key             |
| `INNGEST_DEV`    | Enables local Inngest development |

For production, configure the appropriate Inngest signing key instead of local development mode.

---

## 📸 Adding Screenshots

To add screenshots to this README:

1. Create a `screenshots` folder.

```bash
mkdir screenshots
```

2. Put your screenshot inside:

```text
screenshots/
└── ai-price-scout.png
```

3. Add this to the README:

```md
<!-- ![AI Price Scout](./screenshots/ai-price-scout.png) -->
```

You can also add multiple screenshots:

```md
## 📸 Screenshots

### Dashboard

<!-- ![Dashboard](./screenshots/dashboard.png)

### Search Results

![Search Results](./screenshots/search-results.png)

### Sentiment Analysis

![Sentiment](./screenshots/sentiment.png)
``` -->

---

## 🗺️ Roadmap

Future improvements may include:

* [ ] 💰 Advanced price extraction
* [ ] 📈 Price comparison charts
* [ ] 📊 Historical price tracking
* [ ] ⭐ Better review analysis
* [ ] 🛒 More online stores
* [ ] 🌍 Multi-country search
* [ ] 📱 Mobile optimization
* [ ] 🔔 Price alerts
* [ ] 👤 User authentication
* [ ] 📦 Product comparison
* [ ] 📤 Export results to CSV/PDF
* [ ] 🤖 More specialized AI agents

---

## 🤝 Contributing

Contributions are welcome.

To contribute:

```bash
git checkout -b feature/new-feature
```

Make your changes, then commit:

```bash
git add .
git commit -m "Add new feature"
```

Push your branch:

```bash
git push origin feature/new-feature
```

Then open a Pull Request.

---

## 📄 License

This project is licensed under the **MIT License**.

You are free to use, modify, and distribute this project under the terms of the MIT License.

See the `LICENSE` file for more information.

---

## 👨‍💻 Author

**AI Price Scout**

Built with:

* Next.js
* React
* TypeScript
* Tailwind CSS
* Inngest
* MongoDB
* AI Agents
* Serper API

---

## ⭐ Support

If you find this project useful, consider giving it a ⭐ on GitHub.

**AI Price Scout — Search smarter. Analyze faster.**
