<template>
  <div class="w-full max-w-2xl mx-auto px-4 py-6">

    <!-- 未登录 -->
    <div v-if="!userStore.isLoggedIn" class="text-center py-20">
      <div class="text-5xl mb-4">🔒</div>
      <p class="text-white/60 mb-4">请先登录才能玩游戏</p>
      <router-link to="/login" class="inline-block px-6 py-2 rounded-xl bg-accent/20 border border-accent/30 text-accent font-medium hover:bg-accent/30 transition">
        去登录
      </router-link>
    </div>

    <template v-else>
      <div class="text-center mb-6">
        <h1 class="text-3xl md:text-4xl font-bold text-white drop-shadow-lg tracking-tight">
          🎮 一方 · 2048
        </h1>
        <p class="text-white/40 text-sm mt-1">合并方块，冲击 32768</p>
      </div>

      <!-- 分数栏 -->
      <div class="grid grid-cols-3 gap-2 mb-4">
        <div class="glass-dark rounded-xl p-3 text-center">
          <div class="text-white/40 text-[10px] uppercase tracking-wider">当前得分</div>
          <div class="text-white text-xl font-bold">{{ score }}</div>
        </div>
        <div class="glass-dark rounded-xl p-3 text-center">
          <div class="text-white/40 text-[10px] uppercase tracking-wider">最高得分</div>
          <div class="text-white text-xl font-bold">{{ bestScore }}</div>
        </div>
        <div class="glass-dark rounded-xl p-3 text-center">
          <div class="text-white/40 text-[10px] uppercase tracking-wider">总积分</div>
          <div class="text-accent text-xl font-bold">{{ totalScore }}</div>
        </div>
      </div>

      <!-- 棋盘 -->
      <div
        class="relative glass-dark rounded-2xl p-3 mb-4 select-none"
        @touchstart="handleTouchStart"
        @touchend="handleTouchEnd"
      >
        <div class="grid grid-cols-4 gap-2">
          <div
            v-for="(cell, idx) in flatBoard"
            :key="idx"
            class="relative aspect-square rounded-lg flex items-center justify-center overflow-hidden"
            :class="cell ? 'bg-white/10' : 'bg-white/5'"
          >
            <template v-if="cell">
              <img
                v-if="getTileImage(cell)"
                :src="getTileImage(cell)"
                :alt="cell"
                class="w-4/5 h-4/5 object-contain pointer-events-none"
                @error="handleImageError"
              />
              <div class="absolute bottom-1 right-1 text-white text-xs font-bold drop-shadow-lg bg-black/30 rounded px-1">
                {{ cell }}
              </div>
            </template>
          </div>
        </div>

        <!-- 结束覆盖层 -->
        <div v-if="gameOver || gameWon" class="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm rounded-2xl z-20">
          <div class="text-center px-6">
            <div class="text-3xl font-bold text-white mb-2">
              {{ gameWon ? '🎉 胜利' : '😢 结束' }}
            </div>
            <div class="text-white/60 text-sm">本局得分：{{ score }}</div>
            <div v-if="earnedCoins > 0" class="text-accent font-bold text-lg mt-1">
              获得 {{ earnedCoins }} U币
            </div>
            <div v-else class="text-white/40 text-sm mt-1">
              未满 10000 分，无奖励
            </div>
            <button
              @click="startNewGame"
              :disabled="isProcessing"
              class="mt-4 px-6 py-2 rounded-xl bg-accent/20 border border-accent/30 text-accent font-medium hover:bg-accent/30 transition disabled:opacity-50"
            >
              再来一次
            </button>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="grid grid-cols-2 gap-3">
        <button
          @click="undoMove"
          :disabled="!canUndo || isProcessing || gameOver || gameWon"
          class="px-4 py-3 rounded-xl glass-dark text-white/80 hover:text-white disabled:opacity-30 transition text-sm font-medium"
        >
          💰 悔棋 <span class="text-white/40 text-xs">(1 U币)</span>
        </button>
        <button
          @click="recruit"
          :disabled="isProcessing || gameOver || gameWon"
          class="px-4 py-3 rounded-xl glass-dark text-white/80 hover:text-white disabled:opacity-30 transition text-sm font-medium"
        >
          🎲 招募 <span class="text-white/40 text-xs">(2 U币)</span>
        </button>
      </div>

      <div class="text-center mt-4">
        <div class="text-white/40 text-xs">
          我的 U币：<span class="text-accent font-bold">{{ userStore.ucoins }}</span>
        </div>
        <div class="text-white/30 text-[10px] mt-1">
          每满 10000 分奖励 1 U币，单局上限 10 U币
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()

