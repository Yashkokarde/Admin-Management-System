#!/usr/bin/env python3
"""Serve the Admin Management System on http://127.0.0.1:8080"""
import http.server
import os
import socketserver

ROOT = os.path.dirname(os.path.abspath(__file__))
os.chdir(ROOT)
PORT = int(os.environ.get("PORT", "8080"))

class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, fmt, *args):
        print("[web]", args[0])

with socketserver.TCPServer(("0.0.0.0", PORT), Handler) as httpd:
    print(f"Admin Management System → http://127.0.0.1:{PORT}/")
    print(f"Login (Selenium target) → http://127.0.0.1:{PORT}/pages/examples/logout.html")
    httpd.serve_forever()
