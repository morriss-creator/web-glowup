(function () {
  var form = document.getElementById("demo-form");
  var result = document.getElementById("demo-result");
  if (!form || !result) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var data = new FormData(form);
    result.hidden = false;
    result.textContent =
      "Sample only: nothing was sent. " +
      (data.get("name") || "Someone") +
      " would have asked for a table for " +
      (data.get("party") || "?") +
      " on " +
      (data.get("day") || "a day") +
      " at " +
      (data.get("time") || "a time") +
      ".";
  });
})();