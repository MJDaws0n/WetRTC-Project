function startVideoChat() {
    const yourID = document.getElementById('yourID').value;
    const otherID = document.getElementById('otherID').value;
    const videoContainer = document.getElementById('videoContainer');
    
    // Show video container
    videoContainer.style.display = 'block';
  
    // Redirect to the video chat page with the identifiers as parameters
    window.location.href = `video_chat.html?yourID=${yourID}&otherID=${otherID}`;
  }
  