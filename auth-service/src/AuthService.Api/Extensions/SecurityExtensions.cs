using Microsoft.AspNetCore.DataProtection;

namespace AuthService.Api.Extensions;

public static class SecurityExtensions
{
    private static readonly string[] DefaultAllowedOrigins = new[] {
        "http://localhost:3000",
        "http://localhost:3005",
        "https://localhost:3001",
        // Dev Vite addresses used by the frontend and Expo
        "http://localhost:5035",
        "http://127.0.0.1:5035",
        "http://192.168.1.34:5035",
        "http://10.0.2.2:5035"
    };
    private static readonly string[] DefaultAdminOrigins = ["https://admin.localhost"];
    private static readonly string[] AllowedHttpMethods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"];
    private static readonly string[] AdminHttpMethods = ["GET", "POST", "PUT", "DELETE"];
    private static readonly string[] AdminAllowedHeaders = ["Content-Type", "Authorization"];
    public static IServiceCollection AddSecurityPolicies(this IServiceCollection services, IConfiguration configuration)
    {
        // Configurar CORS
        services.AddCors(options =>
        {
            options.AddPolicy("DefaultCorsPolicy", builder =>
            {
                var allowedOrigins = configuration.GetSection("Security:AllowedOrigins").Get<string[]>()
                    ?? DefaultAllowedOrigins;

                builder.WithOrigins(allowedOrigins)
                       .AllowAnyHeader()
                       .WithMethods(AllowedHttpMethods)
                       .AllowCredentials()
                       .SetPreflightMaxAge(TimeSpan.FromMinutes(10));
            });

            // Política restrictiva para endpoints administrativos
            options.AddPolicy("AdminCorsPolicy", builder =>
            {
                var adminOrigins = configuration.GetSection("Security:AdminAllowedOrigins").Get<string[]>()
                    ?? DefaultAdminOrigins;

                builder.WithOrigins(adminOrigins)
                       .WithHeaders(AdminAllowedHeaders)
                       .WithMethods(AdminHttpMethods)
                       .AllowCredentials();
            });
        });

        // Configurar Data Protection
        var keysDirectory = new DirectoryInfo("./keys");
        if (!keysDirectory.Exists)
        {
            keysDirectory.Create();
        }

        var dataProtectionBuilder = services.AddDataProtection()
                .PersistKeysToFileSystem(keysDirectory)
                .SetApplicationName("AuthDotnetApi")
                .SetDefaultKeyLifetime(TimeSpan.FromDays(90));

        // En producción, configurar encriptación con certificado
        var environment = services.BuildServiceProvider().GetRequiredService<IWebHostEnvironment>();
        if (environment.IsProduction())
        {
            // En producción deberías usar un certificado real
            // dataProtectionBuilder.ProtectKeysWithCertificate("thumbprint");
            if (OperatingSystem.IsWindows())
            {
                dataProtectionBuilder.ProtectKeysWithDpapi();
            }
            // En Linux/macOS en producción, usar certificados o Azure Key Vault
        }
        else
        {
            // En desarrollo, usar DPAPI (solo Windows) o sin encriptación
            if (OperatingSystem.IsWindows())
            {
                dataProtectionBuilder.ProtectKeysWithDpapi();
            }
            // En Linux/macOS en desarrollo, las claves no se encriptan (solo para desarrollo)
        }

        // Configurar Antiforgery (CSRF Protection)
        services.AddAntiforgery(options =>
        {
            options.HeaderName = "X-CSRF-TOKEN";
            options.SuppressXFrameOptionsHeader = false;
            options.Cookie.Name = "__RequestVerificationToken";
            options.Cookie.HttpOnly = true;
            options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
            options.Cookie.SameSite = SameSiteMode.Strict;
        });

        return services;
    }

    public static IServiceCollection AddSecurityOptions(this IServiceCollection services)
    {
        services.Configure<CookiePolicyOptions>(options =>
        {
            options.CheckConsentNeeded = context => true;
            options.MinimumSameSitePolicy = SameSiteMode.Strict;
            options.HttpOnly = Microsoft.AspNetCore.CookiePolicy.HttpOnlyPolicy.Always;
            options.Secure = CookieSecurePolicy.SameAsRequest;
        });

        return services;
    }
}

