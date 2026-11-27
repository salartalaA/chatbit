"use client";

import { Send, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import WaveSurfer from "wavesurfer.js";
import RecordPlugin from "wavesurfer.js/dist/plugins/record.esm.js";

const MAX_RECORDING_DURATION = 180_000;

interface VoiceRecorderProps {
  onCancel: () => void;
  onRecordingComplete: (blob: Blob, duration: number) => void;
}

type PendingAction = "complete" | "cancel";

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

export function VoiceRecorder({
  onCancel,
  onRecordingComplete,
}: VoiceRecorderProps) {
  const waveformRef = useRef<HTMLDivElement>(null);
  const recordRef = useRef<ReturnType<typeof RecordPlugin.create> | null>(null);

  const onCancelRef = useRef(onCancel);
  const onRecordingCompleteRef = useRef(onRecordingComplete);

  const pendingActionRef = useRef<PendingAction>("complete");
  const elapsedMillisecondsRef = useRef(0);

  const [duration, setDuration] = useState(0);
  const [isStarting, setIsStarting] = useState(true);
  const [isStopping, setIsStopping] = useState(false);

  useEffect(() => {
    onCancelRef.current = onCancel;
    onRecordingCompleteRef.current = onRecordingComplete;
  }, [onCancel, onRecordingComplete]);

  useEffect(() => {
    const container = waveformRef.current;

    if (!container) {
      return;
    }

    let isDisposed = false;

    const wavesurfer = WaveSurfer.create({
      container,
      height: 36,
      waveColor: "#ffe0c2",
      progressColor: "currentColor",
      cursorWidth: 0,
      interact: false,
      hideScrollbar: true,
      barWidth: 3,
      barGap: 3,
      barRadius: 3,
      fillParent: true,
      minPxPerSec: 0,
    });

    const record = wavesurfer.registerPlugin(
      RecordPlugin.create({
        scrollingWaveform: true,
        renderRecordedAudio: false,
        audioBitsPerSecond: 128_000,
      })
    );

    recordRef.current = record;

    record.on("record-progress", (milliseconds) => {
      if (isDisposed) {
        return;
      }

      elapsedMillisecondsRef.current = milliseconds;

      const currentSecond = Math.floor(milliseconds / 1000);

      setDuration((previous) =>
        previous === currentSecond ? previous : currentSecond
      );

      if (milliseconds >= MAX_RECORDING_DURATION) {
        pendingActionRef.current = "complete";
        setIsStopping(true);
        record.stopRecording();
      }
    });

    record.on("record-end", (blob) => {
      if (isDisposed) {
        return;
      }

      if (pendingActionRef.current === "cancel") {
        onCancelRef.current();
        return;
      }

      if (blob.size === 0) {
        toast.error("Recording is empty");
        onCancelRef.current();
        return;
      }

      const recordingDuration = Math.min(
        Math.ceil(
          Math.max(record.getDuration(), elapsedMillisecondsRef.current) / 1000
        ),
        MAX_RECORDING_DURATION / 1000
      );

      if (recordingDuration === 0) {
        toast.error("Recording is too short");
        onCancelRef.current();
        return;
      }

      onRecordingCompleteRef.current(blob, recordingDuration);
    });

    const startRecording = async () => {
      try {
        await record.startRecording();

        if (!isDisposed) {
          setIsStarting(false);
        }
      } catch (error) {
        if (isDisposed) {
          return;
        }

        console.error("Failed to start recording:", error);
        toast.error("Could not access microphone");
        onCancelRef.current();
      }
    };

    startRecording();

    return () => {
      isDisposed = true;
      recordRef.current = null;
      wavesurfer.destroy();
    };
  }, []);

  const handleCancel = () => {
    const record = recordRef.current;

    if (!record || isStopping || isStarting) {
      return;
    }

    pendingActionRef.current = "cancel";
    setIsStopping(true);
    record.stopRecording();
  };

  const handleStop = () => {
    const record = recordRef.current;

    if (!record || isStopping || isStarting) {
      return;
    }

    pendingActionRef.current = "complete";
    setIsStopping(true);
    record.stopRecording();
  };

  return (
    <div className="border-border bg-card flex w-full min-w-0 items-center gap-3 rounded-lg border px-4 py-3 shadow-sm">
      <div className="text-destructive flex shrink-0 items-center gap-2">
        <span className="relative flex size-2.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-current opacity-75" />
          <span className="relative inline-flex size-2.5 rounded-full bg-current" />
        </span>

        <span className="font-mono text-sm tabular-nums">
          {formatDuration(duration)}
        </span>
      </div>

      <div className="text-primary flex h-9 min-w-0 flex-1 items-center overflow-hidden">
        <div className="h-9 w-full min-w-0" ref={waveformRef} />
      </div>

      <button
        aria-label="Discard recording"
        className="text-muted-foreground hover:text-destructive shrink-0 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isStarting || isStopping}
        onClick={handleCancel}
        title="Discard recording"
        type="button"
      >
        <Trash2 className="size-5" />
      </button>

      <button
        aria-label="Stop recording"
        className="bg-primary text-primary-foreground flex shrink-0 items-center gap-2 rounded-md px-3 py-2 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isStarting || isStopping}
        onClick={handleStop}
        title="Stop recording"
        type="button"
      >
        <Send className="size-4" />
      </button>
    </div>
  );
}
