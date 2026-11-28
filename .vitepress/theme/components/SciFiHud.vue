<script setup lang="ts">
/**
 * 科幻 HUD 装饰层：扫描线、扫描光带、四角框线、右侧状态栏
 * 纯装饰，pointer-events: none，不影响任何交互与可访问性。
 */
</script>

<template>
  <div class="sf-hud" aria-hidden="true">
    <div class="sf-hud__scanlines"></div>
    <div class="sf-hud__sweep"></div>
    <span class="sf-hud__corner sf-hud__corner--tl"></span>
    <span class="sf-hud__corner sf-hud__corner--tr"></span>
    <span class="sf-hud__corner sf-hud__corner--bl"></span>
    <span class="sf-hud__corner sf-hud__corner--br"></span>
    <div class="sf-hud__rail">SYSTEM ONLINE · PENGDAIYAN.TOP</div>
  </div>
</template>

<style>
.sf-hud {
  position: fixed;
  inset: 0;
  z-index: 20;
  pointer-events: none;
  overflow: hidden;
}

.sf-hud__scanlines {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    to bottom,
    var(--sf-scan) 0 1px,
    transparent 1px 3px
  );
  opacity: 0.55;
  mix-blend-mode: soft-light;
}

.sf-hud__sweep {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 240px;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(34, 211, 238, 0.08),
    transparent
  );
  animation: sf-sweep 2.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s 1 both;
}

@keyframes sf-sweep {
  from {
    transform: translateY(-240px);
  }
  to {
    transform: translateY(100vh);
  }
}

.sf-hud__corner {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 0 solid var(--sf-hud-line);
  opacity: 0.9;
}
.sf-hud__corner--tl {
  top: 78px;
  left: 14px;
  border-top-width: 1px;
  border-left-width: 1px;
}
.sf-hud__corner--tr {
  top: 78px;
  right: 14px;
  border-top-width: 1px;
  border-right-width: 1px;
}
.sf-hud__corner--bl {
  bottom: 14px;
  left: 14px;
  border-bottom-width: 1px;
  border-left-width: 1px;
}
.sf-hud__corner--br {
  bottom: 14px;
  right: 14px;
  border-bottom-width: 1px;
  border-right-width: 1px;
}

.sf-hud__rail {
  position: absolute;
  top: 34%;
  right: 12px;
  writing-mode: vertical-rl;
  font-family: var(--sf-mono);
  font-size: 9px;
  letter-spacing: 0.34em;
  color: var(--vp-c-text-3);
  opacity: 0.55;
}

@media (max-width: 1100px) {
  .sf-hud__rail {
    display: none;
  }
}
@media (max-width: 640px) {
  .sf-hud__corner {
    width: 14px;
    height: 14px;
    opacity: 0.55;
  }
  .sf-hud__corner--tl,
  .sf-hud__corner--tr {
    top: 72px;
    left: 8px;
  }
  .sf-hud__corner--tr {
    left: auto;
    right: 8px;
  }
  .sf-hud__scanlines {
    opacity: 0.35;
  }
}
</style>
