'use client';

import { ApiResponse } from '@/lib/types/responses';

const API_BASE_URL = 'http://localhost:8000/api/chat';

function getAuthHeaders(): Record<string, string> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Authorization': `Bearer ${token}`,
  };
}

async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API Error: ${response.status}`);
  }
  const data = await response.json();
  return data.data || data;
}

export interface ChatSession {
  _id: string;
  title: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  session_id: string;
  response: string;
}

// Create a new chat session
export async function createChatSession(title: string = 'New Chat'): Promise<{ session_id: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/create-session`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title }),
    });

    return handleApiResponse(response);
  } catch (error) {
    console.error('Error creating chat session:', error);
    throw error;
  }
}

// Send a message and get AI response
export async function sendChatMessage(
  sessionId: string,
  message: string
): Promise<{ response: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/send-message`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
        message,
      }),
    });

    return handleApiResponse(response);
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
}

// Get all chat sessions for the user
export async function getChatSessions(): Promise<ChatSession[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/sessions`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    return handleApiResponse(response);
  } catch (error) {
    console.error('Error fetching chat sessions:', error);
    throw error;
  }
}

// Get chat history for a specific session
export async function getChatHistory(sessionId: string): Promise<ChatMessage[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/session/${sessionId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    return handleApiResponse(response);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    throw error;
  }
}
