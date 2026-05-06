# Logging Middleware

A reusable logging middleware for capturing application logs with different severity levels and categorization.

## Overview

The Logging Middleware is a critical component for building robust and observable applications. It captures the entire lifecycle of significant events within your application - from successful operations to warnings, informational messages, and debugging details. Think of logs as the narrative of your application's execution!

## Installation

```bash
npm install
```

## Usage

### Basic Usage

```javascript
const Log = require("./logger");

// Log a message
await Log(stack, level, package, message);
```

### Parameters

- **stack** (string): The stack where the log originates - `"frontend"` or `"backend"`
- **level** (string): Log severity level
  - `debug` - Detailed information for debugging
  - `info` - General informational messages
  - `warn` - Warning messages
  - `error` - Error messages
  - `fatal` - Critical/fatal errors
- **package** (string): The package/module category
  - **Frontend packages**: `api`, `component`, `hook`, `page`, `state`, `style`
  - **Backend packages**: `cache`, `controller`, `cron_job`, `db`, `domain`, `handler`, `repository`, `route`, `service`
  - **Both**: `auth`, `config`, `middleware`, `utils`
- **message** (string): The log message with specific context

### Examples

```javascript
const Log = require("./logger");

// Frontend component log
await Log("frontend", "info", "component", "Navbar rendered successfully");

// Frontend hook log
await Log("frontend", "debug", "hook", "useAuth hook initialized");

// Frontend page log
await Log("frontend", "warn", "page", "Dashboard page loading slowly");
```

## API Response

Successful log submission returns:

```json
{
  "logID": "xxxx",
  "message": "log created successfully"
}
```

## Running Tests

```bash
node test.js
```

## Requirements

- Node.js
- axios (HTTP client)

## Log API Endpoint

- **URL**: `http://20.207.122.201/evaluation-service/logs`
- **Method**: POST
- **Authentication**: Bearer Token (required in Authorization header)
