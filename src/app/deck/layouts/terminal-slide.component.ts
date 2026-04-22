import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TerminalSlideConfig } from '../slide-config';

/**
 * Windows Terminal mockup — renders a chromed window (title bar + traffic-light
 * buttons) around a PowerShell prompt, the invoked command, and Claude's
 * welcome banner styled to match the real CLI output.
 */
@Component({
  selector: 'app-terminal-slide',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="mx-auto flex h-screen max-w-5xl flex-col justify-center px-24">
      @if (slide().label) {
        <div class="label">{{ slide().label }}</div>
      }
      <h2 class="title">{{ slide().title }}</h2>

      <div class="terminal-frame">
        <div class="title-bar">
          <div class="dots">
            <span class="dot dot-close"></span>
            <span class="dot dot-min"></span>
            <span class="dot dot-max"></span>
          </div>
          <span class="title-bar-label">{{ slide().titleBar ?? 'Windows PowerShell' }}</span>
        </div>

        <div class="body">
          <div class="line">
            <span class="prompt">PS {{ slide().cwd }}&gt;</span>
            <span class="command">{{ slide().command }}</span>
          </div>

          <div class="welcome">
            <div class="welcome-header">
              <span class="sparkle">✻</span>
              <span class="welcome-title">Welcome to Claude Code</span>
            </div>
            <div class="welcome-body">
              <div>/help for help, /status for your setup</div>
              <div class="cwd-line">cwd: {{ slide().cwd }}</div>
            </div>
          </div>

          <div class="input-line">
            <span class="input-caret">&gt;</span>
            <span class="caret-blink"></span>
          </div>
        </div>
      </div>

      @if (slide().caption) {
        <p class="caption">{{ slide().caption }}</p>
      }
    </section>
  `,
  styles: [
    `
      .label {
        font-family: var(--font-sans);
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 0.22em;
        color: var(--color-muted);
        margin-bottom: 1rem;
        font-weight: 500;
      }
      .title {
        font-family: var(--font-display);
        font-size: clamp(2.25rem, 3.75vw, 3rem);
        font-weight: 500;
        letter-spacing: -0.015em;
        margin: 0 0 1.5rem 0;
      }
      .terminal-frame {
        max-width: 52rem;
        border-radius: 12px;
        overflow: hidden;
        box-shadow:
          0 25px 50px -12px rgba(0, 0, 0, 0.35),
          0 0 0 1px rgba(0, 0, 0, 0.15);
      }
      .title-bar {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        background: #2d2d2d;
        padding: 0.55rem 0.9rem;
      }
      .dots {
        display: flex;
        gap: 0.4rem;
      }
      .dot {
        display: inline-block;
        height: 0.72rem;
        width: 0.72rem;
        border-radius: 9999px;
      }
      .dot-close {
        background: #ff5f56;
      }
      .dot-min {
        background: #ffbd2e;
      }
      .dot-max {
        background: #27c93f;
      }
      .title-bar-label {
        margin-left: 0.25rem;
        font-family: var(--font-sans);
        font-size: 0.95rem;
        color: rgba(255, 255, 255, 0.78);
        letter-spacing: 0.01em;
      }
      .body {
        background: #0c0c0c;
        padding: 1.5rem 1.75rem;
        font-family: var(--font-mono);
        font-size: clamp(1rem, 1.2vw, 1.15rem);
        line-height: 1.55;
        color: #e6e6e6;
        min-height: 16rem;
      }
      .line {
        display: flex;
        gap: 0.5rem;
      }
      .prompt {
        color: #ffd866;
      }
      .command {
        color: #ffffff;
      }
      .welcome {
        margin-top: 1.1rem;
        display: inline-block;
        border: 1px solid rgba(200, 74, 42, 0.55);
        border-radius: 8px;
        padding: 0.85rem 1.2rem;
        background: rgba(200, 74, 42, 0.05);
      }
      .welcome-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .sparkle {
        color: var(--color-coral);
        font-size: 1.05rem;
      }
      .welcome-title {
        color: #ffffff;
        font-weight: 600;
      }
      .welcome-body {
        margin-top: 0.55rem;
        color: rgba(230, 230, 230, 0.75);
        font-size: 0.95rem;
      }
      .cwd-line {
        margin-top: 0.35rem;
      }
      .input-line {
        margin-top: 1.15rem;
        display: flex;
        align-items: center;
        gap: 0.6rem;
      }
      .input-caret {
        color: var(--color-coral);
      }
      .caret-blink {
        display: inline-block;
        width: 0.55rem;
        height: 1.05rem;
        background: rgba(255, 255, 255, 0.85);
        animation: blink 1.1s steps(1) infinite;
      }
      @keyframes blink {
        0%,
        50% {
          opacity: 1;
        }
        51%,
        100% {
          opacity: 0;
        }
      }
      .caption {
        margin-top: 1rem;
        font-family: var(--font-sans);
        color: var(--color-muted);
        font-size: 1.1rem;
        max-width: 52rem;
      }
    `,
  ],
})
export class TerminalSlideComponent {
  /** The slide configuration this layout should render. */
  readonly slide = input.required<TerminalSlideConfig>();
}
