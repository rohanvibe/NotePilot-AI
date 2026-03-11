# Security Policy

## Supported Versions

Currently, we only provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 2.x.x   | :white_check_mark: |
| 1.x.x   | :x:                |

## Reporting a Vulnerability

We take the security of NotePilot AI very seriously. If you find a security vulnerability, please do NOT open a public issue. Instead, follow these steps:

1.  **Email us**: Send a detailed report to the maintainers (email available in profile).
2.  **Describe the bug**: Include steps to reproduce, the potential impact, and any suggested fixes.
3.  **Wait for response**: We will acknowledge receipt within 48 hours and provide a timeline for a fix.

Please allow us time to fix the issue before disclosing it publicly. We believe in responsible disclosure and will give credit to researchers who help us keep NotePilot safe.

## Key Security Features in NotePilot
*   **Server-Side AI Processing**: API keys are never exposed to the client.
*   **Sanitized Inputs**: All user-uploaded notes are processed safely.
*   **Zustand Persistence**: Data is stored locally in your browser's IndexedDB, not on our servers.
