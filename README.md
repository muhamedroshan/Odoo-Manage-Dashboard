# Server Management Dashboard

A full-stack application designed to remotely monitor server logs, manage backups, and execute maintenance scripts for Odoo (or any Linux service). Built with **Node.js**, **Express**, **Socket.io**, and **React (Vite + Tailwind CSS v4)**.

![Status](https://img.shields.io/badge/Status-Active-success)
![Stack](https://img.shields.io/badge/Stack-MERN-blue)
![Tailwind](https://img.shields.io/badge/Style-Tailwind_v4-cyan)
![Security](https://img.shields.io/badge/Security-Sudoers_Config-red)

## 📋 Features

* **Secure Login**: JWT-based authentication using environment variables.
* **Live Log Monitoring**: Real-time server log streaming via WebSockets (Socket.io) with "Smart Scroll" and syntax highlighting.
* **Privileged Remote Actions**: Securely execute **Git Pull** and **System Service Restarts** from the UI without exposing root access, utilizing `visudo` configuration.
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
│   └── vite.config.js      # Vite config
├── server/                 # Node.js Backend
│   ├── backups/            # Directory for storing/serving backups
│   ├── scripts/            # Shell scripts
│   │   ├── git_update.sh       # <--- Pulls changes from GitHub
│   │   └── restart_service.sh  # <--- Restarts systemctl service
│   ├── server.js           # Main entry point (API + WebSockets)
│   └── .env                # Secrets and configuration
└── README.md
````

-----

## 🔐 Security & Script Configuration (Crucial)

**Do not run this application as root.** Instead, we configure the server to allow the specific Node.js user to run only specific scripts with `sudo` privileges without a password.

### 1\. Create the Scripts [Sample script is included in /server/scripts]

Ensure your scripts exist and are executable:

```bash
chmod +x /home/ubuntu/scripts/git_update.sh
chmod +x /home/ubuntu/scripts/restart_service.sh
```

### 2\. Configure `visudo`

Allow the user (e.g., `ubuntu`) to run these specific files as root without a password prompt.

1.  Open the editor: `sudo visudo`
2.  Add these lines to the bottom:
    ```text
    ubuntu ALL=(ALL) NOPASSWD: /home/ubuntu/scripts/git_update.sh
    ubuntu ALL=(ALL) NOPASSWD: /home/ubuntu/scripts/restart_service.sh
    ```

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
3.  Create a `.env` file in the `server/` root. **Note: Use absolute paths for scripts.**
    ```env
    PORT=5000
    # Security
    ADMIN_USER=admin
    ADMIN_PASS=YourStrongPassword!
    JWT_SECRET=development_secret_key

    # Paths (Adjust these for your local machine)
    BACKUP_DIR=./backups
    LOG_FILE_PATH=./dummy_odoo.log

    # Scripts (Must be absolute paths in Production)
    SCRIPT_PULL=/home/ubuntu/scripts/git_update.sh
    SCRIPT_RESTART=/home/ubuntu/scripts/restart_service.sh
    ```

### 2\. Frontend Setup (React + Tailwind v4)

1.  Navigate to the client directory:
    ```bash
    cd ../client
    npm install
    ```
2.  Start the development server:
    ```bash
    npm run dev
    ```

-----

## 🌐 Production Deployment (Ubuntu/Linux)

### Step 1: Deploy Backend

1.  Clone repo and install dependencies.
2.  Update `.env` with **production paths**:
    ```env
    # Logs
    LOG_FILE_PATH=/var/log/odoo/odoo-server.log
    BACKUP_DIR=/var/lib/odoo/.local/share/Odoo/backups/

    # Script Paths (Must match what is in 'visudo')
    SCRIPT_PULL=/home/ubuntu/scripts/git_update.sh
    SCRIPT_RESTART=/home/ubuntu/scripts/restart_service.sh
    ```
3.  Run with PM2:
    ```bash
    pm2 start server.js --name "server-dashboard"
    ```

### Step 2: Nginx Configuration

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

## 🛠 Troubleshooting

### 1\. Script Execution Fails ("Permission Denied")

  * **Check 1:** Ensure the script file is executable: `chmod +x path/to/script.sh`.
  * **Check 2:** Ensure the path in `.env` exactly matches the path in `/etc/sudoers` (visudo).
  * **Check 3:** Ensure you are using `sudo` in your Node.js `exec` call (e.g., `exec('sudo ' + scriptPath)`).

### 2\. Live Logs Not Updating (Windows/WSL)

  * **Cause:** Windows file systems often don't trigger standard `fs.watch` events reliably.
  * **Solution:** The backend is configured to use **polling** (`useWatchFile: true`) in `server.js`.

<!-- end list -->

```
```