import { ComponentProps } from 'react';
import { Waveform } from './Waveform';

type VoiceWaveformProps = ComponentProps<typeof Waveform>;

export function VoiceWaveform(props: VoiceWaveformProps) {
  return <Waveform {...props} />;
}