// ============================================================
// 配置
// ============================================================
const SIZE = 4
const TILE_CONFIG = {
  2:     { image: 'https://gp3e.saobby.com/i/LoqWTS1sPyxH1UNl.png' },
  4:     { image: 'https://gp3e.saobby.com/i/EDA0vx9UdrpaUoHm.png' },
  8:     { image: 'https://gp3e.saobby.com/i/1Ej1KqFRG9sQkZWg.png' },
  16:    { image: 'https://gp3e.saobby.com/i/yBmGMrGhmJ7CJtzQ.png' },
  32:    { image: 'https://gp3e.saobby.com/i/76DvllRLwqMEb4CL.png' },
  64:    { image: 'https://gp3e.saobby.com/i/ugNfVsxux3PQq9gv.png' },
  128:   { image: 'https://gp3e.saobby.com/i/oQcemS1tqn8DXgGz.png' },
  256:   { image: 'https://gp3e.saobby.com/i/ioZgjIBp5WhahhH4.png' },
  512:   { image: 'https://gp3e.saobby.com/i/hOu5oSUYVua2Vc1S.png' },
  1024:  { image: 'https://gp3e.saobby.com/i/O7yzHORrck4zUpG6.png' },
  2048:  { image: 'https://gp3e.saobby.com/i/XquyC6DkZL7YodGa.png' },
  4096:  { image: 'https://gp3e.saobby.com/i/Y8GKYqd1B1oX5z0c.png' },
  8192:  { image: 'https://gp3e.saobby.com/i/jG95mP0qWxmVZiF7.png' },
  16384: { image: 'https://gp3e.saobby.com/i/BOKYNwHsf1H9XqaR.png' },
  32768: { image: 'https://gp3e.saobby.com/i/Vsy2uBpM4QVVKL3H.png' },
}

// ============================================================
// 状态
// ============================================================
const board = ref(createEmptyBoard())
const score = ref(0)
const bestScore = ref(0)
const totalScore = ref(0)
const gameOver = ref(false)
const gameWon = ref(false)
const canUndo = ref(false)
const isProcessing = ref(false)
const previousState = ref(null)
const earnedCoins = ref(0)
const sessionId = ref(null)
const endGameTriggered = ref(false)

// ============================================================
// 计算属性
// ============================================================
const flatBoard = computed(() => {
  const result = []
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      result.push(board.value[i][j])
    }
  }
  return result
})

// ============================================================
// 工具函数
// ============================================================
function createEmptyBoard() {
  return Array(SIZE).fill(0).map(() => Array(SIZE).fill(0))
}

function getTileImage(value) {
  return TILE_CONFIG[value]?.image || ''
}

function handleImageError(e) {
  e.target.style.display = 'none'
}

function boardsEqual(a, b) {
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      if (a[i][j] !== b[i][j]) return false
    }
  }
  return true
}

// ============================================================
// 滑动逻辑
// ============================================================
function slideRow(row) {
  const arr = row.filter(v => v !== 0)
  const result = []
  let i = 0
  while (i < arr.length) {
    if (i + 1 < arr.length && arr[i] === arr[i + 1]) {
      const merged = arr[i] * 2
      result.push(merged)
      score.value += merged
      i += 2
    } else {
      result.push(arr[i])
      i++
    }
  }
  while (result.length < SIZE) result.push(0)
  return result
}

function moveLeft() {
  const newBoard = board.value.map(row => slideRow(row))
  if (boardsEqual(board.value, newBoard)) return false
  board.value = newBoard
  return true
}

function moveRight() {
  const newBoard = board.value.map(row => slideRow([...row].reverse()).reverse())
  if (boardsEqual(board.value, newBoard)) return false
  board.value = newBoard
  return true
}

function moveUp() {
  const newBoard = createEmptyBoard()
  for (let j = 0; j < SIZE; j++) {
    const col = []
    for (let i = 0; i < SIZE; i++) col.push(board.value[i][j])
    const newCol = slideRow(col)
    for (let i = 0; i < SIZE; i++) newBoard[i][j] = newCol[i]
  }
  if (boardsEqual(board.value, newBoard)) return false
  board.value = newBoard
  return true
}

function moveDown() {
  const newBoard = createEmptyBoard()
  for (let j = 0; j < SIZE; j++) {
    const col = []
    for (let i = 0; i < SIZE; i++) col.push(board.value[i][j])
    const newCol = slideRow([...col].reverse()).reverse()
    for (let i = 0; i < SIZE; i++) newBoard[i][j] = newCol[i]
  }
  if (boardsEqual(board.value, newBoard)) return false
  board.value = newBoard
  return true
}

// ============================================================
// 游戏辅助
// ============================================================
function saveState() {
  previousState.value = {
    board: board.value.map(row => [...row]),
    score: score.value,
  }
}

function addRandomTile() {
  const empties = []
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      if (board.value[i][j] === 0) empties.push({ i, j })
    }
  }
  if (empties.length === 0) return
  const { i, j } = empties[Math.floor(Math.random() * empties.length)]
  board.value[i][j] = Math.random() < 0.9 ? 2 : 4
}

function hasEmpty() {
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      if (board.value[i][j] === 0) return true
    }
  }
  return false
}

