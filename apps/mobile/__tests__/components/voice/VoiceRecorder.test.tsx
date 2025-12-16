import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { VoiceRecorder } from '@/components/voice/VoiceRecorder';
import * as Audio from 'expo-av';

describe('VoiceRecorder', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText } = render(<VoiceRecorder />);
    expect(getByText('Hold to record')).toBeTruthy();
  });

  it('starts recording on press', async () => {
    const { getByTestId } = render(<VoiceRecorder />);
    
    const recordButton = getByTestId('record-button') || getByText('Hold to record').parent;
    
    fireEvent(recordButton, 'pressIn');

    await waitFor(() => {
      expect(Audio.requestPermissionsAsync).toHaveBeenCalled();
      expect(Audio.setAudioModeAsync).toHaveBeenCalled();
      expect(Audio.Recording.createAsync).toHaveBeenCalled();
    });
  });

  it('stops recording on release', async () => {
    const mockRecording = {
      stopAndUnloadAsync: jest.fn(() => Promise.resolve()),
      getURI: jest.fn(() => 'file://test.mp3'),
    };

    (Audio.Recording.createAsync as jest.Mock).mockResolvedValue({
      recording: mockRecording,
    });

    const { getByTestId } = render(<VoiceRecorder />);
    
    const recordButton = getByTestId('record-button') || getByText('Hold to record').parent;
    
    fireEvent(recordButton, 'pressIn');
    
    await waitFor(() => {
      expect(Audio.Recording.createAsync).toHaveBeenCalled();
    });

    fireEvent(recordButton, 'pressOut');

    await waitFor(() => {
      expect(mockRecording.stopAndUnloadAsync).toHaveBeenCalled();
    });
  });
});

