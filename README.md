#  Good Recipes

A social platform for discovering, organizing, and sharing recipes—all in one place.

---

##  Features

* Search and discover recipes
* Create and manage recipe collections
* Publish recipes with categories, ingredients, and dietary tags
* Rate and review recipes
* Social interaction (share & explore)
* Secure authentication (hashed passwords)

### Admin Capabilities

* Manage users
* Edit/delete inappropriate content

---

## Tech Stack

* **Frontend:** React (JSX)
* **Backend:** Flask (Python)
* **Database:** MySQL (Aiven cloud hosting)

---

## Core Model

* **Users** → create recipes, reviews, collections
* **Recipes** → include ingredients, categories, dietary flags
* **Collections** → organize saved recipes
* **Reviews** → ratings + feedback

Relational design supports **many-to-many relationships** for flexible tagging and organization.

---

## Security

* Password hashing (SHA256)
* Parameterized queries (SQL injection protection)
* Secure credential handling via `.env`

---

## Setup

### 1. Install Backend Dependencies

```bash
pip install python-dotenv flask flask-cors mysql-connector-python gunicorn
```

### 2. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

### 3. Start Backend

```bash
cd backend
python app.py
```

### 4. Configure Environment

Create `/backend/.env`:

```env
DB_HOST=your_host
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=your_database
```

---

## Database

* Built with MySQL (Workbench)
* Cloud-hosted for team access
* Preloaded with sample data