function hasMergeable() {
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      const v = board.value[i][j]
      if (j < SIZE - 1 && v === board.value[i][j + 1]) return true
      if (i < SIZE - 1 && v === board.value[i + 1][j]) return true
    }
  }
  return false
}

async function checkGameStatus() {
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      if (board.value[i][j] === 2048 && !gameWon.value) {
        gameWon.value = true
        await endGame(true)
        return
      }
    }
  }
  if (hasEmpty()) return
  if (hasMergeable()) return
  gameOver.value = true
  await endGame(false)
}

// ============================================================
// 结束游戏 + 通过 RPC 发奖
// ============================================================
async function endGame(won) {
  if (endGameTriggered.value) return
  endGameTriggered.value = true

  if (!sessionId.value) {
    earnedCoins.value = 0
    return
  }

  try {
    const result = await userStore.game2048Finish(sessionId.value, score.value)
    earnedCoins.value = result.coins || 0
    bestScore.value = result.best_score || Math.max(bestScore.value, score.value)
    totalScore.value = (totalScore.value || 0) + score.value
  } catch (e) {
    console.error('结算失败:', e)
    earnedCoins.value = 0
    alert('结算失败：' + e.message)
  }
}

// ============================================================
// 用户操作
// ============================================================
async function move(direction) {
  if (gameOver.value || gameWon.value || isProcessing.value) return
  saveState()
  let moved = false
  switch (direction) {
    case 'left':  moved = moveLeft();  break
    case 'right': moved = moveRight(); break
    case 'up':    moved = moveUp();    break
    case 'down':  moved = moveDown();  break
  }
  if (moved) {
    addRandomTile()
    canUndo.value = true
    if (score.value > bestScore.value) bestScore.value = score.value
    await checkGameStatus()
  } else {
    previousState.value = null
  }
}

async function undoMove() {
  if (!canUndo.value || !previousState.value || isProcessing.value) return
  isProcessing.value = true
  try {
    await userStore.game2048Spend(1)
    board.value = previousState.value.board
    score.value = previousState.value.score
    previousState.value = null
    canUndo.value = false
  } catch (e) {
    alert(e.message)
  } finally {
    isProcessing.value = false
  }
}

async function recruit() {
  if (isProcessing.value) return
  isProcessing.value = true
  try {
    const empties = []
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        if (board.value[i][j] === 0) empties.push({ i, j })
      }
    }
    if (empties.length === 0) {
      alert('棋盘已满')
      return
    }

    await userStore.game2048Spend(2)

    const rand = Math.random() * 100
    let value
    if (rand < 25)       value = 64
    else if (rand < 50)  value = 128
    else if (rand < 70)  value = 256
    else if (rand < 85)  value = 512
    else if (rand < 93)  value = 1024
    else if (rand < 97)  value = 2048
    else if (rand < 99)  value = 4096
    else                 value = 8192

    const pos = empties[Math.floor(Math.random() * empties.length)]
    board.value[pos.i][pos.j] = value
    await checkGameStatus()
  } catch (e) {
    alert(e.message)
  } finally {
    isProcessing.value = false
  }
}

async function startNewGame() {
  board.value = createEmptyBoard()
  score.value = 0
  gameOver.value = false
  gameWon.value = false
  canUndo.value = false
  previousState.value = null
  earnedCoins.value = 0
  endGameTriggered.value = false

  try {
    sessionId.value = await userStore.game2048Start()
  } catch (e) {
    console.error('开始游戏失败:', e)
    alert('无法开始游戏，请刷新重试')
    return
  }

  addRandomTile()
  addRandomTile()
}

// ============================================================
// 键盘事件
// ============================================================
function handleKeydown(e) {
  const key = e.key.toLowerCase()
  if (['arrowup', 'w'].includes(key))         { e.preventDefault(); move('up') }
  else if (['arrowdown', 's'].includes(key))  { e.preventDefault(); move('down') }
  else if (['arrowleft', 'a'].includes(key))  { e.preventDefault(); move('left') }
  else if (['arrowright', 'd'].includes(key)) { e.preventDefault(); move('right') }
}

// ============================================================
// 触摸事件
// ============================================================
let touchStartX = 0
let touchStartY = 0

function handleTouchStart(e) {
  touchStartX = e.touches[0].clientX
  touchStartY = e.touches[0].clientY
}

function handleTouchEnd(e) {
  const dx = e.changedTouches[0].clientX - touchStartX
  const dy = e.changedTouches[0].clientY - touchStartY
  if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return
  if (Math.abs(dx) > Math.abs(dy)) {
    move(dx > 0 ? 'right' : 'left')
  } else {
    move(dy > 0 ? 'down' : 'up')
  }
}

// ============================================================
// 生命周期
// ============================================================
onMounted(async () => {
  if (!userStore.isLoggedIn) return
  await userStore.fetchProfile()
  bestScore.value = userStore.profile?.game_2048_best_score || 0
  totalScore.value = userStore.profile?.game_2048_total_score || 0
  await startNewGame()
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.glass-dark {
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
</style>