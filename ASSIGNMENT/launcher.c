#include <stdio.h>
#include <stdlib.h>
#include <windows.h>

int main() {
    SetConsoleTitle("Smart Court Case Management Platform Launcher");
    SetConsoleOutputCP(65001);

    system("cls");
    printf("================================================================================");
    printf("\n          ⚖️ SMART COURT CASE MANAGEMENT & JUDICIAL ANALYTICS PLATFORM          ");
    printf("\n                     Software Engineering Assignment Implementation             ");
    printf("\n================================================================================\n\n");

    printf("  [✓] Local Web Server active and listening on port 5000!\n\n");
    printf("  ========================================================================\n");
    printf("  🚀 COPY AND PASTE THIS IP / URL INTO YOUR WEB BROWSER TO OPEN IMPLEMENTATION:\n\n");
    printf("     👉 http://localhost:5000/\n");
    printf("     👉 http://127.0.0.1:5000/\n");
    printf("  ========================================================================\n\n");
    printf("  ℹ️  The implementation browser window will also open automatically.\n");
    printf("  ℹ️  Keep this console window running while using the application.\n");
    printf("  ℹ️  Press Ctrl+C or close this window to exit the server.\n");
    printf("================================================================================\n\n");

    // Auto-launch default browser
    ShellExecuteA(NULL, "open", "http://localhost:5000/", NULL, NULL, SW_SHOWNORMAL);

    // Change directory to ASSIGNMENT if executed from root, then run server
    SetCurrentDirectory("ASSIGNMENT");
    system("python -m http.server 5000");

    return 0;
}
