using System;
using System.IO;
using System.Net;
using System.Text;
using System.Diagnostics;
using System.Threading;

namespace CourtPlatform
{
    class Program
    {
        private static readonly string EmbeddedHtml = @""" + html_escaped + @""";

        static void Main(string[] args)
        {
            Console.Title = "Smart Court Case Management Platform - Server Launcher";
            Console.OutputEncoding = Encoding.UTF8;

            int port = 5000;
            string url = "http://localhost:" + port + "/";
            string ipUrl = "http://127.0.0.1:" + port + "/";

            HttpListener listener = new HttpListener();
            bool started = false;

            while (!started && port <= 5010)
            {
                try
                {
                    url = "http://localhost:" + port + "/";
                    ipUrl = "http://127.0.0.1:" + port + "/";
                    listener = new HttpListener();
                    listener.Prefixes.Add(url);
                    listener.Prefixes.Add(ipUrl);
                    listener.Start();
                    started = true;
                }
                catch
                {
                    port++;
                }
            }

            if (!started)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine("[!] Unable to bind HttpListener to ports 5000-5010. Please check port usage.");
                Console.ResetColor();
                Console.WriteLine("Press any key to exit...");
                Console.ReadKey();
                return;
            }

            Console.Clear();
            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.WriteLine("================================================================================");
            Console.WriteLine("          ⚖️ SMART COURT CASE MANAGEMENT & JUDICIAL ANALYTICS PLATFORM          ");
            Console.WriteLine("                     Software Engineering Assignment Implementation             ");
            Console.WriteLine("================================================================================");
            Console.ResetColor();
            Console.WriteLine();
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("  [✓] Server is active and listening on port " + port + "!");
            Console.ResetColor();
            Console.WriteLine();
            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine("  ========================================================================");
            Console.WriteLine("  🚀 COPY AND PASTE THIS IP / URL INTO YOUR WEB BROWSER TO OPEN IMPLEMENTATION:");
            Console.WriteLine();
            Console.ForegroundColor = ConsoleColor.White;
            Console.WriteLine("     👉 " + url);
            Console.WriteLine("     👉 " + ipUrl);
            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine("  ========================================================================");
            Console.ResetColor();
            Console.WriteLine();
            Console.ForegroundColor = ConsoleColor.DarkGray;
            Console.WriteLine("  ℹ️  The implementation will also automatically launch in your browser.");
            Console.WriteLine("  ℹ️  Keep this console window open while using the application.");
            Console.WriteLine("  ℹ️  Press Ctrl+C or close this window to stop the server.");
            Console.WriteLine("================================================================================");
            Console.ResetColor();

            // Auto-open browser
            try
            {
                Process.Start(new ProcessStartInfo
                {
                    FileName = url,
                    UseShellExecute = true
                });
            }
            catch { }

            while (true)
            {
                try
                {
                    HttpListenerContext context = listener.GetContext();
                    HttpListenerRequest request = context.Request;
                    HttpListenerResponse response = context.Response;

                    string htmlToServe = GetCurrentHtml();
                    byte[] buffer = Encoding.UTF8.GetBytes(htmlToServe);

                    response.ContentType = "text/html; charset=utf-8";
                    response.ContentLength64 = buffer.Length;
                    Stream output = response.OutputStream;
                    output.Write(buffer, 0, buffer.Length);
                    output.Close();

                    Console.ForegroundColor = ConsoleColor.DarkGray;
                    Console.WriteLine("[" + DateTime.Now.ToString("HH:mm:ss") + "] Served request to browser -> " + request.RawUrl);
                    Console.ResetColor();
                }
                catch (Exception)
                {
                    break;
                }
            }
        }

        static string GetCurrentHtml()
        {
            try
            {
                string localPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Launch_Implementation.html");
                if (File.Exists(localPath))
                {
                    return File.ReadAllText(localPath, Encoding.UTF8);
                }
            }
            catch { }
            return EmbeddedHtml;
        }
    }
}
