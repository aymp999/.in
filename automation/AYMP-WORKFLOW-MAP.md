# AYMP Workflow Map

This file separates active automation from parked legacy workflows without deleting anything.

## Active
- `.github/workflows/aymp-daily-automation.yml` — Daily AYMP automation, security checks and output verification.
- `.github/workflows/install-growth-layer.yml` — Read-only homepage growth-layer audit after relevant main-branch activity.

## Parked / manual-only
These are preserved for possible future use and are not part of the normal daily automation.

- `.github/workflows/enable-planetary-research-bridge.yml` — Parked because earlier automatic runs failed; now manual-only.
- `.github/workflows/add-siddha-wellness-homepage.yml` — One-time maintenance workflow; Siddha section is already installed.
- `.github/workflows/install-home-navigation.yml` — One-time maintenance workflow; navigation is already installed.

## Safety rule
Do not delete parked workflows. If one is needed later, review it first, test it manually, and only then consider restoring an automatic trigger.
