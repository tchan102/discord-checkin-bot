
# Discord Check-In Bot

A simple and powerful Discord bot that tracks user activity through `!checkin` and `!checkout` commands. The bot logs the time users spend in sessions and provides activity summaries. Built with Node.js and SQLite, it’s lightweight and easy to deploy.

---

## Features
- **Check-In and Check-Out**: Tracks the time users spend in sessions.
- **Activity Summary**: Displays total session time for users over the past 7 days (or a custom period).
- **Docker Support**: Easily deploy the bot using Docker for a reliable and isolated environment.
- **Lightweight Database**: Uses SQLite for local data storage, ensuring simplicity and performance.

---

## Commands

| Command            | Description                                                                 |
|--------------------|-----------------------------------------------------------------------------|
| `!checkin`         | Starts tracking a user's session.                                           |
| `!checkout`        | Ends the session and logs the duration.                                     |
| `!summary [days]`  | Displays the total time spent by users in the past `[days]` (default: 7).   |

---

## Getting Started

### Prerequisites
1. [Node.js](https://nodejs.org/) (version 16 or higher)
2. [Git](https://git-scm.com/)
3. (Optional) [Docker](https://www.docker.com/) for containerized deployment

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/discord-checkin-bot.git
   cd discord-checkin-bot
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   Create a `.env` file to store your Discord bot token:
   ```bash
   touch .env
   ```
   Add the following line to `.env`:
   ```
   DISCORD_BOT_TOKEN=your_bot_token
   ```

4. **Run the Bot**
   Start the bot locally:
   ```bash
   node bot.js
   ```

---

## Docker Deployment

### Build the Docker Image
```bash
docker build -t discord-checkin-bot .
```

### Run the Docker Container
```bash
docker run -d \
  --name discord-checkin-bot \
  -e DISCORD_BOT_TOKEN=your_bot_token \
  discord-checkin-bot
```

### Monitor the Bot
- Check logs:
  ```bash
  docker logs discord-checkin-bot
  ```
- Restart the container:
  ```bash
  docker restart discord-checkin-bot
  ```

---

## How to Use

1. Invite the bot to your server:
   - Go to the [Discord Developer Portal](https://discord.com/developers/applications).
   - Copy the OAuth2 URL and invite the bot to your server with the necessary permissions.

2. Interact with the bot using the commands:
   - `!checkin` to start tracking time.
   - `!checkout` to end your session.
   - `!summary` to view a summary of user activity.

---

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add a new feature"
   ```
4. Push to your fork:
   ```bash
   git push origin feature-name
   ```
5. Create a pull request on the main repository.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Support

If you encounter any issues or have feature requests, please open an [issue](https://github.com/your-username/discord-checkin-bot/issues).

---

## Acknowledgments

- [Discord.js](https://discord.js.org/) for the powerful Discord API library.
- [SQLite](https://www.sqlite.org/) for the lightweight database.
