FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

COPY ./src/AuthService.Api/AuthService.Api.csproj ./src/AuthService.Api/
COPY ./src/AuthService.Application/AuthService.Application.csproj ./src/AuthService.Application/
COPY ./src/AuthService.Domain/AuthService.Domain.csproj ./src/AuthService.Domain/
COPY ./src/AuthService.Persistence/AuthService.Persistence.csproj ./src/AuthService.Persistence/

RUN dotnet restore ./src/AuthService.Api/AuthService.Api.csproj

COPY ./src ./src
WORKDIR /app/src/AuthService.Api
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:5000
EXPOSE 5000
ENTRYPOINT ["dotnet", "AuthService.Api.dll"]
