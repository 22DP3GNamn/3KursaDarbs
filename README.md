# 3KursaDarbs

## Overview

This is a web application for party and game management, built as a coursework project.

## Technologies Used

### Frontend

- **Vue.js** (with Single File Components)
- **Tailwind CSS** for styling

### Backend

- **Laravel** (PHP framework)
- **MySQL** (or compatible database)

## Getting Started

### Prerequisites

- Node.js and npm
- PHP (>= 8.0)
- Composer
- MySQL (or another supported database)

### Installation

1. **Clone the repository:**
   ```sh
   git clone <repository-url>
   cd 3KursaDarbs
   ```

2. **Install backend dependencies:**
   ```sh
   composer install
   ```

3. **Install frontend dependencies:**
   ```sh
   npm install
   ```

4. **Run database migrations:**
   ```sh
   php artisan migrate
   ```

5. **Import categorys in DB**
    ```sh
   php artisan db:seed
   ```

### Running the Application

- **Start the backend server:**
  ```sh
  php artisan serve
  ```

- **Start the frontend development server:**
  ```sh
  npm run dev
  ```

Visit the app at [http://127.0.0.1:8000](http://127.0.0.1:8000) (or the port shown in your terminal).

## Usage

- **Register/Login:** Create an account or log in.
- **Profile:** Update your profile information.
- **Games:** View, create, and manage games.
- **Party:** Create and manage parties, invite users, and respond to invitations.
- **Admin:** Admin users can manage all users.

---

For questions or issues, contact the project maintainer.
