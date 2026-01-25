---
layout: post
title: "Home Server"
author: "Satya Praneet Challapilla"
categories: facts
tags: [documentation, self-hosting, diy]
image: raspi.JPEG
---

## Homelab & Self-Hosting

I self-host a bunch of services on a Raspberry Pi 5 with a 1TB SSD, using Docker for orchestration. I actually ended up printing a case for the raspi and even made a standoff to hold the ssd in place without putting strain on it.

My stack includes Jellyfin, Sonarr, Radarr, qBittorrent (through Gluetun), and Audiobookshelf with media storage structured and symlinked for easy access. It's a compact but powerful setup that runs my entire media and backup workflow.

My unified docker compose can be found here: [repo](https://github.com/satyapraneet63/raspi-apps)
I use portainer to have a GUI for my containers.

Going down this rabbit hole was the reason I elected to get a domain for myself and start a personal website.

