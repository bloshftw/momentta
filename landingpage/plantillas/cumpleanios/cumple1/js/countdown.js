/**
 * Contador Regresivo Modular
 * Versión: 1.0
 * Autor: Desarrollador
 * Descripción: Contador regresivo reutilizable para invitaciones digitales
 */

class CountdownTimer {
  constructor(config) {
    this.config = {
      targetDate: config.targetDate,
      timezone: config.timezone || "America/Mexico_City",
      expiredTitle: config.expiredTitle || "¡El tiempo ha terminado!",
      expiredMessage: config.expiredMessage || "El evento ha comenzado",
      onTick: config.onTick || null,
      onExpired: config.onExpired || null,
      autoStart: config.autoStart !== false,
    }

    this.elements = {
      days: document.getElementById("5"),
      hours: document.getElementById("hours"),
      minutes: document.getElementById("minutes"),
      seconds: document.getElementById("seconds"),
      countdown: document.getElementById("countdown"),
      expiredMessage: document.getElementById("expiredMessage"),
    }

    this.interval = null
    this.isExpired = false

    if (this.config.autoStart) {
      this.start()
    }
  }

  /**
   * Convierte la fecha objetivo a timestamp considerando zona horaria
   */
  getTargetTimestamp() {
    const targetDate = new Date(this.config.targetDate)
    return targetDate.getTime()
  }

  /**
   * Calcula el tiempo restante
   */
  calculateTimeRemaining() {
    const now = new Date().getTime()
    const target = this.getTargetTimestamp()
    const difference = target - now

    if (difference <= 0) {
      return {
        total: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      }
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24))
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((difference % (1000 * 60)) / 1000)

    return {
      total: difference,
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
    }
  }

  /**
   * Formatea números con ceros a la izquierda
   */
  formatNumber(number) {
    return number.toString().padStart(2, "0")
  }

  /**
   * Actualiza la visualización del contador
   */
  updateDisplay(timeRemaining) {
    // Añadir animación de cambio de número
    const elements = [this.elements.days, this.elements.hours, this.elements.minutes, this.elements.seconds]
    const values = [timeRemaining.days, timeRemaining.hours, timeRemaining.minutes, timeRemaining.seconds]

    elements.forEach((element, index) => {
      const newValue = this.formatNumber(values[index])
      if (element.textContent !== newValue) {
        element.classList.add("number-change")
        element.textContent = newValue

        // Remover la clase de animación después de que termine
        setTimeout(() => {
          element.classList.remove("number-change")
        }, 300)
      }
    })
  }

  /**
   * Maneja la expiración del contador
   */
  handleExpiration() {
    if (this.isExpired) return

    this.isExpired = true
    this.stop()

    // Ocultar contador y mostrar mensaje
    this.elements.countdown.style.display = "none"
    this.elements.expiredMessage.style.display = "block"

    // Actualizar contenido del mensaje
    const titleElement = this.elements.expiredMessage.querySelector("h3")
    const messageElement = this.elements.expiredMessage.querySelector("p")

    if (titleElement) titleElement.textContent = this.config.expiredTitle
    if (messageElement) messageElement.textContent = this.config.expiredMessage

    // Ejecutar callback personalizado si existe
    if (typeof this.config.onExpired === "function") {
      this.config.onExpired()
    }

    // Disparar evento personalizado
    document.dispatchEvent(
      new CustomEvent("countdownExpired", {
        detail: { countdown: this },
      }),
    )
  }

  /**
   * Función principal que se ejecuta cada segundo
   */
  tick() {
    const timeRemaining = this.calculateTimeRemaining()

    if (timeRemaining.total <= 0) {
      this.handleExpiration()
      return
    }

    this.updateDisplay(timeRemaining)

    // Ejecutar callback personalizado si existe
    if (typeof this.config.onTick === "function") {
      this.config.onTick(timeRemaining)
    }

    // Disparar evento personalizado
    document.dispatchEvent(
      new CustomEvent("countdownTick", {
        detail: { timeRemaining, countdown: this },
      }),
    )
  }

  /**
   * Inicia el contador
   */
  start() {
    if (this.interval) {
      this.stop()
    }

    // Ejecutar inmediatamente
    this.tick()

    // Configurar intervalo
    this.interval = setInterval(() => {
      this.tick()
    }, 1000)

    return this
  }

  /**
   * Detiene el contador
   */
  stop() {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
    return this
  }

  /**
   * Reinicia el contador
   */
  restart() {
    this.isExpired = false
    this.elements.countdown.style.display = "flex"
    this.elements.expiredMessage.style.display = "none"
    return this.start()
  }

  /**
   * Actualiza la fecha objetivo
   */
  updateTargetDate(newDate) {
    this.config.targetDate = newDate
    if (!this.isExpired) {
      this.tick()
    }
    return this
  }

  /**
   * Obtiene el estado actual del contador
   */
  getStatus() {
    return {
      isRunning: this.interval !== null,
      isExpired: this.isExpired,
      timeRemaining: this.calculateTimeRemaining(),
      config: { ...this.config },
    }
  }
}

/**
 * Función de inicialización global
 * @param {Object} config - Configuración del contador
 * @returns {CountdownTimer} - Instancia del contador
 */
function initCountdown(config) {
  // Validar configuración
  if (!config || !config.targetDate) {
    console.error("CountdownTimer: Se requiere una fecha objetivo válida")
    return null
  }

  // Crear y retornar instancia
  const countdown = new CountdownTimer(config)

  // Hacer la instancia globalmente accesible
  window.countdownTimer = countdown

  return countdown
}

/**
 * Utilidades adicionales
 */
const CountdownUtils = {
  /**
   * Convierte días a fecha futura
   */
  addDays(days) {
    const date = new Date()
    date.setDate(date.getDate() + days)
    return date.toISOString().slice(0, 19).replace("T", " ")
  },

  /**
   * Convierte horas a fecha futura
   */
  addHours(hours) {
    const date = new Date()
    date.setHours(date.getHours() + hours)
    return date.toISOString().slice(0, 19).replace("T", " ")
  },

  /**
   * Formatea fecha para el contador
   */
  formatDate(date) {
    if (date instanceof Date) {
      return date.toISOString().slice(0, 19).replace("T", " ")
    }
    return date
  },

  /**
   * Cambia el tema del contador
   */
  changeTheme(themeName) {
    const container = document.querySelector(".countdown-container")
    if (container) {
      // Remover temas existentes
      container.classList.remove("theme-elegant", "theme-romantic", "theme-modern")
      // Añadir nuevo tema
      if (themeName && themeName !== "default") {
        container.classList.add(`theme-${themeName}`)
      }
    }
  },
}

// Hacer utilidades globalmente accesibles
window.CountdownUtils = CountdownUtils

// Exportar para uso en módulos (si es necesario)
if (typeof module !== "undefined" && module.exports) {
  module.exports = { CountdownTimer, CountdownUtils, initCountdown }
}
