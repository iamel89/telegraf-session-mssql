telegraf-session-mssql
`mssql session middleware for telegraf framework`

Install with npm/yarn
```
npm install telegraf-session-mssql
yarn add telegraf-session-mssql
```
Create table in your database

```
CREATE TABLE [dbo].[user_sessions](
	[id] nvarchar(50) NOT NULL,
	[session] nvarchar(max) NULL
)
```

Example:
```
const sql = require('mssql');
const session = require('telegraf-session-mssql');

const dotenv = require('dotenv');
dotenv.config();

const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);

const dbConfig = {
  server: process.env.DATABASE_URL,
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  options: {
    enableArithAbort: true,
  },
};

try {
  sql.connect(dbConfig);
} catch (err) {
  console.error(err.message);
}

const sessionOptions = {
  db: sql,                    // your mssql instance
  table_name: 'user_session', // database table name
}

bot.use(session(sessionOptions));
...
```

Options object description

| key        | description                                      | default            |
|------------|--------------------------------------------------|--------------------|
| db         | mssql instance                                   | none               |
| table_name | database table name where session will be stored | 'telegraf_session' |

 