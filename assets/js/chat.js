const messageInput = document.querySelector('textarea')

messageInput.addEventListener('input', () => {
  messageInput.style.height = 'auto'
  messageInput.style.height = messageInput.scrollHeight + 'px'
})

messageInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) e.preventDefault()
})