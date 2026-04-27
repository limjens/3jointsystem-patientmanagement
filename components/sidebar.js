// components/sidebar.js

function renderSidebar(activePage) {
  const nav = [{ label: "Patients", href: "index.html" }];

  const links = nav
    .map(
      (item) => `
    <a href="${item.href}"
      class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium mb-1 transition
      ${
        activePage === item.label
          ? "bg-blue-50 text-blue-600"
          : "text-gray-600 hover:bg-gray-50"
      }"
    >
      ${item.label}
    </a>
  `,
    )
    .join("");

  document.getElementById("sidebar").innerHTML = `
    <aside class="w-56 bg-white shadow-md min-h-screen flex flex-col fixed top-0 left-0">

      <!-- Logo -->
      <div class="px-6 py-6 border-b border-gray-100">
        <h1 class="text-sm font-semibold text-gray-800">Patient Information</h1>
        <p class="text-xs text-gray-400">System</p>
      </div>

      <!-- User info -->
      <div class="px-6 py-4 border-b border-gray-100">
        <p class="text-xs text-gray-400">Logged in as</p>
        <p class="text-sm font-medium text-gray-700">${getUsername()}</p>
        <p class="text-xs text-blue-500 capitalize">${getRole()}</p>
      </div>

      <!-- Nav links -->
      <nav class="flex-1 px-4 py-4">
        ${links}
      </nav>

      <!-- Logout -->
      <div class="px-4 py-4 border-t border-gray-100">
        <button
          onclick="logout()"
          class="w-full text-left px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition"
        >
          Logout
        </button>
      </div>

    </aside>
  `;
}
