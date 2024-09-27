import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  OnDestroy,
} from "@angular/core";
import { Howl } from "howler";

@Component({
  selector: "app-music-player",
  templateUrl: "./music-player.component.html",
})
export class MusicPlayerComponent implements OnInit, OnChanges, OnDestroy {
  @Input() musicUrl: string | null = null;
  private sound: Howl | null = null;
  isPlaying: boolean = false;
  currentTime: number = 0;
  duration: number = 0;
  progress: number = 0;
  progressInterval: any;

  constructor() {}

  ngOnInit(): void {
    if (this.musicUrl) {
      this.loadMusic(this.musicUrl);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["musicUrl"] && changes["musicUrl"].currentValue) {
      if (this.sound) {
        this.sound.stop(); // Detener la canción anterior
      }
      this.loadMusic(changes["musicUrl"].currentValue); // Cargar la nueva canción
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.progressInterval);
    if (this.sound) {
      this.sound.unload();
    }
  }

  loadMusic(url: string): void {
    this.sound = new Howl({
      src: [url],
      html5: true,
      onplay: () => {
        this.isPlaying = true;
        this.duration = this.sound?.duration() || 0;
        this.updateProgress();
      },
      onpause: () => (this.isPlaying = false),
      onstop: () => this.resetProgress(),
      onend: () => this.resetProgress(),
    });
  }

  togglePlayPause(): void {
    if (this.sound) {
      if (this.isPlaying) {
        this.sound.pause();
      } else {
        this.sound.play();
      }
    }
  }

  stopMusic(): void {
    if (this.sound) {
      this.sound.stop();
    }
  }

  seekTo(event: any): void {
    const seekTime = (event.target.value / 100) * this.duration;
    if (this.sound) {
      this.sound.seek(seekTime);
    }
  }

  updateProgress(): void {
    this.progressInterval = setInterval(() => {
      if (this.sound && this.isPlaying) {
        const seek = this.sound.seek() as number;
        this.currentTime = seek;
        this.progress = (seek / this.duration) * 100;
      }
    }, 1000);
  }

  resetProgress(): void {
    this.isPlaying = false;
    this.currentTime = 0;
    this.progress = 0;
    clearInterval(this.progressInterval);
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  }
}
