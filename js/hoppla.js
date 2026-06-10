const backBtn = document.getElementById("backBtn");

if (backBtn) {
  backBtn.addEventListener("click", (e) => {
    e.preventDefault();
    
    // document.referrer holds the URL of the page they just came from.
    // We check if it exists AND if it contains your website's domain name.
    if (document.referrer && document.referrer.includes(window.location.hostname)) {
      // They came from inside our app. Safe to go back.
      window.history.back();
    } else {
      // They came from a bookmark, a direct link, or a fresh tab. Force them home.
      window.location.href = "index.html"; 
    }
  });
}