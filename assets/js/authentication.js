const API = 'https://veltrane-backend-production.up.railway.app'

const errorEl = document.querySelector('.vl__error')
const setError = (msg) => { if (errorEl) errorEl.textContent = msg }

const passwordVisibility = document.querySelector('.vl__password button')
const passwordInput = document.querySelector('.vl__password input')

if (passwordVisibility) {
  const [iconOff, iconOn] = passwordVisibility.querySelectorAll('img')

  passwordInput.setCustomValidity('invalid')

  passwordInput.addEventListener('input', () => {
    passwordInput.setCustomValidity(passwordInput.value.length >= 8 ? '' : 'invalid')
  })

  passwordVisibility.addEventListener('click', () => {
    const isHidden = passwordInput.type === 'password'
    passwordInput.type = isHidden ? 'text' : 'password'
    iconOff.hidden = isHidden
    iconOn.hidden = !isHidden
  })

  passwordVisibility.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch') e.preventDefault()
  })
}

const getCodeBtn = document.querySelector('.vl__button-proceed.get-code')
if (getCodeBtn) {
  const emailInput = document.querySelector('input[type="email"]')

  getCodeBtn.addEventListener('click', async () => {
    const email = emailInput.value
    const res = await fetch(`${API}/api/auth/send-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    const data = await res.json()
    if (res.ok) {
      sessionStorage.setItem('pendingEmail', email)
      window.location.href = 'verification.html'
    } else {
      setError(data.error)
    }
  })
}

const verifyBtn = document.querySelector('.vl__button-proceed.verify-code')
if (verifyBtn) {
  const codeInput = document.querySelector('input')
  const email = sessionStorage.getItem('pendingEmail')

  const emailDisplay = document.querySelector('.vl__code-message span')
  if (emailDisplay) emailDisplay.textContent = email

  codeInput.addEventListener('input', () => {
    codeInput.value = codeInput.value.replace(/\D/g, '')
  })

  verifyBtn.addEventListener('click', async () => {
    const res = await fetch(`${API}/api/auth/verify-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code: codeInput.value })
    })
    const data = await res.json()
    if (res.ok) {
      window.location.href = 'onboard.html'
    } else {
      setError(data.error)
    }
  })
}

const nameInput = document.querySelector('.vl__display-name')
if (nameInput) {
  nameInput.setCustomValidity('invalid')

  nameInput.addEventListener('input', () => {
    nameInput.value = nameInput.value.replace(/[^a-zA-Z ]/g, '')
    nameInput.setCustomValidity(nameInput.value.trim().length >= 3 ? '' : 'invalid')
  })
}

const avatarBtn = document.querySelector('.vl__profile-picture button')
const avatarInput = document.querySelector('.vl__profile-picture input')
const avatarPreview = document.querySelector('.vl__profile-picture img')

if (avatarBtn) {
  avatarBtn.addEventListener('click', () => avatarInput.click())

  avatarInput.addEventListener('change', () => {
    const file = avatarInput.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB')
      avatarInput.value = ''
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result
      avatarPreview.src = base64
      sessionStorage.setItem('pendingAvatar', base64)
    }
    reader.readAsDataURL(file)
  })
}

const createAccountBtn = document.querySelector('.vl__button-proceed.create-account')
if (createAccountBtn) {
  createAccountBtn.addEventListener('click', async () => {
    const email = sessionStorage.getItem('pendingEmail')
    const username = nameInput.value.trim()
    const password = passwordInput.value
    const avatar = sessionStorage.getItem('pendingAvatar')

    const res = await fetch(`${API}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password, avatar })
    })

    const data = await res.json()

    if (res.ok) {
      sessionStorage.removeItem('pendingEmail')
      sessionStorage.removeItem('pendingAvatar')
      window.location.href = '../index.html'
    } else {
      setError(data.error)
    }
  })
}

const loginBtn = document.querySelector('.vl__button-proceed.login')
if (loginBtn) {
  const emailInput = document.querySelector('input[type="email"]')

  loginBtn.addEventListener('click', async () => {
    const res = await fetch(`${API}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email: emailInput.value, password: passwordInput.value })
    })

    const data = await res.json()

    if (res.ok) {
      window.location.href = 'chat.html'
    } else {
      setError(data.error)
    }
  })
}