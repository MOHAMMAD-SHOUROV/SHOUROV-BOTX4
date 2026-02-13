async function loadCommands() {
    try {

        const res = await fetch("/api/commands");
        const data = await res.json();

        const container = document.getElementById("cmds");
        container.innerHTML = "";

        data.forEach(cmd => {

            const div = document.createElement("div");
            div.className = "cmd";

            div.innerHTML = `
                <span>${cmd.name}</span>
                <label>
                    <input type="checkbox" ${cmd.enabled ? "checked" : ""}
                        onchange="toggleCommand('${cmd.name}', this.checked)">
                    ${cmd.enabled ? "Enabled" : "Disabled"}
                </label>
            `;

            container.appendChild(div);
        });

    } catch (err) {
        document.getElementById("error").innerText = "Failed to load commands.";
    }
}

async function toggleCommand(name, enabled) {
    try {

        await fetch("/api/toggle-command", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, enabled })
        });

    } catch (err) {
        alert("Toggle failed");
    }
}

loadCommands();