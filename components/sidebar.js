// components/sidebar.js

function renderSidebar(activePage) {
  const role = getRole();

  const nav = [
    {
      label: "Patients",
      href: "index.html",
      roles: ["admin", "staff", "viewer"],
      icon: "users",
    },
    {
      label: "Users",
      href: "users.html",
      roles: ["admin"],
      icon: "user-group",
    },
  ];

  // Only show links the current role can access
  const links = nav
    .filter((item) => item.roles.includes(role))
    .map(
      (item) => `
      <a href="${item.href}"
        class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium mb-1.5 transition-all duration-200 group
        ${
          activePage === item.label
            ? "bg-blue-50 text-blue-600 shadow-sm"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        }"
      >
        <svg class="w-5 h-5 ${activePage === item.label ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          ${item.icon === "users" ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>' : ""}
          ${item.icon === "user-group" ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>' : ""}
        </svg>
        ${item.label}
      </a>
    `,
    )
    .join("");

  document.getElementById("sidebar").innerHTML = `
    <aside class="w-64 bg-white shadow-lg min-h-screen flex flex-col fixed top-0 left-0 border-r border-gray-100">
      
      <!-- Logo Section -->
      <div class="px-6 py-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
          </div>
          <div>
            <h1 class="text-sm font-semibold text-gray-800">Patient Information</h1>
            <p class="text-xs text-gray-500">System</p>
          </div>
        </div>
      </div>

      <!-- User Info Section -->
      <div class="px-6 py-5 border-b border-gray-100 bg-gray-50/30">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
            <span class="text-white text-sm font-medium">${getUsername().charAt(0).toUpperCase()}</span>
          </div>
          <div class="flex-1">
            <p class="text-xs text-gray-500">Logged in as</p>
            <p class="text-sm font-semibold text-gray-800">${getUsername()}</p>
            <div class="flex items-center gap-1 mt-0.5">
              <span class="text-xs px-2 py-0.5 rounded-full ${
                role === "admin"
                  ? "bg-purple-100 text-purple-700"
                  : role === "staff"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
              } capitalize font-medium">${role}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 py-6 space-y-1">
        ${links}
      </nav>

      <!-- Logout Button -->
      <div class="px-4 py-4 border-t border-gray-100 bg-gray-50/20">
        <button
          onclick="logout()"
          class="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 group"
        >
          <svg class="w-5 h-5 text-red-500 group-hover:scale-105 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
          <span class="font-medium">Logout</span>
        </button>
      </div>

    </aside>
  `;
}
