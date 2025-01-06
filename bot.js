const { Client, GatewayIntentBits } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();

// Database setup
const db = new sqlite3.Database('./user_activity.db', (err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the database.');
    }
});

// Create the table with the correct schema
db.run(`
    CREATE TABLE IF NOT EXISTS user_activity (
        user_id TEXT PRIMARY KEY,         -- Unique identifier for users
        username TEXT,                   -- Username for reference
        check_in_time INTEGER,           -- Timestamp of check-in
        total_time INTEGER DEFAULT 0     -- Total time in seconds
    )
`, (err) => {
    if (err) {
        console.error('Error creating table:', err.message);
    }
});

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// Bot ready event
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

// Command handler
client.on('messageCreate', (message) => {
    if (!message.content.startsWith('!')) return;

    const args = message.content.split(' ');
    const command = args.shift().toLowerCase();
    const userId = message.author.id;
    const username = message.author.username;
    const now = Date.now();

    // !checkin command
    if (command === '!checkin') {
        db.get('SELECT check_in_time FROM user_activity WHERE user_id = ?', [userId], (err, row) => {
            if (err) {
                console.error('Error querying database:', err.message);
                message.reply('An error occurred. Please try again later.');
                return;
            }

            if (row && row.check_in_time) {
                message.reply('You are already checked in.');
            } else {
                db.run(`
                    INSERT INTO user_activity (user_id, username, check_in_time)
                    VALUES (?, ?, ?)
                    ON CONFLICT(user_id) DO UPDATE SET
                    username = ?,
                    check_in_time = ?
                `, [userId, username, now, username, now], (err) => {
                    if (err) {
                        console.error('Error inserting into database:', err.message);
                        message.reply('An error occurred while checking in.');
                    } else {
                        message.reply('You have successfully checked in!');
                    }
                });
            }
        });
    }

    // !checkout command
    if (command === '!checkout') {
        db.get('SELECT check_in_time, total_time FROM user_activity WHERE user_id = ?', [userId], (err, row) => {
            if (err) {
                console.error('Error querying database:', err.message);
                message.reply('An error occurred. Please try again later.');
                return;
            }

            if (!row || !row.check_in_time) {
                message.reply('You are not checked in.');
            } else {
                const duration = Math.floor((now - row.check_in_time) / 1000);

                db.run(`
                    UPDATE user_activity
                    SET total_time = total_time + ?,
                        check_in_time = NULL
                    WHERE user_id = ?
                `, [duration, userId], (err) => {
                    if (err) {
                        console.error('Error updating database:', err.message);
                        message.reply('An error occurred while checking out.');
                    } else {
                        const hours = Math.floor(duration / 3600);
                        const minutes = Math.floor((duration % 3600) / 60);
                        const seconds = duration % 60;

                        message.reply(`You have checked out. Session duration: ${hours}h ${minutes}m ${seconds}s.`);
                    }
                });
            }
        });
    }

    // !summary command
    if (command === '!summary') {
        const days = parseInt(args[0], 10) || 7;
        const since = now - days * 24 * 60 * 60 * 1000;

        db.all(`
            SELECT username, total_time
            FROM user_activity
            WHERE total_time > 0
            ORDER BY total_time DESC
        `, [], (err, rows) => {
            if (err) {
                console.error('Error querying database:', err.message);
                message.reply('An error occurred while fetching the summary.');
                return;
            }

            if (rows.length === 0) {
                message.reply('No activity data available.');
                return;
            }

            const summary = rows.map(row => {
                const hours = Math.floor(row.total_time / 3600);
                const minutes = Math.floor((row.total_time % 3600) / 60);
                return `${row.username}: ${hours}h ${minutes}m`;
            }).join('\n');

            message.reply(`Activity summary for the last ${days} days:\n${summary}`);
        });
    }
});

// Login to Discord
require('dotenv').config();
client.login(process.env.DISCORD_BOT_TOKEN);