# Server Management Dashboard (Wedo Technologies)

A full-stack application designed to remotely monitor server logs, manage backups, and execute maintenance scripts for Odoo (or any Linux service). Built with **Node.js**, **Express**, **Socket.io**, and **React (Vite + Tailwind CSS v4)**.

![Status](https://img.shields.io/badge/Status-Active-success)
![Stack](https://img.shields.io/badge/Stack-MERN-blue)
![Tailwind](https://img.shields.io/badge/Style-Tailwind_v4-cyan)

## 📋 Features

* **Secure Login**: JWT-based authentication using environment variables.
* **Live Log Monitoring**: Real-time server log streaming via WebSockets (Socket.io) with "Smart Scroll" and syntax highlighting.
* **Remote Actions**: Execute shell scripts (e.g., Git Pull, Service Restart) from the UI.
* **Backup Management**: View, track, and securely download server backup files.
* **Modern UI**: Dark-themed, glassmorphism design using Tailwind CSS v4.

---

## 📂 Project Structure

```bash
server-manager/
├── client/                 # React Frontend (Vite + Tailwind v4)
│   ├── src/
│   │   ├── components/     # Layouts and reusable UI
│   │   ├── context/        # Auth Context
│   │   ├── pages/          # Login, Dashboard, Backups
│   │   └── index.css       # Global styles & Tailwind @theme
│   └── vite.config.js      # Vite config (includes Tailwind plugin)
├── server/                 # Node.js Backend
│   ├── backups/            # Directory for storing/serving backups
│   ├── scripts/            # Shell scripts (pull, restart)
│   ├── server.js           # Main entry point (API + WebSockets)
│   └── .env                # Secrets and configuration
└── README.md
````

-----

## 🚀 Development Setup (Local)

### 1\. Backend Setup (Node.js)

1.  Navigate to the server directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `server/` root:
    ```env
    PORT=5000
    # Security
    ADMIN_USER=admin
    ADMIN_PASS=YourStrongPassword!
    JWT_SECRET=development_secret_key

    # Paths (Adjust these for your local machine)
    BACKUP_DIR=./backups
    LOG_FILE_PATH=./dummy_odoo.log
    SCRIPT_PULL=./scripts/pull_changes.sh
    SCRIPT_RESTART=./scripts/restart_odoo.sh
    ```
4.  **Mock Data (Optional):** Create dummy scripts and log files to test functionality locally.
    ```bash
    mkdir scripts backups
    echo "echo 'Simulating Git Pull... Success'" > scripts/pull_changes.sh
    echo "echo 'Simulating Odoo Restart... Success'" > scripts/restart_odoo.sh
    echo "[INFO] Server started..." > dummy_odoo.log
    ```
5.  Start the server:
    ```bash
    node server.js
    ```

### 2\. Frontend Setup (React + Tailwind v4)

1.  Navigate to the client directory:
    ```bash
    cd ../client
    ```
2.  Install dependencies:
    ```bash
    npm install
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Access the app at `http://localhost:5173`.

-----

## 🌐 Production Deployment (Ubuntu/Linux)

### Step 1: Deploy Backend

1.  Clone repo and install dependencies.
2.  Update `.env` with **production paths**:
    ```env
    BACKUP_DIR=/var/lib/odoo/.local/share/Odoo/backups/
    LOG_FILE_PATH=/var/log/odoo/odoo-server.log
    SCRIPT_RESTART=/home/ubuntu/scripts/restart_odoo.sh
    ```
3.  Run with PM2:
    ```bash
    pm2 start server.js --name "server-dashboard"
    ```

### Step 2: Deploy Frontend

1.  Build the static files:
    ```bash
    cd client
    npm run build
    ```
2.  Serve the `dist/` folder using Nginx.

### Step 3: Nginx Configuration

Use this block to proxy API requests and WebSockets correctly.

```nginx
server {
    server_name your-domain.com;

    location / {
        root /var/www/dashboard/dist;
        try_files $uri /index.html;
    }

    # API Proxy
    location /api {
        proxy_pass http://localhost:5000;
    }

    # Socket.io Proxy (Crucial for Live Logs)
    location /socket.io/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

-----

## 🛠 Troubleshooting & Known Issues

### 1\. Live Logs Not Updating (Windows/WSL)

  * **Issue:** The log viewer is blank or only updates on refresh.
  * **Cause:** Windows file systems often don't trigger standard `fs.watch` events reliably for appended logs.
  * **Solution:** The backend is configured to use **polling** (`useWatchFile: true`) in `server.js`. This ensures compatibility across Windows and Linux.

### 2\. Styles Not Loading (White Background)

  * **Issue:** The screen is white, and dark mode isn't working.
  * **Cause:** Incorrect Tailwind setup. This project uses **Tailwind v4**.
  * **Solution:** \* Delete `tailwind.config.js` and `postcss.config.js` from `client/`.
      * Verify `src/index.css` starts with `@import "tailwindcss";`.
      * Restart Vite (`npm run dev`) to clear the CSS cache.

### 3\. Script Execution Fails

  * **Issue:** Clicking "Restart Service" returns a permission error.
  * **Solution:** The Node.js process needs permission to run the shell script.
      * Run `chmod +x scripts/restart_odoo.sh`.
      * If using `systemctl`, add the user to `visudo` for passwordless execution.

<!-- end list -->

```
```