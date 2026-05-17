# =============================================================================
# push-github.ps1
# Script para criar o repositório no GitHub e publicar o projeto
#
# Como usar:
#   1. Abra o PowerShell como Administrador (ou normal)
#   2. Navegue até a pasta do projeto:
#      cd "C:\Bobello\A.Bobello\Trabalho Antônio Bobello\sistema-gestao-curriculos"
#   3. Execute: .\push-github.ps1
# =============================================================================

$ErrorActionPreference = "Stop"

# --- Configurações do projeto ---
$GitHubUser     = "antoniobobello2009-lgtm"
$GitHubEmail    = "antonio.bobello.2009@gmail.com"
$GitHubPassword = "ALCB2009Bobell@"
$RepoName       = "sistema-gestao-curriculos"
$RepoDesc       = "Trabalho 2 - Sistema de Gestão de Currículos com Next.js 14, React Hook Form, Yup e shadcn/ui"

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "  Sistema de Gestão de Currículos - GitHub  " -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# --- Verificar se git está instalado ---
try {
    $gitVersion = git --version
    Write-Host "[OK] Git encontrado: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERRO] Git não encontrado. Instale em: https://git-scm.com/download/win" -ForegroundColor Red
    exit 1
}

# --- Configurar identidade git ---
Write-Host ""
Write-Host "[1/4] Configurando identidade git..." -ForegroundColor Yellow
git config user.name  $GitHubUser
git config user.email $GitHubEmail
Write-Host "      Nome:  $GitHubUser" -ForegroundColor Gray
Write-Host "      Email: $GitHubEmail" -ForegroundColor Gray
Write-Host "[OK] Identidade configurada." -ForegroundColor Green

# --- Criar repositório no GitHub via API ---
Write-Host ""
Write-Host "[2/4] Criando repositório no GitHub..." -ForegroundColor Yellow

$base64Auth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${GitHubEmail}:${GitHubPassword}"))
$headers = @{
    Authorization  = "Basic $base64Auth"
    "Content-Type" = "application/json"
    Accept         = "application/vnd.github.v3+json"
}
$body = @{
    name        = $RepoName
    description = $RepoDesc
    private     = $false
    auto_init   = $false
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod `
        -Uri "https://api.github.com/user/repos" `
        -Method POST `
        -Headers $headers `
        -Body $body `
        -TimeoutSec 30

    Write-Host "[OK] Repositório criado: $($response.html_url)" -ForegroundColor Green
    $repoUrl = $response.clone_url

} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 422) {
        # 422 = repositório já existe
        Write-Host "[OK] Repositório já existe no GitHub, continuando..." -ForegroundColor Yellow
        $repoUrl = "https://github.com/$GitHubUser/$RepoName.git"
    } elseif ($statusCode -eq 401) {
        Write-Host "[AVISO] Autenticação Basic não suportada pela API." -ForegroundColor Yellow
        Write-Host "        Abrindo GitHub para criar o repositório manualmente..." -ForegroundColor Yellow
        Start-Process "https://github.com/new"
        Write-Host ""
        Write-Host "  -> Crie o repositório com o nome: $RepoName" -ForegroundColor Cyan
        Write-Host "  -> Deixe 'Initialize this repository' DESMARCADO" -ForegroundColor Cyan
        Write-Host "  -> Clique em 'Create repository'" -ForegroundColor Cyan
        Write-Host ""
        Read-Host "  Pressione ENTER após criar o repositório no navegador"
        $repoUrl = "https://github.com/$GitHubUser/$RepoName.git"
    } else {
        Write-Host "[AVISO] Erro ao criar repositório (HTTP $statusCode). Tentando continuar..." -ForegroundColor Yellow
        $repoUrl = "https://github.com/$GitHubUser/$RepoName.git"
    }
}

# --- Configurar remote origin ---
Write-Host ""
Write-Host "[3/4] Configurando remote origin..." -ForegroundColor Yellow

# Usar HTTPS com credenciais embutidas na URL para autenticação automática
$encodedPassword = [Uri]::EscapeDataString($GitHubPassword)
$repoUrlWithAuth = "https://${GitHubUser}:${encodedPassword}@github.com/$GitHubUser/$RepoName.git"

# Verificar se remote já existe e remover
$remoteExists = git remote 2>&1 | Where-Object { $_ -eq "origin" }
if ($remoteExists) {
    git remote remove origin
    Write-Host "      Remote origin anterior removido." -ForegroundColor Gray
}

git remote add origin $repoUrlWithAuth
Write-Host "[OK] Remote origin configurado." -ForegroundColor Green

# --- Fazer push ---
Write-Host ""
Write-Host "[4/4] Fazendo push para o GitHub..." -ForegroundColor Yellow
Write-Host "      Branch: master -> origin/master" -ForegroundColor Gray

try {
    git push -u origin master 2>&1 | ForEach-Object { Write-Host "      $_" -ForegroundColor Gray }
    Write-Host ""
    Write-Host "=============================================" -ForegroundColor Green
    Write-Host "  [SUCESSO] Código publicado no GitHub!     " -ForegroundColor Green
    Write-Host "=============================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "  Repositório: https://github.com/$GitHubUser/$RepoName" -ForegroundColor Cyan
    Write-Host ""
} catch {
    Write-Host ""
    Write-Host "[ERRO] Falha no push: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "  Tente autenticar manualmente executando:" -ForegroundColor Yellow
    Write-Host "    git remote set-url origin https://github.com/$GitHubUser/$RepoName.git" -ForegroundColor Cyan
    Write-Host "    git push -u origin master" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  Quando solicitado, use:" -ForegroundColor Yellow
    Write-Host "    Username: $GitHubUser" -ForegroundColor Cyan
    Write-Host "    Password: (Personal Access Token do GitHub)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  Para gerar um token: https://github.com/settings/tokens/new" -ForegroundColor Cyan
}

# --- Remover credenciais da URL do remote (segurança) ---
git remote set-url origin "https://github.com/$GitHubUser/$RepoName.git" 2>$null

Write-Host ""
Write-Host "Pressione qualquer tecla para fechar..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
