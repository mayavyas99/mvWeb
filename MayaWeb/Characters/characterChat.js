document.addEventListener('DOMContentLoaded', () => {
    // Select all chat bubbles
    const chatBubbles = document.querySelectorAll('.chat-bubble');
  
    chatBubbles.forEach(bubble => {
      bubble.addEventListener('click', () => {
        const character = bubble.getAttribute('data-character');
        // Implement logic to start that character’s chatbot here.
        // For now, just log the character's name:
        console.log(`Starting chat for character: ${character}`);
  
        // TODO: Add your chatbot initialization code here.
      });
    });
  });