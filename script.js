function changeColor() {
    const colors = ["#ffcccb", "#a0e7e5", "#b4f8c8", "#f6e58d"];
    document.body.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
}
