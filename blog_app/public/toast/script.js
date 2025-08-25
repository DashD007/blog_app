function showToast(message, type = "success", delay = 3000) {
  // Generate a unique ID
  const toastId = "toast-" + Date.now();

  // Choose bootstrap background based on type
  let bgClass = type === "success" ? "text-bg-success" : "text-bg-danger";

  // Create toast HTML dynamically
  let toastHTML = `
    <div id="${toastId}" class="toast align-items-center ${bgClass} border-0 mb-2" 
         role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body">${message}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" 
                data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>
  `;

  // Append toast to container
  $("#toastContainer").append(toastHTML);

  // Initialize and show toast
  let toastEl = document.getElementById(toastId);
  let toast = new bootstrap.Toast(toastEl, { delay: delay, autohide: true });
  toast.show();

  // Remove toast from DOM after it hides
  toastEl.addEventListener("hidden.bs.toast", function () {
    $(toastEl).remove();
  });
}

// Helper wrappers
function showSuccessToast(message) {
  showToast(message, "success", 3000);
}

function showErrorToast(message) {
  showToast(message, "error", 5000);
}
