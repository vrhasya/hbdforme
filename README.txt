# Luxury Birthday Experience — Netlify

## 1. Upload to GitHub
Upload the complete folder to a GitHub repository.

Do NOT upload Telegram bot tokens.

## 2. Connect to Netlify
In Netlify, import the GitHub repository.

Build settings:
- Build command: leave empty
- Publish directory: public
- Functions directory: netlify/functions

netlify.toml already contains these settings.

## 3. Add Netlify Environment Variables

Site configuration → Environment variables:

TELEGRAM_BOT_TOKEN = token from BotFather
TELEGRAM_LOG_CHAT_ID = your Logs group ID
TELEGRAM_LOG_TOPIC_ID = optional forum topic ID

Do not put these values in index.html or script.js.

## 4. Telegram
Add the bot to the Logs group and give it permission to send messages.

If using a forum topic, put that topic's numeric ID in TELEGRAM_LOG_TOPIC_ID.

## 5. Music
Put music.mp3 in public/ if you want background music.

## 6. Testing
Open the deployed Netlify URL, wait until the birthday screen, click SEND WISH, and check the Logs group/topic.
