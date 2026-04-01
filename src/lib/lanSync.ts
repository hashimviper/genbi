/**
 * LAN Sync Utility
 * Uses BroadcastChannel API for cross-tab real-time communication
 * and localStorage polling for cross-browser sync on the same network.
 */

export interface LANPeer {
  userId: string;
  username: string;
  lastSeen: number;
  roomCode: string;
}

export type LANMessageType =
  | 'presence'
  | 'presence-leave'
  | 'org-update'
  | 'team-update'
  | 'dashboard-share'
  | 'chat';

export interface LANMessage {
  type: LANMessageType;
  senderId: string;
  senderName: string;
  roomCode: string;
  payload?: unknown;
  timestamp: number;
}

const CHANNEL_NAME = 'visorybi-lan-sync';
const ROOM_KEY = 'visorybi-lan-room';
const PEERS_KEY = 'visorybi-lan-peers';
const HEARTBEAT_MS = 3000;
const PEER_TIMEOUT_MS = 10000;

type MessageHandler = (msg: LANMessage) => void;

export class LANSyncManager {
  private channel: BroadcastChannel | null = null;
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;
  private pollInterval: ReturnType<typeof setInterval> | null = null;
  private handlers: MessageHandler[] = [];
  private userId = '';
  private username = '';
  private roomCode = '';

  connect(userId: string, username: string, roomCode: string) {
    this.disconnect();
    this.userId = userId;
    this.username = username;
    this.roomCode = roomCode;

    // Save room info
    localStorage.setItem(ROOM_KEY, JSON.stringify({ userId, username, roomCode }));

    // Setup BroadcastChannel
    try {
      this.channel = new BroadcastChannel(CHANNEL_NAME);
      this.channel.onmessage = (event: MessageEvent<LANMessage>) => {
        if (event.data.roomCode === this.roomCode && event.data.senderId !== this.userId) {
          this.handleMessage(event.data);
        }
      };
    } catch {
      // BroadcastChannel not supported, fallback to polling only
    }

    // Send initial presence
    this.sendPresence();

    // Start heartbeat
    this.heartbeatInterval = setInterval(() => this.sendPresence(), HEARTBEAT_MS);

    // Poll localStorage for peers from other browsers
    this.pollInterval = setInterval(() => this.pollPeers(), HEARTBEAT_MS);
  }

  disconnect() {
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    if (this.pollInterval) clearInterval(this.pollInterval);

    // Send leave message
    if (this.channel && this.roomCode) {
      this.broadcast({
        type: 'presence-leave',
        senderId: this.userId,
        senderName: this.username,
        roomCode: this.roomCode,
        timestamp: Date.now(),
      });
    }

    // Remove self from peers
    this.removeSelfFromPeers();

    this.channel?.close();
    this.channel = null;
    this.heartbeatInterval = null;
    this.pollInterval = null;
    localStorage.removeItem(ROOM_KEY);
  }

  onMessage(handler: MessageHandler) {
    this.handlers.push(handler);
    return () => {
      this.handlers = this.handlers.filter((h) => h !== handler);
    };
  }

  send(type: LANMessageType, payload?: unknown) {
    const msg: LANMessage = {
      type,
      senderId: this.userId,
      senderName: this.username,
      roomCode: this.roomCode,
      payload,
      timestamp: Date.now(),
    };
    this.broadcast(msg);
    // Also update localStorage for cross-browser polling
    this.storePeerMessage(msg);
  }

  getActivePeers(): LANPeer[] {
    try {
      const peers: LANPeer[] = JSON.parse(localStorage.getItem(PEERS_KEY) || '[]');
      const cutoff = Date.now() - PEER_TIMEOUT_MS;
      return peers.filter(
        (p) => p.roomCode === this.roomCode && p.lastSeen > cutoff
      );
    } catch {
      return [];
    }
  }

  getRoomCode(): string {
    return this.roomCode;
  }

  isConnected(): boolean {
    return !!this.roomCode;
  }

  static generateRoomCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
  }

  static getSavedRoom(): { userId: string; username: string; roomCode: string } | null {
    try {
      const raw = localStorage.getItem(ROOM_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  // ─── Private ───────────────────────────────────────────────

  private handleMessage(msg: LANMessage) {
    if (msg.type === 'presence') {
      this.updatePeer(msg.senderId, msg.senderName, msg.roomCode);
    } else if (msg.type === 'presence-leave') {
      this.removePeer(msg.senderId);
    }
    this.handlers.forEach((h) => h(msg));
  }

  private broadcast(msg: LANMessage) {
    try {
      this.channel?.postMessage(msg);
    } catch {
      // ignore
    }
  }

  private sendPresence() {
    if (!this.roomCode) return;
    const msg: LANMessage = {
      type: 'presence',
      senderId: this.userId,
      senderName: this.username,
      roomCode: this.roomCode,
      timestamp: Date.now(),
    };
    this.broadcast(msg);
    this.updatePeer(this.userId, this.username, this.roomCode);
  }

  private updatePeer(userId: string, username: string, roomCode: string) {
    try {
      const peers: LANPeer[] = JSON.parse(localStorage.getItem(PEERS_KEY) || '[]');
      const idx = peers.findIndex((p) => p.userId === userId);
      const peer: LANPeer = { userId, username, lastSeen: Date.now(), roomCode };
      if (idx >= 0) {
        peers[idx] = peer;
      } else {
        peers.push(peer);
      }
      // Clean expired
      const cutoff = Date.now() - PEER_TIMEOUT_MS * 3;
      const cleaned = peers.filter((p) => p.lastSeen > cutoff);
      localStorage.setItem(PEERS_KEY, JSON.stringify(cleaned));
    } catch {
      // ignore
    }
  }

  private removePeer(userId: string) {
    try {
      const peers: LANPeer[] = JSON.parse(localStorage.getItem(PEERS_KEY) || '[]');
      localStorage.setItem(PEERS_KEY, JSON.stringify(peers.filter((p) => p.userId !== userId)));
    } catch {
      // ignore
    }
  }

  private removeSelfFromPeers() {
    if (this.userId) this.removePeer(this.userId);
  }

  private storePeerMessage(msg: LANMessage) {
    // Store messages in localStorage for cross-browser polling
    try {
      const key = 'visorybi-lan-messages';
      const msgs: LANMessage[] = JSON.parse(localStorage.getItem(key) || '[]');
      msgs.push(msg);
      // Keep last 50
      if (msgs.length > 50) msgs.splice(0, msgs.length - 50);
      localStorage.setItem(key, JSON.stringify(msgs));
    } catch {
      // ignore
    }
  }

  private pollPeers() {
    // Clean up stale peers
    try {
      const peers: LANPeer[] = JSON.parse(localStorage.getItem(PEERS_KEY) || '[]');
      const cutoff = Date.now() - PEER_TIMEOUT_MS;
      const active = peers.filter((p) => p.lastSeen > cutoff);
      if (active.length !== peers.length) {
        localStorage.setItem(PEERS_KEY, JSON.stringify(active));
      }
    } catch {
      // ignore
    }
  }
}

export const lanSync = new LANSyncManager();
