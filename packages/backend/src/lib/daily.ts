// Daily.co integration for WebRTC calls

if (!process.env.DAILY_API_KEY) {
  throw new Error('Missing DAILY_API_KEY environment variable');
}

const DAILY_API_BASE = 'https://api.daily.co/v1';
const DAILY_API_KEY = process.env.DAILY_API_KEY;

interface DailyRoom {
  name: string;
  url: string;
  created_at: string;
  config: {
    max_participants: number;
    enable_recording: boolean;
  };
}

export async function createCallRoom(roomName: string): Promise<DailyRoom> {
  try {
    const response = await fetch(`${DAILY_API_BASE}/rooms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${DAILY_API_KEY}`,
      },
      body: JSON.stringify({
        name: roomName,
        properties: {
          max_participants: 2,
          enable_screenshare: false,
          enable_chat: false,
          enable_recording: false, // Privacy: no recordings
          exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiry
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Daily API error: ${response.statusText}`);
    }

    return (await response.json()) as DailyRoom;
  } catch (error) {
    console.error('Daily room creation error:', error);
    throw new Error('Failed to create call room');
  }
}

export async function deleteCallRoom(roomName: string): Promise<void> {
  try {
    await fetch(`${DAILY_API_BASE}/rooms/${roomName}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${DAILY_API_KEY}`,
      },
    });
  } catch (error) {
    console.error('Daily room deletion error:', error);
  }
}

export async function getMeetingToken(roomName: string, userId: string): Promise<string> {
  try {
    const response = await fetch(`${DAILY_API_BASE}/meeting-tokens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${DAILY_API_KEY}`,
      },
      body: JSON.stringify({
        properties: {
          room_name: roomName,
          user_id: userId,
          enable_recording: false,
          start_audio_off: false,
          start_video_off: true,
        },
      }),
    });

    const data = (await response.json()) as { token: string };
    return data.token;
  } catch (error) {
    console.error('Daily token generation error:', error);
    throw new Error('Failed to generate meeting token');
  }
}
